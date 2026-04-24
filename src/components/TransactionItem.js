// Sovereign Ledger — Pixel Perfect Transaction Item
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing } from '../theme/spacing';
import { formatCurrency } from '../utils/currency';
import { getCategoryIcon } from './CategoryIcon';
import { useAppContext } from '../context/AppContext';
import dayjs from 'dayjs';

const TransactionItem = ({ transaction, currency }) => {
  const { colors } = useAppContext();
  const { type, amount, category, description, date } = transaction;

  const isExpense = type === 'expense';
  const categoryColor = colors[category.toLowerCase()] || colors.primary;

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: categoryColor + '15' }]}>
        <Ionicons name={getCategoryIcon(category)} size={20} color={categoryColor} />
      </View>
      <View style={styles.content}>
        <View style={styles.leftContent}>
          <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
            {description || category}
          </Text>
          <View style={styles.metaRow}>
            <Text style={[styles.category, { color: colors.textSecondary }]}>{category}</Text>
            {transaction.isRecurring && (
              <>
                <Text style={[styles.dot, { color: colors.textMuted }]}>•</Text>
                <Ionicons name="repeat" size={12} color={colors.primary} />
                <Text style={[styles.recurringLabel, { color: colors.primary }]}>{transaction.recurringInterval}</Text>
              </>
            )}
            <Text style={[styles.dot, { color: colors.textMuted }]}>•</Text>
            <Text style={[styles.time, { color: colors.textSecondary }]}>{dayjs(date).format('h:mm A')}</Text>
          </View>
        </View>
        <View style={styles.rightContent}>
          <Text style={[styles.amount, { color: isExpense ? colors.danger : colors.success }]}>
            {isExpense ? '-' : '+'}{formatCurrency(amount, currency)}
          </Text>
          <Text style={[styles.date, { color: colors.textMuted }]}>{dayjs(date).format('MMM DD')}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  category: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
  },
  dot: {
    fontSize: 10,
  },
  time: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
  },
  recurringLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  rightContent: {
    alignItems: 'flex-end',
    gap: 2,
  },
  amount: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
  },
  date: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    textTransform: 'uppercase',
  },
});

export default TransactionItem;
