import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useClipboardStore } from '@/store/clipboard-store';
import { useAuthStore } from '@/store/auth-store';
import { useSubscriptionStore } from '@/store/subscription-store';
import { getClipboardText, isClipboardAvailable } from '@/utils/clipboard-helper';
import { useAppTheme } from '@/utils/theme-helper';
import { StatusIndicator } from '@/components/StatusIndicator';
import { ClipboardItemCard } from '@/components/ClipboardItemCard';
import { StatCard } from '@/components/StatCard';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { SubscriptionBanner } from '@/components/SubscriptionBanner';
import { 
  Clipboard, 
  ClipboardPaste, 
  CheckCircle2, 
  BarChart3,
  ClipboardX,
  Download,
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { useRouter } from 'expo-router';
import { DownloadOptions } from '@/components/DownloadOptions';

export default function HomeScreen() {
  const router = useRouter();
  const { 
    items, 
    addItem, 
    retryItem, 
    stats, 
    settings,
    isProcessing,
  } = useClipboardStore();
  const { user } = useAuthStore();
  const { canProcessMore, incrementProcessingCount } = useSubscriptionStore();
  const { background, text, textSecondary } = useAppTheme();
  
  const [refreshing, setRefreshing] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  
  // Instead of redirecting immediately, we'll render a loading state or nothing
  // The redirection will happen in _layout.tsx which is mounted first
  if (!user) {
    return null;
  }
  
  // Get recent items (last 5)
  const recentItems = items.slice(0, 5);
  
  const handleFetchClipboard = async () => {
    // Check if user can process more items today
    if (!canProcessMore()) {
      Alert.alert(
        "Daily Limit Reached",
        "You've reached your daily processing limit. Upgrade to Premium for unlimited processing.",
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
    
    if (!isClipboardAvailable()) {
      Alert.alert(
        "Clipboard Access Limited",
        "Clipboard access is limited in this environment. Please copy text manually."
      );
      return;
    }
    
    try {
      setRefreshing(true);
      const clipboardText = await getClipboardText();
      
      if (!clipboardText) {
        Alert.alert(
          "Empty Clipboard",
          "Your clipboard is empty or doesn't contain text."
        );
        return;
      }
      
      // Check if this exact text is already in our recent items
      const isDuplicate = items.some(item => 
        item.originalText === clipboardText && 
        item.status !== 'failed'
      );
      
      if (isDuplicate) {
        Alert.alert(
          "Duplicate Content",
          "This content is already in your clipboard history."
        );
        return;
      }
      
      await addItem(clipboardText);
      incrementProcessingCount();
    } catch (error) {
      console.error('Error fetching clipboard:', error);
      Alert.alert(
        "Error",
        "Failed to access clipboard content."
      );
    } finally {
      setRefreshing(false);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await handleFetchClipboard();
    setRefreshing(false);
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <StatusBar style="auto" />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: text }]}>
            AI Clipboard
          </Text>
          <StatusIndicator size="large" />
        </View>
        
        <SubscriptionBanner />
        
        <Text style={[styles.sectionTitle, { color: textSecondary }]}>
          STATISTICS
        </Text>
        
        <View style={styles.statsContainer}>
          <StatCard
            title="Processed Today"
            value={stats.processedToday}
            icon={<CheckCircle2 size={24} color={colors.primary} />}
          />
          <StatCard
            title="Success Rate"
            value={`${stats.successRate}%`}
            icon={<BarChart3 size={24} color={colors.secondary} />}
            color={colors.secondary}
          />
        </View>
        
        <View style={styles.actionContainer}>
          <Button
            title="Paste from Clipboard"
            onPress={handleFetchClipboard}
            icon={<ClipboardPaste size={18} color="#fff" />}
            loading={isProcessing}
            disabled={isProcessing}
            style={styles.pasteButton}
          />
          
          {items.length > 0 && (
            <Button
              title="Download Data"
              onPress={() => setShowDownloadOptions(true)}
              icon={<Download size={18} color={colors.primary} />}
              variant="outline"
              style={styles.downloadButton}
            />
          )}
        </View>
        
        <View style={styles.recentContainer}>
          <Text style={[styles.sectionTitle, { color: textSecondary }]}>
            RECENT ITEMS
          </Text>
          
          {recentItems.length > 0 ? (
            recentItems.map(item => (
              <ClipboardItemCard
                key={item.id}
                item={item}
                onRetry={() => retryItem(item.id)}
              />
            ))
          ) : (
            <EmptyState
              title="No clipboard items yet"
              description="Paste from your clipboard to start processing text with AI."
              icon={<ClipboardX size={64} color={colors.textSecondary} />}
              actionLabel="Paste from Clipboard"
              onAction={handleFetchClipboard}
            />
          )}
        </View>
      </ScrollView>
      
      <DownloadOptions 
        visible={showDownloadOptions}
        onClose={() => setShowDownloadOptions(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionContainer: {
    marginBottom: 24,
    gap: 12,
  },
  pasteButton: {
    width: '100%',
  },
  downloadButton: {
    width: '100%',
  },
  recentContainer: {
    marginBottom: 24,
  },
});