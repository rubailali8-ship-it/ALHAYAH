"""Fetch fundamentals from the REST API, with a local on-disk cache.

Every successful raw response is written to cache/<provider>/<SYMBOL>.json.
Re-runs read from the cache until it is older than cache_ttl_days, so you
only pay API credits once per stock per TTL window. Errors are never cached.
"""
from __future__ import annotations

import json
import re
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Callable, Iterator
from urllib.parse import quote

from .config import ApiConfig
from .models import FINANCIAL_FIELDS, CompanyFinancials

DEFAULT_CACHE_DIR = Path(__file__).resolve().parent.parent / "cache"

_SEGMENT = re.compile(r"([^.\[\]]+)|\[([^\]]+)\]")
_MISSING_TOKENS = {"", "-", "--", "na", "n/a", "nan", "none", "null"}


# --------------------------------------------------------------------------
# JSON path resolution  (a.b[0].c[key=TotalDebt].value)
# --------------------------------------------------------------------------
def resolve_path(data: Any, path: str) -> Any:
    cur = data
    for name, bracket in _SEGMENT.findall(path):
        if cur is None:
            return None
        if name:
            cur = cur.get(name) if isinstance(cur, dict) else None
        elif bracket.lstrip("-").isdigit():
            idx = int(bracket)
            cur = cur[idx] if isinstance(cur, list) and -len(cur) <= idx < len(cur) else None
        elif "=" in bracket:
            k, v = bracket.split("=", 1)
            cur = next(
                (i for i in cur if isinstance(i, dict) and str(i.get(k)).lower() == v.lower()), None
            ) if isinstance(cur, list) else None
        else:
            return None
    return cur


_OPERATOR = re.compile(r"\s+([*/])\s+")


def evaluate(data: Any, expr: str) -> Any:
    """Resolve a path, or 'path * path / path' arithmetic (left to right)."""
    parts = _OPERATOR.split(expr.strip())
    if len(parts) == 1:
        return resolve_path(data, parts[0])
    total = to_number(resolve_path(data, parts[0]))
    for op, operand in zip(parts[1::2], parts[2::2]):
        n = to_number(resolve_path(data, operand))
        if total is None or n is None or (op == "/" and n == 0):
            return None
        total = total * n if op == "*" else total / n
    return total


def first_value(data: Any, paths: list[str]) -> Any:
    for p in paths:
        v = evaluate(data, p)
        if v is not None and not (isinstance(v, str) and v.strip().lower() in _MISSING_TOKENS):
            return v
    return None


def to_number(value: Any) -> float | None:
    """Parse API numbers like 1234, '1,23,456.7', '(12.5)'. Junk -> None."""
    if value is None or isinstance(value, bool):
        return None
    if isinstance(value, (int, float)):
        return float(value)
    s = str(value).strip().replace(",", "")
    if s.lower() in _MISSING_TOKENS:
        return None
    neg = s.startswith("(") and s.endswith(")")
    try:
        n = float(s.strip("()"))
    except ValueError:
        return None
    return -n if neg else n


def iter_leaf_paths(data: Any, prefix: str = "") -> Iterator[tuple[str, Any]]:
    """Yield (path, value) for every scalar, using [key=X] for keyed lists."""
    if isinstance(data, dict):
        for k, v in data.items():
            yield from iter_leaf_paths(v, f"{prefix}.{k}" if prefix else k)
    elif isinstance(data, list):
        seen: set[tuple[str, str]] = set()
        for i, item in enumerate(data):
            seg = f"[{i}]"
            # Prefer a stable filter ([key=X]) over a positional index, but only
            # for the first item carrying that value - that's what resolve_path picks.
            if isinstance(item, dict):
                for k in ("key", "Type", "consolidation_type"):
                    v = item.get(k)
                    if isinstance(v, str) and (k, v) not in seen:
                        seen.add((k, v))
                        seg = f"[{k}={v}]"
                        break
            yield from iter_leaf_paths(item, prefix + seg)
    else:
        yield prefix, data


