from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.schemas.column import ColumnResponse


class BoardCreate(BaseModel):
    name: str
    description: Optional[str] = None


class BoardUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class BoardResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    description: Optional[str]
    created_at: datetime
    columns: list[ColumnResponse] = []
