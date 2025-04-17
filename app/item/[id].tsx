import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useClipboardStore } from '@/store/clipboard-store';
import { copyToClipboard } from '@/utils/clipboard-helper';
import { formatDate } from '@/utils/date-formatter';
import { useAppTheme } from '@/utils/theme-helper';
import { Button } from '@/components/Button';
import { 
  Copy, 
  RefreshCw, 
  Trash2, 
  Clock, 
  Tag, 
  FileText,
  CheckCircle2,
  AlertCircle,
  Bot,
  Cpu,
} from 'lucide-react-native';
import colors from '@/constants/colors';

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getItemById, retryItem, removeItem } = useClipboardStore();
  const { background, text, textSecondary, card, border } = useAppTheme();
  
  const item = getItemById(id as string);
  
  if (!item) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
        <Text style={[styles.errorText, { color: text }]}>Item not found</Text>
      </SafeAreaView>
    );
  }
  
  const handleCopy = async () => {
    const success = await copyToClipboard(item.originalText);
    if (success) {
      Alert.alert("Copied", "Text copied to clipboard");
    } else {
      Alert.alert("Error", "Failed to copy text to clipboard");
    }
  };
  
  const handleDelete = () => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            removeItem(item.id);
            router.back();
          }
        }
      ]
    );
  };
  
  const getStatusColor = () => {
    switch (item.status) {
      case 'processed':
        return colors.success;
      case 'failed':
        return colors.error;
      case 'processing':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };
  
  const getStatusText = () => {
    switch (item.status) {
      case 'processed':
        return 'Processed';
      case 'failed':
        return 'Failed';
      case 'processing':
        return 'Processing';
      default:
        return 'Pending';
    }
  };
  
  const getStatusIcon = () => {
    switch (item.status) {
      case 'processed':
        return <CheckCircle2 size={20} color={colors.success} />;
      case 'failed':
        return <AlertCircle size={20} color={colors.error} />;
      case 'processing':
      default:
        return <Clock size={20} color={getStatusColor()} />;
    }
  };
  
  const getProviderIcon = () => {
    switch (item.aiProvider) {
      case 'openai':
        return <Bot size={16} color={colors.primary} />;
      case 'gemini':
        return <Bot size={16} color={colors.secondary} />;
      case 'mock':
      default:
        return <Cpu size={16} color={textSecondary} />;
    }
  };
  
  const getProviderName = () => {
    switch (item.aiProvider) {
      case 'openai':
        return 'OpenAI';
      case 'gemini':
        return 'Gemini';
      case 'mock':
      default:
        return 'Mock AI';
    }
  };
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Clipboard Item',
          headerRight: () => (
            <Pressable
              style={({ pressed }) => [
                styles.headerButton,
                { opacity: pressed ? 0.7 : 1 }
              ]}
              onPress={handleDelete}
            >
              <Trash2 size={20} color={colors.error} />
            </Pressable>
          ),
        }} 
      />
      
      <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
        <StatusBar style="auto" />
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.metaContainer, { backgroundColor: card, borderColor: border }]}>
            <View style={styles.metaItem}>
              <Clock size={16} color={textSecondary} />
              <Text style={[styles.metaText, { color: textSecondary }]}>
                {formatDate(item.timestamp)}
              </Text>
            </View>
            
            <View style={styles.metaItem}>
              {getStatusIcon()}
              <Text 
                style={[
                  styles.metaText, 
                  { color: getStatusColor() }
                ]}
              >
                {getStatusText()}
              </Text>
            </View>
          </View>
          
          {item.aiProvider && (
            <View style={[styles.providerContainer, { backgroundColor: card, borderColor: border }]}>
              <View style={styles.metaItem}>
                {getProviderIcon()}
                <Text style={[styles.metaText, { color: text }]}>
                  Processed by {getProviderName()}
                </Text>
              </View>
            </View>
          )}
          
          <View style={[styles.section, { backgroundColor: card, borderColor: border }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: text }]}>
                Original Text
              </Text>
              <Pressable
                style={({ pressed }) => [
                  styles.iconButton,
                  { opacity: pressed ? 0.7 : 1 }
                ]}
                onPress={handleCopy}
              >
                <Copy size={18} color={colors.primary} />
              </Pressable>
            </View>
            <Text style={[styles.originalText, { color: text }]}>
              {item.originalText}
            </Text>
          </View>
          
          {item.status === 'processed' && item.processedData && (
            <View style={[styles.section, { backgroundColor: card, borderColor: border }]}>
              <Text style={[styles.sectionTitle, { color: text }]}>
                AI Analysis
              </Text>
              
              <View style={styles.analysisItem}>
                <Text style={[styles.analysisLabel, { color: textSecondary }]}>
                  Topic
                </Text>
                <Text style={[styles.analysisValue, { color: text }]}>
                  {item.processedData.topic}
                </Text>
              </View>
              
              <View style={styles.analysisItem}>
                <Text style={[styles.analysisLabel, { color: textSecondary }]}>
                  Intent
                </Text>
                <Text style={[styles.analysisValue, { color: text }]}>
                  {item.processedData.intent}
                </Text>
              </View>
              
              <View style={styles.analysisItem}>
                <Text style={[styles.analysisLabel, { color: textSecondary }]}>
                  Entities
                </Text>
                <View style={styles.tagsContainer}>
                  {item.processedData.entities.length > 0 ? (
                    item.processedData.entities.map((entity, index) => (
                      <View 
                        key={index} 
                        style={[
                          styles.tag, 
                          { backgroundColor: `${colors.primary}20` }
                        ]}
                      >
                        <Text style={[styles.tagText, { color: colors.primary }]}>
                          {entity}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text style={[styles.emptyText, { color: textSecondary }]}>
                      No entities found
                    </Text>
                  )}
                </View>
              </View>
              
              <View style={styles.analysisItem}>
                <Text style={[styles.analysisLabel, { color: textSecondary }]}>
                  Categories
                </Text>
                <View style={styles.tagsContainer}>
                  {item.processedData.categories.map((category, index) => (
                    <View 
                      key={index} 
                      style={[
                        styles.tag, 
                        { backgroundColor: `${colors.secondary}20` }
                      ]}
                    >
                      <Text style={[styles.tagText, { color: colors.secondary }]}>
                        {category}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
              
              <View style={styles.analysisItem}>
                <Text style={[styles.analysisLabel, { color: textSecondary }]}>
                  Action Items
                </Text>
                {item.processedData.actionItems.map((action, index) => (
                  <View key={index} style={styles.actionItem}>
                    <View style={[styles.bullet, { backgroundColor: colors.primary }]} />
                    <Text style={[styles.actionText, { color: text }]}>
                      {action}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {item.status === 'failed' && (
            <View style={[styles.section, { backgroundColor: card, borderColor: border }]}>
              <Text style={[styles.sectionTitle, { color: text }]}>
                Error
              </Text>
              <Text style={[styles.errorMessage, { color: colors.error }]}>
                {item.error || "Processing failed"}
              </Text>
              <Button
                title="Retry Processing"
                onPress={() => retryItem(item.id)}
                icon={<RefreshCw size={16} color="#fff" />}
                style={styles.retryButton}
              />
            </View>
          )}
          
          {item.status === 'pending' && (
            <View style={[styles.section, { backgroundColor: card, borderColor: border }]}>
              <Text style={[styles.sectionTitle, { color: text }]}>
                Pending Processing
              </Text>
              <Text style={[styles.pendingText, { color: textSecondary }]}>
                This item is waiting to be processed by AI.
              </Text>
              <Button
                title="Process Now"
                onPress={() => retryItem(item.id)}
                icon={<RefreshCw size={16} color="#fff" />}
                style={styles.retryButton}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  headerButton: {
    padding: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  providerContainer: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  originalText: {
    fontSize: 16,
    lineHeight: 24,
  },
  iconButton: {
    padding: 4,
  },
  analysisItem: {
    marginBottom: 16,
  },
  analysisLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  analysisValue: {
    fontSize: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  actionText: {
    fontSize: 16,
    flex: 1,
  },
  errorMessage: {
    fontSize: 16,
    marginBottom: 16,
  },
  pendingText: {
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    alignSelf: 'flex-start',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 24,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});