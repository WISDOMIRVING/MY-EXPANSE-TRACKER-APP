// Sovereign Ledger — Cross-Platform Analytics with Responsive Layout
import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontFamily } from '../theme/typography';
import { Shadow } from '../theme/spacing';
import { useAppContext } from '../context/AppContext';
import { formatCurrency } from '../utils/currency';
import { getCategoryIcon, getCategoryBg, getCategoryColor } from '../components/CategoryIcon';
import ScreenHeader from '../components/ScreenHeader';
import AnimatedScreen, { AnimatedItem } from '../components/animated/AnimatedScreen';
import useResponsiveLayout from '../hooks/useResponsiveLayout';
import dayjs from 'dayjs';

const AnalyticsScreen = () => {
  const insets = useSafeAreaInsets();
  const { transactions, colors, currency, themeMode } = useAppContext();
  const layout = useResponsiveLayout();
  const [period, setPeriod] = useState('Week');
  const periods = ['Day', 'Week', 'Month', 'Year'];

  // Animated progress bars
  const progressAnims = useRef([0, 1, 2, 3].map(() => new Animated.Value(0))).current;

  const topSpending = useMemo(() => {
    const categories = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });
    const totalExpense = Object.values(categories).reduce((a, b) => a + b, 0);
    return Object.entries(categories)
      .map(([name, amount]) => ({ name, amount, percentage: totalExpense > 0 ? (amount / totalExpense) : 0 }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);
  }, [transactions]);

  // Animate progress bars when data changes
  useEffect(() => {
    topSpending.forEach((item, i) => {
      if (progressAnims[i]) {
        progressAnims[i].setValue(0);
        Animated.timing(progressAnims[i], {
          toValue: item.percentage,
          duration: 800,
          delay: i * 150,
          useNativeDriver: false,
        }).start();
      }
    });
  }, [topSpending]);

  // Simple bar chart using RN views (avoids react-native-chart-kit web issues)
  const chartData = useMemo(() => {
    const labels = period === 'Week' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const data = labels.map(() => Math.floor(Math.random() * 500) + 100);
    const max = Math.max(...data);
    return { labels, data, max };
  }, [period]);

  return (
    <AnimatedScreen animation="fadeSlideUp">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
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
          {/* HEADER - Inside ScrollView for better responsive behavior */}
          <View style={{ marginHorizontal: -layout.containerPadding }}>
            <ScreenHeader title="Statistics" rightIcon="ellipsis-horizontal" />
          </View>
          
          <View style={{ marginTop: -30 }}>
            {/* Filter Tabs */}
          <View style={styles.filterContainer}>
            {periods.map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.filterTab, period === p && { backgroundColor: colors.secondary }]}
                onPress={() => setPeriod(p)}
                accessibilityRole="tab"
              >
                <Text style={[styles.filterText, period === p ? { color: '#FFF' } : { color: '#9CA3AF' }]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Chart Card - Custom bar chart for cross-platform compat */}
          <AnimatedItem index={0}>
            <View style={[styles.chartCard, { 
              backgroundColor: colors.surface,
              borderColor: themeMode === 'dark' ? colors.border : '#F3F4F6',
              borderWidth: 1,
            }]}>
              <View style={styles.chartHeader}>
                <Text style={[styles.chartTitle, { color: colors.textSecondary }]}>Total Spent</Text>
                <Text style={[styles.chartAmount, { color: colors.secondary }]}>
                  {formatCurrency(topSpending.reduce((s, i) => s + i.amount, 0), currency)}
                </Text>
              </View>
              {/* Simple bar chart */}
              <View style={styles.barChart}>
                {chartData.data.map((val, i) => (
                  <View key={i} style={styles.barColumn}>
                    <View style={styles.barWrapper}>
                      <Animated.View style={[styles.bar, {
                        height: `${(val / chartData.max) * 100}%`,
                        backgroundColor: colors.secondary,
                      }]} />
                    </View>
                    <Text style={[styles.barLabel, { color: colors.textMuted }]}>{chartData.labels[i]}</Text>
                  </View>
                ))}
              </View>
            </View>
          </AnimatedItem>

          {/* Top Spending */}
          <View style={styles.spendingSection}>
            <Text style={[styles.sectionTitle, { color: colors.secondary }]}>Top Spending</Text>
            <View style={styles.spendingList}>
              {topSpending.length > 0 ? (
                topSpending.map((item, i) => {
                  const animWidth = progressAnims[i]?.interpolate({
                    inputRange: [0, 1], outputRange: ['0%', '100%'],
                  }) || '0%';

                  return (
                    <AnimatedItem key={item.name} index={i + 1}>
                      <View style={styles.spendingItem}>
                        <View style={[styles.iconContainer, { backgroundColor: getCategoryBg(item.name) }]}>
                          <Ionicons name={getCategoryIcon(item.name)} size={20} color={getCategoryColor(item.name)} />
                        </View>
                        <View style={styles.spendingContent}>
                          <View style={styles.spendingRow}>
                            <Text style={[styles.categoryName, { color: colors.secondary }]}>{item.name}</Text>
                            <Text style={[styles.categoryAmount, { color: colors.secondary }]}>{formatCurrency(item.amount, currency)}</Text>
                          </View>
                          <View style={styles.progressBarContainer}>
                            <Animated.View style={[styles.progressBar, {
                              width: animWidth,
                              backgroundColor: getCategoryColor(item.name),
                            }]} />
                          </View>
                        </View>
                      </View>
                    </AnimatedItem>
                  );
                })
              ) : (
                <View style={styles.emptyContainer}>
                  <Ionicons name="stats-chart-outline" size={48} color="#9CA3AF" />
                  <Text style={styles.emptyText}>No spending data for this period</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      </View>
    </AnimatedScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  filterContainer: {
    flexDirection: 'row', backgroundColor: 'rgba(156,163,175,0.1)', borderRadius: 30, padding: 4, marginBottom: 24,
  },
  filterTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 26 },
  filterText: { fontFamily: FontFamily.semiBold, fontSize: 14 },
  chartCard: {
    borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#EEF0F5', ...Shadow.small,
  },
  chartHeader: { marginBottom: 16 },
  chartTitle: { fontFamily: FontFamily.medium, fontSize: 14, marginBottom: 4 },
  chartAmount: { fontFamily: FontFamily.bold, fontSize: 28 },
  barChart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 160, paddingTop: 8 },
  barColumn: { flex: 1, alignItems: 'center', gap: 6 },
  barWrapper: { width: '60%', height: 120, justifyContent: 'flex-end', borderRadius: 6, overflow: 'hidden' },
  bar: { width: '100%', borderRadius: 4, minHeight: 4 },
  barLabel: { fontFamily: FontFamily.medium, fontSize: 11 },
  spendingSection: { marginTop: 32 },
  sectionTitle: { fontFamily: FontFamily.bold, fontSize: 18, marginBottom: 20 },
  spendingList: { gap: 24 },
  spendingItem: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconContainer: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  spendingContent: { flex: 1, gap: 8 },
  spendingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryName: { fontFamily: FontFamily.bold, fontSize: 16 },
  categoryAmount: { fontFamily: FontFamily.bold, fontSize: 16 },
  progressBarContainer: { height: 8, backgroundColor: '#F3F4F6', borderRadius: 4, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 4 },
  emptyContainer: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  emptyText: { fontFamily: FontFamily.medium, fontSize: 14, color: '#9CA3AF' },
});

export default AnalyticsScreen;
