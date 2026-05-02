// Sovereign Ledger — Desktop Sidebar Navigation
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily } from '../../theme/typography';
import { useAppContext } from '../../context/AppContext';
import { Shadow } from '../../theme/spacing';

const SIDEBAR_ITEMS = [
  { key: 'Overview', label: 'Dashboard', icon: 'grid-outline', activeIcon: 'grid' },
  { key: 'Budgets', label: 'Budgets', icon: 'wallet-outline', activeIcon: 'wallet' },
  { key: 'Insights', label: 'Insights', icon: 'bar-chart-outline', activeIcon: 'bar-chart' },
  { key: 'Settings', label: 'Settings', icon: 'settings-outline', activeIcon: 'settings' },
];

const BOTTOM_ITEMS = [
  { key: 'help', label: 'Help Center', icon: 'help-circle-outline' },
];

const DesktopSidebar = ({ activeTab, onTabChange, onAddTransaction, sidebarWidth = 240 }) => {
  const { colors, balance, currency, themeMode } = useAppContext();
  const isDark = themeMode === 'dark';

  // Hover states for web
  const [hoveredItem, setHoveredItem] = useState(null);

  const sidebarBg = isDark ? colors.background : '#0F1628';
  const activeItemBg = isDark ? colors.primaryFaded : 'rgba(255, 255, 255, 0.1)';
  const hoverItemBg = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.06)';
  const textColor = isDark ? colors.textSecondary : 'rgba(255, 255, 255, 0.7)';
  const activeTextColor = '#FFFFFF';

  const renderNavItem = (item, isActive, isBottom = false) => {
    const isHovered = hoveredItem === item.key;
    const itemBg = isActive ? activeItemBg : isHovered ? hoverItemBg : 'transparent';
    const iconName = isActive ? item.activeIcon || item.icon : item.icon;
    const labelColor = isActive ? activeTextColor : textColor;

    const webHoverProps = Platform.OS === 'web' ? {
      onMouseEnter: () => setHoveredItem(item.key),
      onMouseLeave: () => setHoveredItem(null),
    } : {};

    return (
      <TouchableOpacity
        key={item.key}
        style={[styles.navItem, { backgroundColor: itemBg }]}
        onPress={() => {
          if (!isBottom) onTabChange(item.key);
        }}
        activeOpacity={0.7}
        {...webHoverProps}
      >
        {isActive && <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />}
        <Ionicons name={iconName} size={20} color={labelColor} />
        <Text style={[styles.navLabel, { color: labelColor }]}>{item.label}</Text>
        {item.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.sidebar, { width: sidebarWidth, backgroundColor: sidebarBg }]}>
      {/* Brand Header */}
      <View style={styles.brandSection}>
        <View style={[styles.brandIcon, { backgroundColor: colors.primary }]}>
          <Ionicons name="wallet" size={20} color="#FFF" />
        </View>
        <View>
          <Text style={styles.brandName}>Sovereign</Text>
          <Text style={styles.brandSub}>Ledger</Text>
        </View>
      </View>

      {/* Add Transaction Button */}
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={onAddTransaction}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={20} color="#FFF" />
        <Text style={styles.addButtonText}>New Transaction</Text>
      </TouchableOpacity>

      {/* Navigation Items */}
      <View style={styles.navSection}>
        <Text style={styles.navGroupTitle}>MAIN MENU</Text>
        {SIDEBAR_ITEMS.map((item) => renderNavItem(item, activeTab === item.key))}
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {BOTTOM_ITEMS.map((item) => renderNavItem(item, false, true))}
        
        {/* User Mini Card */}
        <View style={styles.userCard}>
          <View style={[styles.userAvatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.userAvatarText}>AS</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Alexander</Text>
            <Text style={styles.userRole}>Premium User</Text>
          </View>
          <TouchableOpacity style={styles.userMenuBtn}>
            <Ionicons name="ellipsis-vertical" size={16} color="rgba(255,255,255,0.5)" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    height: '100%',
    paddingVertical: 20,
    paddingHorizontal: 16,
    justifyContent: 'flex-start',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.06)',
  },
  brandSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 8,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    marginBottom: 20,
  },
  brandIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#3D8BFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  brandSub: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#3D8BFF',
    marginBottom: 24,
  },
  addButtonText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  navSection: {
    flex: 1,
  },
  navGroupTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 1.5,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 4,
    position: 'relative',
    ...(Platform.OS === 'web' ? { cursor: 'pointer', transition: 'background-color 0.2s ease' } : {}),
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 10,
    width: 3,
    borderRadius: 2,
    backgroundColor: '#3D8BFF',
  },
  navLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
  },
  badge: {
    marginLeft: 'auto',
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#FFF',
  },
  bottomSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 12,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#3D8BFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: '#FFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  userRole: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
  },
  userMenuBtn: {
    padding: 4,
  },
});

export default DesktopSidebar;
