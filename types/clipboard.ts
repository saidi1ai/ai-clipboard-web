export interface ClipboardItem {
  id: string;
  originalText: string;
  processedData?: ProcessedData;
  timestamp: number;
  status: 'pending' | 'processing' | 'processed' | 'failed';
  error?: string;
  aiProvider?: string; // Track which AI provider was used
}

export interface ProcessedData {
  topic: string;
  entities: string[];
  intent: string;
  categories: string[];
  actionItems: string[];
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  customPrompt: string;
  processingEnabled: boolean;
  aiProvider: 'openai' | 'gemini' | 'mock';
  openaiApiKey: string;
  geminiApiKey: string;
  openaiModel: string;
  geminiModel: string;
}