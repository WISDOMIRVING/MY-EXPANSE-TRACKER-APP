// Sovereign Ledger — AsyncStorage Persistence Utilities
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  TRANSACTIONS: '@sovereign_ledger_transactions',
  BUDGETS: '@sovereign_ledger_budgets',
  SETTINGS: '@sovereign_ledger_settings',
  CURRENCY: '@sovereign_ledger_currency',
  USER_PROFILE: '@sovereign_ledger_user_profile',
  LAST_RECURRING_CHECK: '@sovereign_ledger_last_recurring',
};

export const saveData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error(`Error saving data for key ${key}:`, error);
    return false;
  }
};

export const loadData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error loading data for key ${key}:`, error);
    return null;
  }
};

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing data for key ${key}:`, error);
    return false;
  }
};

export const clearAllData = async () => {
  try {
    const keys = Object.values(STORAGE_KEYS);
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
};

export const saveTransactions = (transactions) =>
  saveData(STORAGE_KEYS.TRANSACTIONS, transactions);

export const loadTransactions = () =>
  loadData(STORAGE_KEYS.TRANSACTIONS);

export const saveBudgets = (budgets) =>
  saveData(STORAGE_KEYS.BUDGETS, budgets);

export const loadBudgets = () =>
  loadData(STORAGE_KEYS.BUDGETS);

export const saveSettings = (settings) =>
  saveData(STORAGE_KEYS.SETTINGS, settings);

export const loadSettings = () =>
  loadData(STORAGE_KEYS.SETTINGS);

export const saveCurrency = (currency) =>
  saveData(STORAGE_KEYS.CURRENCY, currency);

export const loadCurrency = () =>
  loadData(STORAGE_KEYS.CURRENCY);

export const saveUserProfile = (profile) =>
  saveData(STORAGE_KEYS.USER_PROFILE, profile);

export const loadUserProfile = () =>
  loadData(STORAGE_KEYS.USER_PROFILE);

export const saveLastRecurringCheck = (date) =>
  saveData(STORAGE_KEYS.LAST_RECURRING_CHECK, date);

export const loadLastRecurringCheck = () =>
  loadData(STORAGE_KEYS.LAST_RECURRING_CHECK);

export { STORAGE_KEYS };
export default {
  saveData,
  loadData,
  removeData,
  clearAllData,
  STORAGE_KEYS,
};
