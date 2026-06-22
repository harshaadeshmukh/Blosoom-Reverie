from fastapi import APIRouter, HTTPException, BackgroundTasks, Request
from bson import ObjectId
from datetime import datetime, timezone

from ..database import get_database
from ..models.order import OrderCreate, OrderStatusUpdate
from ..email_service import send_order_confirmation, send_admin_notification
from ..limiter import limiter

router = APIRouter(prefix="/api/orders", tags=["orders"])


def fix_id(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc


@router.post("/", status_code=201)
@limiter.limit("5/minute")
async def create_order(request: Request, order: OrderCreate, background_tasks: BackgroundTasks):
    db = get_database()
    doc = order.model_dump()
    doc["status"] = "pending"
    doc["created_at"] = datetime.now(timezone.utc)
    result = await db.orders.insert_one(doc)
    created = await db.orders.find_one({"_id": result.inserted_id})
    
    # Await the email directly so Vercel doesn't kill the function before it finishes
    await send_order_confirmation(
        contact_info=order.email,
        customer_name=order.name,
        order_details=doc
    )
    
    # Send the separate admin notification
    await send_admin_notification(
        customer_name=order.name,
        customer_email=order.email,
        order_details=doc
    )
    
    return fix_id(created)


@router.get("/")
@limiter.limit("30/minute")
async def list_orders(request: Request):
    db = get_database()
    docs = await db.orders.find().sort("created_at", -1).to_list(500)
    return [fix_id(d) for d in docs]


@router.get("/{order_id}")
@limiter.limit("30/minute")
async def get_order(request: Request, order_id: str):
    db = get_database()
    try:
        oid = ObjectId(order_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid order id")
    doc = await db.orders.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Order not found")
    return fix_id(doc)


@router.patch("/{order_id}/status")
@limiter.limit("30/minute")
async def update_order_status(request: Request, order_id: str, update_data: OrderStatusUpdate):
    db = get_database()
    try:
        oid = ObjectId(order_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid order id")
    
    result = await db.orders.update_one(
        {"_id": oid},
        {"$set": {"status": update_data.status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
        
    doc = await db.orders.find_one({"_id": oid})
    return fix_id(doc)
