import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useClipboardStore } from '@/store/clipboard-store';
import { useAppTheme } from '@/utils/theme-helper';
import { Button } from '@/components/Button';
import { Save, RotateCcw } from 'lucide-react-native';
import colors from '@/constants/colors';

export default function PromptEditorScreen() {
  const router = useRouter();
  const { settings, updateSettings } = useClipboardStore();
  const { background, text, textSecondary, card, border } = useAppTheme();
  
  const [prompt, setPrompt] = useState(settings.customPrompt);
  
  const handleSave = () => {
    if (!prompt.trim()) {
      Alert.alert("Error", "Prompt cannot be empty");
      return;
    }
    
    updateSettings({ customPrompt: prompt });
    Alert.alert(
      "Prompt Saved",
      "Your custom AI prompt has been saved successfully.",
      [{ text: "OK", onPress: () => router.back() }]
    );
  };
  
  const handleReset = () => {
    Alert.alert(
      "Reset Prompt",
      "Are you sure you want to reset the prompt to default?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reset",
          onPress: () => {
            setPrompt(`Analyze the following text and extract structured information:

{text}

Extract the following:
1. Main topic or subject
2. Key entities (people, organizations, locations, dates)
3. Primary intent (question, task, note, event, etc.)
4. Relevant categories or tags
5. Any actionable items`);
          }
        }
      ]
    );
  };
  
  return (
    <>
      <Stack.Screen options={{ title: 'Custom AI Prompt' }} />
      
      <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
        <StatusBar style="auto" />
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.description, { color: textSecondary }]}>
            Customize the instructions for AI processing. Use {text} as a placeholder for the clipboard content.
          </Text>
          
          <View style={[styles.editorContainer, { backgroundColor: card, borderColor: border }]}>
            <TextInput
              style={[styles.editor, { color: text }]}
              value={prompt}
              onChangeText={setPrompt}
              multiline
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Enter your custom AI prompt..."
              placeholderTextColor={textSecondary}
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <Button
              title="Reset to Default"
              onPress={handleReset}
              variant="outline"
              icon={<RotateCcw size={16} color={colors.primary} />}
              style={styles.resetButton}
            />
            <Button
              title="Save Prompt"
              onPress={handleSave}
              icon={<Save size={16} color="#fff" />}
              style={styles.saveButton}
            />
          </View>
          
          <View style={[styles.helpContainer, { backgroundColor: `${colors.info}20`, borderColor: colors.info }]}>
            <Text style={[styles.helpTitle, { color: colors.info }]}>
              Tips for effective prompts:
            </Text>
            <Text style={[styles.helpText, { color: text }]}>
              • Be specific about what information you want to extract
            </Text>
            <Text style={[styles.helpText, { color: text }]}>
              • Use numbered lists for structured outputs
            </Text>
            <Text style={[styles.helpText, { color: text }]}>
              • Include examples for complex formats
            </Text>
            <Text style={[styles.helpText, { color: text }]}>
              • Keep instructions clear and concise
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
  description: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
  editorContainer: {
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 24,
    height: 300,
  },
  editor: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  resetButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
  helpContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  helpText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
});