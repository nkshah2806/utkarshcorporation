"""Seed initial categories, products, and health camps."""
import os
import uuid
from datetime import datetime, timezone, timedelta
from auth_utils import hash_password


CATEGORIES = [
    {"name": "Immunity", "slug": "immunity", "description": "Boost your body's natural defenses.",
     "image": "https://images.unsplash.com/photo-1585328000852-779be6a6582b?crop=entropy&cs=srgb&fm=jpg&q=85&w=800"},
    {"name": "Digestive Health", "slug": "digestive-health", "description": "Support digestion and gut wellness.",
     "image": "https://images.unsplash.com/photo-1525923838299-2312b60f6d69?crop=entropy&cs=srgb&fm=jpg&q=85&w=800"},
    {"name": "Skin Care", "slug": "skin-care", "description": "Natural care for glowing skin.",
     "image": "https://images.unsplash.com/photo-1615485499958-69973683793c?crop=entropy&cs=srgb&fm=jpg&q=85&w=800"},
    {"name": "Supplements", "slug": "supplements", "description": "Everyday herbal supplements.",
     "image": "https://images.unsplash.com/photo-1664786908163-85ca46f85138?crop=entropy&cs=srgb&fm=jpg&q=85&w=800"},
    {"name": "Stress & Sleep", "slug": "stress-sleep", "description": "Calm the mind, restore the body.",
     "image": "https://images.unsplash.com/photo-1492552085122-36706c238263?crop=entropy&cs=srgb&fm=jpg&q=85&w=800"},
    {"name": "Hair Care", "slug": "hair-care", "description": "Nourish roots for stronger hair.",
     "image": "https://images.unsplash.com/photo-1664216294573-b28282de564b?crop=entropy&cs=srgb&fm=jpg&q=85&w=800"},
]

_IMG_A = "https://images.unsplash.com/photo-1664786908163-85ca46f85138?crop=entropy&cs=srgb&fm=jpg&q=85&w=800"
_IMG_B = "https://images.unsplash.com/photo-1664216294580-079bc527ae49?crop=entropy&cs=srgb&fm=jpg&q=85&w=800"
_IMG_C = "https://images.unsplash.com/photo-1664216294573-b28282de564b?crop=entropy&cs=srgb&fm=jpg&q=85&w=800"
_IMG_D = "https://images.unsplash.com/photo-1615485499958-69973683793c?crop=entropy&cs=srgb&fm=jpg&q=85&w=800"
_IMG_E = "https://images.unsplash.com/photo-1585328000852-779be6a6582b?crop=entropy&cs=srgb&fm=jpg&q=85&w=800"
_IMG_F = "https://images.unsplash.com/photo-1525923838299-2312b60f6d69?crop=entropy&cs=srgb&fm=jpg&q=85&w=800"


