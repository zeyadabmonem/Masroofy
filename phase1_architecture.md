# Masroofy — Phase 1: Project Planning & Architecture

> **Status:** ✅ Complete — Awaiting Approval Before Phase 2

---

## 1. Phase Objective

Produce a complete, detailed architecture blueprint for **Masroofy** — a fintech-grade personal budget management application — covering every architectural domain required before a single line of implementation is written.

---

## 2. Product Summary

| Field | Value |
|---|---|
| Product Name | Masroofy (مصروفي) |
| Category | Personal Finance / Budgeting |
| MVP Scope | Allowance management, daily limit engine, expense tracking, analytics |
| Primary Platform | Web (Mobile-first PWA) |
| Connectivity | Offline-first; no mandatory internet dependency |
| Auth Model | Local PIN (biometric-ready) — no cloud auth in MVP |

---

## 3. Engineering Decisions & Rationale

### 3.1 Backend — Django + DRF

| Decision | Rationale |
|---|---|
| Django as framework | Battle-tested, modular app system maps directly to our feature domains |
| Django REST Framework | Best-in-class serializer validation, browsable API, and throttling |
| SQLite (dev) → PostgreSQL-ready | Zero-config for development; schema is RDBMS-portable |
| Service Layer (Fat Services / Thin Views) | Business logic never lives in views or models; all calculations in services |
| Modular Django apps | Each domain (`budgets`, `transactions`, `analytics`, etc.) is isolated |
| JWT-ready architecture | `djangorestframework-simplejwt` wired in from day one, even if PIN auth is primary |
| Environment variables via `python-decouple` | No secrets in source code; `.env`-driven config |
| Constants / config files | No magic strings or hardcoded values anywhere |

### 3.2 Frontend — React + Vite + Tailwind

| Decision | Rationale |
|---|---|
| Vite | Fastest HMR, modern ESM bundler, optimal for React SPA |
| React 18 | Industry standard, excellent ecosystem |
| Tailwind CSS | Utility-first, enforces design system constraints, fast iteration |
| Zustand | Lightweight, boilerplate-free state management vs. Redux |
| Axios | Interceptors, instance-based config, best DX for REST APIs |
| React Router v6 | Nested routes map cleanly to our layout system |
| Recharts | Declarative, composable charts that fit our fintech aesthetic |

### 3.3 Offline-First

| Decision | Rationale |
|---|---|
| localStorage + IndexedDB | Persist app state locally without a service worker complexity in MVP |
| Zustand `persist` middleware | Automatic state rehydration on load |
| Optimistic UI updates | Transactions appear instantly; sync happens in background |
| Queue-based sync | Offline writes queued, replayed on reconnect |

### 3.4 Security

| Decision | Rationale |
|---|---|
| PIN stored as bcrypt hash | Never store plaintext PINs |
| localStorage encryption layer | Sensitive financial data encrypted at rest (AES via `crypto-js`) |
| Input sanitization | DRF serializer validation on backend; Zod-style constraints on frontend |
| Biometric-ready interface | `navigator.credentials` API abstracted behind an `AuthService` |

---

## 4. Full Folder Structure

### 4.1 Repository Root

```
Masroofy/
├── backend/                  # Django project
├── frontend/                 # React/Vite project
├── docs/                     # Architecture docs, SRS, ADRs
├── .env.example              # Environment variable template
├── .gitignore
└── README.md
```

---

### 4.2 Backend Folder Structure

