import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useClipboardStore } from '@/store/clipboard-store';
import colors from '@/constants/colors';
import { useAppTheme } from '@/utils/theme-helper';

type StatusIndicatorProps = {
  size?: 'small' | 'large';
};

export const StatusIndicator = ({ size = 'small' }: StatusIndicatorProps) => {
  const { settings, isProcessing } = useClipboardStore();
  const { text, textSecondary } = useAppTheme();
  
  const getStatusColor = () => {
    if (!settings.processingEnabled) {
      return colors.textSecondary;
    }
    return isProcessing ? colors.warning : colors.success;
  };
  
  const getStatusText = () => {
    if (!settings.processingEnabled) {
      return 'Disabled';
    }
    return isProcessing ? 'Processing' : 'Ready';
  };
  
  return (
    <View style={styles.container}>
      <View 
        style={[
          styles.indicator, 
          { backgroundColor: getStatusColor() },
          size === 'large' && styles.indicatorLarge
        ]} 
      />
      <Text 
        style={[
          styles.text, 
          { color: text },
          size === 'large' && styles.textLarge
        ]}
      >
        {getStatusText()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  indicatorLarge: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
  textLarge: {
    fontSize: 16,
  },
});