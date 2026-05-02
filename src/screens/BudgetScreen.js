// Sovereign Ledger — Cross-Platform Budget Screen
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontFamily } from '../theme/typography';
import { useAppContext } from '../context/AppContext';
import BudgetCard from '../components/BudgetCard';
import TransactionItem from '../components/TransactionItem';
import AnimatedScreen, { AnimatedItem } from '../components/animated/AnimatedScreen';
import dayjs from 'dayjs';
import useResponsiveLayout from '../hooks/useResponsiveLayout';

const BudgetScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { budgets, transactions, currency, colors, themeMode } = useAppContext();
  const layout = useResponsiveLayout();
  const [activeTab, setActiveTab] = useState('All');
  
  // Dynamically generate tabs based on the user's actual budget categories
  const tabs = ['All', ...new Set(budgets.map(b => b.category))];

  const filteredBudgets = budgets.filter(budget => 
    activeTab === 'All' || budget.category.toLowerCase() === activeTab.toLowerCase()
  );

  const tabTransactions = (transactions || [])
    .filter(t => t.type === 'expense')
    .filter(t => activeTab === 'All' || t.category.toLowerCase() === activeTab.toLowerCase())
    .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
    .slice(0, 10); // Show recent history for the tab

  return (
    <AnimatedScreen animation="fadeSlideUp">
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: layout.isDesktopLayout ? 20 : insets.top }]}>
        <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />

        <View style={styles.header}>
          {!layout.isDesktopLayout && (
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack?.()}>
              <Ionicons name="chevron-back" size={24} color={colors.secondary} />
            </TouchableOpacity>
          )}
          <Text style={[styles.title, { color: colors.secondary }]}>Allocation</Text>
          <View style={{ width: layout.isDesktopLayout ? 0 : 44 }} />
        </View>

        <View style={styles.tabContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
            {tabs.map((tab, i) => (
              <AnimatedItem key={tab} index={i}>
                <TouchableOpacity
                  onPress={() => setActiveTab(tab)}
                  style={[styles.tab, activeTab === tab && { backgroundColor: colors.secondary }]}
                  accessibilityRole="tab"
                >
                  <Text style={[styles.tabText, activeTab === tab ? { color: colors.background } : { color: colors.textSecondary }]}>{tab}</Text>
                </TouchableOpacity>
              </AnimatedItem>
            ))}
          </ScrollView>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          style={{ flex: 1 }}
          contentContainerStyle={[
            styles.scrollContent, 
            { 
              paddingHorizontal: layout.containerPadding,
              maxWidth: layout.maxContentWidth || 1200,
              width: '100%',
              alignSelf: 'center'
            }
          ]}
        >
          <View style={styles.listContainer}>
            {filteredBudgets.length > 0 ? (
              filteredBudgets.map((budget, i) => (
                <AnimatedItem key={budget.id} index={i}>
                  <BudgetCard budget={budget} currency={currency} navigation={navigation} />
                </AnimatedItem>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="wallet-outline" size={64} color="#D1D5DB" />
                <Text style={[styles.emptyTitle, { color: colors.secondary }]}>No Allocations</Text>
                <Text style={styles.emptySubtitle}>Track your spending by setting up allocations.</Text>
              </View>
            )}

            <AnimatedItem index={budgets.length + 1}>
              <TouchableOpacity
                style={[styles.newAllocationCard, { backgroundColor: colors.surface }]}
                onPress={() => navigation?.navigate?.('AddTransaction')}
                accessibilityRole="button"
                accessibilityLabel="Create new allocation"
              >
                <View style={styles.newIconContainer}>
                  <Ionicons name="add" size={24} color={colors.secondary} />
                </View>
                <Text style={[styles.newAllocationText, { color: colors.secondary }]}>New Allocation</Text>
              </TouchableOpacity>
            </AnimatedItem>

            {/* Display Category History directly on the budget page */}
            {tabTransactions.length > 0 && (
              <AnimatedItem index={budgets.length + 2}>
                <View style={styles.historySection}>
                  <Text style={[styles.historyTitle, { color: colors.secondary }]}>
                    {activeTab === 'All' ? 'Recent Expenses' : `${activeTab} History`}
                  </Text>
                  <View style={[styles.historyCard, { backgroundColor: colors.surface, borderColor: themeMode === 'dark' ? colors.border : '#F3F4F6' }]}>
                    {tabTransactions.map((t, idx) => (
                      <View key={t.id}>
                        <TransactionItem transaction={t} currency={currency} />
                        {idx < tabTransactions.length - 1 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
                      </View>
                    ))}
                  </View>
                </View>
              </AnimatedItem>
            )}
          </View>
        </ScrollView>
      </View>
    </AnimatedScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16 },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: FontFamily.bold, fontSize: 18 },
  tabContainer: { paddingVertical: 12 },
  tabScroll: { paddingHorizontal: 24, gap: 12 },
  tab: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F3F4F6' },
  tabText: { fontFamily: FontFamily.bold, fontSize: 13 },
  scrollContent: { paddingBottom: 100 },
  listContainer: {},
  emptyContainer: { alignItems: 'center', paddingVertical: 80, gap: 8 },
  emptyTitle: { fontFamily: FontFamily.bold, fontSize: 18, marginTop: 16 },
  emptySubtitle: { fontFamily: FontFamily.regular, fontSize: 14, color: '#9CA3AF', textAlign: 'center' },
  newAllocationCard: {
    borderRadius: 24, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#F3F4F6', marginTop: 12, gap: 12,
  },
  newIconContainer: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  newAllocationText: { fontFamily: FontFamily.bold, fontSize: 16 },
  historySection: { marginTop: 32, marginBottom: 20 },
  historyTitle: { fontFamily: FontFamily.bold, fontSize: 18, marginBottom: 12 },
  historyCard: { borderRadius: 24, paddingVertical: 12, borderWidth: 1, overflow: 'hidden' },
  divider: { height: 1, marginHorizontal: 24 },
});

export default BudgetScreen;
