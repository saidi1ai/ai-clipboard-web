export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  authProvider: 'email' | 'google' | 'anonymous';
  createdAt: number;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface SubscriptionTier {
  name: 'free' | 'premium';
  maxDailyProcessing: number;
  allowedModels: string[];
  downloadFormats: string[];
  watermark: boolean;
  priority: boolean;
}

export interface SubscriptionState {
  tier: 'free' | 'premium';
  expiresAt: number | null; // Timestamp when subscription expires
  processingCount: {
    today: number;
    date: string; // ISO date string for today
  };
  purchaseToken?: string;
}