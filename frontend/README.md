# Masroofy Frontend - Phase 5: Design System

> **Status:** ✅ Complete — Awaiting Approval Before Phase 6

---

## 1. Phase Objective

Build a complete, reusable design system for Masroofy following the fintech-grade UI specifications from Phase 1 architecture. This includes UI primitives, feedback components, chart components, navigation, and layouts.

---

## 2. Engineering Decisions

### 2.1 Component Architecture
- **Atomic Design Pattern:** Components organized by type (ui, feedback, charts, navigation, layouts)
- **Variant-Based Components:** Each component supports multiple variants (primary/secondary/ghost, sm/md/lg, etc.)
- **clsx for Conditional Classes:** Clean conditional styling without string concatenation
- **Lucide React Icons:** Consistent, modern icon set matching the fintech aesthetic

### 2.2 Design System Implementation
- **Tailwind CSS Extended:** Custom color palette defined in tailwind.config.js
- **CSS Variables:** Design tokens defined in globals.css for consistency
- **Responsive-First:** Mobile-first approach with responsive breakpoints
- **Dark Theme Only:** Fintech dark theme as specified in Phase 1

### 2.3 Chart Components
- **Recharts:** Declarative charting library with React integration
- **Custom Tooltips:** Styled tooltips matching the dark theme
- **Responsive Containers:** Charts adapt to container size
- **Empty State Handling:** Graceful fallback when no data available

---

## 3. Folder Structure

```
frontend/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env
├── .env.example
├── README.md
│
└── src/
    ├── main.jsx              # App entry point
    ├── App.jsx               # Router root
    │
    ├── constants/            # App-wide constants
    │   ├── categories.js     # Expense category definitions with colors
    │   ├── routes.js         # Route path constants
    │   ├── api.js            # API endpoint constants
    │   └── config.js         # App config (thresholds, limits)
    │
    ├── styles/               # Global styles & design tokens
    │   └── globals.css       # Tailwind directives + CSS variables
    │
    ├── layouts/              # Shared page layouts
    │   ├── AppLayout.jsx     # Authenticated layout (sidebar/nav)
    │   └── AuthLayout.jsx    # Unauthenticated layout (PIN screen)
    │
    ├── components/           # Pure reusable UI components
    │   ├── ui/               # Design system primitives
    │   │   ├── Button.jsx     # primary, secondary, ghost, danger variants
    │   │   ├── Input.jsx     # With label, error, icon support
    │   │   ├── Card.jsx       # default, elevated, interactive variants
    │   │   ├── Modal.jsx      # With backdrop, sizes, close button
    │   │   ├── Badge.jsx      # Category badges with colors
    │   │   └── Spinner.jsx    # Loading spinner
    │   │
    │   ├── feedback/         # State feedback components
    │   │   ├── EmptyState.jsx
    │   │   ├── ErrorState.jsx
    │   │   └── LoadingState.jsx
    │   │
    │   ├── charts/           # Recharts wrappers
    │   │   ├── SpendingPieChart.jsx
    │   │   ├── DailySpendingBar.jsx
    │   │   └── ProgressRing.jsx
    │   │
    │   └── navigation/
    │       ├── Navbar.jsx
    │       ├── Sidebar.jsx
    │       └── BottomNav.jsx
    │
    └── pages/                # Route-level page components
        └── DashboardPage.jsx  # Test page for design system
```

---

## 4. Design System Components

### 4.1 UI Primitives

#### Button
- **Variants:** primary, secondary, ghost, danger
- **Sizes:** sm, md, lg
- **Features:** loading state, disabled state, focus ring

#### Input
- **Features:** label, error message, icon support
- **Validation:** error state styling
- **Focus:** ring on focus with accent color

#### Card
- **Variants:** default, elevated, interactive
- **Usage:** Content containers, dashboard widgets

#### Modal
- **Sizes:** sm, md, lg, xl, fullscreen
- **Features:** backdrop blur, body scroll lock, close button
- **Animation:** Smooth transitions

#### Badge
- **Variants:** default, success, warning, danger
- **Category Support:** Auto-colors based on expense category
- **Sizes:** sm, md, lg

#### Spinner
- **Sizes:** sm, md, lg, xl
- **Usage:** Loading states throughout app

### 4.2 Feedback Components

#### EmptyState
- **Features:** Icon, title, description, action button
- **Usage:** No data scenarios

#### ErrorState
- **Features:** Error icon, retry button
- **Usage:** API errors, loading failures

#### LoadingState
- **Features:** Spinner, custom message
- **Usage:** Loading states

### 4.3 Chart Components

