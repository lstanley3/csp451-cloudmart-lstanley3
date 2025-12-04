const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function getHealth() {
  const res = await fetch(`${API_URL}/health`);
  if (!res.ok) {
    throw new Error('Health check failed');
  }
  return res.json();
}

export async function getProducts() {
  const res = await fetch(`${API_URL}/api/v1/products`);
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
}

