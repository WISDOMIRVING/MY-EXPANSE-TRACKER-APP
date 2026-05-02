// Sovereign Ledger — Cross-Platform Dashboard with Responsive Layout & Animations
import React, { useMemo, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
  Dimensions, Animated, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing, BorderRadius, Shadow } from '../theme/spacing';
import { useAppContext } from '../context/AppContext';
import { formatCurrency } from '../utils/currency';
import TransactionItem from '../components/TransactionItem';
import ContextMenu from '../components/desktop/ContextMenu';
import AnimatedScreen, { AnimatedItem } from '../components/animated/AnimatedScreen';
import useResponsiveLayout from '../hooks/useResponsiveLayout';
import dayjs from 'dayjs';

const DashboardScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const {
    transactions, balance, totalIncome, totalExpenses, currency, colors, themeMode, dispatch, ACTIONS,
  } = useAppContext();
  const layout = useResponsiveLayout();

  // Animated balance counter
  const balanceAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(balanceAnim, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }).start();
  }, [balance]);

  const recentTransactions = useMemo(() => {
    if (!transactions) return [];
    return [...transactions]
      .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
      .slice(0, layout.isDesktopLayout ? 8 : 5);
  }, [transactions, layout.isDesktopLayout]);

  const paddingTop = layout.isDesktopLayout ? 0 : insets.top + 20;
  const heroHeight = layout.isDesktopLayout ? 200 : 280;

  const contextMenuItems = [
    { label: 'Add Transaction', icon: 'add-circle-outline', action: 'add' },
    { label: 'Export Data', icon: 'download-outline', action: 'export' },
    { type: 'separator' },
    { label: 'Toggle Theme', icon: 'moon-outline', action: 'theme' },
  ];

  const handleContextAction = (action) => {
    switch (action) {
      case 'add': navigation?.navigate?.('AddTransaction'); break;
      case 'theme': if (useAppContext) { /* handled via context */ } break;
    }
  };

  return (
    <ContextMenu menuItems={contextMenuItems} onAction={handleContextAction} colors={colors}>
      <AnimatedScreen animation="fadeSlideUp">
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <StatusBar barStyle="light-content" />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContent, 
              { 
                paddingHorizontal: layout.containerPadding,
                maxWidth: layout.maxContentWidth || 1200,
                width: '100%',
                alignSelf: 'center'
              }
            ]}
            style={styles.scrollView}
          >
            {/* HERO SECTION */}
            <View style={[styles.heroSection, {
              backgroundColor: colors.heroBackground || colors.secondary,
              paddingTop,
              height: heroHeight,
              borderBottomLeftRadius: layout.isDesktopLayout ? 24 : 32,
              borderBottomRightRadius: layout.isDesktopLayout ? 24 : 32,
              marginHorizontal: -layout.containerPadding, // Bleed out to edges
            }]}>
              <View style={styles.headerRow}>
                <View style={styles.userInfo}>
                  <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                    <Text style={styles.avatarText}>AS</Text>
                  </View>
                  <View>
                    <Text style={styles.greeting}>Good morning,</Text>
                    <Text style={styles.userName}>Alexander Sterling</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.notifBtn}>
                  <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
                  <View style={styles.notifDot} />
                </TouchableOpacity>
              </View>

              <Animated.View style={[styles.balanceContainer, { opacity: balanceAnim, transform: [{ scale: balanceAnim }] }]}>
                <Text style={styles.balanceLabel}>Total Balance</Text>
                <Text style={[styles.balanceAmount, { fontSize: layout.isDesktopLayout ? 32 : 36 }]}>
                  {formatCurrency(balance, currency)}
                </Text>
              </Animated.View>

              <View style={styles.decor1} />
              <View style={styles.decor2} />
            </View>

            <View style={{ marginTop: layout.isDesktopLayout ? -30 : -40 }}>
              {/* SUMMARY CARDS */}
              <View style={[styles.summaryRow, { paddingHorizontal: 0 }]}>
                <AnimatedItem index={0}>
                  <View style={[styles.summaryCard, styles.shadow, {
                    backgroundColor: colors.surface,
                    flex: 1,
                    borderColor: themeMode === 'dark' ? colors.border : '#F3F4F6',
                    borderWidth: 1,
                  }]}>
                    <View style={[styles.iconBox, { backgroundColor: colors.successFaded }]}>
                      <Ionicons name="arrow-down" size={18} color={colors.success} />
                    </View>
                    <View>
                      <Text style={styles.summaryLabel}>INCOME</Text>
                      <Text style={[styles.summaryValue, { color: colors.secondary }]}>
                        {formatCurrency(totalIncome, currency)}
                      </Text>
                    </View>
                  </View>
                </AnimatedItem>

                <AnimatedItem index={1}>
                  <View style={[styles.summaryCard, styles.shadow, {
                    backgroundColor: colors.surface,
                    flex: 1,
                    borderColor: themeMode === 'dark' ? colors.border : '#F3F4F6',
                    borderWidth: 1,
                  }]}>
                    <View style={[styles.iconBox, { backgroundColor: colors.dangerFaded }]}>
                      <Ionicons name="arrow-up" size={18} color={colors.danger} />
                    </View>
                    <View>
                      <Text style={styles.summaryLabel}>EXPENSES</Text>
                      <Text style={[styles.summaryValue, { color: colors.secondary }]}>
                        {formatCurrency(totalExpenses, currency)}
                      </Text>
                    </View>
                  </View>
                </AnimatedItem>
              </View>

              {/* RECENT TRANSACTIONS */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: colors.secondary }]}>Recent Transaction</Text>
                  <TouchableOpacity onPress={() => navigation?.navigate?.('Ledger')}>
                    <Text style={styles.seeAll}>See All</Text>
                  </TouchableOpacity>
                </View>

                <View style={[styles.transactionCard, styles.shadow, { 
                  backgroundColor: colors.surface,
                  borderColor: themeMode === 'dark' ? colors.border : '#F3F4F6',
                  borderWidth: 1,
                }]}>
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map((t, idx) => (
                      <AnimatedItem key={t.id} index={idx + 2}>
                        <View>
                          <TransactionItem transaction={t} currency={currency} />
                          {idx < recentTransactions.length - 1 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
                        </View>
                      </AnimatedItem>
                    ))
                  ) : (
                    <View style={styles.emptyState}>
                      <Ionicons name="receipt-outline" size={48} color="#D1D5DB" />
                      <Text style={styles.emptyText}>No recent transactions</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>

          {/* FAB */}
          <TouchableOpacity
            style={[styles.fab, { backgroundColor: colors.secondary }]}
            onPress={() => navigation?.navigate?.('AddTransaction')}
            accessibilityLabel="Add new transaction"
            accessibilityRole="button"
          >
            <Ionicons name="add" size={32} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </AnimatedScreen>
    </ContextMenu>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  heroSection: {
    paddingHorizontal: 24,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 2,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)',
  },
  avatarText: { color: '#FFF', fontFamily: FontFamily.bold, fontSize: 16 },
  greeting: { color: 'rgba(255,255,255,0.7)', fontFamily: FontFamily.regular, fontSize: 13 },
  userName: { color: '#FFF', fontFamily: FontFamily.bold, fontSize: 16 },
  notifBtn: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#EF4444', borderWidth: 1.5, borderColor: '#1B2141',
  },
  balanceContainer: { alignItems: 'center', marginTop: 24, zIndex: 2 },
  balanceLabel: {
    color: 'rgba(255,255,255,0.7)', fontFamily: FontFamily.medium, fontSize: 14, marginBottom: 8,
  },
  balanceAmount: { color: '#FFF', fontFamily: FontFamily.bold },
  decor1: {
    position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  decor2: {
    position: 'absolute', bottom: -30, left: -20, width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  scrollContent: { paddingBottom: 120 },
  summaryRow: { flexDirection: 'row', gap: 16 },
  summaryCard: {
    borderRadius: 20, flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12,
  },
  iconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  summaryLabel: { color: '#9CA3AF', fontFamily: FontFamily.bold, fontSize: 10, letterSpacing: 0.5 },
  summaryValue: { fontFamily: FontFamily.bold, fontSize: 15 },
  section: { marginTop: 32 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16,
  },
  sectionTitle: { fontFamily: FontFamily.bold, fontSize: 18 },
  seeAll: { fontFamily: FontFamily.medium, fontSize: 14, color: '#9CA3AF' },
  transactionCard: { borderRadius: 24, paddingVertical: 8 },
  divider: { height: 1, marginHorizontal: 16 },
  shadow: { ...Shadow.small, elevation: 3 },
  emptyState: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  emptyText: { fontFamily: FontFamily.medium, fontSize: 14, color: '#9CA3AF' },
  fab: {
    position: 'absolute', bottom: 30, right: 24, width: 64, height: 64, borderRadius: 32,
    alignItems: 'center', justifyContent: 'center', ...Shadow.medium, elevation: 5,
  },
});

export default DashboardScreen;
