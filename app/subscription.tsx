import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useSubscriptionStore, SUBSCRIPTION_TIERS } from '@/store/subscription-store';
import { useAppTheme } from '@/utils/theme-helper';
import { Button } from '@/components/Button';
import { 
  Crown, 
  Check, 
  X, 
  Download, 
  Bot, 
  Infinity, 
  Zap,
  Sparkles,
} from 'lucide-react-native';
import colors from '@/constants/colors';

export default function SubscriptionScreen() {
  const router = useRouter();
  const { subscription, purchaseSubscription, cancelSubscription, restorePurchases } = useSubscriptionStore();
  const { background, text, textSecondary, card, border } = useAppTheme();
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handlePurchase = async () => {
    setIsLoading(true);
    
    try {
      const success = await purchaseSubscription();
      
      if (success) {
        Alert.alert(
          "Subscription Activated",
          "Thank you for subscribing to AI Clipboard Premium!",
          [{ text: "OK", onPress: () => router.back() }]
        );
      } else {
        Alert.alert(
          "Purchase Failed",
          "There was an error processing your purchase. Please try again."
        );
      }
    } catch (error) {
      Alert.alert(
        "Purchase Error",
        "An unexpected error occurred during purchase."
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = async () => {
    Alert.alert(
      "Cancel Subscription",
      "Are you sure you want to cancel your premium subscription? You'll still have access until the end of your current billing period.",
      [
        { text: "Keep Subscription", style: "cancel" },
        { 
          text: "Cancel Subscription", 
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            
            try {
              const success = await cancelSubscription();
              
              if (success) {
                Alert.alert(
                  "Subscription Cancelled",
                  "Your subscription has been cancelled. You'll have access until the end of your current billing period.",
                  [{ text: "OK", onPress: () => router.back() }]
                );
              } else {
                Alert.alert(
                  "Cancellation Failed",
                  "There was an error cancelling your subscription. Please try again."
                );
              }
            } catch (error) {
              Alert.alert(
                "Cancellation Error",
                "An unexpected error occurred during cancellation."
              );
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };
  
  const handleRestore = async () => {
    setIsLoading(true);
    
    try {
      const success = await restorePurchases();
      
      if (success) {
        Alert.alert(
          "Purchase Restored",
          "Your premium subscription has been restored successfully!",
          [{ text: "OK", onPress: () => router.back() }]
        );
      } else {
        Alert.alert(
          "No Purchases Found",
          "We couldn't find any previous purchases to restore."
        );
      }
    } catch (error) {
      Alert.alert(
        "Restore Error",
        "An unexpected error occurred while restoring purchases."
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderFeatureItem = (
    title: string, 
    freeTier: string | boolean | number, 
    premiumTier: string | boolean | number,
    icon: React.ReactNode
  ) => {
    return (
      <View style={styles.featureItem}>
        <View style={styles.featureIcon}>
          {icon}
        </View>
        
        <View style={styles.featureContent}>
          <Text style={[styles.featureTitle, { color: text }]}>
            {title}
          </Text>
          
          <View style={styles.tierComparison}>
            <View style={styles.tierValue}>
              {typeof freeTier === 'boolean' ? (
                freeTier ? (
                  <Check size={18} color={colors.success} />
                ) : (
                  <X size={18} color={colors.error} />
                )
              ) : (
                <Text style={[styles.tierValueText, { color: textSecondary }]}>
                  {freeTier}
                </Text>
              )}
            </View>
            
            <View style={styles.tierValue}>
              {typeof premiumTier === 'boolean' ? (
                premiumTier ? (
                  <Check size={18} color={colors.success} />
                ) : (
                  <X size={18} color={colors.error} />
                )
              ) : (
                <Text style={[styles.tierValueText, { color: text }]}>
                  {premiumTier}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };
  
  return (
    <>
      <Stack.Screen options={{ title: 'Subscription' }} />
      
      <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
        <StatusBar style="auto" />
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Crown size={40} color={colors.secondary} />
            <Text style={[styles.title, { color: text }]}>
              AI Clipboard Premium
            </Text>
            <Text style={[styles.subtitle, { color: textSecondary }]}>
              Unlock unlimited AI processing and premium features
            </Text>
          </View>
          
          <View style={styles.pricingContainer}>
            <View style={styles.tierLabels}>
              <View style={styles.tierLabelSpacer} />
              <View style={styles.tierLabel}>
                <Text style={[styles.tierLabelText, { color: textSecondary }]}>
                  Free
                </Text>
              </View>
              <View style={[styles.tierLabel, styles.premiumLabel]}>
                <Text style={styles.premiumLabelText}>
                  Premium
                </Text>
              </View>
            </View>
            
            {renderFeatureItem(
              'Daily AI Processing',
              '5 items',
              'Unlimited',
              <Infinity size={22} color={colors.primary} />
            )}
            
            {renderFeatureItem(
              'AI Models',
              'Basic only',
              'All models',
              <Bot size={22} color={colors.primary} />
            )}
            
            {renderFeatureItem(
              'Export Formats',
              'TXT only',
              'TXT, JSON, CSV',
              <Download size={22} color={colors.primary} />
            )}
            
            {renderFeatureItem(
              'Priority Processing',
              false,
              true,
              <Zap size={22} color={colors.primary} />
            )}
            
            {renderFeatureItem(
              'No Watermarks',
              false,
              true,
              <Sparkles size={22} color={colors.primary} />
            )}
          </View>
          
          <View style={styles.actionContainer}>
            {subscription.tier === 'free' ? (
              <>
                <Button
                  title="Subscribe for $1.99/month"
                  onPress={handlePurchase}
                  loading={isLoading}
                  disabled={isLoading}
                  icon={<Crown size={18} color="#fff" />}
                  style={styles.subscribeButton}
                  size="large"
                />
                
                <Pressable
                  style={({ pressed }) => [
                    styles.restoreButton,
                    { opacity: pressed ? 0.7 : 1 }
                  ]}
                  onPress={handleRestore}
                  disabled={isLoading}
                >
                  <Text style={[styles.restoreText, { color: colors.primary }]}>
                    Restore Purchases
                  </Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text style={[styles.activeSubscriptionText, { color: text }]}>
                  You have an active Premium subscription
                </Text>
                
                {subscription.expiresAt && (
                  <Text style={[styles.expiryText, { color: textSecondary }]}>
                    Expires: {new Date(subscription.expiresAt).toLocaleDateString()}
                  </Text>
                )}
                
                <Button
                  title="Cancel Subscription"
                  onPress={handleCancel}
                  variant="outline"
                  loading={isLoading}
                  disabled={isLoading}
                  style={styles.cancelButton}
                />
              </>
            )}
          </View>
          
          <View style={[styles.termsContainer, { borderTopColor: border }]}>
            <Text style={[styles.termsText, { color: textSecondary }]}>
              By subscribing, you agree to our Terms of Service and Privacy Policy. 
              Subscriptions automatically renew unless auto-renew is turned off at least 24 hours before the end of the current period.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  pricingContainer: {
    marginBottom: 32,
  },
  tierLabels: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tierLabelSpacer: {
    width: 60,
  },
  tierLabel: {
    flex: 1,
    alignItems: 'center',
  },
  tierLabelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  premiumLabel: {
    backgroundColor: colors.secondary,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  premiumLabelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  featureIcon: {
    width: 40,
    marginRight: 16,
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  tierComparison: {
    flexDirection: 'row',
  },
  tierValue: {
    flex: 1,
    alignItems: 'center',
  },
  tierValueText: {
    fontSize: 14,
  },
  actionContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  subscribeButton: {
    width: '100%',
    marginBottom: 16,
  },
  restoreButton: {
    padding: 8,
  },
  restoreText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeSubscriptionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  expiryText: {
    fontSize: 14,
    marginBottom: 16,
  },
  cancelButton: {
    marginTop: 8,
  },
  termsContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
  },
});