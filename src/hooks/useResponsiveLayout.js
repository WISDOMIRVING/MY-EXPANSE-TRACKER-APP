// Sovereign Ledger — Responsive Layout Hook
import { useState, useEffect, useCallback } from 'react';
import { Dimensions, Platform } from 'react-native';
import { BREAKPOINTS, getLayoutClass, getPlatformType } from '../utils/platform';

/**
 * Hook that provides responsive layout information based on window dimensions.
 * Updates dynamically on resize (crucial for desktop/web).
 */
const useResponsiveLayout = () => {
  const [dimensions, setDimensions] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  });

  useEffect(() => {
    const handler = ({ window }) => {
      setDimensions({ width: window.width, height: window.height });
    };

    const subscription = Dimensions.addEventListener('change', handler);
    return () => {
      if (subscription?.remove) {
        subscription.remove();
      }
    };
  }, []);

  const { width, height } = dimensions;
  const layoutClass = getLayoutClass(width);
  const platformType = getPlatformType();

  const isMobileLayout = layoutClass === 'mobile';
  const isTabletLayout = layoutClass === 'tablet';
  const isDesktopLayout = layoutClass === 'desktop' || layoutClass === 'wide';
  const isWideLayout = layoutClass === 'wide';

  // Show sidebar on desktop/wide layouts
  const showSidebar = isDesktopLayout;
  // Show bottom tabs only on mobile layout
  const showBottomTabs = isMobileLayout;
  // Show desktop menu bar on desktop
  const showMenuBar = (platformType === 'desktop' || platformType === 'web') && isDesktopLayout;

  // Content area calculations
  const sidebarWidth = isWideLayout ? 280 : isDesktopLayout ? 240 : 0;
  const contentWidth = width - sidebarWidth;

  // Grid columns for responsive grids
  const gridColumns = isWideLayout ? 4 : isDesktopLayout ? 3 : isTabletLayout ? 2 : 1;

  // Padding scales
  const containerPadding = isDesktopLayout ? 32 : isTabletLayout ? 24 : 16;

  // Max content width for readability on very wide screens
  const maxContentWidth = isWideLayout ? 1200 : isDesktopLayout ? 960 : undefined;

  // Font scale for larger screens
  const fontScale = isDesktopLayout ? 1.05 : 1;

  return {
    width,
    height,
    layoutClass,
    platformType,
    isMobileLayout,
    isTabletLayout,
    isDesktopLayout,
    isWideLayout,
    showSidebar,
    showBottomTabs,
    showMenuBar,
    sidebarWidth,
    contentWidth,
    gridColumns,
    containerPadding,
    maxContentWidth,
    fontScale,
  };
};

export default useResponsiveLayout;
