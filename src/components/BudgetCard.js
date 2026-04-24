// Sovereign Ledger — Pixel Perfect Budget Card
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing, BorderRadius, Shadow } from '../theme/spacing';
import { formatCurrency } from '../utils/currency';
import { getCategoryIcon } from './CategoryIcon';
import { useAppContext } from '../context/AppContext';

const BudgetCard = ({ budget, currency, onDelete }) => {
  const { colors } = useAppContext();
  const { category, limit, spent, remaining, percentage } = budget;

  const isAtLimit = percentage >= 100;
  const isWarning = percentage >= 80 && percentage < 100;
  
  const statusColor = isAtLimit ? colors.danger : isWarning ? colors.warning : colors.success;
  const statusLabel = isAtLimit ? 'AT LIMIT' : isWarning ? 'WARNING' : 'HEALTHY';

  const categoryColor = colors[category.toLowerCase()] || colors.primary;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={styles.leftHeader}>
          <View style={[styles.iconContainer, { backgroundColor: categoryColor + '15' }]}>
            <Ionicons name={getCategoryIcon(category)} size={22} color={categoryColor} />
          </View>
          <View style={styles.titleSection}>
            <Text style={[styles.categoryName, { color: colors.textPrimary }]}>{category}</Text>
            <View style={styles.amountRow}>
              <Text style={[styles.amount, { color: colors.textPrimary }]}>{formatCurrency(spent, currency)}</Text>
              <Text style={[styles.limit, { color: colors.textMuted }]}> / {formatCurrency(limit, currency)}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressTextRow}>
          <Text style={[styles.progressPercent, { color: colors.textSecondary }]}>USED {Math.round(percentage)}%</Text>
          <Text style={[styles.remainingText, { color: statusColor }]}>{formatCurrency(remaining, currency)} LEFT</Text>
        </View>
        <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
          <View style={[styles.progressFill, { width: `${Math.min(100, percentage)}%`, backgroundColor: statusColor }]} />
        </View>
      </View>

      <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
        <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    ...Shadow.small,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
  },
  leftHeader: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleSection: {
    gap: 2,
  },
  categoryName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  amount: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
  },
  limit: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
  },
  statusText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  progressSection: {
    gap: Spacing.sm,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressPercent: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  remainingText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  deleteBtn: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    padding: Spacing.xs,
  },
});

export default BudgetCard;
