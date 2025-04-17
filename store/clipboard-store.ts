import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClipboardItem, AppSettings, ProcessedData } from '@/types/clipboard';
import { processText } from '@/utils/ai-service';
import { useAuthStore } from './auth-store';

interface ClipboardState {
  items: ClipboardItem[];
  settings: AppSettings;
  isProcessing: boolean;
  stats: {
    processedToday: number;
    successRate: number;
  };
  
  // Actions
  addItem: (text: string) => Promise<void>;
  removeItem: (id: string) => void;
  clearItems: () => void;
  retryItem: (id: string) => Promise<void>;
  updateSettings: (settings: Partial<AppSettings>) => void;
  getItemById: (id: string) => ClipboardItem | undefined;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  notifications: true,
  customPrompt: `Analyze the following text and extract structured information:

{text}

Extract the following:
1. Main topic or subject
2. Key entities (people, organizations, locations, dates)
3. Primary intent (question, task, note, event, etc.)
4. Relevant categories or tags
5. Any actionable items`,
  processingEnabled: true,
  aiProvider: 'mock', // Default to mock for safety
  openaiApiKey: '',
  geminiApiKey: '',
  openaiModel: 'gpt-3.5-turbo',
  geminiModel: 'gemini-pro',
};

// Get the current user ID for storage isolation
const getUserId = () => {
  return useAuthStore.getState().user?.id || 'anonymous';
};

// Create a storage key based on the user ID
const getStorageKey = () => {
  const userId = getUserId();
  return `clipboard-storage-${userId}`;
};

export const useClipboardStore = create<ClipboardState>()(
  persist(
    (set, get) => ({
      items: [],
      settings: DEFAULT_SETTINGS,
      isProcessing: false,
      stats: {
        processedToday: 0,
        successRate: 100,
      },

      addItem: async (text: string) => {
        const newItem: ClipboardItem = {
          id: Date.now().toString(),
          originalText: text,
          timestamp: Date.now(),
          status: 'pending',
          aiProvider: get().settings.aiProvider,
        };

        set((state) => ({
          items: [newItem, ...state.items],
        }));

        if (get().settings.processingEnabled) {
          await get().retryItem(newItem.id);
        }
      },

      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      clearItems: () => {
        set({ items: [] });
      },

      retryItem: async (id: string) => {
        const item = get().items.find((item) => item.id === id);
        if (!item) return;

        const settings = get().settings;

        set((state) => ({
          items: state.items.map((item) => 
            item.id === id ? { 
              ...item, 
              status: 'processing',
              aiProvider: settings.aiProvider, // Update with current provider
            } : item
          ),
          isProcessing: true,
        }));

        try {
          // Process text using the selected AI provider
          const processedData = await processText(
            item.originalText, 
            settings.customPrompt,
            settings
          );

          set((state) => {
            const updatedItems = state.items.map((item) => 
              item.id === id 
                ? { 
                    ...item, 
                    status: 'processed' as const, 
                    processedData,
                    error: undefined,
                  } 
                : item
            );

            // Calculate new stats
            const today = new Date().setHours(0, 0, 0, 0);
            const processedToday = updatedItems.filter(
              item => item.status === 'processed' && 
                     new Date(item.timestamp).setHours(0, 0, 0, 0) === today
            ).length;

            const totalItems = updatedItems.filter(
              item => item.status === 'processed' || item.status === 'failed'
            ).length;
            
            const successItems = updatedItems.filter(
              item => item.status === 'processed'
            ).length;

            const successRate = totalItems > 0 
              ? Math.round((successItems / totalItems) * 100) 
              : 100;

            return {
              items: updatedItems,
              isProcessing: false,
              stats: {
                processedToday,
                successRate,
              }
            };
          });
        } catch (error) {
          set((state) => ({
            items: state.items.map((item) => 
              item.id === id 
                ? { 
                    ...item, 
                    status: 'failed' as const, 
                    error: error instanceof Error ? error.message : 'Unknown error',
                  } 
                : item
            ),
            isProcessing: false,
          }));
        }
      },

      updateSettings: (newSettings: Partial<AppSettings>) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      getItemById: (id: string) => {
        return get().items.find((item) => item.id === id);
      },
    }),
    {
      name: getStorageKey(),
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => {
        return {
          items: state.items,
          settings: state.settings,
          // Include user ID in persisted state for data isolation
          _userId: getUserId(),
        };
      },
    }
  )
);