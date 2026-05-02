// Sovereign Ledger — Keyboard Shortcuts Hook for Desktop/Web
import { useEffect, useCallback } from 'react';
import { Platform } from 'react-native';

/**
 * Global keyboard shortcuts for desktop/web.
 * Registers document-level keydown listeners.
 * 
 * @param {Object} shortcuts - Map of shortcut configs
 * @param {Object} navigation - React Navigation object
 * @param {Object} actions - Additional action callbacks
 */
const useKeyboardShortcuts = (navigation, actions = {}) => {
  const handleKeyDown = useCallback((event) => {
    // Only handle on web platform
    if (Platform.OS !== 'web') return;

    const { key, ctrlKey, metaKey, shiftKey, altKey } = event;
    const modifier = ctrlKey || metaKey; // Support both Ctrl (Windows) and Cmd (Mac)

    if (!modifier) return;

    let handled = false;

    switch (key.toLowerCase()) {
      case 'n':
        // Ctrl+N: New Transaction
        if (!shiftKey && !altKey) {
          event.preventDefault();
          if (navigation?.navigate) {
            navigation.navigate('AddTransaction');
          }
          handled = true;
        }
        break;

      case 'e':
        // Ctrl+E: Export Data
        if (!shiftKey && !altKey) {
          event.preventDefault();
          if (actions.onExport) actions.onExport();
          handled = true;
        }
        break;

      case 'd':
        // Ctrl+D: Go to Dashboard
        if (!shiftKey && !altKey) {
          event.preventDefault();
          if (navigation?.navigate) {
            navigation.navigate('Overview');
          }
          handled = true;
        }
        break;

      case 'b':
        // Ctrl+B: Go to Budgets
        if (!shiftKey && !altKey) {
          event.preventDefault();
          if (navigation?.navigate) {
            navigation.navigate('Budgets');
          }
          handled = true;
        }
        break;

      case 'i':
        // Ctrl+I: Go to Insights
        if (!shiftKey && !altKey) {
          event.preventDefault();
          if (navigation?.navigate) {
            navigation.navigate('Insights');
          }
          handled = true;
        }
        break;

      case ',':
        // Ctrl+,: Open Settings
        if (!shiftKey && !altKey) {
          event.preventDefault();
          if (navigation?.navigate) {
            navigation.navigate('Settings');
          }
          handled = true;
        }
        break;

      case 't':
        // Ctrl+T: Toggle Theme
        if (!shiftKey && !altKey) {
          event.preventDefault();
          if (actions.onToggleTheme) actions.onToggleTheme();
          handled = true;
        }
        break;

      case '/':
        // Ctrl+/: Show keyboard shortcuts help
        if (!shiftKey && !altKey) {
          event.preventDefault();
          if (actions.onShowShortcuts) actions.onShowShortcuts();
          handled = true;
        }
        break;

      default:
        break;
    }

    return handled;
  }, [navigation, actions]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    // Listen for standard keyboard events
    document.addEventListener('keydown', handleKeyDown);

    // Listen for custom events from Electron menu
    const handleElectronShortcut = (e) => {
      const action = e.detail;
      switch (action) {
        case 'newTransaction': navigation?.navigate?.('AddTransaction'); break;
        case 'export': if (actions.onExport) actions.onExport(); break;
        case 'dashboard': navigation?.navigate?.('Overview'); break;
        case 'budgets': navigation?.navigate?.('Budgets'); break;
        case 'insights': navigation?.navigate?.('Insights'); break;
        case 'settings': navigation?.navigate?.('Settings'); break;
        case 'toggleTheme': if (actions.onToggleTheme) actions.onToggleTheme(); break;
        case 'shortcuts': if (actions.onShowShortcuts) actions.onShowShortcuts(); break;
      }
    };

    window.addEventListener('app-shortcut', handleElectronShortcut);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('app-shortcut', handleElectronShortcut);
    };
  }, [handleKeyDown, navigation, actions]);
};

/**
 * List of all available keyboard shortcuts for UI display
 */
export const KEYBOARD_SHORTCUTS = [
  { keys: 'Ctrl + N', action: 'New Transaction', icon: 'add-circle-outline' },
  { keys: 'Ctrl + E', action: 'Export Data', icon: 'download-outline' },
  { keys: 'Ctrl + D', action: 'Dashboard', icon: 'grid-outline' },
  { keys: 'Ctrl + B', action: 'Budgets', icon: 'wallet-outline' },
  { keys: 'Ctrl + I', action: 'Insights', icon: 'bar-chart-outline' },
  { keys: 'Ctrl + ,', action: 'Settings', icon: 'settings-outline' },
  { keys: 'Ctrl + T', action: 'Toggle Theme', icon: 'moon-outline' },
  { keys: 'Ctrl + /', action: 'Show Shortcuts', icon: 'help-circle-outline' },
];

export default useKeyboardShortcuts;
