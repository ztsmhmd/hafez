
import { StyleSheet, ViewStyle, TextStyle, I18nManager } from 'react-native';

// Enable RTL layout
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export const colors = {
  primary: '#1976D2',    // Material Blue
  secondary: '#1565C0',  // Darker Blue
  accent: '#64B5F6',     // Light Blue
  background: '#0D1117',  // Dark background
  backgroundAlt: '#161B22',  // Slightly lighter dark background
  text: '#F0F6FC',       // Light text
  grey: '#8B949E',       // Grey text
  card: '#21262D',       // Card background
  success: '#238636',    // Green
  warning: '#D29922',    // Orange
  error: '#DA3633',      // Red
  border: '#30363D',     // Border color
};

export const buttonStyles = StyleSheet.create({
  instructionsButton: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: colors.backgroundAlt,
    alignSelf: 'center',
    width: '100%',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 10,
    fontFamily: 'Cairo_700Bold',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    fontFamily: 'Cairo_400Regular',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
    elevation: 3,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: colors.text,
  },
  // RTL specific styles
  rtlText: {
    textAlign: 'right' as const,
    writingDirection: 'rtl' as any,
  },
  rtlContainer: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
  },
  // Arabic typography
  arabicTitle: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: colors.text,
    textAlign: 'right' as const,
    lineHeight: 32,
  },
  arabicText: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 16,
    color: colors.text,
    textAlign: 'right' as const,
    lineHeight: 24,
  },
  arabicSubtext: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 14,
    color: colors.grey,
    textAlign: 'right' as const,
    lineHeight: 20,
  },
});
