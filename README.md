<div align="center">

# 💸 FinFlow

### Smart Expense Tracker · Built with Next.js 14 · Powered by Google Antigravity

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-FF0055?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> *Track every rupee. Own your financial future.*

A dark-themed, animated personal finance dashboard — complete with daily/weekly/monthly expense tracking, budget progress bars, and goal-based savings mode. Zero backend. Zero signups. Your data stays yours.

</div>

---

## 📸 Preview

| Dashboard | Budget Tracker | Savings Mode |
|-----------|---------------|--------------|
| Live metric cards with spring-animated counters | Per-category progress bars, colour-coded by spend level | SVG ring progress per goal + confetti on completion |

---

## ✨ Features at a Glance

- 🌑 **Dark glass UI** — animated orb background with mix-blend-mode effects
- 📊 **5 views** — Dashboard, Daily, Weekly, Monthly, Savings
- 💹 **Live animated counters** — spring physics via Framer Motion
- 📈 **Charts** — Bar chart (weekly) + Donut chart (monthly) via Recharts
- 🎯 **Budget tracking** — smart colour-coded progress bars (green → amber → red)
- 🏦 **Savings goals** — circular SVG ring progress + 🎉 confetti on completion
- 💾 **localStorage persistence** — no backend, no database
- 📱 **Fully responsive** — sidebar on desktop, bottom tab bar on mobile
- 🤖 **Built with Google Antigravity** — agentic IDE, prompt-to-product in ~50 minutes

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Next.js App Router                │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ layout   │  │  pages   │  │   components/    │  │
│  │ .tsx     │  │ (6 routes│  │  (18 components) │  │
│  │ Fonts    │  │  below)  │  │                  │  │
│  │ Providers│  └──────────┘  └──────────────────┘  │
│  └──────────┘                                       │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │           Zustand Global Store               │   │
│  │  expenses[] · budgets{} · savingsGoals[]    │   │
│  │         ↕ persist middleware                 │   │
│  │              localStorage                   │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 🗺 App Routes

```
app/
├── page.tsx           /           → Dashboard (KPIs + recent transactions)
├── daily/page.tsx     /daily      → Today's expense log
├── weekly/page.tsx    /weekly     → 7-day bar chart + day breakdown
├── monthly/page.tsx   /monthly    → Donut chart + 6-month trend
├── budget/page.tsx    /budget     → Budget health + category progress bars
└── savings/page.tsx   /savings    → Goal cards with ring progress
```

---

## 📁 Project Structure

```
expense-tracker/
├── app/
│   ├── layout.tsx                 ← Root layout: fonts, providers, BackgroundCanvas
│   ├── page.tsx                   ← Dashboard
│   ├── daily/page.tsx
│   ├── weekly/page.tsx
│   ├── monthly/page.tsx
│   ├── budget/page.tsx
│   └── savings/page.tsx
│
├── components/
│   ├── BackgroundCanvas.tsx       ← Animated orb background (mix-blend-mode: screen)
│   ├── Sidebar.tsx                ← Desktop navigation rail
│   ├── BottomNav.tsx              ← Mobile tab bar
│   ├── MetricCard.tsx             ← KPI card with spring counter
│   ├── ProgressBar.tsx            ← Animated, colour-reactive budget bar
│   ├── CircularRing.tsx           ← SVG ring (budget health + savings goals)
│   ├── SavingsGoalCard.tsx        ← Goal card with confetti trigger
│   ├── AddExpenseModal.tsx        ← Slide-up bottom sheet
│   ├── CreateGoalModal.tsx        ← New savings goal form
│   └── TransactionRow.tsx         ← Single expense row
│
├── store/
│   └── useStore.ts                ← Zustand store + persist middleware
│
├── lib/
│   ├── mockData.ts                ← 30-day seed data generator
│   └── formatters.ts             ← ₹ currency + date helpers
│
└── public/
    └── favicon.ico
```

---

## 🛠 Tech Stack

