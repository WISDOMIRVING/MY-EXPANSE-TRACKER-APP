// Sovereign Ledger — Keyboard Shortcuts Help Modal
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily } from '../../theme/typography';
import { KEYBOARD_SHORTCUTS } from '../../hooks/useKeyboardShortcuts';
import { useAppContext } from '../../context/AppContext';

const ShortcutsModal = ({ visible, onClose }) => {
  const { colors, themeMode } = useAppContext();
  const isDark = themeMode === 'dark';
  const bg = isDark ? '#1A1C1E' : '#FFFFFF';
  const cardBg = isDark ? '#111318' : '#F8F9FB';
  const txt = isDark ? '#F8F9FB' : '#1B2141';
  const muted = isDark ? '#6C7278' : '#9CA3AF';
  const keyBg = isDark ? '#2A2D31' : '#E5E7EB';

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: bg }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: txt }]}>Keyboard Shortcuts</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={muted} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.list}>
            {KEYBOARD_SHORTCUTS.map((s) => (
              <View key={s.keys} style={[styles.row, { borderBottomColor: isDark ? '#2A2D31' : '#F3F4F6' }]}>
                <View style={styles.rowLeft}>
                  <Ionicons name={s.icon} size={18} color={muted} />
                  <Text style={[styles.actionText, { color: txt }]}>{s.action}</Text>
                </View>
                <View style={[styles.keyBadge, { backgroundColor: keyBg }]}>
                  <Text style={[styles.keyText, { color: txt }]}>{s.keys}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  modal: { width: 400, maxHeight: 500, borderRadius: 16, padding: 24, ...Platform.select({ web: { boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }, default: {} }) },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontFamily: FontFamily.bold, fontSize: 20 },
  closeBtn: { padding: 4 },
  list: { maxHeight: 340 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  actionText: { fontFamily: FontFamily.medium, fontSize: 14 },
  keyBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  keyText: { fontFamily: FontFamily.bold, fontSize: 12 },
  doneBtn: { marginTop: 16, height: 44, borderRadius: 10, backgroundColor: '#3D8BFF', alignItems: 'center', justifyContent: 'center' },
  doneBtnText: { fontFamily: FontFamily.bold, fontSize: 14, color: '#FFF' },
});

export default ShortcutsModal;
