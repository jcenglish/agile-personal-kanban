from typing import Optional

from pydantic import BaseModel, ConfigDict


class ColumnCreate(BaseModel):
    name: str
    position: int
    is_done_column: bool = False


class ColumnUpdate(BaseModel):
    name: Optional[str] = None
    is_done_column: Optional[bool] = None


class ColumnReorderItem(BaseModel):
    id: str
    position: int


class ColumnReorder(BaseModel):
    columns: list[ColumnReorderItem]


class ColumnResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    board_id: str
    name: str
    position: int
    is_done_column: bool
