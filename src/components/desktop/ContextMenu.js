// Sovereign Ledger — Right-Click Context Menu for Desktop/Web
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily } from '../../theme/typography';
import { Shadow } from '../../theme/spacing';

const ContextMenu = ({ children, menuItems = [], onAction, colors }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const hide = () => setVisible(false);
    document.addEventListener('click', hide);
    return () => document.removeEventListener('click', hide);
  }, []);

  const handleContextMenu = (e) => {
    if (Platform.OS !== 'web') return;
    e.preventDefault?.();
    e.stopPropagation?.();
    const nativeEvent = e.nativeEvent || e;
    setPosition({ x: nativeEvent.pageX || nativeEvent.clientX || 0, y: nativeEvent.pageY || nativeEvent.clientY || 0 });
    setVisible(true);
  };

  const handleAction = (action) => {
    setVisible(false);
    onAction?.(action);
  };

  const isDark = colors?.background === '#0F1113';
  const bg = isDark ? '#1A1C1E' : '#FFFFFF';
  const border = isDark ? '#2A2D31' : '#E5E7EB';
  const txt = isDark ? '#F8F9FB' : '#1B2141';
  const muted = isDark ? '#6C7278' : '#9CA3AF';

  const webProps = Platform.OS === 'web' ? { onContextMenu: handleContextMenu } : {};

  return (
    <View ref={containerRef} {...webProps} style={{ flex: 1 }}>
      {children}
      {visible && Platform.OS === 'web' && (
        <View style={[styles.menu, { left: position.x, top: position.y, backgroundColor: bg, borderColor: border }]}>
          {menuItems.map((item, i) => {
            if (item.type === 'separator') return <View key={`s${i}`} style={[styles.sep, { backgroundColor: border }]} />;
            return (
              <TouchableOpacity key={item.action} style={styles.item} onPress={() => handleAction(item.action)}>
                {item.icon && <Ionicons name={item.icon} size={16} color={muted} style={{ marginRight: 10 }} />}
                <Text style={[styles.label, { color: txt }]}>{item.label}</Text>
                {item.shortcut && <Text style={[styles.shortcut, { color: muted }]}>{item.shortcut}</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: 'absolute', minWidth: 180, borderRadius: 8, borderWidth: 1, paddingVertical: 4, zIndex: 9999,
    ...Shadow.medium,
  },
  item: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, marginHorizontal: 4, borderRadius: 4,
  },
  label: { fontFamily: FontFamily.regular, fontSize: 13, flex: 1 },
  shortcut: { fontFamily: FontFamily.regular, fontSize: 11, marginLeft: 16 },
  sep: { height: 1, marginVertical: 4, marginHorizontal: 8 },
});

export default ContextMenu;
