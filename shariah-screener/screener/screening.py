"""Pure AAOIFI screening logic. No I/O here, so it is trivially unit-testable."""
from __future__ import annotations

import re

from .config import ScreeningConfig
from .models import FINANCIAL_FIELDS, CompanyFinancials, RuleResult, ScreeningResult, Verdict

DEBT = "debt_to_market_cap"
CASH = "cash_to_market_cap"
INCOME = "impermissible_income_to_revenue"


def screen_business(fin: CompanyFinancials, cfg: ScreeningConfig) -> tuple[bool | None, str]:
    """Return (passed, reason). passed is None when there is no sector data."""
    override = cfg.symbol_overrides.get(fin.symbol.upper())
    if override:
        return override["business"] == "PASS", f"override: {override['reason']}"

    text = " ".join(t for t in (fin.sector, fin.industry) if t).lower()
    if not text.strip():
        return None, "sector/industry missing"

    for category, keywords in cfg.blacklist.items():
        for kw in keywords:
            # Match at the start of a word: "bank" hits "banks", not "databank".
            if re.search(r"(?<![a-z0-9])" + re.escape(kw), text):
                return False, f"{category} (matched '{kw}')"
    return True, "no blacklisted activity in sector/industry"


def evaluate_ratio(
    name: str,
    numerator: float | None,
    denominator: float | None,
    threshold: float,
    margin: float,
) -> RuleResult:
    """Compute numerator/denominator as a percentage and grade it.

    Rule is ratio < threshold. Anything within `margin` percentage points of
    the threshold (inclusive, either side) is flagged borderline.
    """
    if numerator is None or denominator is None or denominator <= 0:
        return RuleResult(name, None, threshold, None)
    pct = numerator / denominator * 100.0
    passed = pct < threshold
    borderline = abs(pct - threshold) <= margin + 1e-9
    return RuleResult(name, pct, threshold, passed, borderline)


def screen_company(fin: CompanyFinancials, cfg: ScreeningConfig) -> ScreeningResult:
    notes: list[str] = []
    business_passed, business_reason = screen_business(fin, cfg)

    m = cfg.doubtful_margin
    ratios = [
        evaluate_ratio(DEBT, fin.total_debt, fin.market_cap, cfg.debt_threshold, m),
        evaluate_ratio(CASH, fin.cash_and_interest_investments, fin.market_cap, cfg.cash_threshold, m),
        evaluate_ratio(INCOME, fin.interest_income, fin.total_revenue, cfg.income_threshold, m),
    ]
    income = ratios[2]
    if cfg.income_is_upper_bound and income.passed is False and not income.borderline:
        # The proxy only overstates, so this fail isn't proven. Flag it, don't convict.
        income.borderline = True
        notes.append(
            f"income ratio {income.value_pct:.2f}% uses a broad proxy (e.g. other income); "
            "verify true interest income in the annual report"
        )

    missing = [f for f in FINANCIAL_FIELDS if getattr(fin, f) is None]
    if fin.fetch_error:
        notes.append(f"fetch error: {fin.fetch_error}")
    if missing:
        notes.append("missing: " + ", ".join(missing))
    for f in ("market_cap", "total_revenue"):
        v = getattr(fin, f)
        if v is not None and v <= 0:
            notes.append(f"{f} is non-positive ({v}); ratio not computable")

    def result(verdict: Verdict) -> ScreeningResult:
        return ScreeningResult(fin, business_passed, business_reason, ratios, verdict, notes)

    # A failed business screen is decisive on its own: no financial number can
    # rescue a bank or a brewer, so missing financials don't make it "unknown".
    if business_passed is False:
        return result(Verdict.NOT_HALAL)

    # Otherwise we refuse to guess: any gap -> DATA_MISSING.
    if business_passed is None or any(r.passed is None for r in ratios):
        if business_passed is None:
            notes.append("business screen not evaluable")
        return result(Verdict.DATA_MISSING)

    if any(not r.passed and not r.borderline for r in ratios):
        return result(Verdict.NOT_HALAL)
    if any(r.borderline for r in ratios):
        return result(Verdict.DOUBTFUL)
    return result(Verdict.HALAL)
