# Personal Agile Kanban — Build Specification

## Project Overview

A personal Kanban application modeled after professional agile tools (Jira-style). Supports multiple boards, optional epics, story pointing, sprint management, velocity/burndown tracking, and reusable task templates for recurring personal tasks. Designed for solo use — no multi-tenancy or auth required in v1.

---

## Tech Stack

| Layer        | Choice                       | Rationale                                                              |
| ------------ | ---------------------------- | ---------------------------------------------------------------------- |
| Frontend     | React 18 + Vite + TypeScript | Component ecosystem, type safety, interview relevance                  |
| Server State | React Query (TanStack Query) | Caching, async fetching, optimistic mutations                          |
| Client State | Zustand                      | Lightweight UI state (modals, drag state, sidebar)                     |
| Routing      | React Router v6              | Standard                                                               |
| Styling      | CSS Modules                  | True separation of design and composition, vanilla CSS skills          |
| DnD          | `@dnd-kit/core`              | Modern, accessible, better than react-beautiful-dnd                    |
| Charts       | Recharts                     | React-native, composable                                               |
| Backend      | Python 3.11 + FastAPI        | Async, typed, auto-docs                                                |
| ORM          | SQLAlchemy 2.0 (async)       | Supports SQLite now, swap to Postgres later                            |
| DB           | SQLite (file-based)          | Zero ops for personal use. Change one env var to migrate to PostgreSQL |
| Migrations   | Alembic                      | Works with SQLAlchemy                                                  |
| HTTP Client  | Axios                        | Frontend API calls                                                     |

> **On NoSQL:** The data is inherently relational — epics contain stories, sprints contain stories, boards contain sprints. SQL joins make velocity/burndown queries clean. NoSQL would require denormalization that makes aggregation messy. Stick with SQLite → PostgreSQL.

> **On state management:** React Query owns all server state (fetching, caching, invalidation, optimistic updates). Zustand owns client-only UI state that never touches the server — modal open/closed, which story is selected, sidebar collapsed, active drag state mid-flight. Do not duplicate server data in Zustand.

---

## Repository Structure

```
agile-kanban/
├── backend/
│   ├── app/
│   │   ├── main.py                   # FastAPI app, CORS, router registration
│   │   ├── database.py               # SQLAlchemy async engine + session
│   │   ├── models/                   # SQLAlchemy ORM models
│   │   │   ├── __init__.py
│   │   │   ├── board.py
│   │   │   ├── epic.py
│   │   │   ├── story.py
│   │   │   ├── sprint.py
│   │   │   ├── column.py
│   │   │   ├── template.py
|   |   |   └── sprint_snapshot.py
│   │   ├── schemas/                  # Pydantic v2 request/response schemas
│   │   │   ├── board.py
│   │   │   ├── epic.py
│   │   │   ├── story.py
│   │   │   ├── sprint.py
│   │   │   └── template.py
│   │   ├── routers/                  # FastAPI APIRouter per resource
│   │   │   ├── boards.py
│   │   │   ├── epics.py
│   │   │   ├── stories.py
│   │   │   ├── sprints.py
│   │   │   ├── templates.py
│   │   │   └── analytics.py          # ** USER IMPLEMENTS **
│   │   └── services/                 # Business logic layer
│   │       ├── sprint_service.py     # ** USER IMPLEMENTS **
│   │       └── analytics_service.py  # ** USER IMPLEMENTS **
│   ├── alembic/
│   │   └── versions/
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── api/                      # Axios API client modules
│   │   │   ├── client.ts             # Base Axios instance
│   │   │   ├── boards.ts
│   │   │   ├── stories.ts
│   │   │   ├── sprints.ts
│   │   │   ├── epics.ts
│   │   │   └── templates.ts
│   │   ├── hooks/                    # React Query hooks (** USER IMPLEMENTS **)
│   │   │   ├── useBoard.ts
│   │   │   ├── useStories.ts
│   │   │   ├── useSprints.ts
│   │   │   └── useTemplates.ts
│   │   ├── store/                    # Zustand — client UI state only
│   │   │   └── uiStore.ts            # modal state, sidebar, active drag
│   │   ├── types/                    # Shared TypeScript interfaces
│   │   │   └── index.ts
│   │   ├── pages/
│   │   │   ├── BoardsPage.tsx        # Board list / home
│   │   │   ├── BoardPage.tsx         # Kanban board view ** USER IMPLEMENTS **
│   │   │   ├── BacklogPage.tsx       # Backlog + sprint planning ** USER IMPLEMENTS **
│   │   │   └── SprintAnalyticsPage.tsx # Charts ** USER IMPLEMENTS **
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Navbar.tsx
│   │   │   ├── board/
│   │   │   │   ├── KanbanColumn.tsx      # ** USER IMPLEMENTS **
│   │   │   │   ├── StoryCard.tsx         # ** USER IMPLEMENTS **
│   │   │   │   └── DraggableBoard.tsx    # ** USER IMPLEMENTS **
│   │   │   ├── sprint/
│   │   │   │   ├── SprintPanel.tsx       # ** USER IMPLEMENTS **
│   │   │   │   └── SprintForm.tsx
│   │   │   ├── story/
│   │   │   │   ├── StoryModal.tsx        # ** USER IMPLEMENTS **
│   │   │   │   ├── PointsPicker.tsx
│   │   │   │   └── EnergyTypePicker.tsx
│   │   │   ├── epic/
│   │   │   │   ├── EpicBadge.tsx
│   │   │   │   └── EpicForm.tsx
│   │   │   ├── template/
│   │   │   │   ├── TemplateList.tsx      # ** USER IMPLEMENTS **
│   │   │   │   └── TemplateForm.tsx
│   │   │   └── charts/
│   │   │       ├── BurndownChart.tsx     # ** USER IMPLEMENTS **
│   │   │       └── VelocityChart.tsx     # ** USER IMPLEMENTS **
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
└── README.md
```

