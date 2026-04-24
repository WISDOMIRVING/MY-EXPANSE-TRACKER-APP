// Sovereign Ledger — Transaction Ledger Screen
import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';
import { useAppContext } from '../context/AppContext';
import { formatCurrency } from '../utils/currency';
import TransactionItem from '../components/TransactionItem';
import TabSelector from '../components/TabSelector';
import CategoryIcon, { getCategoryColor } from '../components/CategoryIcon';
import dayjs from 'dayjs';

const PERIOD_TABS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const CATEGORY_FILTERS = ['All', 'Food', 'Transport', 'Shopping', 'Housing', 'Other'];

const LedgerScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { transactions, currency, deleteTransaction } = useAppContext();
  const [period, setPeriod] = useState('monthly');
  const [activeCategory, setActiveCategory] = useState('All');

  const currentMonth = dayjs().format('MMMM YYYY');

  // Filter transactions based on period and category
  const filteredTransactions = useMemo(() => {
    const now = dayjs();
    let periodStart;
    switch (period) {
      case 'daily':
        periodStart = now.startOf('day');
        break;
      case 'weekly':
        periodStart = now.startOf('week');
        break;
      case 'monthly':
      default:
        periodStart = now.startOf('month');
        break;
    }

    let filtered = transactions.filter(t => dayjs(t.date).isAfter(periodStart));

    if (activeCategory !== 'All') {
      if (activeCategory === 'Other') {
        const mainCategories = ['Food', 'Transport', 'Shopping', 'Housing'];
        filtered = filtered.filter(t => !mainCategories.includes(t.category));
      } else {
        filtered = filtered.filter(t => t.category === activeCategory);
      }
    }

    return filtered.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());
  }, [transactions, period, activeCategory]);

  // Group by date
  const groupedTransactions = useMemo(() => {
    const groups = {};
    filteredTransactions.forEach(t => {
      const dateKey = dayjs(t.date).format('MMMM DD, YYYY');
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(t);
    });
    return Object.entries(groups);
  }, [filteredTransactions]);

  // Period totals
  const periodTotals = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0);
    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0);
    return { income, expenses, net: income - expenses };
  }, [filteredTransactions]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{currentMonth} Transaction Ledger</Text>
      </View>

      {/* Period Tabs */}
      <View style={styles.tabContainer}>
        <TabSelector
          tabs={PERIOD_TABS}
          activeTab={period}
          onTabChange={setPeriod}
        />
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {CATEGORY_FILTERS.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, isActive && styles.categoryChipActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Period Summary */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Income</Text>
          <Text style={[styles.summaryValue, { color: Colors.success }]}>
            +{formatCurrency(periodTotals.income, currency)}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Expenses</Text>
          <Text style={[styles.summaryValue, { color: Colors.danger }]}>
            -{formatCurrency(periodTotals.expenses, currency)}
          </Text>
        </View>
      </View>

      {/* Transaction List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      >
        {groupedTransactions.length > 0 ? (
          groupedTransactions.map(([dateKey, items]) => (
            <View key={dateKey} style={styles.dateGroup}>
              <Text style={styles.dateHeader}>{dateKey}</Text>
              <View style={styles.transactionCard}>
                {items.map((transaction, idx) => (
                  <View key={transaction.id}>
                    <TransactionItem
                      transaction={transaction}
                      currency={currency}
                      showDate={false}
                      onPress={() => {}}
                    />
                    {idx < items.length - 1 && <View style={styles.itemDivider} />}
                  </View>
                ))}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No Transactions</Text>
            <Text style={styles.emptySubtext}>
              No transactions found for this {period === 'daily' ? 'day' : period === 'weekly' ? 'week' : 'month'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.newLedgerBtn}
          onPress={() => navigation.navigate('AddTransaction', { type: 'expense' })}
        >
          <View style={styles.newLedgerIcon}>
            <Ionicons name="document-text" size={20} color={Colors.primary} />
          </View>
          <View>
            <Text style={styles.newLedgerTitle}>New Ledger</Text>
            <Text style={styles.newLedgerSubtitle}>Record a new transaction</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickAddBtn}
          onPress={() => navigation.navigate('AddTransaction', { type: 'expense' })}
        >
          <Text style={styles.quickAddText}>Quick Add</Text>
        </TouchableOpacity>
      </View>
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
    paddingVertical: Spacing.md,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    color: Colors.textPrimary,
  },
  tabContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  categoryScroll: {
    maxHeight: 40,
    marginBottom: Spacing.md,
  },
  categoryContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  categoryChipTextActive: {
    color: Colors.textPrimary,
  },
  summaryRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  summaryLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  listContainer: {
    paddingBottom: 180,
    paddingHorizontal: Spacing.lg,
  },
  dateGroup: {
    marginBottom: Spacing.lg,
  },
  dateHeader: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  transactionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  itemDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginHorizontal: Spacing.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.massive,
    gap: Spacing.md,
  },
  emptyTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xl,
    color: Colors.textSecondary,
  },
  emptySubtext: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    paddingTop: Spacing.lg,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    gap: Spacing.md,
  },
  newLedgerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  newLedgerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newLedgerTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  newLedgerSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  quickAddBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  quickAddText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
});

export default LedgerScreen;
