# Habit Tracker

A professional, high-performance Progressive Web App (PWA) designed to help users build and maintain positive rituals through focused tracking and streak management.

## Project Overview
Habit Tracker is a focused productivity tool that allows users to create, manage, and track daily habits. It features a premium design with smooth animations, dark mode support, and a responsive layout that works across mobile and desktop. The application is built as a PWA, ensuring it remains functional even with intermittent or no network connectivity.

## Setup Instructions
1. Ensure you have Node.js (v18+) and pnpm (or npm) installed.
2. Clone the repository.
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Initialize Playwright for E2E testing:
   ```bash
   pnpm exec playwright install
   ```

## Run Instructions
### Development Mode
To start the development server with hot-reloading:
```bash
pnpm run dev
```
The app will be available at [http://localhost:3000](http://localhost:3000).

### Production Mode
To build and run the production bundle:
```bash
pnpm run build
pnpm run start
```

## Test Instructions
The project includes a comprehensive test suite covering unit, integration, and end-to-end scenarios.

### Unit Tests (Logic & Utilities)
Verifies the core business logic and utility functions.
```bash
pnpm run test:unit
```

### Integration Tests (Components)
Verifies React components and their interactions with the local storage system.
```bash
pnpm run test:integration
```

### End-to-End Tests (User Flows)
Verifies the complete application lifecycle using Playwright.
```bash
pnpm run test:e2e
```

### Full Test Pipeline
Runs all tests in sequence:
```bash
pnpm run test
```

## Local Persistence Structure
The application uses `localStorage` for data persistence. The structure is strictly defined as follows:

- **habit-tracker-users**: A JSON array of user objects.
  - Shape: `{ id: string, email: string, password: string, createdAt: string }`
- **habit-tracker-session**: Stores the active user session or null.
  - Shape: `{ userId: string, email: string }`
- **habit-tracker-habits**: A JSON array of habit objects.
  - Shape: `{ id: string, userId: string, name: string, description: string, frequency: 'daily', createdAt: string, completions: string[] }`

## PWA Support Implementation
PWA support is implemented using a custom Service Worker and a Web App Manifest:
- **Manifest**: Located at `public/manifest.json`, it defines the app branding, theme colors, and icons (192px and 512px).
- **Service Worker**: Registered via an inline script in `src/app/layout.tsx` to ensure immediate activation. The worker (`public/sw.js`) caches the core app shell routes and static assets during installation.
- **Offline Strategy**: Implements a Network-First strategy for navigations (falling back to cache when offline) and a Cache-First strategy for static assets, ensuring the app shell remains accessible without connectivity.

## Trade-offs or Limitations
- **Local Persistence**: Since data is stored in `localStorage`, it is browser-specific and not synced across devices.
- **Single Frequency**: This version only supports 'daily' habits, though the structure is extensible for future weekly or monthly support.
- **Basic Offline Logic**: The current implementation caches the app shell but does not queue API requests (if any were present) for background synchronization.

## Test Behavior Mapping
tests/unit/slug.test.ts
Verifies the generation of URL-friendly and stable slugs from habit names.

tests/unit/validators.test.ts
Verifies input validation rules for habit names including empty checks and length constraints.

tests/unit/streaks.test.ts
Verifies the mathematical logic for calculating consecutive completion streaks and handling gaps.

tests/unit/habits.test.ts
Verifies the toggle logic for completion dates ensuring no mutations or duplicates.

tests/integration/auth-flow.test.tsx
Verifies the signup and login UI flows and their interaction with the persistence layer.

tests/integration/habit-form.test.tsx
Verifies the habit lifecycle UI including creation, editing, deletion with confirmation, and streak updates.

tests/e2e/app.spec.ts
Verifies the high-level user experience including authentication guards, data persistence after reloads, and offline functionality.
