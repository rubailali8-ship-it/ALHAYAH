"""Screening logic tests using hand-made companies.

Thresholds: debt 30%, cash 30%, income 5%, doubtful margin 2pp.
All money in the same unit (say Rs crore); market cap 1000 unless noted, so
debt=250 means 25% debt/mcap.
"""
import pytest

from screener.config import ScreeningConfig, load_screening_config
from screener.models import CompanyFinancials, Verdict
from screener.screening import CASH, DEBT, INCOME, evaluate_ratio, screen_business, screen_company


@pytest.fixture
def cfg():
    return ScreeningConfig(
        blacklist={
            "conventional_finance": ["bank", "nbfc", "insurance"],
            "alcohol": ["brewer", "liquor", "spirits"],
            "tobacco": ["tobacco", "cigarette"],
            "weapons": ["weapon", "arms & ammunition"],
        },
        symbol_overrides={
            "ITC": {"business": "FAIL", "reason": "tobacco segment"},
            "SAFEBANKCO": {"business": "PASS", "reason": "keyword false positive"},
        },
    )


def company(symbol="CLEANCO", sector="Information Technology", industry="IT Services",
            mcap=1000.0, debt=50.0, cash=100.0, revenue=500.0, interest=5.0):
    return CompanyFinancials(
        symbol=symbol, company=f"{symbol} Ltd", sector=sector, industry=industry,
        market_cap=mcap, total_debt=debt, cash_and_interest_investments=cash,
        total_revenue=revenue, interest_income=interest, data_date="2026-03-31",
    )


# --- clean pass ------------------------------------------------------------
def test_clean_it_company_is_halal(cfg):
    r = screen_company(company(), cfg)  # debt 5%, cash 10%, income 1%
    assert r.verdict is Verdict.HALAL
    assert r.ratio(DEBT).value_pct == pytest.approx(5.0)
    assert r.ratio(CASH).value_pct == pytest.approx(10.0)
    assert r.ratio(INCOME).value_pct == pytest.approx(1.0)
    assert all(x.passed and not x.borderline for x in r.ratios)


# --- business screen ---------------------------------------------------------
@pytest.mark.parametrize("sector,industry", [
    ("Financial Services", "Private Sector Bank"),
    ("Financials", "Life Insurance"),
    ("Consumer Staples", "Breweries & Distilleries"),
    ("Aerospace & Defense", "Arms & Ammunition"),
])
def test_blacklisted_sectors_are_not_halal_even_with_perfect_ratios(cfg, sector, industry):
    r = screen_company(company(sector=sector, industry=industry), cfg)
    assert r.business_passed is False
    assert r.verdict is Verdict.NOT_HALAL


def test_keyword_matches_word_start_only(cfg):
    # "arms" inside "Pharmaceuticals" / "Farms" must not trigger weapons;
    # "bank" inside "Databank" must not trigger banking.
    for industry in ("Pharmaceuticals", "Poultry Farms", "Databank Analytics"):
        passed, _ = screen_business(company(industry=industry, sector="Misc"), cfg)
        assert passed is True, industry


def test_override_fail_beats_innocent_sector_label(cfg):
    r = screen_company(company(symbol="ITC", sector="FMCG", industry="Diversified FMCG"), cfg)
    assert r.verdict is Verdict.NOT_HALAL
    assert "tobacco" in r.business_reason


def test_override_pass_clears_false_positive_but_ratios_still_apply(cfg):
    r = screen_company(company(symbol="SAFEBANKCO", industry="Bank Software", debt=400.0), cfg)
    assert r.business_passed is True
    assert r.verdict is Verdict.NOT_HALAL  # 40% debt


def test_blacklisted_company_with_missing_financials_is_still_not_halal(cfg):
    fin = company(industry="Public Sector Bank", debt=None, cash=None)
    assert screen_company(fin, cfg).verdict is Verdict.NOT_HALAL


