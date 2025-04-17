import { useColorScheme } from 'react-native';
import { useClipboardStore } from '@/store/clipboard-store';
import { getThemeColors } from '@/constants/colors';

export const useAppTheme = () => {
  const systemTheme = useColorScheme();
  const { settings } = useClipboardStore();
  
  // Determine if we should use dark mode
  const isDark = 
    settings.theme === 'system' 
      ? systemTheme === 'dark'
      : settings.theme === 'dark';
  
  // Get the appropriate colors for the current theme
  const themeColors = getThemeColors(isDark);
  
  return {
    isDark,
    ...themeColors,
  };
};