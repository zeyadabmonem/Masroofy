# Masroofy — Phase 3 & 4: Backend Setup & Core APIs

> **Status:** ✅ Complete — Awaiting Approval Before Phase 5 (Frontend)

---

## 1. Phase Objective
The objective was to set up the Django REST Framework environment and implement the complete core API surface for the Masroofy MVP. This involved building the service layer, serializers, and views for all functional domains.

---

## 2. Engineering Decisions

### 2.1 Service Layer Architecture
- **Fat Services / Thin Views**: All business logic (calculations, complex filters, multi-step actions) is isolated in `services.py`. 
- **Rationale**: This makes the logic reusable (e.g., used by both API views and potential background tasks/management commands) and significantly easier to unit test.

### 2.2 Standardized API Communication
- **Standard Response Envelope**: Every API returns a consistent JSON structure: `{ success, data, message, errors }`.
- **Custom Exceptions**: Implemented `BusinessLogicException` and `ResourceNotFoundException` to ensure API errors are predictable and user-friendly.

### 2.3 Single-User PIN Authentication
- **PIN Service**: Handles bcrypt hashing of PINs and failed attempt lockouts.
- **JWT Integration**: Successful PIN verification issues a JWT token, keeping the architecture ready for cloud sync or multi-user support in the future.

---

## 3. Architecture Explanation & File Breakdown

### `security/`
- **`AuthService`**: Manages the default user creation and PIN lifecycle.
- **PIN APIs**: Setup and Verification endpoints.

### `budgets/`
- **`DailyLimitEngine`**: The "Heart" of the app. Implements the `Remaining Balance / Remaining Days` formula.
- **Budget APIs**: Handles initialization and monitoring of spending cycles.

### `transactions/`
- **`TransactionService`**: Handles expense logging with advanced filtering (category, date ranges, search).
- **Transaction APIs**: Full CRUD for logging and managing expenses.

### `analytics/`
- **`AnalyticsService`**: Aggregates data for charts without duplicating data in the DB.
- **Analytics APIs**: Provides data for Pie charts (category breakdown) and Bar charts (daily spending trends).

### `notifications/`
- **`NotificationService`**: Manages budget threshold alerts (80% warning, exhausted).
- **Notification APIs**: Allows the frontend to poll/list and dismiss alerts.

---

## 4. How to Run & Test

1. **Install Dependencies**: `pip install -r backend/requirements.txt`
2. **Setup Env**: Ensure `.env` exists (created in Phase 2).
3. **Migrate**: `python backend/manage.py makemigrations` followed by `python backend/manage.py migrate`.
4. **Run Server**: `python backend/manage.py runserver`.
5. **API Testing**: 
   - Use Postman/Insomnia to hit `/api/v1/auth/pin/setup/` to start.
   - Use the returned access token in `Authorization: Bearer <token>` header for subsequent requests.

---

## 5. Risks / Improvements
- **Calculation Drift**: The `DailyLimitEngine` recomputes limits on every request, ensuring they are always live.
- **Scalability**: The service layer is decoupled from the database, meaning we can swap SQLite for PostgreSQL easily.

---

## 6. Next Phase Preview
**Phase 5: Frontend Design System**
We will shift to the frontend to build the "Premium Fintech" UI kit (Tailwind + Typography + Reusable Components) before building the pages.

---

> **⚠️ STOP — Phase 3 & 4 Complete**
>
> All Backend APIs are functional and documented. Awaiting your approval to begin **Phase 5: Frontend Design System**.
