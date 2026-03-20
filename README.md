<div align="center">
  
# ⚡ Bidyut Solutions — Team Task Dashboard

**A sophisticated full-stack Team Task Dashboard built with Next.js, Tailwind CSS, and Supabase.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database_&_Realtime-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

<br />

<h3>
  <a href="(https://bidyut-assignment-abhigyan-singh.vercel.app/)">
    🚀 View Live Demo 🚀
  </a>
</h3>
<p><i>(Replace the link in the README.md with your deployed website URL)</i></p>

</div>

---

## 🌟 Overview

The **Team Task Dashboard** is a powerful internal web application built for seamless team task management and real-time collaboration. It provides a highly responsive UI, strict role-based access control, and instant messaging—ensuring your team stays aligned and productive.

## ✨ Key Features

- **🔐 Custom JWT Authentication**: Pure custom implementation (no external auth libraries). Secure password hashing with `bcryptjs` (12 rounds) and edge-compatible JWTs via `jose` stored safely in HTTP-only cookies.
- **👥 Role-Based Access Control (RBAC)**: Distinct workflows, dashboards, and permissions for `admin` and `user` roles.
- **💬 Real-Time Team Chat**: Supabase realtime subscriptions guarantee instant message deliveries for all connected users without manual page refreshes.
- **📋 Task Management**: Admins have authoritative control to create, assign, and delete tasks. Users get a focused view of only their assigned tasks.
- **🎨 Modern UI/UX**: Developed with **Next.js App Router** and **Tailwind CSS v4**, guaranteeing a crisp, fully responsive, and premium visual experience.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database & Realtime**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Security & Crypto**: `bcryptjs` (Password Hashing), `jose` (Edge-compatible JWT processing)

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### 1. Clone & Install

```bash
git clone https://github.com/abhigyansinghthakur30-oss/BIDYUT-ASSIGNMENT-ABHIGYAN-SINGH-.git
cd BIDYUT-ASSIGNMENT-ABHIGYAN-SINGH-
npm install
```

### 2. Set Up Environment Variables

Create a tightly-scoped `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret_key
```

### 3. Initialize Supabase Database

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open the **SQL Editor**.
3. Copy and paste the entire contents of `supabase-schema.sql` located in this repository.
4. Click **Run** to generate the required tables, relations, and Row Level Security (RLS) policies.

### 4. Enable Realtime Subscriptions

For the instant team chat to function, you'll need to enable realtime broadcasts on your Supabase instance:
1. In your Supabase Dashboard, navigate to **Database → Replication**.
2. Ensure the `messages` table has **realtime enabled**.

### 5. Run the Application

Fire up the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

---

## 👤 Role Capabilities

A complete breakdown of permissions within the dashboard:

| Feature                   | Admin | User              |
| ------------------------- | :---: | :---------------: |
| **View Tasks**            | ✅ All | ✅ Assigned only |
| **Create Tasks**          | ✅    | ❌                |
| **Assign Tasks**          | ✅    | ❌                |
| **Delete Tasks**          | ✅    | ❌                |
| **Toggle Task Completion**| ✅    | ✅                |
| **Team Chat**             | ✅    | ✅                |

---

## 📝 Database Schema Overview

The Supabase PostgreSQL database consists of three primary tables:

- **`users`** — `id` (UUID), `email`, `password` (Hashed), `role` (`admin`/`user`).
- **`tasks`** — `id`, `title`, `description`, `status` (`pending`/`completed`), `assigned_to` (Foreign Key referencing `users.id`).
- **`messages`** — `id`, `sender_id` (Foreign Key referencing `users.id`), `content`, `created_at`.

---

## 📁 Repository Structure

```text
src/
├── app/
│   ├── api/
│   │   ├── auth/           # Login, Register, Logout, Me endpoints
│   │   ├── tasks/          # Task CRUD endpoints
│   │   ├── messages/       # Chat message endpoints
│   │   └── users/          # Users list (used for assigning tasks)
│   ├── dashboard/          # Main dashboard views
│   ├── login/              # Login interface
│   ├── register/           # Registration interface
│   ├── layout.js           # Root layout component
│   ├── page.js             # Root redirect (directs to /login)
│   └── globals.css         # Global Styles & Tailwind directies
├── components/
│   ├── Navbar.jsx          # Top Navigation Bar
│   ├── TaskPanel.jsx       # Task Management Component
│   └── ChatPanel.jsx       # Real-time Team Chat Component
├── lib/
│   ├── auth.js             # JWT & bcrypt helper utilities
│   └── supabase.js         # Supabase client instantiation
└── middleware.js           # Next.js Route Protection logic
```
