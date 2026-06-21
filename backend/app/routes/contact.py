from fastapi import APIRouter, Request
from datetime import datetime, timezone

from ..database import get_database
from ..models.contact import ContactCreate
from ..limiter import limiter
from datetime import datetime, timezone

from ..database import get_database
from ..models.contact import ContactCreate

router = APIRouter(prefix="/api/contact", tags=["contact"])


def fix_id(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc


@router.post("/", status_code=201)
@limiter.limit("3/minute")
async def send_message(request: Request, payload: ContactCreate):
    db = get_database()
    doc = payload.model_dump()
    doc["created_at"] = datetime.now(timezone.utc)
    result = await db.contact_messages.insert_one(doc)
    created = await db.contact_messages.find_one({"_id": result.inserted_id})
    return fix_id(created)
