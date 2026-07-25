# ShopX E-Commerce Codebase Scan & Client Project Master Blueprint

This document provides a complete technical audit of the **ShopX** codebase and serves as a step-by-step master guide for building production e-commerce projects for clients.

---

## 1. System Architecture Overview

```
               ┌────────────────────────────────────────────────────────┐
               │                     CLIENT BROWSER                     │
               │  ┌───────────────────────┐  ┌───────────────────────┐ │
               │  │  Frontend Storefront  │  │      Admin Panel      │ │
               │  │  (React + Vite + Tailwind)│  │ (React + Vite + CSS)  │ │
               │  └───────────┬───────────┘  └───────────┬───────────┘ │
               └──────────────┼──────────────────────────┼──────────────┘
                              │ HTTP / REST APIs         │ HTTP / REST APIs
                              │ (with HTTP-only Cookies) │ (with HTTP-only Cookies)
                              ▼                          ▼
               ┌────────────────────────────────────────────────────────┐
               │                     EXPRESS BACKEND                    │
               │                   (Node.js + Express)                  │
               └────────┬───────────────────┬───────────────────┬───────┘
                        │                   │                   │
                        ▼                   ▼                   ▼
               ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
               │    MongoDB     │  │   Cloudinary   │  │   Resend API   │
               │   (Database)   │  │ (Media Storage)│  │ (Email Alerts) │
               └────────────────┘  └────────────────┘  └────────────────┘
```

---

## 2. Authentication & JWT Token Flow (Auth & Security Deep Dive)

### Current Implementation in ShopX
1. **Token Issuance**:
   - Upon Login/Registration/Google Login, the server generates a JWT containing `{ userId }` signed with `JWT_SECRET`.
   - Admin Login generates a JWT containing `{ email }`.
   - **Expiration**: Set to **7 Days** (`expiresIn: "7d"`).
2. **Token Storage**:
   - Sent to the browser as an **HTTP-Only, Secure, SameSite=None Cookie**:
     ```javascript
     res.cookie("token", token, {
       httpOnly: true, // Prevents JavaScript XSS attacks from reading token
       secure: true,   // Requires HTTPS
       sameSite: "None",// Cross-domain cookie delivery
       maxAge: 7 * 24 * 60 * 60 * 1000
     });
     ```
3. **Authentication Middleware**:
   - `isAuth.js`: Extracts `token` from `req.cookies`, verifies it via `jwt.verify()`, and attaches `req.userId` to incoming requests.
   - `adminAuth.js`: Extracts `token` from `req.cookies`, verifies admin credentials, and attaches `req.adminEmail`.
4. **Frontend User State Persistence**:
   - `UserContext.jsx` maintains `userData` in React state + `localStorage` cache (`userData`).
   - On page refresh, it calls `axios.get('/api/user/getcurrentuser', { withCredentials: true })` to validate cookie status and update user state.

### Upgrading for Enterprise Client Projects (Refresh Token Architecture)
While ShopX uses a single 7-day token in cookie, enterprise client projects should implement **Dual Token Rotation**:
- **Access Token**: Short lifespan (15 minutes), stored in memory or short cookie.
- **Refresh Token**: Long lifespan (7-30 days), stored in HTTP-Only Cookie.
- **Auto-Refresh Mechanism**: Frontend Axios interceptor catches `401 Unauthorized` errors, automatically calls `/api/auth/refresh-token`, obtains a new Access Token, and retries the failed API call seamlessly.

---

## 3. Data Storage Mapping (Where is Data Saved?)

| Data Category | Storage Location | Saved Content / Schema Details |
| :--- | :--- | :--- |
| **User Data & Cart** | **MongoDB** (`users` collection) | `name`, `email`, hashed `password` (bcrypt), `cartData` (JSON object holding item IDs, sizes, and quantities). |
| **Products & Catalog** | **MongoDB** (`products` collection) | `name`, `description`, `price`, `category`, `subCategory`, `sizes` array, `bestseller` flag, timestamp, and **Cloudinary HTTPS URLs** (`image1`..`image4`). |
| **Product Images** | **Cloudinary Cloud Storage** | Original image files uploaded via admin dashboard are converted to CDN-hosted secure URLs (`https://res.cloudinary.com/...`). |
| **Orders** | **MongoDB** (`orders` collection) | `userId`, array of purchased `items`, total `amount`, shipping `address`, `paymentMethod` ('COD' \| 'Razorpay'), `payment` status boolean, order `status` ('Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered'). |
| **Returns & Refunds** | **MongoDB** (`returns` collection) | `orderId`, `userId`, `itemId`, `reason`, `description`, `actionType` ('Refund' \| 'Replace'), `refundMethod` ('UPI' \| 'Bank'), `refundDetails` (UPI ID or Bank Account No/IFSC), `status` ('Pending', 'Approved', 'Rejected'). |
| **Product Reviews** | **MongoDB** (`reviews` collection) | `userId`, `productId`, `rating` (1-5), `comment`. Uses a compound unique index `{ userId: 1, productId: 1 }` so a user can review a product only once. |
| **Store Banner / Settings** | **MongoDB** (`settings` collection) | Key-value store (e.g. `heroBanner: "https://res.cloudinary.com/..."`). |
| **Client Session Cache** | **Browser LocalStorage** | Non-sensitive profile cache (`userData`) for instant UI rendering before backend verification finishes. |

