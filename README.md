# NPC Backend

Express + MongoDB backend powering NPC Global frontend.

## Features

- JWT auth (`register`, `login`, `me`)
- Google sign-in via ID token verification
- Listings CRUD (franchise, business, investor, blog)
- Blog API (`/api/blog`)
- Inquiry/service form submissions
- Contact form storage
- Admin-protected management endpoints
- Razorpay order creation + webhook verification
- Cloudinary image uploads

## Setup

```bash
cd backend
npm install
npm run dev
```

## Environment Variables

Required:

```env
MONGODB_URI=
JWT_SECRET=
GOOGLE_CLIENT_ID=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
```

Optional:

```env
PORT=5000
BASE_URL=
AUTO_CREATE_ADMIN=false
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

## API Overview

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/google`
- `GET /auth/me`

- `GET /listings/:type`
- `GET /listings/:type/:id`
- `POST /listings/:type` (auth)
- `DELETE /listings/:type/:id` (auth + owner/admin)

- `GET /api/blog`
- `GET /api/blog/:id`
- `POST /api/blog` (auth)
- `PUT /api/blog/:id` (auth + owner/admin)
- `DELETE /api/blog/:id` (auth + owner/admin)

- `POST /forms`
- `GET /forms` (admin)
- `GET /forms/:id` (admin)
- `DELETE /forms/:id` (admin)

- `POST /contact`
- `GET /contact/all` (auth)

- `POST /payments/create-order` (auth)
- `POST /payments/razorpay-webhook`

- `POST /upload/image`
