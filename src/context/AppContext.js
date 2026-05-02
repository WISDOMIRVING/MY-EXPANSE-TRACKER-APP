// Sovereign Ledger — Global App Context with Reducer
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { Alert, Appearance, Platform } from 'react-native';
import {
  saveTransactions, loadTransactions,
  saveBudgets, loadBudgets,
  saveCurrency, loadCurrency,
  saveLastRecurringCheck, loadLastRecurringCheck,
  saveTheme, loadTheme,
} from '../utils/storage';
import { DEFAULT_CURRENCY, getCurrency } from '../utils/currency';
import { processRecurringTransactions } from '../utils/recurring';
import { LightTheme, DarkTheme } from '../theme/colors';
import i18n from '../utils/i18n';
import dayjs from 'dayjs';
import { seedSampleData } from '../utils/seeder';

// Lazy load notifications to avoid Expo Go SDK 53+ crash on Android
let Notifications = null;
try {
  Notifications = require('expo-notifications');
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} catch (e) {
  console.log('Notifications not available in this environment');
}

// Lazy load local authentication
let LocalAuthentication = null;
try {
  LocalAuthentication = require('expo-local-authentication');
} catch (e) {
  console.log('Local Authentication not available');
}

const AppContext = createContext();

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOAD_ALL_DATA: 'LOAD_ALL_DATA',
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
  DELETE_TRANSACTION: 'DELETE_TRANSACTION',
  ADD_BUDGET: 'ADD_BUDGET',
  UPDATE_BUDGET: 'UPDATE_BUDGET',
  DELETE_BUDGET: 'DELETE_BUDGET',
  SET_CURRENCY: 'SET_CURRENCY',
  SET_VERIFIED: 'SET_VERIFIED',
  SET_THEME: 'SET_THEME',
  ADD_RECURRING_TRANSACTIONS: 'ADD_RECURRING_TRANSACTIONS',
};

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 9);

// Initial State
const initialState = {
  isLoading: true,
  transactions: [],
  budgets: [],
  currency: DEFAULT_CURRENCY,
  isVerified: false,
  themeMode: Appearance.getColorScheme() || 'light', // 'light' | 'dark'
};

