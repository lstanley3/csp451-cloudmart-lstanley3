from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models import CartItem, CartResponse

app = FastAPI(
    title="CloudMart API",
    description="Simplified CloudMart backend for CSP451 project",
    version="0.1.0",
)

# Allow the Vite dev server (5173) to call the backend (8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for local dev; later you can tighten this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    """Basic health check endpoint."""
    return {"status": "healthy", "service": "cloudmart-api"}


@app.get("/api/v1/products")
async def get_products():
    """
    Simple products endpoint (fake data for now).
    Later you could hook this up to PostgreSQL, but this is enough
    to prove frontend ↔ backend communication.
    """
    products = [
        {
            "id": 1,
            "name": "Wireless Headphones",
            "category": "Electronics",
            "price": 199.99,
            "stock": 25,
        },
        {
            "id": 2,
            "name": "Smart Watch",
            "category": "Electronics",
            "price": 299.99,
            "stock": 15,
        },
        {
            "id": 3,
            "name": "Running Shoes",
            "category": "Sports",
            "price": 89.99,
            "stock": 40,
        },
    ]
    return products


# --------- SIMPLE IN-MEMORY CART ---------

# one global cart for demo purposes
fake_cart: List[CartItem] = []


@app.get("/api/v1/cart", response_model=CartResponse)
async def get_cart():
    """Return current cart contents."""
    return CartResponse(items=fake_cart)


@app.post("/api/v1/cart", response_model=CartResponse)
async def add_to_cart(item: CartItem):
    """
    Add an item to the cart.
    If the product is already in the cart, increase quantity.
    """
    for existing in fake_cart:
        if existing.product_id == item.product_id:
            existing.quantity += item.quantity
            break
    else:
        fake_cart.append(item)

    return CartResponse(items=fake_cart)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
