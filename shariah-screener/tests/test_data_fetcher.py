"""Fetcher tests against BharatStock-shaped payloads. No network."""
import pytest

from screener.config import load_api_config
from screener.data_fetcher import DataFetcher, evaluate, iter_leaf_paths, resolve_path, to_number
from screener.env import get_api_key, load_env, parse_env

# Shapes mirror the official `bharatstock` client models (StockDetail, FinancialPeriod page).
STOCK = {
    "symbol": "TCS", "company_name": "Tata Consultancy Services Ltd",
    "sector": "Information Technology", "industry": "IT - Software",
    "market_cap": 1_200_000.0,  # Rs crore
    "metrics": {"price": 3300.0, "cash_per_share": 132.0, "total_debt": 9000.0,
                "market_cap": 1_200_000.0},
}
FINANCIALS = {
    "data": [
        {"period_type": "annual", "fiscal_year": "2026", "period_end_date": "2026-03-31",
         "consolidation_type": "Standalone", "revenue": 220000.0, "other_income": 4000.0},
        {"period_type": "annual", "fiscal_year": "2026", "period_end_date": "2026-03-31",
         "consolidation_type": "Consolidated", "revenue": 260000.0, "other_income": 3900.0},
    ],
    "pagination": {"page": 1, "page_size": 4, "total_items": 2, "total_pages": 1},
}
ROUTES = {"/v1/stocks/TCS": STOCK, "/v1/stocks/TCS/financials": FINANCIALS}


class FakeResp:
    def __init__(self, payload, status=200):
        self._p, self.status_code, self.text = payload, status, str(payload)

    def json(self):
        return self._p


class FakeHttp:
    def __init__(self, status=200):
        self.urls, self.status = [], status

    def __call__(self, url, params, headers, timeout):
        self.urls.append(url)
        assert headers["X-API-Key"] == "k"
        path = url.replace("https://bharatstockapi.com", "")
        if self.status != 200:
            return FakeResp({"detail": "nope"}, self.status)
        return FakeResp(ROUTES.get(path, {"detail": "not found"}), 200 if path in ROUTES else 404)


def make(tmp_path, http, **kw):
    return DataFetcher(load_api_config(), "k", cache_dir=tmp_path, http_get=http, sleep=lambda s: None, **kw)


# --- path / expression resolution -------------------------------------------
def test_resolve_path_variants():
    d = {"stock": STOCK, "financials": FINANCIALS}
    assert resolve_path(d, "stock.metrics.total_debt") == 9000.0
    assert resolve_path(d, "financials.data[1].revenue") == 260000.0
    # filters are case-insensitive
    assert resolve_path(d, "financials.data[consolidation_type=consolidated].revenue") == 260000.0
    assert resolve_path(d, "financials.data[9].revenue") is None
    assert resolve_path(d, "nope.deeper[key=x]") is None


def test_arithmetic_expression():
    d = {"stock": STOCK}
    # cash = 132 * 1,200,000 / 3300 = 48,000 crore
    assert evaluate(d, "stock.metrics.cash_per_share * stock.market_cap / stock.metrics.price") == pytest.approx(48000)
    assert evaluate(d, "stock.metrics.cash_per_share * stock.missing") is None
    assert evaluate({"a": 1, "b": 0}, "a / b") is None


@pytest.mark.parametrize("raw,expected", [
    (12, 12.0), ("1,23,456.5", 123456.5), ("(250)", -250.0), ("-", None), ("NA", None), (None, None), ("abc", None),
])
def test_to_number(raw, expected):
    assert to_number(raw) == expected


# --- full mapping -------------------------------------------------------------
def test_extract_maps_all_fields_preferring_consolidated(tmp_path):
    fin = make(tmp_path, FakeHttp()).get_financials("TCS")
    assert fin.fetch_error is None
    assert fin.company == "Tata Consultancy Services Ltd"
    assert fin.sector == "Information Technology" and fin.industry == "IT - Software"
    assert fin.market_cap == 1_200_000
    assert fin.total_debt == 9000
    assert fin.cash_and_interest_investments == pytest.approx(48000)
    assert fin.total_revenue == 260000 and fin.interest_income == 3900  # consolidated row
    assert fin.data_date == "2026-03-31"


# --- caching & quota ----------------------------------------------------------
def test_cache_prevents_repeat_calls(tmp_path):
    http = FakeHttp()
    make(tmp_path, http).get_financials("TCS")
    assert len(http.urls) == 2  # stock + financials
    make(tmp_path, http).get_financials("TCS")
    assert len(http.urls) == 2
    make(tmp_path, http, refresh=True).get_financials("TCS")
    assert len(http.urls) == 4


def test_partial_success_is_cached_so_retry_only_pays_for_the_rest(tmp_path):
    ROUTES["/v1/stocks/XYZ"] = STOCK  # financials for XYZ -> 404
    try:
        http = FakeHttp()
        f = make(tmp_path, http)
        assert "404" in f.get_financials("XYZ").fetch_error
        assert f.cache_path("XYZ", "stock").exists()
        assert not f.cache_path("XYZ", "financials").exists()
        make(tmp_path, http).get_financials("XYZ")
        assert http.urls.count("https://bharatstockapi.com/v1/stocks/XYZ") == 1
    finally:
        del ROUTES["/v1/stocks/XYZ"]


def test_quota_hit_stops_all_further_calls(tmp_path):
    http = FakeHttp(status=429)
    f = make(tmp_path, http)
    assert "429" in f.get_financials("TCS").fetch_error
    assert "quota" in f.get_financials("INFY").fetch_error
    assert len(http.urls) == 1


def test_offline_without_cache_is_error_not_crash(tmp_path):
    http = FakeHttp()
    fin = make(tmp_path, http, offline=True).get_financials("TCS")
    assert http.urls == [] and "offline" in fin.fetch_error


def test_symbol_with_ampersand_is_url_encoded_and_cache_safe(tmp_path):
    http = FakeHttp()
    f = make(tmp_path, http)
    f.get_financials("M&M")
    assert http.urls[0].endswith("/v1/stocks/M%26M")
    assert f.cache_path("M&M", "stock").parent.name == "M_M"


def test_inspect_paths_round_trip():
    d = {"stock": STOCK, "financials": FINANCIALS}
    for path, value in iter_leaf_paths(d):
        assert resolve_path(d, path) == value, path


# --- .env loading (Windows-proof) ---------------------------------------------
@pytest.mark.parametrize("line", [
    "DATA_API_KEY=bsk_live_abc",
    'DATA_API_KEY = "bsk_live_abc"',
    "export DATA_API_KEY=bsk_live_abc",
    "set DATA_API_KEY=bsk_live_abc",
    '$env:DATA_API_KEY="bsk_live_abc"',
])
def test_parse_env_accepts_common_syntaxes(line):
    assert parse_env("# comment\n" + line + "\n")["DATA_API_KEY"] == "bsk_live_abc"


@pytest.mark.parametrize("encoding", ["utf-16", "utf-8-sig", "utf-8"])
def test_load_env_handles_windows_encodings(tmp_path, monkeypatch, encoding):
    monkeypatch.delenv("DATA_API_KEY", raising=False)
    (tmp_path / ".env").write_text("# c\r\nDATA_API_KEY=bsk_live_xyz\r\n", encoding=encoding)
    load_env(tmp_path / ".env")
    assert get_api_key() == "bsk_live_xyz"


def test_placeholder_key_is_treated_as_missing(monkeypatch):
    monkeypatch.setenv("DATA_API_KEY", "your_api_key_here")
    assert get_api_key() is None
