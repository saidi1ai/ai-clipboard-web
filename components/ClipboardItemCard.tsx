import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ClipboardItem } from '@/types/clipboard';
import { formatTimeAgo } from '@/utils/date-formatter';
import { useAppTheme } from '@/utils/theme-helper';
import { Check, AlertCircle, Clock, RefreshCw, Bot, Cpu } from 'lucide-react-native';
import colors from '@/constants/colors';

type ClipboardItemCardProps = {
  item: ClipboardItem;
  onRetry?: () => void;
};

export const ClipboardItemCard = ({ item, onRetry }: ClipboardItemCardProps) => {
  const router = useRouter();
  const { card, text, textSecondary, border } = useAppTheme();
  
  const getStatusIcon = () => {
    switch (item.status) {
      case 'processed':
        return <Check size={16} color={colors.success} />;
      case 'failed':
        return <AlertCircle size={16} color={colors.error} />;
      case 'processing':
        return <Clock size={16} color={colors.warning} />;
      default:
        return <Clock size={16} color={colors.textSecondary} />;
    }
  };
  
  const getProviderIcon = () => {
    switch (item.aiProvider) {
      case 'openai':
        return <Bot size={14} color={colors.primary} />;
      case 'gemini':
        return <Bot size={14} color={colors.secondary} />;
      case 'mock':
      default:
        return <Cpu size={14} color={textSecondary} />;
    }
  };
  
  const handlePress = () => {
    router.push(`/item/${item.id}`);
  };
  
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: card, borderColor: border },
        pressed && styles.pressed,
      ]}
      onPress={handlePress}
    >
      <View style={styles.header}>
        <Text 
          style={[styles.title, { color: text }]} 
          numberOfLines={1}
        >
          {item.processedData?.topic || item.originalText.substring(0, 30)}
        </Text>
        <View style={styles.statusContainer}>
          {getStatusIcon()}
          <Text style={[styles.time, { color: textSecondary }]}>
            {formatTimeAgo(item.timestamp)}
          </Text>
        </View>
      </View>
      
      <Text 
        style={[styles.preview, { color: textSecondary }]} 
        numberOfLines={2}
      >
        {item.originalText}
      </Text>
      
      <View style={styles.footer}>
        {item.aiProvider && (
          <View style={styles.providerContainer}>
            {getProviderIcon()}
          </View>
        )}
        
        {item.status === 'failed' && onRetry && (
          <Pressable 
            style={styles.retryButton}
            onPress={(e) => {
              e.stopPropagation();
              onRetry();
            }}
          >
            <RefreshCw size={14} color={colors.primary} />
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  pressed: {
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  time: {
    fontSize: 12,
  },
  preview: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  providerContainer: {
    padding: 4,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 4,
  },
  retryText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
});