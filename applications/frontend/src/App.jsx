// applications/frontend/src/App.jsx

import { useEffect, useState } from 'react';
import {
  getHealth,
  getProducts,
  getCart,
  addToCart,
  checkoutCart,
} from './services/api';

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking...');
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [checkoutMessage, setCheckoutMessage] = useState('');

  // Initial load: health, products, cart
  useEffect(() => {
    async function init() {
      try {
        // 1) Health check
        const health = await getHealth();
        if (health.status === 'healthy') {
          setBackendStatus(`OK (${health.service})`);
        } else {
          setBackendStatus(`Unexpected status: ${health.status}`);
        }

        // 2) Load products
        const prods = await getProducts();
        setProducts(prods);

        // 3) Load existing cart (if any)
        const cart = await getCart();
        setCartItems(cart.items || []);
      } catch (err) {
        console.error('Init failed:', err);
        setBackendStatus('Backend not reachable');
      }
    }

    init();
  }, []);

  // Handle checkout button
  async function handleCheckout() {
    try {
      setCheckoutMessage('');

      const data = await checkoutCart();
      // Backend returns:
      //  - empty cart: { "message": "Cart is empty — cannot checkout" }
      //  - success:    { "message": "Checkout complete", "order_id": 1001, "items_count": N }

      if (data.order_id) {
        // Refresh cart from backend (should now be empty)
        const updatedCart = await getCart();
        setCartItems(updatedCart.items || []);

        setCheckoutMessage(
          `Order ${data.order_id} placed with ${data.items_count} item(s).`
        );
      } else {
        // No order_id, likely empty cart or some error message
        setCheckoutMessage(data.message || 'Cart is empty — add items before checkout.');
      }
    } catch (err) {
      console.error('Checkout failed:', err);
      setCheckoutMessage('Checkout failed. Please try again.');
    }
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
                  try {
                    setCheckoutMessage(''); // clear old checkout message when cart changes
                    const updated = await addToCart(p.id, 1);
                    setCartItems(updated.items || []);
                  } catch (err) {
                    console.error('Add to cart failed:', err);
                    alert('Failed to add item to cart.');
                  }
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
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
            style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
          >
            Checkout
          </button>
        </>
      )}

      {checkoutMessage && (
        <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>{checkoutMessage}</p>
      )}
    </div>
  );
}

export default App;
