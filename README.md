# CENTRAL (Oppex Auth Platform)

A secure, scalable authentication platform built with a modern 3-tier architecture. Designed for robust user management, seamless API integration, and cloud-native deployment.

---

## Overview

CENTRAL is a full-stack authentication platform featuring:
- **Modern frontend** (Vite + React) for user interaction
- **Node.js proxy server** for secure API routing and session management
- **Quarkus backend** (Java) for business logic and data persistence
- **PostgreSQL** (Supabase or AWS RDS) for storage
- **SendGrid** for transactional email
- **Cloud-native deployment** on AWS ECS Fargate, with Vercel for the frontend

---

## Architecture & Usage

This project uses a layered, secure architecture to deliver seamless authentication and user management:

- **Frontend (Vite + React):**
  - Provides a modern, responsive UI for users to sign up, log in, verify email, and manage sessions.
  - Sends all API requests to the Node.js proxy server (e.g., `/api/backend/*`).
  - Never communicates directly with the backend, ensuring a single, secure entry point for all API traffic.

- **Node.js Proxy Server:**
  - Acts as the secure gateway between the frontend and backend.
  - Verifies user credentials and creates JWTs on login/signup.
  - Sets and verifies secure, HTTP-only cookies for session management.
  - Validates JWTs on protected routes, ensuring only authenticated users can access sensitive endpoints.
  - Forwards API requests to the backend, attaching user/session info as needed.
  - Centralizes authentication and session logic, keeping the backend stateless and secure.

- **Backend (Quarkus):**
  - Handles all business logic, data persistence, and email notifications.
  - Integrates with PostgreSQL (via Supabase) for robust, scalable storage.
  - Expects authentication context from the proxy, focusing solely on core application logic.
  - Never exposed directly to the internet—only accessible by the proxy server for maximum security.

This architecture ensures:
- **Security:** All authentication and session management is centralized in the proxy, minimizing attack surface.
- **Scalability:** Each layer can scale independently, and the backend remains stateless.
- **Separation of Concerns:** UI, authentication/session, and business logic are cleanly separated for maintainability and clarity.

---

## Project Structure

```
/ (root)
├── frontend/   # Vite + React app (deployed on Vercel)
├── proxy/      # Node.js Express proxy (ECS Fargate)
├── backend/    # Quarkus Java backend (ECS Fargate)
└── README.md   # (this file)
```

Each folder contains a detailed README with setup, configuration, and deployment instructions.

---

## System Components

### 1. Frontend (Vite + React)
- User signup, login, logout, and email verification status
- Axios-based API calls via a Node.js proxy (`/api/proxy`)
- Environment-based configuration (`VITE_BACKEND_URL`)
- Deployed on **Vercel** for fast, global delivery
- See [`frontend/README.md`](./frontend/README.md) for setup, environment, and deployment details

### 2. Node.js Proxy Server
- Forwards frontend requests to the Quarkus backend
- Handles secure cookie-based sessions, path rewrites, and error handling
- Public-facing via AWS Application Load Balancer (ALB)
- Deployed as a container on **AWS ECS Fargate**
- Health check endpoint: `/api/health`
- See [`nodejs-proxy-server/README.md`](./nodejs-proxy-server/README.md) for local/dev setup, Docker, and AWS deployment

### 3. Quarkus Backend
- Java backend with REST endpoints for authentication and user management
- Integrates with PostgreSQL (Supabase)
- Passwords stored as salted + hashed (e.g., BCrypt)
- Session support via JWT or access tokens
- Health check endpoint: `/api/health`
- Deployed as a private container on **AWS ECS Fargate** (not public-facing)
- See [`backend/README.md`](./backend/README.md) for configuration, database, and deployment

---

## Key Features
- Secure JWT authentication and session management
- Scalable, cloud-native microservices
- Email notifications via SendGrid
- CI/CD ready (Docker, ECR, ECS, Vercel)
- Centralized logging with AWS CloudWatch

---

## AWS Deployment Summary

- **Frontend:**
  - Deployed on Vercel (static hosting, serverless functions for API proxying if needed)
- **Proxy (Node.js):**
  - Public-facing ECS Fargate service behind an Application Load Balancer (ALB)
  - Handles all API traffic from frontend, manages sessions, and forwards to backend
- **Backend (Quarkus):**
  - Private ECS Fargate service
  - Only accessible from the proxy service (enforced by security groups)
- **Database:**
  - PostgreSQL (Supabase)
- **Container Images:**
  - Stored in AWS ECR
- **Service Discovery:**
  - AWS Cloud Map (optional, recommended)


### ECS Service Structure
- 1 ECS Cluster
- 2 ECS Services (Proxy, Backend) on Fargate
- 2 ECS Tasks (one per service)
- Frontend is managed separately on Vercel

### Security
- ALB exposes only the proxy to the internet
- Proxy can access backend; backend is not public
- Security groups restrict access between services

---