PRODUCTS = [
    {
        "name": "Ashwagandha Root Capsules",
        "slug": "ashwagandha-root-capsules",
        "short_description": "Adaptogenic root to reduce stress and boost stamina.",
        "description": "Our Ashwagandha capsules are made from pure KSM-66 root extract, an ancient Ayurvedic adaptogen known to help the body manage stress, improve energy, and support restful sleep. Each capsule delivers 500mg of standardized extract.",
        "ingredients": "Ashwagandha (Withania somnifera) Root Extract 500mg, Vegetarian Capsule Shell.",
        "usage": "Take 1-2 capsules daily after meals or as directed by an Ayurvedic practitioner.",
        "price": 449, "mrp": 599, "stock": 120,
        "category_slug": "stress-sleep",
        "ailments": ["Stress", "Fatigue", "Sleep"],
        "images": [_IMG_A, _IMG_B, _IMG_C],
        "is_bestseller": True, "is_featured": True,
    },
    {
        "name": "Chyawanprash Classic",
        "slug": "chyawanprash-classic",
        "short_description": "Time-honored herbal jam for daily immunity.",
        "description": "A traditional preparation of 40+ herbs, honey, ghee, and amla — the ultimate daily immunity tonic for the whole family.",
        "ingredients": "Amla, Ashwagandha, Bala, Pippali, Ghee, Honey, and 35+ classical herbs.",
        "usage": "1-2 teaspoons daily with warm milk, morning and night.",
        "price": 349, "mrp": 449, "stock": 90,
        "category_slug": "immunity",
        "ailments": ["Immunity", "Weakness", "Cold"],
        "images": [_IMG_E, _IMG_A, _IMG_F],
        "is_bestseller": True, "is_featured": True,
    },
    {
        "name": "Triphala Churna",
        "slug": "triphala-churna",
        "short_description": "Classic digestive & detoxifying blend.",
        "description": "Triphala — the ancient trio of Amla, Bibhitaki, and Haritaki — gently cleanses the digestive system, supports regular bowel movement, and rejuvenates tissues.",
        "ingredients": "Amla, Bibhitaki, Haritaki (equal parts).",
        "usage": "1 tsp with warm water at bedtime.",
        "price": 199, "mrp": 259, "stock": 200,
        "category_slug": "digestive-health",
        "ailments": ["Digestion", "Detox", "Constipation"],
        "images": [_IMG_F, _IMG_E, _IMG_B],
        "is_bestseller": True, "is_featured": False,
    },
    {
        "name": "Tulsi Drops",
        "slug": "tulsi-drops",
        "short_description": "Concentrated 5-tulsi extract for respiratory wellness.",
        "description": "A potent liquid extract of five varieties of holy basil to support respiratory health and daily immunity. Add to water or tea.",
        "ingredients": "Rama, Krishna, Vana, Kapoor, Bisva Tulsi extracts.",
        "usage": "3-5 drops in a glass of water twice a day.",
        "price": 249, "mrp": 299, "stock": 150,
        "category_slug": "immunity",
        "ailments": ["Cough", "Cold", "Immunity"],
        "images": [_IMG_B, _IMG_A, _IMG_D],
        "is_bestseller": False, "is_featured": True,
    },
    {
        "name": "Brahmi Memory Booster",
        "slug": "brahmi-memory-booster",
        "short_description": "Support focus, calmness and memory.",
        "description": "Brahmi (Bacopa monnieri) is a nervine tonic celebrated in Ayurveda for improving focus, memory, and mental clarity.",
        "ingredients": "Brahmi Extract 250mg per capsule.",
        "usage": "1 capsule twice daily after meals.",
        "price": 379, "mrp": 499, "stock": 85,
        "category_slug": "stress-sleep",
        "ailments": ["Memory", "Focus", "Anxiety"],
        "images": [_IMG_C, _IMG_A, _IMG_B],
        "is_bestseller": False, "is_featured": True,
    },
    {
        "name": "Neem & Turmeric Face Wash",
        "slug": "neem-turmeric-face-wash",
        "short_description": "Purifying daily wash for clear skin.",
        "description": "A soap-free cleanser with neem, turmeric, and aloe vera to purify pores and calm blemish-prone skin naturally.",
        "ingredients": "Neem, Turmeric, Aloe Vera, Coconut-derived Surfactants.",
        "usage": "Massage on wet face, rinse. Use twice daily.",
        "price": 199, "mrp": 279, "stock": 300,
        "category_slug": "skin-care",
        "ailments": ["Acne", "Oily Skin"],
        "images": [_IMG_D, _IMG_E, _IMG_C],
        "is_bestseller": True, "is_featured": False,
    },
    {
        "name": "Kumkumadi Radiance Oil",
        "slug": "kumkumadi-radiance-oil",
        "short_description": "Classical rejuvenating facial oil.",
        "description": "A luxurious blend of saffron, sandalwood, and 16 herbs steeped in sesame oil — the ancient elixir for radiant skin.",
        "ingredients": "Saffron, Sandalwood, Manjistha, Lotus, Sesame Oil base.",
        "usage": "Apply 3-4 drops on cleansed face at night, massage gently.",
        "price": 799, "mrp": 999, "stock": 60,
        "category_slug": "skin-care",
        "ailments": ["Glow", "Pigmentation", "Anti-aging"],
        "images": [_IMG_D, _IMG_B, _IMG_C],
        "is_bestseller": False, "is_featured": True,
    },
    {
        "name": "Amla Juice",
        "slug": "amla-juice",
        "short_description": "Cold-pressed Indian gooseberry juice.",
        "description": "Rich in natural Vitamin C, Amla juice supports immunity, digestion, and hair health. No added sugar.",
        "ingredients": "100% Fresh Amla Juice.",
        "usage": "30ml with equal water on empty stomach.",
        "price": 299, "mrp": 379, "stock": 140,
        "category_slug": "immunity",
        "ailments": ["Immunity", "Hair", "Digestion"],
        "images": [_IMG_E, _IMG_F, _IMG_A],
        "is_bestseller": False, "is_featured": False,
    },
    {
        "name": "Bhringraj Hair Oil",
        "slug": "bhringraj-hair-oil",
        "short_description": "Nourishes scalp, strengthens roots.",
        "description": "A classical hair oil infused with Bhringraj, Amla, and Brahmi. Traditionally used to combat hair fall and premature greying.",
        "ingredients": "Bhringraj, Amla, Brahmi, Coconut Oil, Sesame Oil.",
        "usage": "Massage into scalp 2-3 times a week, leave overnight.",
        "price": 349, "mrp": 449, "stock": 110,
        "category_slug": "hair-care",
        "ailments": ["Hair Fall", "Dandruff", "Greying"],
        "images": [_IMG_C, _IMG_A, _IMG_D],
        "is_bestseller": True, "is_featured": True,
    },
    {
        "name": "Giloy Tablets",
        "slug": "giloy-tablets",
        "short_description": "Amrita — the elixir of immunity.",
        "description": "Giloy (Tinospora cordifolia) is renowned in Ayurveda as an immunity booster and natural detoxifier. Tablets are convenient for daily use.",
        "ingredients": "Giloy Stem Extract 500mg per tablet.",
        "usage": "1-2 tablets twice a day after meals.",
        "price": 259, "mrp": 349, "stock": 180,
        "category_slug": "immunity",
        "ailments": ["Fever", "Immunity", "Detox"],
        "images": [_IMG_A, _IMG_B, _IMG_C],
        "is_bestseller": False, "is_featured": False,
    },
    {
        "name": "Aloe Vera Gel",
        "slug": "aloe-vera-gel",
        "short_description": "Pure aloe gel for skin and hair.",
        "description": "Cold-pressed pure aloe vera gel — soothes irritated skin, hydrates, and can be used as a natural hair conditioner.",
        "ingredients": "99% Pure Aloe Vera, Natural Preservatives.",
        "usage": "Apply as needed on skin or scalp.",
        "price": 179, "mrp": 249, "stock": 220,
        "category_slug": "skin-care",
        "ailments": ["Dry Skin", "Sunburn"],
        "images": [_IMG_D, _IMG_E, _IMG_F],
        "is_bestseller": False, "is_featured": False,
    },
    {
        "name": "Shatavari Capsules",
        "slug": "shatavari-capsules",
        "short_description": "Women's wellness & hormonal balance.",
        "description": "Shatavari is celebrated in Ayurveda as the queen of herbs for women. Supports hormonal balance, energy and vitality.",
        "ingredients": "Shatavari Root Extract 500mg.",
        "usage": "1 capsule twice a day with milk.",
        "price": 429, "mrp": 549, "stock": 95,
        "category_slug": "supplements",
        "ailments": ["Women's Health", "Hormones"],
        "images": [_IMG_A, _IMG_C, _IMG_B],
        "is_bestseller": False, "is_featured": True,
    },
    {
        "name": "Turmeric Curcumin Plus",
        "slug": "turmeric-curcumin-plus",
        "short_description": "High-potency curcumin with black pepper.",
        "description": "Standardized 95% curcumin extract enhanced with black pepper for maximum absorption — a natural anti-inflammatory.",
        "ingredients": "Curcumin 500mg, BioPerine 5mg.",
        "usage": "1 capsule twice daily after meals.",
        "price": 549, "mrp": 699, "stock": 100,
        "category_slug": "supplements",
        "ailments": ["Inflammation", "Joint Pain"],
        "images": [_IMG_B, _IMG_A, _IMG_D],
        "is_bestseller": True, "is_featured": False,
    },
    {
        "name": "Ajwain Digestive Drops",
        "slug": "ajwain-digestive-drops",
        "short_description": "Instant relief from gas & bloating.",
        "description": "A traditional carminative blend of ajwain, hing, and mint that quickly relieves gas, bloating, and indigestion.",
        "ingredients": "Ajwain, Hing, Mint, Fennel Oils.",
        "usage": "5-10 drops in warm water after meals.",
        "price": 149, "mrp": 199, "stock": 260,
        "category_slug": "digestive-health",
        "ailments": ["Gas", "Bloating", "Indigestion"],
        "images": [_IMG_F, _IMG_B, _IMG_A],
        "is_bestseller": False, "is_featured": False,
    },
    {
        "name": "Arjuna Heart Tonic",
        "slug": "arjuna-heart-tonic",
        "short_description": "Traditional heart & circulation support.",
        "description": "Arjuna bark, mentioned in Charaka Samhita, is a classical Ayurvedic cardiotonic supporting healthy heart function and circulation.",
        "ingredients": "Arjuna Bark Extract 500mg.",
        "usage": "1 tablet twice daily with warm water.",
        "price": 499, "mrp": 649, "stock": 70,
        "category_slug": "supplements",
        "ailments": ["Heart Health", "Circulation"],
        "images": [_IMG_C, _IMG_E, _IMG_B],
        "is_bestseller": False, "is_featured": False,
    },
    {
        "name": "Herbal Sleep Tea",
        "slug": "herbal-sleep-tea",
        "short_description": "Chamomile, tulsi & jatamansi calming tea.",
        "description": "A soothing bedtime herbal tea to calm the mind and prepare the body for restful sleep. Caffeine-free.",
        "ingredients": "Chamomile, Tulsi, Jatamansi, Lavender.",
        "usage": "Steep 1 tea bag in hot water for 5 min before bed.",
        "price": 229, "mrp": 299, "stock": 160,
        "category_slug": "stress-sleep",
        "ailments": ["Sleep", "Anxiety"],
        "images": [_IMG_E, _IMG_D, _IMG_F],
        "is_bestseller": False, "is_featured": True,
    },
    {
        "name": "Kesh Growth Serum",
        "slug": "kesh-growth-serum",
        "short_description": "Herbal serum for visibly thicker hair.",
        "description": "A leave-in serum with bhringraj, rosemary & castor for stimulating scalp circulation and encouraging hair growth.",
        "ingredients": "Bhringraj, Rosemary, Castor, Amla.",
        "usage": "Apply on scalp daily and massage.",
        "price": 599, "mrp": 799, "stock": 85,
        "category_slug": "hair-care",
        "ailments": ["Hair Growth", "Thinning"],
        "images": [_IMG_D, _IMG_C, _IMG_A],
        "is_bestseller": False, "is_featured": True,
    },
    {
        "name": "Guduchi Immunity Kadha",
        "slug": "guduchi-immunity-kadha",
        "short_description": "Traditional immunity concoction.",
        "description": "A ready-to-brew classical kadha with 8 herbs including Giloy, Tulsi, Ginger, Mulethi — perfect for daily immunity.",
        "ingredients": "Giloy, Tulsi, Ginger, Mulethi, Clove, Cinnamon, Black Pepper, Cardamom.",
        "usage": "1 tsp in a cup of boiling water, steep 5 min.",
        "price": 289, "mrp": 379, "stock": 130,
        "category_slug": "immunity",
        "ailments": ["Immunity", "Cold", "Cough"],
        "images": [_IMG_F, _IMG_A, _IMG_E],
        "is_bestseller": True, "is_featured": False,
    },
]


