// OpenAI API integration for title extraction and correction

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface TitleExtractionResult {
  title: string;
  content: string;
}

/**
 * Extract and correct title from speech transcript
 * Detects phrases like "this is my title" and extracts the title part
 */
export async function extractAndCorrectTitle(transcript: string): Promise<TitleExtractionResult | null> {
  if (!OPENAI_API_KEY) {
    console.warn('OpenAI API key not configured');
    return null;
  }

  try {
    // Detect title phrases (case-insensitive)
    const titlePhrases = [
      'this is my title',
      'title is',
      'the title is',
      'my title is',
      'title:',
      'title -',
    ];

    const lowerTranscript = transcript.toLowerCase();
    let titleStartIndex = -1;
    let detectedPhrase = '';

    // Find which title phrase was used
    for (const phrase of titlePhrases) {
      const index = lowerTranscript.indexOf(phrase);
      if (index !== -1) {
        titleStartIndex = index + phrase.length;
        detectedPhrase = phrase;
        break;
      }
    }

    if (titleStartIndex === -1) {
      return null; // No title phrase detected
    }

    // Extract title and content
    const titlePart = transcript.substring(titleStartIndex).trim();
    const contentPart = transcript.substring(0, titleStartIndex - detectedPhrase.length).trim();

    // Use OpenAI to correct and format the title
    const correctedTitle = await correctTitleWithOpenAI(titlePart);

    return {
      title: correctedTitle,
      content: contentPart,
    };
  } catch (error) {
    console.error('Error extracting title:', error);
    return null;
  }
}

/**
 * Use OpenAI to correct, format, and improve the title
 */
async function correctTitleWithOpenAI(titleText: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    return titleText; // Return original if no API key
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that corrects and formats journal entry titles. Return only the corrected title, nothing else. Make it concise (max 50 characters), grammatically correct, and properly capitalized. If the input is already good, return it as-is with minor improvements.',
          },
          {
            role: 'user',
            content: `Correct and format this journal entry title: "${titleText}"`,
          },
        ],
        max_tokens: 50,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const correctedTitle = data.choices[0]?.message?.content?.trim() || titleText;

    // Fallback: if OpenAI returns something unexpected, use original
    if (correctedTitle.length > 100) {
      return titleText.substring(0, 50);
    }

    return correctedTitle;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    // Return original title if API call fails
    return titleText.substring(0, 50);
  }
}

/**
 * Check if transcript contains title phrase
 */
export function hasTitlePhrase(transcript: string): boolean {
  const titlePhrases = [
    'this is my title',
    'title is',
    'the title is',
    'my title is',
    'title:',
    'title -',
  ];

  const lowerTranscript = transcript.toLowerCase();
  return titlePhrases.some(phrase => lowerTranscript.includes(phrase));
}

/**
 * Get AI chat response from OpenAI with streaming support
 * Optimized for mental health conversations - calm, empathic, kind
 */
export async function getAIResponse(
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  onChunk?: (chunk: string) => void
): Promise<string> {
  if (!OPENAI_API_KEY) {
    console.warn('OpenAI API key not configured - using fallback response');
    return "I hear you. Let's work through this together. Can you tell me more about what's on your mind?";
  }

  try {
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      {
        role: 'system',
        content: `You are NIRA (Neural Insight and Reframing Assistant), a compassionate mental wellness companion. Your role is to:
- Listen actively and validate feelings without judgment
- Use gentle, empathic questions to help users reframe their thoughts
- Apply NLP "sleight of mouth" techniques to shift perspectives naturally
- Keep responses concise (2-3 sentences) for natural conversation flow
- Be warm, kind, and supportive - like a wise friend who knows the right questions
- Never give direct advice, instead guide through thoughtful questions
- Respond in a conversational, natural tone as if speaking in real-time`,
      },
      ...conversationHistory,
      {
        role: 'user',
        content: userMessage,
      },
    ];

    const isStreaming = !!onChunk;
    
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Fast and cost-effective for real-time conversations
        messages,
        stream: isStreaming, // Enable streaming if callback provided
        temperature: 0.7, // Balanced for natural, empathic responses
        max_tokens: 200, // Keep responses concise but allow natural flow
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    if (onChunk && response.body) {
      // Stream the response using Server-Sent Events (SSE)
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep incomplete line in buffer

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;
            
            if (trimmedLine === 'data: [DONE]') {
              // End of stream
              break;
            }
            
            if (trimmedLine.startsWith('data: ')) {
              try {
                const jsonStr = trimmedLine.slice(6); // Remove 'data: ' prefix
                const data = JSON.parse(jsonStr);
                const content = data.choices?.[0]?.delta?.content || '';
                if (content) {
                  fullResponse += content;
                  onChunk(content);
                }
              } catch (e) {
                // Skip invalid JSON lines
                console.debug('Skipping invalid JSON line:', trimmedLine);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      return fullResponse.trim() || "I hear you. Let's work through this together. Can you tell me more about what's on your mind?";
    } else {
      // Non-streaming response (fallback if streaming fails)
      const data = await response.json();
      const responseText = data.choices[0]?.message?.content?.trim() || "I hear you. Let's work through this together. Can you tell me more about what's on your mind?";
      // If onChunk is provided but streaming wasn't used, call it once with full response
      if (onChunk && responseText) {
        onChunk(responseText);
      }
      return responseText;
    }
  } catch (error) {
    console.error('Error getting AI response:', error);
    // Return a fallback response that's still helpful
    return "I hear you. Let's work through this together. Can you tell me more about what's on your mind?";
  }
}

