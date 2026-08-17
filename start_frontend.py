#!/usr/bin/env python3
"""Start the Next.js frontend dev server.

Installs npm dependencies if node_modules is missing, then runs `npm run dev`.
"""
import subprocess
import sys
from pathlib import Path

FRONTEND_DIR = Path(__file__).resolve().parent / "frontend"


def main() -> int:
    if not FRONTEND_DIR.is_dir():
        print(f"Frontend directory not found: {FRONTEND_DIR}", file=sys.stderr)
        return 1

    npm = "npm.cmd" if sys.platform == "win32" else "npm"

    if not (FRONTEND_DIR / "node_modules").is_dir():
        print("node_modules not found, running npm install...")
        result = subprocess.run([npm, "install"], cwd=FRONTEND_DIR)
        if result.returncode != 0:
            return result.returncode

    print("Starting Next.js dev server...")
    return subprocess.run([npm, "run", "dev"], cwd=FRONTEND_DIR).returncode


if __name__ == "__main__":
    sys.exit(main())