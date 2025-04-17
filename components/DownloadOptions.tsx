import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useClipboardStore } from '@/store/clipboard-store';
import { useSubscriptionStore } from '@/store/subscription-store';
import { useAppTheme } from '@/utils/theme-helper';
import { Button } from '@/components/Button';
import { exportClipboardItems } from '@/utils/file-helper';
import { 
  Download, 
  FileText, 
  FileJson, 
  FileSpreadsheet,
  X,
  Lock,
} from 'lucide-react-native';
import colors from '@/constants/colors';

type DownloadOptionsProps = {
  visible: boolean;
  onClose: () => void;
};

export const DownloadOptions = ({ visible, onClose }: DownloadOptionsProps) => {
  const { items } = useClipboardStore();
  const { subscription, isFormatAllowed } = useSubscriptionStore();
  const { background, card, text, textSecondary, border } = useAppTheme();
  
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = async (format: 'txt' | 'json' | 'csv') => {
    if (!isFormatAllowed(format)) {
      Alert.alert(
        "Premium Feature",
        `Exporting to ${format.toUpperCase()} format is only available for premium users.`,
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Upgrade", 
            onPress: () => {
              onClose();
              // Navigate to subscription screen
              // This would be implemented in a real app
            }
          }
        ]
      );
      return;
    }
    
    setIsExporting(true);
    
    try {
      const success = await exportClipboardItems(items, format);
      
      if (success) {
        Alert.alert(
          "Export Successful",
          `Your clipboard data has been exported to ${format.toUpperCase()} format.`,
          [{ text: "OK", onPress: onClose }]
        );
      } else {
        Alert.alert(
          "Export Failed",
          "There was an error exporting your clipboard data. Please try again.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      Alert.alert(
        "Export Error",
        "An unexpected error occurred during export.",
        [{ text: "OK" }]
      );
    } finally {
      setIsExporting(false);
    }
  };
  
  const renderFormatOption = (
    format: 'txt' | 'json' | 'csv', 
    title: string, 
    description: string,
    icon: React.ReactNode
  ) => {
    const isPremiumOnly = !isFormatAllowed(format);
    
    return (
      <Pressable
        style={({ pressed }) => [
          styles.formatOption,
          { 
            backgroundColor: card, 
            borderColor: border,
            opacity: pressed && !isPremiumOnly ? 0.7 : 1 
          }
        ]}
        onPress={() => handleExport(format)}
        disabled={isPremiumOnly || isExporting}
      >
        <View style={styles.formatIconContainer}>
          {icon}
        </View>
        
        <View style={styles.formatContent}>
          <Text style={[styles.formatTitle, { color: text }]}>
            {title}
          </Text>
          <Text style={[styles.formatDescription, { color: textSecondary }]}>
            {description}
          </Text>
        </View>
        
        {isPremiumOnly && (
          <View style={styles.premiumBadge}>
            <Lock size={14} color="#fff" />
            <Text style={styles.premiumText}>Premium</Text>
          </View>
        )}
      </Pressable>
    );
  };
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: text }]}>Export Clipboard Data</Text>
            <Pressable
              style={({ pressed }) => [
                styles.closeButton,
                { opacity: pressed ? 0.7 : 1 }
              ]}
              onPress={onClose}
            >
              <X size={24} color={text} />
            </Pressable>
          </View>
          
          {items.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: textSecondary }]}>
                No clipboard items to export.
              </Text>
            </View>
          ) : (
            <>
              <Text style={[styles.subtitle, { color: textSecondary }]}>
                Choose a format to export {items.length} clipboard items:
              </Text>
              
              <View style={styles.formatOptions}>
                {renderFormatOption(
                  'txt',
                  'Text File (.txt)',
                  'Simple text format, easy to read',
                  <FileText size={24} color={colors.primary} />
                )}
                
                {renderFormatOption(
                  'json',
                  'JSON File (.json)',
                  'Structured data for developers',
                  <FileJson size={24} color={colors.secondary} />
                )}
                
                {renderFormatOption(
                  'csv',
                  'CSV File (.csv)',
                  'Spreadsheet compatible format',
                  <FileSpreadsheet size={24} color={colors.success} />
                )}
              </View>
              
              {subscription.tier === 'free' && (
                <View style={[styles.upgradeContainer, { backgroundColor: `${colors.secondary}15` }]}>
                  <Text style={[styles.upgradeText, { color: text }]}>
                    Upgrade to Premium to unlock all export formats
                  </Text>
                </View>
              )}
            </>
          )}
          
          {isExporting && (
            <View style={[styles.loadingOverlay, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
              <View style={[styles.loadingContainer, { backgroundColor: card }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingText, { color: text }]}>
                  Exporting data...
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  formatOptions: {
    gap: 12,
    marginBottom: 16,
  },
  formatOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  formatIconContainer: {
    marginRight: 16,
  },
  formatContent: {
    flex: 1,
  },
  formatTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  formatDescription: {
    fontSize: 14,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  premiumText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  upgradeContainer: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  loadingContainer: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
  },
});