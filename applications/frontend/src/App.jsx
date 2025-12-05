import { useEffect, useState } from 'react';
import {
  getHealth,
  getProducts,
  addToCart,
  getCart,
} from './services/api';

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking...');
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    async function init() {
      try {
        // 1) Health check
        const healthData = await getHealth();
        if (healthData.status === 'healthy') {
          setBackendStatus(`OK (${healthData.service})`);
        } else {
          setBackendStatus(`Unexpected status: ${healthData.status}`);
        }

        // 2) Load products
        const productsData = await getProducts();
        setProducts(productsData);

        // 3) Load cart
        const cartData = await getCart();        // { items: [...] }
        setCartItems(cartData.items || []);
      } catch (err) {
        console.error('Init failed:', err);
        setBackendStatus('Backend not reachable');
      }
    }

    init();
  }, []);

  async function handleAddToCart(productId) {
    try {
      const updatedCart = await addToCart(productId, 1); // { items: [...] }
      setCartItems(updatedCart.items || []);
    } catch (err) {
      console.error('Add to cart failed:', err);
      alert('Could not add to cart');
    }
  }

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'sans-serif' }}>
      <h1>CloudMart Frontend</h1>
      <p>Backend API Status: {backendStatus}</p>

      <hr />

      <h2>Products</h2>
      {products.length === 0 ? (
        <p>No products loaded.</p>
      ) : (
        <ul>
          {products.map((p) => (
            <li key={p.id} style={{ marginBottom: '0.5rem' }}>
              <strong>{p.name}</strong>{' '}
              — ${p.price.toFixed(2)} ({p.category}) — Stock: {p.stock}
              <button
                style={{ marginLeft: '0.75rem' }}
                onClick={() => handleAddToCart(p.id)}
              >
                Add to Cart
              </button>
            </li>
          ))}
        </ul>
      )}

      <hr />

      <h2>Cart</h2>
      {cartItems.length === 0 ? (
        <p>Cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.product_id}>
              Product #{item.product_id} — Quantity: {item.quantity}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
