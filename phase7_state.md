# Masroofy — Phase 7: Frontend State Management

> **Status:** ✅ Complete — Awaiting Approval Before Phase 8

---

## 1. Phase Objective
The objective was to establish a robust global state architecture that supports the "Offline-First" requirement. This involves moving from static mock data to a dynamic, persisted state layer.

---

## 2. Engineering Decisions

### 2.1 Zustand for State
- **Choice**: Zustand was chosen over Redux for its minimal boilerplate and native middleware support for persistence.
- **Persistence**: Used `persist` middleware with `localStorage` to ensure the user's financial data survives browser refreshes or device restarts.

### 2.2 Client-Side Calculation Engine
- **Decision**: Logic for `safe_daily_limit` and `remaining_days` is duplicated in the frontend store (`useBudgetStore`).
- **Rationale**: This is a critical "Offline-First" feature. If the user logs an expense while offline, the app must immediately recompute the daily limit without waiting for a backend response.

---

## 3. Architecture Explanation & File Breakdown

### `src/store/useBudgetStore.js`
- **Responsibility**: Manages the active budget cycle metadata and the calculated `summary` object.
- **Logic**: Implements a JavaScript version of the `DailyLimitEngine` to compute financial metrics in real-time.

### `src/store/useTransactionStore.js`
- **Responsibility**: Holds the list of transactions. Supports basic CRUD actions that update the local state optimistically.

### `src/store/useUIStore.js`
- **Responsibility**: Manages ephemeral UI states like "Is the Add Transaction modal open?" or "Show a success toast". This store is purposefully *not* persisted.

---

## 4. How to Run & Test
1. State is now initialized in `localStorage`.
2. You can verify this by checking the **Application** tab in Browser DevTools under **Local Storage**.
3. Look for keys: `masroofy-budget-storage` and `masroofy-transactions-storage`.

---

## 5. Risks / Improvements
- **Storage Limits**: `localStorage` is capped at ~5MB. For very large transaction histories, we may need to migrate to `IndexedDB` in Phase 18.
- **Synchronization**: In Phase 8, we will implement the logic to sync this local state with the Django backend.

---

## 6. Next Phase Preview
**Phase 8: Frontend ↔ Backend Integration**
We will implement the **Axios** service layer to connect these Zustand stores to our Django REST APIs, handling authentication, data fetching, and error synchronization.

---

> **⚠️ STOP — Phase 7 Complete**
>
> State management and persistence are established. Awaiting your approval to begin **Phase 8: Frontend ↔ Backend Integration**.