---

## Database Schema

> **Note to agent:** Design the schema exactly as specified. Do not add extra tables or fields in v1.
> All primary keys are UUIDs stored as TEXT. Generate with Python's `uuid.uuid4()` as the column default.

### `boards`

```sql
id          TEXT PRIMARY KEY          -- UUID
name        TEXT NOT NULL
description TEXT
created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
```

### `columns`

```sql
id              TEXT PRIMARY KEY      -- UUID
board_id        TEXT FK → boards.id ON DELETE CASCADE
name            TEXT NOT NULL         -- e.g. "To Do", "In Progress", "Done"
position        INTEGER NOT NULL      -- display order (0-indexed)
is_done_column  BOOLEAN DEFAULT FALSE -- marks a column as "done" for burndown calc
```

### `epics`

```sql
id          TEXT PRIMARY KEY          -- UUID
board_id    TEXT FK → boards.id ON DELETE CASCADE
name        TEXT NOT NULL
color       TEXT DEFAULT '#6366f1'    -- hex, for epic badge display
description TEXT
created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
```

### `sprints`

```sql
id          TEXT PRIMARY KEY          -- UUID
board_id    TEXT FK → boards.id ON DELETE CASCADE
name        TEXT NOT NULL             -- e.g. "Sprint 1"
goal        TEXT                      -- optional sprint goal text
status      TEXT DEFAULT 'planning'   -- 'planning' | 'active' | 'completed'
start_date  DATE
end_date    DATE
created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
```

> Only one sprint per board may have `status = 'active'` at a time. Enforce in the service layer.
> Multiple sprints may have `status = 'planning'` simultaneously (for grooming future sprints).

### `stories`

```sql
id              TEXT PRIMARY KEY      -- UUID
board_id        TEXT FK → boards.id ON DELETE CASCADE
sprint_id       TEXT FK → sprints.id NULLABLE   -- NULL = backlog
epic_id         TEXT FK → epics.id NULLABLE
column_id       TEXT FK → columns.id NULLABLE   -- NULL = in backlog, not on board
title           TEXT NOT NULL
description     TEXT
points          INTEGER NULLABLE      -- Fibonacci: 1, 2, 3, 5, 8, 13
position        REAL NULLABLE         -- NULL when in backlog; float for cheap midpoint reordering
is_urgent       BOOLEAN NULLABLE      -- Eisenhower axis 1
is_important    BOOLEAN NULLABLE      -- Eisenhower axis 2
energy_type     TEXT NULLABLE         -- 'physical' | 'cognitive' | 'emotional' | NULL
created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
completed_at    DATETIME NULLABLE     -- set when moved to a done column
```

> Invariant: `column_id` and `position` must both be NULL or both be set. Enforce in service layer.
> When a sprint is completed, non-done stories return to backlog: `sprint_id = NULL`, `column_id = NULL`, `position = NULL`.

