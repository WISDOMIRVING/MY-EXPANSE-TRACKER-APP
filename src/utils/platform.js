// Sovereign Ledger — Cross-Platform Detection Utility
import { Platform, Dimensions } from 'react-native';

/**
 * Detect if running inside Electron desktop shell
 */
export const isElectron = () => {
  if (Platform.OS === 'web') {
    try {
      return typeof window !== 'undefined' &&
        (window.navigator.userAgent.toLowerCase().includes('electron') ||
         (typeof window.electronAPI !== 'undefined'));
    } catch (e) {
      return false;
    }
  }
  return false;
};

/**
 * Get the current platform type: 'mobile' | 'web' | 'desktop'
 */
export const getPlatformType = () => {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    return 'mobile';
  }
  if (isElectron()) {
    return 'desktop';
  }
  if (Platform.OS === 'web') {
    return 'web';
  }
  return 'mobile';
};

/**
 * Get detailed platform info
 */
export const getPlatformInfo = () => {
  const { width, height } = Dimensions.get('window');
  const type = getPlatformType();

  return {
    type,
    os: Platform.OS,
    isDesktop: type === 'desktop',
    isWeb: type === 'web',
    isMobile: type === 'mobile',
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',
    isElectron: isElectron(),
    screenWidth: width,
    screenHeight: height,
    isLargeScreen: width >= 768,
    isExtraLargeScreen: width >= 1200,
    supportsHover: type === 'web' || type === 'desktop',
    supportsTouchId: Platform.OS === 'ios' || Platform.OS === 'android',
    supportsKeyboardShortcuts: type === 'web' || type === 'desktop',
  };
};

/**
 * Check if current device is a touch device (even on web)
 */
export const isTouchDevice = () => {
  if (Platform.OS === 'ios' || Platform.OS === 'android') return true;
  if (Platform.OS === 'web') {
    try {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    } catch (e) {
      return false;
    }
  }
  return false;
};

/**
 * Breakpoints for responsive design
 */
export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
};

/**
 * Get device layout class based on screen width
 */
export const getLayoutClass = (width) => {
  if (width >= BREAKPOINTS.wide) return 'wide';
  if (width >= BREAKPOINTS.desktop) return 'desktop';
  if (width >= BREAKPOINTS.tablet) return 'tablet';
  return 'mobile';
};

export default {
  getPlatformType,
  getPlatformInfo,
  isElectron,
  isTouchDevice,
  BREAKPOINTS,
  getLayoutClass,
};
