# IPAM Project (Full-Stack Decoupled)

A Dockerized full-stack application with a Laravel backend and a React frontend.

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose installed.
- (Optional) Node.js & PHP installed locally for IDE support.

### Run with Docker
1. **Clone the repository.**
2. **Start the services:**
   ```bash
   docker-compose up -d
   ```
3. **The application will be available at:**
   - **Frontend:** [http://localhost:3000](http://localhost:3000)
   - **Backend API:** [http://localhost:8000](http://localhost:8000)

---

## 🛠 Technology Stack

### Backend
- **Framework:** Laravel 11 (Latest Stable)
- **Runtime:** PHP 8.4 (Latest Stable)
- **Web Server:** Nginx (Stable Alpine)
- **Database:** MySQL 8.0

### Frontend
- **Framework:** React 18+
- **Build Tool:** Vite (configured with HMR for Docker)
- **Language:** TypeScript
- **Runtime:** Node.js 20 (Alpine)

---

## 📦 Project Structure
```text
├── backend/            # Laravel application code
├── frontend/           # React + Vite application code
├── docker/             # Docker configuration files
│   └── nginx/          # Nginx configuration for backend
├── docker-compose.yml  # Docker orchestration
└── README.md
```

---

## 🔑 Database Credentials
| Parameter | Value |
| :--- | :--- |
| **Host** | `127.0.0.1` |
| **Port** | `3306` |
| **User** | `sail` |
| **Password** | `root` |
| **Database** | `ipam` |

> [!NOTE]
> The database uses `mysql_native_password` for compatibility with clients like SQLyog.

---

## 🛠 Common Commands

### Backend Commands
```bash
# Run migrations
docker-compose exec backend php artisan migrate

# Generate App Key
docker-compose exec backend php artisan key:generate

# Access Backend Shell
docker-compose exec backend bash
```

### Frontend Commands
```bash
# Install local packages (for IDE support)
cd frontend && npm install

# Restart Frontend Container
docker-compose restart frontend
```
