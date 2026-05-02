// Sovereign Ledger — Pixel Perfect Balance Card
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing, BorderRadius, Shadow } from '../theme/spacing';
import { formatCurrency } from '../utils/currency';
import { useAppContext } from '../context/AppContext';

const { width } = Dimensions.get('window');

const BalanceCard = ({ balance, currency }) => {
  const { colors } = useAppContext();

  return (
    <View style={[styles.card, { backgroundColor: colors.secondary }]}>
      {/* Abstract Design Elements */}
      <View style={styles.decorCircle} />
      
      <View style={styles.content}>
        <Text style={styles.label}>Total Balance</Text>
        <Text style={styles.balanceText}>
          {formatCurrency(balance, currency)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.xl,
    borderRadius: 24,
    height: 140,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
    overflow: 'hidden',
    ...Shadow.medium,
  },
  decorCircle: {
    position: 'absolute',
    right: -40,
    top: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  content: {
    gap: 8,
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  balanceText: {
    fontFamily: FontFamily.bold,
    fontSize: 32,
    color: '#FFFFFF',
  },
});

export default BalanceCard;
