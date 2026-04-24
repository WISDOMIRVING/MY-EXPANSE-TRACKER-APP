// Sovereign Ledger — Budget Screen
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
  Modal, TextInput, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';
import { useAppContext } from '../context/AppContext';
import BudgetCard from '../components/BudgetCard';
import TabSelector from '../components/TabSelector';
import { EXPENSE_CATEGORIES } from '../components/CategoryIcon';

const FILTER_TABS = [
  { value: 'All', label: 'All' },
  { value: 'Food', label: 'Food' },
  { value: 'Transport', label: 'Travel' },
  { value: 'Shopping', label: 'Shop' },
  { value: 'Housing', label: 'Home' },
];

const PERIOD_OPTIONS = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

const BudgetScreen = () => {
  const insets = useSafeAreaInsets();
  const { budgets, addBudget, deleteBudget, currency } = useAppContext();
  const [activeFilter, setActiveFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: 'Food',
    limit: '',
    period: 'monthly',
  });

  const filteredBudgets = activeFilter === 'All'
    ? budgets
    : budgets.filter(b => b.category === activeFilter);

  const handleAddBudget = () => {
    if (!newBudget.limit || parseFloat(newBudget.limit) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid budget amount.');
      return;
    }

    // Check if budget for this category already exists
    const exists = budgets.find(b => b.category === newBudget.category);
    if (exists) {
      Alert.alert('Budget Exists', `A budget for ${newBudget.category} already exists. Delete it first to create a new one.`);
      return;
    }

    addBudget({
      category: newBudget.category,
      limit: parseFloat(newBudget.limit),
      period: newBudget.period,
    });

    setNewBudget({ category: 'Food', limit: '', period: 'monthly' });
    setShowModal(false);
  };

  const handleDeleteBudget = (budget) => {
    Alert.alert(
      'Delete Budget',
      `Are you sure you want to delete the ${budget.category} budget?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteBudget(budget.id) },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Budget Allocations</Text>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContainer}
      >
        {FILTER_TABS.map((tab) => {
          const isActive = activeFilter === tab.value;
          return (
            <TouchableOpacity
              key={tab.value}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setActiveFilter(tab.value)}
            >
              <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Budget List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      >
        {filteredBudgets.length > 0 ? (
          filteredBudgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              currency={currency}
              onPress={handleDeleteBudget}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="wallet-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No Budgets</Text>
            <Text style={styles.emptySubtext}>
              Create budgets to track spending by category
            </Text>
          </View>
        )}
      </ScrollView>

      {/* New Allocation Button */}
      <TouchableOpacity
        style={styles.newAllocationBtn}
        onPress={() => setShowModal(true)}
      >
        <View style={styles.newAllocationIcon}>
          <Ionicons name="clipboard-outline" size={20} color={Colors.primary} />
        </View>
        <View>
          <Text style={styles.newAllocationTitle}>New Allocation</Text>
          <Text style={styles.newAllocationSubtitle}>Set a budget for a category</Text>
        </View>
      </TouchableOpacity>

      {/* Add Budget Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>New Budget Allocation</Text>

            {/* Category Selection */}
            <Text style={styles.inputLabel}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
            >
              {EXPENSE_CATEGORIES.map((cat) => {
                const isSelected = newBudget.category === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.categoryOption, isSelected && styles.categoryOptionSelected]}
                    onPress={() => setNewBudget({ ...newBudget, category: cat })}
                  >
                    <Text style={[styles.categoryOptionText, isSelected && styles.categoryOptionTextSelected]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Amount Input */}
            <Text style={styles.inputLabel}>Budget Limit ({currency.symbol})</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor={Colors.inputPlaceholder}
              keyboardType="decimal-pad"
              value={newBudget.limit}
              onChangeText={(text) => setNewBudget({ ...newBudget, limit: text })}
            />

            {/* Period Selection */}
            <Text style={styles.inputLabel}>Budget Period</Text>
            <View style={styles.periodRow}>
              {PERIOD_OPTIONS.map((opt) => {
                const isSelected = newBudget.period === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.periodOption, isSelected && styles.periodOptionSelected]}
                    onPress={() => setNewBudget({ ...newBudget, period: opt.value })}
                  >
                    <Text style={[styles.periodOptionText, isSelected && styles.periodOptionTextSelected]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Actions */}
            <TouchableOpacity style={styles.saveBtn} onPress={handleAddBudget}>
              <Text style={styles.saveBtnText}>Create Budget</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    color: Colors.textPrimary,
  },
  filterScroll: {
    maxHeight: 44,
    marginBottom: Spacing.lg,
  },
  filterContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.textPrimary,
    fontFamily: FontFamily.semiBold,
  },
  listContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 140,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.massive,
    gap: Spacing.md,
  },
  emptyTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xl,
    color: Colors.textSecondary,
  },
  emptySubtext: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  newAllocationBtn: {
    position: 'absolute',
    bottom: Spacing.xxxl,
    left: Spacing.lg,
    right: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  newAllocationIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newAllocationTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  newAllocationSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
    paddingBottom: Spacing.huge,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: Spacing.xl,
  },
  modalTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    color: Colors.textPrimary,
    marginBottom: Spacing.xl,
  },
  inputLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryScroll: {
    maxHeight: 40,
  },
  categoryOption: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
  },
  categoryOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryOptionText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  categoryOptionTextSelected: {
    color: Colors.textPrimary,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xxl,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  periodRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  periodOption: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  periodOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  periodOptionText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  periodOptionTextSelected: {
    color: Colors.textPrimary,
    fontFamily: FontFamily.semiBold,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.xxl,
  },
  saveBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  cancelBtn: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  cancelBtnText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
});

export default BudgetScreen;
