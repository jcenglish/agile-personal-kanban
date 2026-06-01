from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import boards, columns, epics, stories, sprints, templates, analytics

app = FastAPI(title="Personal Agile Kanban API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_PREFIX = "/api/v1"

app.include_router(boards.router, prefix=API_PREFIX)
app.include_router(columns.router, prefix=API_PREFIX)
app.include_router(epics.router, prefix=API_PREFIX)
app.include_router(stories.router, prefix=API_PREFIX)
app.include_router(sprints.router, prefix=API_PREFIX)
app.include_router(templates.router, prefix=API_PREFIX)
app.include_router(analytics.router, prefix=API_PREFIX)


@app.get("/health")
async def health():
    return {"status": "ok"}
