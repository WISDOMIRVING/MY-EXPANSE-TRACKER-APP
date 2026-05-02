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
      if (newValue === '') newValue = '0.00';
    } else if (num === '.') {
      if (!value.includes('.')) newValue = value + '.';
    } else {
      if (value === '0.00' || value === '0') {
        newValue = num;
      } else {
        newValue = value + num;
      }
    }
    
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
            style={styles.key}
            onPress={() => handlePress(key)}
          >
            {key === 'back' ? (
              <Ionicons name="backspace-outline" size={24} color={colors.secondary} />
            ) : (
              <Text style={[styles.keyText, { color: colors.secondary }]}>{key}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.continueBtn, { backgroundColor: '#EBF2FF' }]} // Light blue for continue
        onPress={onContinue}
      >
        <Text style={[styles.continueText, { color: '#2F7CF6' }]}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  key: {
    width: '33%',
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontFamily: FontFamily.medium,
    fontSize: 24,
  },
  continueBtn: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
  },
});

export default CustomKeypad;
