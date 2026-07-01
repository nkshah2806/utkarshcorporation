from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models import Order, CheckoutInput
from auth_utils import optional_user, require_admin, get_current_user
import uuid
import os
import random
import string
from datetime import datetime, timezone

router = APIRouter(prefix="/api", tags=["orders"])


def _gen_order_number() -> str:
    return "UC-" + "".join(random.choices(string.ascii_uppercase + string.digits, k=8))


def _shipping_charge(subtotal: float) -> float:
    threshold = float(os.environ.get("FREE_SHIPPING_THRESHOLD", "499"))
    return 0.0 if subtotal >= threshold else 49.0


@router.post("/checkout", response_model=Order)
async def checkout(body: CheckoutInput, user: dict | None = Depends(optional_user)):
    from server import db
    if not body.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # revalidate items against DB
    validated_items = []
    subtotal = 0.0
    for item in body.items:
        product = await db.products.find_one({"id": item.product_id}, {"_id": 0})
        if not product:
            raise HTTPException(status_code=400, detail=f"Product not found: {item.name}")
        if product["stock"] < item.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product['name']}")
        line = {
            "product_id": product["id"],
            "name": product["name"],
            "price": product["price"],
            "quantity": item.quantity,
            "image": (product.get("images") or [""])[0],
        }
        subtotal += product["price"] * item.quantity
        validated_items.append(line)

    shipping = _shipping_charge(subtotal)
    total = subtotal + shipping

    order = {
        "id": str(uuid.uuid4()),
        "order_number": _gen_order_number(),
        "user_id": user["id"] if user else None,
        "email": body.email.lower(),
        "items": validated_items,
        "subtotal": round(subtotal, 2),
        "shipping": shipping,
        "total": round(total, 2),
        "address": body.address.model_dump(),
        "payment_method": body.payment_method,
        "payment_status": "pending",
        "order_status": "placed",
        "razorpay_order_id": None,
        "razorpay_payment_id": None,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    # For Razorpay (mocked): generate a fake razorpay_order_id
    if body.payment_method == "razorpay":
        order["razorpay_order_id"] = "rzp_mock_" + "".join(random.choices(string.ascii_lowercase + string.digits, k=14))

    await db.orders.insert_one(order)

    # decrement stock
    for it in validated_items:
        await db.products.update_one({"id": it["product_id"]}, {"$inc": {"stock": -it["quantity"]}})

    order.pop("_id", None)
    return order


@router.post("/orders/{order_id}/mock-pay", response_model=Order)
async def mock_pay(order_id: str):
    """Mock Razorpay payment success - marks order as paid."""
    from server import db
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order["payment_method"] != "razorpay":
        raise HTTPException(status_code=400, detail="Not a Razorpay order")
    payment_id = "pay_mock_" + "".join(random.choices(string.ascii_lowercase + string.digits, k=14))
    await db.orders.update_one(
        {"id": order_id},
        {"$set": {"payment_status": "paid", "razorpay_payment_id": payment_id, "order_status": "confirmed"}},
    )
    updated = await db.orders.find_one({"id": order_id}, {"_id": 0})
    return updated


@router.get("/orders/mine", response_model=List[Order])
async def my_orders(user: dict = Depends(get_current_user)):
    from server import db
    return await db.orders.find({"user_id": user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(200)


@router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    from server import db
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


# ---------- Admin ----------
@router.get("/admin/orders", response_model=List[Order])
async def admin_list_orders(_: dict = Depends(require_admin)):
    from server import db
    return await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)


@router.put("/admin/orders/{order_id}/status", response_model=Order)
async def admin_update_status(order_id: str, status: str, _: dict = Depends(require_admin)):
    from server import db
    allowed = {"placed", "confirmed", "shipped", "delivered", "cancelled"}
    if status not in allowed:
        raise HTTPException(status_code=400, detail="Invalid status")
    r = await db.orders.find_one_and_update(
        {"id": order_id}, {"$set": {"order_status": status}}, return_document=True
    )
    if not r:
        raise HTTPException(status_code=404, detail="Order not found")
    r.pop("_id", None)
    return r
