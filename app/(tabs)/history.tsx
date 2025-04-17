import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  RefreshControl,
  Alert,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useClipboardStore } from '@/store/clipboard-store';
import { useAppTheme } from '@/utils/theme-helper';
import { ClipboardItemCard } from '@/components/ClipboardItemCard';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/Button';
import { ClipboardX, Trash2 } from 'lucide-react-native';
import colors from '@/constants/colors';

export default function HistoryScreen() {
  const { items, retryItem, clearItems } = useClipboardStore();
  const { background, text, textSecondary, card, border } = useAppTheme();
  const [refreshing, setRefreshing] = useState(false);
  
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
  
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  
  if (items.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
        <StatusBar style="auto" />
        <EmptyState
          title="No clipboard history"
          description="Your clipboard history will appear here once you start processing text."
          icon={<ClipboardX size={64} color={colors.textSecondary} />}
        />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: text }]}>History</Text>
        <Pressable
          style={({ pressed }) => [
            styles.clearButton,
            { opacity: pressed ? 0.7 : 1 }
          ]}
          onPress={handleClearHistory}
        >
          <Trash2 size={20} color={colors.error} />
        </Pressable>
      </View>
      
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ClipboardItemCard
            item={item}
            onRetry={() => retryItem(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  clearButton: {
    padding: 8,
  },
  listContent: {
    padding: 16,
  },
});