import { useEffect, useState } from 'react';
import { getHealth, getProducts } from './services/api';

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking...');
  const [products, setProducts] = useState([]);
  const [productError, setProductError] = useState('');

  useEffect(() => {
    async function load() {
      // 1) Check backend health
      try {
        const data = await getHealth();
        if (data.status === 'healthy') {
          setBackendStatus(`OK (${data.service})`);
        } else {
          setBackendStatus(`Unexpected status: ${data.status}`);
        }
      } catch (err) {
        console.error('Health check failed:', err);
        setBackendStatus('Backend not reachable');
        return; // if health fails, skip products
      }

      // 2) Fetch products
      try {
        const items = await getProducts();
        setProducts(items);
      } catch (err) {
        console.error('Failed to load products:', err);
        setProductError('Could not load products');
      }
    }

    load();
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>CloudMart Frontend</h1>
      <p><strong>Backend API Status:</strong> {backendStatus}</p>

      <hr style={{ margin: '1.5rem 0' }} />

      <h2>Product Catalog (demo)</h2>
      {productError && <p style={{ color: 'red' }}>{productError}</p>}

      {products.length === 0 && !productError && (
        <p>Loading products...</p>
      )}

      {products.length > 0 && (
        <ul>
          {products.map((p) => (
            <li key={p.id}>
              <strong>{p.name}</strong> – {p.category} – ${p.price}{' '}
              (stock: {p.stock})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
