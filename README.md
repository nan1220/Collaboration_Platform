# Project Studies Platform (BirdVision × TUM Campus Heilbronn)

A platform for running the TUM Campus Heilbronn project-study process — students, companies, professors, and administrative staff currently coordinate this by email and a shared Excel sheet. This repo contains the Software Requirements Specification (SRS) and a working prototype built from it.

**Live prototype:** https://nan1220.github.io/Collaboration_Platform/ /
**Full SRS:** [`Software Requirements Specification for Prototype - Nan Jiang, Jasmin Yalçın_submitted version.pdf`](<Software Requirements Specification for Prototype - Nan Jiang, Jasmin Yalçın_submitted version.pdf>) (source in [Platform_SRS_file/Report.typ](Platform_SRS_file/Report.typ))

## Demo video

<!-- TODO: replace with the actual video link (e.g. YouTube, or a committed file in demo/) -->
<!-- **[`Watch the demo`](<demo\demo role-based access and dual approval.mp4>)** — a quick walkthrough of the prototype, including: -->

https://github.com/user-attachments/assets/9137b877-a334-44d2-a657-0adf105fc62e

A quick walkthrough of the prototype, including:
- **Role-based access** — each role (company, professor, student, staff) only sees and can act on what its permissions allow.
- **Dual approval** — staff and professor sign-off both required before a project moves from submitted to open.
- **Lightweight check-in** — students track and update application status without heavyweight forms.

## Background

This repo is the project study our team did with the partner company BirdVision, as part of the TUM Campus Heilbronn project-study process. The assignment was to design and prototype a three-party collaboration platform — university, companies, and students — to replace the email/Excel-based coordination described above.

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

<!-- ## Team & Contributions

**Team members:** Nan Jiang, Jasmin Yalçın, and Ahmet Akpunar  

**Authors and developers of the final deliverables:**
- Nan Jiang
- Jasmin Yalçın

The project produced three deliverables: an SRS, a prototype, and presentation slides.
- **Research approach:** Nan developed the literature and methodological basis for the requirements engineering process; Jasmin reviewed and refined the interview methodology.
- **Data collection:** All three team members contributed stakeholder data. Nan and Jasmin conducted and documented the main in-person interviews, while Ahmet provided additional written inputs collected by email.
- **Response matrix and analysis:** Nan designed the response matrix and its classification structure (SRS Section 3.1). Nan analyzed one-third of the data, while Jasmin analyzed the remaining two-thirds, including Ahmet's raw inputs.
- **Requirements analysis:** Jasmin led the synthesis of interview data into requirements; Nan reviewed and refined the results.
- **SRS:** Written exclusively by Nan and Jasmin.
- **Prototype:**  Designed and developed by Nan based on the SRS requirements, with feedback from Jasmin.
- **Presentation slides:** Prepared by Nan and Jasmin.

Ahmet was not directly involved in writing the SRS, preparing the presentation slides, or implementing the prototype. -->


## Team & Contributions

- **Team members:** Nan Jiang, Jasmin Yalçın, and Ahmet Akpunar
- **Final-deliverable authors and developers:** Nan Jiang and Jasmin Yalçın

<!-- [Nan Jiang](https://www.linkedin.com/in/nan-jiang-tum) -->

The project produced three deliverables: an SRS, a prototype, and presentation slides.
<!-- 
**Final-deliverable authors and developers:**
- Nan Jiang
- Jasmin Yalçın -->

### Research Process

- **Research approach:** Nan developed the literature and methodological basis for the requirements engineering process; Jasmin reviewed and refined the interview methodology.
- **Data collection:** All three team members contributed stakeholder data. Nan and Jasmin conducted and documented the main live interviews, while Ahmet provided additional written responses collected by email.
- **Response matrix and analysis:** Nan designed the response matrix and its classification structure (SRS Section 3.1). Nan analyzed one-third of the data, while Jasmin analyzed the remaining two-thirds, including Ahmet's raw inputs.
<!-- - **Requirements analysis:** Jasmin led the synthesis of interview data into requirements; Nan reviewed and refined the results. -->
- **Requirements analysis and system modeling:** Jasmin led the synthesis of interview data into requirements. Nan reviewed and refined the requirements, then modeled the system use cases and created the use case diagrams.

### Final Deliverables

| Deliverable | Contribution |
|---|---|
| **SRS** | Written exclusively by Nan and Jasmin |
| **Prototype** | Designed and developed by Nan based on the SRS requirements, with feedback from Jasmin |
| **Presentation slides** | Designed mainly by Jasmin; prepared by Nan and Jasmin |

Ahmet contributed to raw data collection but was not directly involved in authoring or developing the three final deliverables.