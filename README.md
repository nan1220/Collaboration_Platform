# Project Studies Platform (BirdVision × TUM Campus Heilbronn)

A platform for running the TUM Campus Heilbronn project-study process — students, companies, professors, and administrative staff currently coordinate this by email and a shared Excel sheet. This repo contains the Software Requirements Specification (SRS) and a working prototype built from it.

**Live prototype:** https://nan1220.github.io/Collaboration_Platform/ /
**Full SRS:** [`Software Requirements Specification for Prototype - Nan Jiang, Jasmin Yalçın_submitted version.pdf`](<Software Requirements Specification for Prototype - Nan Jiang, Jasmin Yalçın_submitted version.pdf>) (source in [Platform_SRS_file/Report.typ](Platform_SRS_file/Report.typ))

## What it does

Four roles, one shared project pipeline:

- **Companies** submit project topics, or browse and accept student-submitted topics.
- **Professors** take on supervision of a submitted project (setting deadlines and required documents) or submit a project themselves, then review student applications.
- **Students** browse open projects, apply with required documents, track application status, and optionally look for teammates.
- **Staff** review and approve incoming company submissions and get a master dashboard across every project's status (`Pending → Approved → Open → Ongoing → Complete`).

Requirements (FR-1 … FR-18, NFR-1 … NFR-3) were derived from 26 semi-structured interviews across all four stakeholder groups and are traced from pain point → requirement → prototype coverage in the SRS's traceability table ([new_tracibility_table.csv](new_tracibility_table.csv)).

## Repo layout

```
Platform_SRS_file/   SRS source (Typst) and rendered PDF
frontend/             Next.js prototype (App Router, TypeScript, Tailwind, shadcn/ui)
backend/              Django + DRF scaffold (models for the same domain; not wired to the prototype)
architecture.md        Early architecture/tech-stack sketch
requirements.md        Raw notes from the initial stakeholder conversation
```

## Running the prototype

The frontend prototype is a **fully in-browser mock** — no backend or database required. All data lives in `frontend/src/lib/mock-store.ts` and resets on reload.

```bash
python start_frontend.py
# or, from frontend/:
npm install && npm run dev
```

Open http://localhost:3000.

The `backend/` Django project (`uv run manage.py runserver` from `backend/`) is a standalone schema sketch for a real deployment and isn't consumed by the frontend prototype — see the SRS's Scope Boundary section for why the prototype is frontend-only.

## Deployment

The frontend builds as a static export (`next build`, `output: "export"`) and is published to GitHub Pages at the base path `/Collaboration_Platform`.
