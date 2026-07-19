# LUCID AI — Admin Monitoring Module

Dark purple fantasy-themed admin panel built with Next.js 16 (App Router), TypeScript, and Tailwind CSS.

## Setup

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` — it redirects to `/admin`, which is guarded by middleware and will
send you to `/login` if you're not authenticated.

**Demo admin login:** `admin@lucid.ai` / `arcane123`

## Structure

```
app/
  login/page.tsx          Admin login (sets session cookie + localStorage)
  admin/
    layout.tsx             Sidebar shell
    page.tsx                Dashboard: stat cards, chart, recent activity
    users/page.tsx          User management: search, filter, ban/suspend
    worlds/page.tsx         World management: search, archive
    analytics/page.tsx      Analytics dashboard: multi-metric charts
    logs/page.tsx           Activity logs: severity filter
    reports/page.tsx        Reports: review/resolve/dismiss workflow
    settings/page.tsx       Platform settings form
components/
  admin/                   Sidebar, Topbar, StatCard, AnalyticsChart
  ui/                      Badge, Button, Modal, DataTable (generic, reusable)
lib/
  auth.ts                  Mock role-based auth (localStorage + cookie)
  mockData.ts              Generated mock users/worlds/logs/reports/analytics
  utils.ts                 Formatting helpers
types/index.ts             Shared TypeScript types
middleware.ts              Blocks /admin/* routes unless role=admin cookie present
```

## Notes

- Auth is a client-side mock for demo purposes (`lib/auth.ts`). Swap in a real
  identity provider and replace the cookie/localStorage logic with real session
  tokens for production use.
- All charts are dependency-free inline SVG (`components/admin/AnalyticsChart.tsx`)
  to keep the module lightweight — no charting library required.
- Mock data lives in `lib/mockData.ts`; replace with real API calls when wiring
  up a backend.