```
backend/
├── manage.py
├── requirements.txt
├── .env                      # Never committed
├── .env.example
│
├── config/                   # Django project config (replaces default project folder)
│   ├── __init__.py
│   ├── settings/
│   │   ├── __init__.py
│   │   ├── base.py           # Shared settings
│   │   ├── development.py    # Dev overrides (DEBUG=True, SQLite)
│   │   └── production.py     # Prod overrides (PostgreSQL, security headers)
│   ├── urls.py               # Root URL router
│   ├── wsgi.py
│   └── asgi.py
│
├── core/                     # Shared utilities used across apps
│   ├── __init__.py
│   ├── constants.py          # App-wide constants (categories, limits, etc.)
│   ├── exceptions.py         # Custom exception classes
│   ├── permissions.py        # Shared DRF permission classes
│   ├── pagination.py         # Standard pagination config
│   ├── response.py           # Standardized API response helpers
│   └── validators.py         # Shared validation utilities
│
├── users/                    # User & session management
│   ├── models.py             # UserProfile (extends AbstractUser or standalone)
│   ├── serializers.py
│   ├── services.py           # PINService, AuthService
│   ├── views.py              # Thin views
│   ├── urls.py
│   └── tests/
│
├── budgets/                  # Allowance cycles & budget management
│   ├── models.py             # BudgetCycle, AllowanceConfig
│   ├── serializers.py
│   ├── services.py           # BudgetService, DailyLimitEngine
│   ├── views.py
│   ├── urls.py
│   └── tests/
│
├── transactions/             # Expense tracking
│   ├── models.py             # Transaction
│   ├── serializers.py
│   ├── services.py           # TransactionService
│   ├── views.py
│   ├── urls.py
│   └── tests/
│
├── analytics/                # Dashboard metrics & chart data
│   ├── models.py             # (Potentially materialized view or computed)
│   ├── serializers.py
│   ├── services.py           # AnalyticsService, SpendingAggregator
│   ├── views.py
│   ├── urls.py
│   └── tests/
│
├── notifications/            # Alert rules & notification state
│   ├── models.py             # NotificationRule, NotificationLog
│   ├── serializers.py
│   ├── services.py           # NotificationService, AlertEngine
│   ├── views.py
│   ├── urls.py
│   └── tests/
│
└── security/                 # PIN & lock management
    ├── models.py             # SecurityProfile
    ├── serializers.py
    ├── services.py           # PINHasher, LockService
    ├── views.py
    ├── urls.py
    └── tests/
```

---

### 4.3 Frontend Folder Structure

```
frontend/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── .env
├── .env.example
│
└── src/
    ├── main.jsx              # App entry point
    ├── App.jsx               # Router root
    │
    ├── assets/               # Static assets (icons, fonts)
    │
    ├── constants/            # App-wide constants
    │   ├── categories.js     # Expense category definitions
    │   ├── routes.js         # Route path constants
    │   ├── api.js            # API endpoint constants
    │   └── config.js         # App config (thresholds, limits)
    │
    ├── styles/               # Global styles & design tokens
    │   ├── globals.css       # Tailwind directives + CSS variables
    │   └── fonts.css         # Font imports
    │
    ├── layouts/              # Shared page layouts
    │   ├── AppLayout.jsx     # Authenticated layout (sidebar/nav)
    │   ├── AuthLayout.jsx    # Unauthenticated layout (PIN screen)
    │   └── FullscreenLayout.jsx
    │
    ├── components/           # Pure reusable UI components
    │   ├── ui/               # Design system primitives
    │   │   ├── Button.jsx
    │   │   ├── Input.jsx
    │   │   ├── Card.jsx
    │   │   ├── Modal.jsx
    │   │   ├── Badge.jsx
    │   │   ├── Spinner.jsx
    │   │   ├── Avatar.jsx
    │   │   └── Divider.jsx
    │   ├── feedback/         # State feedback components
    │   │   ├── EmptyState.jsx
    │   │   ├── ErrorState.jsx
    │   │   └── LoadingState.jsx
    │   ├── charts/           # Recharts wrappers
    │   │   ├── SpendingPieChart.jsx
    │   │   ├── DailySpendingBar.jsx
    │   │   └── ProgressRing.jsx
    │   └── navigation/
    │       ├── Navbar.jsx
    │       ├── Sidebar.jsx
    │       └── BottomNav.jsx  # Mobile navigation
    │
    ├── features/             # Feature-specific components (smart)
    │   ├── dashboard/
    │   │   ├── DashboardPage.jsx
    │   │   ├── BalanceCard.jsx
    │   │   ├── DailyLimitCard.jsx
    │   │   ├── SpendingProgressCard.jsx
    │   │   └── AlertBanner.jsx
    │   ├── transactions/
    │   │   ├── TransactionList.jsx
    │   │   ├── TransactionItem.jsx
    │   │   ├── AddTransactionModal.jsx
    │   │   ├── EditTransactionModal.jsx
    │   │   ├── TransactionFilters.jsx
    │   │   └── CategoryIcon.jsx
    │   ├── budget/
    │   │   ├── BudgetSetupPage.jsx
    │   │   ├── BudgetSummaryCard.jsx
    │   │   └── CycleResetModal.jsx
    │   ├── analytics/
    │   │   ├── AnalyticsPage.jsx
    │   │   ├── CategoryBreakdown.jsx
    │   │   └── SpendingTrendChart.jsx
    │   └── security/
    │       ├── PINSetupPage.jsx
    │       ├── PINLockScreen.jsx
    │       └── PINInput.jsx
    │
    ├── pages/                # Route-level page components (thin wrappers)
    │   ├── DashboardPage.jsx
    │   ├── TransactionsPage.jsx
    │   ├── AnalyticsPage.jsx
    │   ├── BudgetPage.jsx
    │   ├── SettingsPage.jsx
    │   └── NotFoundPage.jsx
    │
    ├── store/                # Zustand stores
    │   ├── useBudgetStore.js
    │   ├── useTransactionStore.js
    │   ├── useNotificationStore.js
    │   ├── useSecurityStore.js
    │   └── useUIStore.js     # Loading, modal, toast states
    │
    ├── services/             # API layer (Axios-based)
    │   ├── apiClient.js      # Axios instance with interceptors
    │   ├── budgetService.js
    │   ├── transactionService.js
    │   ├── analyticsService.js
    │   └── securityService.js
    │
    ├── hooks/                # Shared custom React hooks
    │   ├── useDailyLimit.js
    │   ├── useOfflineSync.js
    │   ├── usePINLock.js
    │   └── useNotifications.js
    │
    └── utils/                # Pure utility functions
        ├── currency.js       # Formatting (EGP, amounts)
        ├── date.js           # Date helpers
        ├── calculations.js   # Daily limit formula, rollover
        ├── storage.js        # localStorage/IndexedDB wrappers
        └── encryption.js     # AES encryption for local data
```