# --------------------------------------------------------------------------
# Fetcher
# --------------------------------------------------------------------------
class DataFetcher:
    def __init__(
        self,
        api: ApiConfig,
        api_key: str | None,
        cache_dir: Path = DEFAULT_CACHE_DIR,
        offline: bool = False,
        refresh: bool = False,
        http_get: Callable[..., Any] | None = None,
        sleep: Callable[[float], None] = time.sleep,
    ):
        self.api = api
        self.api_key = api_key
        self.cache_dir = Path(cache_dir) / api.name
        self.offline = offline
        self.refresh = refresh
        self._sleep = sleep
        self._live_calls = 0
        self.quota_exhausted = False
        if http_get is None:
            import requests
            http_get = requests.get
        self._http_get = http_get

    # -- cache ------------------------------------------------------------
    # One file per (symbol, endpoint): cache/<provider>/<SYMBOL>/<endpoint>.json
    def _safe(self, symbol: str) -> str:
        return re.sub(r"[^A-Za-z0-9_-]", "_", symbol.upper())

    def cache_path(self, symbol: str, endpoint: str) -> Path:
        return self.cache_dir / self._safe(symbol) / f"{endpoint}.json"

    def _read_cache(self, symbol: str, endpoint: str) -> dict | None:
        p = self.cache_path(symbol, endpoint)
        if not p.exists():
            return None
        entry = json.loads(p.read_text(encoding="utf-8"))
        fetched = datetime.fromisoformat(entry["fetched_at"])
        expired = datetime.now(timezone.utc) - fetched > timedelta(days=self.api.cache_ttl_days)
        if expired and not self.offline:  # offline mode uses stale cache on purpose
            return None
        return entry

    def _write_cache(self, symbol: str, endpoint: str, data: Any) -> dict:
        entry = {
            "symbol": symbol,
            "endpoint": endpoint,
            "fetched_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "data": data,
        }
        p = self.cache_path(symbol, endpoint)
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(json.dumps(entry, indent=2), encoding="utf-8")
        return entry

    # -- network ----------------------------------------------------------
    def _fetch_endpoint(self, symbol: str, endpoint: str) -> dict:
        if not self.refresh:
            cached = self._read_cache(symbol, endpoint)
            if cached:
                return cached
        if self.offline:
            raise RuntimeError(f"{endpoint}: not in cache (offline mode)")
        if not self.api_key:
            raise RuntimeError("DATA_API_KEY not set (check your .env file)")
        if self.quota_exhausted:
            raise RuntimeError("daily API quota reached earlier in this run; rerun tomorrow (cache keeps progress)")

        spec = self.api.endpoints[endpoint]
        if self._live_calls:
            self._sleep(self.api.request_delay_seconds)
        self._live_calls += 1
        resp = self._http_get(
            self.api.base_url + spec["path"].format(symbol=quote(symbol, safe="")),
            params=spec["params"],
            headers={self.api.auth_header: self.api_key, "Accept": "application/json"},
            timeout=self.api.timeout_seconds,
        )
        if resp.status_code == 429:
            self.quota_exhausted = True
            raise RuntimeError("HTTP 429 rate limit / daily quota reached; rerun tomorrow")
        if resp.status_code == 401:
            raise RuntimeError("HTTP 401: API key rejected (check DATA_API_KEY)")
        if resp.status_code != 200:
            raise RuntimeError(f"{endpoint}: HTTP {resp.status_code}: {resp.text[:200]}")
        data = resp.json()
        if not data or (isinstance(data, dict) and data.get("error")):
            raise RuntimeError(f"{endpoint}: empty/error payload: {str(data)[:200]}")
        return self._write_cache(symbol, endpoint, data)

    def fetch_raw(self, symbol: str) -> dict:
        """Return {"fetched_at": oldest timestamp, "data": {endpoint: payload}}.

        Raises on the first endpoint that fails; endpoints that succeeded stay
        cached so a rerun doesn't pay for them again.
        """
        entries = {ep: self._fetch_endpoint(symbol, ep) for ep in self.api.endpoints}
        return {
            "fetched_at": min(e["fetched_at"] for e in entries.values()),
            "data": {ep: e["data"] for ep, e in entries.items()},
        }

    # -- mapping ----------------------------------------------------------
    def extract(self, symbol: str, entry: dict, fallback_company: str | None = None) -> CompanyFinancials:
        data, f = entry["data"], self.api.fields

        def text(name: str) -> str | None:
            v = first_value(data, f.get(name, []))
            return str(v).strip() if v is not None else None

        fin = CompanyFinancials(
            symbol=symbol,
            company=text("company") or fallback_company,
            sector=text("sector"),
            industry=text("industry"),
            data_date=text("data_date"),
            fetched_at=entry.get("fetched_at"),
        )
        for name in FINANCIAL_FIELDS:
            n = to_number(first_value(data, f.get(name, [])))
            if n is not None:
                n *= self.api.units.get(name, 1.0)
            setattr(fin, name, n)
        return fin

    def get_financials(self, symbol: str, company: str | None = None) -> CompanyFinancials:
        try:
            entry = self.fetch_raw(symbol)
        except Exception as exc:  # network, auth, JSON, offline miss
            return CompanyFinancials(symbol=symbol, company=company, fetch_error=str(exc))
        return self.extract(symbol, entry, fallback_company=company)
