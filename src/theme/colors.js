// Sovereign Ledger — Pixel Perfect Design Tokens
export const LightTheme = {
  // Brand & Accents
  primary: '#2563EB', // Modern accessible blue (WCAG AA on white)
  primaryFaded: 'rgba(37, 99, 235, 0.1)',
  secondary: '#0F172A', // Slate 900 for high-contrast headers
  
  // Backgrounds & Surfaces
  background: '#F8FAFC', // Slate 50 (Soft, reduces eye strain vs pure white)
  surface: '#FFFFFF', // Pure white for cards to pop against background
  surfaceElevated: '#FFFFFF',
  heroBackground: '#0F172A', // Deep slate for hero sections
  
  // Borders
  border: '#E2E8F0', // Slate 200
  
  // Typography
  textPrimary: '#0F172A', // Slate 900
  textSecondary: '#475569', // Slate 600
  textMuted: '#94A3B8', // Slate 400
  
  // Semantic Colors (WCAG compliant)
  success: '#059669', // Emerald 600
  successFaded: '#D1FAE5',
  warning: '#D97706', // Amber 600
  warningFaded: '#FEF3C7',
  danger: '#DC2626', // Red 600
  dangerFaded: '#FEE2E2',
  info: '#2563EB', // Blue 600
  infoFaded: '#DBEAFE',
  toggleInactive: '#CBD5E1', // Slate 300
  
  // Category specific colors
  housing: '#2563EB',
  food: '#059669',
  transport: '#8B5CF6',
  shopping: '#DC2626',
  other: '#64748B',
};

export const DarkTheme = {
  // Brand & Accents
  primary: '#3B82F6', // Blue 500 (Brighter for dark mode visibility)
  primaryFaded: 'rgba(59, 130, 246, 0.15)',
  secondary: '#F8FAFC', // Slate 50 for text/icons
  
  // Backgrounds & Surfaces
  background: '#0B1120', // True deep dark
  surface: '#1E293B', // Slate 800 for cards
  surfaceElevated: '#334155', // Slate 700 for modals/dropdowns
  heroBackground: '#0B1120', // Matches background
  
  // Borders
  border: '#334155', // Slate 700 (Subtle separation)
  
  // Typography
  textPrimary: '#F8FAFC', // Slate 50
  textSecondary: '#94A3B8', // Slate 400
  textMuted: '#64748B', // Slate 500
  
  // Semantic Colors (Dark-mode optimized, slightly brighter)
  success: '#10B981', // Emerald 500
  successFaded: 'rgba(16, 185, 129, 0.15)',
  warning: '#F59E0B', // Amber 500
  warningFaded: 'rgba(245, 158, 11, 0.15)',
  danger: '#EF4444', // Red 500
  dangerFaded: 'rgba(239, 68, 68, 0.15)',
  info: '#3B82F6', // Blue 500
  infoFaded: 'rgba(59, 130, 246, 0.15)',
  toggleInactive: '#475569', // Slate 600

  // Category specific colors (Dark optimized)
  housing: '#3B82F6',
  food: '#10B981',
  transport: '#A855F7',
  shopping: '#EF4444',
  other: '#94A3B8',
};

// Backward-compatible flat exports for non-themed components
export const Colors = {
  ...LightTheme,
  primary: LightTheme.primary,
  toggleActive: '#10B981',
  toggleThumb: '#FFFFFF',
  textInverse: '#FFFFFF',
};

export default Colors;