---

## 5. Database Planning Overview

### 5.1 Entity Relationship Summary

```
UserProfile
    └──< BudgetCycle (one active at a time)
              └──< Transaction
              └──< NotificationLog
              └── SecurityProfile (1:1)
```

### 5.2 Core Entities (Preview — Full Schema in Phase 2)

| Entity | Key Fields | Purpose |
|---|---|---|
| `UserProfile` | id, display_name, created_at | App user (local, no cloud auth) |
| `BudgetCycle` | id, user, total_allowance, start_date, end_date, is_active | A single budget period |
| `Transaction` | id, cycle, amount, category, note, created_at | Individual expense record |
| `NotificationLog` | id, cycle, type, triggered_at, is_dismissed | Alert history |
| `SecurityProfile` | id, user, pin_hash, lock_enabled, failed_attempts | PIN & lock state |

### 5.3 Key Calculated Fields (NOT stored — computed on demand)

| Field | Formula |
|---|---|
| `remaining_balance` | `total_allowance − Σ(transactions.amount)` |
| `remaining_days` | `(end_date − today).days` |
| `safe_daily_limit` | `remaining_balance / remaining_days` |
| `spending_percentage` | `Σ(transactions.amount) / total_allowance × 100` |

> **Engineering Decision:** These are computed in the `BudgetService` service class, not stored as model fields. This avoids data drift and ensures accuracy.

---

## 6. API Planning Overview

### 6.1 API Structure

All APIs follow RESTful conventions under `/api/v1/`.

```
POST   /api/v1/auth/pin/setup/          # Set up PIN
POST   /api/v1/auth/pin/verify/         # Verify PIN → returns session token
POST   /api/v1/auth/pin/change/         # Change PIN

GET    /api/v1/budgets/                 # List cycles (paginated)
POST   /api/v1/budgets/                 # Create new budget cycle
GET    /api/v1/budgets/active/          # Get current active cycle
PATCH  /api/v1/budgets/{id}/           # Update cycle (dates, amount)
DELETE /api/v1/budgets/{id}/reset/     # Safe cycle reset

GET    /api/v1/transactions/            # List (filters: category, date range)
POST   /api/v1/transactions/            # Log expense
GET    /api/v1/transactions/{id}/       # Get single transaction
PATCH  /api/v1/transactions/{id}/      # Edit transaction
DELETE /api/v1/transactions/{id}/      # Delete transaction

GET    /api/v1/analytics/summary/       # Dashboard stats
GET    /api/v1/analytics/category-breakdown/  # Pie chart data
GET    /api/v1/analytics/daily-spending/      # Daily bar chart data

GET    /api/v1/notifications/           # Notification list
PATCH  /api/v1/notifications/{id}/dismiss/   # Dismiss alert
```

### 6.2 Standard Response Envelope

```json
{
  "success": true,
  "data": { ... },
  "message": "Budget cycle created successfully.",
  "errors": null
}
```

### 6.3 Error Response

```json
{
  "success": false,
  "data": null,
  "message": "Validation failed.",
  "errors": {
    "amount": ["This field is required."]
  }
}
```

---

## 7. Design System Planning

### 7.1 Color Palette (Fintech Dark Theme)

