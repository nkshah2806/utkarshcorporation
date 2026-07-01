from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import logging
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

# MongoDB
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="Utkarsh Corporation API")

# CORS
_cors = os.environ.get("CORS_ORIGINS", "*")
allow_origins = ["*"] if _cors == "*" else [o.strip() for o in _cors.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=allow_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers (imported after db is created so lazy imports work)
from routes_auth import router as auth_router
from routes_products import router as catalog_router
from routes_orders import router as orders_router
from routes_misc import router as misc_router

app.include_router(auth_router)
app.include_router(catalog_router)
app.include_router(orders_router)
app.include_router(misc_router)


@app.get("/api/")
async def root():
    return {"message": "Utkarsh Corporation API", "status": "ok"}


logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def on_startup():
    # indexes
    await db.users.create_index("email", unique=True)
    await db.products.create_index("slug", unique=True)
    await db.categories.create_index("slug", unique=True)
    await db.orders.create_index("order_number", unique=True)
    # seed
    from seed_data import seed_all
    try:
        await seed_all(db)
        logger.info("Seed complete.")
    except Exception as e:  # noqa
        logger.exception(f"Seed error: {e}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
