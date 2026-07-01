from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional, List
from models import (
    Product, ProductInput, Category, CategoryInput,
    Review, ReviewInput,
)
from auth_utils import require_admin, get_current_user
import uuid
from datetime import datetime, timezone

router = APIRouter(prefix="/api", tags=["catalog"])


# -------- Categories --------
@router.get("/categories", response_model=List[Category])
async def list_categories():
    from server import db
    docs = await db.categories.find({}, {"_id": 0}).to_list(200)
    return docs


@router.post("/categories", response_model=Category)
async def create_category(body: CategoryInput, _: dict = Depends(require_admin)):
    from server import db
    cat = Category(**body.model_dump()).model_dump()
    await db.categories.insert_one(cat)
    return cat


@router.delete("/categories/{cat_id}")
async def delete_category(cat_id: str, _: dict = Depends(require_admin)):
    from server import db
    r = await db.categories.delete_one({"id": cat_id})
    return {"deleted": r.deleted_count}


# -------- Products --------
@router.get("/products", response_model=List[Product])
async def list_products(
    q: Optional[str] = None,
    category: Optional[str] = None,
    ailment: Optional[str] = None,
    bestseller: Optional[bool] = None,
    featured: Optional[bool] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort: Optional[str] = Query(None, description="price_asc|price_desc|newest|popular"),
    limit: int = 100,
):
    from server import db
    query: dict = {}
    if q:
        query["$or"] = [
            {"name": {"$regex": q, "$options": "i"}},
            {"short_description": {"$regex": q, "$options": "i"}},
            {"ailments": {"$regex": q, "$options": "i"}},
        ]
    if category:
        query["category_slug"] = category
    if ailment:
        query["ailments"] = ailment
    if bestseller is True:
        query["is_bestseller"] = True
    if featured is True:
        query["is_featured"] = True
    if min_price is not None or max_price is not None:
        pq: dict = {}
        if min_price is not None:
            pq["$gte"] = min_price
        if max_price is not None:
            pq["$lte"] = max_price
        query["price"] = pq

    cursor = db.products.find(query, {"_id": 0})
    if sort == "price_asc":
        cursor = cursor.sort("price", 1)
    elif sort == "price_desc":
        cursor = cursor.sort("price", -1)
    elif sort == "newest":
        cursor = cursor.sort("created_at", -1)
    elif sort == "popular":
        cursor = cursor.sort("review_count", -1)
    return await cursor.to_list(limit)


@router.get("/products/search-suggest")
async def search_suggest(q: str = Query(..., min_length=1)):
    from server import db
    docs = await db.products.find(
        {"name": {"$regex": q, "$options": "i"}},
        {"_id": 0, "id": 1, "name": 1, "slug": 1, "images": 1, "price": 1},
    ).limit(6).to_list(6)
    return docs


@router.get("/products/{slug}", response_model=Product)
async def get_product(slug: str):
    from server import db
    doc = await db.products.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found")
    return doc


@router.get("/products/{slug}/related", response_model=List[Product])
async def related(slug: str):
    from server import db
    p = await db.products.find_one({"slug": slug}, {"_id": 0})
    if not p:
        return []
    docs = await db.products.find(
        {"category_slug": p["category_slug"], "slug": {"$ne": slug}}, {"_id": 0}
    ).limit(4).to_list(4)
    return docs


@router.post("/products", response_model=Product)
async def create_product(body: ProductInput, _: dict = Depends(require_admin)):
    from server import db
    p = Product(**body.model_dump()).model_dump()
    await db.products.insert_one(p)
    return p


@router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, body: ProductInput, _: dict = Depends(require_admin)):
    from server import db
    updated = await db.products.find_one_and_update(
        {"id": product_id},
        {"$set": body.model_dump()},
        return_document=True,
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Product not found")
    updated.pop("_id", None)
    return updated


@router.delete("/products/{product_id}")
async def delete_product(product_id: str, _: dict = Depends(require_admin)):
    from server import db
    r = await db.products.delete_one({"id": product_id})
    return {"deleted": r.deleted_count}


# -------- Reviews --------
@router.get("/products/{product_id}/reviews", response_model=List[Review])
async def list_reviews(product_id: str):
    from server import db
    return await db.reviews.find({"product_id": product_id}, {"_id": 0}).sort("created_at", -1).to_list(100)


@router.post("/products/{product_id}/reviews", response_model=Review)
async def add_review(product_id: str, body: ReviewInput, user: dict = Depends(get_current_user)):
    from server import db
    review = {
        "id": str(uuid.uuid4()),
        "product_id": product_id,
        "user_id": user["id"],
        "user_name": user["name"],
        "rating": body.rating,
        "title": body.title,
        "body": body.body,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.reviews.insert_one(review)
    # update product rating aggregate
    all_reviews = await db.reviews.find({"product_id": product_id}, {"_id": 0, "rating": 1}).to_list(1000)
    avg = sum(r["rating"] for r in all_reviews) / len(all_reviews)
    await db.products.update_one(
        {"id": product_id},
        {"$set": {"rating": round(avg, 1), "review_count": len(all_reviews)}},
    )
    return review
