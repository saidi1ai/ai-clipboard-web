import React from 'react';
import { View, Text, StyleSheet, Switch, Pressable } from 'react-native';
import { useAppTheme } from '@/utils/theme-helper';
import { ChevronRight } from 'lucide-react-native';
import colors from '@/constants/colors';

type SettingsItemProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  type?: 'switch' | 'navigate' | 'button';
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  onPress?: () => void;
};

export const SettingsItem = ({
  title,
  description,
  icon,
  type = 'navigate',
  value,
  onValueChange,
  onPress,
}: SettingsItemProps) => {
  const { card, text, textSecondary, border } = useAppTheme();
  
  const renderControl = () => {
    switch (type) {
      case 'switch':
        return (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: '#767577', true: colors.primaryLight }}
            thumbColor={value ? colors.primary : '#f4f3f4'}
          />
        );
      case 'navigate':
        return <ChevronRight size={20} color={textSecondary} />;
      default:
        return null;
    }
  };
  
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: card, borderColor: border },
        pressed && type !== 'switch' && styles.pressed,
      ]}
      onPress={type !== 'switch' ? onPress : undefined}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <View style={styles.content}>
        <Text style={[styles.title, { color: text }]}>{title}</Text>
        {description && (
          <Text style={[styles.description, { color: textSecondary }]}>
            {description}
          </Text>
        )}
      </View>
      <View style={styles.control}>{renderControl()}</View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  iconContainer: {
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    marginTop: 4,
  },
  control: {
    marginLeft: 16,
  },
});