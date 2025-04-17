import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SubscriptionState, SubscriptionTier } from '@/types/user';
import { useAuthStore } from './auth-store';

// Define subscription tiers
export const SUBSCRIPTION_TIERS: Record<'free' | 'premium', SubscriptionTier> = {
  free: {
    name: 'free',
    maxDailyProcessing: 5,
    allowedModels: ['mock', 'gemini-pro'],
    downloadFormats: ['txt'],
    watermark: true,
    priority: false,
  },
  premium: {
    name: 'premium',
    maxDailyProcessing: Infinity,
    allowedModels: ['mock', 'gemini-pro', 'gemini-ultra', 'gpt-3.5-turbo', 'gpt-4'],
    downloadFormats: ['txt', 'json', 'csv'],
    watermark: false,
    priority: true,
  }
};

interface SubscriptionStore {
  subscription: SubscriptionState;
  
  // Subscription management
  getCurrentTier: () => SubscriptionTier;
  canProcessMore: () => boolean;
  incrementProcessingCount: () => void;
  resetProcessingCount: () => void;
  
  // Purchase management
  purchaseSubscription: () => Promise<boolean>;
  cancelSubscription: () => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  
  // Helpers
  isFormatAllowed: (format: string) => boolean;
  isModelAllowed: (model: string) => boolean;
  getRemainingProcessingCount: () => number;
}

// Get today's date as ISO string (YYYY-MM-DD)
const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const useSubscriptionStore = create<SubscriptionStore>()(
  persist(
    (set, get) => ({
      subscription: {
        tier: 'free',
        expiresAt: null,
        processingCount: {
          today: 0,
          date: getTodayDateString(),
        },
      },
      
      getCurrentTier: () => {
        const { tier } = get().subscription;
        return SUBSCRIPTION_TIERS[tier];
      },
      
      canProcessMore: () => {
        const { subscription } = get();
        const currentTier = SUBSCRIPTION_TIERS[subscription.tier];
        
        // Check if today's date has changed, reset count if needed
        const today = getTodayDateString();
        if (today !== subscription.processingCount.date) {
          get().resetProcessingCount();
          return true;
        }
        
        return subscription.processingCount.today < currentTier.maxDailyProcessing;
      },
      
      incrementProcessingCount: () => {
        const { subscription } = get();
        const today = getTodayDateString();
        
        // If date has changed, reset count
        if (today !== subscription.processingCount.date) {
          set({
            subscription: {
              ...subscription,
              processingCount: {
                today: 1,
                date: today,
              }
            }
          });
          return;
        }
        
        // Increment count
        set({
          subscription: {
            ...subscription,
            processingCount: {
              today: subscription.processingCount.today + 1,
              date: today,
            }
          }
        });
      },
      
      resetProcessingCount: () => {
        const { subscription } = get();
        set({
          subscription: {
            ...subscription,
            processingCount: {
              today: 0,
              date: getTodayDateString(),
            }
          }
        });
      },
      
      purchaseSubscription: async () => {
        try {
          // Simulate purchase process
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Update subscription state
          const { subscription } = get();
          const oneMonthFromNow = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
          
          set({
            subscription: {
              ...subscription,
              tier: 'premium',
              expiresAt: oneMonthFromNow,
              purchaseToken: `purchase-${Date.now()}`,
            }
          });
          
          return true;
        } catch (error) {
          console.error('Purchase failed:', error);
          return false;
        }
      },
      
      cancelSubscription: async () => {
        try {
          // Simulate cancellation process
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Update subscription state
          const { subscription } = get();
          
          set({
            subscription: {
              ...subscription,
              tier: 'free',
              expiresAt: null,
              purchaseToken: undefined,
            }
          });
          
          return true;
        } catch (error) {
          console.error('Cancellation failed:', error);
          return false;
        }
      },
      
      restorePurchases: async () => {
        try {
          // Simulate restore process
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // For demo purposes, randomly decide if user has a subscription to restore
          const hasSubscription = Math.random() > 0.5;
          
          if (hasSubscription) {
            const { subscription } = get();
            const oneMonthFromNow = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
            
            set({
              subscription: {
                ...subscription,
                tier: 'premium',
                expiresAt: oneMonthFromNow,
                purchaseToken: `restored-${Date.now()}`,
              }
            });
            
            return true;
          }
          
          return false;
        } catch (error) {
          console.error('Restore failed:', error);
          return false;
        }
      },
      
      isFormatAllowed: (format: string) => {
        const currentTier = get().getCurrentTier();
        return currentTier.downloadFormats.includes(format);
      },
      
      isModelAllowed: (model: string) => {
        const currentTier = get().getCurrentTier();
        return currentTier.allowedModels.includes(model);
      },
      
      getRemainingProcessingCount: () => {
        const { subscription } = get();
        const currentTier = SUBSCRIPTION_TIERS[subscription.tier];
        
        // Check if today's date has changed
        const today = getTodayDateString();
        if (today !== subscription.processingCount.date) {
          return currentTier.maxDailyProcessing;
        }
        
        return Math.max(0, currentTier.maxDailyProcessing - subscription.processingCount.today);
      },
    }),
    {
      name: 'subscription-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);