#!/usr/bin/env python3
"""CLI entry point: screen a stock universe and write results.csv."""
from __future__ import annotations

import argparse
import csv
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

from screener.config import CONFIG_DIR, load_api_config, load_screening_config
from screener.data_fetcher import DEFAULT_CACHE_DIR, DataFetcher, iter_leaf_paths
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

    load_dotenv(HERE / ".env")
    api_cfg = load_api_config()
    fetcher = DataFetcher(
        api_cfg, os.getenv("DATA_API_KEY"), cache_dir=args.cache_dir,
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
