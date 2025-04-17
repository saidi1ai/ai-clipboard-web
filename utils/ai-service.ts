import { ProcessedData, AppSettings } from '@/types/clipboard';

// Abstraction layer for AI services
export const processText = async (
  text: string, 
  promptTemplate: string,
  settings: AppSettings
): Promise<ProcessedData> => {
  // Choose the appropriate AI service based on settings
  switch (settings.aiProvider) {
    case 'openai':
      return processWithOpenAI(text, promptTemplate, settings);
    case 'gemini':
      return processWithGemini(text, promptTemplate, settings);
    case 'mock':
    default:
      return mockProcessText(text, promptTemplate);
  }
};

// OpenAI API implementation
const processWithOpenAI = async (
  text: string,
  promptTemplate: string,
  settings: AppSettings
): Promise<ProcessedData> => {
  if (!settings.openaiApiKey) {
    throw new Error('OpenAI API key is not configured. Please add your API key in settings.');
  }

  try {
    // Replace placeholder in prompt template
    const prompt = promptTemplate.replace('{text}', text);
    
    // Prepare the API request
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.openaiApiKey}`
      },
      body: JSON.stringify({
        model: settings.openaiModel,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that analyzes text and extracts structured information.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Error calling OpenAI API');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content returned from OpenAI');
    }

    // Parse the response to extract structured data
    return parseAIResponse(content, text);
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(`OpenAI processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Gemini API implementation
const processWithGemini = async (
  text: string,
  promptTemplate: string,
  settings: AppSettings
): Promise<ProcessedData> => {
  if (!settings.geminiApiKey) {
    throw new Error('Gemini API key is not configured. Please add your API key in settings.');
  }

  try {
    // Replace placeholder in prompt template
    const prompt = promptTemplate.replace('{text}', text);
    
    // Prepare the API request
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${settings.geminiModel}:generateContent?key=${settings.geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Error calling Gemini API');
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error('No content returned from Gemini');
    }

    // Parse the response to extract structured data
    return parseAIResponse(content, text);
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error(`Gemini processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Helper function to parse AI responses into structured data
const parseAIResponse = (content: string, originalText: string): ProcessedData => {
  try {
    // Try to parse as JSON first
    if (content.includes('{') && content.includes('}')) {
      const jsonMatch = content.match(/\\{.*?\\}/s) || content.match(/\\{.*\\}/s);
      if (jsonMatch) {
        try {
          const jsonData = JSON.parse(jsonMatch[0]);
          return {
            topic: jsonData.topic || jsonData.mainTopic || 'Unknown topic',
            entities: Array.isArray(jsonData.entities) ? jsonData.entities : [],
            intent: jsonData.intent || jsonData.primaryIntent || 'note',
            categories: Array.isArray(jsonData.categories) ? jsonData.categories : [],
            actionItems: Array.isArray(jsonData.actionItems) ? jsonData.actionItems : []
          };
        } catch (e) {
          console.log('Failed to parse JSON from response, falling back to text parsing');
        }
      }
    }

    // Text-based parsing as fallback
    const lines = content.split('\n').filter(line => line.trim() !== '');
    
    // Extract topic (usually first non-empty line or section)
    const topicMatch = content.match(/topic:?\s*(.*)/i) || content.match(/subject:?\s*(.*)/i);
    const topic = topicMatch ? topicMatch[1].trim() : (lines[0] || 'Unknown topic');
    
    // Extract entities
    const entitiesMatch = content.match(/entities:?\s*(.*(?:\n.*)*?)(?:\n\n|\n\d|$)/i);
    const entities = entitiesMatch 
      ? entitiesMatch[1].split(/[,\n]/).map(e => e.trim()).filter(Boolean)
      : [];
    
    // Extract intent
    const intentMatch = content.match(/intent:?\s*(.*)/i) || content.match(/purpose:?\s*(.*)/i);
    const intent = intentMatch ? intentMatch[1].trim() : 'note';
    
    // Extract categories
    const categoriesMatch = content.match(/categories:?\s*(.*(?:\n.*)*?)(?:\n\n|\n\d|$)/i) || 
                           content.match(/tags:?\s*(.*(?:\n.*)*?)(?:\n\n|\n\d|$)/i);
    const categories = categoriesMatch 
      ? categoriesMatch[1].split(/[,\n]/).map(c => c.trim()).filter(Boolean)
      : ['Miscellaneous'];
    
    // Extract action items
    const actionItemsMatch = content.match(/action items:?\s*(.*(?:\n.*)*?)(?:\n\n|$)/i) || 
                            content.match(/actions:?\s*(.*(?:\n.*)*?)(?:\n\n|$)/i);
    const actionItems = actionItemsMatch 
      ? actionItemsMatch[1].split(/\n/).map(a => a.replace(/^[-*•]/, '').trim()).filter(Boolean)
      : ['No action needed'];
    
    return {
      topic,
      entities,
      intent,
      categories,
      actionItems
    };
  } catch (error) {
    console.error('Error parsing AI response:', error);
    
    // Fallback to a basic extraction
    return {
      topic: originalText.length > 30 
        ? originalText.substring(0, 30).split(' ').slice(0, -1).join(' ') + '...'
        : originalText,
      entities: [],
      intent: 'note',
      categories: ['Miscellaneous'],
      actionItems: ['No action needed'],
    };
  }
};

// This is a mock function that simulates AI processing
// Used when no API keys are configured or for testing
export const mockProcessText = async (
  text: string, 
  promptTemplate: string
): Promise<ProcessedData> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Randomly fail sometimes to simulate errors
  if (Math.random() < 0.1) {
    throw new Error('AI processing failed. Please try again.');
  }

  // Simple text analysis to extract entities
  const words = text.split(/\s+/);
  const entities = words
    .filter(word => word.length > 4 && /^[A-Z]/.test(word))
    .slice(0, 3);
  
  // Determine intent based on text patterns
  let intent = 'note';
  if (text.includes('?')) {
    intent = 'question';
  } else if (/buy|purchase|get|pick up/i.test(text)) {
    intent = 'shopping';
  } else if (/meet|call|talk|discuss|appointment/i.test(text)) {
    intent = 'meeting';
  } else if (/todo|task|remember|don't forget/i.test(text)) {
    intent = 'task';
  }
  
  // Extract potential action items
  const actionItems = [];
  if (/call|email|contact|reach out/i.test(text)) {
    actionItems.push('Contact someone');
  }
  if (/buy|purchase|get/i.test(text)) {
    actionItems.push('Purchase items');
  }
  if (/schedule|plan|arrange/i.test(text)) {
    actionItems.push('Schedule event');
  }
  if (/review|check|look at/i.test(text)) {
    actionItems.push('Review information');
  }
  
  // Determine categories
  const categories = [];
  if (/work|project|client|meeting|deadline/i.test(text)) {
    categories.push('Work');
  }
  if (/buy|shop|store|purchase|price/i.test(text)) {
    categories.push('Shopping');
  }
  if (/eat|food|restaurant|lunch|dinner|breakfast/i.test(text)) {
    categories.push('Food');
  }
  if (/family|kids|parents|home/i.test(text)) {
    categories.push('Personal');
  }
  if (categories.length === 0) {
    categories.push('Miscellaneous');
  }
  
  // Extract topic (simple implementation)
  const topic = text.length > 30 
    ? text.substring(0, 30).split(' ').slice(0, -1).join(' ') + '...'
    : text;
  
  return {
    topic,
    entities,
    intent,
    categories,
    actionItems: actionItems.length > 0 ? actionItems : ['No action needed'],
  };
};