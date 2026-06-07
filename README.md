# Agile Personal Kanban

**Overview**

This is a single-user Personal Kanban app I built to experiment with applying agile techniques to my personal life. I wanted to see whether treating personal work as small, time-boxed, and visible items would help with some ADHD-related executive function challenges. I also used this project as a learning platform to deepen my Python, AI tooling, and Git tooling skills.

Of course, after I've already done so much, I realized I can just do the same thing in Notion... but at least I'm learning something new!

**Why I built this**

- **Apply agile to life:** I thrive in agile environments at work and wanted to try the same structure for personal tasks - smaller work items, explicit priorities, and short feedback loops.
- **ADHD experimentation:** The hypothesis is that the structure, visibility, and cadence of Kanban/sprints can help with focus, motivation, and task completion.
- **Learn by doing:** I created programming "assignments" for myself using the `KANBAN_BUILD_SPEC.md` spec and `CLAUDE.md` to practice Python, FastAPI, SQLAlchemy, and AI integration while keeping the more creative tasks for myself.
- **Learn by fixing:** AI-generated code isn't perfect, so this also gives me an opportunity to practice my debugging and refactoring skills.

**Tech stack**

- **Backend:** FastAPI, SQLAlchemy 2.0 (async), Alembic, SQLite
- **Frontend:** React 18 + TypeScript, Vite, Axios, Recharts, CSS Modules
- **State & data:** React Query for server state, Zustand for ephemeral UI state

**Quickstart (development)**

1. Backend
   - Create and activate a Python virtual environment:

     ```bash
     cd backend
     python3 -m venv .venv
     source .venv/bin/activate
     pip install -r requirements.txt
     ```

   - Run migrations and seed the DB:

     ```bash
     cd backend
     alembic upgrade head
     python seed.py
     uvicorn app.main:app --reload --port 8000
     ```

2. Frontend
   - Install and run the frontend dev server:

     ```bash
     cd frontend
     npm install
     npm run dev
     ```

**To-dos**

- Some packages are out of date - upgrade and refactor as needed
- Make it look nicer
- Set up pre-commit hooks
- Set up auto-formatting
- Some functions and components are not following best practices - refactor
- Write tests - should've done that first, but here we are anyway
- Mobile frontend in React Native
