// Sovereign Ledger — Sample Data Seeder
import dayjs from 'dayjs';

const CATEGORIES = ['Food', 'Transport', 'Rent', 'Shopping', 'Utilities', 'Entertainment', 'Healthcare', 'Others'];
const INCOME_SOURCES = ['Salary', 'Freelance', 'Investment', 'Gift'];

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 9);

/**
 * Generates a realistic set of transactions for the last 3 months.
 */
export const seedSampleData = () => {
  const transactions = [];
  const now = dayjs();
  
  // 1. Initial Balance / Income
  for (let i = 0; i < 3; i++) {
    const month = now.subtract(i, 'month');
    
    // Salary
    transactions.push({
      id: generateId(),
      type: 'income',
      category: 'Salary',
      description: 'Monthly Salary',
      amount: 4500,
      date: month.startOf('month').add(1, 'day').toISOString(),
      isRecurring: true,
    });

    // Freelance
    transactions.push({
      id: generateId(),
      type: 'income',
      category: 'Freelance',
      description: 'Project Payment',
      amount: 800,
      date: month.startOf('month').add(15, 'day').toISOString(),
    });
  }

  // 2. Monthly Expenses (Rent, Utilities)
  for (let i = 0; i < 3; i++) {
    const month = now.subtract(i, 'month');
    
    transactions.push({
      id: generateId(),
      type: 'expense',
      category: 'Rent',
      description: 'Apartment Rent',
      amount: 1200,
      date: month.startOf('month').add(2, 'day').toISOString(),
      isRecurring: true,
    });

    transactions.push({
      id: generateId(),
      type: 'expense',
      category: 'Utilities',
      description: 'Electricity & Water',
      amount: 150,
      date: month.startOf('month').add(10, 'day').toISOString(),
    });
  }

  // 3. Random Daily Expenses
  for (let i = 0; i < 60; i++) {
    const date = now.subtract(i, 'day');
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const amount = Math.floor(Math.random() * 80) + 10;
    
    if (category === 'Rent' || category === 'Utilities') continue; // Skip fixed ones

    transactions.push({
      id: generateId(),
      type: 'expense',
      category,
      description: `${category} purchase`,
      amount,
      date: date.toISOString(),
    });
  }

  // 3.5 Specific transactions to guarantee rich history for budget categories
  const specificCategories = ['Food', 'Transport', 'Shopping', 'Entertainment'];
  specificCategories.forEach((cat) => {
    for (let i = 0; i < 4; i++) {
      transactions.push({
        id: generateId(),
        type: 'expense',
        category: cat,
        description: `Recent ${cat} expense`,
        amount: Math.floor(Math.random() * 40) + 10,
        date: now.subtract(i * 3 + 1, 'day').toISOString(),
      });
    }
  });

  // 4. Budgets
  const budgets = [
    { id: generateId(), category: 'Food', limit: 600, period: 'month' },
    { id: generateId(), category: 'Transport', limit: 300, period: 'month' },
    { id: generateId(), category: 'Shopping', limit: 400, period: 'month' },
    { id: generateId(), category: 'Entertainment', limit: 200, period: 'month' },
  ];

  return { transactions, budgets };
};
