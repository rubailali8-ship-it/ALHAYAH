# Shariah Stock Screener (AAOIFI) — Nifty 50 prototype

Screens Indian stocks against AAOIFI Shariah rules and writes `results.csv`
with per-rule ratios, pass/fail flags and a final verdict, so you can
benchmark against Musaffa / Zoya.

## Quick start

```bash
cd shariah-screener
python3 -m venv .venv && source .venv/bin/activate     # Python 3.11+
pip install -r requirements.txt
cp .env.example .env            # then put your key in DATA_API_KEY

python screen.py --only TCS                 # 1 credit: test the field mapping first
python screen.py --inspect TCS              # print every JSON path in the cached response
# fix config/api.toml [fields] if anything came back DATA_MISSING, then:
python screen.py                            # full Nifty 50 -> results.csv
```

| Flag | What it does |
|---|---|
| `--only SYM [SYM ...]` | Screen only these symbols |
| `--symbols file.csv` | Use another universe (`symbol,company` columns) |
| `--offline` | Use cache only, never call the API (zero credits) |
| `--refresh` | Ignore the cache and re-fetch (costs credits) |
| `--inspect SYM` | Dump all JSON paths/values for a stock — use this to fix the mapping |
| `--output path.csv` | Output location (default `results.csv`) |

## Screening rules

| # | Rule | Pass if |
|---|---|---|
| 1 | Business activity | sector/industry not on the blacklist (banks, insurance, NBFC lending, alcohol, tobacco, gambling, pork, adult entertainment, weapons) |
| 2 | Debt / market cap | < 30% |
| 3 | (Cash + interest-bearing investments) / market cap | < 30% |
| 4 | Impermissible (interest) income / total revenue | < 5% |

**Verdict logic (in order):**
1. Business screen fails → `NOT_HALAL` (even if financials are missing — no ratio can rescue a bank).
2. Any input missing / unusable (incl. zero market cap or revenue, fetch error, no sector) → `DATA_MISSING`. Nothing is guessed.
3. Any ratio fails by **more** than 2 pp → `NOT_HALAL`.
4. Any ratio within ±2 pp of its threshold (inclusive, either side) → `DOUBTFUL`.
5. Otherwise → `HALAL`.

So debt at 27.9% is HALAL, 28–32% is DOUBTFUL, 32.1% is NOT_HALAL. For the
5% income rule, the doubtful band is 3–7%.

## Configuration (no code changes needed)

- `config/screening.toml` — thresholds, doubtful margin, sector **keyword
  blacklist**, and **per-symbol overrides**. Keywords match at word start, so
  `bank` matches "Banks" but `arms` won't match "Pharmaceuticals".
  Overrides exist because vendor sector labels lie about conglomerates:
  ITC is often labelled "FMCG". Pre-filled: ITC, BAJFINANCE, BAJAJFINSV,
  JIOFIN, SHRIRAMFIN. BEL (defence) is left as a commented-out choice.
- `config/api.toml` — endpoint, auth header, cache TTL, and the **field
  mapping** (candidate JSON paths per field, first hit wins) plus `[units]`
  multipliers so every money field ends up in the same unit.
- `config/nifty50.csv` — the universe. Index membership changes twice a year;
  check it against NSE's `ind_nifty50list.csv` before trusting a run.

## Caching

Raw responses go to `cache/<provider>/<SYMBOL>.json` with a timestamp and are
reused for `cache_ttl_days` (default 30). Failed calls are never cached, so a
re-run only spends credits on stocks that failed or expired. `--offline`
ignores the TTL and works purely from disk.

## Output columns

`symbol, company, sector, industry, debt_to_mcap_pct, cash_to_mcap_pct,
interest_income_to_revenue_pct, business_screen, business_reason, debt_screen,
cash_screen, income_screen, borderline_rules, final_verdict, notes, data_date,
fetched_at`

`data_date` is the financial period end from the API; `fetched_at` is when
it was pulled.

## Project layout

```
screen.py                  CLI entry point
screener/config.py         loads the TOML configs
screener/models.py         dataclasses + Verdict enum
screener/data_fetcher.py   API client, cache, JSON-path field mapping
screener/screening.py      pure AAOIFI logic (no I/O)
screener/output.py         CSV + terminal summary
tests/                     pytest suite (no network needed)
```

Run tests: `python -m pytest -q`

## Known gaps vs Musaffa / Zoya (expect differences here)

- **Field mapping is unverified.** The default paths in `api.toml` are a
  best guess at IndianAPI's schema; the build sandbox couldn't reach the API.
  Run `--only TCS` then `--inspect TCS` and correct the paths first.
- **Income screen uses interest income only.** AAOIFI's 5% covers *all*
  impermissible revenue (e.g. a hotel chain's bar sales). Musaffa/Zoya use
  segment-level revenue data; this prototype can't see it.
- **Business screen is label-based.** Mixed-activity companies are screened
  on their sector tag. Use overrides for known cases.
- **Market cap is spot, not averaged.** Some AAOIFI implementations use a
  trailing average (e.g. 24- or 36-month); spot market cap makes the debt and
  cash ratios swing with the share price.
- **Cash proxy.** "Cash + short-term investments" is used for interest-bearing
  assets; long-dated debt securities held as investments may be missed.
- **Units.** If the API reports market cap and statement items in different
  units (crore vs lakh), set `[units]` or the ratios will be off by 100×.
