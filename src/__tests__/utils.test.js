// Sovereign Ledger — Sample Unit Tests for Utilities
import { formatCurrency } from '../utils/currency';
import { processRecurringTransactions } from '../utils/recurring';
import dayjs from 'dayjs';

describe('Currency Utilities', () => {
  test('formats amount correctly for USD', () => {
    const currency = { code: 'USD', symbol: '$' };
    expect(formatCurrency(1234.56, currency)).toBe('$1,234.56');
  });

  test('handles zero amount', () => {
    const currency = { code: 'USD', symbol: '$' };
    expect(formatCurrency(0, currency)).toBe('$0.00');
  });
});

describe('Recurring Transactions Logic', () => {
  test('should generate a new transaction if interval has passed', () => {
    const transactions = [
      {
        id: '1',
        type: 'expense',
        amount: 100,
        category: 'Food',
        isRecurring: true,
        recurringInterval: 'daily',
        date: dayjs().subtract(2, 'day').toISOString(),
      }
    ];
    const lastCheck = dayjs().subtract(1, 'day').toISOString();
    
    const result = processRecurringTransactions(transactions, lastCheck);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].amount).toBe(100);
  });

  test('should NOT generate transaction if not recurring', () => {
    const transactions = [
      {
        id: '2',
        type: 'expense',
        amount: 50,
        category: 'Food',
        isRecurring: false,
        date: dayjs().subtract(5, 'day').toISOString(),
      }
    ];
    const lastCheck = dayjs().subtract(1, 'day').toISOString();
    
    const result = processRecurringTransactions(transactions, lastCheck);
    expect(result.length).toBe(0);
  });
});
