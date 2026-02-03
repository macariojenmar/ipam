# IPAM Project (Full-Stack Decoupled)

A Dockerized full-stack application for IP Address Management (IPAM) featuring a Laravel 11 backend and a React (Vite) frontend.

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose installed.
- (Optional) Node.js (v20+) & PHP (8.4) installed locally for IDE support.

### Run with Docker
1. **Clone the repository.**
2. **Setup environment:**
   ```bash
   cp backend/.env.example backend/.env
   ```
3. **Start the services:**
   ```bash
   docker-compose up -d
   ```
4. **Install composer:**
   ```bash
   docker-compose exec backend composer install
   ```
5. **Generate JWT secret:**
   ```bash
   docker-compose exec backend php artisan jwt:secret
   ```
6. **Generate App Key:**
   ```bash
   docker-compose exec backend php artisan key:generate
   ```
7. **Seed the database (Initial Roles & Users):**
   ```bash
   docker-compose exec backend php artisan migrate:fresh --seed
   ```
8. **Access the application:**
   - **Frontend:** [http://localhost:3000](http://localhost:3000)
   - **Backend API:** [http://localhost:8000](http://localhost:8000)

---

## 🛠 Technology Stack

### Backend
- **Framework:** Laravel 11 (Latest Stable)
- **Runtime:** PHP 8.4 (Latest Stable)
- **Permissions:** Spatie Laravel Permission
- **Web Server:** Nginx (Stable Alpine)
- **Database:** MySQL 8.0

### Frontend
- **Framework:** React 18+
- **Build Tool:** Vite (configured with HMR for Docker)
- **Language:** TypeScript
- **Runtime:** Node.js 20 (Alpine)

---

## ✨ Features

### Authentication & Authorization
- **JWT-based Authentication**: Secure API interaction with token renewal support.
- **RBAC (Role Based Access Control)**: Using Spatie for `Developer`, `User`, and `Super-Admin` roles.
- **Approval Workflow**: Registering users start as `pending`. Super-admins must approve them (`active`) before they can log in.

### IP Address Management
- **IPv4/IPv6 Support**: Add and manage IP addresses with labels and comments.
- **Permissions**:
  - **Regular Users**: Can view all IPs, and update only their own IPs (label only).
  - **Super-Admins**: Full CRUD access to all IP addresses.

### Immutable Audit Logging
- **Change Tracking**: Every change to an IP address or User is logged.
- **Session Focus**: Audit logs track changes within a user session and over the entire entity lifetime.
- **Login/Logout Events**: Automated logging of authentication sessions.
- **Security**: Logs are append-only and cannot be deleted via the application.

---

## 🔑 Initial User Accounts (Seeded)

| Name | Role | Email | Password |
| :--- | :--- | :--- | :--- |
| **James Doe** | Developer | `james@email.com` | `password` |
| **Jane Doe** | Super-Admin | `jane@email.com` | `password` |
| **John Smith** | User | `john@email.com` | `password` |

---

## 🛠 Common Commands

### Backend Operations
```bash
# Run migrations and seeds
docker-compose exec backend php artisan migrate:fresh --seed

# Access Backend Shell
docker-compose exec backend bash

# View Logs
docker-compose logs -f backend
```

### Database Credentials
| Parameter | Value |
| :--- | :--- |
| **Host** | `127.0.0.1` |
| **Port** | `3306` |
| **User** | `sail` |
| **Password** | `root` |
| **Database** | `ipam` |

---

## 📦 Project Structure
```text
├── backend/            # PHP 8.4 Laravel 11 Backend
├── frontend/           # React 18 + Vite TS Frontend
├── docker/             # Docker configuration files
├── docker-compose.yml  # Docker orchestration
└── README.md
```
