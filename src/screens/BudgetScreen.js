// Sovereign Ledger — Pixel Perfect Budget Screen
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';
import { useAppContext } from '../context/AppContext';
import BudgetCard from '../components/BudgetCard';

const FILTER_TABS = [
  { value: 'All', label: 'All' },
  { value: 'Food', label: 'Food' },
  { value: 'Travel', label: 'Travel' },
  { value: 'Shop', label: 'Shop' },
  { value: 'Home', label: 'Home' },
];

const BudgetScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { budgets, currency, colors, themeMode } = useAppContext();
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredBudgets = activeFilter === 'All' 
    ? (budgets || []) 
    : (budgets || []).filter(b => b.category === activeFilter);

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
        <View style={styles.logoRow}>
          <View style={[styles.gemIcon, { backgroundColor: colors.primaryFaded }]}>
            <Ionicons name="diamond" size={16} color={colors.primary} />
          </View>
          <Text style={[styles.appName, dynamicStyles.textPrimary]}>Sovereign Ledger</Text>
        </View>
        <TouchableOpacity style={[styles.notifBtn, dynamicStyles.surface]}>
          <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab.value;
            return (
              <TouchableOpacity key={tab.value} style={[styles.filterChip, isActive && { backgroundColor: colors.primaryFaded }]} onPress={() => setActiveFilter(tab.value)}>
                <Text style={[styles.filterText, dynamicStyles.textSecondary, isActive && { color: colors.primary, fontFamily: FontFamily.bold }]}>{tab.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
        {filteredBudgets.length > 0 ? (
          filteredBudgets.map((budget) => (
            <BudgetCard key={budget.id} budget={budget} currency={currency} />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="wallet-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, dynamicStyles.textSecondary]}>No Budgets Found</Text>
            <Text style={[styles.emptySubtitle, dynamicStyles.textMuted]}>Add a new allocation to get started</Text>
          </View>
        )}

        <TouchableOpacity style={[styles.newAllocationBtn, dynamicStyles.surface]} onPress={() => navigation.navigate('AddTransaction')}>
          <View style={[styles.newAllocationIcon, { backgroundColor: colors.primaryFaded }]}>
            <Ionicons name="add-circle" size={24} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.newAllocationTitle, dynamicStyles.textPrimary]}>New Allocation</Text>
            <Text style={[styles.newAllocationSubtitle, dynamicStyles.textSecondary]}>Record a new allocation</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  gemIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  appName: { fontFamily: FontFamily.bold, fontSize: FontSize.lg },
  notifBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  tabContainer: { marginBottom: Spacing.lg },
  filterScroll: { paddingHorizontal: Spacing.xl, gap: Spacing.md },
  filterChip: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.sm, borderRadius: 8 },
  filterText: { fontFamily: FontFamily.medium, fontSize: 13 },
  listContainer: { paddingHorizontal: Spacing.xl, paddingBottom: 120 },
  emptyContainer: { alignItems: 'center', paddingVertical: Spacing.massive, gap: Spacing.sm },
  emptyTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.xl },
  emptySubtitle: { fontFamily: FontFamily.regular, fontSize: FontSize.md },
  newAllocationBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, borderRadius: BorderRadius.xl, padding: Spacing.lg, borderWidth: 1, marginTop: Spacing.lg },
  newAllocationIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  newAllocationTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.md },
  newAllocationSubtitle: { fontFamily: FontFamily.regular, fontSize: 12 },
});

export default BudgetScreen;
