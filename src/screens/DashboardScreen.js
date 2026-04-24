// Sovereign Ledger — Dashboard Screen (Home Tab)
import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing, BorderRadius, Shadow } from '../theme/spacing';
import { useAppContext } from '../context/AppContext';
import { formatCurrency } from '../utils/currency';
import { generateInsights } from '../utils/insights';
import BalanceCard from '../components/BalanceCard';
import TransactionItem from '../components/TransactionItem';
import dayjs from 'dayjs';
import i18n from '../utils/i18n';

const DashboardScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const {
    transactions, balance, totalIncome, totalExpenses, currency, budgets, colors, themeMode
  } = useAppContext();

  const recentTransactions = useMemo(() => {
    if (!transactions) return [];
    return [...transactions]
      .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
      .slice(0, 5);
  }, [transactions]);

  const insights = useMemo(() => {
    if (!transactions || !budgets) return [];
    return generateInsights(transactions, budgets);
  }, [transactions, budgets]);

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
        <View style={styles.headerLeft}>
          <View style={styles.logoRow}>
            <View style={[styles.gemIcon, { backgroundColor: colors.primaryFaded }]}>
              <Ionicons name="diamond" size={16} color={colors.primary} />
            </View>
            <Text style={[styles.appName, dynamicStyles.textPrimary]}>Sovereign Ledger</Text>
          </View>
          <View style={styles.userRow}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={[styles.avatarText, { color: '#FFF' }]}>AS</Text>
            </View>
            <View>
              <Text style={[styles.userName, dynamicStyles.textPrimary]}>Alexander Sterling</Text>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
                <Text style={[styles.statusText, { color: colors.success }]}>protected</Text>
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity style={[styles.notifBtn, dynamicStyles.surface]}>
          <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <BalanceCard balance={balance} income={totalIncome} expenses={totalExpenses} currency={currency} />

        <View style={styles.quickActions}>
          {[
            { label: 'Expense', icon: 'arrow-up', color: colors.danger, bg: colors.dangerFaded, screen: 'AddTransaction', params: { type: 'expense' } },
            { label: 'Income', icon: 'arrow-down', color: colors.success, bg: colors.successFaded, screen: 'AddTransaction', params: { type: 'income' } },
            { label: 'Budget', icon: 'wallet', color: colors.primary, bg: colors.primaryFaded, screen: 'BudgetTab' },
            { label: 'Analytics', icon: 'bar-chart', color: colors.warning, bg: colors.warningFaded, screen: 'AnalyticsTab' },
          ].map((action) => (
            <TouchableOpacity key={action.label} style={styles.quickActionBtn} onPress={() => navigation.navigate(action.screen, action.params)}>
              <View style={[styles.quickActionIcon, { backgroundColor: action.bg }]}>
                <Ionicons name={action.icon} size={18} color={action.color} />
              </View>
              <Text style={[styles.quickActionText, dynamicStyles.textSecondary]}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Local Intelligence Insights Section */}
        {insights.length > 0 && (
          <View style={styles.insightsSection}>
            <Text style={[styles.sectionTitle, dynamicStyles.textPrimary, { paddingHorizontal: Spacing.lg }]}>Smart Insights</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.insightsScroll}>
              {insights.map((insight, idx) => (
                <View key={idx} style={[styles.insightCard, dynamicStyles.surface, { borderLeftColor: insight.type === 'danger' ? colors.danger : insight.type === 'warning' ? colors.warning : colors.success, borderLeftWidth: 4 }]}>
                  <View style={styles.insightHeader}>
                    <Ionicons name={insight.icon} size={18} color={insight.type === 'danger' ? colors.danger : insight.type === 'warning' ? colors.warning : colors.success} />
                    <Text style={[styles.insightTitle, dynamicStyles.textPrimary]}>{insight.title}</Text>
                  </View>
                  <Text style={[styles.insightText, dynamicStyles.textSecondary]}>{insight.message}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, dynamicStyles.textPrimary]}>{i18n.t('recent_transactions')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('LedgerTab')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>{i18n.t('view_all')}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.transactionList, dynamicStyles.surface]}>
            {recentTransactions.length > 0 ? (
              recentTransactions.map((t) => <TransactionItem key={t.id} transaction={t} currency={currency} />)
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="receipt-outline" size={40} color={colors.textMuted} />
                <Text style={[styles.emptyText, dynamicStyles.textSecondary]}>{i18n.t('no_transactions')}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.xl },
  headerLeft: { gap: Spacing.md },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  gemIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  appName: { fontFamily: FontFamily.bold, fontSize: FontSize.xl },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: FontFamily.bold, fontSize: FontSize.md },
  userName: { fontFamily: FontFamily.semiBold, fontSize: FontSize.lg },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontFamily: FontFamily.regular, fontSize: FontSize.sm },
  notifBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, marginTop: Spacing.sm },
  quickActions: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.xl },
  quickActionBtn: { alignItems: 'center', gap: Spacing.sm },
  quickActionIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  quickActionText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm },
  insightsSection: { marginVertical: Spacing.md },
  insightsScroll: { paddingHorizontal: Spacing.lg, gap: Spacing.md, paddingBottom: Spacing.sm },
  insightCard: { width: 260, borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, ...Shadow.small },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  insightTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.md },
  insightText: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, lineHeight: 18 },
  section: { marginTop: Spacing.sm },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  sectionTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.xl },
  seeAllText: { fontFamily: FontFamily.medium, fontSize: FontSize.md },
  transactionList: { borderRadius: BorderRadius.lg, marginHorizontal: Spacing.lg, borderWidth: 1, overflow: 'hidden' },
  emptyContainer: { alignItems: 'center', padding: Spacing.xxxl, gap: Spacing.sm },
  emptyText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.lg },
});

export default DashboardScreen;
