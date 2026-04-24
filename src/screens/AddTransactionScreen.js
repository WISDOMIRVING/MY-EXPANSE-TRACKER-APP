// Sovereign Ledger — Pixel Perfect Add Transaction Screen
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, StatusBar, Alert, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing, BorderRadius, Shadow } from '../theme/spacing';
import { useAppContext } from '../context/AppContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../components/CategoryIcon';
import CustomKeypad from '../components/CustomKeypad';
import dayjs from 'dayjs';

const TIMEFRAMES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const AddTransactionScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { colors, currency, dispatch, ACTIONS, validateTransaction, themeMode } = useAppContext();
  const initialType = route.params?.type || 'expense';
  const categories = initialType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const [amount, setAmount] = useState('0.00');
  const [category, setCategory] = useState(categories[0]);
  const [timeframe, setTimeframe] = useState('weekly');
  const [isRecurring, setIsRecurring] = useState(false);
  const [thresholdAlert, setThresholdAlert] = useState(true);
  const [notes, setNotes] = useState('');
  const [showKeypad, setShowKeypad] = useState(false);

  const handleSave = () => {
    const transactionData = {
      type: initialType,
      amount: parseFloat(amount),
      category,
      description: notes || category,
      date: new Date().toISOString(),
      isRecurring,
      recurringInterval: timeframe,
    };

    const error = validateTransaction(transactionData);
    if (error) {
      Alert.alert('Incomplete Data', error);
      return;
    }

    dispatch({ type: ACTIONS.ADD_TRANSACTION, payload: transactionData });
    navigation.goBack();
  };

  const dynamicStyles = {
    container: { backgroundColor: colors.background },
    surface: { backgroundColor: colors.surface, borderColor: colors.border },
    textPrimary: { color: colors.textPrimary },
    textSecondary: { color: colors.textSecondary },
    input: { backgroundColor: colors.surface, borderColor: colors.border, color: colors.textPrimary },
  };

  return (
    <View style={[styles.container, dynamicStyles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, dynamicStyles.textPrimary]}>New {initialType === 'income' ? 'Income' : 'Allocation'}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Amount Display */}
        <TouchableOpacity style={[styles.amountCard, dynamicStyles.surface]} onPress={() => setShowKeypad(true)}>
          <View style={styles.amountHeader}>
            <Text style={[styles.amountLabel, dynamicStyles.textSecondary]}>AMOUNT</Text>
            <View style={[styles.currencyBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.currencyText}>{currency.code}</Text>
            </View>
          </View>
          <Text style={[styles.amountDisplay, { color: colors.primary }]}>
            {currency.symbol} <Text style={styles.amountMain}>{amount}</Text>
          </Text>
        </TouchableOpacity>

        {/* Category Grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.textSecondary]}>CATEGORY</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity key={cat} style={[styles.categoryBtn, dynamicStyles.surface, category === cat && { backgroundColor: colors.primaryFaded, borderColor: colors.primary }]} onPress={() => setCategory(cat)}>
                <View style={[styles.categoryIcon, { backgroundColor: category === cat ? colors.primary : colors.border }]}>
                  <Ionicons name="grid-outline" size={16} color={category === cat ? '#FFF' : colors.textMuted} />
                </View>
                <Text style={[styles.categoryText, dynamicStyles.textPrimary, category === cat && { color: colors.primary }]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Timeframe Selector */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.textSecondary]}>TIMEFRAME</Text>
          <View style={[styles.tabContainer, dynamicStyles.surface]}>
            {TIMEFRAMES.map((tf) => (
              <TouchableOpacity key={tf.value} style={[styles.tab, timeframe === tf.value && { backgroundColor: colors.primaryFaded, borderRadius: 8 }]} onPress={() => setTimeframe(tf.value)}>
                <Text style={[styles.tabText, dynamicStyles.textSecondary, timeframe === tf.value && { color: colors.primary, fontFamily: FontFamily.bold }]}>{tf.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date Picker (Static Placeholder matching Figma) */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.textSecondary]}>DATE</Text>
          <View style={[styles.datePicker, dynamicStyles.surface]}>
            <Ionicons name="calendar-outline" size={20} color={colors.textMuted} />
            <Text style={[styles.dateText, dynamicStyles.textPrimary]}>{dayjs().format('MM/DD/YYYY')}</Text>
          </View>
        </View>

        {/* Options */}
        <View style={styles.optionsSection}>
          <View style={[styles.optionRow, dynamicStyles.surface]}>
            <View style={styles.optionLeft}>
              <Ionicons name="repeat-outline" size={22} color={colors.textSecondary} />
              <Text style={[styles.optionText, dynamicStyles.textPrimary]}>Recurring Transaction</Text>
            </View>
            <TouchableOpacity onPress={() => setIsRecurring(!isRecurring)}>
              <View style={[styles.switchTrack, { backgroundColor: isRecurring ? colors.primary : colors.toggleInactive }]}>
                <View style={[styles.switchThumb, isRecurring && { alignSelf: 'flex-end' }]} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={[styles.optionRow, dynamicStyles.surface]}>
            <View style={styles.optionLeft}>
              <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} />
              <Text style={[styles.optionText, dynamicStyles.textPrimary]}>Threshold Alert</Text>
            </View>
            <TouchableOpacity onPress={() => setThresholdAlert(!thresholdAlert)}>
              <View style={[styles.switchTrack, { backgroundColor: thresholdAlert ? colors.primary : colors.toggleInactive }]}>
                <View style={[styles.switchThumb, thresholdAlert && { alignSelf: 'flex-end' }]} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.textSecondary]}>NOTES</Text>
          <TextInput style={[styles.notesInput, dynamicStyles.surface]} placeholder="What was this for?" placeholderTextColor={colors.textMuted} value={notes} onChangeText={setNotes} />
        </View>

        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Up!</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Keypad Modal */}
      <Modal visible={showKeypad} transparent animationType="slide">
        <View style={styles.keypadOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowKeypad(false)} />
          <View style={[styles.keypadContainer, { backgroundColor: colors.surface }]}>
            <View style={styles.keypadHeader}>
              <Text style={[styles.keypadTitle, dynamicStyles.textPrimary]}>Enter Amount</Text>
              <TouchableOpacity onPress={() => setShowKeypad(false)}><Ionicons name="close" size={24} color={colors.textPrimary} /></TouchableOpacity>
            </View>
            <View style={styles.amountPreview}>
              <Text style={[styles.amountDisplay, { color: colors.primary }]}>{currency.symbol} <Text style={styles.amountMain}>{amount}</Text></Text>
            </View>
            <CustomKeypad value={amount} onChange={setAmount} onContinue={() => setShowKeypad(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  headerTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.lg },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingBottom: 60 },
  amountCard: { padding: Spacing.xl, borderRadius: BorderRadius.xl, borderWidth: 1, marginBottom: Spacing.xl, ...Shadow.small },
  amountHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  amountLabel: { fontFamily: FontFamily.bold, fontSize: 10, letterSpacing: 1 },
  currencyBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  currencyText: { color: '#FFF', fontFamily: FontFamily.bold, fontSize: 10 },
  amountDisplay: { fontFamily: FontFamily.bold, fontSize: 32 },
  amountMain: { fontSize: 48 },
  section: { marginBottom: Spacing.xl },
  sectionTitle: { fontFamily: FontFamily.bold, fontSize: 10, letterSpacing: 1, marginBottom: Spacing.lg },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  categoryBtn: { width: '30%', paddingVertical: Spacing.lg, alignItems: 'center', borderRadius: BorderRadius.lg, borderWidth: 1, gap: Spacing.sm },
  categoryIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  categoryText: { fontFamily: FontFamily.medium, fontSize: 12 },
  tabContainer: { flexDirection: 'row', padding: 4, borderRadius: BorderRadius.lg, borderWidth: 1 },
  tab: { flex: 1, paddingVertical: Spacing.md, alignItems: 'center' },
  tabText: { fontFamily: FontFamily.medium, fontSize: 13 },
  datePicker: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.lg, borderRadius: BorderRadius.lg, borderWidth: 1 },
  dateText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.md },
  optionsSection: { gap: Spacing.md, marginBottom: Spacing.xl },
  optionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg, borderRadius: BorderRadius.lg, borderWidth: 1 },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  optionText: { fontFamily: FontFamily.medium, fontSize: FontSize.md },
  switchTrack: { width: 44, height: 24, borderRadius: 12, padding: 2, justifyContent: 'center' },
  switchThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFFFFF' },
  notesInput: { padding: Spacing.lg, borderRadius: BorderRadius.lg, borderWidth: 1, fontFamily: FontFamily.regular, fontSize: FontSize.md, minHeight: 60 },
  saveBtn: { borderRadius: BorderRadius.md, paddingVertical: Spacing.xl, alignItems: 'center', ...Shadow.medium, marginTop: Spacing.sm },
  saveBtnText: { color: '#FFF', fontFamily: FontFamily.bold, fontSize: FontSize.lg },
  keypadOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  keypadContainer: { borderTopLeftRadius: BorderRadius.xxl, borderTopRightRadius: BorderRadius.xxl, paddingBottom: Spacing.huge },
  keypadHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.xl },
  keypadTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.lg },
  amountPreview: { alignItems: 'center', paddingBottom: Spacing.xl },
});

export default AddTransactionScreen;
