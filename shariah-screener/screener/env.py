"""Forgiving .env loader.

Windows trips up python-dotenv in a few common ways: PowerShell's `echo > .env`
writes UTF-16, Notepad can add a BOM, and people paste PowerShell/cmd syntax.
This loader accepts all of these:

    DATA_API_KEY=bsk_live_xxx
    DATA_API_KEY = "bsk_live_xxx"
    export DATA_API_KEY=bsk_live_xxx
    set DATA_API_KEY=bsk_live_xxx
    $env:DATA_API_KEY="bsk_live_xxx"
"""
from __future__ import annotations

import os
import re
from pathlib import Path

_LINE = re.compile(r"^\s*(?:export\s+|set\s+|\$env:)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$", re.I)


def _decode(raw: bytes) -> str:
    if raw.startswith((b"\xff\xfe", b"\xfe\xff")):
        return raw.decode("utf-16")
    if len(raw) > 1 and raw[1:2] == b"\x00":  # UTF-16 LE without BOM
        return raw.decode("utf-16-le")
    return raw.decode("utf-8-sig", errors="replace")


def parse_env(text: str) -> dict[str, str]:
    out = {}
    for line in text.splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        m = _LINE.match(line)
        if not m:
            continue
        key, value = m.group(1), m.group(2)
        if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
            value = value[1:-1]
        out[key] = value.strip()
    return out


def load_env(path: Path) -> list[Path]:
    """Load `path` (and a `.env.txt` Notepad twin) into os.environ without
    overriding variables already set. Returns the files actually read."""
    read = []
    for p in (path, path.with_name(path.name + ".txt")):
        if p.is_file():
            for k, v in parse_env(_decode(p.read_bytes())).items():
                os.environ.setdefault(k, v)
            read.append(p)
    return read


def get_api_key() -> str | None:
    key = os.getenv("DATA_API_KEY") or os.getenv("BHARATSTOCK_API_KEY")
    if key and key.lower().startswith(("your_", "<")):
        return None  # placeholder from .env.example
    return key or None
