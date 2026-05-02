# 🏦 Sovereign Ledger — Cross-Platform Expense Tracker

> A **premium, cross-platform expense tracker** built with a single codebase that runs on **Mobile (Android & iOS)**, **Desktop (Windows/Mac/Linux)**, and **Web (all modern browsers)**.

![Platform Support](https://img.shields.io/badge/Platforms-Mobile%20%7C%20Web%20%7C%20Desktop-blue)
![Framework](https://img.shields.io/badge/Framework-React%20Native%20%2B%20Expo-purple)
![License](https://img.shields.io/badge/License-MIT-green)
![Version](https://img.shields.io/badge/Version-2.0.0-orange)

---

## 📋 Table of Contents

- [App Overview](#-app-overview)
- [Features](#-features)
- [Platform Adaptation](#-platform-adaptation)
- [Desktop Features](#-desktop-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Setup Instructions](#-setup-instructions)
- [Running the App](#-running-the-app)
- [Building for Production](#-building-for-production)
- [Screenshots](#-screenshots)
- [Links](#-links)

---

## 🎯 App Overview

**Sovereign Ledger** is a financial management application that helps users track expenses, manage budgets, and gain insights into their spending patterns. Originally built as a mobile app, it has been transformed into a **truly universal application** that adapts to any device and screen size.

### Core Functionality
- 📊 **Dashboard** — Overview of balance, income, and expenses
- 💰 **Budget Management** — Set and track spending allocations by category
- 📈 **Analytics & Insights** — Visual charts and spending breakdowns
- ➕ **Transaction Management** — Add, categorize, and track all transactions
- 🔐 **Identity Verification** — Camera-based (mobile) or digital (web/desktop)
- 🌓 **Dark/Light Theme** — System-aware with manual toggle
- 💱 **Multi-Currency** — Support for 13+ global currencies
- 📤 **Data Export** — CSV (all platforms) and PDF (mobile)
- 🔄 **Recurring Transactions** — Automated recurring payment tracking
- 🔔 **Budget Alerts** — Notifications when approaching limits

---

## ✨ Features

### Single Codebase Architecture (20 pts)
| Feature | Status |
|---------|--------|
| Single codebase for mobile, web, desktop | ✅ |
| Shared business logic across platforms | ✅ |
| Shared UI components with platform adaptation | ✅ |
| Platform-specific code isolation | ✅ |
| Unified state management (React Context + Reducer) | ✅ |

### Platform Adaptation (25 pts)
| Feature | Status |
|---------|--------|
| Platform detection (mobile/web/desktop) | ✅ |
| Responsive layouts based on screen size | ✅ |
| Sidebar navigation on desktop/wide screens | ✅ |
| Bottom tab navigation on mobile screens | ✅ |
| Mouse hover states for desktop/web | ✅ |
| Touch interactions for mobile | ✅ |
| Tab/keyboard navigation for accessibility | ✅ |
| Adaptive content density per screen size | ✅ |

### Desktop Implementation (15 pts)
| Feature | Status |
|---------|--------|
| Resizable windows with content adaptation | ✅ |
| Application menu bar (File, Edit, View, Help) | ✅ |
| Keyboard shortcuts (8 shortcuts) | ✅ |
| Right-click context menus | ✅ |
| Desktop sidebar navigation | ✅ |
| Electron desktop shell with native menus | ✅ |

### Web Implementation (15 pts)
| Feature | Status |
|---------|--------|
| Responsive design for all screen sizes | ✅ |
| SEO meta tags (title, description, viewport) | ✅ |
| Custom scrollbar styling | ✅ |
| Web-native text inputs | ✅ |
| Browser-compatible chart rendering | ✅ |
| Blob-based CSV export on web | ✅ |

### Animations (10 pts)
| Animation | Description |
|-----------|-------------|
| Screen entrance animations | fadeIn, slideUp, scaleIn, fadeSlideUp |
| Staggered list animations | Items appear sequentially with delay |
| Animated progress bars | Analytics category bars animate on load |
| Balance counter animation | Spring animation on balance changes |
| Pulse animation | Verification screen scanner pulse |
| Toggle switch animation | Smooth spring transition |
| Category selection bounce | Scale bounce on category tap |
| Shimmer effect | Verification scan circle shimmer |

---

## 🖥 Platform Adaptation

### How It Works

```
┌─────────────────────────────────────────────┐
│           Platform Detection                 │
│  src/utils/platform.js                      │
│  Detects: mobile | web | desktop            │
├─────────────────────────────────────────────┤
│           Responsive Layout Hook             │
│  src/hooks/useResponsiveLayout.js           │
│  Breakpoints: mobile(<768) | tablet | desktop│
├─────────────────────────────────────────────┤
│           Adaptive Navigation               │
│  < 1024px: Bottom Tab Navigator             │
│  ≥ 1024px: Sidebar + Menu Bar               │
└─────────────────────────────────────────────┘
```

### Breakpoints
| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | 0-767px | Bottom tabs, full-width content |
| Tablet | 768-1023px | Bottom tabs, wider padding |
| Desktop | 1024-1439px | Sidebar (240px) + Menu bar |
| Wide | 1440px+ | Sidebar (280px) + Menu bar + max-width content |

---

## ⌨️ Desktop Features

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl + N` | New Transaction |
| `Ctrl + E` | Export Data |
| `Ctrl + D` | Go to Dashboard |
| `Ctrl + B` | Go to Budgets |
| `Ctrl + I` | Go to Insights |
| `Ctrl + ,` | Open Settings |
| `Ctrl + T` | Toggle Dark/Light Theme |
| `Ctrl + /` | Show Keyboard Shortcuts |

### Application Menu
- **File**: New Transaction, Export CSV/PDF, Print Report
- **Edit**: Undo, Redo, Select All
- **View**: Navigate screens, Toggle Dark Mode, Zoom
- **Help**: Keyboard Shortcuts, About

### Right-Click Context Menus
- Dashboard: Add Transaction, Export Data, Toggle Theme
- Ledger: Add Transaction, Filter, Export Ledger

---

## 🛠 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React Native** | Cross-platform UI framework |
| **Expo SDK 54** | Development toolchain & APIs |
| **React Native Web** | Web rendering of RN components |
| **React Navigation** | Cross-platform navigation |
| **AsyncStorage** | Persistent local data storage |
| **Electron** | Desktop application shell |
| **Expo Camera** | Mobile face verification |
| **dayjs** | Date manipulation |
| **i18n-js** | Internationalization |

---

## 📁 Project Structure

```
MY-EXPENSE-TRACKER-APP/
├── App.js                          # Entry point (web SEO, fonts)
├── index.js                        # Root component registration
├── app.json                        # Expo configuration (all platforms)
├── package.json                    # Dependencies & scripts
├── electron/                       # 🖥 Desktop-specific
│   ├── main.js                     # Electron main process & native menus
│   └── preload.js                  # Secure bridge to renderer
├── assets/                         # Shared assets
│   ├── icon.png
│   ├── favicon.png
│   ├── adaptive-icon.png
│   └── splash-icon.png
└── src/
    ├── components/
    │   ├── animated/               # 🎬 Animation components
    │   │   └── AnimatedScreen.js   # Screen/item/pulse animations
    │   ├── desktop/                # 🖥 Desktop-only components
    │   │   ├── DesktopSidebar.js   # Sidebar navigation
    │   │   ├── DesktopMenuBar.js   # File/Edit/View/Help menu
    │   │   ├── ContextMenu.js      # Right-click context menu
    │   │   └── ShortcutsModal.js   # Keyboard shortcuts dialog
    │   ├── BalanceCard.js          # Balance display card
    │   ├── BudgetCard.js           # Budget allocation card
    │   ├── CategoryIcon.js         # Category icons & colors
    │   ├── CustomKeypad.js         # Mobile numeric keypad
    │   ├── EmptyState.js           # Empty state placeholder
    │   ├── ScreenHeader.js         # Screen header component
    │   ├── TabSelector.js          # Tab selector
    │   ├── ToggleSwitch.js         # Animated toggle switch
    │   └── TransactionItem.js      # Transaction list item
    ├── context/
    │   └── AppContext.js           # 📦 Global state (shared data layer)
    ├── hooks/
    │   ├── useResponsiveLayout.js  # 📐 Responsive breakpoint hook
    │   └── useKeyboardShortcuts.js # ⌨️ Desktop keyboard shortcuts
    ├── navigation/
    │   ├── AppNavigator.js         # 🧭 Responsive navigation (tabs/sidebar)
    │   └── AuthGate.js             # Auth verification gate
    ├── screens/
    │   ├── DashboardScreen.js      # Main dashboard
    │   ├── AnalyticsScreen.js      # Statistics & charts
    │   ├── BudgetScreen.js         # Budget allocations
    │   ├── ProfileScreen.js        # Settings & profile
    │   ├── AddTransactionScreen.js # Add new transaction
    │   ├── LedgerScreen.js         # Transaction history
    │   ├── VerificationScreen.js   # Identity verification
    │   └── ChangePasswordScreen.js # Password management
    ├── theme/
    │   ├── colors.js               # Light/Dark theme tokens
    │   ├── typography.js           # Font styles & sizes
    │   └── spacing.js              # Spacing, borders, shadows
    └── utils/
        ├── platform.js             # 🎯 Platform detection utility
        ├── storage.js              # AsyncStorage persistence
        ├── currency.js             # Currency formatting (13+ currencies)
        ├── export.js               # CSV/PDF export (mobile)
        ├── recurring.js            # Recurring transaction processor
        ├── insights.js             # Financial intelligence engine
        └── i18n.js                 # Localization (EN/ES)
```

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** v18+ 
- **npm** v9+ or **yarn**
- **Expo CLI** (installed globally or via npx)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/MY-EXPENSE-TRACKER-APP.git
cd MY-EXPENSE-TRACKER-APP

# Install dependencies
npm install --legacy-peer-deps
```

---

## ▶️ Running the App

### 📱 Mobile (Expo Go)
```bash
npx expo start
# Scan QR code with Expo Go app on your phone
```

### 🌐 Web
```bash
npx expo start --web
# Opens in browser at http://localhost:8081
```

### 🖥 Desktop (Electron)
```bash
# First, build the web version
npx expo export --platform web

# Then run with Electron
npx electron electron/main.js
```

---

## 📦 Building for Production

### Web Build (for deployment)
```bash
npx expo export --platform web
# Output: dist/ directory
# Deploy to Vercel, Netlify, or GitHub Pages
```

### Android APK
```bash
eas build --platform android --profile preview
```

### Desktop Executable (Windows .exe)
```bash
# Install electron-builder
npm install -D electron-builder

# Build web first
npx expo export --platform web

# Build Windows installer
npx electron-builder --win
# Output: dist/Sovereign Ledger Setup.exe
```

---

## 📸 Screenshots

### Desktop View (Web/Electron)
- Full sidebar navigation with brand header
- Application menu bar (File, Edit, View, Help)
- Dashboard with balance, income/expense cards
- Keyboard shortcuts modal

### Mobile View
- Bottom tab navigation (Overview, Budgets, Insights, Settings)
- Identity verification with camera
- Custom numeric keypad for amounts
- Touch-optimized interactions

### Responsive Adaptation
- Sidebar automatically hides below 1024px
- Bottom tabs appear on mobile widths
- Content adapts padding and grid columns
- Charts switch to web-compatible rendering

---

## 🔗 Links

| Resource | Link |
|----------|------|
| 📱 Live Web App | *Deploy URL* |
| 📥 Desktop Build | *Google Drive link* |
| 📱 Mobile APK | *Appetize.io link* |
| 🎬 Demo Video | *Recording link* |
| 📝 LinkedIn Post | *Post URL* |

---

## 🗺️ Future Roadmap

### Phase 1: Foundation & Polish (Completed)
- [x] Unified cross-platform architecture (Expo + RN Web + Electron)
- [x] Responsive layout (Sidebar vs Bottom Tabs)
- [x] Premium desktop experience (Menu bar, Shortcuts, Context menus)
### Phase 1: Foundation & Polish (Status: COMPLETE)
*   **Unified Cross-Platform Architecture:** Expo + RN Web + Electron bridge.
*   **Premium UX:** Desktop-first sidebar, menu bars, and 8+ keyboard shortcuts.
*   **Intelligent Insights:** Statistical predictive budgeting engine.
*   **Universal Security:** WebAuthn browser biometrics + native local auth.
*   **Data Fidelity:** Integrated seeder generating 3 months of realistic history.

### Phase 2: Cloud & Connectivity (Target: Q3 2026)
*   **Cloud Sync (Supabase):** Real-time data synchronization across all devices.
*   **Bank Aggregation (Plaid):** Automatic transaction importing from banks.
*   **Social Sharing:** Shared expense groups for families.

### Phase 3: AI & Ecosystem (Target: Q4 2026)
*   **AI Financial Coach:** LLM-powered personalized savings advice.
*   **OCR Scanning:** Automated data extraction from receipt photos.
*   **Widget Support:** Dynamic balance widgets for iOS/Android home screens.
*   **Apple Watch App:** Quick-entry companion app for wearable devices.

---

## 📄 License

MIT License — Free for personal and commercial use.

---

**Built with ❤️ by the Sovereign Ledger Team**  
*A single codebase. Every platform. Premium experience.*
