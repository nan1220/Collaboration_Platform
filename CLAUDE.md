# Project notes

## Git workflow
- Commit meaningful drafts of design/requirements docs as their own milestone commits (e.g. an initial architecture sketch), rather than only committing once a later revision is ready. This keeps a trackable history of how the design evolved.
- Commit at each implementation milestone, not just once at the end (e.g. after scaffolding, after models, after each major feature).
- When committing, stage all changes (`git add -A`) rather than hand-picking specific paths — still check `git status`/`git diff` first for anything sensitive.

## Backend
- Tech stack per [architecture.md](architecture.md): Django + Django REST Framework, SQLite for local/mock work (Postgres/Celery deferred).
- Manage the Python environment with `uv` (`uv init`, `uv add <pkg>`, `uv run <cmd>`) — not `venv` + `pip` directly.
