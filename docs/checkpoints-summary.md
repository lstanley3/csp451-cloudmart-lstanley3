# CloudMart – Checkpoints Summary

Student: Lennox Stanley (lstanley3)

## Checkpoint 7 – Backend + Docker

- Implemented FastAPI backend in `applications/backend/app/main.py`.
- Endpoints:
  - `GET /health` – returns JSON `{"status": "healthy", "service": "cloudmart-api"}`.
  - `GET /api/v1/products` – returns sample product list (id, name, category, price, stock).
  - `GET /api/v1/cart` – returns current in-memory cart.
  - `POST /api/v1/cart` – add item to cart or increase quantity.
  - `POST /api/v1/checkout` – simple checkout: returns order_id and item count, clears cart.
- Docker:
  - `docker/docker-compose.yml` runs:
    - `docker-backend` (FastAPI, port 8000)
    - `postgres` (PostgreSQL)
    - `redis` (Redis)
  - Start with: `cd docker && docker compose up --build`.

## Checkpoint 8 – Frontend Integration

- React + Vite frontend in `applications/frontend`.
- `src/services/api.js`:
  - `getHealth`, `getProducts`, `getCart`, `addToCart`, and `checkout()` functions.
- `src/App.jsx`:
  - On load:
    - Calls `/health`, `/api/v1/products`, `/api/v1/cart`.
  - Shows:
    - Backend API status (e.g., `OK (cloudmart-api)`).
    - Product list with "Add to Cart" buttons.
    - Cart contents (product_id, quantity).
    - "Checkout" button that calls `POST /api/v1/checkout`, shows order result, and refreshes cart.

## Checkpoint 9 – Repo Layout & Future Infra/Monitoring

- Repository folders created:
  - `infrastructure/terraform/` – reserved for Terraform IaC.
  - `infrastructure/scripts/` – reserved for infra helper scripts.
  - `monitoring/prometheus/`, `monitoring/grafana/dashboards/` – reserved for monitoring/metrics.
  - `services/order-processor/` – reserved for future async order processing or microservice.
  - `scripts/` – reserved for generic helper scripts.
  - `tests/` – reserved for future automated tests.
- Core app is working end-to-end locally with backend + frontend + Docker.

