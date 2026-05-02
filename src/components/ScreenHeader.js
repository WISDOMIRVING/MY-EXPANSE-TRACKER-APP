// Sovereign Ledger — Shared High-Fidelity Screen Header
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontFamily } from '../theme/typography';
import { useAppContext } from '../context/AppContext';

const ScreenHeader = ({ title, showBack = false, onBack, rightIcon, onRightPress }) => {
  const insets = useSafeAreaInsets();
  const { colors } = useAppContext();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20, backgroundColor: colors.heroBackground || '#1B2141' }]}>
      <View style={styles.content}>
        {showBack ? (
          <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 44 }} />
        )}
        
        <Text style={styles.title}>{title}</Text>
        
        {rightIcon ? (
          <TouchableOpacity onPress={onRightPress} style={styles.iconBtn}>
            <Ionicons name={rightIcon} size={24} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 44 }} />
        )}
      </View>
      <View style={styles.decor} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 160,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: 24,
    justifyContent: 'flex-start',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#FFFFFF',
    fontFamily: FontFamily.bold,
    fontSize: 20,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  decor: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
});

export default ScreenHeader;
