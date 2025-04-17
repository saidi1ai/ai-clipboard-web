import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable,
  ScrollView,
  Modal,
} from 'react-native';
import { useAppTheme } from '@/utils/theme-helper';
import { ChevronDown } from 'lucide-react-native';
import colors from '@/constants/colors';

type ModelOption = {
  id: string;
  name: string;
  description?: string;
};

type ModelSelectorProps = {
  label: string;
  value: string;
  options: ModelOption[];
  onChange: (value: string) => void;
};

export const ModelSelector = ({
  label,
  value,
  options,
  onChange,
}: ModelSelectorProps) => {
  const { card, text, textSecondary, border, background } = useAppTheme();
  const [modalVisible, setModalVisible] = React.useState(false);
  
  const selectedOption = options.find(option => option.id === value) || options[0];
  
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: text }]}>{label}</Text>
      
      <Pressable
        style={({ pressed }) => [
          styles.selector,
          { backgroundColor: card, borderColor: border, opacity: pressed ? 0.7 : 1 }
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.selectedText, { color: text }]}>
          {selectedOption.name}
        </Text>
        <ChevronDown size={20} color={textSecondary} />
      </Pressable>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: background }]}>
            <Text style={[styles.modalTitle, { color: text }]}>Select Model</Text>
            
            <ScrollView style={styles.optionsList}>
              {options.map((option) => (
                <Pressable
                  key={option.id}
                  style={({ pressed }) => [
                    styles.optionItem,
                    { 
                      backgroundColor: option.id === value ? `${colors.primary}20` : card,
                      borderColor: border,
                      opacity: pressed ? 0.7 : 1
                    }
                  ]}
                  onPress={() => {
                    onChange(option.id);
                    setModalVisible(false);
                  }}
                >
                  <View>
                    <Text style={[
                      styles.optionName, 
                      { 
                        color: text,
                        fontWeight: option.id === value ? '700' : '500'
                      }
                    ]}>
                      {option.name}
                    </Text>
                    {option.description && (
                      <Text style={[styles.optionDescription, { color: textSecondary }]}>
                        {option.description}
                      </Text>
                    )}
                  </View>
                  
                  {option.id === value && (
                    <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
            
            <Pressable
              style={({ pressed }) => [
                styles.closeButton,
                { backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 }
              ]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  selectedText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  optionsList: {
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  optionName: {
    fontSize: 16,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
  },
  selectedIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  closeButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});