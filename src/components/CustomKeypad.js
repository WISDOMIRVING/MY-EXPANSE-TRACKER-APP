// Sovereign Ledger — Pixel Perfect Custom Keypad
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';
import { useAppContext } from '../context/AppContext';

const CustomKeypad = ({ value, onChange, onContinue }) => {
  const { colors } = useAppContext();

  const handlePress = (num) => {
    let newValue = value;
    if (num === 'back') {
      newValue = value.slice(0, -1);
      if (newValue === '' || newValue === '0.') newValue = '0.00';
    } else if (num === '.') {
      if (!value.includes('.')) newValue = value + '.';
    } else {
      if (value === '0.00' || value === '0') {
        newValue = num;
      } else {
        newValue = value + num;
      }
    }
    
    // Formatting logic (simple)
    if (newValue.includes('.')) {
      const [int, dec] = newValue.split('.');
      if (dec && dec.length > 2) return;
    }
    
    onChange(newValue);
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'back'];

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {keys.map((key) => (
          <TouchableOpacity
            key={key}
            style={[styles.key, { backgroundColor: colors.background }]}
            onPress={() => handlePress(key)}
          >
            {key === 'back' ? (
              <Ionicons name="backspace-outline" size={24} color={colors.textPrimary} />
            ) : (
              <Text style={[styles.keyText, { color: colors.textPrimary }]}>{key}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.continueBtn, { backgroundColor: colors.primaryFaded }]}
        onPress={onContinue}
      >
        <Text style={[styles.continueText, { color: colors.primary }]}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  key: {
    width: '30%',
    aspectRatio: 1.5,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xxl,
  },
  continueBtn: {
    width: '100%',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
  },
});

export default CustomKeypad;
