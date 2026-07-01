from fastapi import APIRouter, HTTPException, Depends
from models import RegisterInput, LoginInput, AuthResponse, UserPublic, AddressInput
from auth_utils import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _user_public(u: dict) -> dict:
    return {
        "id": u["id"],
        "email": u["email"],
        "name": u["name"],
        "phone": u.get("phone"),
        "role": u.get("role", "customer"),
        "addresses": u.get("addresses", []),
        "wishlist": u.get("wishlist", []),
    }


@router.post("/register", response_model=AuthResponse)
async def register(body: RegisterInput):
    from server import db
    email = body.email.lower()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    import uuid
    from datetime import datetime, timezone
    user_doc = {
        "id": str(uuid.uuid4()),
        "email": email,
        "name": body.name,
        "phone": body.phone,
        "role": "customer",
        "password_hash": hash_password(body.password),
        "addresses": [],
        "wishlist": [],
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(user_doc)
    token = create_access_token(user_doc["id"], email, "customer")
    return {"user": _user_public(user_doc), "token": token}


@router.post("/login", response_model=AuthResponse)
async def login(body: LoginInput):
    from server import db
    email = body.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], email, user.get("role", "customer"))
    return {"user": _user_public(user), "token": token}


@router.get("/me", response_model=UserPublic)
async def me(user: dict = Depends(get_current_user)):
    return _user_public(user)


@router.post("/addresses", response_model=UserPublic)
async def add_address(body: AddressInput, user: dict = Depends(get_current_user)):
    from server import db
    import uuid
    address = body.model_dump()
    address["id"] = str(uuid.uuid4())
    await db.users.update_one({"id": user["id"]}, {"$push": {"addresses": address}})
    updated = await db.users.find_one({"id": user["id"]}, {"_id": 0, "password_hash": 0})
    return _user_public(updated)


@router.delete("/addresses/{address_id}", response_model=UserPublic)
async def delete_address(address_id: str, user: dict = Depends(get_current_user)):
    from server import db
    await db.users.update_one({"id": user["id"]}, {"$pull": {"addresses": {"id": address_id}}})
    updated = await db.users.find_one({"id": user["id"]}, {"_id": 0, "password_hash": 0})
    return _user_public(updated)


@router.post("/wishlist/{product_id}", response_model=UserPublic)
async def toggle_wishlist(product_id: str, user: dict = Depends(get_current_user)):
    from server import db
    current = user.get("wishlist", [])
    if product_id in current:
        await db.users.update_one({"id": user["id"]}, {"$pull": {"wishlist": product_id}})
    else:
        await db.users.update_one({"id": user["id"]}, {"$addToSet": {"wishlist": product_id}})
    updated = await db.users.find_one({"id": user["id"]}, {"_id": 0, "password_hash": 0})
    return _user_public(updated)