---

## 4. Cloudinary Integration Flow

### How Cloudinary Works in ShopX:
1. **Upload Request**: Admin submits product images via HTML Form (`multipart/form-data`).
2. **Multer Middleware**: Temporarily stores incoming file on local disk server (`public/uploads`).
3. **Cloudinary Uploader Utility (`utils/cloudinary.js`)**:
   ```javascript
   const uploadResult = await cloudinary.uploader.upload(filePath);
   fs.unlinkSync(filePath); // Cleans up local temp file after upload
   return uploadResult.secure_url;
   ```
4. **Database Record**: The returned HTTPS URL is stored in MongoDB inside `productModel`.

---

## 5. Complete Feature-by-Feature Guide for Client E-Commerce Projects

### Feature 1: User & Admin Authentication
- **User Auth**: Signup, Login, Password Hashing using `bcryptjs`, Email Validation with `validator`, HTTP-Only cookie set.
- **Google Auth**: Frontend captures Google token -> Server checks or creates user record -> Issues cookie session.
- **Admin Auth**: Secured admin route verified via env secrets (`ADMIN_EMAIL`, `ADMIN_PASSWORD`) issuing an Admin JWT cookie.

### Feature 2: Product Management & Media Handling
- Admin dashboard to create, list, and delete products.
- Uploads up to 4 images per product directly processed through Multer + Cloudinary.
- Categorization by Main Category, Sub-Category, Sizes array (`S`, `M`, `L`, `XL`), Bestseller flag.

### Feature 3: Smart Persistent Shopping Cart
- Cart state synchronized across devices.
- Store structure in MongoDB:
  ```json
  "cartData": {
    "productId123": { "M": 2, "L": 1 }
  }
  ```
- Instant optimistic UI update with fallback on server error.

### Feature 4: Order & Multi-Payment Integration
- **Cash on Delivery (COD)**: Saves order to DB immediately, resets cart to empty.
- **Razorpay Payment Gateway**:
  1. Backend initializes Razorpay order (`razorpayInstance.orders.create`).
  2. Frontend opens Razorpay Checkout SDK popup.
  3. Server verifies payment verification payload (`verifyRazorpay`).
  4. Updates order status to `payment: true` and clears user cart.

### Feature 5: Automated Email Notification System
- Powered by **Resend API / Nodemailer**:
  - **User Order Confirmation**: Sends HTML invoice summary upon order placement.
  - **Admin Order Alert**: Instant email notification to admin with customer delivery details.
  - **Order Tracking Updates**: Automatic status updates emailed when order status changes ('Packing' -> 'Shipped' -> 'Delivered').
  - **Return Alerts & Updates**: Email confirmation when return requested & approved/rejected.

### Feature 6: Return, Replacement & Refund Workflow
- Customer submits return request for delivered orders.
- Customer provides reason, action type ('Refund' or 'Replace'), and refund details (UPI ID or Bank Account No & IFSC).
- Admin can review all returns from the Admin panel and set status ('Approved' / 'Rejected') with custom notes.

### Feature 7: Verified Purchase Reviews & Ratings
- Customers can write star ratings (1-5) and reviews.
- Server validates that the user has an existing **Delivered Order** containing the target product (`addReview` check).
- Computes average product rating dynamically.

### Feature 8: Automated PDF Tax Invoice Generator
- Powered by **PDFKit**.
- Route `/api/order/invoice/:orderId` dynamically renders a clean, professional PDF invoice containing shop branding, customer address, itemized product list, taxes, and order totals for instant download.

---

## 6. Client Project Launch Checklist

When taking a new e-commerce project for a client, follow this setup process:

1. **Environment Variables Config (`.env`)**:
   - `PORT`, `MONGODB_URL`, `JWT_SECRET`
   - `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
   - `RESEND_API_KEY`, `EMAIL_USER`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
   - `FRONTEND_URL`, `ADMIN_URL`
2. **CORS & Domain Authorization**:
   - Ensure `corsOptions` allows client domains and admin domains with `credentials: true`.
3. **Database Indexing**:
   - Ensure unique index on `User.email` and `Review.{userId, productId}`.
4. **Cloud Storage Buckets**:
   - Set up Cloudinary upload preset/folder for organized asset storage.
