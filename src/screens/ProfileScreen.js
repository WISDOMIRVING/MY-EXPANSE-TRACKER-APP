// Sovereign Ledger — Profile / Settings Screen
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
  Modal, Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';
import { useAppContext } from '../context/AppContext';
import { CURRENCIES } from '../utils/currency';
import { exportToCSV, exportToPDF } from '../utils/export';
import { clearAndRestore } from '../utils/storage';
import i18n from '../utils/i18n';

const ProfileScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const {
    currency, setCurrency, transactions, setVerified, balance,
    totalIncome, totalExpenses, colors, themeMode, toggleTheme, budgets
  } = useAppContext();
  
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);

  const handleExportCSV = async () => {
    try {
      await exportToCSV(transactions || [], currency);
      setShowExportModal(false);
    } catch (e) {
      Alert.alert('Export Failed', 'Could not export CSV data.');
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportToPDF(transactions || [], currency);
      setShowExportModal(false);
    } catch (e) {
      Alert.alert('Export Failed', 'Could not export PDF data.');
    }
  };

  const handleExportJSON = async () => {
    const data = { transactions, budgets, currency, themeMode, timestamp: new Date().toISOString() };
    const json = JSON.stringify(data);
    await Clipboard.setStringAsync(json);
    Alert.alert('Backup Copied', 'Encrypted backup data has been copied to your clipboard. Save it in a secure note or email.');
  };

  const handleImportJSON = async () => {
    const content = await Clipboard.getStringAsync();
    try {
      const data = JSON.parse(content);
      if (!data.transactions) throw new Error('Invalid backup format');
      
      Alert.alert('Restore Data', 'This will replace all current data with the backup. Proceed?', [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Restore', 
          onPress: async () => {
            const success = await clearAndRestore(data);
            if (success) {
              Alert.alert('Success', 'Data restored successfully. Please restart the app.');
            } else {
              Alert.alert('Error', 'Failed to restore data.');
            }
          }
        }
      ]);
    } catch (e) {
      Alert.alert('Import Failed', 'No valid backup data found in clipboard.');
    }
  };

  const settingsItems = [
    { icon: 'moon-outline', title: 'Dark Mode', subtitle: themeMode === 'dark' ? 'On' : 'Off', onPress: toggleTheme, toggle: true, toggleValue: themeMode === 'dark' },
    { icon: 'card-outline', title: 'Currency', subtitle: `${currency.name} (${currency.symbol})`, onPress: () => setShowCurrencyPicker(true) },
    { icon: 'scan-outline', title: 'Biometrics', subtitle: biometricsEnabled ? 'Enabled' : 'Disabled', onPress: () => setBiometricsEnabled(!biometricsEnabled), toggle: true, toggleValue: biometricsEnabled },
    { icon: 'copy-outline', title: 'Backup to Clipboard', subtitle: 'Export JSON', onPress: handleExportJSON },
    { icon: 'download-outline', title: 'Restore from Clipboard', subtitle: 'Import JSON', onPress: handleImportJSON },
    { icon: 'document-attach-outline', title: 'Export Reports', subtitle: 'CSV or PDF', onPress: () => setShowExportModal(true) },
  ];

  const dynamicStyles = {
    container: { backgroundColor: colors.background },
    surface: { backgroundColor: colors.surface, borderColor: colors.border },
    textPrimary: { color: colors.textPrimary },
    textSecondary: { color: colors.textSecondary },
    modalContent: { backgroundColor: colors.background },
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
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.profileCard, dynamicStyles.surface]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.avatarText, { color: '#FFF' }]}>AS</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, dynamicStyles.textPrimary]}>Alexander Sterling</Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
              <Text style={[styles.statusText, { color: colors.success }]}>protected</Text>
            </View>
          </View>
        </View>

        <View style={[styles.settingsList, dynamicStyles.surface]}>
          {settingsItems.map((item, index) => (
            <TouchableOpacity key={item.title} style={[styles.settingsItem, index < settingsItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]} onPress={item.onPress}>
              <View style={[styles.settingsIconContainer, { backgroundColor: colors.background }]}>
                <Ionicons name={item.icon} size={20} color={colors.textPrimary} />
              </View>
              <View style={styles.settingsContent}>
                <Text style={[styles.settingsTitle, dynamicStyles.textPrimary]}>{item.title}</Text>
                <Text style={[styles.settingsSubtitle, dynamicStyles.textSecondary]}>{item.subtitle}</Text>
              </View>
              {item.toggle ? (
                <View style={[styles.toggleTrack, { backgroundColor: item.toggleValue ? colors.primary : colors.toggleInactive }]}>
                  <View style={[styles.toggleThumb, item.toggleValue && { alignSelf: 'flex-end' }]} />
                </View>
              ) : (
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.signOutBtn, { backgroundColor: colors.danger + '15', borderColor: colors.danger + '30' }]} onPress={() => setVerified(false)}>
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={[styles.signOutText, { color: colors.danger }]}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={[styles.versionText, { color: colors.textMuted }]}>Sovereign Ledger v1.2.1</Text>
      </ScrollView>

      {/* Currency Picker */}
      <Modal visible={showCurrencyPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, dynamicStyles.modalContent]}>
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
            <Text style={[styles.modalTitle, dynamicStyles.textPrimary]}>Select Currency</Text>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.currencyList}>
              {CURRENCIES.map((cur) => (
                <TouchableOpacity key={cur.code} style={[styles.currencyItem, currency.code === cur.code && { backgroundColor: colors.primaryFaded }]} onPress={() => { setCurrency(cur); setShowCurrencyPicker(false); }}>
                  <View>
                    <Text style={[styles.currencyName, dynamicStyles.textPrimary]}>{cur.name}</Text>
                    <Text style={[styles.currencyCode, dynamicStyles.textSecondary]}>{cur.code} ({cur.symbol})</Text>
                  </View>
                  {currency.code === cur.code && <Ionicons name="checkmark-circle" size={22} color={colors.primary} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Export Modal */}
      <Modal visible={showExportModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.exportModalContent, dynamicStyles.modalContent]}>
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
            <Text style={[styles.modalTitle, dynamicStyles.textPrimary]}>Export Data</Text>
            <TouchableOpacity style={[styles.exportOption, dynamicStyles.surface]} onPress={handleExportCSV}>
              <View style={[styles.exportIcon, { backgroundColor: colors.success + '20' }]}><Ionicons name="document-text" size={22} color={colors.success} /></View>
              <View style={styles.exportInfo}><Text style={[styles.exportTitle, dynamicStyles.textPrimary]}>Export as CSV</Text><Text style={[styles.exportDesc, dynamicStyles.textSecondary]}>Spreadsheet-compatible format</Text></View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.exportOption, dynamicStyles.surface]} onPress={handleExportPDF}>
              <View style={[styles.exportIcon, { backgroundColor: colors.danger + '20' }]}><Ionicons name="document" size={22} color={colors.danger} /></View>
              <View style={styles.exportInfo}><Text style={[styles.exportTitle, dynamicStyles.textPrimary]}>Export as PDF</Text><Text style={[styles.exportDesc, dynamicStyles.textSecondary]}>Styled financial report</Text></View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportCancelBtn} onPress={() => setShowExportModal(false)}><Text style={[styles.exportCancelText, dynamicStyles.textSecondary]}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  gemIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  appName: { fontFamily: FontFamily.bold, fontSize: FontSize.xl },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingBottom: 100 },
  profileCard: { flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.lg, padding: Spacing.lg, gap: Spacing.md, borderWidth: 1, marginBottom: Spacing.xl },
  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: FontFamily.bold, fontSize: FontSize.lg },
  profileInfo: { flex: 1, gap: 2 },
  profileName: { fontFamily: FontFamily.semiBold, fontSize: FontSize.lg },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontFamily: FontFamily.regular, fontSize: FontSize.sm },
  settingsList: { borderRadius: BorderRadius.lg, borderWidth: 1, marginBottom: Spacing.xl },
  settingsItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, gap: Spacing.md },
  settingsIconContainer: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  settingsContent: { flex: 1, gap: 2 },
  settingsTitle: { fontFamily: FontFamily.medium, fontSize: FontSize.md },
  settingsSubtitle: { fontFamily: FontFamily.regular, fontSize: FontSize.sm },
  toggleTrack: { width: 44, height: 24, borderRadius: 12, padding: 2, justifyContent: 'center' },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFFFFF' },
  signOutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, borderRadius: BorderRadius.md, paddingVertical: Spacing.lg, borderWidth: 1 },
  signOutText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.lg },
  versionText: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, textAlign: 'center', marginTop: Spacing.xl },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: BorderRadius.xxl, borderTopRightRadius: BorderRadius.xxl, padding: Spacing.xxl, maxHeight: '70%' },
  modalHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.xl },
  modalTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.xxl, marginBottom: Spacing.lg },
  currencyList: { marginBottom: Spacing.xxl },
  currencyItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, borderRadius: BorderRadius.md, marginBottom: Spacing.xs },
  currencyName: { fontFamily: FontFamily.medium, fontSize: FontSize.lg },
  currencyCode: { fontFamily: FontFamily.regular, fontSize: FontSize.sm },
  exportModalContent: { borderTopLeftRadius: BorderRadius.xxl, borderTopRightRadius: BorderRadius.xxl, padding: Spacing.xxl, paddingBottom: Spacing.huge },
  exportOption: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.lg, borderRadius: BorderRadius.lg, borderWidth: 1, marginBottom: Spacing.md },
  exportIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  exportInfo: { flex: 1, gap: 2 },
  exportTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.lg },
  exportDesc: { fontFamily: FontFamily.regular, fontSize: FontSize.sm },
  exportCancelBtn: { paddingVertical: Spacing.lg, alignItems: 'center', marginTop: Spacing.sm },
  exportCancelText: { fontFamily: FontFamily.medium, fontSize: FontSize.md },
});

export default ProfileScreen;
