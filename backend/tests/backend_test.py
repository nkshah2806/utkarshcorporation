"""
Backend regression tests for Utkarsh Corporation e-commerce API.
Covers: catalog, auth (JWT), checkout (COD + mocked Razorpay), reviews,
health camps, distributor inquiries, contact, newsletter, admin endpoints.
"""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get(
    "REACT_APP_BACKEND_URL",
    "https://herbal-commerce-10.preview.emergentagent.com",
).rstrip("/")
API = f"{BASE_URL}/api"


# ---------------- Fixtures ----------------
@pytest.fixture(scope="session")
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


@pytest.fixture(scope="session")
def admin_token(s):
    r = s.post(f"{API}/auth/login", json={"email": "admin@utkarshcorp.com", "password": "Admin@123"})
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    data = r.json()
    assert data["user"]["role"] == "admin"
    return data["token"]


@pytest.fixture(scope="session")
def customer(s):
    email = f"TEST_cust_{uuid.uuid4().hex[:8]}@test.com"
    r = s.post(f"{API}/auth/register", json={
        "email": email, "password": "Test@1234", "name": "TEST Customer", "phone": "9999900000",
    })
    assert r.status_code == 200, r.text
    data = r.json()
    return {"email": email, "token": data["token"], "id": data["user"]["id"]}


# ---------------- Health / Root ----------------
class TestRoot:
    def test_root(self, s):
        r = s.get(f"{API}/")
        assert r.status_code == 200
        assert r.json().get("status") == "ok"


# ---------------- Catalog ----------------
class TestCatalog:
    def test_categories_seeded(self, s):
        r = s.get(f"{API}/categories")
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 6, f"Expected 6 seeded categories, got {len(data)}"
        for c in data:
            assert "slug" in c and "name" in c

    def test_products_seeded(self, s):
        r = s.get(f"{API}/products")
        assert r.status_code == 200
        data = r.json()
        assert len(data) >= 18, f"Expected >=18 seeded products, got {len(data)}"

    def test_products_category_filter(self, s):
        cats = s.get(f"{API}/categories").json()
        slug = cats[0]["slug"]
        r = s.get(f"{API}/products", params={"category": slug})
        assert r.status_code == 200
        for p in r.json():
            assert p["category_slug"] == slug

    def test_products_price_filter_sort(self, s):
        r = s.get(f"{API}/products", params={"min_price": 100, "max_price": 2000, "sort": "price_asc"})
        assert r.status_code == 200
        data = r.json()
        prices = [p["price"] for p in data]
        assert prices == sorted(prices)
        for p in prices:
            assert 100 <= p <= 2000

    def test_products_search_q(self, s):
        r = s.get(f"{API}/products", params={"q": "ashwagandha"})
        assert r.status_code == 200
        assert len(r.json()) >= 1

    def test_search_suggest(self, s):
        r = s.get(f"{API}/products/search-suggest", params={"q": "ash"})
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_product_detail_and_related(self, s):
        prods = s.get(f"{API}/products").json()
        slug = prods[0]["slug"]
        r = s.get(f"{API}/products/{slug}")
        assert r.status_code == 200
        assert r.json()["slug"] == slug
        rel = s.get(f"{API}/products/{slug}/related")
        assert rel.status_code == 200
        assert isinstance(rel.json(), list)

    def test_product_not_found(self, s):
        r = s.get(f"{API}/products/does-not-exist-xyz")
        assert r.status_code == 404


# ---------------- Auth ----------------
class TestAuth:
    def test_register_duplicate(self, s, customer):
        r = s.post(f"{API}/auth/register", json={
            "email": customer["email"], "password": "Test@1234", "name": "Dup",
        })
        assert r.status_code == 400

    def test_login_admin_role(self, s):
        r = s.post(f"{API}/auth/login", json={"email": "admin@utkarshcorp.com", "password": "Admin@123"})
        assert r.status_code == 200
        assert r.json()["user"]["role"] == "admin"

    def test_login_invalid(self, s):
        r = s.post(f"{API}/auth/login", json={"email": "admin@utkarshcorp.com", "password": "WRONG"})
        assert r.status_code == 401

    def test_me_requires_token(self, s):
        r = s.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_me_with_bearer(self, s, customer):
        r = s.get(f"{API}/auth/me", headers={"Authorization": f"Bearer {customer['token']}"})
        assert r.status_code == 200
        assert r.json()["email"] == customer["email"].lower()


