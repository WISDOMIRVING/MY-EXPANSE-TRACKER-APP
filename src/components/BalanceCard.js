// Sovereign Ledger — Balance Overview Card
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing, BorderRadius, Shadow } from '../theme/spacing';
import { formatCurrency } from '../utils/currency';
import { useAppContext } from '../context/AppContext';

const { width } = Dimensions.get('window');

const BalanceCard = ({ balance, income, expenses, currency }) => {
  const { colors } = useAppContext();

  return (
    <View style={[styles.card, { backgroundColor: colors.primary }]}>
      {/* Background Decor */}
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />

      <View style={styles.cardHeader}>
        <Text style={styles.label}>TOTAL BALANCE</Text>
        <View style={styles.securityBadge}>
          <Ionicons name="shield-checkmark" size={12} color="#FFFFFF" />
          <Text style={styles.securityText}>SECURE</Text>
        </View>
      </View>

      <Text style={styles.balanceText}>
        {formatCurrency(balance, currency)}
      </Text>

      <View style={styles.divider} />

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <Ionicons name="arrow-down-circle" size={20} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.statLabel}>INCOME</Text>
            <Text style={styles.statValue}>{formatCurrency(income, currency)}</Text>
          </View>
        </View>

        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <Ionicons name="arrow-up-circle" size={20} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.statLabel}>EXPENSES</Text>
            <Text style={styles.statValue}>{formatCurrency(expenses, currency)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.xl,
    borderRadius: 24,
    padding: Spacing.xl,
    height: 200,
    justifyContent: 'space-between',
    overflow: 'hidden',
    ...Shadow.medium,
  },
  decorCircle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -30,
    left: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  securityText: {
    fontFamily: FontFamily.bold,
    fontSize: 8,
    color: '#FFFFFF',
  },
  balanceText: {
    fontFamily: FontFamily.bold,
    fontSize: 36,
    color: '#FFFFFF',
    marginTop: Spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginVertical: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 0.5,
  },
  statValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: '#FFFFFF',
  },
});

export default BalanceCard;