### `templates`

```sql
id           TEXT PRIMARY KEY         -- UUID
board_id     TEXT FK → boards.id ON DELETE CASCADE
title        TEXT NOT NULL
points       INTEGER NULLABLE
is_urgent    BOOLEAN NULLABLE
is_important BOOLEAN NULLABLE
energy_type  TEXT NULLABLE            -- 'physical' | 'cognitive' | 'emotional' | NULL
epic_id      TEXT FK → epics.id NULLABLE
created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
```

> Templates are never counted in analytics. Only story instances created from them are.

### `sprint_snapshots` (for burndown)

```sql
id                TEXT PRIMARY KEY    -- UUID
sprint_id         TEXT FK → sprints.id ON DELETE CASCADE
snapshot_date     DATE NOT NULL
points_remaining  INTEGER NOT NULL
points_completed  INTEGER NOT NULL
```

> The agent should create the stub endpoint. The user implements the snapshot logic.

---

## API Design

Base URL: `http://localhost:8000/api/v1`

### Boards

```
GET    /boards                       → list all boards
POST   /boards                       → create board (also creates default columns)
GET    /boards/{id}                  → board + columns + active sprint summary
PUT    /boards/{id}                  → update name/description
DELETE /boards/{id}                  → delete board (cascade)
```

### Columns

```
GET    /boards/{id}/columns          → list columns for board
POST   /boards/{id}/columns          → add column
PUT    /columns/{id}                 → rename or toggle is_done_column
PATCH  /boards/{id}/columns/reorder  → update positions array
DELETE /columns/{id}                 → delete (prevent if stories exist)
```

### Epics

```
GET    /boards/{id}/epics            → list epics
POST   /boards/{id}/epics            → create epic
PUT    /epics/{id}                   → update
DELETE /epics/{id}                   → delete (nullify epic_id on stories and templates)
```

### Stories

```
GET    /boards/{id}/stories          → all stories for board (with sprint/epic/column)
GET    /boards/{id}/backlog          → stories where sprint_id IS NULL
POST   /boards/{id}/stories          → create story (defaults to backlog)
GET    /stories/{id}                 → single story detail
PUT    /stories/{id}                 → update title/description/points/epic/is_urgent/is_important/energy_type
PATCH  /stories/{id}/move            → { column_id, before_id?, after_id? } — ** USER IMPLEMENTS midpoint logic **
DELETE /stories/{id}
```

### Sprints

```
GET    /boards/{id}/sprints          → list sprints for board
POST   /boards/{id}/sprints          → create sprint (status: planning)
GET    /sprints/{id}                 → sprint detail + stories
PUT    /sprints/{id}                 → update name/goal/dates
POST   /sprints/{id}/start           → ** USER IMPLEMENTS ** set active, validate only one active
POST   /sprints/{id}/complete        → ** USER IMPLEMENTS ** complete sprint, move unfinished to backlog
DELETE /sprints/{id}                 → only if status = 'planning'
```

### Templates

```
GET    /boards/{id}/templates        → list templates for board
POST   /boards/{id}/templates        → create template
PUT    /templates/{id}               → update template
DELETE /templates/{id}               → delete template
POST   /templates/{id}/instantiate   → create one story in backlog from this template
```

### Analytics

```
GET    /sprints/{id}/burndown        → ** USER IMPLEMENTS **
GET    /boards/{id}/velocity         → ** USER IMPLEMENTS **
POST   /sprints/{id}/snapshot        → ** USER IMPLEMENTS ** (called manually or on a schedule)
```

---

## What the Agent Should Build

The agent builds all scaffolding, boilerplate, CRUD, and static UI shells.

> **Tests are not part of the scaffold.** The user writes all tests.
> Do not create test files, test directories, or install testing dependencies.

### Backend (Agent)

