from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Literal
from datetime import datetime, timezone
import uuid


def _uid() -> str:
    return str(uuid.uuid4())


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ---------------------- USERS ----------------------
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_uid)
    email: EmailStr
    name: str
    phone: Optional[str] = None
    role: Literal["customer", "admin"] = "customer"
    addresses: List[dict] = Field(default_factory=list)
    wishlist: List[str] = Field(default_factory=list)
    created_at: str = Field(default_factory=_now_iso)


class UserPublic(BaseModel):
    id: str
    email: EmailStr
    name: str
    phone: Optional[str] = None
    role: str
    addresses: List[dict] = []
    wishlist: List[str] = []


class RegisterInput(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: Optional[str] = None


class LoginInput(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    user: UserPublic
    token: str


class AddressInput(BaseModel):
    label: Optional[str] = "Home"
    full_name: str
    phone: str
    line1: str
    line2: Optional[str] = ""
    city: str
    state: str
    pincode: str


# ---------------------- CATEGORIES ----------------------
class Category(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_uid)
    name: str
    slug: str
    description: Optional[str] = ""
    image: Optional[str] = ""


class CategoryInput(BaseModel):
    name: str
    slug: str
    description: Optional[str] = ""
    image: Optional[str] = ""


# ---------------------- PRODUCTS ----------------------
class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_uid)
    name: str
    slug: str
    short_description: str
    description: str
    ingredients: str
    usage: str
    price: float
    mrp: float
    stock: int
    category_slug: str
    ailments: List[str] = Field(default_factory=list)
    images: List[str] = Field(default_factory=list)
    is_bestseller: bool = False
    is_featured: bool = False
    rating: float = 0.0
    review_count: int = 0
    created_at: str = Field(default_factory=_now_iso)


class ProductInput(BaseModel):
    name: str
    slug: str
    short_description: str
    description: str
    ingredients: str
    usage: str
    price: float
    mrp: float
    stock: int
    category_slug: str
    ailments: List[str] = []
    images: List[str] = []
    is_bestseller: bool = False
    is_featured: bool = False


# ---------------------- REVIEWS ----------------------
class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_uid)
    product_id: str
    user_id: str
    user_name: str
    rating: int
    title: str
    body: str
    created_at: str = Field(default_factory=_now_iso)


class ReviewInput(BaseModel):
    rating: int
    title: str
    body: str


# ---------------------- ORDERS ----------------------
class OrderItem(BaseModel):
    product_id: str
    name: str
    price: float
    quantity: int
    image: Optional[str] = ""


class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_uid)
    order_number: str
    user_id: Optional[str] = None
    email: EmailStr
    items: List[OrderItem]
    subtotal: float
    shipping: float
    total: float
    address: dict
    payment_method: Literal["cod", "razorpay"] = "cod"
    payment_status: Literal["pending", "paid", "failed"] = "pending"
    order_status: Literal["placed", "confirmed", "shipped", "delivered", "cancelled"] = "placed"
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    created_at: str = Field(default_factory=_now_iso)


class CheckoutInput(BaseModel):
    email: EmailStr
    items: List[OrderItem]
    address: AddressInput
    payment_method: Literal["cod", "razorpay"] = "cod"


# ---------------------- MISC ----------------------
class HealthCamp(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_uid)
    title: str
    date: str  # YYYY-MM-DD
    time: str
    city: str
    venue: str
    doctor: str
    description: str
    image: Optional[str] = ""
    seats: int = 100
    registered: int = 0


class HealthCampInput(BaseModel):
    title: str
    date: str
    time: str
    city: str
    venue: str
    doctor: str
    description: str
    image: Optional[str] = ""
    seats: int = 100


class CampRegistration(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_uid)
    camp_id: str
    name: str
    phone: str
    email: EmailStr
    age: Optional[int] = None
    notes: Optional[str] = ""
    created_at: str = Field(default_factory=_now_iso)


class CampRegistrationInput(BaseModel):
    camp_id: str
    name: str
    phone: str
    email: EmailStr
    age: Optional[int] = None
    notes: Optional[str] = ""


class DistributorInquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_uid)
    name: str
    phone: str
    email: EmailStr
    city: str
    state: str
    business_type: str
    message: Optional[str] = ""
    created_at: str = Field(default_factory=_now_iso)


class DistributorInquiryInput(BaseModel):
    name: str
    phone: str
    email: EmailStr
    city: str
    state: str
    business_type: str
    message: Optional[str] = ""


class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_uid)
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    subject: str
    message: str
    created_at: str = Field(default_factory=_now_iso)


class ContactMessageInput(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    subject: str
    message: str


class NewsletterInput(BaseModel):
    email: EmailStr
