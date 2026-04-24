// Sovereign Ledger — Analytics Dashboard Screen
import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Dimensions, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BarChart, PieChart } from 'react-native-chart-kit';
import Colors from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing, BorderRadius, Shadow } from '../theme/spacing';
import { useAppContext } from '../context/AppContext';
import { formatCurrency } from '../utils/currency';
import TabSelector from '../components/TabSelector';
import { getCategoryColor } from '../components/CategoryIcon';
import dayjs from 'dayjs';

const { width } = Dimensions.get('window');

const PERIOD_TABS = [
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
];

const AnalyticsScreen = () => {
  const insets = useSafeAreaInsets();
  const { transactions, currency, totalIncome, totalExpenses, balance } = useAppContext();
  const [period, setPeriod] = useState('month');

  // Filter transactions by period
  const periodTransactions = useMemo(() => {
    const now = dayjs();
    let start;
    switch (period) {
      case 'week':
        start = now.startOf('week');
        break;
      case 'year':
        start = now.startOf('year');
        break;
      case 'month':
      default:
        start = now.startOf('month');
        break;
    }
    return transactions.filter(t => dayjs(t.date).isAfter(start));
  }, [transactions, period]);

  // Category breakdown for pie chart
  const categoryData = useMemo(() => {
    const expenses = periodTransactions.filter(t => t.type === 'expense');
    const categories = {};
    expenses.forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });
    return Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .map(([name, amount]) => ({
        name,
        amount,
        color: getCategoryColor(name),
        legendFontColor: Colors.textSecondary,
        legendFontSize: 12,
      }));
  }, [periodTransactions]);

  // Spending trend data (last 6 intervals)
  const trendData = useMemo(() => {
    const now = dayjs();
    const labels = [];
    const data = [];
    const count = period === 'week' ? 7 : period === 'month' ? 4 : 6;

    for (let i = count - 1; i >= 0; i--) {
      let start, end, label;
      if (period === 'week') {
        start = now.subtract(i, 'day').startOf('day');
        end = now.subtract(i, 'day').endOf('day');
        label = start.format('ddd');
      } else if (period === 'month') {
        start = now.startOf('month').add((3 - i) * 7, 'day');
        end = dayjs.min ? start.add(7, 'day') : start.add(7, 'day');
        label = `W${4 - i}`;
      } else {
        start = now.subtract(i, 'month').startOf('month');
        end = now.subtract(i, 'month').endOf('month');
        label = start.format('MMM');
      }

      const total = transactions
        .filter(t => t.type === 'expense' && dayjs(t.date).isAfter(start) && dayjs(t.date).isBefore(end))
        .reduce((s, t) => s + t.amount, 0);

      labels.push(label);
      data.push(total);
    }

    return { labels, data };
  }, [transactions, period]);

  // Period totals
  const periodTotals = useMemo(() => {
    const income = periodTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = periodTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expenses, net: income - expenses };
  }, [periodTransactions]);

  const chartConfig = {
    backgroundColor: Colors.surface,
    backgroundGradientFrom: Colors.surface,
    backgroundGradientTo: Colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(47, 124, 246, ${opacity})`,
    labelColor: () => Colors.textSecondary,
    style: { borderRadius: 16 },
    barPercentage: 0.6,
    propsForLabels: {
      fontFamily: FontFamily.medium,
      fontSize: 11,
    },
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>Spending Insights</Text>
      </View>

      {/* Period Tabs */}
      <View style={styles.tabContainer}>
        <TabSelector tabs={PERIOD_TABS} activeTab={period} onTabChange={setPeriod} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { borderLeftColor: Colors.success }]}>
            <View style={styles.summaryIconRow}>
              <Ionicons name="trending-up" size={16} color={Colors.success} />
              <Text style={styles.summaryLabel}>Income</Text>
            </View>
            <Text style={[styles.summaryValue, { color: Colors.success }]}>
              {formatCurrency(periodTotals.income, currency)}
            </Text>
          </View>
          <View style={[styles.summaryCard, { borderLeftColor: Colors.danger }]}>
            <View style={styles.summaryIconRow}>
              <Ionicons name="trending-down" size={16} color={Colors.danger} />
              <Text style={styles.summaryLabel}>Expenses</Text>
            </View>
            <Text style={[styles.summaryValue, { color: Colors.danger }]}>
              {formatCurrency(periodTotals.expenses, currency)}
            </Text>
          </View>
        </View>

        {/* Net Savings Card */}
        <View style={styles.netCard}>
          <View style={styles.netIconRow}>
            <View style={styles.netIcon}>
              <Ionicons name="wallet" size={18} color={Colors.primary} />
            </View>
            <Text style={styles.netLabel}>Net Savings</Text>
          </View>
          <Text style={[styles.netValue, { color: periodTotals.net >= 0 ? Colors.success : Colors.danger }]}>
            {periodTotals.net >= 0 ? '+' : ''}{formatCurrency(periodTotals.net, currency)}
          </Text>
        </View>

        {/* Spending Trend Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Spending Trend</Text>
          {trendData.data.some(d => d > 0) ? (
            <BarChart
              data={{
                labels: trendData.labels,
                datasets: [{ data: trendData.data.length > 0 ? trendData.data : [0] }],
              }}
              width={width - Spacing.lg * 2 - Spacing.xl * 2}
              height={200}
              chartConfig={chartConfig}
              style={styles.chart}
              fromZero
              showValuesOnTopOfBars={false}
              withInnerLines={false}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Ionicons name="bar-chart-outline" size={40} color={Colors.textMuted} />
              <Text style={styles.noDataText}>No spending data for this period</Text>
            </View>
          )}
        </View>

        {/* Category Breakdown */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Category Breakdown</Text>
          {categoryData.length > 0 ? (
            <>
              <PieChart
                data={categoryData}
                width={width - Spacing.lg * 2 - Spacing.xl * 2}
                height={200}
                chartConfig={chartConfig}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
              {/* Breakdown List */}
              <View style={styles.breakdownList}>
                {categoryData.map((item, index) => (
                  <View key={item.name} style={styles.breakdownItem}>
                    <View style={styles.breakdownLeft}>
                      <View style={[styles.dot, { backgroundColor: item.color }]} />
                      <Text style={styles.breakdownName}>{item.name}</Text>
                    </View>
                    <Text style={styles.breakdownAmount}>
                      {formatCurrency(item.amount, currency)}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.noDataContainer}>
              <Ionicons name="pie-chart-outline" size={40} color={Colors.textMuted} />
              <Text style={styles.noDataText}>No expense data to visualize</Text>
            </View>
          )}
        </View>

        {/* Top Spending Categories */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Top Categories</Text>
          {categoryData.slice(0, 5).map((cat, idx) => {
            const totalExpenses = categoryData.reduce((s, c) => s + c.amount, 0);
            const pct = totalExpenses > 0 ? (cat.amount / totalExpenses) * 100 : 0;
            return (
              <View key={cat.name} style={styles.topCatItem}>
                <View style={styles.topCatHeader}>
                  <View style={styles.topCatLeft}>
                    <Text style={styles.topCatRank}>#{idx + 1}</Text>
                    <Text style={styles.topCatName}>{cat.name}</Text>
                  </View>
                  <Text style={styles.topCatAmount}>{formatCurrency(cat.amount, currency)}</Text>
                </View>
                <View style={styles.topCatBar}>
                  <View
                    style={[styles.topCatBarFill, { width: `${pct}%`, backgroundColor: cat.color }]}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  tabContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 3,
    gap: Spacing.sm,
  },
  summaryIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  summaryLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
  },
  netCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  netIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  netIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  netLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  netValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
  },
  chartCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  chartTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  chart: {
    borderRadius: BorderRadius.md,
    marginLeft: -Spacing.lg,
  },
  noDataContainer: {
    alignItems: 'center',
    padding: Spacing.xxxl,
    gap: Spacing.md,
  },
  noDataText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textMuted,
  },
  breakdownList: {
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  breakdownName: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  breakdownAmount: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  topCatItem: {
    marginBottom: Spacing.lg,
  },
  topCatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  topCatLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  topCatRank: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  topCatName: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  topCatAmount: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  topCatBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  topCatBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});

export default AnalyticsScreen;