- [x] FastAPI app setup with CORS middleware
- [x] SQLAlchemy async engine (`database.py`) using UUID defaults on all models
- [x] All ORM models as specified above
- [x] Alembic config + initial migration
- [x] Pydantic v2 schemas: separate `Create`, `Update`, and `Response` variants per model
- [x] Full CRUD routers: `boards`, `columns`, `epics`, `stories` (excluding move logic), `templates` (excluding instantiate logic)
- [x] Sprint router: `GET`, `POST`, `PUT`, `DELETE` only — stub `start` and `complete` with `raise NotImplementedError`
- [x] Analytics router: stub all three endpoints with `raise NotImplementedError`
- [x] Sprint service: file with method signatures, docstrings, and `raise NotImplementedError`
- [x] Analytics service: file with method signatures, docstrings, and `raise NotImplementedError`
- [x] `requirements.txt`: fastapi, uvicorn, sqlalchemy[asyncio], aiosqlite, alembic, pydantic, python-dotenv
- [x] Create a standalone script to create seed data in `/backend/seed.py` to ran once manually: one board "Personal", columns "To Do" / "In Progress" / "Review" / "Done" (Done marked `is_done_column=true`), one planning sprint "Sprint 1", three templates: "Exercise", "Grocery shopping", "Laundry"

### Frontend (Agent)

- [x] Vite + React + TypeScript project with CSS Modules, React Router, Axios, React Query, Zustand, `@dnd-kit/core`, Recharts, `react-hot-toast`
- [x] `tsconfig.json` with strict mode enabled
- [x] `types/index.ts`: TypeScript interfaces for Board, Column, Epic, Sprint, Story, Template matching the schema exactly
- [x] `api/client.ts`: Axios base instance pointed at `/api/v1`
- [x] API modules: `boards.ts`, `stories.ts`, `sprints.ts`, `epics.ts`, `templates.ts` — all CRUD functions typed and wired, returning typed responses
- [x] `hooks/` directory: stub files for each hook with correct signatures and `throw new Error("USER IMPLEMENTS")` bodies
- [x] `store/uiStore.ts`: modal open state, which story ID is selected, sidebar collapsed boolean
- [x] `BoardsPage.tsx`: list boards, create board button, delete board — fully implemented
- [x] `Sidebar.tsx` and `Navbar.tsx`: navigation shell, routing links — fully implemented
- [x] `SprintForm.tsx`: create/edit sprint name, goal, start/end dates
- [x] `EpicForm.tsx` and `EpicBadge.tsx`: create epics, color picker, badge display
- [x] `PointsPicker.tsx`: Fibonacci selector (unpointed, 1, 2, 3, 5, 8, 13)
- [x] `EnergyTypePicker.tsx`: three-way toggle — physical / cognitive / emotional / unset
- [x] `TemplateForm.tsx`: create/edit template with all fields
- [x] Routing: `/`, `/boards/:boardId`, `/boards/:boardId/backlog`, `/boards/:boardId/analytics`
- [x] Page shells for `BoardPage`, `BacklogPage`, `SprintAnalyticsPage`: layout structure only, all data logic stubbed

---

## What the User Implements

These are the interesting, interview-relevant pieces. The agent leaves stubs with `// TODO: USER IMPLEMENTS` comments and typed interfaces so the contracts are clear.

---

### Backend

**`services/sprint_service.py`**

- `start_sprint(sprint_id, db)` — query the board, assert no other sprint has `status = 'active'` (raise HTTP 409 if so), set this sprint's status to active and `start_date` to today
- `complete_sprint(sprint_id, db)` — set status to completed; for all stories in this sprint where `column_id` does not point to a `is_done_column` column, set `sprint_id = NULL`, `column_id = NULL`, `position = NULL`; leave done stories in place

> **Interview relevance:** transactional correctness, constraint validation in the service layer vs. the DB layer, HTTP status code semantics (409 Conflict vs. 400 Bad Request)

**`services/analytics_service.py`**

- `take_snapshot(sprint_id, db)` — sum `points` for all stories in the sprint; split into completed (in a done column) and remaining; upsert a `sprint_snapshot` row for today (update if exists, insert if not)
- `get_burndown(sprint_id, db)` — return `[{ date, ideal_remaining, actual_remaining }]` for each day of the sprint from `start_date` to today (or `end_date` if completed). Ideal is a straight line from total committed points to 0. Actual comes from `sprint_snapshots` rows plus today's live count
- `get_velocity(board_id, db, last_n=5)` — query last N completed sprints; for each, return `{ sprint_name, committed_points, completed_points }`. Committed = total points when sprint started (use first snapshot). Completed = points in done columns at completion

> **Interview relevance:** SQL aggregation with joins, date range generation, upsert patterns, the distinction between committed and completed velocity

**`routers/analytics.py`**

- Wire the three service methods to their stub endpoints; handle 404 if sprint/board not found

**`PATCH /stories/{id}/move` in `routers/stories.py`**

