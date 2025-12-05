// applications/frontend/src/services/api.js

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Health check
export async function getHealth() {
  const res = await fetch(`${API_URL}/health`);
  if (!res.ok) {
    throw new Error('Health check failed');
  }
  return res.json();
}

// Get product list
export async function getProducts() {
  const res = await fetch(`${API_URL}/api/v1/products`);
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
}

// Get current cart
export async function getCart() {
  const res = await fetch(`${API_URL}/api/v1/cart`);
  if (!res.ok) {
    throw new Error('Failed to fetch cart');
  }
  return res.json(); // { items: [...] }
}

// Add item to cart
export async function addToCart(productId, quantity = 1) {
  const res = await fetch(`${API_URL}/api/v1/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id: productId, quantity }),
  });

  if (!res.ok) {
    throw new Error('Failed to add to cart');
  }

  return res.json(); // { items: [...] }
}

// 🔹 Checkout cart
export async function checkoutCart() {
  const res = await fetch(`${API_URL}/api/v1/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}', // backend doesn't use body, but POST with JSON is clean
  });

  if (!res.ok) {
    throw new Error('Checkout request failed');
  }

  // Your backend currently returns:
  // { "message": "...", "order_id": 1001, "items_count": 3 }
  return res.json();
}