function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case ACTIONS.LOAD_ALL_DATA:
      return {
        ...state,
        transactions: action.payload.transactions || [],
        budgets: action.payload.budgets || [],
        currency: action.payload.currency || DEFAULT_CURRENCY,
        themeMode: action.payload.themeMode || state.themeMode,
        isLoading: false,
      };

    case ACTIONS.ADD_TRANSACTION:
      return {
        ...state,
        transactions: [{ ...action.payload, id: action.payload.id || generateId() }, ...(state.transactions || [])],
      };

    case ACTIONS.UPDATE_TRANSACTION:
      return {
        ...state,
        transactions: (state.transactions || []).map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };

    case ACTIONS.DELETE_TRANSACTION:
      return {
        ...state,
        transactions: (state.transactions || []).filter(t => t.id !== action.payload),
      };

    case ACTIONS.ADD_BUDGET:
      return {
        ...state,
        budgets: [...(state.budgets || []), { ...action.payload, id: action.payload.id || generateId() }],
      };

    case ACTIONS.UPDATE_BUDGET:
      return {
        ...state,
        budgets: (state.budgets || []).map(b =>
          b.id === action.payload.id ? { ...b, ...action.payload } : b
        ),
      };

    case ACTIONS.DELETE_BUDGET:
      return {
        ...state,
        budgets: (state.budgets || []).filter(b => b.id !== action.payload),
      };

    case ACTIONS.SET_CURRENCY:
      return { ...state, currency: action.payload };

    case ACTIONS.SET_VERIFIED:
      return { ...state, isVerified: action.payload };

    case ACTIONS.SET_THEME:
      return { ...state, themeMode: action.payload };

    case ACTIONS.ADD_RECURRING_TRANSACTIONS:
      return {
        ...state,
        transactions: [...action.payload, ...(state.transactions || [])],
      };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load persisted data on mount
  useEffect(() => {
    loadPersistedData();
    setupNotifications();
  }, []);

  const setupNotifications = async () => {
    if (!Notifications) return;
    try {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    } catch (e) {
      console.log('Skipping notifications permissions check.');
    }
  };

  // Auto-save effects
  useEffect(() => {
    if (!state.isLoading) saveTransactions(state.transactions);
  }, [state.transactions, state.isLoading]);

  useEffect(() => {
    if (!state.isLoading) saveBudgets(state.budgets);
  }, [state.budgets, state.isLoading]);

  useEffect(() => {
    if (!state.isLoading) saveCurrency(state.currency);
  }, [state.currency, state.isLoading]);

  useEffect(() => {
    if (!state.isLoading) saveTheme(state.themeMode);
  }, [state.themeMode, state.isLoading]);

  const loadPersistedData = async () => {
    try {
      const [transactions, budgets, currency, lastRecurringCheck, themeMode] = await Promise.all([
        loadTransactions(),
        loadBudgets(),
        loadCurrency(),
        loadLastRecurringCheck(),
        loadTheme(),
      ]);

      let finalTransactions = transactions || [];
      let finalBudgets = budgets || [];

      // Auto-seed if empty or less than 500 for demo purposes (forces a full data refresh)
      if (finalTransactions.length < 500) {
        const seed = seedSampleData();
        finalTransactions = seed.transactions;
        finalBudgets = seed.budgets;
      }

      dispatch({
        type: ACTIONS.LOAD_ALL_DATA,
        payload: {
          transactions: finalTransactions,
          budgets: finalBudgets,
          currency: currency ? getCurrency(currency.code) : DEFAULT_CURRENCY,
          themeMode: themeMode || Appearance.getColorScheme() || 'light',
        },
      });

      // Process recurring
      const newRecurring = processRecurringTransactions(transactions || [], lastRecurringCheck);
      if (newRecurring.length > 0) {
        dispatch({ type: ACTIONS.ADD_RECURRING_TRANSACTIONS, payload: newRecurring });
      }
      saveLastRecurringCheck(dayjs().toISOString());
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Biometric Auth
  const authenticateBiometrically = async () => {
    try {
      if (!LocalAuthentication) return false;
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) return false;

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Access Sovereign Ledger',
        fallbackLabel: 'Use Passcode',
      });

      if (result.success) {
        dispatch({ type: ACTIONS.SET_VERIFIED, payload: true });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Auth error:', error);
      return false;
    }
  };

  // Notifications for Budget Alerts
  const checkBudgetThresholds = useCallback((budgetsWithSpent) => {
    if (!Notifications) return;
    budgetsWithSpent.forEach(async (budget) => {
      try {
        if (budget.percentage >= 80 && budget.percentage < 100) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: '⚠️ Budget Warning',
              body: `You've spent ${Math.round(budget.percentage)}% of your ${budget.category} budget.`,
            },
            trigger: null, // immediate
          });
        } else if (budget.percentage >= 100) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: '🛑 Budget Exceeded',
              body: `You've exceeded your ${budget.category} budget!`,
            },
            trigger: null,
          });
        }
      } catch (e) {
        // Silently fail for notifications in Expo Go
      }
    });
  }, []);

  // Computed values
  const totalIncome = (state.transactions || [])
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = (state.transactions || [])
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const budgetsWithSpent = (state.budgets || []).map(budget => {
    const now = dayjs();
    let periodStart = now.startOf(budget.period || 'month');

    const spent = (state.transactions || [])
      .filter(t =>
        t.type === 'expense' &&
        t.category === budget.category &&
        dayjs(t.date).isAfter(periodStart)
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
    return { ...budget, spent, remaining: Math.max(0, budget.limit - spent), percentage };
  });

  // Watch budgets for alerts
  useEffect(() => {
    if (!state.isLoading && budgetsWithSpent.length > 0) {
      checkBudgetThresholds(budgetsWithSpent);
    }
  }, [state.transactions]);

  const colors = state.themeMode === 'dark' ? DarkTheme : LightTheme;

  const contextValue = {
    ...state,
    colors,
    budgets: budgetsWithSpent,
    totalIncome,
    totalExpenses,
    balance,
    dispatch,
    ACTIONS,
    // Auth Helpers
    setVerified: (verified) => dispatch({ type: ACTIONS.SET_VERIFIED, payload: verified }),
    setCurrency: (code) => dispatch({ type: ACTIONS.SET_CURRENCY, payload: getCurrency(code) }),
    authenticateBiometrically,
    toggleTheme: () => dispatch({ type: ACTIONS.SET_THEME, payload: state.themeMode === 'light' ? 'dark' : 'light' }),
    seedData: () => {
      const seed = seedSampleData();
      dispatch({ 
        type: ACTIONS.LOAD_ALL_DATA, 
        payload: { 
          ...state, 
          transactions: seed.transactions, 
          budgets: seed.budgets 
        } 
      });
      Alert.alert('Success', 'Sample data seeded successfully');
    },
    
    // Form Validation Helper
    validateTransaction: (transaction) => {
      if (!transaction.amount || transaction.amount <= 0) return 'Please enter a valid amount';
      if (!transaction.category) return 'Please select a category';
      return null;
    },
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};

export default AppContext;
