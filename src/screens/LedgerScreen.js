// Sovereign Ledger — Pixel Perfect Ledger Screen
import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing, BorderRadius, Shadow } from '../theme/spacing';
import { useAppContext } from '../context/AppContext';
import TransactionItem from '../components/TransactionItem';
import dayjs from 'dayjs';

const LedgerScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { transactions, currency, colors, themeMode } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    let filtered = transactions;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.category.toLowerCase().includes(query) || 
        (t.description && t.description.toLowerCase().includes(query))
      );
    }

    return filtered.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());
  }, [transactions, searchQuery]);

  const groupedTransactions = useMemo(() => {
    const groups = {};
    filteredTransactions.forEach(t => {
      const dateKey = dayjs(t.date).format('MMM DD, YYYY');
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(t);
    });
    return Object.entries(groups);
  }, [filteredTransactions]);

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
        <Text style={[styles.title, dynamicStyles.textPrimary]}>Ledger</Text>
        <TouchableOpacity style={[styles.filterBtn, dynamicStyles.surface]}>
          <Ionicons name="options-outline" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, dynamicStyles.surface]}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search records..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
        {groupedTransactions.length > 0 ? (
          groupedTransactions.map(([dateKey, items]) => (
            <View key={dateKey} style={styles.dateGroup}>
              <Text style={[styles.dateHeader, { color: colors.textMuted }]}>{dateKey.split(',')[0].toUpperCase()}</Text>
              <View style={[styles.transactionCard, dynamicStyles.surface]}>
                {items.map((transaction, idx) => (
                  <View key={transaction.id}>
                    <TransactionItem transaction={transaction} currency={currency} />
                    {idx < items.length - 1 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
                  </View>
                ))}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, dynamicStyles.textSecondary]}>No Records Found</Text>
          </View>
        )}
      </ScrollView>

      <View style={[styles.bottomActions, { paddingBottom: insets.bottom + Spacing.lg }]}>
        <TouchableOpacity style={[styles.quickAddBtn, { backgroundColor: colors.primary }]} onPress={() => navigation.navigate('AddTransaction')}>
          <Ionicons name="receipt-outline" size={20} color="#FFF" />
          <Text style={styles.quickAddText}>Quick Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  title: { fontFamily: FontFamily.bold, fontSize: 28 },
  filterBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  searchContainer: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, height: 48, borderRadius: 12, borderWidth: 1, gap: Spacing.sm },
  searchInput: { flex: 1, fontFamily: FontFamily.medium, fontSize: FontSize.md },
  listContainer: { paddingHorizontal: Spacing.xl, paddingBottom: 160 },
  dateGroup: { marginBottom: Spacing.xl },
  dateHeader: { fontFamily: FontFamily.bold, fontSize: 10, letterSpacing: 1, marginBottom: Spacing.md },
  transactionCard: { borderRadius: BorderRadius.xl, borderWidth: 1, overflow: 'hidden', ...Shadow.small },
  divider: { height: 1, marginHorizontal: Spacing.lg },
  emptyContainer: { alignItems: 'center', paddingVertical: Spacing.massive, gap: Spacing.sm },
  emptyTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.xl },
  bottomActions: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg },
  quickAddBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, borderRadius: BorderRadius.md, paddingVertical: Spacing.xl, ...Shadow.medium },
  quickAddText: { color: '#FFF', fontFamily: FontFamily.bold, fontSize: FontSize.lg },
});

export default LedgerScreen;
