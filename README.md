# 🌸 Blossom Reverie

<p align="center">
  <em>A handmade gifting studio website — photo bouquets, sticker arrangements, and memory gifts, built from personal photos and stories.</em>
</p>

---

## 🚀 Overview

Blossom Reverie is a premium e-commerce and portfolio web application designed for a custom gifting studio. It allows users to browse collections, submit highly customized orders (including photo uploads), and provides the studio owner with a secure admin dashboard to manage orders and testimonials.

This project is structured as a modern monorepo featuring a **React frontend**, a **React admin panel**, and a **FastAPI backend** powered by **MongoDB**.

## ✨ Features

- **Storefront (Frontend)**: Stunning, animated UI with floating polaroids, marquee strips, and scroll reveals.
- **Custom Order Flow**: Allows customers to upload images (cropped via `react-easy-crop`) and specify custom requirements for bouquets.
- **Admin Dashboard**: Secure internal dashboard for the business owner to track, manage, and update the status of custom orders.
- **Dynamic Collections**: Fetches available bouquet types and details directly from the backend.
- **Testimonial System**: Displays reviews and customer feedback.
- **Email Notifications**: Integrated via `fastapi-mail` to notify the business owner of new orders and contact messages.

## 🛠️ Tech Stack

### Frontend (Client Facing)
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v3
- **Routing:** React Router DOM v7
- **Image Cropping:** React Easy Crop

### Admin Dashboard
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4

### Backend (API)
- **Framework:** FastAPI (Python)
- **Database:** MongoDB (using Motor async driver)
- **Validation:** Pydantic v2
- **Mail:** FastAPI-Mail
- **File Handling:** Python-Multipart

---

## 📂 Project Structure

```text
blosoom-reverie/
├── frontend/         # Client-facing storefront
├── admin/            # Admin dashboard for business management
└── backend/          # FastAPI server & MongoDB connection
```

## 💻 Local Setup Instructions

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env to add your MONGODB_URI and other credentials

# Start the server
uvicorn app.main:app --reload
```
*The API will be available at `http://localhost:8000`*

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
*The client app will be available at `http://localhost:5173`*

### 3. Admin Setup

```bash
cd admin
npm install
npm run dev
```
*The admin dashboard will run on the port specified by Vite (usually `http://localhost:5174`)*

---

## 🔌 API Endpoints

### Health & Config
- `GET /api/health` - Check API status

### Collections
- `GET /api/collections` - Retrieve all bouquet types
- `GET /api/collections/{id}` - Retrieve details of a single collection

### Orders
- `POST /api/orders/` - Submit a new custom order (supports multipart form data for images)
- `GET /api/orders/` - List all orders (Admin)
- `GET /api/orders/{id}` - Retrieve a single order's details

### Communication & Reviews
- `POST /api/contact/` - Submit a contact/inquiry message
- `GET /api/reviews/` - Retrieve customer reviews
- `POST /api/reviews/` - Add a new customer review

---

## 🔐 Environment Variables

You need to set up a `.env` file in the `backend/` directory:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=blosoom_reverie
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

*(Additional variables for Mail configuration may be required based on your `fastapi-mail` setup)*

---

## 🎨 Design System

- **Typography**: `Playfair Display` for elegant headings, `Inter` for highly readable body text.
- **Color Palette**: Warm Ivory (backgrounds), Rose Accent (calls to action), Deep Charcoal (text).
- **Animations**: Custom keyframes for floating elements, drifting ribbons, and smooth scroll reveals to give the site a premium, handcrafted feel.

---
*Developed with ❤️ as a first freelancing project.*