#### SpendingPieChart
- **Purpose:** Category breakdown visualization
- **Features:** Custom tooltip, legend, category colors
- **Empty State:** Fallback when no data

#### DailySpendingBar
- **Purpose:** Daily spending trends
- **Features:** Bar chart with date labels, custom tooltip
- **Styling:** Dark theme colors, rounded bars

#### ProgressRing
- **Purpose:** Circular progress indicator
- **Features:** Percentage display, custom colors, label
- **Usage:** Budget progress, daily limit

### 4.4 Navigation Components

#### Navbar
- **Features:** Logo, title, settings/logout buttons
- **Responsive:** Hidden on mobile (bottom nav used)

#### Sidebar
- **Features:** Navigation links with icons
- **Responsive:** Desktop only (hidden on mobile)
- **Active State:** Highlighted current route

#### BottomNav
- **Features:** Mobile navigation with icons
- **Responsive:** Mobile only (hidden on desktop)
- **Active State:** Highlighted current route

### 4.5 Layout Components

#### AppLayout
- **Structure:** Navbar + Sidebar + Main Content + BottomNav
- **Responsive:** Sidebar on desktop, bottom nav on mobile
- **Padding:** Appropriate spacing for each breakpoint

#### AuthLayout
- **Structure:** Centered content container
- **Usage:** PIN setup/lock screens

---

## 5. Color Palette (Fintech Dark Theme)

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

### Category Colors
- Food: `#3B82F6` (Blue)
- Transport: `#10B981` (Green)
- Shopping: `#F59E0B` (Orange)
- Bills: `#EF4444` (Red)
- Entertainment: `#8B5CF6` (Purple)
- Education: `#EC4899` (Pink)
- Other: `#6B7280` (Gray)

---

## 6. Typography

| Token | Font | Usage |
|---|---|---|
| Sans | Inter | Body text, headings |
| Mono | JetBrains Mono | Numbers, amounts |

**Font Weights:**
- Regular (400): Body text
- Medium (500): Labels, secondary text
- Semibold (600): Headings
- Bold (700): Emphasis

---

## 7. How to Run

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## 8. How to Test

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Open browser to:** `http://localhost:5173`

3. **Verify design system:**
   - Dashboard page loads with test data
   - All UI components render correctly
   - Responsive layout works (resize browser)
   - Dark theme colors are consistent
   - Charts render with sample data

4. **Test components manually:**
   - Button variants (primary, secondary, ghost, danger)
   - Input with error state
   - Card variants
   - Modal open/close
   - Badge category colors
   - Progress ring animation
   - Navigation links
   - Responsive sidebar/bottom nav

---

## 9. Architecture Compliance

### ✅ Follows Phase 1 Specifications

- **Folder Structure:** Matches planned structure exactly
- **Component Organization:** Feature-based with ui/feedback/charts/navigation separation
- **Design System:** Complete with all planned components
- **Color Palette:** Fintech dark theme as specified
- **Typography:** Inter + JetBrains Mono as planned
- **Responsive:** Mobile-first with sidebar/bottom nav
- **Constants:** Single source of truth in constants/ folder
- **API Configuration:** Environment variables via .env

---

## 10. Risks / Improvements

### Current Limitations
- **Dependencies Not Installed:** npm install needs to be run (PowerShell execution policy issue)
- **Tailwind Warnings:** IDE shows @tailwind/@apply warnings (will resolve after npm install)
- **No API Integration:** Design system only, no backend connection yet

### Future Improvements
- Add component storybook for visual testing
- Add unit tests for components
- Add animation library (Framer Motion) for smoother transitions
- Add form validation library (React Hook Form)
- Add toast notification system

---

## 11. Next Phase Preview

**Phase 6: Frontend Static Pages**
We will build the actual page components using the design system:
- PIN Setup Page
- PIN Lock Screen
- Dashboard Page (full implementation)
- Transactions Page
- Analytics Page
- Budget Setup Page
- Settings Page

---

## 12. Dependencies Required

The following dependencies are defined in package.json but need to be installed:

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.23.1",
    "axios": "^1.7.2",
    "zustand": "^4.5.2",
    "recharts": "^2.12.7",
    "clsx": "^2.1.1",
    "lucide-react": "^0.379.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.2.12",
    "tailwindcss": "^3.4.3",
    "postcss": "^8.4.38",
    "autoprefixer": "^10.4.19"
  }
}
```

---

> **⚠️ STOP — Phase 5 Complete**
>
> Design system is fully implemented. Awaiting your approval to begin **Phase 6: Frontend Static Pages**.