- Accept `{ column_id, before_id?, after_id? }` — fetch the positions of `before` and `after` stories; assign new position as the midpoint (`(before.position + after.position) / 2`). Handle edge cases: inserting at the start (position = before first / 2), inserting at the end (position = last + 1.0), inserting into an empty column (position = 1.0). Also update `sprint_id` if provided

> **Interview relevance:** float-based ordering (vs. LexoRank tradeoffs), edge case handling, atomic updates

**`POST /templates/{id}/instantiate` in `routers/templates.py`**

- Copy template fields into a new `Story` row with `sprint_id = NULL`, `column_id = NULL`, `position = NULL`. Return the new story

---

### Frontend

**`hooks/useBoard.ts`** (React Query)

- `useBoard(boardId)` — `useQuery` fetching board + columns; query key `['board', boardId]`
- `useUpdateBoard(boardId)` — `useMutation` for renaming; invalidates `['board', boardId]` on success

> **Interview relevance:** React Query query keys as cache identifiers, stale-while-revalidate behavior, when to invalidate vs. update cache directly

**`hooks/useStories.ts`** (React Query)

- `useStories(boardId)` — `useQuery` for all stories on the active sprint; query key `['stories', boardId]`
- `useBacklog(boardId)` — `useQuery` for backlog stories
- `useMoveStory(boardId)` — `useMutation` with **optimistic update**: on `onMutate`, snapshot current query cache, apply the move locally, return snapshot for rollback; on `onError`, restore snapshot; on `onSettled`, invalidate to sync with server
- `useCreateStory`, `useUpdateStory`, `useDeleteStory` — standard mutations with cache invalidation

> **Interview relevance:** optimistic updates are a very common interview topic. The pattern of snapshot → apply → rollback on error is what interviewers ask about when discussing React Query or Apollo. Understand why `onSettled` is used instead of `onSuccess` for invalidation.

**`hooks/useSprints.ts`** (React Query)

- `useSprints(boardId)` — list all sprints
- `useStartSprint(boardId)` — mutation calling `POST /sprints/{id}/start`; on success invalidate `['sprints', boardId]` and `['stories', boardId]` (stories move onto the board)
- `useCompleteSprint(boardId)` — mutation calling `POST /sprints/{id}/complete`; same invalidation

**`hooks/useTemplates.ts`** (React Query)

- `useTemplates(boardId)` — list templates
- `useInstantiateTemplate(boardId)` — mutation calling `POST /templates/{id}/instantiate`; on success invalidate `['backlog', boardId]` so the new story appears immediately

**`store/uiStore.ts`** (Zustand)

- `isModalOpen: boolean`, `selectedStoryId: string | null` — open/close story modal
- `isSidebarOpen: boolean`
- `dragState: { activeId: string | null }` — track the story being dragged mid-flight

