# IPAM Project

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

### Run Frontend Locally

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```

### Access the application

- **Frontend:** [http://localhost:5173/](http://localhost:5173/)
- **Backend API:** [http://localhost:8000](http://localhost:8000)

---

## 🛠 Technology Stack

### 🖥️ Backend

- **Framework:** [Laravel 11](https://laravel.com/) (Latest Stable)
- **Runtime:** PHP 8.4 (Latest Stable)
- **Authentication:** JWT (JSON Web Token) via `php-open-source-saver/jwt-auth`
- **Permissions:** RBAC (Role-Based Access Control) via `spatie/laravel-permission`
- **Database:** MySQL 8.0
- **Web Server:** Nginx (Alpine-based)

### 🎨 Frontend

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/) (with HMR)
- **Language:** TypeScript
- **UI Library:** [Material UI (MUI)](https://mui.com/material-ui/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching:** [TanStack Query v5](https://tanstack.com/query/latest) (React Query)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)

---

## 📦 Core Packages

### Backend (Composer)

- `laravel/framework`: Core Web Framework
- `php-open-source-saver/jwt-auth`: Secure JWT authentication for API
- `spatie/laravel-permission`: Robust permission and role management
- `laravel/tinker`: Powerful REPL for Laravel
- `fakerphp/faker`: Mock data generation for testing/seeding

### Frontend (NPM)

- `@mui/material`: Google's Material Design components
- `@mui/x-data-grid`: Premium data tables for IP and User management
- `@tanstack/react-query`: Powerful asynchronous state management
- `formik` & `yup`: Advanced form handling and schema-based validation
- `zustand`: Lightweight global state management
- `react-hot-toast`: Beautiful, responsive notifications
- `lucide-react`: Modern and consistent icons
- `framer-motion`: Production-ready motion library for React
- `apisauce`: Lightweight wrapper for Axios with standardized responses

---

## ✨ Features

### 🛡️ Authentication & Security

- **Secure JWT Flow**: Token-based authentication with automatic refresh strategies.
- **Advanced RBAC**: Granular control for `Super-Admin`, `Developer`, and `User` roles.
- **Admin Approval Workflow**: New registrations are held in a `pending` state until verified by an admin.
- **Protected Routes**: Secure navigation for authenticated users with role-based redirection.

### 🌐 IP Address Management (IPAM)

- **Universal Support**: Full support for both IPv4 and IPv6 addresses.
- **Dynamic Labeling**: Add custom labels and comments to any IP address.
- **Ownership Controls**: Users can manage their own entries, while admins maintain global oversight.
- **Advanced Filtering**: Search and filter IP addresses using high-performance data grids.

### 👥 User & Access Management

- **Centralized User Control**: Admins can approve, deactivate, or modify user roles.
- **Permission Management**: Direct control over system-wide roles and specific permissions.
- **Profile Self-Service**: Users can update their personal information and manage security settings (password).

### 📜 Compliance & Audit

- **Immutable Audit Logs**: Every modification to IPs or Users is automatically logged.
- **History Tracking**: Complete visibility into "Who changed What and When."
- **Session Intelligence**: Tracks login/logout events and active user sessions.
- **Append-Only Integrity**: Logs cannot be modified or deleted via the application UI.

### 📊 Dashboard & UI

- **Real-time Analytics**: Quick overview of system state, IP counts, and user statistics.
- **Responsive Design**: Fully mobile-friendly interface built with Material UI.
- **Modern Landing Page**: Professional entry point for new users and stakeholders.

---

## 🔑 Initial User Accounts (Seeded)

| Name       | Role      | Email              | Password   |
| :--------- | :-------- | :----------------- | :--------- |
| **Jenmar** | Developer | `jenmar@email.com` | `password` |

> [!IMPORTANT]
> **Seed Account Password:** Every seeded user in the system uses the password `password` by default.

### 🌱 Seeders

The application includes automated seeders to populate the environment:

- **UserSeeder**: Generates **51** users with various roles and statuses.
- **IpSeeder**: Generates **100** IP addresses (mix of IPv4 and IPv6) with labels.

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

| Parameter    | Value       |
| :----------- | :---------- |
| **Host**     | `127.0.0.1` |
| **Port**     | `3306`      |
| **User**     | `sail`      |
| **Password** | `root`      |
| **Database** | `ipam`      |

---

## 📦 Project Structure

```text
├── backend/            # PHP 8.4 Laravel 11 Backend
├── frontend/           # React 19 + Vite TS Frontend
├── docker/             # Docker configuration files
├── docker-compose.yml  # Docker orchestration
└── README.md
```

## 👀 Preview (Developer View – Full Permissions)
Some roles, such as Super Admin and Regular User, have limited permissions that restrict the pages they can access.
The view below shows the Developer perspective, which includes access to all pages, to give you a complete overview of the system.

## Landing Page

<img width="1920" height="1032" alt="2026-02-10_11-42-53" src="https://github.com/user-attachments/assets/2e9951e7-6b4e-4ee7-8668-5fdf8275c6ea" />
<img width="1920" height="1032" alt="2026-02-10_11-43-05" src="https://github.com/user-attachments/assets/7c7593dd-c126-4cb2-9ee0-aeb94861561e" />
<img width="1920" height="1032" alt="2026-02-10_11-43-19" src="https://github.com/user-attachments/assets/e46de354-6f26-460f-afff-f51d08fa4408" />

## Login

<img width="1920" height="1032" alt="2026-02-10_11-42-25" src="https://github.com/user-attachments/assets/974e8319-59a8-4bde-989d-a9ca9955487d" />

## Sign up

<img width="1920" height="1032" alt="2026-02-10_11-42-33" src="https://github.com/user-attachments/assets/d5fbf167-b9ab-44d2-bb7a-92d2c0d5ea9e" />

## Dashboard

<img width="1920" height="1032" alt="2026-02-10_11-27-10" src="https://github.com/user-attachments/assets/974f7343-8f18-4695-a4a9-6ca7771c7aff" />
<img width="1920" height="1032" alt="2026-02-10_11-34-15" src="https://github.com/user-attachments/assets/78070111-ef9e-4e65-9028-b03119ab8477" />

## IP Management

<img width="1920" height="1032" alt="2026-02-10_11-38-07" src="https://github.com/user-attachments/assets/bb558b86-1368-43cc-bb80-1c002cc7258e" />
<img width="1920" height="1032" alt="2026-02-10_11-38-41" src="https://github.com/user-attachments/assets/43d454db-a983-4867-9107-58307cf5fb7a" />
<img width="1920" height="1032" alt="2026-02-10_11-39-00" src="https://github.com/user-attachments/assets/39ddbc48-84a5-4e97-89e4-593924147111" />

## User Management

<img width="1920" height="1032" alt="2026-02-10_11-39-51" src="https://github.com/user-attachments/assets/b26d5832-0770-4997-a746-5500c99a3381" />
<img width="1920" height="1032" alt="2026-02-10_11-40-06" src="https://github.com/user-attachments/assets/e0992cc5-4497-4c7d-b52e-89bb60152047" />
<img width="1920" height="1032" alt="2026-02-10_11-40-47" src="https://github.com/user-attachments/assets/22cfba90-86fe-4485-9406-5b75e1a5c783" />
<img width="1920" height="1032" alt="2026-02-10_11-40-21" src="https://github.com/user-attachments/assets/4d6fe0e9-dd68-4125-be7a-a0001361c2d9" />

## Roles and Permissions

<img width="1920" height="1032" alt="2026-02-10_11-41-23" src="https://github.com/user-attachments/assets/f2d4d60b-1300-4175-bba5-63a07241b898" />
<img width="1920" height="1032" alt="2026-02-10_11-41-38" src="https://github.com/user-attachments/assets/31efc3b7-e203-428e-b4d8-c688f86b695e" />

## Profile

<img width="1920" height="1032" alt="2026-02-10_11-41-52" src="https://github.com/user-attachments/assets/74b641ca-ffeb-424d-a36b-cb2dee4f12a1" />
<img width="1920" height="1032" alt="2026-02-10_11-42-00" src="https://github.com/user-attachments/assets/59366f43-a33b-401d-84fb-8931d57e7e91" />
