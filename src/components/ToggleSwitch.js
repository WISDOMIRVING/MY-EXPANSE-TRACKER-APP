// Sovereign Ledger — Custom Toggle Switch Component
import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Colors from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing } from '../theme/spacing';

const ToggleSwitch = ({ value, onValueChange, label, description }) => {
  const translateX = useRef(new Animated.Value(value ? 20 : 0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: value ? 20 : 0,
      useNativeDriver: true,
      bounciness: 4,
      speed: 16,
    }).start();
  }, [value]);

  const handlePress = () => {
    onValueChange && onValueChange(!value);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.labelContainer}>
        {label && <Text style={styles.label}>{label}</Text>}
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      <View style={[styles.track, value && styles.trackActive]}>
        <Animated.View
          style={[
            styles.thumb,
            { transform: [{ translateX }] },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  labelContainer: {
    flex: 1,
    marginRight: Spacing.lg,
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  description: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  track: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.toggleInactive,
    padding: 2,
    justifyContent: 'center',
  },
  trackActive: {
    backgroundColor: Colors.toggleActive,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.toggleThumb,
  },
});

export default ToggleSwitch;
