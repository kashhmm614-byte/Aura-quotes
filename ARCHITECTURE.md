# AuraQuote — Architecture Overview

AuraQuote is a daily inspirational quotes web application engineered for high visual impact and offline-first performance. Recently redesigned to follow a "Brutalist Cinematic" (A24-inspired) aesthetic, it combines elegant typography with a robust, sync-capable data architecture.

---

## 1. Tech Stack & Core Libraries

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4 + Vanilla CSS Variables
- **Local Storage**: IndexedDB (via native wrapper/idb)
- **Cloud Database**: Neon Serverless Postgres
- **Authentication**: Google Identity Services (GIS)
- **Audio API**: Web Speech API for native Text-To-Speech (TTS)
- **Server**: Minimal Node.js backend (`server.js`) for API/Proxy if needed

---


## 3. Data Architecture (Offline-First Hybrid)

AuraQuote uses a two-tier database approach to guarantee speed and enable cloud sync.

### Tier 1: Local IndexedDB (`src/lib/db.ts` -> `auraDB`)
Every user's interaction initially writes to a local IndexedDB instance. This ensures the app works immediately on load and offline.
- **Collections/Stores**: `quotes` (pre-seeded list of quotes), `favorites` (user's saved quotes), `streaks` (login tracker).
- **Functions**: `getRandomQuote()`, `toggleFavorite()`, `addQuote()`.

### Tier 2: Cloud Sync (`src/lib/neon-client.ts` -> `auraNeon`)
When a user is authenticated and a Neon Database URL is provided, the local DB syncs asynchronously with the cloud.
- Uses `@neondatabase/serverless` for direct edge-compatible database connections.
- Synchronizes user profiles, favorite arrays, and custom created quotes back to the Postgres cluster.

---

## 4. Component Tree & State Flow

```mermaid
graph TD
    App[App.tsx (Main State Controller)]
    
    App --> Nav[Navbar.tsx]
    App --> Hero[Hero.tsx]
    App --> Main[Main Content Area]
    App --> Footer[Footer.tsx]
    App --> Modals[Modals & Overlays]

    Main --> QuoteCard[QuoteCard.tsx]
    Main --> CatChips[CategoryChips.tsx]
    
    Modals --> AuthGate[AuthGate.tsx]
    Modals --> Vault[VaultModal.tsx]
    Modals --> Create[CreateModal.tsx]
    Modals --> Neon[NeonModal.tsx]
    Modals --> Toast[Toast.tsx]
```

### State Management (`App.tsx`)
The application avoids heavy state-management libraries (like Redux) in favor of localized React State and direct Database queries.
- `currentQuote`: Holds the currently displayed quote.
- `isDaily`: Boolean tracking if the user is looking at the initial daily quote.
- `user`: Holds the `AuraUser` session data if authenticated via Google.
- `activeModal`: Controls the rendering of overlay components.

---

## 5. Authentication Flow (`src/lib/auth.ts`)

1. **Gate Trigger**: User attempts a protected action (e.g., Save to Vault, Create Quote).
2. **AuthGate.tsx**: Intercepts and displays the authentication modal.
3. **Google Identity (GIS)**: Loads the native Google One Tap / Sign-In button.
4. **Session Save**: On success, the user object is stored in memory and `localStorage` for persistence.
5. **Sync Trigger**: `auraNeon.syncUser(user)` is fired to associate cloud data with this Google UID.

---

## 6. Project Structure

```text
aura-quotes/
├── api/                  # Vercel Serverless Functions / Backend Endpoints
├── src/
│   ├── components/       # UI Components
│   │   ├── modals/       # Popups and Overlays
│   │   └── *.tsx         # Core views (Hero, QuoteCard, etc)
│   ├── lib/              # Core Services & Utilities
│   │   ├── auth.ts       # Google GIS Logic
│   │   ├── db.ts         # IndexedDB Wrapper
│   │   ├── lithos.ts     # Audio / TTS logic
│   │   └── neon-client.ts# Neon Serverless logic
│   ├── types/            # TypeScript Interface Definitions
│   ├── index.css         # Global Tailwind & A24 Styling Rules
│   └── App.tsx           # Application Root and State Router
├── index.html            # Entry HTML (Contains Google Fonts & GIS Script)
├── package.json          # Dependencies and Scripts
└── server.js             # Local Dev / API Proxy Server
```