def _future_date(days: int) -> str:
    return (datetime.now(timezone.utc) + timedelta(days=days)).strftime("%Y-%m-%d")


HEALTH_CAMPS = [
    {
        "title": "Free Ayurvedic Wellness Camp",
        "date": _future_date(10), "time": "10:00 AM - 4:00 PM",
        "city": "Mumbai", "venue": "Community Hall, Andheri West",
        "doctor": "Dr. Anjali Sharma (BAMS)",
        "description": "Free consultations, pulse diagnosis (Nadi Pariksha), and personalized dosha assessment.",
        "image": "https://images.unsplash.com/photo-1492552085122-36706c238263?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
        "seats": 80,
    },
    {
        "title": "Diabetes Awareness & Ayurveda",
        "date": _future_date(24), "time": "9:00 AM - 1:00 PM",
        "city": "Pune", "venue": "Ayush Bhavan, Shivaji Nagar",
        "doctor": "Dr. Rakesh Deshmukh (MD Ayurveda)",
        "description": "Learn how classical Ayurvedic dietary and lifestyle interventions help manage blood sugar.",
        "image": "https://images.unsplash.com/photo-1615485499958-69973683793c?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
        "seats": 60,
    },
    {
        "title": "Women's Health Camp",
        "date": _future_date(38), "time": "11:00 AM - 5:00 PM",
        "city": "Delhi", "venue": "Green Park Community Center",
        "doctor": "Dr. Priya Menon (BAMS)",
        "description": "Focus on hormonal wellness, PCOS, menstrual health and post-natal care with Ayurveda.",
        "image": "https://images.unsplash.com/photo-1525923838299-2312b60f6d69?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
        "seats": 70,
    },
    {
        "title": "Rural Health Outreach Program",
        "date": _future_date(52), "time": "8:00 AM - 3:00 PM",
        "city": "Nashik", "venue": "Village Panchayat, Sinnar",
        "doctor": "Team of 4 Ayurvedic Doctors",
        "description": "Free medical consultation, blood pressure check, and Ayurvedic medicine distribution.",
        "image": "https://images.unsplash.com/photo-1585328000852-779be6a6582b?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
        "seats": 200,
    },
]


