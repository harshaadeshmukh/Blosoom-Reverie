# Blosoom Reverie

A handmade gifting studio website — photo bouquets, sticker arrangements and memory gifts, built from your personal photos and stories.

## Project Structure

```
blosoom-reverie/
├── frontend/         Vite + React + Tailwind CSS
└── backend/          Python FastAPI + MongoDB (Motor)
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

**Tech:** Vite · React · Tailwind CSS v3 · React Router DOM

## Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate    # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your MongoDB Atlas URI

# Start server
uvicorn app.main:app --reload  # http://localhost:8000
```

**Tech:** FastAPI · Motor (async MongoDB) · Pydantic v2

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/collections` | List all bouquet types |
| GET | `/api/collections/{id}` | Single collection |
| POST | `/api/orders/` | Submit custom order |
| GET | `/api/orders/` | List all orders |
| GET | `/api/orders/{id}` | Single order detail |
| POST | `/api/contact/` | Send contact message |

## Environment Variables (`.env`)

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DB_NAME=blosoom_reverie
ALLOWED_ORIGINS=http://localhost:5173
```

## Design

- Fonts: Playfair Display (headings) + Inter (body)
- Colors: Warm ivory · Rose accent · Deep charcoal
- Animations: Floating polaroids · Marquee strip · Scroll reveal · Drift ribbon