# ---------------- Checkout (COD + mocked Razorpay) ----------------
class TestCheckout:
    def _payload(self, s, email, method="cod"):
        prod = s.get(f"{API}/products").json()[0]
        return {
            "email": email,
            "items": [{
                "product_id": prod["id"], "name": prod["name"], "price": prod["price"],
                "quantity": 1, "image": (prod.get("images") or [""])[0],
            }],
            "address": {
                "label": "Home", "full_name": "Test", "phone": "9999900000",
                "line1": "1 Main", "line2": "", "city": "Pune", "state": "MH", "pincode": "411001",
            },
            "payment_method": method,
        }

    def test_checkout_cod(self, s, customer):
        payload = self._payload(s, customer["email"], "cod")
        prod_id = payload["items"][0]["product_id"]
        pre_stock = s.get(f"{API}/products", params={}).json()
        pre = next(p for p in pre_stock if p["id"] == prod_id)["stock"]

        r = s.post(f"{API}/checkout", json=payload,
                   headers={"Authorization": f"Bearer {customer['token']}"})
        assert r.status_code == 200, r.text
        order = r.json()
        assert order["order_number"].startswith("UC-")
        assert order["payment_method"] == "cod"
        assert order["order_status"] == "placed"

        post = next(p for p in s.get(f"{API}/products").json() if p["id"] == prod_id)["stock"]
        assert post == pre - 1, "Stock did not decrement"
        pytest.cod_order_id = order["id"]

    def test_checkout_razorpay_mock_pay(self, s, customer):
        payload = self._payload(s, customer["email"], "razorpay")
        r = s.post(f"{API}/checkout", json=payload,
                   headers={"Authorization": f"Bearer {customer['token']}"})
        assert r.status_code == 200
        order = r.json()
        assert order["razorpay_order_id"] and order["razorpay_order_id"].startswith("rzp_mock_")

        rp = s.post(f"{API}/orders/{order['id']}/mock-pay")
        assert rp.status_code == 200
        paid = rp.json()
        assert paid["payment_status"] == "paid"
        assert paid["order_status"] == "confirmed"
        assert paid["razorpay_payment_id"].startswith("pay_mock_")

    def test_checkout_empty_cart(self, s, customer):
        r = s.post(f"{API}/checkout", json={
            "email": customer["email"], "items": [],
            "address": {"full_name": "T", "phone": "9", "line1": "1", "city": "P", "state": "M", "pincode": "1"},
            "payment_method": "cod",
        })
        assert r.status_code == 400

    def test_my_orders(self, s, customer):
        r = s.get(f"{API}/orders/mine", headers={"Authorization": f"Bearer {customer['token']}"})
        assert r.status_code == 200
        assert len(r.json()) >= 2


# ---------------- Reviews ----------------
class TestReviews:
    def test_add_review_updates_aggregate(self, s, customer):
        prod = s.get(f"{API}/products").json()[1]
        pid = prod["id"]
        pre_count = prod["review_count"]

        r = s.post(f"{API}/products/{pid}/reviews",
                   json={"rating": 5, "title": "TEST Great", "body": "Very effective"},
                   headers={"Authorization": f"Bearer {customer['token']}"})
        assert r.status_code == 200, r.text
        rv = r.json()
        assert rv["rating"] == 5

        updated = s.get(f"{API}/products/{prod['slug']}").json()
        assert updated["review_count"] == pre_count + 1
        assert updated["rating"] > 0

    def test_review_requires_auth(self, s):
        prod = s.get(f"{API}/products").json()[0]
        r = s.post(f"{API}/products/{prod['id']}/reviews",
                   json={"rating": 4, "title": "x", "body": "y"})
        assert r.status_code == 401


# ---------------- Misc: distributor, contact, newsletter, camps ----------------
class TestMisc:
    def test_distributor_inquiry(self, s):
        r = s.post(f"{API}/distributor-inquiries", json={
            "name": "TEST Distri", "phone": "9998887777", "email": "TEST_d@x.com",
            "city": "Pune", "state": "MH", "business_type": "Retail", "message": "hi",
        })
        assert r.status_code == 200
        assert r.json()["email"] == "test_d@x.com"

    def test_contact(self, s):
        r = s.post(f"{API}/contact", json={
            "name": "TEST", "email": "TEST_c@x.com", "subject": "Hi", "message": "Hello",
        })
        assert r.status_code == 200

    def test_newsletter(self, s):
        email = f"TEST_nl_{uuid.uuid4().hex[:6]}@x.com"
        r = s.post(f"{API}/newsletter", json={"email": email})
        assert r.status_code == 200
        assert r.json()["already_subscribed"] is False
        r2 = s.post(f"{API}/newsletter", json={"email": email})
        assert r2.json()["already_subscribed"] is True

    def test_health_camps_list(self, s):
        r = s.get(f"{API}/health-camps")
        assert r.status_code == 200
        assert len(r.json()) >= 4

    def test_camp_register_increments(self, s):
        camps = s.get(f"{API}/health-camps").json()
        camp = camps[0]
        pre = camp["registered"]
        r = s.post(f"{API}/health-camps/register", json={
            "camp_id": camp["id"], "name": "TEST", "phone": "9998887777",
            "email": "TEST_camp@x.com", "age": 30, "notes": "",
        })
        assert r.status_code == 200
        post = next(c for c in s.get(f"{API}/health-camps").json() if c["id"] == camp["id"])["registered"]
        assert post == pre + 1


