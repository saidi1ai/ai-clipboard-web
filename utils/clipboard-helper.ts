import { Platform } from 'react-native';

// Use a dynamic import approach to handle potential missing dependency
let Clipboard: any = null;

// Try to import expo-clipboard, but handle the case where it might not be available
try {
  // This will be properly resolved if the package is available
  const clipboardModule = require('expo-clipboard');
  Clipboard = clipboardModule;
} catch (error) {
  console.warn('expo-clipboard not available, clipboard functionality will be limited');
}

export const getClipboardText = async (): Promise<string> => {
  try {
    // Check if Clipboard is available
    if (!Clipboard) {
      console.warn('Clipboard API not available');
      return '';
    }
    
    // Check if clipboard has text content
    const hasString = await Clipboard.hasStringAsync();
    if (!hasString) {
      return '';
    }
    
    // Get the text content
    const text = await Clipboard.getStringAsync();
    return text;
  } catch (error) {
    console.error('Failed to get clipboard content:', error);
    return '';
  }
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (!Clipboard) {
      console.warn('Clipboard API not available');
      return false;
    }
    
    await Clipboard.setStringAsync(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

// This function checks if the clipboard API is available
export const isClipboardAvailable = (): boolean => {
  if (Platform.OS === 'web') {
    return navigator && 'clipboard' in navigator;
  }
  return Clipboard !== null;
};