// Sovereign Ledger — Typography Design System
export const FontFamily = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
};

export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  display: 28,
  hero: 32,
  giant: 40,
};

export const LineHeight = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 22,
  xl: 24,
  xxl: 28,
  xxxl: 32,
  display: 36,
  hero: 40,
  giant: 48,
};

export const Typography = {
  hero: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.hero,
    lineHeight: LineHeight.hero,
  },
  display: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.display,
    lineHeight: LineHeight.display,
  },
  h1: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxxl,
    lineHeight: LineHeight.xxxl,
  },
  h2: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xxl,
    lineHeight: LineHeight.xxl,
  },
  h3: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xl,
    lineHeight: LineHeight.xl,
  },
  body: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.lg,
    lineHeight: LineHeight.lg,
  },
  bodyMedium: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.lg,
    lineHeight: LineHeight.lg,
  },
  caption: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    lineHeight: LineHeight.md,
  },
  captionMedium: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    lineHeight: LineHeight.md,
  },
  small: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
  },
  smallMedium: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
  },
  tiny: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    lineHeight: LineHeight.xs,
  },
  amount: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.giant,
    lineHeight: LineHeight.giant,
  },
  amountSmall: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxxl,
    lineHeight: LineHeight.xxxl,
  },
};

export default Typography;
