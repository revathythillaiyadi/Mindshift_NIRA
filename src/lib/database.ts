// Database service functions for interacting with Supabase tables

import { supabase } from './supabase';
import type { 
  JournalEntry, 
  ChatHistory, 
  ChatSession,
  UserStats, 
  Achievement,
  JournalEntryInsert,
  ChatHistoryInsert,
  ChatSessionInsert,
  ChatSessionUpdate,
  UserStatsInsert,
  AchievementInsert,
  JournalEntryUpdate,
  UserStatsUpdate
} from '../types/database';

// ============================================
// JOURNAL ENTRIES
// ============================================

export async function getJournalEntries(userId: string): Promise<JournalEntry[]> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getJournalEntryById(entryId: string, userId: string): Promise<JournalEntry | null> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('id', entryId)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  return data;
}

export async function createJournalEntry(entry: JournalEntryInsert): Promise<JournalEntry> {
  const { data, error } = await supabase
    .from('journal_entries')
    .insert(entry)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateJournalEntry(
  entryId: string, 
  userId: string, 
  updates: JournalEntryUpdate
): Promise<JournalEntry> {
  const { data, error } = await supabase
    .from('journal_entries')
    .update(updates)
    .eq('id', entryId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteJournalEntry(entryId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', entryId)
    .eq('user_id', userId);

  if (error) throw error;
}

// ============================================
// CHAT HISTORY
// ============================================

export async function getChatHistory(userId: string, limit: number = 50): Promise<ChatHistory[]> {
  const { data, error } = await supabase
    .from('chat_history')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []).reverse(); // Reverse to show oldest first
}

// Deprecated: Use getChatSessions instead
// This function is kept for backward compatibility but will use sessions table if available
export async function getFirstMessagesOfConversations(userId: string, limit: number = 20): Promise<{ id: string; title: string; timestamp: Date }[]> {
  try {
    // Try to get from sessions table first
    const sessions = await getChatSessions(userId, limit);
    if (sessions.length > 0) {
      return sessions.map(session => ({
        id: session.id,
        title: session.title || 'Untitled Conversation',
        timestamp: new Date(session.updated_at),
      }));
    }
  } catch (error) {
    // Fallback to old method if sessions table doesn't exist yet
    console.warn('Sessions table not available, using fallback method:', error);
  }

  // Fallback: use old method based on chat_history
  const { data, error } = await supabase
    .from('chat_history')
    .select('*')
    .eq('user_id', userId)
    .eq('speaker', 'user') // Only get user messages
    .order('timestamp', { ascending: false })
    .limit(limit * 5); // Get more to find first messages of sessions

  if (error) throw error;
  if (!data || data.length === 0) return [];

  // Group into conversations based on time gaps (5 minutes)
  const conversations: { id: string; title: string; timestamp: Date }[] = [];
  const GAP_MINUTES = 5;

  for (let i = 0; i < data.length; i++) {
    const message = data[i];
    const messageTime = new Date(message.timestamp);

    if (conversations.length === 0) {
      // First conversation - use extractTitleFromMessage for better titles
      conversations.push({
        id: message.id,
        title: extractTitleFromMessage(message.message),
        timestamp: messageTime,
      });
    } else {
      const lastConversation = conversations[conversations.length - 1];
      const timeDiffMinutes = (lastConversation.timestamp.getTime() - messageTime.getTime()) / (1000 * 60);

      // If more than 5 minutes apart, it's a new conversation
      if (timeDiffMinutes > GAP_MINUTES) {
        conversations.push({
          id: message.id,
          title: extractTitleFromMessage(message.message),
          timestamp: messageTime,
        });
      }
      // Otherwise, skip (it's part of the same conversation)
    }

    if (conversations.length >= limit) break;
  }

  return conversations;
}

export async function createChatMessage(message: ChatHistoryInsert): Promise<ChatHistory> {
  const { data, error } = await supabase
    .from('chat_history')
    .insert(message)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// CHAT SESSIONS
// ============================================

/**
 * Generate a title from the first 1-2 complete sentences of a message
 * Uses complete sentences to create meaningful titles (not just first characters)
 */
export function extractTitleFromMessage(message: string): string {
  // Remove leading/trailing whitespace
  message = message.trim();
  
  if (!message) return 'Untitled Conversation';
  
  // Find sentence endings (. ! ? followed by space or end of string)
  // Improved regex to handle multiple punctuation marks and various spacing
  const sentenceEndings = /[.!?]+(?:\s+|$)/;
  const sentences: string[] = [];
  let remaining = message;
  
  // Extract first 1-2 complete sentences
  for (let i = 0; i < 2 && remaining.length > 0; i++) {
    const match = remaining.match(sentenceEndings);
    if (match && match.index !== undefined) {
      // Found a sentence ending
      const sentenceEnd = match.index + match[0].length;
      const sentence = remaining.substring(0, sentenceEnd).trim();
      if (sentence.length > 0) {
        sentences.push(sentence);
      }
      remaining = remaining.substring(sentenceEnd).trim();
    } else {
      // No sentence ending found - take the remaining text as one sentence
      if (remaining.length > 0 && sentences.length === 0) {
        sentences.push(remaining.trim());
      }
      break;
    }
  }
  
  // If we have sentences, use them; otherwise use first 60 chars (with word boundary)
  if (sentences.length > 0) {
    const title = sentences.join(' ').trim();
    // Limit to 80 characters for display (truncate at word boundary if possible)
    if (title.length > 80) {
      const truncated = title.substring(0, 80);
      // Try to truncate at word boundary
      const lastSpace = truncated.lastIndexOf(' ');
      if (lastSpace > 60) {
        return truncated.substring(0, lastSpace) + '...';
      }
      return truncated + '...';
    }
    return title;
  }
  
  // Fallback: use first 60 characters, truncate at word boundary if possible
  if (message.length > 60) {
    const truncated = message.substring(0, 60);
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > 40) {
      return truncated.substring(0, lastSpace) + '...';
    }
    return truncated + '...';
  }
  return message;
}

/**
 * Get all chat sessions for a user, ordered by most recent
 */
export async function getChatSessions(userId: string, limit: number = 20): Promise<ChatSession[]> {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

/**
 * Get a single chat session by ID
 */
export async function getChatSession(sessionId: string, userId: string): Promise<ChatSession | null> {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  return data;
}

/**
 * Create a new chat session
 */
export async function createChatSession(session: ChatSessionInsert): Promise<ChatSession> {
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert(session)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update a chat session (e.g., update title or updated_at)
 */
export async function updateChatSession(
  sessionId: string,
  userId: string,
  updates: ChatSessionUpdate
): Promise<ChatSession> {
  const { data, error } = await supabase
    .from('chat_sessions')
    .update(updates)
    .eq('id', sessionId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a chat session and all its messages
 * Handles both cases: when sessions table exists and when it doesn't (fallback mode)
 */
export async function deleteChatSession(sessionId: string, userId: string): Promise<void> {
  try {
    // Try to get session from chat_sessions table
    const session = await getChatSession(sessionId, userId);
    
    if (session && session.first_message_id) {
      // Session table exists - delete all messages in this session
      // Find the first message timestamp
      const { data: firstMessage, error: firstMsgError } = await supabase
        .from('chat_history')
        .select('timestamp')
        .eq('id', session.first_message_id)
        .eq('user_id', userId)
        .single();

      if (firstMsgError) {
        console.error('Error finding first message:', firstMsgError);
        // Continue with session deletion even if first message not found
      } else if (firstMessage) {
        const messageTime = new Date(firstMessage.timestamp);
        // Use a larger window (30 minutes) to capture longer conversations
        const conversationEndTime = new Date(messageTime.getTime() + 30 * 60 * 1000);

        // Delete all messages in this conversation window
        // Use >= and <= with proper ISO string formatting
        const { error: deleteError, count } = await supabase
          .from('chat_history')
          .delete()
          .eq('user_id', userId)
          .gte('timestamp', messageTime.toISOString())
          .lte('timestamp', conversationEndTime.toISOString());

        if (deleteError) {
          console.error('Error deleting chat history:', deleteError);
          throw deleteError;
        }
        console.log(`Deleted messages for session ${sessionId}`);
      }

      // Delete the session itself
      const { error: sessionError } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', userId);

      if (sessionError) {
        console.error('Error deleting chat session:', sessionError);
        throw sessionError;
      }
      console.log(`Deleted session ${sessionId}`);
    } else {
      // Sessions table doesn't exist or session not found - delete by message ID directly
      // In fallback mode, sessionId is actually a message ID
      // Find the first message to identify the conversation time window
      const { data: firstMessage, error: msgError } = await supabase
        .from('chat_history')
        .select('timestamp')
        .eq('id', sessionId)
        .eq('user_id', userId)
        .single();

      if (msgError || !firstMessage) {
        console.warn('Message not found for deletion:', sessionId);
        // Try to delete the message directly anyway
        const { error: directDeleteError } = await supabase
          .from('chat_history')
          .delete()
          .eq('id', sessionId)
          .eq('user_id', userId);
        
        if (directDeleteError) {
          console.error('Error deleting message directly:', directDeleteError);
          throw directDeleteError;
        }
        return;
      }

      const messageTime = new Date(firstMessage.timestamp);
      // Use a larger window (30 minutes) to capture longer conversations
      const conversationEndTime = new Date(messageTime.getTime() + 30 * 60 * 1000);

      // Delete all messages in this conversation (within 30 minutes of first message)
      const { error: deleteError } = await supabase
        .from('chat_history')
        .delete()
        .eq('user_id', userId)
        .gte('timestamp', messageTime.toISOString())
        .lte('timestamp', conversationEndTime.toISOString());

      if (deleteError) {
        console.error('Error deleting chat history:', deleteError);
        throw deleteError;
      }
      console.log(`Deleted messages for conversation starting at ${messageTime.toISOString()}`);
    }
  } catch (error: any) {
    console.error('Error in deleteChatSession:', error);
    // If sessions table doesn't exist, fallback to deleting from chat_history
    if (error?.code === '42P01' || error?.message?.includes('does not exist')) {
      // Table doesn't exist - delete directly from chat_history using sessionId as messageId
      const { data: message, error: msgError } = await supabase
        .from('chat_history')
        .select('timestamp')
        .eq('id', sessionId)
        .eq('user_id', userId)
        .single();

      if (message && !msgError) {
        const messageTime = new Date(message.timestamp);
        const conversationEndTime = new Date(messageTime.getTime() + 30 * 60 * 1000);

        const { error: deleteError } = await supabase
          .from('chat_history')
          .delete()
          .eq('user_id', userId)
          .gte('timestamp', messageTime.toISOString())
          .lte('timestamp', conversationEndTime.toISOString());
        
        if (deleteError) {
          console.error('Error deleting chat history in fallback:', deleteError);
          throw deleteError;
        }
      } else {
        // Message not found, try deleting directly
        const { error: directDeleteError } = await supabase
          .from('chat_history')
          .delete()
          .eq('id', sessionId)
          .eq('user_id', userId);
        
        if (directDeleteError) {
          console.error('Error deleting message directly in fallback:', directDeleteError);
          throw directDeleteError;
        }
      }
    } else {
      throw error;
    }
  }
}

/**
 * Get or create a chat session for the current conversation
 * Groups messages within 5 minutes into the same session
 */
export async function getOrCreateChatSession(
  userId: string,
  firstMessageId: string,
  firstMessage: string
): Promise<ChatSession> {
  try {
    // Check if there's an existing session with this first message
    const existing = await getChatSession(firstMessageId, userId);
    if (existing && existing.first_message_id === firstMessageId) {
      // Session exists, return it
      return existing;
    }

    // Check if a session exists with this first_message_id (might have been created already)
    const { data: existingSession, error: findError } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('first_message_id', firstMessageId)
      .maybeSingle();

    if (existingSession && !findError) {
      return existingSession;
    }

    // Generate title from first message (using first 1-2 sentences)
    const title = extractTitleFromMessage(firstMessage);

    // Create new session
    return await createChatSession({
      user_id: userId,
      title: title || 'Untitled Conversation',
      first_message_id: firstMessageId,
    });
  } catch (error) {
    console.error('Error in getOrCreateChatSession:', error);
    // Fallback: create a new session even if lookup fails
    const title = extractTitleFromMessage(firstMessage);
    return await createChatSession({
      user_id: userId,
      title: title || 'Untitled Conversation',
      first_message_id: firstMessageId,
    });
  }
}

export async function deleteChatHistory(userId: string): Promise<void> {
  const { error } = await supabase
    .from('chat_history')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
}

// ============================================
// USER STATS
// ============================================

export async function getUserStats(userId: string): Promise<UserStats | null> {
  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Stats don't exist, create them
      return await createUserStats({ user_id: userId });
    }
    throw error;
  }
  return data;
}

export async function createUserStats(stats: UserStatsInsert): Promise<UserStats> {
  const { data, error } = await supabase
    .from('user_stats')
    .insert(stats)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserStats(
  userId: string, 
  updates: UserStatsUpdate
): Promise<UserStats> {
  const { data, error } = await supabase
    .from('user_stats')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Helper function to update streak
export async function updateStreak(userId: string, increment: boolean = true): Promise<UserStats> {
  const stats = await getUserStats(userId);
  if (!stats) throw new Error('User stats not found');

  const newStreak = increment ? stats.current_streak + 1 : 0;
  const longestStreak = Math.max(stats.longest_streak, newStreak);

  return await updateUserStats(userId, {
    current_streak: newStreak,
    longest_streak: longestStreak,
    last_journal_date: new Date().toISOString().split('T')[0],
    journal_count_monthly: stats.journal_count_monthly + 1
  });
}

// Helper function to update stats based on conversation activity
export async function updateStatsFromConversation(
  userId: string, 
  conversationMinutes: number = 1
): Promise<UserStats> {
  const stats = await getUserStats(userId);
  if (!stats) throw new Error('User stats not found');

  const today = new Date().toISOString().split('T')[0];
  const lastCheckInDate = stats.last_journal_date;
  
  // Check if this is the first conversation/check-in of the day
  const isFirstCheckInToday = lastCheckInDate !== today;
  
  // Calculate new streak if first check-in today
  let newStreak = stats.current_streak;
  let longestStreak = stats.longest_streak;
  
  if (isFirstCheckInToday) {
    // Check if streak should continue (within 24 hours)
    if (lastCheckInDate) {
      const lastDate = new Date(lastCheckInDate);
      const todayDate = new Date(today);
      const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // Consecutive day - increment streak
        newStreak = stats.current_streak + 1;
      } else if (daysDiff > 1) {
        // Streak broken - reset to 1
        newStreak = 1;
      } else {
        // Same day - keep current streak
        newStreak = stats.current_streak;
      }
    } else {
      // First check-in ever - start streak at 1
      newStreak = 1;
    }
    
    longestStreak = Math.max(stats.longest_streak, newStreak);
  }

  // Update stats - only update streak if this is the first check-in today
  // Mindfulness minutes are calculated dynamically from chat_history
  const updatedStats = await updateUserStats(userId, {
    current_streak: newStreak,
    longest_streak: longestStreak,
    last_journal_date: today,
  });

  // Check for new achievements after updating stats
  try {
    await checkAndUnlockAchievements(userId, updatedStats);
  } catch (error) {
    console.error('Error checking achievements:', error);
  }

  return updatedStats;
}

// Get conversations (check-ins) for today
// A check-in is defined as having at least one user message today
export async function getTodayConversations(userId: string): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Count distinct conversations - if user has sent at least one message today, it counts as a check-in
  const { data, error } = await supabase
    .from('chat_history')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('speaker', 'user')
    .gte('timestamp', today.toISOString())
    .lt('timestamp', tomorrow.toISOString());

  if (error) throw error;
  // If there are any user messages today, it counts as 1 check-in
  return (data && data.length > 0) ? 1 : 0;
}

// Get mindfulness minutes for today (estimated from conversations)
export async function getTodayMindfulnessMinutes(userId: string): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Get all messages from today (both user and AI)
  const { data, error } = await supabase
    .from('chat_history')
    .select('timestamp, speaker')
    .eq('user_id', userId)
    .gte('timestamp', today.toISOString())
    .lt('timestamp', tomorrow.toISOString())
    .order('timestamp', { ascending: true });

  if (error) throw error;
  if (!data || data.length === 0) return 0;

  // Group messages into conversation sessions (messages within 5 minutes are part of same conversation)
  // Each conversation counts as minimum 1 minute, longer conversations count more
  const sessionThreshold = 5 * 60 * 1000; // 5 minutes in ms
  let sessions: { start: Date; end: Date; userMessages: number; aiMessages: number }[] = [];
  
  for (const message of data) {
    const msgTime = new Date(message.timestamp);
    const lastSession = sessions[sessions.length - 1];
    
    // Check if this message is part of the current session or starts a new one
    if (!lastSession || (msgTime.getTime() - lastSession.end.getTime()) > sessionThreshold) {
      // New conversation session
      sessions.push({ 
        start: msgTime, 
        end: msgTime,
        userMessages: message.speaker === 'user' ? 1 : 0,
        aiMessages: message.speaker === 'ai' ? 1 : 0
      });
    } else {
      // Continue current conversation
      lastSession.end = msgTime;
      if (message.speaker === 'user') {
        lastSession.userMessages++;
      } else {
        lastSession.aiMessages++;
      }
    }
  }

  // Calculate total minutes: each conversation counts as at least 1 minute,
  // plus additional minutes based on conversation duration and message count
  let totalMinutes = 0;
  for (const session of sessions) {
    // Only count sessions that have both user and AI messages (actual conversations)
    if (session.userMessages > 0 && session.aiMessages > 0) {
      const sessionDurationMs = session.end.getTime() - session.start.getTime();
      // Minimum 1 minute per conversation, plus additional time based on duration
      // Cap at reasonable maximum (30 minutes per conversation session)
      const sessionMinutes = Math.min(
        30,
        Math.max(1, Math.ceil(sessionDurationMs / (60 * 1000)))
      );
      totalMinutes += sessionMinutes;
    }
  }

  return totalMinutes;
}

// ============================================
// ACHIEVEMENTS
// ============================================

export async function getAchievements(userId: string): Promise<Achievement[]> {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createAchievement(achievement: AchievementInsert): Promise<Achievement> {
  const { data, error } = await supabase
    .from('achievements')
    .insert(achievement)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function checkAndUnlockAchievements(userId: string, stats: UserStats): Promise<Achievement[]> {
  const unlocked: Achievement[] = [];
  const existingAchievements = await getAchievements(userId);
  const existingNames = new Set(existingAchievements.map(a => a.achievement_name));

  // Define achievement criteria
  const achievements = [
    { name: 'First Steps', condition: () => stats.current_streak >= 1 },
    { name: 'Week Warrior', condition: () => stats.current_streak >= 7 },
    { name: 'Fortnight Fighter', condition: () => stats.current_streak >= 14 },
    { name: 'Monthly Master', condition: () => stats.current_streak >= 30 },
    { name: 'Journal Explorer', condition: () => stats.journal_count_monthly >= 10 },
    { name: 'Consistent Creator', condition: () => stats.journal_count_monthly >= 20 },
  ];

  for (const achievement of achievements) {
    if (!existingNames.has(achievement.name) && achievement.condition()) {
      const newAchievement = await createAchievement({
        user_id: userId,
        achievement_name: achievement.name
      });
      unlocked.push(newAchievement);
    }
  }

  return unlocked;
}

