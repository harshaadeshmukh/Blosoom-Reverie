from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class OrderCreate(BaseModel):
    collection_id: Optional[str] = None
    name: str
    contact: str
    email: str
    phone: Optional[str] = None
    occasion: str
    photo_count: int = Field(ge=1, le=100)
    message: Optional[str] = None
    preferred_date: Optional[str] = None
    budget_range: Optional[str] = None


class OrderResponse(OrderCreate):
    id: str = Field(alias="_id")
    status: str = "pending"
    created_at: datetime

    class Config:
        populate_by_name = True

class OrderStatusUpdate(BaseModel):
    status: str
