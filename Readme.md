# Event Manager App

A full-stack **event management application** that allows users to create, manage, and share events.  
Admin users can add and manage events, while shared links allow **view-only access** to events without authentication.

---

## 🚀 Features

### Admin Dashboard

- Add, edit, and delete events
- Filter events (all, upcoming, past)
- Sort events by date
- Select multiple events for bulk actions
- Copy shareable links for events

### Shared Event Viewer

- View-only interface for shared events via a unique URL
- Mobile-friendly and responsive layout
- Event details include title, date/time, location, and description

### UI & Notifications

- Beautiful and responsive UI built with **Radix UI**, **TailwindCSS**, and **Lucide icons**
- Real-time notifications using **Sonner** for actions like share, delete, or errors

---

## ⚡ Setup Instructions

## 🛠️ Tech Stack

- Frontend: React + Vite, TailwindCSS, Shadcn UI, Lucide Icons
- Backend: Node.js (Express), JWT Auth, Mongoose
- Database: MongoDB (Atlas)

### Prerequisites

- Node.js > 20
- npm or yarn
- MongoDB (local or Atlas)

### Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create a .env file
# Example:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
APP_URL=http://localhost:5173

# Start the server
npm run dev

# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev

Open your browser at http://localhost:5173
```

### 🔑 Authentication & Access

Admin users require login to access the dashboard (/ and /addEvent)

Shared links (/share/:shareToken) are view-only and do not require login

JWT stored in localStorage for session persistence

### 📌 API Endpoint

#### Authentication

- POST /auth/register – Register new user

- POST /auth/login – Login and get JWT token

#### Events

- GET /events – List all events (Admin only)

- POST /events – Add new event (Admin only)
- DELETE /events/:id – Delete an event (Admin only)

- POST /events/bulk-share – Generate shareable URLs for multiple events

- GET /events/share/:shareToken – View event via shared link

## 💡 Notes

Shared links provide view-only access to non-authenticated users.

Admin dashboard supports bulk actions (delete, share).

Dates are formatted using date-fns.

Notifications for success/error use Sonner toast library.

Styling ensures mobile-friendly, responsive UI using TailwindCSS and Radix UI components.

## 🗄️ Why MongoDB?

- **Schema Flexibility** – Events may have optional fields (like description or location). MongoDB allows iteration without schema migrations.

- **JSON-like Documents** – Data is stored in BSON/JSON, making it natural to work with in a JavaScript/Node.js stack.

- **Great Node.js Integration** – Using Mongoose ODM simplifies modeling, validation, and queries.
