from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Request
from datetime import datetime, timezone
import shutil
import os
import uuid
from pydantic import BaseModel
from bson import ObjectId
from ..database import get_database
from ..models.review import ReviewCreate
from ..limiter import limiter
from datetime import datetime, timezone
import shutil
import os
import uuid
from pydantic import BaseModel
from bson import ObjectId
from ..database import get_database
from ..models.review import ReviewCreate

router = APIRouter(prefix="/api/reviews", tags=["reviews"])


def fix_id(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc


@router.post("/", status_code=201)
@limiter.limit("3/minute")
async def create_review(
    request: Request,
    name: str = Form(...),
    rating: float = Form(...),
    message: str = Form(...),
    image: UploadFile = File(None)
):
    import base64
    image_url = None
    if image and image.filename:
        contents = await image.read()
        encoded = base64.b64encode(contents).decode("utf-8")
        content_type = image.content_type or "image/jpeg"
        image_url = f"data:{content_type};base64,{encoded}"

    db = get_database()
    doc = {
        "name": name,
        "rating": rating,
        "message": message,
        "image_url": image_url,
        "created_at": datetime.now(timezone.utc),
        "is_visible": False
    }
    result = await db.reviews.insert_one(doc)
    created = await db.reviews.find_one({"_id": result.inserted_id})
    return fix_id(created)


@router.get("/")
@limiter.limit("60/minute")
async def list_reviews(request: Request, limit: int = 20, public: bool = False):
    db = get_database()
    query = {}
    if public:
        query = {"is_visible": {"$ne": False}}
    docs = await db.reviews.find(query).sort("created_at", -1).limit(limit).to_list(limit)
    return [fix_id(d) for d in docs]


class VisibilityUpdate(BaseModel):
    is_visible: bool

@router.patch("/{review_id}/visibility")
@limiter.limit("30/minute")
async def update_visibility(request: Request, review_id: str, payload: VisibilityUpdate):
    db = get_database()
    try:
        oid = ObjectId(review_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid review id")
    result = await db.reviews.update_one({"_id": oid}, {"$set": {"is_visible": payload.is_visible}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"status": "updated", "is_visible": payload.is_visible}


@router.delete("/{review_id}")
@limiter.limit("30/minute")
async def delete_review(request: Request, review_id: str):
    db = get_database()
    try:
        oid = ObjectId(review_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid review id")
    result = await db.reviews.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"status": "deleted"}
