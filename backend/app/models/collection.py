from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class CollectionBase(BaseModel):
    name: str
    slug: str
    description: str
    tag: Optional[str] = None


class CollectionCreate(CollectionBase):
    pass


class CollectionResponse(CollectionBase):
    id: str = Field(alias="_id")
    created_at: datetime

    class Config:
        populate_by_name = True
