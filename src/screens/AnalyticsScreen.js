// Sovereign Ledger — Analytics Dashboard Screen
import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Dimensions, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';
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
  const { transactions, currency, colors, themeMode } = useAppContext();
  const [period, setPeriod] = useState('month');

  const periodTransactions = useMemo(() => {
    if (!transactions) return [];
    const now = dayjs();
    let start;
    switch (period) {
      case 'week': start = now.startOf('week'); break;
      case 'year': start = now.startOf('year'); break;
      case 'month':
      default: start = now.startOf('month'); break;
    }
    return transactions.filter(t => dayjs(t.date).isAfter(start));
  }, [transactions, period]);

  const categoryData = useMemo(() => {
    if (!periodTransactions.length) return [];
    const expenses = periodTransactions.filter(t => t.type === 'expense');
    const categories = {};
    expenses.forEach(t => { categories[t.category] = (categories[t.category] || 0) + t.amount; });
    return Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .map(([name, amount]) => ({
        name,
        amount,
        color: getCategoryColor(name),
        legendFontColor: colors.textSecondary,
        legendFontSize: 12,
      }));
  }, [periodTransactions, colors]);

  const trendData = useMemo(() => {
    if (!transactions) return { labels: [], data: [] };
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
        end = start.add(7, 'day');
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

  const periodTotals = useMemo(() => {
    const income = periodTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = periodTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expenses, net: income - expenses };
  }, [periodTransactions]);

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => colors.primary,
    labelColor: () => colors.textSecondary,
    style: { borderRadius: 16 },
    barPercentage: 0.6,
    propsForLabels: { fontFamily: FontFamily.medium, fontSize: 11 },
  };

  const dynamicStyles = {
    container: { backgroundColor: colors.background },
    textPrimary: { color: colors.textPrimary },
    textSecondary: { color: colors.textSecondary },
    surface: { backgroundColor: colors.surface, borderColor: colors.border },
  };

  return (
    <View style={[styles.container, dynamicStyles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <Text style={[styles.title, dynamicStyles.textPrimary]}>Analytics</Text>
        <Text style={[styles.subtitle, dynamicStyles.textSecondary]}>Spending Insights</Text>
      </View>

      <View style={styles.tabContainer}>
        <TabSelector tabs={PERIOD_TABS} activeTab={period} onTabChange={setPeriod} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, dynamicStyles.surface, { borderLeftColor: colors.success }]}>
            <View style={styles.summaryIconRow}><Ionicons name="trending-up" size={16} color={colors.success} /><Text style={[styles.summaryLabel, dynamicStyles.textSecondary]}>Income</Text></View>
            <Text style={[styles.summaryValue, { color: colors.success }]}>{formatCurrency(periodTotals.income, currency)}</Text>
          </View>
          <View style={[styles.summaryCard, dynamicStyles.surface, { borderLeftColor: colors.danger }]}>
            <View style={styles.summaryIconRow}><Ionicons name="trending-down" size={16} color={colors.danger} /><Text style={[styles.summaryLabel, dynamicStyles.textSecondary]}>Expenses</Text></View>
            <Text style={[styles.summaryValue, { color: colors.danger }]}>{formatCurrency(periodTotals.expenses, currency)}</Text>
          </View>
        </View>

        <View style={[styles.netCard, dynamicStyles.surface]}>
          <View style={styles.netIconRow}>
            <View style={[styles.netIcon, { backgroundColor: colors.primaryFaded }]}><Ionicons name="wallet" size={18} color={colors.primary} /></View>
            <Text style={[styles.netLabel, dynamicStyles.textPrimary]}>Net Savings</Text>
          </View>
          <Text style={[styles.netValue, { color: periodTotals.net >= 0 ? colors.success : colors.danger }]}>{periodTotals.net >= 0 ? '+' : ''}{formatCurrency(periodTotals.net, currency)}</Text>
        </View>

        <View style={[styles.chartCard, dynamicStyles.surface]}>
          <Text style={[styles.chartTitle, dynamicStyles.textPrimary]}>Spending Trend</Text>
          {trendData.data.some(d => d > 0) ? (
            <BarChart data={{ labels: trendData.labels, datasets: [{ data: trendData.data }] }} width={width - 64} height={200} chartConfig={chartConfig} style={styles.chart} fromZero withInnerLines={false} />
          ) : (
            <View style={styles.noDataContainer}><Ionicons name="bar-chart-outline" size={40} color={colors.textMuted} /><Text style={[styles.noDataText, { color: colors.textMuted }]}>No data</Text></View>
          )}
        </View>

        <View style={[styles.chartCard, dynamicStyles.surface]}>
          <Text style={[styles.chartTitle, dynamicStyles.textPrimary]}>Category Breakdown</Text>
          {categoryData.length > 0 ? (
            <>
              <PieChart data={categoryData} width={width - 64} height={200} chartConfig={chartConfig} accessor="amount" backgroundColor="transparent" paddingLeft="15" absolute />
              <View style={styles.breakdownList}>
                {categoryData.map((item) => (
                  <View key={item.name} style={styles.breakdownItem}>
                    <View style={styles.breakdownLeft}><View style={[styles.dot, { backgroundColor: item.color }]} /><Text style={[styles.breakdownName, dynamicStyles.textPrimary]}>{item.name}</Text></View>
                    <Text style={[styles.breakdownAmount, dynamicStyles.textSecondary]}>{formatCurrency(item.amount, currency)}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.noDataContainer}><Ionicons name="pie-chart-outline" size={40} color={colors.textMuted} /><Text style={[styles.noDataText, { color: colors.textMuted }]}>No data</Text></View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  title: { fontFamily: FontFamily.bold, fontSize: FontSize.xxl },
  subtitle: { fontFamily: FontFamily.regular, fontSize: FontSize.md, marginTop: 2 },
  tabContainer: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingBottom: 100 },
  summaryRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
  summaryCard: { flex: 1, borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderLeftWidth: 3, gap: Spacing.sm },
  summaryIconRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  summaryLabel: { fontFamily: FontFamily.medium, fontSize: FontSize.sm },
  summaryValue: { fontFamily: FontFamily.bold, fontSize: FontSize.xl },
  netCard: { borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.lg },
  netIconRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  netIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  netLabel: { fontFamily: FontFamily.medium, fontSize: FontSize.lg },
  netValue: { fontFamily: FontFamily.bold, fontSize: FontSize.xl },
  chartCard: { borderRadius: BorderRadius.lg, padding: Spacing.xl, borderWidth: 1, marginBottom: Spacing.lg },
  chartTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.lg, marginBottom: Spacing.lg },
  chart: { borderRadius: BorderRadius.md, marginLeft: -Spacing.lg },
  noDataContainer: { alignItems: 'center', padding: Spacing.xxxl, gap: Spacing.md },
  noDataText: { fontFamily: FontFamily.regular, fontSize: FontSize.md },
  breakdownList: { marginTop: Spacing.lg, gap: Spacing.md },
  breakdownItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  breakdownLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  dot: { width: 10, height: 10, borderRadius: 5 },
  breakdownName: { fontFamily: FontFamily.medium, fontSize: FontSize.md },
  breakdownAmount: { fontFamily: FontFamily.semiBold, fontSize: FontSize.md },
});

export default AnalyticsScreen;
