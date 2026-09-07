# ShopVerse — Frontend Web Client Documentation

---

## 1. Project Overview

**ShopVerse Client** is a responsive, single-page e-commerce web application built using **React 18**, **Vite**, and **Tailwind CSS**. It provides a modern customer shopping journey featuring client-side routing, global state management for authentication and shopping cart sessions, dynamic script injection, and an end-to-end checkout workflow powered by the **Razorpay Standard Checkout SDK**.

### Core Functional Capabilities
* **Dynamic Product Catalog**: Browse products with category filtering, responsive multi-column layouts, and real-time inventory checks.
* **Persistent Shopping Cart**: Real-time quantity adjustments, live tax and shipping fee recalculation, and cart state synchronization across page reloads.
* **Authentication Workflow**: Protected checkout flows requiring authenticated JSON Web Token (JWT) sessions via secure, credential-aware HTTP transport.
* **Razorpay Payment Gateway**: Dynamic checkout script loading, client-side order initiation, secure payment modal configuration with automated prefill, and cryptographic payment verification handoff.
* **UI Feedback & Toasts**: Non-blocking toast notifications for network state, validation alerts, and successful transactions.

---

## 2. Technical Stack

| Category | Technology | Version / Specification | Purpose |
| :--- | :--- | :--- | :--- |
| **Core Framework** | React | `^18.x` | Declarative component UI library |
| **Build Tooling** | Vite | `^5.x` / `^6.x` / `^8.x` | Modern ESM dev server and production bundler |
| **Styling** | Tailwind CSS | `^3.x` | Utility-first responsive styling and layout system |
| **Routing** | React Router DOM | `^6.x` | Client-side routing, route guards, and URL navigation |
| **HTTP Transport** | Axios | `^1.x` | Promise-based HTTP client configured with credentials |
| **Payment Integration** | Razorpay SDK | `v1/checkout.js` | Hosted checkout modal overlay for cards, UPI, and net banking |
| **Notifications** | React Hot Toast | `^2.x` | UI notification triggers for payment and cart updates |

---

## 3. Directory Architecture

```text
D:/E-Commerce-FrontEnd/
├── public/
│   ├── favicon.ico                  # Browser tab icon
│   └── _redirects                   # SPA routing fallback for Netlify deployments
├── src/
│   ├── assets/                      # Static branding, category banners, icons
│   ├── components/                  # Reusable UI component blocks
│   │   ├── common/                  # Buttons, Loaders, InputFields, Modals
│   │   ├── layout/                  # Navbar, Footer, Sidebar, Layout wrappers
│   │   └── products/                # ProductCard, ProductGrid, RatingStar
│   ├── context/                     # Global State Context Providers
│   │   ├── AuthContext.jsx          # User credentials, JWT session validation, login/logout
│   │   └── CartContext.jsx          # Cart items array, quantity mutation, subtotal, tax math
│   ├── routes/                      # Application Route Declarations
│   │   └── AppRoutes.jsx            # Public and Protected route mappings
│   ├── services/                    # API Service Abstractions
│   │   ├── api.js                   # Configured Axios instance (baseURL, interceptors, withCredentials)
│   │   └── paymentService.js        # Checkout and verification endpoint calls
│   ├── utils/                       # Shared Helper Functions
│   │   └── loadRazorpay.js          # Dynamic DOM script injection helper
│   ├── views/                       # Primary Page Screens
│   │   ├── auth/                    # Login and Registration views
│   │   ├── cart/
│   │   │   └── CartPage.jsx         # Full cart table, price breakdown, and checkout trigger
│   │   ├── orders/                  # Order success, order details, and history views
│   │   └── products/                # Catalog listing and individual product details
│   ├── App.jsx                      # App root component mounting routes
│   ├── index.css                    # Tailwind CSS directives and global typography
│   └── main.jsx                     # Application bootstrap mounting StrictMode & Toaster
├── .env                             # Frontend environment variables
├── index.html                       # Single-page HTML entry template
├── package.json                     # Frontend scripts and installed dependencies
├── tailwind.config.js               # Tailwind color palette and breakpoint configurations
└── vite.config.js                   # Vite bundler plugins and server port setup

┌────────────────────────────────────────────────────────────────────────┐
│                          1. Cart Review Screen                         │
│ User validates line items, quantities, delivery address, and subtotal. │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼ Click "Pay with Razorpay"
┌────────────────────────────────────────────────────────────────────────┐
│                        2. Script Initialization                        │
│ loadRazorpayScript() dynamically mounts checkout.js to document body.  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         3. Gateway Handshake                           │
│ POST /api/v1/payment/create-order { amount: finalTotal }               │
│ Backend contacts Razorpay API and returns a unique `order_id`.         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          4. Payment Execution                          │
│ Client instantiates `new window.Razorpay(options)` and calls .open().  │
│ User selects UPI / Card / Netbanking and authorizes the payment.      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼ Razorpay SDK fires `handler(response)`
┌────────────────────────────────────────────────────────────────────────┐
│                       5. Cryptographic Settlement                      │
│ POST /api/v1/payment/verify                                            │
│ Payload: razorpay_order_id, razorpay_payment_id, razorpay_signature,   │
│          cart items, and shipping address.                             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    6. Order Finalization & Redirect                    │
│ Backend matches HMAC-SHA256 signature, persists order into MongoDB.    │
│ Frontend displays success toast and navigates to `/orders`.            │
└────────────────────────────────────────────────────────────────────────┘