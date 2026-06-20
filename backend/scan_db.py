import asyncio
import json
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
from bson import json_util

async def scan():
    print("URI:", settings.mongodb_uri)
    print("DB:", settings.db_name)
    client = AsyncIOMotorClient(settings.mongodb_uri)
    db = client[settings.db_name]
    cursor = db.orders.find().sort('created_at', -1).limit(3)
    docs = await cursor.to_list(length=3)
    print(json.dumps(docs, default=json_util.default, indent=2))

asyncio.run(scan())
