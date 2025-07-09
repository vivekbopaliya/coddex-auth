# Node.js Proxy Server

A Node.js Express server that acts as a secure API gateway between the frontend and the Quarkus backend. It manages authentication tokens (JWT), session cookies, and request forwarding.

---


## Features

- Forwards API requests from frontend to backend (`/api/backend/* → <BACKEND_URL>/*`)
- Handles JWT creation and verification for authentication
- Manages secure, HTTP-only session cookies
- Validates user sessions on protected routes
- Centralized logging for all API traffic

---

## Installation & Local Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/central.git
   cd central/nodejs-proxy-server
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
     BACKEND_URL=http://localhost:8080
     SESSION_SECRET=your-session-secret
     JWT_SECRET=your-jwt-secret
     PORT=3000
     ```

4. **Run the server:**
   ```bash
   npm start
   # or
   yarn start
   ```

   The proxy will listen on `http://localhost:3000`.

---

## Environment Variables

| Variable        | Description                                         |
|----------------|-----------------------------------------------------|
| BACKEND_URL    | URL of the Quarkus backend service                  |
| SESSION_SECRET | Secret for signing session cookies                  |
| JWT_SECRET     | Secret for signing/verifying JWTs                   |
| PORT           | Port to run the proxy server (default: 3000)        |

---

## Health Checks

- **Node.js Proxy Health:**
  - Check the health of the proxy server at [`/api/health`](http://localhost:3000/api/health)
- **Backend (Quarkus) Health:**
  - Check the health of the backend (via the proxy) at [`/api/health/quarkus`](http://localhost:3000/api/health/quarkus)

---


See [Frontend](../frontend/README.md) and [Backend](../backend/README.md) for more.'


