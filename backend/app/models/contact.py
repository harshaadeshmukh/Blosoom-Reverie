from pydantic import BaseModel, EmailStr, Field
from datetime import datetime


class ContactCreate(BaseModel):
    name: str
    email: str
    message: str


class ContactResponse(ContactCreate):
    id: str = Field(alias="_id")
    created_at: datetime

    class Config:
        populate_by_name = True
