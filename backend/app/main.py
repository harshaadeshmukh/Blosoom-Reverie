from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from datetime import datetime, timezone

from .config import settings
from .database import connect_db, close_db, get_database
from .routes import orders, contact, reviews
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler
from .limiter import limiter

app = FastAPI(
    title="Blosoom Reverie API",
    description="Backend for the Blosoom Reverie handmade gifting studio",
    version="1.0.0",
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(orders.router)
app.include_router(contact.router)
app.include_router(reviews.router)

# Mount static files for uploads
import os
try:
    os.makedirs("uploads", exist_ok=True)
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
except Exception:
    pass # Fallback for Vercel's read-only file system


@app.on_event("startup")
async def startup():
    await connect_db()


@app.on_event("shutdown")
async def shutdown():
    await close_db()


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "Blosoom Reverie API"}


@app.get("/")
@app.head("/")
async def root():
    return {"status": "online", "message": "Blosoom Reverie API is running. Use the frontend application to interact with this service."}
