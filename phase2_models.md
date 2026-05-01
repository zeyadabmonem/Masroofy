# Masroofy — Phase 2: Database Design & Models

> **Status:** ✅ Complete — Awaiting Approval Before Phase 3

---

## 1. Phase Objective

The goal of this phase was to construct the complete relational database architecture for Masroofy using Django Models. This lays the robust foundation required for the service layer and APIs in the upcoming phases.

---

## 2. Engineering Decisions

1.  **Modular App Structure**: Instead of a monolithic app, I split the backend into focused domains (`users`, `budgets`, `transactions`, `notifications`, `analytics`, `security`, `core`). This promotes separation of concerns and easier maintenance.
2.  **Custom User Model**: Used `AbstractUser` for `UserProfile` right from the start. This prevents massive migration headaches later if we need to add custom user fields.
3.  **Model-Level Validation**: Added strict validation in the models (e.g., `BudgetCycle.clean()` ensuring `end_date` is after `start_date` and preventing overlapping active cycles). This acts as a final safeguard even if serializer validation fails.
4.  **No Computed Fields Stored**: `remaining_balance`, `safe_daily_limit`, and similar fields are purposefully excluded from the schema. They will be computed dynamically in the service layer to prevent data inconsistency.
5.  **Constants Segregation**: Defined `EXPENSE_CATEGORIES` and `NOTIFICATION_TYPES` in `core.constants` to maintain a single source of truth rather than hardcoding them in models or views.

---

## 3. Architecture Explanation & File-by-File Breakdown

### `config/`
*   **`settings/base.py` & `settings/development.py`**: Separated settings for clean environments. Configured installed apps and basic REST Framework settings.
*   **`urls.py`, `wsgi.py`, `asgi.py`**: Standard Django entry points configured.

### `core/`
*   **`constants.py`**: Holds app-wide choices like categories and notification types.

### `users/`
*   **`models.py`**: Defines `UserProfile` extending `AbstractUser`.
*   **`admin.py`**: Registers the custom user model with the admin site.

### `budgets/`
*   **`models.py`**: Defines `BudgetCycle`. Links to the user, defines total allowance and active status. Enforces rules like single active cycle per user.
*   **`admin.py`**: Registered for easy testing and admin access.

### `transactions/`
*   **`models.py`**: Defines `Transaction`. Links to `BudgetCycle`. Stores amount, category, and notes.
*   **`admin.py`**: Registered for admin panel management.

### `notifications/`
*   **`models.py`**: Defines `NotificationLog`. Tracks alerts triggered during a cycle (e.g., 80% usage).
*   **`admin.py`**: Registered.

### `security/`
*   **`models.py`**: Defines `SecurityProfile` (1:1 with UserProfile). Stores hashed PIN and lock state for the privacy lock feature.
*   **`admin.py`**: Registered.

### `analytics/`
*   Contains basic app configuration. As planned, analytics will rely on dynamic queries/services, so no dedicated database tables are needed for now.

---

## 4. How to Run & Test

*   Ensure a virtual environment is active.
*   Install dependencies: `pip install -r backend/requirements.txt`
*   Generate migrations: `python backend/manage.py makemigrations`
*   Apply migrations: `python backend/manage.py migrate`
*   Create a superuser to access the admin panel: `python backend/manage.py createsuperuser`
*   Run the server: `python backend/manage.py runserver`
*   Access the admin panel at `http://127.0.0.1:8000/admin/` to see all the models registered and ready.

---

## 5. Risks / Improvements

*   **Risk**: SQLite is used for development, which handles concurrency differently than PostgreSQL.
    *   *Mitigation*: Kept database operations simple; moving to PostgreSQL in production is fully supported by the split settings architecture.
*   **Risk**: If a user updates an old transaction, it might not cleanly link if the budget cycle changed.
    *   *Mitigation*: We enforce `on_delete=CASCADE` and tightly bind transactions to cycles. We'll add strict edit constraints in the APIs later.

---

## 6. Next Phase Preview

**Phase 3: Backend Project Setup & Phase 4: Backend Core APIs**
We will implement the service layers, serializers, and thin views to expose these models via a RESTful API.

---

> **⚠️ STOP — Phase 2 Complete**
>
> All models, apps, and initial configurations are built. Awaiting your approval to begin **Phase 3 & 4: Backend Services and APIs**.
