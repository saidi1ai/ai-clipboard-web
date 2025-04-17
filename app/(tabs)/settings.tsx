import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Alert,
  Linking,
  Platform,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useClipboardStore } from '@/store/clipboard-store';
import { useAuthStore } from '@/store/auth-store';
import { useSubscriptionStore } from '@/store/subscription-store';
import { useAppTheme } from '@/utils/theme-helper';
import { SettingsItem } from '@/components/SettingsItem';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { ModelSelector } from '@/components/ModelSelector';
import { processText } from '@/utils/ai-service';
import { 
  Moon, 
  Sun, 
  Bell, 
  BellOff,
  MessageSquareText,
  Trash2,
  Info,
  Heart,
  Github,
  Bot,
  Cpu,
  LogOut,
  User,
  Crown,
} from 'lucide-react-native';
import colors from '@/constants/colors';

// Model options for OpenAI
const OPENAI_MODELS = [
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and cost-effective for most tasks',
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Most capable model, but slower and more expensive',
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'Improved speed with GPT-4 capabilities',
  },
];

// Model options for Gemini
const GEMINI_MODELS = [
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    description: 'Balanced performance for most tasks',
  },
  {
    id: 'gemini-ultra',
    name: 'Gemini Ultra',
    description: 'Most advanced model with superior reasoning',
  },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { settings, updateSettings, clearItems } = useClipboardStore();
  const { user, signOut } = useAuthStore();
  const { subscription } = useSubscriptionStore();
  const { background, text, card } = useAppTheme();
  
  // Instead of redirecting immediately, we'll render a loading state or nothing
  // The redirection will happen in _layout.tsx which is mounted first
  if (!user) {
    return null;
  }
  
  const handleThemeChange = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    updateSettings({ theme: newTheme });
  };
  
  const handleNotificationsChange = (value: boolean) => {
    updateSettings({ notifications: value });
  };
  
  const handleProcessingChange = (value: boolean) => {
    updateSettings({ processingEnabled: value });
  };
  
  const handleAiProviderChange = (provider: 'openai' | 'gemini' | 'mock') => {
    // Check if this model is allowed for the current subscription tier
    const { isModelAllowed } = useSubscriptionStore.getState();
    
    if (!isModelAllowed(provider)) {
      Alert.alert(
        "Premium Feature",
        `The ${provider === 'openai' ? 'OpenAI' : provider === 'gemini' ? 'Gemini' : 'Mock'} AI provider is only available for premium users.`,
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Upgrade", 
            onPress: () => router.push('/subscription')
          }
        ]
      );
      return;
    }
    
    updateSettings({ aiProvider: provider });
  };
  
  const handleOpenAIKeyChange = (key: string) => {
    updateSettings({ openaiApiKey: key });
  };
  
  const handleGeminiKeyChange = (key: string) => {
    updateSettings({ geminiApiKey: key });
  };
  
  const handleOpenAIModelChange = (model: string) => {
    updateSettings({ openaiModel: model });
  };
  
  const handleGeminiModelChange = (model: string) => {
    updateSettings({ geminiModel: model });
  };
  
  const handleClearHistory = () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all clipboard history? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => clearItems()
        }
      ]
    );
  };
  
  const handleEditPrompt = () => {
    router.push('/prompt-editor');
  };
  
  const handleAbout = () => {
    Alert.alert(
      "AI Clipboard Manager",
      "Version 1.0.0\n\nAn intelligent clipboard manager that processes text with AI to extract structured information.",
      [{ text: "OK" }]
    );
  };
  
  const handleGetOpenAIKey = () => {
    Linking.openURL('https://platform.openai.com/api-keys');
  };
  
  const handleGetGeminiKey = () => {
    Linking.openURL('https://ai.google.dev/tutorials/setup');
  };
  
  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Sign Out",
          onPress: () => {
            signOut();
          }
        }
      ]
    );
  };
  
  const handleSubscription = () => {
    router.push('/subscription');
  };
  
  const handleProfile = () => {
    router.push('/profile');
  };
  
  const testOpenAIKey = async () => {
    try {
      if (!settings.openaiApiKey.trim()) {
        Alert.alert("Error", "Please enter an OpenAI API key first");
        return false;
      }
      
      // Test with a simple prompt
      await processText(
        "Hello, this is a test.", 
        "Analyze this text and return the topic.",
        {
          ...settings,
          aiProvider: 'openai'
        }
      );
      
      return true;
    } catch (error) {
      Alert.alert(
        "API Key Error", 
        `Failed to validate OpenAI API key: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      return false;
    }
  };
  
  const testGeminiKey = async () => {
    try {
      if (!settings.geminiApiKey.trim()) {
        Alert.alert("Error", "Please enter a Gemini API key first");
        return false;
      }
      
      // Test with a simple prompt
      await processText(
        "Hello, this is a test.", 
        "Analyze this text and return the topic.",
        {
          ...settings,
          aiProvider: 'gemini'
        }
      );
      
      return true;
    } catch (error) {
      Alert.alert(
        "API Key Error", 
        `Failed to validate Gemini API key: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      return false;
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <StatusBar style="auto" />
      
      <ScrollView>
        <View style={styles.userSection}>
          <View style={styles.userInfo}>
            {user.photoURL ? (
              <Image 
                source={{ uri: user.photoURL }} 
                style={styles.userAvatar} 
              />
            ) : (
              <View style={[styles.userAvatarPlaceholder, { backgroundColor: colors.primary }]}>
                <Text style={styles.userAvatarText}>
                  {user.displayName ? user.displayName[0].toUpperCase() : user.email[0].toUpperCase()}
                </Text>
              </View>
            )}
            <View>
              <Text style={[styles.userName, { color: text }]}>
                {user.displayName || 'User'}
              </Text>
              <Text style={styles.userEmail}>
                {user.email}
              </Text>
            </View>
          </View>
          
          <View style={styles.subscriptionBadge}>
            <Crown size={14} color="#fff" />
            <Text style={styles.subscriptionText}>
              {subscription.tier === 'premium' ? 'Premium' : 'Free'}
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: text }]}>Account</Text>
          <View style={[styles.card, { backgroundColor: card }]}>
            <SettingsItem
              title="Profile"
              description="Manage your profile information"
              icon={<User size={22} color={colors.primary} />}
              type="navigate"
              onPress={handleProfile}
            />
            
            <SettingsItem
              title={subscription.tier === 'premium' ? "Manage Subscription" : "Upgrade to Premium"}
              description={subscription.tier === 'premium' ? "View or cancel your subscription" : "$1.99/month for unlimited features"}
              icon={<Crown size={22} color={colors.secondary} />}
              type="navigate"
              onPress={handleSubscription}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: text }]}>Appearance</Text>
          <View style={[styles.card, { backgroundColor: card }]}>
            <SettingsItem
              title="Dark Mode"
              description={`Currently: ${settings.theme === 'dark' ? 'On' : 'Off'}`}
              icon={settings.theme === 'dark' ? <Moon size={22} color={colors.primary} /> : <Sun size={22} color={colors.primary} />}
              type="switch"
              value={settings.theme === 'dark'}
              onValueChange={handleThemeChange}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: text }]}>AI Provider</Text>
          <View style={[styles.card, { backgroundColor: card }]}>
            <SettingsItem
              title="OpenAI"
              description="Use OpenAI's GPT models"
              icon={<Bot size={22} color={colors.primary} />}
              type="switch"
              value={settings.aiProvider === 'openai'}
              onValueChange={(value) => value && handleAiProviderChange('openai')}
            />
            
            <SettingsItem
              title="Google Gemini"
              description="Use Google's Gemini models"
              icon={<Bot size={22} color={colors.secondary} />}
              type="switch"
              value={settings.aiProvider === 'gemini'}
              onValueChange={(value) => value && handleAiProviderChange('gemini')}
            />
            
            <SettingsItem
              title="Mock AI (Demo)"
              description="Use simulated AI for testing"
              icon={<Cpu size={22} color={colors.textSecondary} />}
              type="switch"
              value={settings.aiProvider === 'mock'}
              onValueChange={(value) => value && handleAiProviderChange('mock')}
            />
          </View>
        </View>
        
        {settings.aiProvider === 'openai' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: text }]}>OpenAI Configuration</Text>
            <View style={[styles.card, { backgroundColor: card, padding: 16 }]}>
              <ApiKeyInput
                label="OpenAI API Key"
                value={settings.openaiApiKey}
                onChangeText={handleOpenAIKeyChange}
                placeholder="Enter your OpenAI API key"
                testButtonLabel="Test Key"
                onTestKey={testOpenAIKey}
              />
              
              <ModelSelector
                label="Model"
                value={settings.openaiModel}
                options={OPENAI_MODELS}
                onChange={handleOpenAIModelChange}
              />
              
              <Text 
                style={[styles.getKeyText, { color: colors.primary }]}
                onPress={handleGetOpenAIKey}
              >
                Get an OpenAI API key →
              </Text>
            </View>
          </View>
        )}
        
        {settings.aiProvider === 'gemini' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: text }]}>Gemini Configuration</Text>
            <View style={[styles.card, { backgroundColor: card, padding: 16 }]}>
              <ApiKeyInput
                label="Gemini API Key"
                value={settings.geminiApiKey}
                onChangeText={handleGeminiKeyChange}
                placeholder="Enter your Gemini API key"
                testButtonLabel="Test Key"
                onTestKey={testGeminiKey}
              />
              
              <ModelSelector
                label="Model"
                value={settings.geminiModel}
                options={GEMINI_MODELS}
                onChange={handleGeminiModelChange}
              />
              
              <Text 
                style={[styles.getKeyText, { color: colors.primary }]}
                onPress={handleGetGeminiKey}
              >
                Get a Gemini API key →
              </Text>
            </View>
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: text }]}>Preferences</Text>
          <View style={[styles.card, { backgroundColor: card }]}>
            <SettingsItem
              title="Enable Notifications"
              description="Get notified about processing results"
              icon={settings.notifications ? <Bell size={22} color={colors.primary} /> : <BellOff size={22} color={colors.primary} />}
              type="switch"
              value={settings.notifications}
              onValueChange={handleNotificationsChange}
            />
            
            <SettingsItem
              title="AI Processing"
              description={settings.processingEnabled ? "Automatically process clipboard text" : "Manual processing only"}
              icon={<MessageSquareText size={22} color={colors.primary} />}
              type="switch"
              value={settings.processingEnabled}
              onValueChange={handleProcessingChange}
            />
            
            <SettingsItem
              title="Custom AI Prompt"
              description="Edit the instructions for AI processing"
              icon={<MessageSquareText size={22} color={colors.primary} />}
              type="navigate"
              onPress={handleEditPrompt}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: text }]}>Data</Text>
          <View style={[styles.card, { backgroundColor: card }]}>
            <SettingsItem
              title="Clear Clipboard History"
              description="Delete all saved clipboard items"
              icon={<Trash2 size={22} color={colors.error} />}
              type="button"
              onPress={handleClearHistory}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: text }]}>About</Text>
          <View style={[styles.card, { backgroundColor: card }]}>
            <SettingsItem
              title="About AI Clipboard"
              description="Version 1.0.0"
              icon={<Info size={22} color={colors.primary} />}
              type="button"
              onPress={handleAbout}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={[styles.card, { backgroundColor: card }]}>
            <SettingsItem
              title="Sign Out"
              description="Log out of your account"
              icon={<LogOut size={22} color={colors.error} />}
              type="button"
              onPress={handleSignOut}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userAvatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  subscriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  subscriptionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  getKeyText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});