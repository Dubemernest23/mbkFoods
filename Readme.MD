# MBK Foods

MBK Foods is a food vendor web app where customers can browse meals, create orders, and pay through Paystack.

## Getting started

```bash
npm install
npm run dev
```

The server runs on `http://localhost:3060` by default.

## Useful endpoints

- `GET /healthz`
- `GET /api/v1/foods`
- `POST /api/v1/auth/login`
- `POST /api/v1/orders`
- `POST /api/v1/payments/initialize`

## Database

The baseline schema lives in `migration/001_initial_schema.sql`. It includes orders, payments, webhook events, idempotency keys, and an append-only approved transactions ledger.

See `walkthrough.md` for the backend plan and next steps.
