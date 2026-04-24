import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

const translations = {
  en: {
    dashboard: 'Dashboard',
    analytics: 'Analytics',
    budget: 'Budget',
    ledger: 'Ledger',
    profile: 'Profile',
    total_balance: 'Total Balance',
    income: 'Income',
    expenses: 'Expenses',
    add_transaction: 'Add Transaction',
    recent_transactions: 'Recent Transactions',
    view_all: 'View All',
    no_transactions: 'No transactions yet',
    verification_title: 'Identity Verification',
    verification_subtitle: 'Secure your financial sovereignty',
    start_verification: 'Start Verification',
    skip_for_now: 'Skip for now',
    smart_insights: 'Smart Insights',
    spending_spike: 'Spending Spike',
    budget_breached: 'Budget Breached',
    upcoming_payment: 'Upcoming Payment',
    high_savings: 'High Savings Rate',
  },
  es: {
    dashboard: 'Tablero',
    analytics: 'Analítica',
    budget: 'Presupuesto',
    ledger: 'Libro Mayor',
    profile: 'Perfil',
    total_balance: 'Saldo Total',
    income: 'Ingresos',
    expenses: 'Gastos',
    add_transaction: 'Añadir Transacción',
    recent_transactions: 'Transacciones Recientes',
    view_all: 'Ver Todo',
    no_transactions: 'Aún no hay transacciones',
    verification_title: 'Verificación de Identidad',
    verification_subtitle: 'Asegure su soberanía financiera',
    start_verification: 'Iniciar Verificación',
    skip_for_now: 'Omitir por ahora',
    smart_insights: 'Perspectivas Inteligentes',
    spending_spike: 'Aumento de Gastos',
    budget_breached: 'Presupuesto Superado',
    upcoming_payment: 'Próximo Pago',
    high_savings: 'Alta Tasa de Ahorro',
  },
};

const i18n = new I18n(translations);
// Set the locale once at the beginning
i18n.locale = Localization.locale || 'en';
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export default i18n;