| Token | Value | Usage |
|---|---|---|
| `--color-bg-primary` | `#0A0E1A` | Page background |
| `--color-bg-secondary` | `#111827` | Card background |
| `--color-bg-elevated` | `#1C2333` | Elevated cards, modals |
| `--color-accent` | `#3B82F6` | Primary CTA (Trust Blue) |
| `--color-accent-hover` | `#2563EB` | Hover state |
| `--color-success` | `#10B981` | Positive balance, income |
| `--color-warning` | `#F59E0B` | 80% threshold alert |
| `--color-danger` | `#EF4444` | Over budget, danger |
| `--color-text-primary` | `#F9FAFB` | Main text |
| `--color-text-secondary` | `#9CA3AF` | Labels, secondary |
| `--color-text-muted` | `#6B7280` | Timestamps, hints |
| `--color-border` | `#1F2937` | Card borders |

### 7.2 Typography

| Token | Font | Usage |
|---|---|---|
| Display | Inter 700 | Large amounts, heroes |
| Heading | Inter 600 | Section headings |
| Body | Inter 400 | Regular content |
| Caption | Inter 400 | Labels, timestamps |
| Mono | JetBrains Mono | Amount values, numbers |

### 7.3 Spacing System (Tailwind-extended)

8-point grid: `4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px`

### 7.4 Component Inventory

| Component | Variants |
|---|---|
| `Button` | primary, secondary, ghost, danger; sm/md/lg |
| `Input` | default, error, disabled; with/without icon |
| `Card` | default, elevated, interactive |
| `Modal` | default, fullscreen (mobile) |
| `Badge` | category colors (7 categories) |
| `ProgressBar` | linear (spending), ring (daily) |
| `StatCard` | balance, limit, percentage |
| `EmptyState` | no transactions, no budget |
| `ErrorState` | API error, offline error |
| `LoadingState` | skeleton cards, spinner |

---

## 8. State Management Planning (Zustand)

### 8.1 Store Architecture

| Store | Responsibility |
|---|---|
| `useBudgetStore` | Active cycle, allowance, dates, calculated fields |
| `useTransactionStore` | Transaction list, CRUD, offline queue |
| `useNotificationStore` | Alert state, dismissal, threshold tracking |
| `useSecurityStore` | PIN state, lock status, failed attempts |
| `useUIStore` | Loading states, active modals, toast messages |

### 8.2 Persistence Strategy

```
useBudgetStore       → persisted (localStorage)
useTransactionStore  → persisted (localStorage + IndexedDB for large datasets)
useNotificationStore → persisted (localStorage)
useSecurityStore     → persisted (localStorage, encrypted)
useUIStore           → NOT persisted (ephemeral UI state)
```

### 8.3 Offline Queue

`useTransactionStore` maintains an `offlineQueue[]` for operations made while disconnected. On reconnect, the queue is replayed sequentially against the API.

---

## 9. Security Architecture

### 9.1 PIN System

```
User sets PIN (4–6 digits)
    → SHA-256 + bcrypt hash (backend)
    → Stored in SecurityProfile.pin_hash
    → Frontend never stores raw PIN
    → Session token issued on successful verify
```

### 9.2 Local Data Encryption

```
All Zustand persisted stores
    → Serialized JSON
    → AES-256 encrypted (key derived from device fingerprint)
    → Stored in localStorage
```

### 9.3 Biometric Readiness

The `AuthService` on the frontend abstracts all auth behind an interface:
```js
AuthService.authenticate()   // → PIN or Biometric
AuthService.verifyPIN(pin)   // → Local verification
AuthService.useBiometric()   // → WebAuthn / navigator.credentials
```
In MVP, only `verifyPIN` is implemented. `useBiometric` is a no-op stub.

### 9.4 Input Validation

- **Backend:** DRF serializers enforce type, length, range, and business rules
- **Frontend:** Client-side validation mirrors backend rules for instant UX feedback
- All user inputs sanitized before storage or transmission

---

## 10. Offline-First Strategy

### 10.1 Architecture Pattern: Local-First

```
User Action
    → Update Zustand store immediately (optimistic)
    → Persist to localStorage/IndexedDB
    → If online: sync to backend API
    → If offline: add to offlineQueue
    → On reconnect: flush offlineQueue
```

### 10.2 Conflict Resolution

Since this is a single-user application with no multi-device sync in MVP, **last-write-wins** is sufficient. The offline queue is processed in FIFO order.

### 10.3 Data Durability

| Data | Storage |
|---|---|
| Budget cycle | localStorage via Zustand persist |
| Transactions | localStorage (≤500 items) / IndexedDB (larger) |
| Calculations | Recomputed from stored data on each load |
| Security state | localStorage (AES encrypted) |

---

## 11. Naming Conventions

### 11.1 Backend

