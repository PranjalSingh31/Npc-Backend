# NPC Backend (Rewritten)

This backend is a full rewrite to match the new frontend. It includes:
- Email/password authentication with JWT
- Google Sign-in via ID token verification
- Form submission endpoints for multiple business forms
- Contact form storage
- Admin panel endpoints (list, update, delete submissions)
- Razorpay payment integration (create order + webhook support)

## How frontend should interact
- Auth endpoints: `/auth/register`, `/auth/login`, `/auth/google` (POST idToken)
- After login, frontend stores `token` and sends it as `Authorization: Bearer <token>` for protected routes.
- Create form submission: `POST /forms/:formType` with JSON payload.
- Contact: `POST /contact`.
- Payments: `POST /payments/create-order` with `{ amount }`.

## Setup
1. Copy `.env.example` to `.env` (or use provided .env) and fill values (MongoDB URI, JWT secret, Google client id, Razorpay keys).
2. `npm install`
3. `npm run dev`

## Notes
- Google flow: recommended approach is for frontend to use Google Identity Services to obtain an `idToken` and send it to `/auth/google`.
- Razorpay: create orders from backend and use frontend checkout with order_id.
