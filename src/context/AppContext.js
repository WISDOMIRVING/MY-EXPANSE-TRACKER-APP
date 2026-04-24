// Sovereign Ledger — Global App Context with Reducer
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import {
  saveTransactions, loadTransactions,
  saveBudgets, loadBudgets,
  saveCurrency, loadCurrency,
  saveLastRecurringCheck, loadLastRecurringCheck,
} from '../utils/storage';
import { DEFAULT_CURRENCY, getCurrency } from '../utils/currency';
import { processRecurringTransactions } from '../utils/recurring';
import dayjs from 'dayjs';

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
  ADD_RECURRING_TRANSACTIONS: 'ADD_RECURRING_TRANSACTIONS',
};

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 9);

// Sample seed data for first-time users
const SEED_TRANSACTIONS = [
  {
    id: generateId(),
    type: 'income',
    amount: 5500,
    category: 'Salary',
    description: 'Monthly Salary',
    date: dayjs().subtract(2, 'day').toISOString(),
    isRecurring: true,
    recurringInterval: 'monthly',
  },
  {
    id: generateId(),
    type: 'expense',
    amount: 1500,
    category: 'Housing',
    description: 'Monthly Rent',
    date: dayjs().subtract(1, 'day').toISOString(),
    isRecurring: true,
    recurringInterval: 'monthly',
  },
  {
    id: generateId(),
    type: 'expense',
    amount: 85,
    category: 'Food',
    description: 'Grocery Shopping',
    date: dayjs().subtract(1, 'day').toISOString(),
    isRecurring: false,
  },
  {
    id: generateId(),
    type: 'expense',
    amount: 45.50,
    category: 'Transport',
    description: 'Bus to Kane',
    date: dayjs().toISOString(),
    isRecurring: false,
  },
  {
    id: generateId(),
    type: 'expense',
    amount: 32,
    category: 'Food',
    description: 'Dining Out',
    date: dayjs().subtract(3, 'day').toISOString(),
    isRecurring: false,
  },
  {
    id: generateId(),
    type: 'expense',
    amount: 150,
    category: 'Transport',
    description: 'Train to Abuja',
    date: dayjs().subtract(4, 'day').toISOString(),
    isRecurring: false,
  },
  {
    id: generateId(),
    type: 'expense',
    amount: 750,
    category: 'Transport',
    description: 'Flight to NYC',
    date: dayjs().subtract(5, 'day').toISOString(),
    isRecurring: false,
  },
  {
    id: generateId(),
    type: 'income',
    amount: 2000,
    category: 'Salary',
    description: 'Freelance Payment',
    date: dayjs().subtract(6, 'day').toISOString(),
    isRecurring: false,
  },
  {
    id: generateId(),
    type: 'expense',
    amount: 420,
    category: 'Food',
    description: 'Restaurant Week',
    date: dayjs().subtract(7, 'day').toISOString(),
    isRecurring: false,
  },
  {
    id: generateId(),
    type: 'expense',
    amount: 680,
    category: 'Shopping',
    description: 'Groceries Bulk',
    date: dayjs().subtract(8, 'day').toISOString(),
    isRecurring: false,
  },
  {
    id: generateId(),
    type: 'expense',
    amount: 2500,
    category: 'Transport',
    description: 'Cruise to Miami',
    date: dayjs().subtract(10, 'day').toISOString(),
    isRecurring: false,
  },
  {
    id: generateId(),
    type: 'expense',
    amount: 20,
    category: 'Transport',
    description: 'Ferry to Lagos Island',
    date: dayjs().subtract(11, 'day').toISOString(),
    isRecurring: false,
  },
  {
    id: generateId(),
    type: 'expense',
    amount: 300,
    category: 'Transport',
    description: 'Car Rental in Accra',
    date: dayjs().subtract(12, 'day').toISOString(),
    isRecurring: false,
  },
  {
    id: generateId(),
    type: 'expense',
    amount: 15,
    category: 'Transport',
    description: 'Ride Share to Ibadan',
    date: dayjs().subtract(13, 'day').toISOString(),
    isRecurring: false,
  },
  {
    id: generateId(),
    type: 'expense',
    amount: 1999,
    category: 'Transport',
    description: 'Back to Lagos',
    date: dayjs().subtract(14, 'day').toISOString(),
    isRecurring: false,
  },
];

const SEED_BUDGETS = [
  {
    id: generateId(),
    category: 'Housing',
    limit: 2500,
    period: 'monthly',
    icon: 'home',
  },
  {
    id: generateId(),
    category: 'Food',
    limit: 800,
    period: 'monthly',
    icon: 'restaurant',
  },
  {
    id: generateId(),
    category: 'Shopping',
    limit: 1200,
    period: 'monthly',
    icon: 'cart',
  },
  {
    id: generateId(),
    category: 'Transport',
    limit: 500,
    period: 'monthly',
    icon: 'car',
  },
];

