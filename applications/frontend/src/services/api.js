const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Health check
export async function getHealth() {
  const res = await fetch(`${API_URL}/health`);
  if (!res.ok) {
    throw new Error('Health check failed');
  }
  return res.json();
}

// Get products
export async function getProducts() {
  const res = await fetch(`${API_URL}/api/v1/products`);
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
}

// Add item to cart
export async function addToCart(productId, quantity = 1) {
  const res = await fetch(`${API_URL}/api/v1/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      product_id: productId,
      quantity,
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to add to cart');
  }

  // returns { items: [...] }
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

