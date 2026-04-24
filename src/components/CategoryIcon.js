// Sovereign Ledger — Category Icon Component
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';

const CATEGORY_CONFIG = {
  Food: { icon: 'restaurant', color: Colors.categoryFood, bg: 'rgba(242, 153, 74, 0.15)' },
  'Dining Out': { icon: 'restaurant', color: Colors.categoryDining, bg: 'rgba(230, 126, 34, 0.15)' },
  Transport: { icon: 'car', color: Colors.categoryTransport, bg: 'rgba(47, 124, 246, 0.15)' },
  Housing: { icon: 'home', color: Colors.categoryHousing, bg: 'rgba(33, 150, 83, 0.15)' },
  Shopping: { icon: 'cart', color: Colors.categoryShopping, bg: 'rgba(155, 81, 224, 0.15)' },
  Groceries: { icon: 'basket', color: Colors.categoryGroceries, bg: 'rgba(26, 188, 156, 0.15)' },
  Salary: { icon: 'cash', color: Colors.categorySalary, bg: 'rgba(39, 174, 96, 0.15)' },
  Entertainment: { icon: 'game-controller', color: Colors.categoryEntertainment, bg: 'rgba(242, 201, 76, 0.15)' },
  Health: { icon: 'medkit', color: Colors.categoryHealth, bg: 'rgba(235, 87, 87, 0.15)' },
  Other: { icon: 'ellipsis-horizontal', color: Colors.categoryOther, bg: 'rgba(130, 130, 130, 0.15)' },
};

const CategoryIcon = ({ category, size = 40, iconSize = 20 }) => {
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.Other;

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2.5, backgroundColor: config.bg }]}>
      <Ionicons name={config.icon} size={iconSize} color={config.color} />
    </View>
  );
};

export const getCategoryColor = (category) => {
  return (CATEGORY_CONFIG[category] || CATEGORY_CONFIG.Other).color;
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
