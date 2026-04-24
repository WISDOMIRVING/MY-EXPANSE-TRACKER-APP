// Sovereign Ledger — Dashboard Screen (Home Tab)
import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing, BorderRadius, Shadow } from '../theme/spacing';
import { useAppContext } from '../context/AppContext';
import { formatCurrency } from '../utils/currency';
import BalanceCard from '../components/BalanceCard';
import TransactionItem from '../components/TransactionItem';
import dayjs from 'dayjs';

const DashboardScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const {
    transactions, balance, totalIncome, totalExpenses, currency, budgets,
  } = useAppContext();

  // Get recent 5 transactions sorted by date
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
      .slice(0, 5);
  }, [transactions]);

  // Top spending category this month
  const topCategory = useMemo(() => {
    const thisMonth = dayjs().startOf('month');
    const monthExpenses = transactions.filter(
      t => t.type === 'expense' && dayjs(t.date).isAfter(thisMonth)
    );
    const categoryTotals = {};
    monthExpenses.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
    const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? { name: sorted[0][0], amount: sorted[0][1] } : null;
  }, [transactions]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoRow}>
            <View style={styles.gemIcon}>
              <Ionicons name="diamond" size={16} color={Colors.primary} />
            </View>
            <Text style={styles.appName}>Sovereign Ledger</Text>
          </View>
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AS</Text>
            </View>
            <View>
              <Text style={styles.userName}>Alexander Sterling</Text>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>protected</Text>
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.notifBtn}>
          <Ionicons name="notifications-outline" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Balance Card */}
        <BalanceCard
          balance={balance}
          income={totalIncome}
          expenses={totalExpenses}
          currency={currency}
        />

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={() => navigation.navigate('AddTransaction', { type: 'expense' })}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: Colors.dangerFaded }]}>
              <Ionicons name="arrow-up" size={18} color={Colors.danger} />
            </View>
            <Text style={styles.quickActionText}>Expense</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={() => navigation.navigate('AddTransaction', { type: 'income' })}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: Colors.successFaded }]}>
              <Ionicons name="arrow-down" size={18} color={Colors.success} />
            </View>
            <Text style={styles.quickActionText}>Income</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={() => navigation.navigate('BudgetTab')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: Colors.primaryFaded }]}>
              <Ionicons name="wallet" size={18} color={Colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Budget</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={() => navigation.navigate('AnalyticsTab')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(242, 201, 76, 0.15)' }]}>
              <Ionicons name="bar-chart" size={18} color="#F2C94C" />
            </View>
            <Text style={styles.quickActionText}>Analytics</Text>
          </TouchableOpacity>
        </View>

        {/* Budget Alerts */}
        {budgets.some(b => b.status === 'warning' || b.status === 'over') && (
          <View style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <Ionicons name="alert-circle" size={18} color={Colors.warning} />
              <Text style={styles.alertTitle}>Budget Alert</Text>
            </View>
            {budgets
              .filter(b => b.status === 'warning' || b.status === 'over')
              .map(b => (
                <Text key={b.id} style={styles.alertText}>
                  {b.category}: {Math.round(b.percentage)}% of budget used
                </Text>
              ))
            }
          </View>
        )}

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('LedgerTab')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionList}>
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  currency={currency}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="receipt-outline" size={40} color={Colors.textMuted} />
                <Text style={styles.emptyText}>No transactions yet</Text>
                <Text style={styles.emptySubtext}>Tap + to add your first one</Text>
              </View>
            )}
          </View>
        </View>

        {/* Monthly Insight */}
        {topCategory && (
          <View style={styles.insightCard}>
            <View style={styles.insightIcon}>
              <Ionicons name="analytics" size={20} color={Colors.primary} />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Monthly Insight</Text>
              <Text style={styles.insightText}>
                Your top spending category is{' '}
                <Text style={{ color: Colors.primary, fontFamily: FontFamily.semiBold }}>
                  {topCategory.name}
                </Text>
                {' '}at {formatCurrency(topCategory.amount, currency)} this month
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
  },
  headerLeft: {
    gap: Spacing.md,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  gemIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  userName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  statusText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.success,
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.sm,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  quickActionBtn: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  alertCard: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.warningFaded,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(242, 153, 74, 0.3)',
    marginBottom: Spacing.lg,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  alertTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.warning,
  },
  alertText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginLeft: 26,
  },
  section: {
    marginTop: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
  },
  seeAllText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.primary,
  },
  transactionList: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: Spacing.xxxl,
    gap: Spacing.sm,
  },
  emptyText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
  },
  emptySubtext: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  insightCard: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    backgroundColor: Colors.primaryFaded,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(47, 124, 246, 0.2)',
    gap: Spacing.md,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(47, 124, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightContent: {
    flex: 1,
    gap: 4,
  },
  insightTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.primary,
  },
  insightText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});

export default DashboardScreen;
