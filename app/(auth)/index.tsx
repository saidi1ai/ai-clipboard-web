import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth-store';
import { useAppTheme } from '@/utils/theme-helper';
import { AuthForm } from '@/components/AuthForm';
import { SocialAuthButtons } from '@/components/SocialAuthButtons';
import colors from '@/constants/colors';

export default function AuthScreen() {
  const { background, text, textSecondary } = useAppTheme();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  
  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <StatusBar style="auto" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image 
              source={{ uri: 'https://ui-avatars.com/api/?name=AI+Clipboard&background=6366f1&color=fff&size=128' }}
              style={styles.logo}
            />
          </View>
          <Text style={[styles.title, { color: text }]}>AI Clipboard</Text>
          <Text style={[styles.subtitle, { color: textSecondary }]}>
            Intelligent clipboard management with AI processing
          </Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={[styles.formTitle, { color: text }]}>
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </Text>
          
          <AuthForm mode={mode} />
          
          <View style={styles.toggleContainer}>
            <Text style={[styles.toggleText, { color: textSecondary }]}>
              {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
            </Text>
            <Pressable onPress={toggleMode}>
              <Text style={[styles.toggleButton, { color: colors.primary }]}>
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </Text>
            </Pressable>
          </View>
          
          <SocialAuthButtons />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  formContainer: {
    flex: 1,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  toggleText: {
    fontSize: 14,
    marginRight: 4,
  },
  toggleButton: {
    fontSize: 14,
    fontWeight: '600',
  },
});