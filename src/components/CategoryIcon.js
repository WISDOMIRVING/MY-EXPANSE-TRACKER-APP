// Sovereign Ledger — Category Icon Component with Figma Pastel Palette
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

const CATEGORY_CONFIG = {
  Food: { icon: 'restaurant', color: '#F2994A', bg: '#FFF5ED' },
  'Dining Out': { icon: 'restaurant', color: '#E67E22', bg: '#FDF2E9' },
  Transport: { icon: 'car', color: '#2F7CF6', bg: '#EBF2FF' },
  Housing: { icon: 'home', color: '#219653', bg: '#E9F5EE' },
  Shopping: { icon: 'cart', color: '#9B51E4', bg: '#F5EEFD' },
  Groceries: { icon: 'basket', color: '#1ABC9C', bg: '#E8F8F5' },
  Salary: { icon: '#27AE60', color: '#27AE60', bg: '#EAF7EE' },
  Entertainment: { icon: 'game-controller', color: '#F2C94C', bg: '#FEF9E7' },
  Health: { icon: 'medkit', color: '#EB5757', bg: '#FDECEC' },
  Other: { icon: 'ellipsis-horizontal', color: '#828282', bg: '#F2F2F2' },
};

const CategoryIcon = ({ category, size = 44, iconSize = 20 }) => {
  const { themeMode } = useAppContext();
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.Other;

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: 12, backgroundColor: getCategoryBg(category, themeMode) }]}>
      <Ionicons name={config.icon} size={iconSize} color={config.color} />
    </View>
  );
};

export const getCategoryColor = (category) => {
  return (CATEGORY_CONFIG[category] || CATEGORY_CONFIG.Other).color;
};

export const getCategoryBg = (category, themeMode = 'light') => {
  const color = getCategoryColor(category);
  if (themeMode === 'dark') {
    return `${color}26`; // 15% opacity
  }
  return (CATEGORY_CONFIG[category] || CATEGORY_CONFIG.Other).bg;
};

export const getCategoryIcon = (category) => {
  return (CATEGORY_CONFIG[category] || CATEGORY_CONFIG.Other).icon;
};

export const CATEGORIES = Object.keys(CATEGORY_CONFIG);
export const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Housing', 'Shopping', 'Groceries', 'Entertainment', 'Health', 'Other'];
export const INCOME_CATEGORIES = ['Salary', 'Other'];

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CategoryIcon;