| Layer | Tool | Version | Purpose |
|-------|------|---------|---------|
| **Framework** | Next.js | 14.2 | App Router, RSC, fast dev server |
| **Language** | TypeScript | 5.4 | End-to-end type safety |
| **Styling** | Tailwind CSS | 3.4 | Utility-first, glass-morphism panels |
| **Animation** | Framer Motion | 11.x | All motion — orbs, bars, counters, modals |
| **Charts** | Recharts | 2.12 | Bar chart (weekly) + Donut chart (monthly) |
| **State** | Zustand | 4.5 | Global store + localStorage persistence |
| **UI Primitives** | shadcn/ui | latest | Headless buttons, inputs, dialogs |
| **Celebration** | canvas-confetti | 1.9 | Goal completion burst |
| **Fonts** | Syne + DM Sans | — | Heading + body via `next/font/google` |
| **Build Tool** | Google Antigravity | 1.x | Agentic IDE — prompt-to-product |

---

## 🎨 Design System

### Colour Palette

```
Background Base   #080B14   ████  Deep Navy
Cyan Accent       #00F5FF   ████  CTAs, active states, safe budgets
Violet Accent     #7C3AED   ████  Savings Mode
Emerald           #10B981   ████  Budget safe  (< 70%)
Amber             #F59E0B   ████  Budget warning (70–90%)
Red               #EF4444   ████  Budget danger  (> 90%)
```

### Card Treatment

Every panel uses the same glass-morphism recipe:

```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(24px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 1rem;
```

### Typography

| Role | Font | Weight |
|------|------|--------|
| Headings, KPI numbers | **Syne** | 700 |
| Body, labels, descriptions | **DM Sans** | 400 |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/finflow.git
cd finflow

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 🔄 Data Flow

```
User Action (add expense / update budget / contribute to goal)
        │
        ▼
  AddExpenseModal / inline form
        │
        ▼
  Zustand Action (addExpense / updateBudget / contributeToGoal)
        │
        ├──────────────────────────┐
        ▼                          ▼
  In-memory state update     localStorage (via persist middleware)
        │
        ▼
  Component re-render (all consumers of useStore)
        │
        ├─── MetricCard (totals update)
        ├─── TransactionRow (list updates)
        ├─── ProgressBar (% recalculates)
        └─── CircularRing (SVG dashoffset re-animates)
```

---

## 🎬 Animation Catalogue

| Animation | Implementation | Duration |
|-----------|---------------|----------|
| Page entrance | `initial={{ opacity:0, y:24 }} → animate={{ opacity:1, y:0 }}` | 0.5s |
| Staggered list items | `variants` with `staggerChildren: 0.07` | 70ms per item |
| KPI number counters | `useSpring({ stiffness:80, damping:20 })` | physics-based |
| Budget progress bars | `width: "0%" → width: "${pct}%"` ease-out | 1.2s + 0.3s delay |
| Savings ring (SVG) | `stroke-dashoffset` from circumference → target | 1.4s ease-out |
| Background orbs | `x/y` keyframes, `repeat: Infinity, repeatType: "mirror"` | 14–22s loops |
| Add Expense modal | `y: "100%" → y: 0` spring (damping:25, stiffness:200) | physics-based |
| Goal completion | `canvas-confetti` burst + CSS box-shadow pulse | — |
| Tab transitions | `AnimatePresence` mode="wait", exit x:-20 / enter x:20 | 0.3s |

---

## 📱 Responsive Behaviour

```
≥ 1024px (lg)                    < 1024px (mobile)
┌────────────────────┐           ┌──────────────────┐
│ Sidebar (240px) │  Page  │    │     Page content   │
│  nav items      │ content│    │                    │
│  (fixed left)   │        │    ├──────────────────┤
│                 │        │    │ Bottom tab bar (5) │
└─────────────────┴────────┘    └──────────────────┘
```

Charts use `<ResponsiveContainer>` from Recharts and fill 100% of their parent at any viewport width.

---

## 🗺 Roadmap

- [ ] CSV / PDF monthly expense export
- [ ] PWA support + install-to-home-screen
- [ ] Recurring expense templates
- [ ] Multi-currency with live exchange rates
- [ ] iCloud / Google Drive sync (optional)
- [ ] Bill due-date notifications
- [ ] Category-level sparkline trends on budget cards

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

```bash
# Fork and clone
git checkout -b feature/your-feature-name

# Make changes, then
git commit -m "feat: your feature description"
git push origin feature/your-feature-name
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---


</div>
