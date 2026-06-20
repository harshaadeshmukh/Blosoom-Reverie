from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ReviewCreate(BaseModel):
    name: str
    rating: int = Field(ge=1, le=5)
    message: str
    image_url: Optional[str] = None


class ReviewResponse(ReviewCreate):
    id: str = Field(alias="_id")
    created_at: datetime

    class Config:
        populate_by_name = True
