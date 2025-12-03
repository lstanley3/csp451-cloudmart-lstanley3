from fastapi import FastAPI
from typing import List

from app.database import Database  # uses your existing Database class

app = FastAPI(
    title="CloudMart API",
    description="Backend for CSP451 CloudMart project",
    version="0.1.0",
)

# Create a global Database object
db = Database()


@app.on_event("startup")
async def startup_event():
    """Connect to the database when the app starts"""
    await db.connect()


@app.on_event("shutdown")
async def shutdown_event():
    """Disconnect from the database when the app stops"""
    await db.disconnect()


@app.get("/health")
async def health_check():
    """Basic health check"""
    return {"status": "healthy", "service": "cloudmart-api"}


@app.get("/products")
async def list_products() -> List[dict]:
    """
    Return a simple list of products from the database.
    For now, just id, name, price, stock.
    """
    query = """
        SELECT id, name, description, category, price, stock
        FROM products
        ORDER BY name;
    """
    products = await db.fetch_all(query)
    return products

