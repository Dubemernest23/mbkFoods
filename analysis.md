# MBK Foods Backend & Database Analysis

This document provides a comprehensive analysis of the existing MBK Foods codebase, the database schema design, what has been implemented so far, what remains to be done, and the architectural plan to complete the system.

---

## 1. Codebase Architecture Overview

The codebase is built on **Node.js** and **Express.js**, following a modular structure where each domain is encapsulated inside its own folder under `server/module/`. The project is structured as follows:

```text
server/
├── config/
│   ├── database.config.js       # MySQL pool configuration via mysql2/promise
│   └── logger.js                # Winston structured logger setup
├── constants/
│   └── httpStatus.js            # Standard HTTP response codes
├── middleware/
│   ├── authMiddleware.js        # Authentication & Role checks (JWT-based)
│   ├── errorMiddleware.js       # Structured error logging & error replies
│   ├── idempotencyMiddleware.js # Hash-based request protection placeholders
│   ├── requestLogger.js         # Morgan/Winston-based logging
│   └── validateMiddleware.js    # Schema validation placeholder (currently stubs)
├── module/                      # Feature modules
│   ├── admin/                   # Admin endpoints (e.g., list, update, delete)
│   ├── auth/                    # Registration & Login endpoints (stubs)
│   ├── food/                    # Menu browsing (stubs)
│   ├── order/                   # Order creation & history (stubs)
│   ├── payment/                 # Paystack integration (stubs)
│   └── user/                    # User profile endpoints (stubs)
├── route/
│   └── index.js                 # Central router mounting all modules under /api/v1
├── shared/
│   └── asyncHandler.js          # Promise-based wrapper for Express routes
├── utils/
│   ├── AppError.js              # Operational error class
│   └── jwt.config.js            # JWT sign & verify helpers
└── server.js                    # Core app entrypoint (starts server, connects DB)
```

---

## 2. Database Schema & Migration Analysis (`migration/001_initial_schema.sql`)

The database schema is highly robust, using **MySQL** (InnoDB engine) and structured specifically for financial correctness, idempotency, and audit trails.

### Key Database Strengths:
1. **Money Stored in Minor Units (`kobo`)**: Table fields like `price_kobo`, `subtotal_kobo`, `delivery_fee_kobo`, `discount_kobo`, and `total_kobo` store integer kobo amounts. This avoids floating-point roundoff issues.
2. **Double Ledger Ledger Guard (`approved_transactions` table)**:
   - Contains immutable triggers `trg_approved_transactions_no_update` and `trg_approved_transactions_no_delete` that prevent any change or removal of approved payment entries.
   - Prevents double ledger entry using `UNIQUE KEY` constraints on both `payment_id` and `(provider, provider_reference)`.
3. **Idempotency Support (`idempotency_keys` table)**:
   - Stores `scope_key`, `idempotency_key`, `request_hash`, and the serialised `response_body`.
   - Prevents duplicate requests (e.g., duplicate orders or payments) by short-circuiting them at the middleware layer.
4. **Referential Integrity**: Robust foreign key constraints link delivery addresses, food categories, food items, orders, order items, payments, and approved transactions.

### Schema Structure:
- `users`: Contains customer, admin, and super_admin accounts (differentiated by `role`).
- `delivery_addresses`: Stores reusable addresses for customers.
- `food_categories`: Groups menu items (e.g., Main Course, Swallow, Drinks, Desserts).
- `foods`: Stores dishes, prices in kobo, slugs, status, and stock.
- `orders` & `order_items`: Handles the shopping cart checkouts. Stores delivery address JSON snapshots to ensure historical consistency even if a customer updates their default address.
- `payments`: Stores Paystack initialization states, authorization URLs, and payment references.
- `payment_events`: Logs all incoming raw Paystack webhook payloads.
- `approved_transactions`: Ledger for verified and successful payments.

---

## 3. Detailed Gap Analysis (Current Stubs vs. Real DB Operations)

| Feature / File | Current Status (Stubbed / Mocked) | Target Status (To Implement) |
| :--- | :--- | :--- |
| **Database Connectivity** | Configuration is done; `REQUIRE_DB_ON_START` controls startup connectivity check. | Integrated into every feature service/controller. |
| **Auth Module** | - Registration returns 501 Mock.<br>- Login returns a temporary token without password validation. | - **Registration**: Validate, hash passwords (bcrypt), and insert into `users` table.<br>- **Login**: Fetch from database, verify hash, sign JWT. |
| **Food Module** | - Lists items by reading from local `menu.json` file.<br>- Admin routes (create/update) return 501. | - Seed database with `menu.json` content.<br>- Query from `foods` and `food_categories` tables with category and search filters.<br>- Admin endpoints update DB. |
| **Order Module** | - Appends draft orders to an in-memory array (`orders = []`). | - In a transaction, validate items, calculate totals, persist to `orders` and `order_items` tables.<br>- Fetch past orders from MySQL. |
| **Payment Module** | - Initializes Paystack (calls Paystack Sandbox API) but does not record it in database.<br>- Webhook endpoint is empty. | - Persist payment initialization to `payments` table.<br>- Handle `GET /verify/:reference` by validating with Paystack and inserting into `approved_transactions`.<br>- Process `POST /webhook` fully with signature verification and idempotency check. |
| **Idempotency** | - Middleware parses header but does not store/retrieve from `idempotency_keys` table. | - Implement full database-backed idempotency checking (blocking double clicks, serving cached responses). |
| **Documentation** | - No Swagger UI or OpenAPI specs are setup. | - Integrate `swagger-ui-express` and `swagger-jsdoc` to provide fully interactive API documentation under `/api-docs`. |

---

## 4. Next Implementation Action Plan

To address the user request, we will work in a structured manner, starting from planning, setting up Swagger documentation, implementing database migrations/seeding, and writing endpoints beginning with the Admin domain.

1. **Phase 1: Project & Database Seeding**:
   - Establish actual database connections.
   - Run/verify the migration script `migration/001_initial_schema.sql`.
   - Seed the `food_categories` and `foods` tables using data from `public/data/menu.json`.
2. **Phase 2: Swagger Documentation Setup**:
   - Install `swagger-ui-express` and `swagger-jsdoc` (or write a unified `swagger.json` / YAML).
   - Expose interactive documentation at `/api-docs`.
3. **Phase 3: Auth & Cryptography (Bcrypt/JWT)**:
   - Install `bcryptjs` (to avoid native compile issues on Windows) for secure password hashing.
   - Complete real database-backed Customer Registration and Login.
4. **Phase 4: Admin Endpoints Completion**:
   - Complete list, create, update, and delete endpoints for Admins.
   - Build admin capability to manage foods, categories, and view all orders/users.
5. **Phase 5: Core Customer & Order Flows**:
   - Implement Database-Backed Idempotency middleware.
   - Database-backed order creation within database transactions (locking food stock).
6. **Phase 6: Payments & Webhook Logic**:
   - Store Paystack details in `payments` table.
   - Wire webhook events, verification ledger, and immutable transactions.