| Type | Convention | Example |
|---|---|---|
| Models | PascalCase | `BudgetCycle`, `Transaction` |
| Services | PascalCase + Service suffix | `BudgetService`, `DailyLimitEngine` |
| Serializers | PascalCase + Serializer suffix | `TransactionSerializer` |
| Views | PascalCase + ViewSet/APIView | `TransactionViewSet` |
| URLs | snake_case | `budget-cycles`, `active-cycle` |
| Constants | UPPER_SNAKE_CASE | `MAX_PIN_ATTEMPTS`, `CATEGORIES` |

### 11.2 Frontend

| Type | Convention | Example |
|---|---|---|
| Components | PascalCase | `BalanceCard`, `TransactionItem` |
| Hooks | camelCase + use prefix | `useDailyLimit`, `usePINLock` |
| Stores | camelCase + use prefix | `useBudgetStore` |
| Utilities | camelCase | `formatCurrency`, `calculateDailyLimit` |
| Constants | UPPER_SNAKE_CASE | `EXPENSE_CATEGORIES`, `API_ROUTES` |
| CSS classes | Tailwind utility classes only | `bg-slate-900 text-white` |

---

## 12. Scalability Considerations

| Concern | Current MVP Approach | Future-Proof Path |
|---|---|---|
| Database | SQLite | PostgreSQL (settings already split) |
| Multi-device sync | Not needed in MVP | Add user auth + cloud sync layer |
| Multi-user | Single user (local PIN) | JWT auth + user model already scaffolded |
| Analytics | Computed on the fly | Add caching layer (Redis) when data grows |
| Notifications | In-app only | Add push notifications (FCM/APNs) |
| Biometric | Stub interface ready | Implement WebAuthn API |
| Currency | EGP hardcoded in MVP | Config-driven multi-currency via constants |

---

## 13. Development Roadmap

| Phase | Deliverable | Est. Complexity |
|---|---|---|
| **1** | Planning & Architecture | ✅ Complete |
| **2** | Database Design & Models | Medium |
| **3** | Backend Project Setup | Low |
| **4** | Backend Core APIs | High |
| **5** | Frontend Design System | Medium |
| **6** | Frontend Static Pages | Medium |
| **7** | Frontend State Management | Medium |
| **8** | Frontend ↔ Backend Integration | High |
| **9** | Daily Limit Calculation Engine | High |
| **10** | Dashboard Charts & Analytics | Medium |
| **11** | Notifications & Alerts | Medium |
| **12** | Transaction History & Filters | Medium |
| **13** | Edit/Delete Transaction Logic | Medium |
| **14** | Offline-First Functionality | High |
| **15** | Privacy Lock & Security | High |
| **16** | Cycle Reset & Data Management | Medium |
| **17** | Testing & Bug Fixes | High |
| **18** | Optimization & Refactoring | Medium |
| **19** | Deployment Preparation | Medium |
| **20** | Final Production Polish | Low |

---

## 14. Engineering Standards

### Code Quality
- Max file length: **300 lines** (split if exceeded)
- Max function length: **30 lines** (extract if longer)
- No business logic in views or components
- No hardcoded strings (use constants files)
- All public functions/classes must have docstrings (backend) or JSDoc (frontend)

### Git Strategy (Recommended)
```
main          → Production-ready code only
develop       → Integration branch
feature/*     → Per-phase feature branches
fix/*         → Bug fix branches
```

### Testing Standards (Phase 17)
- Backend: `pytest` + `pytest-django` + `factory_boy`
- Frontend: `Vitest` + `React Testing Library`
- Target: Core service logic 80%+ coverage

---

## 15. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Offline queue corruption | Low | Validate queue on rehydration; discard invalid items |
| Calculation drift (remaining days) | Medium | Always compute from stored `end_date`, never increment counters |
| PIN brute force | Low | Lockout after 5 failed attempts (SecurityProfile.failed_attempts) |
| SQLite concurrency limits | Low | Acceptable for single-user MVP |
| Recharts rendering on large datasets | Medium | Limit chart data to last 30 days by default |
| localStorage quota (5MB) | Medium | Migrate large datasets to IndexedDB automatically |

---

## 16. Next Phase Preview — Phase 2: Database Design & Models

Phase 2 will produce:
- Full Django model definitions for all 6 apps
- Database migrations
- Admin panel registration
- Model-level validation
- Fixture data for development
- Full ERD diagram

---

> **⚠️ STOP — Phase 1 Complete**
> 
> Architecture blueprint is finalized. Awaiting your approval to begin **Phase 2: Database Design & Models**.
