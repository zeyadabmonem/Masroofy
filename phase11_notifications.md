# Masroofy — Phase 11: Notifications & Alerts

> **Status:** ✅ Complete — Awaiting Approval Before Phase 12

---

## 1. Phase Objective
The objective was to implement a proactive notification system that alerts the user when they approach or exceed their budget limits. This system needs to be reliable, non-intrusive, and resilient to offline usage.

---

## 2. Engineering Decisions

### 2.1 Backend Idempotency
- **Logic**: The `NotificationService` evaluates the `alert_level` ('WARNING' or 'EXHAUSTED') on demand. It checks if an alert of that type *already exists* for the current cycle before creating a new one.
- **Rationale**: This prevents spamming the user with duplicate alerts if they make multiple small transactions while over the 80% threshold.

### 2.2 Automated Triggering Pipeline
- **Flow**: `logExpense` (UI) → API Call → `updateSummary` (Zustand) → `checkAlerts` (Hook) → API Call (Check/Trigger) → `addToast` (UI) + `addNotification` (Zustand).
- **Rationale**: The alert check is automatically triggered in the background immediately after logging or editing a transaction, ensuring real-time feedback without requiring a full page refresh.

### 2.3 Optimistic UI Updates
- **Dismissal**: When a user dismisses an alert, the local Zustand store is updated instantly (`markDismissed`), and the API call is made in the background.
- **Rationale**: Provides a snappy user experience and works seamlessly even if the device is momentarily offline.

---

## 3. Architecture Explanation & File Breakdown

### Backend (`notifications/`)
- **`services.py`**: Contains `check_and_trigger`, which leverages `DailyLimitEngine.calculate` to determine thresholds and conditionally create `NotificationLog` entries.
- **`views.py` / `urls.py`**: Added endpoints for `/check/`, `/<id>/dismiss/`, and `/dismiss-all/`.

### Frontend (`src/`)
- **`store/useNotificationStore.js`**: Persists notification history to `localStorage` for offline access.
- **`hooks/useNotifications.js`**: Bridges the Zustand store and the API service, handling optimistic updates.
- **`components/navigation/NotificationBell.jsx`**: A complete dropdown panel with unread badges, type-specific icons, and "Mark all read" functionality.
- **`hooks/useTransactions.js`**: Updated to automatically invoke `checkAlerts()` after any change to the transaction list.

---

## 4. How to Run & Test
1. Log an expense that takes your total spending over 80% of your current budget allowance.
2. Observe the automatic toast notification appearing in the bottom right corner.
3. Check the notification bell in the Sidebar (desktop) or BottomNav (mobile); it will have a pulsing red dot.
4. Click the bell to view the alert, then dismiss it.

---

## 5. Risks / Improvements
- **Stale Alerts**: If a user deletes a transaction, pulling their spending *below* 80%, the existing warning alert remains. This is intentional (as an audit trail), but we may want to introduce a mechanism to "resolve" alerts in the future.
- **Push Notifications**: Currently, these are in-app alerts. Web Push Notifications (Service Workers) could be added in later phases for system-level alerts.

---

## 6. Next Phase Preview
**Phase 12: Security Profile & Settings**
We will implement the user profile and settings views, including the ability to change the PIN, manage biometric preferences, and view security logs.

---

> **⚠️ STOP — Phase 11 Complete**
>
> The Notification & Alert system is fully functional. Awaiting your approval to begin **Phase 12: Security Profile & Settings**.
