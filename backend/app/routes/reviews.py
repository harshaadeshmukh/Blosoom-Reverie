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
    image_url = None
    if image and image.filename:
        ext = os.path.splitext(image.filename)[1]
        unique_filename = f"{uuid.uuid4().hex}{ext}"
        file_path = os.path.join("uploads", unique_filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image_url = f"/uploads/{unique_filename}"

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
