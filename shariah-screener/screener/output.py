"""CSV writer and terminal summary."""
from __future__ import annotations

import csv
from collections import Counter
from pathlib import Path

from .models import RuleResult, ScreeningResult, Verdict
from .screening import CASH, DEBT, INCOME

COLUMNS = [
    "symbol", "company", "sector", "industry",
    "debt_to_mcap_pct", "cash_to_mcap_pct", "interest_income_to_revenue_pct",
    "business_screen", "business_reason",
    "debt_screen", "cash_screen", "income_screen",
    "borderline_rules", "final_verdict", "notes",
    "data_date", "fetched_at",
]


def _status(passed: bool | None) -> str:
    return "N/A" if passed is None else ("PASS" if passed else "FAIL")


def _pct(r: RuleResult) -> str:
    return "" if r.value_pct is None else f"{r.value_pct:.2f}"


def to_row(res: ScreeningResult) -> dict:
    fin = res.financials
    debt, cash, inc = res.ratio(DEBT), res.ratio(CASH), res.ratio(INCOME)
    return {
        "symbol": fin.symbol,
        "company": fin.company or "",
        "sector": fin.sector or "",
        "industry": fin.industry or "",
        "debt_to_mcap_pct": _pct(debt),
        "cash_to_mcap_pct": _pct(cash),
        "interest_income_to_revenue_pct": _pct(inc),
        "business_screen": _status(res.business_passed),
        "business_reason": res.business_reason,
        "debt_screen": _status(debt.passed),
        "cash_screen": _status(cash.passed),
        "income_screen": _status(inc.passed),
        "borderline_rules": ";".join(r.name for r in res.ratios if r.borderline),
        "final_verdict": res.verdict.value,
        "notes": " | ".join(res.notes),
        "data_date": fin.data_date or "",
        "fetched_at": fin.fetched_at or "",
    }


def write_csv(results: list[ScreeningResult], path: Path) -> None:
    with open(path, "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=COLUMNS)
        w.writeheader()
        for r in results:
            w.writerow(to_row(r))


def summarize(results: list[ScreeningResult]) -> Counter:
    return Counter(r.verdict for r in results)


def print_summary(results: list[ScreeningResult], csv_path: Path | None = None) -> None:
    counts = summarize(results)
    print(f"\nShariah screen (AAOIFI) - {len(results)} stocks")
    print("-" * 36)
    for v in Verdict:
        print(f"  {v.value:<13} {counts.get(v, 0):>4}")
    print("-" * 36)
    for v in (Verdict.DOUBTFUL, Verdict.DATA_MISSING):
        syms = [r.financials.symbol for r in results if r.verdict is v]
        if syms:
            print(f"  {v.value}: {', '.join(syms)}")
    if csv_path:
        print(f"\nFull results: {csv_path}")
