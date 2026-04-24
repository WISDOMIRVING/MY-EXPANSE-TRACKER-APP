// Sovereign Ledger — Balance Card Component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing, BorderRadius, Shadow } from '../theme/spacing';
import { formatCurrency } from '../utils/currency';

const BalanceCard = ({ balance, income, expenses, currency }) => {
  return (
    <View style={styles.container}>
      {/* Main Balance */}
      <View style={styles.balanceSection}>
        <Text style={styles.balanceLabel}>Main Savings</Text>
        <Text style={styles.balanceAmount}>
          {formatCurrency(balance, currency)}
        </Text>
      </View>

      {/* Income / Expense Row */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconRow}>
            <View style={[styles.iconCircle, { backgroundColor: Colors.successFaded }]}>
              <Ionicons name="trending-up" size={14} color={Colors.success} />
            </View>
            <Text style={styles.summaryLabel}>Income</Text>
          </View>
          <Text style={[styles.summaryAmount, { color: Colors.success }]}>
            +{formatCurrency(income, currency)}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryCard}>
          <View style={styles.summaryIconRow}>
            <View style={[styles.iconCircle, { backgroundColor: Colors.dangerFaded }]}>
              <Ionicons name="trending-down" size={14} color={Colors.danger} />
            </View>
            <Text style={styles.summaryLabel}>Expenses</Text>
          </View>
          <Text style={[styles.summaryAmount, { color: Colors.danger }]}>
            -{formatCurrency(expenses, currency)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: Spacing.xxl,
    marginHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.medium,
  },
  balanceSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    gap: Spacing.xs,
  },
  balanceLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  balanceAmount: {
    fontFamily: FontFamily.bold,
    fontSize: 34,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  summaryCard: {
    flex: 1,
    gap: Spacing.sm,
  },
  summaryIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  summaryAmount: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    marginLeft: 36,
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
});

export default BalanceCard;