async def seed_all(db):
    # Categories
    if await db.categories.count_documents({}) == 0:
        docs = []
        for c in CATEGORIES:
            docs.append({"id": str(uuid.uuid4()), **c})
        await db.categories.insert_many(docs)

    # Products
    if await db.products.count_documents({}) == 0:
        docs = []
        for p in PRODUCTS:
            docs.append({
                "id": str(uuid.uuid4()),
                **p,
                "rating": 4.5,
                "review_count": 0,
                "created_at": datetime.now(timezone.utc).isoformat(),
            })
        await db.products.insert_many(docs)

    # Health Camps
    if await db.health_camps.count_documents({}) == 0:
        docs = []
        for c in HEALTH_CAMPS:
            docs.append({"id": str(uuid.uuid4()), "registered": 0, **c})
        await db.health_camps.insert_many(docs)

    # Admin user
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@utkarshcorp.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "Admin@123")
    existing = await db.users.find_one({"email": admin_email})
    if not existing:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "name": "Utkarsh Admin",
            "phone": None,
            "role": "admin",
            "password_hash": hash_password(admin_password),
            "addresses": [],
            "wishlist": [],
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    else:
        from auth_utils import verify_password
        if not verify_password(admin_password, existing["password_hash"]):
            await db.users.update_one(
                {"email": admin_email},
                {"$set": {"password_hash": hash_password(admin_password), "role": "admin"}},
            )
