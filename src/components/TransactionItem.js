// Sovereign Ledger — Pixel Perfect Transaction Item
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing } from '../theme/spacing';
import { formatCurrency } from '../utils/currency';
import { getCategoryIcon, getCategoryBg, getCategoryColor } from './CategoryIcon';
import { useAppContext } from '../context/AppContext';
import dayjs from 'dayjs';

const TransactionItem = ({ transaction, currency }) => {
  const { colors, themeMode } = useAppContext();
  const { type, amount, category, description, date } = transaction;

  const isExpense = type === 'expense';
  const categoryColor = getCategoryColor(category);

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: getCategoryBg(category, themeMode) }]}>
        <Ionicons name={getCategoryIcon(category)} size={22} color={categoryColor} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.leftContent}>
          <Text style={[styles.title, { color: colors.secondary }]} numberOfLines={1}>
            {description || category}
          </Text>
          <View style={styles.subtitleRow}>
            <Text style={styles.categoryLabel}>{category.toUpperCase()}</Text>
            <Text style={styles.dot}> • </Text>
            <Text style={styles.timeLabel}>{dayjs(date).format('h:mm A')}</Text>
          </View>
        </View>
        
        <View style={styles.rightContent}>
          <Text style={[styles.amount, { color: isExpense ? colors.danger : colors.success }]}>
            {isExpense ? '-' : '+'}{formatCurrency(amount, currency)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10, // Half of the 20px gap between items
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 16,
  },
  leftContent: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    marginBottom: 2,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  dot: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  timeLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: '#9CA3AF',
  },
  rightContent: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amount: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
  },
});

export default TransactionItem;
