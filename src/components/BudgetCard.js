// Sovereign Ledger — Pixel Perfect Budget Card
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing, BorderRadius, Shadow } from '../theme/spacing';
import { formatCurrency } from '../utils/currency';
import { getCategoryIcon, getCategoryBg, getCategoryColor } from './CategoryIcon';
import { useAppContext } from '../context/AppContext';

const BudgetCard = ({ budget, currency, navigation }) => {
  const { colors } = useAppContext();
  const { category, limit, spent, percentage } = budget;

  const remainingPercent = 100 - percentage;
  const isCritical = remainingPercent < 20; // Example logic for red
  const isHealthy = percentage < 70; // Example logic for green

  const statusColor = isCritical ? '#EF4444' : isHealthy ? '#10B981' : '#1B2141';
  const statusLabel = isCritical ? `${Math.round(remainingPercent)}% left` : `${Math.round(percentage)}% spent`;

  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={() => navigation.navigate('Ledger', { category })}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={styles.header}>
        <View style={styles.leftHeader}>
          <View style={[styles.iconContainer, { backgroundColor: getCategoryBg(category) }]}>
            <Ionicons name={getCategoryIcon(category)} size={20} color={getCategoryColor(category)} />
          </View>
          <View style={styles.titleSection}>
            <Text style={[styles.categoryName, { color: colors.secondary }]}>{category}</Text>
            <View style={styles.amountRow}>
              <Text style={[styles.spentAmount, { color: colors.secondary }]}>
                {formatCurrency(spent, currency)}
              </Text>
              <Text style={styles.statusLabel}> / {statusLabel}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={[styles.progressTrack, { backgroundColor: '#F3F4F6' }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${Math.min(100, percentage)}%`, 
                backgroundColor: statusColor 
              }
            ]} 
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    ...Shadow.small,
  },
  header: {
    marginBottom: 16,
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleSection: {
    flex: 1,
    gap: 4,
  },
  categoryName: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  spentAmount: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
  },
  statusLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: '#9CA3AF',
  },
  progressSection: {
    marginTop: 8,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default BudgetCard;
