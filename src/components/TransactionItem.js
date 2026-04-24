// Sovereign Ledger — Transaction Item Component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';
import CategoryIcon, { getCategoryColor } from './CategoryIcon';
import { formatCurrency } from '../utils/currency';
import dayjs from 'dayjs';

const TransactionItem = ({ transaction, currency, onPress, showDate = true }) => {
  const { type, amount, category, description, date, isRecurring } = transaction;
  const isIncome = type === 'income';
  const amountColor = isIncome ? Colors.success : Colors.danger;
  const amountSign = isIncome ? '+' : '-';

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress && onPress(transaction)}
      activeOpacity={0.7}
    >
      <CategoryIcon category={category} size={42} iconSize={20} />
      
      <View style={styles.info}>
        <Text style={styles.description} numberOfLines={1}>
          {description || category}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.category}>{category}</Text>
          {isRecurring && (
            <View style={styles.recurringBadge}>
              <Ionicons name="repeat" size={10} color={Colors.primary} />
              <Text style={styles.recurringText}>Recurring</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: amountColor }]}>
          {amountSign}{formatCurrency(amount, currency)}
        </Text>
        {showDate && (
          <Text style={styles.date}>
            {dayjs(date).format('MMM DD')}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  info: {
    flex: 1,
    gap: Spacing.xxs,
  },
  description: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  category: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  recurringBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.primaryFaded,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  recurringText: {
    fontFamily: FontFamily.medium,
    fontSize: 9,
    color: Colors.primary,
  },
  amountContainer: {
    alignItems: 'flex-end',
    gap: Spacing.xxs,
  },
  amount: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    letterSpacing: 0.3,
  },
  date: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});

export default TransactionItem;