# --- ratio screens: clear fails ------------------------------------------------
@pytest.mark.parametrize("kwargs,rule", [
    ({"debt": 400.0}, DEBT),         # 40% debt
    ({"cash": 450.0}, CASH),         # 45% cash
    ({"interest": 50.0}, INCOME),    # 10% interest income
])
def test_clear_ratio_failure_is_not_halal(cfg, kwargs, rule):
    r = screen_company(company(**kwargs), cfg)
    assert r.verdict is Verdict.NOT_HALAL
    assert r.ratio(rule).passed is False and not r.ratio(rule).borderline


# --- doubtful band -----------------------------------------------------------
@pytest.mark.parametrize("kwargs,rule,expected_pass", [
    ({"debt": 290.0}, DEBT, True),      # 29%   just under 30 -> borderline pass
    ({"debt": 310.0}, DEBT, False),     # 31%   just over     -> borderline fail
    ({"debt": 320.0}, DEBT, False),     # 32%   exactly +2pp  -> still borderline
    ({"debt": 280.0}, DEBT, True),      # 28%   exactly -2pp  -> still borderline
    ({"cash": 300.0}, CASH, False),     # 30.0% equals threshold -> FAILS (< rule) but borderline
    ({"interest": 20.0}, INCOME, True), # 4%   of revenue
    ({"interest": 32.5}, INCOME, False),# 6.5% of revenue
])
def test_within_two_points_is_doubtful(cfg, kwargs, rule, expected_pass):
    r = screen_company(company(**kwargs), cfg)
    assert r.verdict is Verdict.DOUBTFUL
    assert r.ratio(rule).borderline
    assert r.ratio(rule).passed is expected_pass


def test_just_outside_band_is_clean(cfg):
    assert screen_company(company(debt=279.0), cfg).verdict is Verdict.HALAL      # 27.9%
    assert screen_company(company(debt=321.0), cfg).verdict is Verdict.NOT_HALAL  # 32.1%


def test_clear_fail_outranks_doubtful(cfg):
    # debt borderline (31%) but income clearly failing (12%) -> NOT_HALAL
    r = screen_company(company(debt=310.0, interest=60.0), cfg)
    assert r.verdict is Verdict.NOT_HALAL


# --- data missing ------------------------------------------------------------
@pytest.mark.parametrize("field", ["mcap", "debt", "cash", "revenue", "interest"])
def test_any_missing_financial_field_is_data_missing(cfg, field):
    r = screen_company(company(**{field: None}), cfg)
    assert r.verdict is Verdict.DATA_MISSING
    assert any("missing" in n for n in r.notes)


def test_missing_sector_is_data_missing(cfg):
    r = screen_company(company(sector=None, industry=None), cfg)
    assert r.verdict is Verdict.DATA_MISSING


def test_zero_market_cap_is_data_missing_not_crash(cfg):
    assert screen_company(company(mcap=0.0), cfg).verdict is Verdict.DATA_MISSING


def test_fetch_error_is_data_missing():
    fin = CompanyFinancials(symbol="X", fetch_error="HTTP 500")
    r = screen_company(fin, load_screening_config())
    assert r.verdict is Verdict.DATA_MISSING


# --- helpers & shipped config ----------------------------------------------
def test_evaluate_ratio_handles_bad_denominator():
    assert evaluate_ratio("x", 1.0, None, 30, 2).passed is None
    assert evaluate_ratio("x", 1.0, -5.0, 30, 2).passed is None


def test_shipped_config_loads_and_flags_known_nifty_names():
    cfg = load_screening_config()
    assert cfg.debt_threshold == 30.0 and cfg.income_threshold == 5.0
    assert cfg.doubtful_margin == 2.0
    for sym in ("ITC", "BAJFINANCE", "JIOFIN"):
        assert cfg.symbol_overrides[sym]["business"] == "FAIL"
    passed, reason = screen_business(company(symbol="HDFCBANK", sector="Financial Services",
                                             industry="Private Sector Bank"), cfg)
    assert passed is False and "conventional_finance" in reason
