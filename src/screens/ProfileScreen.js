// Sovereign Ledger — Profile / Settings Screen
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
  Modal, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';
import { useAppContext } from '../context/AppContext';
import { CURRENCIES, formatCurrency } from '../utils/currency';
import { exportCSV, exportPDF } from '../utils/export';

const ProfileScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { currency, setCurrency, transactions, setVerified, balance, totalIncome, totalExpenses } = useAppContext();
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);

  const handleExportCSV = async () => {
    const result = await exportCSV(transactions, currency);
    if (result.success) {
      setShowExportModal(false);
    } else {
      Alert.alert('Export Failed', result.error || 'Could not export data.');
    }
  };

  const handleExportPDF = async () => {
    const result = await exportPDF(transactions, { balance, totalIncome, totalExpenses }, currency);
    if (result.success) {
      setShowExportModal(false);
    } else {
      Alert.alert('Export Failed', result.error || 'Could not export data.');
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'This will lock the app and require re-verification. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => setVerified(false),
        },
      ]
    );
  };

  const settingsItems = [
    {
      icon: 'lock-closed-outline',
      title: 'User Password',
      subtitle: 'Change your password',
      onPress: () => navigation.navigate('ChangePassword'),
      color: Colors.textPrimary,
    },
    {
      icon: 'card-outline',
      title: 'Currency',
      subtitle: `${currency.name} (${currency.symbol})`,
      onPress: () => setShowCurrencyPicker(true),
      color: Colors.textPrimary,
    },
    {
      icon: 'language-outline',
      title: 'Language',
      subtitle: 'English',
      onPress: () => {},
      color: Colors.textPrimary,
    },
    {
      icon: 'scan-outline',
      title: 'Biometrics',
      subtitle: biometricsEnabled ? 'Enabled' : 'Disabled',
      onPress: () => setBiometricsEnabled(!biometricsEnabled),
      color: Colors.textPrimary,
      toggle: true,
      toggleValue: biometricsEnabled,
    },
    {
      icon: 'download-outline',
      title: 'Export Data',
      subtitle: 'CSV or PDF',
      onPress: () => setShowExportModal(true),
      color: Colors.textPrimary,
    },
    {
      icon: 'help-circle-outline',
      title: 'Help Center',
      subtitle: 'FAQs and support',
      onPress: () => {},
      color: Colors.textPrimary,
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.gemIcon}>
            <Ionicons name="diamond" size={16} color={Colors.primary} />
          </View>
          <Text style={styles.appName}>Sovereign Ledger</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AS</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Alexander Sterling</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>protected</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.shareBtn}>
            <Ionicons name="share-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Settings List */}
        <View style={styles.settingsList}>
          {settingsItems.map((item, index) => (
            <TouchableOpacity
              key={item.title}
              style={[
                styles.settingsItem,
                index < settingsItems.length - 1 && styles.settingsItemBorder,
              ]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.settingsIconContainer}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <View style={styles.settingsContent}>
                <Text style={styles.settingsTitle}>{item.title}</Text>
                <Text style={styles.settingsSubtitle}>{item.subtitle}</Text>
              </View>
              {item.toggle ? (
                <View style={[styles.toggleTrack, item.toggleValue && styles.toggleTrackActive]}>
                  <View style={[styles.toggleThumb, item.toggleValue && styles.toggleThumbActive]} />
                </View>
              ) : (
                <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.versionText}>Sovereign Ledger v1.0.0</Text>
      </ScrollView>

      {/* Currency Picker Modal */}
      <Modal
        visible={showCurrencyPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCurrencyPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Currency</Text>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.currencyList}>
              {CURRENCIES.map((cur) => {
                const isSelected = currency.code === cur.code;
                return (
                  <TouchableOpacity
                    key={cur.code}
                    style={[styles.currencyItem, isSelected && styles.currencyItemSelected]}
                    onPress={() => {
                      setCurrency(cur);
                      setShowCurrencyPicker(false);
                    }}
                  >
                    <View>
                      <Text style={styles.currencyName}>{cur.name}</Text>
                      <Text style={styles.currencyCode}>{cur.code} ({cur.symbol})</Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Export Modal */}
      <Modal
        visible={showExportModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowExportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.exportModalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Export Data</Text>
            <Text style={styles.exportSubtitle}>
              {transactions.length} transactions will be exported
            </Text>

            <TouchableOpacity style={styles.exportOption} onPress={handleExportCSV}>
              <View style={[styles.exportIcon, { backgroundColor: Colors.successFaded }]}>
                <Ionicons name="document-text" size={22} color={Colors.success} />
              </View>
              <View style={styles.exportInfo}>
                <Text style={styles.exportTitle}>Export as CSV</Text>
                <Text style={styles.exportDesc}>Spreadsheet-compatible format</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.exportOption} onPress={handleExportPDF}>
              <View style={[styles.exportIcon, { backgroundColor: Colors.dangerFaded }]}>
                <Ionicons name="document" size={22} color={Colors.danger} />
              </View>
              <View style={styles.exportInfo}>
                <Text style={styles.exportTitle}>Export as PDF</Text>
                <Text style={styles.exportDesc}>Styled financial report</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.exportCancelBtn}
              onPress={() => setShowExportModal(false)}
            >
              <Text style={styles.exportCancelText}>Cancel</Text>
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
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  gemIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  statusText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.success,
  },
  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsList: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  settingsItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  settingsIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.cardElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsContent: {
    flex: 1,
    gap: 2,
  },
  settingsTitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  settingsSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  toggleTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.toggleInactive,
    padding: 2,
    justifyContent: 'center',
  },
  toggleTrackActive: {
    backgroundColor: Colors.toggleActive,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.toggleThumb,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.dangerFaded,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(235, 87, 87, 0.3)',
  },
  signOutText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.danger,
  },
  versionText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xl,
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
    maxHeight: '70%',
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
    marginBottom: Spacing.lg,
  },
  currencyList: {
    marginBottom: Spacing.xxl,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
  },
  currencyItemSelected: {
    backgroundColor: Colors.primaryFaded,
  },
  currencyName: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  currencyCode: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  exportModalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
    paddingBottom: Spacing.huge,
  },
  exportSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  exportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  exportIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportInfo: {
    flex: 1,
    gap: 2,
  },
  exportTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  exportDesc: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  exportCancelBtn: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  exportCancelText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
});

export default ProfileScreen;
