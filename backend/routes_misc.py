from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models import (
    HealthCamp, HealthCampInput, CampRegistration, CampRegistrationInput,
    DistributorInquiry, DistributorInquiryInput,
    ContactMessage, ContactMessageInput, NewsletterInput,
)
from auth_utils import require_admin
import uuid
from datetime import datetime, timezone

router = APIRouter(prefix="/api", tags=["misc"])


# -------- Health Camps --------
@router.get("/health-camps", response_model=List[HealthCamp])
async def list_camps():
    from server import db
    return await db.health_camps.find({}, {"_id": 0}).sort("date", 1).to_list(200)


@router.post("/health-camps", response_model=HealthCamp)
async def create_camp(body: HealthCampInput, _: dict = Depends(require_admin)):
    from server import db
    c = HealthCamp(**body.model_dump()).model_dump()
    await db.health_camps.insert_one(c)
    return c


@router.delete("/health-camps/{camp_id}")
async def delete_camp(camp_id: str, _: dict = Depends(require_admin)):
    from server import db
    r = await db.health_camps.delete_one({"id": camp_id})
    return {"deleted": r.deleted_count}


@router.post("/health-camps/register", response_model=CampRegistration)
async def register_camp(body: CampRegistrationInput):
    from server import db
    camp = await db.health_camps.find_one({"id": body.camp_id})
    if not camp:
        raise HTTPException(status_code=404, detail="Camp not found")
    reg = {
        "id": str(uuid.uuid4()),
        "camp_id": body.camp_id,
        "name": body.name,
        "phone": body.phone,
        "email": body.email.lower(),
        "age": body.age,
        "notes": body.notes,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.camp_registrations.insert_one(reg)
    await db.health_camps.update_one({"id": body.camp_id}, {"$inc": {"registered": 1}})
    return reg


# -------- Distributor Inquiries --------
@router.post("/distributor-inquiries", response_model=DistributorInquiry)
async def create_distributor_inquiry(body: DistributorInquiryInput):
    from server import db
    d = DistributorInquiry(**body.model_dump()).model_dump()
    d["email"] = d["email"].lower()
    await db.distributor_inquiries.insert_one(d)
    return d


@router.get("/admin/distributor-inquiries", response_model=List[DistributorInquiry])
async def list_distributor(_: dict = Depends(require_admin)):
    from server import db
    return await db.distributor_inquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)


# -------- Contact Messages --------
@router.post("/contact", response_model=ContactMessage)
async def create_contact(body: ContactMessageInput):
    from server import db
    c = ContactMessage(**body.model_dump()).model_dump()
    c["email"] = c["email"].lower()
    await db.contact_messages.insert_one(c)
    return c


@router.get("/admin/contact-messages", response_model=List[ContactMessage])
async def list_contact(_: dict = Depends(require_admin)):
    from server import db
    return await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)


# -------- Newsletter --------
@router.post("/newsletter")
async def newsletter(body: NewsletterInput):
    from server import db
    email = body.email.lower()
    existing = await db.newsletter.find_one({"email": email})
    if existing:
        return {"ok": True, "already_subscribed": True}
    await db.newsletter.insert_one({"email": email, "created_at": datetime.now(timezone.utc).isoformat()})
    return {"ok": True, "already_subscribed": False}


# -------- Admin stats --------
@router.get("/admin/stats")
async def admin_stats(_: dict = Depends(require_admin)):
    from server import db
    products = await db.products.count_documents({})
    orders = await db.orders.count_documents({})
    paid_orders = await db.orders.find({"payment_status": "paid"}, {"_id": 0, "total": 1}).to_list(2000)
    cod_orders = await db.orders.find({"payment_method": "cod"}, {"_id": 0, "total": 1}).to_list(2000)
    revenue = sum(o["total"] for o in paid_orders) + sum(o["total"] for o in cod_orders)
    users = await db.users.count_documents({"role": "customer"})
    camps = await db.health_camps.count_documents({})
    return {
        "products": products,
        "orders": orders,
        "customers": users,
        "revenue": round(revenue, 2),
        "camps": camps,
    }
