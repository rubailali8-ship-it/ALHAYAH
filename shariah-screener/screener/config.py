"""Load the user-editable TOML config files."""
from __future__ import annotations

import tomllib
from dataclasses import dataclass, field
from pathlib import Path

CONFIG_DIR = Path(__file__).resolve().parent.parent / "config"


@dataclass(frozen=True)
class ScreeningConfig:
    debt_threshold: float = 30.0
    cash_threshold: float = 30.0
    income_threshold: float = 5.0
    doubtful_margin: float = 2.0
    # Income field is a proxy that can only overstate impermissible income
    # (e.g. "other income"), so a failing income ratio can't be trusted as a clear fail.
    income_is_upper_bound: bool = False
    # category -> keywords, e.g. {"alcohol": ["brewer", "liquor"]}
    blacklist: dict[str, list[str]] = field(default_factory=dict)
    # SYMBOL -> {"business": "PASS"|"FAIL", "reason": str}
    symbol_overrides: dict[str, dict] = field(default_factory=dict)


@dataclass(frozen=True)
class ApiConfig:
    name: str
    base_url: str
    auth_header: str
    # endpoint key -> {"path": "/v1/stocks/{symbol}", "params": {...}}
    endpoints: dict[str, dict]
    timeout_seconds: float
    request_delay_seconds: float
    cache_ttl_days: float
    fields: dict[str, list[str]]
    units: dict[str, float]


def _read(path: Path) -> dict:
    with open(path, "rb") as fh:
        return tomllib.load(fh)


def load_screening_config(path: Path | None = None) -> ScreeningConfig:
    raw = _read(path or CONFIG_DIR / "screening.toml")
    t = raw.get("thresholds", {})
    overrides = {
        sym.upper(): {"business": str(v["business"]).upper(), "reason": v.get("reason", "manual override")}
        for sym, v in raw.get("symbol_overrides", {}).items()
    }
    for sym, v in overrides.items():
        if v["business"] not in ("PASS", "FAIL"):
            raise ValueError(f"symbol_overrides.{sym}.business must be PASS or FAIL")
    return ScreeningConfig(
        debt_threshold=float(t.get("debt_to_market_cap", 30.0)),
        cash_threshold=float(t.get("cash_to_market_cap", 30.0)),
        income_threshold=float(t.get("impermissible_income_to_revenue", 5.0)),
        doubtful_margin=float(t.get("doubtful_margin_pp", 2.0)),
        income_is_upper_bound=bool(raw.get("data_caveats", {}).get("impermissible_income_is_upper_bound", False)),
        blacklist={k: [str(w).lower() for w in v] for k, v in raw.get("business_blacklist", {}).items()},
        symbol_overrides=overrides,
    )


def load_api_config(path: Path | None = None) -> ApiConfig:
    raw = _read(path or CONFIG_DIR / "api.toml")
    a = raw["api"]
    return ApiConfig(
        name=a.get("name", "provider"),
        base_url=a["base_url"].rstrip("/"),
        auth_header=a["auth_header"],
        endpoints={
            k: {"path": v["path"], "params": dict(v.get("params", {}))}
            for k, v in raw["endpoints"].items()
        },
        timeout_seconds=float(a.get("timeout_seconds", 30)),
        request_delay_seconds=float(a.get("request_delay_seconds", 1.0)),
        cache_ttl_days=float(a.get("cache_ttl_days", 30)),
        fields={k: list(v) for k, v in raw.get("fields", {}).items()},
        units={k: float(v) for k, v in raw.get("units", {}).items()},
    )
