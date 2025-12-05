// applications/frontend/src/App.jsx
import { useEffect, useState } from 'react';
import {
  getHealth,
  getProducts,
  getCart,
  addToCart,
} from './services/api';

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking...');
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [checkoutMessage, setCheckoutMessage] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        const health = await getHealth();
        if (health.status === 'healthy') {
          setBackendStatus(`OK (${health.service})`);
        } else {
          setBackendStatus(`Unexpected status: ${health.status}`);
        }

        const prods = await getProducts();
        setProducts(prods);

        const cart = await getCart();
        setCartItems(cart.items || []);
      } catch (err) {
        console.error('Init failed:', err);
        setBackendStatus('Backend not reachable');
      }
    }

    init();
  }, []);

  async function checkout() {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    const res = await fetch(`${apiUrl}/api/v1/checkout`, {
      method: 'POST',
    });

    const data = await res.json();
    setCheckoutMessage(data); // store message in UI

    const updatedCart = await getCart();
    setCartItems(updatedCart.items || []);
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>CloudMart Frontend</h1>
      <p>Backend API Status: {backendStatus}</p>

      <hr />

      <h2>Products</h2>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <ul>
          {products.map((p) => (
            <li key={p.id} style={{ marginBottom: '0.5rem' }}>
              <strong>{p.name}</strong> ({p.category}) – ${p.price}{' '}
              <button
                onClick={async () => {
                  const updated = await addToCart(p.id, 1);
                  setCartItems(updated.items || []);
                }}
                style={{ marginLeft: '1rem' }}
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
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item.product_id}>
                Product #{item.product_id} — Quantity: {item.quantity}
              </li>
            ))}
          </ul>

          <button
            onClick={checkout}
            style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
          >
            Checkout
          </button>
        </>
      )}

      {checkoutMessage && (
        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#e0ffe0',
            border: '1px solid #00aa00',
            borderRadius: '5px',
          }}
        >
          <h3>Order Complete</h3>
          <p>Order ID: {checkoutMessage.order_id}</p>
          <p>Items Purchased: {checkoutMessage.items_count}</p>
        </div>
      )}
    </div>
  );
}

export default App;
