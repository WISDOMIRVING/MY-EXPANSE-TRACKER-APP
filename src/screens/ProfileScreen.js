// Sovereign Ledger — Cross-Platform Settings with Responsive Layout
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert, Modal, Animated, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontFamily } from '../theme/typography';
import { useAppContext } from '../context/AppContext';
import AnimatedScreen, { AnimatedItem } from '../components/animated/AnimatedScreen';
import useResponsiveLayout from '../hooks/useResponsiveLayout';

// Import export utils
import { exportToCSV, exportToPDF } from '../utils/export';

const ProfileScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const {
    transactions, setVerified, colors, themeMode, toggleTheme, currency, setCurrency
  } = useAppContext();
  const layout = useResponsiveLayout();
  const [showExport, setShowExport] = useState(false);
  const [showCurrency, setShowCurrency] = useState(false);

  const handleExport = async (type) => {
    try {
      if (type === 'csv') await exportToCSV(transactions, currency);
      else await exportToPDF(transactions, currency);
      setShowExport(false);
    } catch (error) {
      if (Platform.OS !== 'web') Alert.alert('Error', error.message || 'Failed to export data');
      else alert(error.message || 'Failed to export data');
    }
  };

  const settingsItems = [
    { icon: 'moon-outline', title: 'Dark Mode', subtitle: themeMode === 'dark' ? 'On' : 'Off', onPress: toggleTheme, toggle: true, toggleValue: themeMode === 'dark' },
    { icon: 'lock-closed-outline', title: 'Change Password', subtitle: 'Update your password', onPress: () => navigation?.navigate?.('ChangePassword') },
    { icon: 'cash-outline', title: 'Currency', subtitle: currency?.code || 'USD', onPress: () => setShowCurrency(true) },
    { icon: 'download-outline', title: 'Export Data', subtitle: 'CSV, PDF', onPress: () => setShowExport(true) },
    { icon: 'help-circle-outline', title: 'Help Center', subtitle: 'Get support', onPress: () => {} },
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'NGN'];

  return (
    <AnimatedScreen animation="fadeSlideUp">
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: layout.isDesktopLayout ? 20 : insets.top }]}>
        <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />

        <View style={styles.header}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatar, { backgroundColor: '#F3F4F6' }]}>
              <Ionicons name="person" size={24} color="#1B2141" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.secondary }]}>Financial Sterling</Text>
              <View style={styles.verifiedRow}>
                <Ionicons name="shield-checkmark" size={14} color={colors.success} />
                <Text style={[styles.verifiedText, { color: colors.success }]}>Verified Account</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notificationBtn}>
              <Ionicons name="notifications-outline" size={24} color={colors.secondary} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          style={{ flex: 1 }}
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
          {/* Promo Cards */}
          <AnimatedItem index={0}>
            <View style={styles.promoRow}>
              <View style={[styles.promoCard, { backgroundColor: '#F3F4F6' }]}>
                <View style={styles.promoIconContainer}>
                  <Ionicons name="gift-outline" size={20} color="#1B2141" />
                </View>
                <Text style={styles.promoTitle}>Refer & Earn</Text>
              </View>
              <View style={[styles.promoCard, { backgroundColor: '#1B2141', flex: 1.5 }]}>
                <View style={[styles.promoIconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <Ionicons name="people-outline" size={20} color="#FFF" />
                </View>
                <Text style={[styles.promoTitle, { color: '#FFF' }]}>Invite friend & get reward</Text>
              </View>
            </View>
          </AnimatedItem>

          <Text style={styles.sectionTitle}>ACCOUNT SETTINGS</Text>
          <View style={[styles.settingsList, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {settingsItems.map((item, index) => (
              <AnimatedItem key={item.title} index={index + 1}>
                <TouchableOpacity
                  style={[styles.settingsItem, index < settingsItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
                  onPress={item.onPress}
                  accessibilityRole="button"
                  accessibilityLabel={item.title}
                >
                  <View style={[styles.settingsIconContainer, { backgroundColor: '#F3F4F6' }]}>
                    <Ionicons name={item.icon} size={20} color="#1B2141" />
                  </View>
                  <View style={styles.settingsContent}>
                    <Text style={[styles.settingsTitle, { color: colors.secondary }]}>{item.title}</Text>
                    <Text style={styles.settingsSubtitle}>{item.subtitle}</Text>
                  </View>
                  {item.toggle ? (
                    <View style={[styles.toggleTrack, { backgroundColor: item.toggleValue ? '#10B981' : '#E5E7EB' }]}>
                      <View style={[styles.toggleThumb, item.toggleValue && { alignSelf: 'flex-end' }]} />
                    </View>
                  ) : (
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              </AnimatedItem>
            ))}
          </View>

          {/* Platform Info Card */}
          <AnimatedItem index={6}>
            <View style={[styles.platformCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="desktop-outline" size={20} color={colors.secondary} />
              <View style={styles.platformInfo}>
                <Text style={[styles.platformTitle, { color: colors.secondary }]}>
                  {layout.isDesktopLayout ? '🖥 Desktop' : layout.isTabletLayout ? '📱 Tablet' : '📱 Mobile'} View
                </Text>
                <Text style={styles.platformSub}>
                  {layout.width}×{layout.height} • {layout.platformType}
                </Text>
              </View>
            </View>
          </AnimatedItem>

          <TouchableOpacity style={styles.logoutBtn} onPress={() => setVerified(false)}>
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>

          <Text style={styles.versionText}>Version 2.0.0 • Cross-Platform</Text>
        </ScrollView>

        {/* Export Modal */}
        <Modal visible={showExport} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
              <Text style={[styles.modalTitle, { color: colors.secondary }]}>Export Data</Text>
              <TouchableOpacity style={styles.modalOption} onPress={() => handleExport('csv')}>
                <Ionicons name="document-text-outline" size={24} color="#1B2141" />
                <Text style={[styles.modalOptionText, { color: colors.secondary }]}>Export as CSV</Text>
              </TouchableOpacity>
              {Platform.OS !== 'web' && (
                <TouchableOpacity style={styles.modalOption} onPress={() => handleExport('pdf')}>
                  <Ionicons name="document-outline" size={24} color="#1B2141" />
                  <Text style={[styles.modalOptionText, { color: colors.secondary }]}>Export as PDF</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.modalClose} onPress={() => setShowExport(false)}>
                <Text style={styles.modalCloseText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Currency Modal */}
        <Modal visible={showCurrency} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
              <Text style={[styles.modalTitle, { color: colors.secondary }]}>Select Currency</Text>
              {currencies.map(c => (
                <TouchableOpacity key={c} style={styles.modalOption} onPress={() => { setCurrency(c); setShowCurrency(false); }}>
                  <Text style={[styles.modalOptionText, { color: colors.secondary }, currency?.code === c && { color: '#2F7CF6', fontWeight: 'bold' }]}>{c}</Text>
                  {currency?.code === c && <Ionicons name="checkmark" size={20} color="#2F7CF6" />}
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.modalClose} onPress={() => setShowCurrency(false)}>
                <Text style={styles.modalCloseText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </AnimatedScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingVertical: 20 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  profileInfo: { flex: 1, gap: 2 },
  profileName: { fontFamily: FontFamily.bold, fontSize: 18 },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  verifiedText: { fontFamily: FontFamily.medium, fontSize: 12 },
  notificationBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingBottom: 100 },
  promoRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  promoCard: { flex: 1, borderRadius: 16, padding: 16, gap: 12, justifyContent: 'space-between' },
  promoIconContainer: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  promoTitle: { fontFamily: FontFamily.bold, fontSize: 13, color: '#1B2141' },
  sectionTitle: { fontFamily: FontFamily.bold, fontSize: 12, color: '#9CA3AF', letterSpacing: 1, marginBottom: 16 },
  settingsList: { borderRadius: 24, borderWidth: 1, overflow: 'hidden' },
  settingsItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 16 },
  settingsIconContainer: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  settingsContent: { flex: 1, gap: 2 },
  settingsTitle: { fontFamily: FontFamily.bold, fontSize: 15 },
  settingsSubtitle: { fontFamily: FontFamily.medium, fontSize: 12, color: '#9CA3AF' },
  toggleTrack: { width: 44, height: 24, borderRadius: 12, padding: 2, justifyContent: 'center' },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFFFFF' },
  platformCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, borderWidth: 1, marginTop: 20,
  },
  platformInfo: { flex: 1 },
  platformTitle: { fontFamily: FontFamily.bold, fontSize: 14 },
  platformSub: { fontFamily: FontFamily.regular, fontSize: 12, color: '#9CA3AF' },
  logoutBtn: { marginTop: 32, height: 56, borderRadius: 16, borderWidth: 1, borderColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center' },
  logoutText: { fontFamily: FontFamily.bold, fontSize: 16, color: '#EF4444' },
  versionText: { fontFamily: FontFamily.medium, fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginTop: 24 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40 },
  modalTitle: { fontFamily: FontFamily.bold, fontSize: 20, marginBottom: 24, textAlign: 'center' },
  modalOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', gap: 16, justifyContent: 'space-between' },
  modalOptionText: { fontFamily: FontFamily.medium, fontSize: 16 },
  modalClose: { marginTop: 24, alignItems: 'center' },
  modalCloseText: { fontFamily: FontFamily.bold, fontSize: 16, color: '#9CA3AF' },
});

export default ProfileScreen;
