// Sovereign Ledger — Budget Card Component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';
import { getCategoryColor, getCategoryIcon } from './CategoryIcon';
import { formatCurrency } from '../utils/currency';

const BudgetCard = ({ budget, currency, onPress }) => {
  const { category, limit, spent, remaining, percentage, status, period } = budget;
  const categoryColor = getCategoryColor(category);
  const categoryIcon = getCategoryIcon(category);

  const getStatusConfig = () => {
    if (status === 'over') {
      return { label: 'AT LIMIT', color: Colors.danger, bgColor: Colors.dangerFaded };
    }
    if (status === 'warning') {
      return { label: `${Math.round(percentage)}%`, color: Colors.warning, bgColor: Colors.warningFaded };
    }
    return { label: 'HEALTHY', color: Colors.success, bgColor: Colors.successFaded };
  };

  const statusConfig = getStatusConfig();
  const progressWidth = Math.min(percentage, 100);

  const getPeriodLabel = () => {
    const labels = { weekly: 'This Week', monthly: 'This Month', yearly: 'This Year' };
    return labels[period] || 'This Month';
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress && onPress(budget)}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${categoryColor}20` }]}>
          <Ionicons name={categoryIcon} size={18} color={categoryColor} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.categoryName}>{category}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
        </View>
      </View>

      {/* Amount */}
      <View style={styles.amountRow}>
        <Text style={styles.spentAmount}>
          {formatCurrency(spent, currency)}
        </Text>
        <Text style={styles.limitAmount}>
          {' / '}{formatCurrency(limit, currency)}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${progressWidth}%`,
              backgroundColor: statusConfig.color,
            },
          ]}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.remainingText}>
          {formatCurrency(remaining, currency)} LEFT
        </Text>
        <Text style={styles.periodText}>
          {getPeriodLabel().toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.xs,
  },
  statusText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    letterSpacing: 0.5,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.sm,
  },
  spentAmount: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    color: Colors.textPrimary,
  },
  limitAmount: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  progressTrack: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remainingText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  periodText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
});

export default BudgetCard;
