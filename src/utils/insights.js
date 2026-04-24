// Sovereign Ledger — Local Financial Intelligence Utility
import dayjs from 'dayjs';

/**
 * Analyzes transaction history to provide smart local insights.
 * @param {Array} transactions 
 * @param {Array} budgets 
 * @returns {Array} List of insight objects
 */
export const generateInsights = (transactions, budgets) => {
  if (!transactions || !Array.isArray(transactions)) return [];
  if (!budgets || !Array.isArray(budgets)) return [];

  const insights = [];
  const now = dayjs();
  const thisMonth = now.startOf('month');
  const lastMonth = now.subtract(1, 'month').startOf('month');

  const monthExpenses = transactions.filter(t => t.type === 'expense' && dayjs(t.date).isAfter(thisMonth));
  const lastMonthExpenses = transactions.filter(t => 
    t.type === 'expense' && 
    dayjs(t.date).isAfter(lastMonth) && 
    dayjs(t.date).isBefore(thisMonth)
  );

  const totalThisMonth = monthExpenses.reduce((sum, t) => sum + t.amount, 0);
  const totalLastMonth = lastMonthExpenses.reduce((sum, t) => sum + t.amount, 0);

  // 1. Spending Trend Insight
  if (totalLastMonth > 0) {
    const diff = ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100;
    if (diff > 15) {
      insights.push({
        type: 'warning',
        title: 'Spending Spike',
        message: `Your spending is up ${Math.round(diff)}% compared to last month. Consider reviewing your "Other" category.`,
        icon: 'trending-up'
      });
    } else if (diff < -10) {
      insights.push({
        type: 'success',
        title: 'Great Progress!',
        message: `You've spent ${Math.round(Math.abs(diff))}% less than last month. Keep it up!`,
        icon: 'trending-down'
      });
    }
  }

  // 2. Budget Adherence Insight
  const overBudgets = budgets.filter(b => b.percentage >= 100);
  if (overBudgets.length > 0) {
    insights.push({
      type: 'danger',
      title: 'Budget Breached',
      message: `You've exceeded budgets for ${overBudgets.map(b => b.category).join(', ')}.`,
      icon: 'alert-circle'
    });
  }

  // 3. Subscription/Recurring Detection
  const categories = {};
  monthExpenses.forEach(t => { categories[t.category] = (categories[t.category] || 0) + t.amount; });
  const subscriptions = transactions.filter(t => t.isRecurring);
  if (subscriptions.length > 0) {
    const nextSub = subscriptions[0]; // Simplified
    insights.push({
      type: 'info',
      title: 'Upcoming Payment',
      message: `Your recurring ${nextSub.category} payment of ${nextSub.amount} is due soon.`,
      icon: 'calendar'
    });
  }

  // 4. Savings Potential
  const income = transactions.filter(t => t.type === 'income' && dayjs(t.date).isAfter(thisMonth))
    .reduce((s, t) => s + t.amount, 0);
  if (income > totalThisMonth && income > 0) {
    const savingsRate = ((income - totalThisMonth) / income) * 100;
    if (savingsRate > 20) {
      insights.push({
        type: 'success',
        title: 'High Savings Rate',
        message: `You are saving ${Math.round(savingsRate)}% of your income this month. Excellent!`,
        icon: 'leaf'
      });
    }
  }

  return insights;
};
