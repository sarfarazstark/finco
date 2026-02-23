<p align="center">
  <img src="./public/assets/images/logo-large.svg" alt="Finco Logo" width="200" />
</p>

<h1 align="center">Finco — Personal Finance Dashboard</h1>

<p align="center">
  A full-stack personal finance application built with <strong>Next.js 16</strong>, <strong>Prisma</strong>, and <strong>PostgreSQL</strong>. <br />
  Designed as a portfolio-grade project with production-level architecture, data modeling, and UI/UX.
</p>

<p align="center">
  <img src="./preview.jpg" alt="Finco Preview" width="720" />
</p>

---

## ✨ Highlights

| Area              | Detail                                                                                                              |
|-------------------|----------------------------------------------------------------------------------------------------------------------|
| **Auth**          | Session-based authentication via [Better Auth](https://better-auth.com) with Prisma adapter & Zod v4 password policies |
| **Data Layer**    | 12 Prisma models, relational schema with cascading deletes, composite unique constraints, and indexed foreign keys    |
| **Transactions**  | Full CRUD with server actions, double-entry transfer bookkeeping, debounced search, 6-way sorting, and pagination     |
| **Budget**        | Custom SVG donut chart with split-sector overspent detection (dashed pattern) and per-category spend aggregation       |
| **UI/UX**         | 9 hand-crafted UI components, Framer Motion animations (sidebar, FAB, page transitions), and custom design tokens     |
| **Validation**    | Zod v4 schemas with cross-field refinements (transfer ≠ same account, category required for income/expense)           |

---

## 🛠 Tech Stack

| Layer        | Technology                                        |
|--------------|---------------------------------------------------|
| Framework    | Next.js 16 (App Router, RSC, Server Actions)      |
| Language     | TypeScript 5                                      |
| Database     | PostgreSQL via Prisma ORM 7                        |
| Auth         | Better Auth (session-based, email + password)      |
| Styling      | Tailwind CSS 4 + custom design tokens              |
| Animations   | Framer Motion (`motion/react`)                     |
| Validation   | Zod v4 with cross-field refinements                |
| Icons        | Tabler Icons (React + Webfont)                     |
| Forms        | react-hook-form + custom `useZodForm` hook         |
| Charts       | Recharts 3 with custom SVG sector renderers        |
| URL State    | nuqs for type-safe search params                   |
| Notifications| react-hot-toast                                    |
| Testing      | Vitest + Testing Library                           |
| Runtime      | Bun                                                |

---

## 📐 Architecture

```
finco/
├── app/
│   ├── (app)/                    # Authenticated layout group
│   │   ├── layout.tsx            # Server-side session guard + sidebar + FAB
│   │   ├── transactions/         # Transaction page + filters
│   │   ├── budget/               # Budget page with donut chart
│   │   ├── pots/                 # Savings pots (planned)
│   │   └── recurring-bills/      # Recurring bills (planned)
│   ├── auth/                     # Login & signup
│   │   ├── login/
│   │   └── signup/
│   └── actions/                  # Server actions (CRUD)
├── components/
│   ├── ui/                       # 9 custom primitives (button, dialog, dropdown, input, etc.)
│   ├── layout/                   # Sidebar, GlobalAddButton, TransitionLayout
│   ├── charts/                   # Custom donut chart with SVG patterns
│   └── transactions/             # Transaction dialogs, category picker, amount selector
├── hooks/                        # useZodForm, useClickOutside, useIsRoute, useMediaQuery, useSetting
├── lib/
│   ├── auth.ts                   # Better Auth configuration
│   ├── prisma.ts                 # Prisma client singleton
│   ├── schema.ts                 # Zod validation schemas
│   ├── pagination.ts             # Generic Laravel-style paginate() helper
│   ├── utils.ts                  # formatCurrency, formatBalance, formatTransactionDate, cn
│   └── data/                     # Server-side data fetching functions
└── prisma/
    ├── schema.prisma             # 12 models, 2 enums
    └── seed.ts                   # Demo data seeder
```

---

## 🔥 Feature Deep-Dives

### 🔐 Authentication

- **Better Auth** with Prisma adapter for session-based auth against PostgreSQL
- Secure password policy enforced at the schema level via Zod v4:
  - Minimum 8 characters, uppercase, lowercase, digit, and special character required
- Login and signup flows with animated page transitions (Framer Motion)
- Session guard at layout level — unauthenticated users are redirected server-side

### 💳 Transactions

This is the most complex feature, demonstrating advanced querying and UI patterns:

- **Full CRUD** via Next.js Server Actions with session authorization guards
- **Double-Entry Transfer Bookkeeping** — Transfers create two linked records (outflow + inflow) with a shared `transferId` UUID, ensuring transaction integrity. Edits atomically delete and recreate both sides within a `$transaction` block
- **Debounced Search** — Client-side debounce (300ms) with `useTransition` for non-blocking URL updates and smooth scroll restoration
- **6-Way Sorting** — Latest, Oldest, A→Z, Z→A, Highest Amount, Lowest Amount — mapped to Prisma `orderBy` clauses via a type-safe `SORT_MAP`
- **Category & Account Filtering** — URL-driven filters using `URLSearchParams`, composable with search and sort
- **Cursor-Free Pagination** — A generic `paginate<T>()` helper inspired by Laravel Eloquent, returning `data`, `total`, `lastPage`, `prev`, `next` metadata alongside results
- **Transaction Dialogs** — Separate Income, Expense, and Transfer dialogs loaded via `next/dynamic` for code splitting. The base dialog includes a category picker grid, account dropdown, date picker, and currency-aware amount input

### 📊 Budget

- **Custom Donut Chart** built with Recharts 3 and raw SVG:
  - Outer ring: Spending by category with interactive hover states (sector expansion + glow ring)
  - Inner ring: Budget limits at 70% opacity for visual comparison
  - **Overspent Detection**: When spending exceeds the limit, the sector splits at the exact angle — the portion within budget stays in the category's theme color, while the excess is filled with a 130° tilted dashed red line SVG pattern
- **Per-Category Spend Aggregation** — Server-side `prisma.transaction.aggregate()` calculating real spend per budget window
- **Spending Summary List** — Dynamic rendering with color-coded indicators and currency-aware formatting
- **Deep Links** — "See All" links per budget category navigate to `/transactions?category=<encoded>` with proper URL encoding

### 🧩 UI Component System

All UI primitives are built from scratch — **no component library dependency**:

| Component     | Complexity                                                                    |
|---------------|-------------------------------------------------------------------------------|
| `Dialog`      | Portal-based modal with backdrop blur, enter/exit animations, and scroll lock  |
| `Dropdown`    | Context-based select with keyboard navigation and animated content panel       |
| `Button`      | Polymorphic with variant support (primary, secondary, destructive, ghost)      |
| `Input`       | Labeled input with error state, password toggle, and helper text               |
| `Pagination`  | URL-driven page controls with ellipsis logic                                   |
| `DatePicker`  | Wrapper around `react-datepicker` with custom themed calendar styles            |
| `NavLink`     | Active-route detection with icon + label and animated indicator                 |
| `Switch`      | Animated toggle with accessible keyboard support                               |
| `Tabs`        | Context-based tabbed interface with active indicator                            |

### 🎨 Design & Animations

- **Animated Sidebar** — Spring-based expand/collapse (256px ↔ 64px) with `AnimatePresence` for logo crossfade and user profile dropdown
- **Global FAB** — Floating action button with staggered spring animations revealing Income, Expense, and Transfer options
- **Page Transitions** — Smooth content transitions via `TransitionLayout` wrapper
- **Custom Design Tokens** — 14 theme colors, 6 spacing values, 6 typography presets, and custom shadows defined in `globals.css`
- **Custom Scrollbar** — Themed scrollbar styling that matches the application aesthetic

---

## 📋 Roadmap

### ✅ Completed

- [x] **Authentication** — Login, Signup, Session management, Logout
- [x] **Transactions Page** — Full CRUD, Search, Sort (6 modes), Category filter, Pagination
- [x] **Transaction Types** — Income, Expense, Transfer (with double-entry bookkeeping)
- [x] **Transaction Editing** — Edit any transaction with pre-filled dialog
- [x] **Budget Page** — Donut chart, spend aggregation, spending summary, latest spending per category
- [x] **Budget Overspent Detection** — SVG pattern-based visual indicator for over-budget categories
- [x] **Custom UI Components** — Dialog, Dropdown, Button, Input, Pagination, DatePicker, NavLink, Switch, Tabs
- [x] **Sidebar** — Animated expand/collapse with profile dropdown
- [x] **Global Add Button** — FAB with staggered animation for quick transaction creation
- [x] **Database Seeding** — Full demo dataset with 200+ icons, categories, accounts, transactions, budgets, and themes
- [x] **Currency Formatting** — User-configurable currency with `Intl.NumberFormat`

### 🚧 In Progress

- [ ] **Budget CRUD** — Create, edit, and delete budgets from the UI
- [ ] **Budget Type Support** — Weekly, Monthly, Quarterly, Yearly budget periods (schema ready)

### 📌 Planned

- [ ] **Dashboard (Overview)** — At-a-glance summary of all financial data
- [ ] **Pots** — Savings pots with add/withdraw money and progress tracking
- [ ] **Recurring Bills** — Recurring transaction detection, due-soon alerts, and search/sort
- [ ] **Settings Page** — Currency selection, theme toggle, and account management
- [ ] **Email Verification** — Confirm email address on signup
- [ ] **Forgot Password** — Password reset via email
- [ ] **Mobile Responsive** — Full responsive layout for tablet and mobile

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- PostgreSQL database

### Installation

```bash
# Clone the repository
git clone https://github.com/sarfarazstark/finco.git
cd finco

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL

# Generate Prisma client and run migrations
bunx prisma migrate dev --name init

# Seed the database with demo data
bunx prisma db seed

# Start development server
bun dev
```

The app will be available at `http://localhost:3000`.

### Environment Variables

| Variable       | Description                    |
|----------------|--------------------------------|
| `DATABASE_URL` | PostgreSQL connection string   |
| `BETTER_AUTH_SECRET` | Secret for session signing |

---

## 📄 License

This project is built as a portfolio piece based on a [Frontend Mentor](https://www.frontendmentor.io) premium challenge. The design files are not included in this repository per Frontend Mentor's guidelines.

---

<p align="center">
  Built by <a href="https://github.com/sarfarazstark">Sarfaraz</a>
</p>
