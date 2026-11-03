"""Plain data containers shared by fetching, screening and output."""
from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum


class Verdict(str, Enum):
    HALAL = "HALAL"
    NOT_HALAL = "NOT_HALAL"
    DOUBTFUL = "DOUBTFUL"
    DATA_MISSING = "DATA_MISSING"


# Money fields every stock needs for the ratio screens.
FINANCIAL_FIELDS = (
    "market_cap",
    "total_debt",
    "cash_and_interest_investments",
    "total_revenue",
    "interest_income",
)


@dataclass
class CompanyFinancials:
    symbol: str
    company: str | None = None
    sector: str | None = None
    industry: str | None = None
    market_cap: float | None = None
    total_debt: float | None = None
    cash_and_interest_investments: float | None = None
    total_revenue: float | None = None
    interest_income: float | None = None
    data_date: str | None = None      # financial period end, from the provider
    fetched_at: str | None = None     # when we pulled it (cache timestamp)
    fetch_error: str | None = None


@dataclass
class RuleResult:
    name: str
    value_pct: float | None      # None when it could not be computed
    threshold_pct: float
    passed: bool | None          # None = not evaluated (data missing)
    borderline: bool = False     # within doubtful margin of threshold


@dataclass
class ScreeningResult:
    financials: CompanyFinancials
    business_passed: bool | None
    business_reason: str
    ratios: list[RuleResult]
    verdict: Verdict
    notes: list[str] = field(default_factory=list)

    def ratio(self, name: str) -> RuleResult:
        return next(r for r in self.ratios if r.name == name)
