import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState } from '@/types/user';
import { generateUUID } from '@/utils/uuid-helper';

interface AuthStore extends AuthState {
  // Auth actions
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInAnonymously: () => Promise<void>;
  signOut: () => void;
  
  // Profile actions
  updateProfile: (data: Partial<User>) => void;
}

// Mock authentication for demo purposes
// In a real app, you would integrate with Firebase Auth or another auth provider
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      signUp: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // Simulate network request
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if email is already in use (mock validation)
          if (email === 'test@example.com') {
            throw new Error('Email already in use');
          }
          
          // Create new user
          const newUser: User = {
            id: generateUUID(),
            email,
            authProvider: 'email',
            createdAt: Date.now(),
          };
          
          set({ user: newUser, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Sign up failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      signIn: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // Simulate network request
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock validation
          if (email !== 'test@example.com' || password !== 'password') {
            throw new Error('Invalid email or password');
          }
          
          // Mock user
          const user: User = {
            id: 'test-user-id',
            email: 'test@example.com',
            displayName: 'Test User',
            authProvider: 'email',
            createdAt: Date.now() - 86400000, // 1 day ago
          };
          
          set({ user, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Sign in failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      signInWithGoogle: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // Simulate network request
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock Google user
          const user: User = {
            id: 'google-user-id',
            email: 'google@example.com',
            displayName: 'Google User',
            photoURL: 'https://ui-avatars.com/api/?name=Google+User&background=random',
            authProvider: 'google',
            createdAt: Date.now(),
          };
          
          set({ user, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Google sign in failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      signInAnonymously: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // Simulate network request
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Create anonymous user
          const user: User = {
            id: generateUUID(),
            email: `anonymous-${Date.now()}@example.com`,
            displayName: 'Anonymous User',
            authProvider: 'anonymous',
            createdAt: Date.now(),
          };
          
          set({ user, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Anonymous sign in failed', 
            isLoading: false 
          });
          throw error;
        }
      },

      signOut: () => {
        set({ user: null, error: null });
      },

      updateProfile: (data: Partial<User>) => {
        const { user } = get();
        if (!user) return;
        
        set({ 
          user: { 
            ...user, 
            ...data 
          } 
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);