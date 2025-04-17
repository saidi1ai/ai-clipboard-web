import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSubscriptionStore } from '@/store/subscription-store';
import { useAppTheme } from '@/utils/theme-helper';
import { Crown, ChevronRight } from 'lucide-react-native';
import colors from '@/constants/colors';

export const SubscriptionBanner = () => {
  const router = useRouter();
  const { subscription, getRemainingProcessingCount } = useSubscriptionStore();
  const { card, text, textSecondary, border } = useAppTheme();
  
  // Don't show banner for premium users
  if (subscription.tier === 'premium') {
    return null;
  }
  
  const remainingCount = getRemainingProcessingCount();
  
  const handlePress = () => {
    router.push('/subscription');
  };
  
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: `${colors.secondary}15`, borderColor: colors.secondary },
        pressed && styles.pressed,
      ]}
      onPress={handlePress}
    >
      <View style={styles.iconContainer}>
        <Crown size={20} color={colors.secondary} />
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: text }]}>
          Upgrade to Premium
        </Text>
        <Text style={[styles.description, { color: textSecondary }]}>
          {remainingCount === 0 
            ? "You've reached your daily limit. Upgrade for unlimited processing."
            : `${remainingCount} processing requests remaining today. Unlock unlimited.`
          }
        </Text>
      </View>
      
      <ChevronRight size={20} color={colors.secondary} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  pressed: {
    opacity: 0.8,
  },
  iconContainer: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
  },
});