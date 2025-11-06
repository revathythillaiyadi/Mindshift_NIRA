/*
  # Add Foreign Key Indexes for Optimal Performance

  ## Overview
  This migration adds indexes on all foreign key columns to ensure optimal
  query performance. Foreign keys without indexes can lead to slow queries,
  especially for JOIN operations and CASCADE operations.

  ## Changes

  ### Add Indexes on Foreign Keys
  Creating indexes for the following foreign key columns:
  
  1. **chat_messages table**
     - `session_id` - Used for joining with chat_sessions table
     - `user_id` - Used for filtering messages by user
  
  2. **chat_sessions table**
     - `user_id` - Used for filtering sessions by user
  
  3. **journal_entries table**
     - `user_id` - Used for filtering entries by user
  
  4. **mood_tracking table**
     - `user_id` - Used for filtering mood data by user
  
  5. **user_goals table**
     - `user_id` - Used for filtering goals by user

  ## Performance Impact
  - Dramatically improves JOIN performance
  - Speeds up CASCADE DELETE operations
  - Optimizes queries filtering by foreign key columns
  - Essential for RLS policy evaluation performance

  ## Security Impact
  - Improves RLS policy performance (policies filter by user_id)
  - Prevents slow queries that could impact database availability
  - Required for production-ready applications

  ## Notes
  - These indexes are critical for any application with multiple users
  - Without these, queries will perform full table scans
  - Index maintenance overhead is minimal compared to query benefits
*/

-- Add index on chat_messages.session_id for JOIN performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id 
ON chat_messages(session_id);

-- Add index on chat_messages.user_id for RLS and filtering
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id 
ON chat_messages(user_id);

-- Add index on chat_sessions.user_id for RLS and filtering
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id 
ON chat_sessions(user_id);

-- Add index on journal_entries.user_id for RLS and filtering
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id 
ON journal_entries(user_id);

-- Add index on mood_tracking.user_id for RLS and filtering
CREATE INDEX IF NOT EXISTS idx_mood_tracking_user_id 
ON mood_tracking(user_id);

-- Add index on user_goals.user_id for RLS and filtering
CREATE INDEX IF NOT EXISTS idx_user_goals_user_id 
ON user_goals(user_id);
