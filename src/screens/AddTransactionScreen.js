// Sovereign Ledger — Add Transaction Screen
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar,
  ScrollView, TextInput, Animated, Keyboard, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';
import { useAppContext } from '../context/AppContext';
import CustomKeypad from '../components/CustomKeypad';
import TabSelector from '../components/TabSelector';
import ToggleSwitch from '../components/ToggleSwitch';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, getCategoryIcon, getCategoryColor } from '../components/CategoryIcon';
import dayjs from 'dayjs';

const TIMEFRAME_TABS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const AddTransactionScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { addTransaction, currency } = useAppContext();
  const initialType = route?.params?.type || 'expense';

  const [type, setType] = useState(initialType);
  const [amount, setAmount] = useState('0.00');
  const [selectedCategory, setSelectedCategory] = useState(
    initialType === 'income' ? 'Salary' : 'Food'
  );
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(dayjs().format('MM/DD/YYYY'));
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringInterval, setRecurringInterval] = useState('monthly');
  const [thresholdAlert, setThresholdAlert] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [step, setStep] = useState(1); // 1 = amount + category, 2 = details

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleKeyPress = (key) => {
    setAmount((prev) => {
      if (prev === '0.00' || prev === '0') {
        if (key === '.') return '0.';
        return key;
      }
      if (key === '.' && prev.includes('.')) return prev;
      if (prev.includes('.') && prev.split('.')[1].length >= 2) return prev;
      return prev + key;
    });
  };

  const handleDelete = () => {
    setAmount((prev) => {
      if (prev.length <= 1) return '0.00';
      return prev.slice(0, -1);
    });
  };

  const handleContinue = () => {
    if (parseFloat(amount) <= 0) return;
    setShowKeypad(false);
    setStep(2);
  };

  const handleSaveTransaction = () => {
    const parsedAmount = parseFloat(amount);
    if (parsedAmount <= 0) return;

    addTransaction({
      type,
      amount: parsedAmount,
      category: selectedCategory,
      description: notes || selectedCategory,
      date: dayjs(date, 'MM/DD/YYYY').isValid()
        ? dayjs(date, 'MM/DD/YYYY').toISOString()
        : dayjs().toISOString(),
      isRecurring,
      recurringInterval: isRecurring ? recurringInterval : null,
    });

    navigation.goBack();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            if (step === 2) {
              setStep(1);
            } else {
              navigation.goBack();
            }
          }}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ADD TRANSACTION</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Type Toggle */}
      <View style={styles.typeToggle}>
        <TouchableOpacity
          style={[styles.typeBtn, type === 'expense' && styles.typeBtnActive]}
          onPress={() => {
            setType('expense');
            setSelectedCategory('Food');
          }}
        >
          <Text style={[styles.typeBtnText, type === 'expense' && styles.typeBtnTextActive]}>
            Expense
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeBtn, type === 'income' && styles.incomeActive]}
          onPress={() => {
            setType('income');
            setSelectedCategory('Salary');
          }}
        >
          <Text style={[styles.typeBtnText, type === 'income' && styles.typeBtnTextActive]}>
            Income
          </Text>
        </TouchableOpacity>
      </View>

      {step === 1 ? (
        <View style={styles.stepOne}>
          {/* Amount Display */}
          <TouchableOpacity
            style={styles.amountDisplay}
            onPress={() => setShowKeypad(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.currencySymbol}>{currency.symbol}</Text>
            <Text style={styles.amountText}>{amount}</Text>
          </TouchableOpacity>

          {!showKeypad && (
            <>
              {/* Category Selection */}
              <View style={styles.categoryGrid}>
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  const iconName = getCategoryIcon(cat);
                  const iconColor = getCategoryColor(cat);
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.categoryItem, isSelected && styles.categoryItemSelected]}
                      onPress={() => setSelectedCategory(cat)}
                    >
                      <View style={[styles.categoryIconContainer, { backgroundColor: `${iconColor}20` }]}>
                        <Ionicons name={iconName} size={22} color={iconColor} />
                      </View>
                      <Text style={[styles.categoryLabel, isSelected && styles.categoryLabelSelected]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity
                style={[styles.continueBtn, parseFloat(amount) <= 0 && styles.continueBtnDisabled]}
                onPress={() => {
                  if (parseFloat(amount) > 0) {
                    setStep(2);
                  } else {
                    setShowKeypad(true);
                  }
                }}
              >
                <Text style={styles.continueBtnText}>Continue</Text>
              </TouchableOpacity>
            </>
          )}

          {showKeypad && (
            <View style={styles.keypadSection}>
              <CustomKeypad onKeyPress={handleKeyPress} onDelete={handleDelete} />
              <TouchableOpacity
                style={[styles.continueBtn, parseFloat(amount) <= 0 && styles.continueBtnDisabled]}
                onPress={handleContinue}
                disabled={parseFloat(amount) <= 0}
              >
                <Text style={styles.continueBtnText}>Continue</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <ScrollView
          style={styles.stepTwo}
          contentContainerStyle={styles.stepTwoContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Selected Amount & Category Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryAmount}>
              {currency.symbol}{amount}
            </Text>
            <Text style={styles.summaryCategory}>{selectedCategory}</Text>
          </View>

          {/* Timeframe */}
          <Text style={styles.fieldLabel}>Timeframe</Text>
          <TabSelector
            tabs={TIMEFRAME_TABS}
            activeTab={recurringInterval}
            onTabChange={setRecurringInterval}
            style={styles.timeframeTabs}
          />

          {/* Date */}
          <Text style={styles.fieldLabel}>DATE</Text>
          <TextInput
            style={styles.fieldInput}
            value={date}
            onChangeText={setDate}
            placeholder="MM/DD/YYYY"
            placeholderTextColor={Colors.inputPlaceholder}
          />

          {/* Recurring Transaction */}
          <ToggleSwitch
            label="Recurring Transaction"
            value={isRecurring}
            onValueChange={setIsRecurring}
          />

          {/* Threshold Alert */}
          <ToggleSwitch
            label="Threshold Alert"
            description="Notify at 80%"
            value={thresholdAlert}
            onValueChange={setThresholdAlert}
          />

          {/* Notes */}
          <Text style={styles.fieldLabel}>NOTES</Text>
          <TextInput
            style={[styles.fieldInput, styles.notesInput]}
            placeholder="What was this for?"
            placeholderTextColor={Colors.inputPlaceholder}
            value={notes}
            onChangeText={setNotes}
            multiline
          />

          {/* Save Button */}
          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveTransaction}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.textPrimary} />
            <Text style={styles.saveBtnText}>Save Transaction</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    letterSpacing: 1.5,
  },
  typeToggle: {
    flexDirection: 'row',
    margin: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: 3,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  typeBtnActive: {
    backgroundColor: Colors.danger,
  },
  incomeActive: {
    backgroundColor: Colors.success,
  },
  typeBtnText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  typeBtnTextActive: {
    color: Colors.textPrimary,
    fontFamily: FontFamily.semiBold,
  },
  stepOne: {
    flex: 1,
  },
  amountDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
    gap: Spacing.xs,
  },
  currencySymbol: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xxxl,
    color: Colors.textSecondary,
  },
  amountText: {
    fontFamily: FontFamily.bold,
    fontSize: 48,
    color: Colors.textPrimary,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.lg,
    justifyContent: 'center',
  },
  categoryItem: {
    alignItems: 'center',
    width: 72,
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  categoryItemSelected: {
    backgroundColor: Colors.surface,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  categoryLabelSelected: {
    color: Colors.textPrimary,
    fontFamily: FontFamily.semiBold,
  },
  keypadSection: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: Spacing.xxxl,
  },
  continueBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    marginHorizontal: Spacing.xxl,
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  continueBtnDisabled: {
    opacity: 0.4,
  },
  continueBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  stepTwo: {
    flex: 1,
  },
  stepTwoContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.massive,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryAmount: {
    fontFamily: FontFamily.bold,
    fontSize: 32,
    color: Colors.textPrimary,
  },
  summaryCategory: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  fieldLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timeframeTabs: {
    marginBottom: Spacing.sm,
  },
  fieldInput: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xxl,
  },
  saveBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  cancelBtn: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
});

export default AddTransactionScreen;
