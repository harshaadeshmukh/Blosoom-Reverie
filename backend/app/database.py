from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings

client: AsyncIOMotorClient = None


def get_database():
    return client[settings.db_name]


async def connect_db():
    global client
    client = AsyncIOMotorClient(settings.mongodb_uri)
    # Ping to confirm connection
    await client.admin.command("ping")
    print("✓ Connected to MongoDB Atlas")


async def close_db():
    global client
    if client:
        client.close()
        print("✓ MongoDB connection closed")
