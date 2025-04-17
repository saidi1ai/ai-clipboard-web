import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { ClipboardItem } from '@/types/clipboard';
import { useSubscriptionStore } from '@/store/subscription-store';

// Check if file system is available
export const isFileSystemAvailable = (): boolean => {
  return Platform.OS !== 'web' && !!FileSystem;
};

// Check if sharing is available
export const isSharingAvailable = async (): Promise<boolean> => {
  if (Platform.OS === 'web') return false;
  
  try {
    return await Sharing.isAvailableAsync();
  } catch (error) {
    console.error('Error checking sharing availability:', error);
    return false;
  }
};

// Generate file content in TXT format
export const generateTxtContent = (items: ClipboardItem[], includeWatermark: boolean): string => {
  let content = '# AI Clipboard Export\n';
  content += `# Generated on ${new Date().toLocaleString()}\n\n`;
  
  items.forEach((item, index) => {
    content += `## Item ${index + 1}\n`;
    content += `Date: ${new Date(item.timestamp).toLocaleString()}\n`;
    content += `Status: ${item.status}\n`;
    content += `AI Provider: ${item.aiProvider || 'Unknown'}\n\n`;
    
    content += `Original Text:\n${item.originalText}\n\n`;
    
    if (item.processedData) {
      content += `Topic: ${item.processedData.topic}\n`;
      content += `Intent: ${item.processedData.intent}\n`;
      
      if (item.processedData.entities.length > 0) {
        content += `Entities: ${item.processedData.entities.join(', ')}\n`;
      }
      
      if (item.processedData.categories.length > 0) {
        content += `Categories: ${item.processedData.categories.join(', ')}\n`;
      }
      
      if (item.processedData.actionItems.length > 0) {
        content += 'Action Items:\n';
        item.processedData.actionItems.forEach(action => {
          content += `- ${action}\n`;
        });
      }
    }
    
    content += '\n---\n\n';
  });
  
  if (includeWatermark) {
    content += '\nGenerated with AI Clipboard Free Version. Upgrade to Premium for more features.\n';
  }
  
  return content;
};

// Generate file content in JSON format
export const generateJsonContent = (items: ClipboardItem[], includeWatermark: boolean): string => {
  const data = {
    exportDate: new Date().toISOString(),
    items: items.map(item => ({
      id: item.id,
      timestamp: item.timestamp,
      date: new Date(item.timestamp).toISOString(),
      status: item.status,
      aiProvider: item.aiProvider,
      originalText: item.originalText,
      processedData: item.processedData,
    })),
    metadata: {
      count: items.length,
      watermark: includeWatermark ? 'Generated with AI Clipboard Free Version' : undefined,
    }
  };
  
  return JSON.stringify(data, null, 2);
};

// Generate file content in CSV format
export const generateCsvContent = (items: ClipboardItem[], includeWatermark: boolean): string => {
  // CSV header
  let content = 'ID,Timestamp,Date,Status,AI Provider,Topic,Intent,Entities,Categories,Action Items,Original Text\n';
  
  // CSV rows
  items.forEach(item => {
    const date = new Date(item.timestamp).toISOString();
    const topic = item.processedData?.topic || '';
    const intent = item.processedData?.intent || '';
    const entities = item.processedData?.entities.join('|') || '';
    const categories = item.processedData?.categories.join('|') || '';
    const actionItems = item.processedData?.actionItems.join('|') || '';
    
    // Escape commas and quotes in text fields
    const escapeCsv = (text: string) => `"${text.replace(/"/g, '""')}"`;
    
    content += [
      item.id,
      item.timestamp,
      date,
      item.status,
      item.aiProvider || '',
      escapeCsv(topic),
      escapeCsv(intent),
      escapeCsv(entities),
      escapeCsv(categories),
      escapeCsv(actionItems),
      escapeCsv(item.originalText)
    ].join(',') + '\n';
  });
  
  if (includeWatermark) {
    content += `\n"Generated with AI Clipboard Free Version. Upgrade to Premium for more features."\n`;
  }
  
  return content;
};

// Save and share file
export const saveAndShareFile = async (
  content: string, 
  fileName: string, 
  mimeType: string
): Promise<boolean> => {
  if (!isFileSystemAvailable()) {
    console.error('File system not available');
    return false;
  }
  
  try {
    // Create file in app's document directory
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(fileUri, content);
    
    // Share the file
    if (await isSharingAvailable()) {
      await Sharing.shareAsync(fileUri, {
        mimeType,
        dialogTitle: `Share ${fileName}`,
      });
      return true;
    } else {
      console.error('Sharing not available');
      return false;
    }
  } catch (error) {
    console.error('Error saving or sharing file:', error);
    return false;
  }
};

// Export clipboard items to file
export const exportClipboardItems = async (
  items: ClipboardItem[],
  format: 'txt' | 'json' | 'csv'
): Promise<boolean> => {
  // Check if format is allowed based on subscription
  const { getCurrentTier } = useSubscriptionStore.getState();
  const currentTier = getCurrentTier();
  
  if (!currentTier.downloadFormats.includes(format)) {
    console.error(`Format ${format} not allowed for current subscription tier`);
    return false;
  }
  
  // Generate file content based on format
  let content: string;
  let fileName: string;
  let mimeType: string;
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  switch (format) {
    case 'txt':
      content = generateTxtContent(items, currentTier.watermark);
      fileName = `clipboard-export-${timestamp}.txt`;
      mimeType = 'text/plain';
      break;
    case 'json':
      content = generateJsonContent(items, currentTier.watermark);
      fileName = `clipboard-export-${timestamp}.json`;
      mimeType = 'application/json';
      break;
    case 'csv':
      content = generateCsvContent(items, currentTier.watermark);
      fileName = `clipboard-export-${timestamp}.csv`;
      mimeType = 'text/csv';
      break;
    default:
      console.error(`Unsupported format: ${format}`);
      return false;
  }
  
  // Save and share file
  return await saveAndShareFile(content, fileName, mimeType);
};