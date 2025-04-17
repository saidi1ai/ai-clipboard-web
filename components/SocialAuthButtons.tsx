import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useAuthStore } from '@/store/auth-store';
import { useAppTheme } from '@/utils/theme-helper';
import { Button } from '@/components/Button';
import { LogIn } from 'lucide-react-native';
import colors from '@/constants/colors';

type SocialAuthButtonsProps = {
  onSuccess?: () => void;
};

export const SocialAuthButtons = ({ onSuccess }: SocialAuthButtonsProps) => {
  const { signInWithGoogle, signInAnonymously, isLoading } = useAuthStore();
  const { card, text, textSecondary, border } = useAppTheme();
  
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error is already handled by the auth store
    }
  };
  
  const handleAnonymousSignIn = async () => {
    try {
      await signInAnonymously();
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error is already handled by the auth store
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.dividerContainer}>
        <View style={[styles.divider, { backgroundColor: border }]} />
        <Text style={[styles.dividerText, { color: textSecondary }]}>OR</Text>
        <View style={[styles.divider, { backgroundColor: border }]} />
      </View>
      
      <Button
        title="Continue with Google"
        onPress={handleGoogleSignIn}
        variant="outline"
        loading={isLoading}
        disabled={isLoading}
        style={styles.googleButton}
        icon={
          <View style={styles.googleIcon}>
            <Text style={styles.googleIconText}>G</Text>
          </View>
        }
      />
      
      <Button
        title="Continue as Guest"
        onPress={handleAnonymousSignIn}
        variant="ghost"
        loading={isLoading}
        disabled={isLoading}
        style={styles.anonymousButton}
        icon={<LogIn size={18} color={colors.primary} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  googleButton: {
    marginBottom: 12,
  },
  googleIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIconText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  anonymousButton: {
    marginTop: 8,
  },
});