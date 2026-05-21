# MBK Foods Backend Walkthrough

## What we are building

MBK Foods is a food vendor web app where customers can browse available meals, place orders, and pay online. The current frontend already has static pages and a menu JSON file. The backend should turn that into a real ordering system with persistent data, authentication, admin controls, order tracking, and Paystack payment processing.

The backend will expose versioned REST endpoints under `/api/v1`.

## Core backend domains

- Auth: customer registration, login, JWT sessions, and protected routes.
- Users: customer profiles, delivery details, and order history.
- Foods/Menu: food categories, available meals, prices, images, featured items, and stock/availability.
- Orders: cart checkout, order items, delivery address, order status, and admin order management.
- Payments: Paystack transaction initialization, verification, and webhook handling.
- Admin: admin users who can manage meals, view customers, update orders, and confirm operational changes.

## Current state

- `public/` contains the static site and sample menu data.
- `server/server.js` starts an Express app, serves the frontend, and mounts backend routes.
- `server/module/admin` has starter admin endpoints.
- `server/module/food`, `server/module/user`, `server/module/auth`, `server/module/order`, and `server/module/payment` now exist as backend feature modules.
- `server/config/database.config.js` has a MySQL pool placeholder using environment variables.
- Paystack has a starter client in `server/module/payment/paystack.client.js`.
- `migration/001_initial_schema.sql` contains the first MySQL schema draft.

## Data schema design

Money should be stored in minor units, so `4500 NGN` is stored as `450000` kobo. This avoids floating-point issues when calculating order totals, delivery fees, and payment amounts.

Primary tables:

- `users`: customers and admins in one table, separated by `role`.
- `delivery_addresses`: reusable customer delivery addresses.
- `food_categories`: menu grouping such as Main Course, Swallow, Drinks, and Desserts.
- `foods`: menu items, prices, image URLs, featured status, availability, and optional stock quantity.
- `orders`: one checkout attempt by a customer, including totals, status, and a JSON snapshot of the delivery address at checkout time.
- `order_items`: immutable-ish line item snapshot for each order, including food name and unit price at the time of purchase.
- `payments`: Paystack transaction records tied to orders.
- `payment_events`: raw Paystack webhook events, stored with a unique provider event id so the same webhook cannot be processed twice.
- `approved_transactions`: append-only ledger of verified successful payments.
- `idempotency_keys`: request replay protection for create-order and initialize-payment flows.

## Immutability and transaction safety

Approved payments need a permanent audit trail. The `approved_transactions` table is the ledger for transactions we have verified and accepted as successful. It should only ever receive inserts. The baseline migration adds database triggers that reject updates and deletes on this table.

Expected flow:

1. Customer creates an order with an `Idempotency-Key` header.
2. Server stores the idempotency key and request hash before doing work.
3. If the same key and same request is retried, the server returns the original response instead of creating another order.
4. Customer initializes Paystack payment for the order, also with an idempotency key.
5. Paystack reference is stored uniquely in `payments`.
6. Verification or webhook updates `payments` to `success`.
7. The server inserts exactly one row into `approved_transactions`.
8. The order changes from `pending_payment` to `paid`.

Important constraints:

- `orders` has `UNIQUE (user_id, idempotency_key)` to prevent duplicate checkout creation by the same user.
- `payments` has `UNIQUE (order_id, idempotency_key)` to prevent duplicate payment initialization for the same order.
- `payments` has `UNIQUE (provider, provider_reference)` to prevent duplicate Paystack references.
- `payment_events` has `UNIQUE (provider, provider_event_id)` to prevent duplicate webhook processing.
- `approved_transactions` has unique constraints on both `payment_id` and `(provider, provider_reference)` to prevent double ledger entries.
- `approved_transactions` has triggers that block update and delete operations.

The `idempotency_keys.scope_key` should be stable and non-null. For logged-in users it should be `user:{id}`. For unauthenticated flows, use a deliberate scope such as `anonymous:{ip}` or `email:{normalized_email}` depending on the endpoint.

## API shape

- `GET /healthz` - server health check.
- `POST /api/v1/auth/register` - register a customer.
- `POST /api/v1/auth/login` - login and receive a JWT.
- `GET /api/v1/foods` - list menu items.
- `GET /api/v1/foods/:id` - get one menu item.
- `POST /api/v1/orders` - create an order for the logged-in customer.
- `GET /api/v1/orders` - list logged-in customer orders.
- `POST /api/v1/payments/initialize` - initialize Paystack payment for an order.
- `GET /api/v1/payments/verify/:reference` - verify a Paystack payment.
- `POST /api/v1/payments/webhook` - receive Paystack payment events.
- `GET /api/v1/admins` - list admins.

Some endpoints are intentionally placeholders until the database schema and persistence layer are completed.

## What should be done next

1. Review `migration/001_initial_schema.sql` and adjust names/statuses before locking it in.
2. Add seed data for categories and foods from `public/data/menu.json`.
3. Build the idempotency middleware around `idempotency_keys`.
4. Replace temporary in-memory services with database queries.
5. Add password hashing for auth and remove the temporary demo login token behavior.
6. Add request validation for auth, food, order, and payment payloads.
7. Implement Paystack webhook signature verification and update payment/order status after successful payment.
8. Wrap order creation and payment success handling in database transactions.
9. Add admin authorization rules for food management, order management, and user management.
10. Connect the frontend cart/checkout flow to the backend order and payment endpoints.
11. Add tests for auth, foods, orders, payments, idempotency, and ledger immutability.

## Environment variables

Copy `.env.example` to `.env` and fill in real values when developing locally.
