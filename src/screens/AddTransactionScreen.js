// Sovereign Ledger — Cross-Platform Add Transaction Screen
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, StatusBar, Alert, Modal, Animated, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontFamily } from '../theme/typography';
import { Shadow } from '../theme/spacing';
import { useAppContext } from '../context/AppContext';
import CustomKeypad from '../components/CustomKeypad';
import ToggleSwitch from '../components/ToggleSwitch';
import AnimatedScreen, { AnimatedItem } from '../components/animated/AnimatedScreen';
import useResponsiveLayout from '../hooks/useResponsiveLayout';

const AddTransactionScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { colors, currency, dispatch, ACTIONS, validateTransaction, themeMode } = useAppContext();
  const layout = useResponsiveLayout();
  const initialType = route?.params?.type || 'expense';
  const initialCategory = route?.params?.category;

  const [amount, setAmount] = useState('0.00');
  const [category, setCategory] = useState(initialCategory || 'Rent');
  const [timelineTab, setTimelineTab] = useState('Month');
  const [isRecurring, setIsRecurring] = useState(false);
  const [planAhead, setPlanAhead] = useState(true);
  const [showKeypad, setShowKeypad] = useState(false);
  const [webAmount, setWebAmount] = useState(''); // For web text input

  const categories = [
    { name: 'Food', icon: 'restaurant-outline' },
    { name: 'Rent', icon: 'home-outline' },
    { name: 'Study', icon: 'book-outline' },
    { name: 'Gym', icon: 'barbell-outline' },
    { name: 'Coffee', icon: 'cafe-outline' },
    { name: 'Other', icon: 'ellipsis-horizontal-outline' },
  ];

  const handleSave = () => {
    const finalAmount = Platform.OS === 'web' ? parseFloat(webAmount || amount) : parseFloat(amount);
    const transactionData = {
      type: initialType,
      amount: finalAmount,
      category,
      description: category,
      date: new Date().toISOString(),
      isRecurring,
    };

    const error = validateTransaction(transactionData);
    if (error) {
      if (Platform.OS === 'web') {
        alert(error);
      } else {
        Alert.alert('Incomplete Data', error);
      }
      return;
    }

    dispatch({ type: ACTIONS.ADD_TRANSACTION, payload: transactionData });
    navigation?.goBack?.();
  };

  // Scale animation for category selection
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const animateSelect = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 300, friction: 10, useNativeDriver: true }),
    ]).start();
  };

  const gridItemWidth = layout.isDesktopLayout ? '15%' : '30%';

  return (
    <AnimatedScreen animation="slideUp">
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: layout.isDesktopLayout ? 20 : insets.top }]}>
        <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack?.()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.secondary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.secondary }]}>Allocation</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={[styles.scrollContent, {
            paddingHorizontal: layout.containerPadding,
            maxWidth: layout.isDesktopLayout ? 600 : undefined,
            alignSelf: layout.isDesktopLayout ? 'center' : undefined,
            width: layout.isDesktopLayout ? '100%' : undefined,
          }]}
        >
          {/* Amount Display */}
          <AnimatedItem index={0}>
            <View style={styles.amountSection}>
              <Text style={styles.amountLabel}>AMOUNT</Text>
              {Platform.OS === 'web' ? (
                <View style={styles.webAmountInput}>
                  <Text style={styles.webCurrencySign}>{currency?.symbol || '$'}</Text>
                  <TextInput
                    style={[styles.webAmountField, { color: colors.secondary }]}
                    value={webAmount}
                    onChangeText={setWebAmount}
                    placeholder="0.00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    accessibilityLabel="Transaction amount"
                  />
                </View>
              ) : (
                <TouchableOpacity style={styles.amountValueContainer} onPress={() => setShowKeypad(true)}>
                  <View style={styles.currencyBadge}>
                    <Text style={styles.currencyBadgeText}>{currency?.code || 'USD'}</Text>
                  </View>
                  <Text style={[styles.amountValue, { color: colors.secondary }]}>
                    <Text style={styles.currencySign}>{currency?.symbol || '$'}</Text>{amount}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </AnimatedItem>

          {/* Category Grid */}
          <AnimatedItem index={1}>
            <View style={styles.gridSection}>
              <Text style={styles.sectionTitle}>CATEGORIES</Text>
              <Animated.View style={[styles.grid, { transform: [{ scale: scaleAnim }] }]}>
                {categories.map((item) => (
                  <TouchableOpacity
                    key={item.name}
                    onPress={() => { setCategory(item.name); animateSelect(); }}
                    style={[styles.gridItem, { width: gridItemWidth, backgroundColor: themeMode === 'dark' ? colors.border : '#F3F4F6' }, category === item.name && { backgroundColor: themeMode === 'dark' ? colors.primaryFaded : '#EBF2FF' }]}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: category === item.name }}
                  >
                    <Ionicons name={item.icon} size={24} color={category === item.name ? colors.primary : '#9CA3AF'} />
                    <Text style={[styles.gridItemText, { color: category === item.name ? colors.primary : '#9CA3AF' }]}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </Animated.View>
            </View>
          </AnimatedItem>

          {/* Timeline */}
          <AnimatedItem index={2}>
            <View style={styles.timelineSection}>
              <Text style={styles.sectionTitle}>Timeline</Text>
              <View style={[styles.timelineTabs, { backgroundColor: themeMode === 'dark' ? colors.border : '#F3F4F6' }]}>
                {['Date', 'Month', 'Year'].map(tab => (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setTimelineTab(tab)}
                    style={[styles.timelineTab, timelineTab === tab && [styles.activeTimelineTab, { backgroundColor: colors.surface }]]}
                    accessibilityRole="tab"
                  >
                    <Text style={[styles.timelineTabText, timelineTab === tab ? { color: colors.secondary } : { color: '#9CA3AF' }]}>{tab}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </AnimatedItem>

          {/* Toggles */}
          <AnimatedItem index={3}>
            <View style={styles.toggleSection}>
              <ToggleSwitch label="Recurring Transaction" value={isRecurring} onValueChange={setIsRecurring} />
              <ToggleSwitch label="Plan ahead of time" value={planAhead} onValueChange={setPlanAhead} />
            </View>
          </AnimatedItem>

          <AnimatedItem index={4}>
            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.heroBackground || colors.secondary }]} onPress={handleSave} accessibilityRole="button">
              <Text style={[styles.saveBtnText, { color: themeMode === 'dark' ? '#FFF' : '#FFF' }]}>Save Up!</Text>
            </TouchableOpacity>
          </AnimatedItem>
        </ScrollView>

        {/* Keypad Modal (mobile only) */}
        {Platform.OS !== 'web' && (
          <Modal visible={showKeypad} transparent animationType="slide">
            <View style={styles.keypadOverlay}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowKeypad(false)} />
              <View style={[styles.keypadContainer, { backgroundColor: colors.surface }]}>
                <View style={styles.keypadHeader}>
                  <Text style={[styles.amountValueOverlay, { color: colors.secondary }]}>
                    <Text style={styles.currencySignOverlay}>{currency?.symbol || '$'}</Text>{amount}
                  </Text>
                </View>
                <CustomKeypad value={amount} onChange={setAmount} onContinue={() => setShowKeypad(false)} />
                <TouchableOpacity style={[styles.saveTransactionBtn, { backgroundColor: colors.heroBackground || colors.secondary }]} onPress={handleSave}>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" />
                  <Text style={styles.saveTransactionText}>Save Transaction</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </AnimatedScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16 },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: FontFamily.bold, fontSize: 18 },
  scrollContent: { paddingBottom: 40 },
  amountSection: { paddingVertical: 24, alignItems: 'center' },
  amountLabel: { fontFamily: FontFamily.bold, fontSize: 10, color: '#9CA3AF', letterSpacing: 1, marginBottom: 8 },
  amountValueContainer: { alignItems: 'center', gap: 8 },
  amountValue: { fontFamily: FontFamily.bold, fontSize: 48 },
  currencySign: { fontSize: 32, color: '#9CA3AF' },
  currencyBadge: { backgroundColor: '#1B2141', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, position: 'absolute', top: -10, right: -40 },
  currencyBadgeText: { color: '#FFF', fontFamily: FontFamily.bold, fontSize: 10 },
  webAmountInput: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  webCurrencySign: { fontFamily: FontFamily.bold, fontSize: 32, color: '#9CA3AF' },
  webAmountField: { fontFamily: FontFamily.bold, fontSize: 48, minWidth: 120, textAlign: 'center', ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) },
  gridSection: { marginBottom: 24 },
  sectionTitle: { fontFamily: FontFamily.bold, fontSize: 10, color: '#9CA3AF', letterSpacing: 1, marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: { aspectRatio: 1, borderRadius: 16, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', gap: 8 },
  gridItemText: { fontFamily: FontFamily.bold, fontSize: 12 },
  timelineSection: { marginBottom: 24 },
  timelineTabs: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 12, padding: 4, marginBottom: 16 },
  timelineTab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  activeTimelineTab: { backgroundColor: '#FFFFFF', ...Shadow.small },
  timelineTabText: { fontFamily: FontFamily.bold, fontSize: 13 },
  toggleSection: { gap: 12, marginBottom: 32 },
  saveBtn: { height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', ...Shadow.medium },
  saveBtnText: { color: '#FFF', fontFamily: FontFamily.bold, fontSize: 16 },
  keypadOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  keypadContainer: { borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingBottom: 24 },
  keypadHeader: { alignItems: 'center', padding: 24 },
  amountValueOverlay: { fontFamily: FontFamily.bold, fontSize: 40 },
  currencySignOverlay: { fontSize: 28, color: '#9CA3AF' },
  saveTransactionBtn: { flexDirection: 'row', marginHorizontal: 24, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 12 },
  saveTransactionText: { color: '#FFF', fontFamily: FontFamily.bold, fontSize: 16 },
});

export default AddTransactionScreen;
