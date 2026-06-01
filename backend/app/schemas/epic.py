from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class EpicCreate(BaseModel):
    name: str
    color: str = "#6366f1"
    description: Optional[str] = None


class EpicUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None
    description: Optional[str] = None


class EpicResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    board_id: str
    name: str
    color: str
    description: Optional[str]
    created_at: datetime
