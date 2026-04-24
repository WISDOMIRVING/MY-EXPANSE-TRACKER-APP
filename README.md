# Sovereign Ledger 🪙

**Sovereign Ledger** is a premium, high-performance expense tracker built with React Native and Expo. Designed for users who demand both security and elegance, it offers a comprehensive suite of financial management tools protected by state-of-the-art facial liveness verification.

![Sovereign Ledger Banner](https://img.shields.io/badge/Sovereign%20Ledger-FinTech-blue?style=for-the-badge&logo=react)

## ✨ Features

### 🛡️ Secure Access Gate
- **Facial Liveness Verification**: Advanced security layer using `expo-camera` to ensure only the authorized user can access financial data.
- **Biometric-inspired UI**: A sleek, high-fidelity verification interface.

### 📊 Financial Insights
- **Interactive Dashboard**: Real-time overview of total balance, monthly income, and expenses.
- **Advanced Analytics**: Visual spend analysis using `react-native-chart-kit`. Track your habits with category-wise breakdowns and monthly trends.
- **Budgeting System**: Set monthly limits per category and track your progress with dynamic progress bars.

### 📝 Transaction Management
- **Detailed Ledger**: A complete, searchable history of all transactions.
- **Categorized Spending**: Easily tag expenses (e.g., Food, Transport, Shopping) and income.
- **Persistent Storage**: All data is stored locally using `@react-native-async-storage/async-storage` for maximum privacy.

### 📥 Data & Portability
- **CSV & PDF Export**: Generate professional CSV reports or beautifully styled PDF financial statements.
- **System Sharing**: Share your financial data via system-level share sheets.

## 🚀 Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo SDK 54](https://expo.dev/)
- **Navigation**: [React Navigation 7](https://reactnavigation.org/) (Stack & Bottom Tabs)
- **Styling**: Modern, Light-themed Design System with [Inter Google Fonts](https://fonts.google.com/specimen/Inter)
- **Storage**: AsyncStorage for local-first data persistence
- **Charts**: [React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit)
- **Utilities**: `dayjs` for dates, `uuid` for transaction IDs

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS)
- [Expo Go](https://expo.dev/go) app on your mobile device (to test on physical hardware)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd MY-EXPENSE-TRACKER-APP
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run start
   ```

4. **Run on your device**
   - Scan the QR code with the Expo Go app (Android) or Camera app (iOS).
   - Alternatively, press `a` for Android Emulator or `i` for iOS Simulator if set up locally.

## 📂 Project Structure

```text
├── .expo/              # Expo configuration
├── assets/             # Images, icons, and fonts
├── src/
│   ├── components/     # Reusable UI components (Cards, Buttons, etc.)
│   ├── context/        # Global state management (AppContext)
│   ├── navigation/     # App routing and Auth Gate
│   ├── screens/        # Main application screens
│   ├── theme/          # Color palettes and global styles
│   └── utils/          # Helper functions (Export, formatting)
├── App.js              # Application entry point
└── package.json        # Project metadata and dependencies
```

## 🔐 Security Note
Sovereign Ledger prioritizes user privacy. All financial data is stored **locally on your device**. No data is transmitted to external servers unless explicitly shared by the user via the export feature.

---

Built with ❤️ for better financial sovereignty.
