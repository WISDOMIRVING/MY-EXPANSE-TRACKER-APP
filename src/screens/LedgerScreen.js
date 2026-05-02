// Sovereign Ledger — Cross-Platform Ledger/Wallet Screen
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontFamily } from '../theme/typography';
import { Shadow } from '../theme/spacing';
import { useAppContext } from '../context/AppContext';
import TransactionItem from '../components/TransactionItem';
import ContextMenu from '../components/desktop/ContextMenu';
import AnimatedScreen, { AnimatedItem } from '../components/animated/AnimatedScreen';
import useResponsiveLayout from '../hooks/useResponsiveLayout';
import dayjs from 'dayjs';

const LedgerScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { transactions, currency, colors, themeMode } = useAppContext();
  const layout = useResponsiveLayout();
  const category = route?.params?.category;

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    let filtered = transactions;
    if (category) {
      filtered = filtered.filter(t => t.category.toLowerCase() === category.toLowerCase());
    }
    return filtered.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());
  }, [transactions, category]);

  const groupedTransactions = useMemo(() => {
    const groups = {};
    filteredTransactions.forEach(t => {
      const date = dayjs(t.date);
      let dateKey;
      if (date.isSame(dayjs(), 'day')) dateKey = 'Today';
      else if (date.isSame(dayjs().subtract(1, 'day'), 'day')) dateKey = 'Yesterday';
      else dateKey = date.format('DD MMM YYYY');
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(t);
    });
    return Object.entries(groups);
  }, [filteredTransactions]);

  const contextMenuItems = [
    { label: 'Add Transaction', icon: 'add-circle-outline', action: 'add' },
    { label: 'Filter by Category', icon: 'filter-outline', action: 'filter' },
    { type: 'separator' },
    { label: 'Export Ledger', icon: 'download-outline', action: 'export' },
  ];

  return (
    <ContextMenu menuItems={contextMenuItems} onAction={() => {}} colors={colors}>
      <AnimatedScreen animation="fadeSlideUp">
        <View style={[styles.container, { backgroundColor: colors.background, paddingTop: layout.isDesktopLayout ? 20 : insets.top }]}>
          <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />

          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation?.goBack?.()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color={colors.secondary} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.secondary }]}>
              {category ? `${category} Ledgers` : 'Wallet'}
            </Text>
            <View style={{ width: 44 }} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            contentContainerStyle={[
              styles.listContainer, 
              { 
                paddingHorizontal: layout.containerPadding,
                maxWidth: layout.maxContentWidth || 1200,
                width: '100%',
                alignSelf: 'center'
              }
            ]}
          >
            {groupedTransactions.length > 0 ? (
              groupedTransactions.map(([dateKey, items], gi) => (
                <View key={dateKey} style={styles.dateGroup}>
                  <View style={styles.transactionList}>
                    {items.map((transaction, ti) => (
                      <AnimatedItem key={transaction.id} index={gi * 3 + ti}>
                        <TransactionItem transaction={transaction} currency={currency} />
                      </AnimatedItem>
                    ))}
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="receipt-outline" size={64} color="#D1D5DB" />
                <Text style={[styles.emptyTitle, { color: colors.secondary }]}>No Transactions</Text>
                <Text style={styles.emptySubtitle}>No transactions found for this ledger.</Text>
              </View>
            )}

            <AnimatedItem index={10}>
              <View style={styles.footerInfo}>
                <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <View style={[styles.infoIconContainer, { backgroundColor: themeMode === 'dark' ? 'rgba(255,255,255,0.05)' : '#F3F4F6' }]}>
                    <Ionicons name="book-outline" size={24} color={colors.secondary} />
                  </View>
                  <Text style={[styles.infoTitle, { color: colors.secondary }]}>New Ledger</Text>
                  <Text style={styles.infoSubtitle}>Keep track of every single ledger</Text>
                </View>

                <TouchableOpacity
                  style={[styles.quickAddBtn, { backgroundColor: colors.secondary }]}
                  onPress={() => navigation?.navigate?.('AddTransaction', { type: 'expense', category })}
                  accessibilityRole="button"
                >
                  <Text style={styles.quickAddText}>Quick Add</Text>
                </TouchableOpacity>
              </View>
            </AnimatedItem>
          </ScrollView>
        </View>
      </AnimatedScreen>
    </ContextMenu>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16 },
  backBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: FontFamily.bold, fontSize: 18 },
  listContainer: { paddingBottom: 40 },
  dateGroup: { marginBottom: 8 },
  transactionList: {},
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 100, gap: 8 },
  emptyTitle: { fontFamily: FontFamily.bold, fontSize: 18, marginTop: 16 },
  emptySubtitle: { fontFamily: FontFamily.regular, fontSize: 14, color: '#9CA3AF' },
  footerInfo: { paddingHorizontal: 0, marginTop: 20, alignItems: 'center' },
  infoCard: { width: '100%', borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 20, borderWidth: 1 },
  infoIconContainer: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  infoTitle: { fontFamily: FontFamily.bold, fontSize: 16, marginBottom: 4 },
  infoSubtitle: { fontFamily: FontFamily.medium, fontSize: 13, color: '#9CA3AF', textAlign: 'center' },
  quickAddBtn: { width: '100%', height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', ...Shadow.medium },
  quickAddText: { color: '#FFF', fontFamily: FontFamily.bold, fontSize: 16 },
});

export default LedgerScreen;
