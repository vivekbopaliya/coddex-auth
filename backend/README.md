# Quarkus Backend

A RESTful backend built with Quarkus (Java), providing authentication and user management for the this platform. Integrates with PostgreSQL via Supabase and is designed for containerized deployment on AWS ECS Fargate.

---

## Features

- REST endpoints for signup, login, logout, email verification
- Passwords stored as salted + hashed (e.g., BCrypt)
- JWT or access token-based session support
- Health check endpoint: `/api/health`
- PostgreSQL integration via Supabase


## Running Locally

1. **Clone the repository:**
   ```bash
   git clone  https://github.com/vivekbopaliya/coddex-auth.git
   cd backend
   ```

2. **Configure environment variables:**
   - Copy `application.properties.example` to `application.properties`:
     ```bash
     cp src/main/resources/application.properties.example src/main/resources/application.properties
     ```
   - Edit the file and set the following variables (see below for details):
     ```properties
     POSTGRES_URL=postgresql://<host>:<port>/<db>
     POSTGRES_USERNAME=<your_db_user>
     POSTGRES_PASSWORD=<your_db_password>
     JWT_SECRET=<your_jwt_secret>
     APP_JWT_EXPIRATION=3600
     SENDGRID_API_KEY=<your_sendgrid_api_key>
     SENDGRID_FROM_EMAIL=<your_from_email>
     SENDGRID_FROM_NAME=<your_from_name>
     ```

3. **Run the backend:**
   ```bash
   ./mvnw quarkus:dev
   ```
   The API will be available at [http://localhost:8080](http://localhost:8080).

---

## Database Schema / Migrations

- You can use the Supabase SQL editor or migration tools to create tables.
- Example user table (matches the Java model):
  ```sql
  CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verification_token VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
  );
  ```

---

## Quarkus Extensions Used

- `quarkus-hibernate-reactive-panache` (Reactive ORM and active record pattern for PostgreSQL)
- `quarkus-reactive-pg-client` (Reactive PostgreSQL client)
- `quarkus-rest-jackson` (REST endpoints with JSON serialization)
- `quarkus-hibernate-orm-panache` (Synchronous ORM and active record pattern)
- `quarkus-arc` (Dependency injection)
- `quarkus-hibernate-validator` (Bean validation for REST and entities)
- `quarkus-mailer` (SendGrid email integration)
- `quarkus-smallrye-jwt` (JWT authentication and authorization)
- `quarkus-config-yaml` (YAML configuration file support)

---

## Environment Variables

| Variable                | Description                                 |
|-------------------------|---------------------------------------------|
| POSTGRES_URL            | PostgreSQL connection string (Supabase)      |
| POSTGRES_USERNAME       | Database username (Supabase)                |
| POSTGRES_PASSWORD       | Database password (Supabase)                |
| JWT_SECRET              | JWT signing secret                          |
| APP_JWT_EXPIRATION      | JWT expiration in seconds                   |
| SENDGRID_API_KEY        | SendGrid API key                            |
| SENDGRID_FROM_EMAIL     | Email address for sending emails            |
| SENDGRID_FROM_NAME      | Sender name for emails                      |

---


## Sample `application.properties`

```properties
quarkus.datasource.db-kind=postgresql
quarkus.datasource.reactive.url=${POSTGRES_URL}
quarkus.datasource.username=${POSTGRES_USERNAME}
quarkus.datasource.password=${POSTGRES_PASSWORD}
quarkus.datasource.jdbc=false
quarkus.datasource.reactive.ssl=true

quarkus.hibernate-orm.database.generation=drop-and-create
quarkus.hibernate-orm.log.sql=true
quarkus.hibernate-orm.sql-load-script=no-file
quarkus.hibernate-orm.database.default-schema=public

quarkus.log.category."io.quarkus.mailer".level=DEBUG

app.jwt.secret=${JWT_SECRET}
app.jwt.expiration=${APP_JWT_EXPIRATION}

sendgrid.api.key=${SENDGRID_API_KEY}
sendgrid.from.email=${SENDGRID_FROM_EMAIL}
sendgrid.from.name=${SENDGRID_FROM_NAME}
```

---

See [Frontend](../frontend/README.md) and [Proxy](../proxy/README.md) for more.