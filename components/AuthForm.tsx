import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuthStore } from '@/store/auth-store';
import { useAppTheme } from '@/utils/theme-helper';
import { Button } from '@/components/Button';
import { Mail, Lock, User, AlertCircle } from 'lucide-react-native';
import colors from '@/constants/colors';

type AuthFormProps = {
  mode: 'signin' | 'signup';
  onSuccess?: () => void;
};

export const AuthForm = ({ mode, onSuccess }: AuthFormProps) => {
  const { signIn, signUp, isLoading, error } = useAuthStore();
  const { card, text, textSecondary, border } = useAppTheme();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  
  const validateForm = () => {
    // Reset error
    setFormError(null);
    
    // Validate email
    if (!email.trim()) {
      setFormError('Email is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Please enter a valid email address');
      return false;
    }
    
    // Validate password
    if (!password.trim()) {
      setFormError('Password is required');
      return false;
    }
    
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return false;
    }
    
    // Validate name for signup
    if (mode === 'signup' && !name.trim()) {
      setFormError('Name is required');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error is already handled by the auth store
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoid}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {mode === 'signup' && (
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: text }]}>Name</Text>
              <View style={[styles.inputContainer, { backgroundColor: card, borderColor: border }]}>
                <User size={20} color={textSecondary} />
                <TextInput
                  style={[styles.input, { color: text }]}
                  placeholder="Your name"
                  placeholderTextColor={textSecondary}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>
          )}
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: text }]}>Email</Text>
            <View style={[styles.inputContainer, { backgroundColor: card, borderColor: border }]}>
              <Mail size={20} color={textSecondary} />
              <TextInput
                style={[styles.input, { color: text }]}
                placeholder="your.email@example.com"
                placeholderTextColor={textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: text }]}>Password</Text>
            <View style={[styles.inputContainer, { backgroundColor: card, borderColor: border }]}>
              <Lock size={20} color={textSecondary} />
              <TextInput
                style={[styles.input, { color: text }]}
                placeholder="Your password"
                placeholderTextColor={textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
              />
            </View>
          </View>
          
          {(formError || error) && (
            <View style={styles.errorContainer}>
              <AlertCircle size={16} color={colors.error} />
              <Text style={[styles.errorText, { color: colors.error }]}>
                {formError || error}
              </Text>
            </View>
          )}
          
          <Button
            title={mode === 'signin' ? 'Sign In' : 'Sign Up'}
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            style={styles.submitButton}
            size="large"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    marginLeft: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: `${colors.error}15`,
    borderRadius: 8,
  },
  errorText: {
    marginLeft: 8,
    fontSize: 14,
  },
  submitButton: {
    marginTop: 8,
  },
});