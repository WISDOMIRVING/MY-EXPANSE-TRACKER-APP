// Sovereign Ledger — Custom Numeric Keypad
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';

const { width } = Dimensions.get('window');
const KEY_SIZE = (width - Spacing.xxxl * 2 - Spacing.md * 2) / 3;

const CustomKeypad = ({ onKeyPress, onDelete, onClear }) => {
  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', 'delete'],
  ];

  const handlePress = (key) => {
    if (key === 'delete') {
      onDelete && onDelete();
    } else {
      onKeyPress && onKeyPress(key);
    }
  };

  return (
    <View style={styles.container}>
      {keys.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.key,
                key === 'delete' && styles.deleteKey,
              ]}
              onPress={() => handlePress(key)}
              activeOpacity={0.6}
            >
              {key === 'delete' ? (
                <Ionicons name="backspace-outline" size={24} color={Colors.textPrimary} />
              ) : (
                <Text style={styles.keyText}>{key}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  key: {
    flex: 1,
    height: 56,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteKey: {
    backgroundColor: Colors.surfaceLight,
  },
  keyText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xxl,
    color: Colors.textPrimary,
  },
});

export default CustomKeypad;
