import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '@/utils/theme-helper';
import { LucideIcon } from 'lucide-react-native';
import colors from '@/constants/colors';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
};

export const StatCard = ({ title, value, icon, color = colors.primary }: StatCardProps) => {
  const { card, text, textSecondary, border } = useAppTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: card, borderColor: border }]}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        {icon}
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: textSecondary }]}>{title}</Text>
        <Text style={[styles.value, { color: text }]}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
  },
});