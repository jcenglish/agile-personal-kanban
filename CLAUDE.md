# Personal Kanban — Claude Code Instructions

## Project Overview

A personal Kanban app with agile features: sprints, story points, epics, burndown/velocity analytics, and task templates. Single-user, no auth. Backend is FastAPI + SQLAlchemy + SQLite. Frontend is React + TypeScript + CSS Modules.

Read `KANBAN_BUILD_SPEC.md` for the full specification before writing any code.

## Commands

```bash
# Backend
cd backend && source venv/bin/activate
uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend && npm run dev

# Migrations
cd backend && alembic upgrade head
cd backend && alembic revision --autogenerate -m "<description>"

# Type checking
cd frontend && npx tsc --noEmit

# Backend linting
cd backend && ruff check app/
```

## Tech Stack

**Use:**

- React 18 + TypeScript + Vite
- CSS Modules (one `.module.css` per component)
- React Query for all server state
- Zustand for client UI state only (modals, sidebar, drag state)
- React Router v6
- `@dnd-kit/core` for drag and drop
- Recharts for charts
- Axios for HTTP
- FastAPI + SQLAlchemy 2.0 async + SQLite
- Alembic for migrations
- Pydantic v2

**Do not use:**

- Tailwind or any utility CSS framework
- Inline styles
- Redux or any other state manager besides Zustand
- `react-beautiful-dnd` (abandoned)
- `moment.js` or `date-fns` (use native `Date`)
- `any` type in TypeScript

## Architecture Rules

- Router functions are thin — all business logic goes in the service layer
- React Query hooks own all server data — never duplicate server state into Zustand
- Zustand is for ephemeral UI state only: modal open/closed, sidebar, active drag
- Components receive data as props; hooks are called at the page level and passed down
- All IDs are UUIDs (TEXT in SQLite, `str(uuid.uuid4())` as default in SQLAlchemy)
- Strict TypeScript: no `any`, all API responses typed via `src/types/index.ts`

## Code Style

**Python:**

- All endpoints and DB operations are `async`
- Use `select()` with explicit joins — no lazy loading
- Pydantic schemas: separate `Create`, `Update`, and `Response` variants per model
- Return HTTP 404 with a `detail` message for missing resources
- Return HTTP 409 for constraint violations (e.g. starting a second active sprint)

**TypeScript/React:**

- Functional components only
- CSS Modules: import as `styles`, use `styles.className`
- One component per file
- Keep components under 200 lines; extract sub-components if longer, if possible
- API errors surface as toast notifications via `react-hot-toast`

## Tests

- Create one test file per router (backend) and per user-implemented component (frontend)
- Each file should contain exactly one example test with a single assertion
- Include all necessary imports and fixture/setup boilerplate
- Leave the rest of the file empty for the user to fill in
- Do not write more than one test per file

## User-Implemented Sections

The following are intentionally left as stubs for the user to implement. Do not implement them:

- `backend/app/services/sprint_service.py` — `start_sprint`, `complete_sprint`
- `backend/app/services/analytics_service.py` — `take_snapshot`, `get_burndown`, `get_velocity`
- `backend/app/routers/analytics.py` — wire analytics endpoints
- `PATCH /stories/{id}/move` — midpoint position logic in `routers/stories.py`
- `POST /templates/{id}/instantiate` — in `routers/templates.py`
- All files under `frontend/src/hooks/`
- `frontend/src/store/uiStore.ts`
- `frontend/src/components/board/DraggableBoard.tsx`
- `frontend/src/components/board/KanbanColumn.tsx`
- `frontend/src/components/board/StoryCard.tsx`
- `frontend/src/components/story/StoryModal.tsx`
- `frontend/src/components/template/TemplateList.tsx`
- `frontend/src/pages/BoardPage.tsx`
- `frontend/src/pages/BacklogPage.tsx`
- `frontend/src/pages/SprintAnalyticsPage.tsx`
- `frontend/src/components/charts/BurndownChart.tsx`
- `frontend/src/components/charts/VelocityChart.tsx`

## Do Not

- Do not write any test files
- Do not create `tests/`, `__tests__/`, or any `*.test.ts` / `test_*.py` files
- Do not add pytest, jest, or vitest to the dependencies

Leave these as stubs with typed signatures, a docstring/JSDoc explaining expected behavior, and `raise NotImplementedError("User implements")` or `throw new Error("USER IMPLEMENTS")`. Do not attempt to fill them in.

## Git Conventions

- Use conventional commits: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`
- Subject line: imperative mood, under 72 characters (`feat: add sprint completion endpoint`)
- Commit after each logical unit of work — do not bundle unrelated changes
- Do not push to remote unless explicitly asked
- Do not commit: `.env`, `kanban.db`, `venv/`, `node_modules/`, `__pycache__/`

## When Compacting

Always preserve in the summary:

- The full list of files created or modified
- Any migration versions generated
- Which user-implement stubs still need to be done
- The last command run and its result
