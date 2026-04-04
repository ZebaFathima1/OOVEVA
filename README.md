# Ooveva Cafe

A modern cafe website with events, offers, and admin management system.

## Features

- Daily Events display with image uploads
- Offers and Discounts with image uploads
- Admin panel at `/admin` to add/manage events and offers with file upload
- Responsive design
- SQLite database for data storage
- Image storage in backend uploads folder

## Setup

### Prerequisites

- Node.js (v14 or higher)

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

### Running the Application

**Option 1: Run both frontend and backend together (Recommended)**
```bash
npm run dev:full
```
This will start both servers and show URLs in the terminal.

**Option 2: Run separately**
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend  
npm run dev:frontend
```

### URLs
- **Main Website**: `http://localhost:5173/`
- **Admin Panel**: `http://localhost:5173/admin`
- **Backend API**: `http://localhost:5000/`

## Admin Panel

Navigate to `http://localhost:5173/admin` to add new events and offers.

## API Endpoints

- GET /api/events - Get all events
- POST /api/events - Add new event (with file upload)
- PUT /api/events/:id - Update event (with file upload)
- DELETE /api/events/:id - Delete event
- GET /api/offers - Get all offers
- POST /api/offers - Add new offer (with file upload)
- PUT /api/offers/:id - Update offer (with file upload)
- DELETE /api/offers/:id - Delete offer

## File Storage

Images are stored in:
- `backend/uploads/events/` - Event images
- `backend/uploads/offers/` - Offer images

Images are served via `http://localhost:5000/uploads/...`
