# Frontend

A modern React application built with Vite, providing user authentication (signup, login, email verification, logout)

---

## Features

- User signup, login, logout, and email verification status
- Responsive, accessible UI

---

## Installation & Development Setup

1. **Clone the repository:**
   ```bash
   git clone  https://github.com/vivekbopaliya/coddex-auth.git
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and set:
     ```
     VITE_BACKEND_URL=https://your-proxy-domain.com/api/backend
     ```

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The app will be available at [http://localhost:5173](http://localhost:5173).

---

## Environment Variables

| Variable           | Description                                 |
|--------------------|---------------------------------------------|
| VITE_BACKEND_URL   | URL of the nodejs proxy (e.g., via ALB)    |

---

See [Nodejs-proxy-server](../nodejs-proxy-server/README.md) and [Backend](../backend/README.md) for more.