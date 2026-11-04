#!/usr/bin/env python3
"""CLI entry point: screen a stock universe and write results.csv."""
from __future__ import annotations

import argparse
import csv
import sys
from pathlib import Path

from screener.config import CONFIG_DIR, load_api_config, load_screening_config
from screener.data_fetcher import DEFAULT_CACHE_DIR, DataFetcher, iter_leaf_paths
from screener.env import get_api_key, load_env
from screener.output import print_summary, write_csv
from screener.screening import screen_company

HERE = Path(__file__).resolve().parent


def load_universe(path: Path) -> list[tuple[str, str]]:
    with open(path, newline="", encoding="utf-8") as fh:
        return [(r["symbol"].strip(), r.get("company", "").strip()) for r in csv.DictReader(fh) if r.get("symbol")]


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description="AAOIFI Shariah screener for Indian stocks")
    p.add_argument("--symbols", type=Path, default=CONFIG_DIR / "nifty50.csv", help="CSV with symbol,company")
    p.add_argument("--only", nargs="+", metavar="SYMBOL", help="screen just these symbols")
    p.add_argument("--output", type=Path, default=HERE / "results.csv")
    p.add_argument("--cache-dir", type=Path, default=DEFAULT_CACHE_DIR)
    p.add_argument("--refresh", action="store_true", help="ignore cache, re-fetch (costs credits)")
    p.add_argument("--offline", action="store_true", help="use cache only, never call the API")
    p.add_argument("--inspect", metavar="SYMBOL", help="print every JSON path in a cached response, then exit")
    args = p.parse_args(argv)
    # Windows consoles / redirected output may not be UTF-8; never crash on a symbol.
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(errors="replace")

    env_files = load_env(HERE / ".env")
    api_key = get_api_key()
    if not api_key and not args.offline:
        where = ", ".join(str(f) for f in env_files) or f"{HERE / '.env'} (not found)"
        print(f"WARNING: DATA_API_KEY not found. Looked in: {where}\n"
              "  The file should contain one line:  DATA_API_KEY=bsk_live_...", file=sys.stderr)
    api_cfg = load_api_config()
    fetcher = DataFetcher(
        api_cfg, api_key, cache_dir=args.cache_dir,
        offline=args.offline, refresh=args.refresh,
    )

    if args.inspect:
        try:
            entry = fetcher.fetch_raw(args.inspect)
        except Exception as exc:
            print(f"Could not load {args.inspect}: {exc}", file=sys.stderr)
            return 1
        for path, value in iter_leaf_paths(entry["data"]):
            print(f"{path} = {value!r}")
        fin = fetcher.extract(args.inspect, entry)
        print("\n# Mapped fields (what the screener will use):")
        for k in ("company", "sector", "industry", "market_cap", "total_debt",
                  "cash_and_interest_investments", "total_revenue", "interest_income", "data_date"):
            print(f"#   {k:<30} {getattr(fin, k)!r}")
        return 0

    cfg = load_screening_config()
    universe = load_universe(args.symbols)
    if args.only:
        wanted = {s.upper() for s in args.only}
        universe = [u for u in universe if u[0].upper() in wanted] or [(s, "") for s in args.only]

    results = []
    for i, (sym, name) in enumerate(universe, 1):
        print(f"[{i:>2}/{len(universe)}] {sym:<12}", end=" ", flush=True)
        res = screen_company(fetcher.get_financials(sym, name), cfg)
        print(res.verdict.value)
        results.append(res)

    write_csv(results, args.output)
    print_summary(results, args.output)
    return 0


if __name__ == "__main__":
    sys.exit(main())