> **Interview relevance:** articulating why this state lives in Zustand rather than React Query (it's ephemeral UI state with no server representation)

**`components/board/DraggableBoard.tsx`**

- Use `@dnd-kit/core`: `DndContext`, `SortableContext`, `useSortable`, `DragOverlay`
- Render columns in a horizontal flex layout; stories are draggable within and between columns
- On `onDragStart`: set `dragState.activeId` in Zustand; render a `DragOverlay` clone of the card
- On `onDragEnd`: call `useMoveStory` mutation with `{ column_id, before_id, after_id }` derived from drop position
- On `onDragCancel`: clear `dragState`
- Handle dragging to an empty column (no before/after neighbors)

> **Interview relevance:** DnD event lifecycle, using a DragOverlay for visual fidelity, deriving before/after IDs from the droppable context

**`components/board/KanbanColumn.tsx`**

- Droppable column with title, story count badge, and total points for the column
- Subtle visual treatment for `is_done_column` (e.g. muted header color via CSS Module)
- "Add story" inline input at the bottom that calls `useCreateStory`

**`components/board/StoryCard.tsx`**

- Draggable via `useSortable`
- Displays: title, points badge (grayed if unpointed), epic badge, energy type icon, urgent/important indicators
- Click opens story modal via `uiStore.openModal(story.id)`

**`components/story/StoryModal.tsx`**

- Controlled by `uiStore.selectedStoryId` — fetches story detail from React Query cache
- Inline-editable title (click to edit, blur/enter to save via `useUpdateStory`)
- Fields: description, points picker, energy type picker, epic selector, is_urgent toggle, is_important toggle
- Shows sprint name or "Backlog"
- Delete with confirmation dialog; calls `useDeleteStory` then closes modal

> **Interview relevance:** controlled vs. uncontrolled inputs, optimistic field-level updates, modal state coordination between Zustand and React Query

**`pages/BoardPage.tsx`**

- Calls `useBoard`, `useStories`, `useSprints`
- Renders sprint header: name, goal, date range, points remaining vs. total
- Renders `DraggableBoard` with the active sprint's stories distributed into columns
- Start Sprint / Complete Sprint buttons wired to `useStartSprint` / `useCompleteSprint`
- If no active sprint: empty state prompting user to go to the backlog

**`pages/BacklogPage.tsx`**

- Two-panel layout: sprint planning panel and backlog panel
- Backlog panel: `useBacklog` stories, create new story inline, add story to sprint via `useUpdateStory({ sprint_id })`
- Sprint panel: sprint selector dropdown (planning-status sprints), stories in selected sprint, remove story from sprint
- Templates section: `useTemplates` list with "Add to Backlog" button per template calling `useInstantiateTemplate`
- "Create Sprint" button opens `SprintForm`

> **Interview relevance:** orchestrating multiple queries on one page, derived/filtered data from cache, cross-query invalidation

**`pages/SprintAnalyticsPage.tsx`**

- Sprint selector (completed sprints from `useSprints`)
- Renders `BurndownChart` and `VelocityChart` with data from analytics endpoints
- Handle loading and empty states

**`components/charts/BurndownChart.tsx`**

- Recharts `LineChart` with two `Line` series: ideal (dashed) and actual
- X-axis: dates; Y-axis: story points remaining
- `ReferenceLine` at today's date if sprint is still active

**`components/charts/VelocityChart.tsx`**

- Recharts `BarChart` with grouped bars: committed vs. completed per sprint
- `LabelList` showing completion percentage above each sprint group

**`components/template/TemplateList.tsx`**

- Renders all templates for the board
- Each row: title, points, energy type, epic, instantiate button
- Inline delete with confirmation

---

## Patterns & Conventions

### Backend conventions

- All endpoints are `async`; use `async with` for DB sessions
- Router functions are thin — delegate all logic beyond basic CRUD to the service layer
- Return 404 with `detail` message for missing resources; 409 for constraint violations
- Use `select()` with explicit joins rather than lazy loading
- Pydantic schemas: separate `Create`, `Update`, and `Response` variants per model
- UUIDs generated in Python (`str(uuid.uuid4())`), set as `default` on the SQLAlchemy column

### Frontend conventions

- React Query hooks are the source of truth for all server data — never duplicate into Zustand
- Components receive data as props; hooks are called in page-level components and passed down
- API errors surface as toast notifications via `react-hot-toast`
- All date handling via native `Date` (no moment.js or date-fns unless genuinely needed)
- CSS Modules: one `.module.css` file per component, imported as `styles`; no inline styles
- Strict TypeScript: no `any`, all API responses typed via `types/index.ts`

### Story `position` field

- NULL when in the backlog; a float when placed in a column
- Reordering uses midpoint insertion: new position = `(before.position + after.position) / 2`
- This is a simplified LexoRank — floats eventually lose precision after many reorders, but for personal use this is not a practical concern. A `rebalance` endpoint could renumber positions to integers if ever needed (good stretch goal)
- The user implements this logic in `PATCH /stories/{id}/move`

---

## Running Locally

```bash
# Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev   # runs on :5173, proxies /api to :8000
```

Vite proxy config in `vite.config.ts`:

```ts
server: {
  proxy: {
    '/api': 'http://localhost:8000'
  }
}
```

---

## Agent Instructions

1. Read this entire spec before writing any code.
2. Build in this order: models → migrations → schemas → routers → frontend scaffold → API modules → hooks → stores → components.
3. For every `** USER IMPLEMENTS **` item: create the file with the correct typed signatures, docstring/JSDoc comments describing expected behavior and edge cases, and a clear stub (`raise NotImplementedError("User implements")` / `throw new Error("USER IMPLEMENTS")`). Do not attempt to implement them.
4. After scaffolding, run `alembic upgrade head` to verify the migration applies cleanly.
5. Insert the seed data described in the agent checklist above.
6. Do not add authentication, user accounts, or multi-tenancy. This is a single-user personal app.
7. Do not add features not listed in this spec. Keep v1 focused.
