# Premier Sport — Frontend

React SPA for the Premier Sport e-commerce platform. Sells football kits, boots, accessories, and balls.

## Tech Stack

- **React 19** + **TypeScript** (strict mode)
- **Vite 7** — dev server on `:3000`, proxies `/api` → `:8080`
- **Tailwind CSS v4** (`@tailwindcss/vite` plugin)
- **React Router v7** — lazy-loaded pages, protected/admin route guards
- **Axios** — JWT Bearer token auth, `ApiResponse<T>` auto-unwrap interceptor

## Getting Started

```bash
npm install
npm run dev        # http://localhost:3000
```

Requires the backend API gateway running on `:8080`. See `premier-sport-services/`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type-check only |

## Project Structure

```
src/
├── types/          Shared TypeScript interfaces (User, Product, Cart, Order, …)
├── services/       Axios instance + authService, productService, cartService
├── context/        AuthProvider, CartProvider
├── hooks/          useAuth, useCart
├── routes/         AppRoutes, ProtectedRoute, AdminRoute
├── components/     Layout (Header, Footer), ErrorBoundary, Spinner
└── pages/          HomePage, LoginPage, RegisterPage, AboutPage
```

## Architecture Notes

- **Auth**: JWT stored in `localStorage`; attached as `Authorization: Bearer` on every request. On 401, token is cleared and an `auth:logout` DOM event is dispatched — `AuthProvider` listens and clears user state.
- **ApiResponse envelope**: All backend responses are wrapped in `{ success, message, data, timestamp }`. The Axios response interceptor unwraps transparently so services type against the inner data.
- **Cart**: `CartContext` uses React's render-phase state adjustment pattern (`prevIsAuthenticated`) to avoid synchronous `setState` inside `useEffect`.

## Sprint Roadmap

| Sprint | Scope |
|--------|-------|
| 1 ✅ | Project scaffold, auth, homepage |
| 2 | Product listing + detail pages |
| 3 | Cart + checkout + Stripe |
| 4 | Admin dashboard |
| 5 | AI chatbot (OpenAI) |
| 6 | Production deploy (AWS ECS, Amplify, Route53) |
