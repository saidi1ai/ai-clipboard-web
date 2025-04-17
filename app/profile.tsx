import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Image, 
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import { useAppTheme } from '@/utils/theme-helper';
import { Button } from '@/components/Button';
import { User, Camera, Save } from 'lucide-react-native';
import colors from '@/constants/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuthStore();
  const { background, text, textSecondary, card, border } = useAppTheme();
  
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateProfile({
        displayName: displayName.trim() || user.displayName,
        photoURL: photoURL.trim() || user.photoURL,
      });
      
      Alert.alert(
        "Profile Updated",
        "Your profile has been updated successfully.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to update profile. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChangePhoto = () => {
    // In a real app, this would open the image picker
    Alert.alert(
      "Change Profile Photo",
      "This feature is not implemented in the demo version.",
      [{ text: "OK" }]
    );
  };
  
  // Instead of redirecting immediately, we'll render a loading state or nothing
  // The redirection will happen in _layout.tsx which is mounted first
  if (!user) {
    return null;
  }
  
  return (
    <>
      <Stack.Screen options={{ title: 'Edit Profile' }} />
      
      <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
        <StatusBar style="auto" />
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.photoContainer}>
              {photoURL ? (
                <Image 
                  source={{ uri: photoURL }} 
                  style={styles.photo} 
                />
              ) : (
                <View style={[styles.photoPlaceholder, { backgroundColor: colors.primary }]}>
                  <User size={40} color="#fff" />
                </View>
              )}
              
              <Pressable
                style={({ pressed }) => [
                  styles.changePhotoButton,
                  { backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 }
                ]}
                onPress={handleChangePhoto}
              >
                <Camera size={20} color="#fff" />
              </Pressable>
            </View>
            
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: text }]}>Display Name</Text>
                <TextInput
                  style={[
                    styles.input, 
                    { 
                      backgroundColor: card, 
                      borderColor: border,
                      color: text 
                    }
                  ]}
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Your name"
                  placeholderTextColor={textSecondary}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: text }]}>Email</Text>
                <TextInput
                  style={[
                    styles.input, 
                    { 
                      backgroundColor: card, 
                      borderColor: border,
                      color: textSecondary 
                    }
                  ]}
                  value={user.email}
                  editable={false}
                />
                <Text style={[styles.helperText, { color: textSecondary }]}>
                  Email cannot be changed
                </Text>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: text }]}>Account Type</Text>
                <View style={[
                  styles.accountType, 
                  { 
                    backgroundColor: card, 
                    borderColor: border,
                  }
                ]}>
                  <Text style={[styles.accountTypeText, { color: text }]}>
                    {user.authProvider === 'email' 
                      ? 'Email & Password' 
                      : user.authProvider === 'google' 
                        ? 'Google Account' 
                        : 'Anonymous User'}
                  </Text>
                </View>
              </View>
              
              <Button
                title="Save Changes"
                onPress={handleSave}
                loading={isLoading}
                disabled={isLoading}
                icon={<Save size={18} color="#fff" />}
                style={styles.saveButton}
                size="large"
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  photoContainer: {
    alignItems: 'center',
    marginVertical: 24,
    position: 'relative',
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
  },
  accountType: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  accountTypeText: {
    fontSize: 16,
  },
  saveButton: {
    marginTop: 16,
  },
});