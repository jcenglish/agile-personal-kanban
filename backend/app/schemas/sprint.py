from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class SprintCreate(BaseModel):
    name: str
    goal: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class SprintUpdate(BaseModel):
    name: Optional[str] = None
    goal: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class SprintResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    board_id: str
    name: str
    goal: Optional[str]
    status: str
    start_date: Optional[date]
    end_date: Optional[date]
    created_at: datetime