# ---------------- Admin ----------------
class TestAdmin:
    def test_admin_stats_requires_admin(self, s, customer):
        r = s.get(f"{API}/admin/stats", headers={"Authorization": f"Bearer {customer['token']}"})
        assert r.status_code == 403
        r2 = s.get(f"{API}/admin/stats")
        assert r2.status_code == 401

    def test_admin_stats(self, s, admin_token):
        r = s.get(f"{API}/admin/stats", headers={"Authorization": f"Bearer {admin_token}"})
        assert r.status_code == 200
        d = r.json()
        for k in ["products", "orders", "customers", "revenue", "camps"]:
            assert k in d

    def test_admin_orders_list(self, s, admin_token):
        r = s.get(f"{API}/admin/orders", headers={"Authorization": f"Bearer {admin_token}"})
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_admin_distributor_inquiries(self, s, admin_token):
        r = s.get(f"{API}/admin/distributor-inquiries", headers={"Authorization": f"Bearer {admin_token}"})
        assert r.status_code == 200

    def test_admin_create_product(self, s, admin_token):
        slug = f"test-product-{uuid.uuid4().hex[:6]}"
        payload = {
            "name": "TEST Product", "slug": slug, "short_description": "s", "description": "d",
            "ingredients": "i", "usage": "u", "price": 199.0, "mrp": 249.0, "stock": 10,
            "category_slug": "immunity-boosters", "ailments": ["cold"], "images": [],
            "is_bestseller": False, "is_featured": False,
        }
        r = s.post(f"{API}/products", json=payload,
                   headers={"Authorization": f"Bearer {admin_token}"})
        assert r.status_code == 200, r.text
        assert r.json()["slug"] == slug

        # verify persisted
        g = s.get(f"{API}/products/{slug}")
        assert g.status_code == 200

    def test_admin_update_order_status(self, s, admin_token, customer):
        # ensure at least one order exists (parallel workers may not share fixture-created orders)
        prod = s.get(f"{API}/products").json()[0]
        payload = {
            "email": customer["email"],
            "items": [{"product_id": prod["id"], "name": prod["name"], "price": prod["price"], "quantity": 1, "image": ""}],
            "address": {"label": "Home", "full_name": "T", "phone": "9", "line1": "1", "line2": "", "city": "P", "state": "M", "pincode": "1"},
            "payment_method": "cod",
        }
        co = s.post(f"{API}/checkout", json=payload, headers={"Authorization": f"Bearer {customer['token']}"})
        assert co.status_code == 200
        oid = co.json()["id"]
        r = s.put(f"{API}/admin/orders/{oid}/status", params={"status": "shipped"},
                  headers={"Authorization": f"Bearer {admin_token}"})
        assert r.status_code == 200, r.text
        assert r.json()["order_status"] == "shipped"

    def test_admin_invalid_status_rejected(self, s, admin_token, customer):
        prod = s.get(f"{API}/products").json()[0]
        payload = {
            "email": customer["email"],
            "items": [{"product_id": prod["id"], "name": prod["name"], "price": prod["price"], "quantity": 1, "image": ""}],
            "address": {"label": "Home", "full_name": "T", "phone": "9", "line1": "1", "line2": "", "city": "P", "state": "M", "pincode": "1"},
            "payment_method": "cod",
        }
        co = s.post(f"{API}/checkout", json=payload, headers={"Authorization": f"Bearer {customer['token']}"})
        oid = co.json()["id"]
        r = s.put(f"{API}/admin/orders/{oid}/status", params={"status": "bogus"},
                  headers={"Authorization": f"Bearer {admin_token}"})
        assert r.status_code == 400
