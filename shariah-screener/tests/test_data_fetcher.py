"""Fetcher tests: path mapping, number parsing, caching. No network."""
import json

import pytest

from screener.config import load_api_config
from screener.data_fetcher import DataFetcher, iter_leaf_paths, resolve_path, to_number

SAMPLE = {
    "companyName": "Tata Consultancy Services",
    "industry": "IT Services & Consulting",
    "companyProfile": {"mgSector": "Information Technology"},
    "keyMetrics": {"valuation": [{"key": "marketCap", "value": "13,50,000"}]},
    "financials": [
        {"Type": "Interim", "EndDate": "2026-09-30", "stockFinancialMap": {}},
        {"Type": "Annual", "EndDate": "2026-03-31", "stockFinancialMap": {
            "BAL": [{"key": "TotalDebt", "value": "9000"},
                    {"key": "CashandShortTermInvestments", "value": "45000"}],
            "INC": [{"key": "TotalRevenue", "value": "260000"},
                    {"key": "InterestIncomeNonBank", "value": "3500"}],
        }},
    ],
}


class FakeResp:
    def __init__(self, payload, status=200):
        self._p, self.status_code, self.text = payload, status, json.dumps(payload)

    def json(self):
        return self._p


class FakeHttp:
    def __init__(self, payload=SAMPLE, status=200):
        self.calls, self.payload, self.status = 0, payload, status

    def __call__(self, url, params, headers, timeout):
        self.calls += 1
        assert headers["X-Api-Key"] == "k"
        return FakeResp(self.payload, self.status)


def make(tmp_path, http, **kw):
    return DataFetcher(load_api_config(), "k", cache_dir=tmp_path, http_get=http, sleep=lambda s: None, **kw)


def test_resolve_path_variants():
    assert resolve_path(SAMPLE, "companyProfile.mgSector") == "Information Technology"
    assert resolve_path(SAMPLE, "financials[1].EndDate") == "2026-03-31"
    assert resolve_path(SAMPLE, "financials[Type=Annual].stockFinancialMap.BAL[key=TotalDebt].value") == "9000"
    assert resolve_path(SAMPLE, "financials[9].EndDate") is None
    assert resolve_path(SAMPLE, "nope.deeper[key=x]") is None


@pytest.mark.parametrize("raw,expected", [
    (12, 12.0), ("1,23,456.5", 123456.5), ("(250)", -250.0), ("-", None), ("NA", None), (None, None), ("abc", None),
])
def test_to_number(raw, expected):
    assert to_number(raw) == expected


def test_extract_maps_all_fields(tmp_path):
    fin = make(tmp_path, FakeHttp()).get_financials("TCS")
    assert fin.fetch_error is None
    assert fin.market_cap == 1_350_000
    assert fin.total_debt == 9000 and fin.cash_and_interest_investments == 45000
    assert fin.total_revenue == 260000 and fin.interest_income == 3500
    assert fin.sector == "Information Technology" and fin.data_date == "2026-03-31"


def test_cache_prevents_second_api_call(tmp_path):
    http = FakeHttp()
    make(tmp_path, http).get_financials("TCS")
    make(tmp_path, http).get_financials("TCS")
    assert http.calls == 1
    make(tmp_path, http, refresh=True).get_financials("TCS")
    assert http.calls == 2


def test_offline_without_cache_is_error_not_crash(tmp_path):
    http = FakeHttp()
    fin = make(tmp_path, http, offline=True).get_financials("TCS")
    assert http.calls == 0 and "offline" in fin.fetch_error


def test_http_errors_are_reported_and_not_cached(tmp_path):
    http = FakeHttp({"error": "quota"}, status=429)
    f = make(tmp_path, http)
    assert "429" in f.get_financials("TCS").fetch_error
    assert not f.cache_path("TCS").exists()


def test_symbol_with_ampersand_gets_safe_cache_name(tmp_path):
    assert make(tmp_path, FakeHttp()).cache_path("M&M").name == "M_M.json"


def test_inspect_paths_round_trip():
    for path, value in iter_leaf_paths(SAMPLE):
        assert resolve_path(SAMPLE, path) == value, path
