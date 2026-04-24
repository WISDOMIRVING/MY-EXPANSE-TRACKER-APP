// Sovereign Ledger — Currency Formatting Utilities

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US', position: 'before' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE', position: 'before' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB', position: 'before' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', locale: 'en-NG', position: 'before' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP', position: 'before', decimals: 0 },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', locale: 'en-CA', position: 'before' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU', position: 'before' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN', position: 'before' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', locale: 'en-ZA', position: 'before' },
  { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi', locale: 'en-GH', position: 'before' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', locale: 'en-KE', position: 'before' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR', position: 'before' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN', position: 'before' },
];

export const DEFAULT_CURRENCY = CURRENCIES[0]; // USD

/**
 * Format a number as currency with proper symbol and separators
 */
export const formatCurrency = (amount, currency = DEFAULT_CURRENCY) => {
  const decimals = currency.decimals !== undefined ? currency.decimals : 2;
  const absAmount = Math.abs(amount);
  
  // Format with commas and decimals
  const parts = absAmount.toFixed(decimals).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const formatted = parts.join('.');
  
  const sign = amount < 0 ? '-' : '';
  
  if (currency.position === 'after') {
    return `${sign}${formatted}${currency.symbol}`;
  }
  return `${sign}${currency.symbol}${formatted}`;
};

/**
 * Format currency with sign indicator for transactions
 */
export const formatTransactionAmount = (amount, type, currency = DEFAULT_CURRENCY) => {
  const absFormatted = formatCurrency(Math.abs(amount), currency);
  if (type === 'income') {
    return `+${absFormatted}`;
  }
  return `-${absFormatted}`;
};

/**
 * Parse a currency string back to a number
 */
export const parseCurrencyInput = (input) => {
  // Remove everything except digits and decimal point
  const cleaned = input.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Get currency by code
 */
export const getCurrency = (code) => {
  return CURRENCIES.find(c => c.code === code) || DEFAULT_CURRENCY;
};

export default {
  CURRENCIES,
  DEFAULT_CURRENCY,
  formatCurrency,
  formatTransactionAmount,
  parseCurrencyInput,
  getCurrency,
};