const initialState = {
  isLoading: true,
  transactions: [],
  budgets: [],
  currency: DEFAULT_CURRENCY,
  isVerified: false,
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
        isLoading: false,
      };

    case ACTIONS.ADD_TRANSACTION:
      return {
        ...state,
        transactions: [{ ...action.payload, id: action.payload.id || generateId() }, ...state.transactions],
      };

    case ACTIONS.UPDATE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };

    case ACTIONS.DELETE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };

    case ACTIONS.ADD_BUDGET:
      return {
        ...state,
        budgets: [...state.budgets, { ...action.payload, id: action.payload.id || generateId() }],
      };

    case ACTIONS.UPDATE_BUDGET:
      return {
        ...state,
        budgets: state.budgets.map(b =>
          b.id === action.payload.id ? { ...b, ...action.payload } : b
        ),
      };

    case ACTIONS.DELETE_BUDGET:
      return {
        ...state,
        budgets: state.budgets.filter(b => b.id !== action.payload),
      };

    case ACTIONS.SET_CURRENCY:
      return { ...state, currency: action.payload };

    case ACTIONS.SET_VERIFIED:
      return { ...state, isVerified: action.payload };

    case ACTIONS.ADD_RECURRING_TRANSACTIONS:
      return {
        ...state,
        transactions: [...action.payload, ...state.transactions],
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
  }, []);

  // Auto-save transactions whenever they change
  useEffect(() => {
    if (!state.isLoading && state.transactions.length >= 0) {
      saveTransactions(state.transactions);
    }
  }, [state.transactions, state.isLoading]);

  // Auto-save budgets whenever they change
  useEffect(() => {
    if (!state.isLoading && state.budgets.length >= 0) {
      saveBudgets(state.budgets);
    }
  }, [state.budgets, state.isLoading]);

  // Auto-save currency whenever it changes
  useEffect(() => {
    if (!state.isLoading) {
      saveCurrency(state.currency);
    }
  }, [state.currency, state.isLoading]);

  const loadPersistedData = async () => {
    try {
      const [transactions, budgets, currency, lastRecurringCheck] = await Promise.all([
        loadTransactions(),
        loadBudgets(),
        loadCurrency(),
        loadLastRecurringCheck(),
      ]);

      const loadedTransactions = transactions || SEED_TRANSACTIONS;
      const loadedBudgets = budgets || SEED_BUDGETS;
      const loadedCurrency = currency ? getCurrency(currency.code) : DEFAULT_CURRENCY;

      dispatch({
        type: ACTIONS.LOAD_ALL_DATA,
        payload: {
          transactions: loadedTransactions,
          budgets: loadedBudgets,
          currency: loadedCurrency,
        },
      });

      // Process recurring transactions
      const newRecurring = processRecurringTransactions(loadedTransactions, lastRecurringCheck);
      if (newRecurring.length > 0) {
        dispatch({ type: ACTIONS.ADD_RECURRING_TRANSACTIONS, payload: newRecurring });
      }
      saveLastRecurringCheck(dayjs().toISOString());
    } catch (error) {
      console.error('Error loading persisted data:', error);
      dispatch({
        type: ACTIONS.LOAD_ALL_DATA,
        payload: {
          transactions: SEED_TRANSACTIONS,
          budgets: SEED_BUDGETS,
          currency: DEFAULT_CURRENCY,
        },
      });
    }
  };

  // Helper computed values
  const totalIncome = state.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = state.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Budget calculations — compute spent for each budget
  const budgetsWithSpent = state.budgets.map(budget => {
    const now = dayjs();
    let periodStart;
    switch (budget.period) {
      case 'weekly':
        periodStart = now.startOf('week');
        break;
      case 'yearly':
        periodStart = now.startOf('year');
        break;
      case 'monthly':
      default:
        periodStart = now.startOf('month');
        break;
    }

    const spent = state.transactions
      .filter(t =>
        t.type === 'expense' &&
        t.category === budget.category &&
        dayjs(t.date).isAfter(periodStart)
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const remaining = Math.max(0, budget.limit - spent);
    const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
    const status = percentage >= 100 ? 'over' : percentage >= 80 ? 'warning' : 'healthy';

    return { ...budget, spent, remaining, percentage, status };
  });

  const contextValue = {
    ...state,
    budgets: budgetsWithSpent,
    totalIncome,
    totalExpenses,
    balance,
    dispatch,
    ACTIONS,

    // Convenience action creators
    addTransaction: (transaction) =>
      dispatch({ type: ACTIONS.ADD_TRANSACTION, payload: transaction }),
    updateTransaction: (transaction) =>
      dispatch({ type: ACTIONS.UPDATE_TRANSACTION, payload: transaction }),
    deleteTransaction: (id) =>
      dispatch({ type: ACTIONS.DELETE_TRANSACTION, payload: id }),
    addBudget: (budget) =>
      dispatch({ type: ACTIONS.ADD_BUDGET, payload: budget }),
    updateBudget: (budget) =>
      dispatch({ type: ACTIONS.UPDATE_BUDGET, payload: budget }),
    deleteBudget: (id) =>
      dispatch({ type: ACTIONS.DELETE_BUDGET, payload: id }),
    setCurrency: (currency) =>
      dispatch({ type: ACTIONS.SET_CURRENCY, payload: currency }),
    setVerified: (verified) =>
      dispatch({ type: ACTIONS.SET_VERIFIED, payload: verified }),
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
