# InstaFruit — PRD

## Original Problem Statement
Build a pixel-perfect frontend-only Angular application named **InstaFruit** — a premium fruit delivery SaaS prototype. Mobile-first (375–430px shell), centered mobile container on desktop, TailwindCSS only, Lucide icons, Angular Signals state, mock JSON data, no backend.

## Tech Stack
- **Framework**: Angular 21 (latest), standalone components, lazy-loaded routes
- **Styling**: TailwindCSS 3 + Poppins font
- **Icons**: lucide-angular
- **State**: Angular Signals (CartService)
- **Routing**: Angular Router with `withInMemoryScrolling`
- **Animations**: Angular animations + Tailwind keyframes

## Branding
- Primary `#08B44D`, Primary Dark `#00963F`, Light Bg `#EAF7EC`
- Card radius 22px, button/input radius 18px
- Mobile-first shell `max-width: 430px`, soft shadow on desktop

## Implemented (May 11, 2026)
- ✅ Splash screen (2s auto-redirect to /login)
- ✅ Login & Signup (Google mock, navigates to /home)
- ✅ Home (green header, search bar, promo banner, categories chips, popular products grid)
- ✅ Products listing (sticky header, category tabs, 2-col grid)
- ✅ Product details (image hero, qty selector, description, related products, fixed bottom CTA)
- ✅ Cart (qty controls, remove, subtotal/delivery/total, sticky checkout button)
- ✅ Checkout (address card, Cash on Delivery & Razorpay options, price summary, place order)
- ✅ Order Success (animated check, order ID, track CTA)
- ✅ Track Order (map-style background, ETA card, delivery agent card, animated 5-step status stepper)
- ✅ Profile (avatar, stats, order history, menu items, logout)
- ✅ Favorites (wishlist view from CartService.favorites)
- ✅ Bottom navbar (Home / Favorite / Cart / Profile) with cart badge
- ✅ Reusable components: product-card, search-bar, promo-banner, quantity-selector, order-status-stepper, bottom-navbar

## Core Requirements (static)
- Pixel-perfect grocery app feel — soft shadows, rounded 22px cards, premium green palette
- Mobile-first centered shell on desktop
- All buttons interactive, full E2E flow works (home → product → cart → checkout → success → track)
- No backend; static mock data

## Architecture
```
src/app/
  core/data/mock-data.ts        # products & categories
  core/services/cart.service.ts # signals: items, favorites, totals
  shared/                       # reusable UI components
  features/{splash,auth,home,products,cart,checkout,orders,profile,favorites}
```

## P1/P2 Backlog
- P1: Search filter logic on products page
- P1: Persist cart to localStorage
- P1: Real Razorpay integration (currently mock-only)
- P2: Skeleton loaders, page transitions
- P2: i18n / multi-currency
- P2: Hook backend (FastAPI/Mongo) for products & orders

## Next Tasks
- Hook real backend for catalog & checkout
- Add product search & category filter logic
- Persistent auth state and protected routes
