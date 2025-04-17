import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Pressable,
  Alert,
} from 'react-native';
import { useAppTheme } from '@/utils/theme-helper';
import { Eye, EyeOff, Key } from 'lucide-react-native';
import colors from '@/constants/colors';

type ApiKeyInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  testButtonLabel?: string;
  onTestKey?: () => Promise<boolean>;
};

export const ApiKeyInput = ({
  label,
  value,
  onChangeText,
  placeholder = "Enter API key",
  testButtonLabel = "Test Key",
  onTestKey,
}: ApiKeyInputProps) => {
  const { card, text, textSecondary, border } = useAppTheme();
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleTestKey = async () => {
    if (!value.trim()) {
      Alert.alert("Error", "Please enter an API key first");
      return;
    }

    if (onTestKey) {
      setIsTesting(true);
      try {
        const success = await onTestKey();
        if (success) {
          Alert.alert("Success", "API key is valid and working correctly");
        }
      } catch (error) {
        // Error handling is done in the onTestKey function
      } finally {
        setIsTesting(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Key size={16} color={colors.primary} />
        <Text style={[styles.label, { color: text }]}>{label}</Text>
      </View>
      
      <View style={[styles.inputContainer, { backgroundColor: card, borderColor: border }]}>
        <TextInput
          style={[styles.input, { color: text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={textSecondary}
          secureTextEntry={!showKey}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Pressable
          style={styles.visibilityButton}
          onPress={() => setShowKey(!showKey)}
        >
          {showKey ? (
            <EyeOff size={20} color={textSecondary} />
          ) : (
            <Eye size={20} color={textSecondary} />
          )}
        </Pressable>
      </View>
      
      {onTestKey && (
        <Pressable
          style={({ pressed }) => [
            styles.testButton,
            { backgroundColor: colors.primary, opacity: pressed || isTesting ? 0.7 : 1 }
          ]}
          onPress={handleTestKey}
          disabled={isTesting || !value.trim()}
        >
          <Text style={styles.testButtonText}>{isTesting ? "Testing..." : testButtonLabel}</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  visibilityButton: {
    padding: 8,
  },
  testButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  testButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});