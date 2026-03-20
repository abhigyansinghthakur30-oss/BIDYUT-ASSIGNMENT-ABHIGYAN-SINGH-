# Bidyut Solutions — Team Task Dashboard

A full-stack **Team Task Dashboard** built with **Next.js (App Router)**, **Tailwind CSS**, and **Supabase** (database + realtime). Features custom JWT authentication, role-based access control, real-time team chat, and task management.

## 🛠 Tech Stack

- **Next.js 15** (App Router)
- **Tailwind CSS v4**
- **Supabase** (PostgreSQL database + Realtime)
- **bcryptjs** (password hashing)
- **jose** (JWT — Edge-compatible)

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/abhigyansinghthakur30-oss/BIDYUT-ASSIGNMENT-ABHIGYAN-SINGH-.git
cd BIDYUT-ASSIGNMENT-ABHIGYAN-SINGH-
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret_key
```

### 3. Set Up Supabase Database

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Open the **SQL Editor**
3. Copy and paste the contents of `supabase-schema.sql`
4. Click **Run** to create the tables and RLS policies

### 4. Enable Realtime

In the Supabase Dashboard:
1. Go to **Database → Replication**
2. Make sure the `messages` table has realtime enabled

### 5. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.js    # Login endpoint
│   │   │   ├── register/route.js # Register endpoint
│   │   │   ├── me/route.js       # Get current user
│   │   │   └── logout/route.js   # Logout endpoint
│   │   ├── tasks/route.js        # Task CRUD
│   │   ├── messages/route.js     # Chat messages
│   │   └── users/route.js        # User list (for task assignment)
│   ├── dashboard/page.js         # Main dashboard
│   ├── login/page.js             # Login page
│   ├── register/page.js          # Register page
│   ├── layout.js                 # Root layout
│   ├── page.js                   # Redirects to /login
│   └── globals.css               # Global styles
├── components/
│   ├── Navbar.jsx                # Navigation bar
│   ├── TaskPanel.jsx             # Task management panel
│   └── ChatPanel.jsx             # Real-time chat panel
├── lib/
│   ├── auth.js                   # JWT + bcrypt utilities
│   └── supabase.js               # Supabase client
└── middleware.js                  # Route protection
```

## 🔐 Authentication

- **Custom JWT authentication** — no external auth libraries
- Passwords hashed with **bcryptjs** (12 rounds)
- JWT tokens stored in **HTTP-only cookies** (7-day expiry)
- Middleware protects `/dashboard` routes

## 👤 Roles

| Feature | Admin | User |
|---------|-------|------|
| View tasks | ✅ All | ✅ Assigned only |
| Create tasks | ✅ | ❌ |
| Assign tasks | ✅ | ❌ |
| Delete tasks | ✅ | ❌ |
| Toggle complete | ✅ | ✅ |
| Team chat | ✅ | ✅ |

## 💬 Real-Time Chat

Uses Supabase Realtime subscriptions on the `messages` table. Messages appear instantly for all connected users without page refresh.

## 📝 Database Schema

- **users** — id (uuid), email, password (hashed), role (`admin`/`user`)
- **tasks** — id, title, description, status (`pending`/`completed`), assigned_to (user FK)
- **messages** — id, sender_id (user FK), content, created_at
