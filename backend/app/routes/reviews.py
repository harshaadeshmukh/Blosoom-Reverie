from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from datetime import datetime, timezone
import shutil
import os
import uuid

from ..database import get_database
from ..models.review import ReviewCreate

router = APIRouter(prefix="/api/reviews", tags=["reviews"])


def fix_id(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc


@router.post("/", status_code=201)
async def create_review(
    name: str = Form(...),
    rating: int = Form(...),
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
        "created_at": datetime.now(timezone.utc)
    }
    result = await db.reviews.insert_one(doc)
    created = await db.reviews.find_one({"_id": result.inserted_id})
    return fix_id(created)


@router.get("/")
async def list_reviews(limit: int = 20):
    db = get_database()
    docs = await db.reviews.find().sort("created_at", -1).limit(limit).to_list(limit)
    return [fix_id(d) for d in docs]


from bson import ObjectId

@router.delete("/{review_id}")
async def delete_review(review_id: str):
    db = get_database()
    try:
        oid = ObjectId(review_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid review id")
    result = await db.reviews.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"status": "deleted"}
