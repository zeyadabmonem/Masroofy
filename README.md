# 💰 Masroofy

**Masroofy** is a modern, privacy-focused, and offline-capable micro-budgeting application designed to give you absolute control over your daily spending cycles.

![Masroofy Dashboard Preview](https://img.shields.io/badge/UI-Premium_Dark_Mode-0a0f1c?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-React_%7C_Django_%7C_Tailwind-blue?style=for-the-badge)

## ✨ Key Features

- **🔒 Secure Vault (Local Authentication):** Your data is locked behind a secure 4-6 digit PIN, hashed securely with `bcrypt`. No complex user registrations needed.
- **🔄 Cycle-Based Budgeting:** Set a budget for a specific time period (e.g., 30 days) and track your allowance and safe daily spending limits dynamically.
- **📊 Real-time Analytics & Charts:** Visualize your spending habits with built-in, lightweight custom CSS charts (Pie Charts for categories, Bar Charts for daily spending).
- **📶 Offline-First Capabilities:** Built with Zustand and LocalStorage persistence, your transaction data is securely cached so you can log expenses even with a poor internet connection.
- **🎨 Premium UI/UX:** A stunning, modern dark-mode interface built with Tailwind CSS, featuring smooth micro-animations, glassmorphism, and responsive design.

---

## 🏗️ Architecture & Tech Stack

Masroofy is split into a modular backend and a lightning-fast frontend.

### Frontend (`/frontend`)
- **Framework:** React 18 powered by Vite.
- **Styling:** Tailwind CSS (configured with a custom, high-contrast dark theme).
- **State Management:** Zustand (with persistence middlewares).
- **Icons:** Lucide React.
- **Routing:** React Router DOM v6.

### Backend (`/backend`)
- **Framework:** Django & Django REST Framework (DRF).
- **Database:** SQLite (perfect for lightweight, single-user MVP deployments).
- **Security:** `bcrypt` for PIN hashing, `djangorestframework-simplejwt` for secure session tokens.
- **Architecture:** Clean, app-based modularity (`users`, `security`, `budgets`, `transactions`, `analytics`, `notifications`).

---

## 🚀 Getting Started

Follow these steps to run Masroofy locally on your machine.

### Prerequisites
- Node.js (v18+)
- Python (3.10+)

---

### ⚡ One-Click Quick Start (Windows Only)

For the fastest and easiest way to start the application, simply use the provided batch script.

1. Open your File Explorer.
2. Navigate to the root of the `Masroofy` project directory.
3. Double-click the **`run.bat`** file.

*This script will automatically open two terminal windows, securely activate your Python virtual environment, start the Django backend, and launch the React frontend development server simultaneously.*

---

### 💻 Manual Setup (Cross-Platform)

If you prefer to run the application manually from your terminal, follow these steps:

#### 1. Backend Setup

Open a terminal and navigate to the `backend` directory:

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Start the development server
python manage.py runserver
```
*The backend will run at `http://127.0.0.1:8000/`.*

#### 2. Frontend Setup

Open a second terminal and navigate to the `frontend` directory:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
*The frontend will be available at `http://localhost:5173/`.*

---

## 📖 Usage Guide

1. **First Launch:** When you open the app for the first time, you will be prompted to create a **4-6 digit PIN**. This secures your vault.
2. **Create a Budget:** Once inside, you'll be met with an empty dashboard. Click **"Create Budget"** to define your total allowance and the start/end dates for your cycle.
3. **Log Expenses:** Use the **"Log Expense"** button to track what you spend. You can assign categories and optional notes.
4. **Analytics:** Navigate to the Analytics tab on the sidebar to see exactly where your money is going and monitor your "Safe Daily Limit".
5. **Lock Vault:** Click the "Lock Vault" button at the bottom of the sidebar when you step away from your device to secure your financial data.

---

## 🧹 Project Structure

```text
Masroofy/
├── backend/                  # Django REST API
│   ├── core/                 # Global configurations & exception middleware
│   ├── config/               # Django settings and main urls
│   ├── security/             # PIN auth & JWT handling
│   ├── budgets/              # Budget cycles logic
│   └── transactions/         # Expense logging logic
└── frontend/                 # React UI
    ├── src/
    │   ├── components/       # Reusable UI elements (Buttons, Inputs, Cards)
    │   ├── features/         # Feature-specific modals and logic
    │   ├── hooks/            # Custom React hooks for API interaction
    │   ├── layouts/          # Global layout wrappers (Sidebar, Nav)
    │   ├── pages/            # Main application views
    │   ├── store/            # Zustand global state stores
    │   └── utils/            # Helper functions (currency formatting)
```

---
*Built with ❤️ for a structured and disciplined financial lifestyle.*
