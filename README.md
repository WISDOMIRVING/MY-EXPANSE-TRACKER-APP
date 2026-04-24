# Sovereign Ledger — Private Financial Hub

Sovereign Ledger is a premium, **privacy-first** expense tracking application built with React Native and Expo. It empowers users to manage their financial life with professional-grade tools while ensuring 100% data sovereignty through local-only storage and advanced biometric security.

![Sovereign Ledger Banner](https://img.shields.io/badge/Privacy-First-0047BB?style=for-the-badge)
![Expo SDK 54](https://img.shields.io/badge/Expo-SDK_54-000000?style=for-the-badge&logo=expo)
![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react)

## 🛡️ Security & Privacy
- **Facial Liveness Verification**: A mandatory security gate that requires real-time user gestures (blink, turn, smile) to unlock the app.
- **Zero-Backend Architecture**: All data remains strictly on your device. No tracking, no cloud syncing, no third-party servers.
- **Local Biometrics**: Optional integration with native device biometrics (FaceID/Fingerprint) for secondary authentication.

## 🚀 Core Features
- **Transaction Management**: Effortlessly log Income and Expenses with custom categories and rich metadata.
- **Automated Recurring Transactions**: Set up weekly or monthly commitments (Rent, Salary, Subscriptions) that auto-generate in your ledger.
- **Smart Budgeting**: Category-specific allocation with real-time threshold alerts (80% and 100% warnings).
- **Data Visualization**: Interactive bar charts and pie charts providing deep spending insights and trend analysis.
- **Professional Exports**: Generate financial reports as **CSV** or **PDF** directly from your device.
- **Portable Backups**: Manual JSON-based backup and restore via the system clipboard for device migration without a server.

## 🎨 Design System (Pixel Perfect)
The UI is meticulously crafted to match high-fidelity Figma designs, featuring:
- **Dynamic Themes**: Seamless Dark and Light mode support based on system preferences.
- **Custom Keypad**: A bespoke, user-friendly numeric entry system for rapid logging.
- **Internationalization**: Full support for global currency symbols and bilingual (English/Spanish) support.

## 🛠️ Tech Stack
- **Framework**: React Native / Expo (SDK 54)
- **State Management**: Context API + useReducer
- **Storage**: @react-native-async-storage/async-storage
- **Graphics**: react-native-chart-kit / react-native-svg
- **Utilities**: dayjs, i18n-js, expo-camera, expo-notifications

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/WISDOMIRVING/MY-EXPENSE-TRACKER-APP.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the application**:
   ```bash
   npx expo start
   ```

## 📄 Data Sovereignty Note
All financial data is stored locally using `AsyncStorage`. Clearing app data or uninstalling the app will permanently remove your financial history unless you have exported a backup. Use the **Backup to Clipboard** feature in the Profile tab to keep your data safe.

---
*Built for absolute financial privacy and sovereign control.*
