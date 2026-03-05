# MERN Electronics Store

---

A **high-performance e-commerce platform** for electronics, built using the **MERN stack** (MongoDB, Express.js, React.js, and Node.js). This application features a seamless shopping experience for gadgets, secure multi-method payments, and a robust user management system.

---

## Features

* 🔒 **JWT Authentication** — Secure login and session management using JSON Web Tokens.
* 🧭 **Responsive Design** — Fully mobile-friendly layout built with **Bootstrap & CSS**.
* 🛍️ **Cart & Wishlist** — Dynamic management of favorite gadgets and electronics.
* 💳 **Secure Payments** — Integrated support for **Stripe (Cards)** and **GPay (Mobile)**.
* 📈 **Admin Dashboard** — Full control over inventory, user data, and sales tracking.
* 🔄 **Product CRUD** — Admins can add, update, or remove electronics with ease.
* 🧩 **Real-time Updates** — Frontend-to-backend communication powered by **Axios**.

---

## Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React.js, Redux, HTML5, CSS3, JavaScript, Bootstrap, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose) |
| **Payments** | Stripe API, Google Pay API |
| **Auth** | JWT (JSON Web Token), Bcrypt.js |
| **Deployment** | Render |

---

## Project Workflow

1.  **Authentication**: Users register and verify identity via JWT-based secure login.
2.  **Tech Discovery**: Browse and filter electronics by category, specs, and price.
3.  **Cart Management**: Save items to the Wishlist or add them to the Cart for purchase.
4.  **Checkout**: Securely process payments using Stripe or Google Pay.
5.  **Order Tracking**: View order history and monitor real-time delivery status.
6.  **Admin Management**: Powerful tools to manage products, users, and analyze sales.

---

## Project Gallery

###  Home Page
<img width="1358" height="7959" alt="Image" src="https://github.com/user-attachments/assets/17ee2f6d-012a-4f1f-b865-ee7f18efcd22" />

### Product Details


### Cart & Wishlist


###  Admin Dashboard


---

## 🌐 Project in Live 

You can access the live version of this project here:

**ElectronicsStore:** [https://frontend-store-api.onrender.com](https://frontend-store-api.onrender.com)

---

##  Installation Guide

```bash
# 1. Clone the repository
git clone [https://github.com/YOUR_USERNAME/MERN-electronics-store.git](https://github.com/YOUR_USERNAME/MERN-electronics-store.git)
cd MERN-electronics-store

# 2. Install dependencies for all parts
# Install Frontend
cd frontend && npm install

# Install Backend Server
cd ../backend && npm install

# 3. Environment Variables (.env)
# Create a .env file in the backend folder and add:
# PORT, MONGO_URI, JWT_SECRET, STRIPE_SECRET_KEY, CLOUDINARY_URL

# 4. Start the application
# Start Backend (Terminal 1)
cd backend && npm run dev

# Start Frontend (Terminal 2)
cd frontend && npm start
