// Sovereign Ledger — Desktop Application Menu Bar
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { FontFamily } from '../../theme/typography';
import { useAppContext } from '../../context/AppContext';
import { Shadow } from '../../theme/spacing';

const MENUS = {
  File: [
    { label: 'New Transaction', shortcut: 'Ctrl+N', action: 'newTransaction' },
    { label: 'Export as CSV', shortcut: 'Ctrl+E', action: 'exportCSV' },
    { label: 'Export as PDF', action: 'exportPDF' },
    { type: 'separator' },
    { label: 'Print Report', shortcut: 'Ctrl+P', action: 'print' },
  ],
  Edit: [
    { label: 'Undo', shortcut: 'Ctrl+Z', action: 'undo' },
    { label: 'Redo', shortcut: 'Ctrl+Y', action: 'redo' },
    { type: 'separator' },
    { label: 'Select All', shortcut: 'Ctrl+A', action: 'selectAll' },
  ],
  View: [
    { label: 'Dashboard', shortcut: 'Ctrl+D', action: 'viewDashboard' },
    { label: 'Budgets', shortcut: 'Ctrl+B', action: 'viewBudgets' },
    { label: 'Insights', shortcut: 'Ctrl+I', action: 'viewInsights' },
    { label: 'Settings', shortcut: 'Ctrl+,', action: 'viewSettings' },
    { type: 'separator' },
    { label: 'Toggle Dark Mode', shortcut: 'Ctrl+T', action: 'toggleTheme' },
  ],
  Help: [
    { label: 'Keyboard Shortcuts', shortcut: 'Ctrl+/', action: 'showShortcuts' },
    { label: 'Seed Sample Data', action: 'seedData' },
    { label: 'About Sovereign Ledger', action: 'about' },
  ],
};

const DesktopMenuBar = ({ onMenuAction }) => {
  const { themeMode } = useAppContext();
  const isDark = themeMode === 'dark';
  const [activeMenu, setActiveMenu] = useState(null);
  const [hovered, setHovered] = useState(null);

  const bg = isDark ? '#0D1117' : '#F8F9FB';
  const border = isDark ? 'rgba(240, 246, 252, 0.1)' : '#E5E7EB';
  const dropBg = isDark ? '#161B22' : '#FFF';
  const txt = isDark ? '#E6EDF3' : '#1B2141';
  const muted = isDark ? '#8B949E' : '#9CA3AF';
  const hoverBg = isDark ? 'rgba(88, 166, 255, 0.1)' : 'rgba(27, 33, 65, 0.06)';

  const fire = (action) => { setActiveMenu(null); onMenuAction?.(action); };

  const webH = (k) => Platform.OS === 'web' ? {
    onMouseEnter: () => setHovered(k), onMouseLeave: () => setHovered(null),
  } : {};

  return (
    <View style={[styles.bar, { backgroundColor: bg, borderBottomColor: border }]}>  
      {Object.keys(MENUS).map((mk) => (
        <View key={mk} style={styles.wrap}>
          <TouchableOpacity
            style={[styles.btn, activeMenu === mk && { backgroundColor: hoverBg }]}
            onPress={() => setActiveMenu(activeMenu === mk ? null : mk)}
          >
            <Text style={[styles.btnTxt, { color: txt }]}>{mk}</Text>
          </TouchableOpacity>
          {activeMenu === mk && (
            <View style={[styles.drop, { backgroundColor: dropBg, borderColor: border }]}>
              {MENUS[mk].map((item, i) => {
                if (item.type === 'separator') return <View key={`s${i}`} style={[styles.sep, { backgroundColor: border }]} />;
                return (
                  <TouchableOpacity key={item.action} style={[styles.dItem, hovered === item.action && { backgroundColor: hoverBg }]}
                    onPress={() => fire(item.action)} {...webH(item.action)}>
                    <Text style={[styles.dLabel, { color: txt }]}>{item.label}</Text>
                    {item.shortcut && <Text style={[styles.dShort, { color: muted }]}>{item.shortcut}</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      ))}
      {activeMenu && <TouchableOpacity style={styles.ov} onPress={() => setActiveMenu(null)} activeOpacity={1} />}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', height: 36, paddingHorizontal: 8, borderBottomWidth: 1, zIndex: 1000 },
  wrap: { position: 'relative', zIndex: 1001 },
  btn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  btnTxt: { fontFamily: FontFamily.medium, fontSize: 13 },
  drop: { position: 'absolute', top: '100%', left: 0, minWidth: 220, borderRadius: 8, borderWidth: 1, paddingVertical: 4, ...Shadow.medium, zIndex: 1002 },
  dItem: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 8, marginHorizontal: 4, borderRadius: 4 },
  dLabel: { fontFamily: FontFamily.regular, fontSize: 13 },
  dShort: { fontFamily: FontFamily.regular, fontSize: 12, marginLeft: 24 },
  sep: { height: 1, marginVertical: 4, marginHorizontal: 8 },
  ov: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: 2000, zIndex: 999 },
});

export default DesktopMenuBar;
