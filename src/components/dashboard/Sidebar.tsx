import { MessageSquare, BookOpen, Settings, Trash2, Plus, Brain, Search, Pin, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getChatSessions, deleteChatSession } from '../../lib/database';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: 'chat' | 'journal' | 'settings') => void;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [pinnedChats, setPinnedChats] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Format timestamp to relative time
  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) === 1 ? '' : 's'} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) === 1 ? '' : 's'} ago`;
  };

  // Load conversations from database (chat_sessions table)
  useEffect(() => {
    const loadConversations = async () => {
      if (!user) {
        setChatHistory([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const sessions = await getChatSessions(user.id, 20);
        const formatted: ChatSession[] = sessions.map(session => ({
          id: session.id,
          title: session.title || 'Untitled Conversation',
          timestamp: formatTimestamp(new Date(session.updated_at)),
        }));
        setChatHistory(formatted);
      } catch (error) {
        console.error('Error loading conversations:', error);
        // Fallback to old method if sessions table doesn't exist
        try {
          const { getFirstMessagesOfConversations } = await import('../../lib/database');
          const conversations = await getFirstMessagesOfConversations(user.id, 20);
          const formatted: ChatSession[] = conversations.map(conv => ({
            id: conv.id,
            title: conv.title,
            timestamp: formatTimestamp(conv.timestamp),
          }));
          setChatHistory(formatted);
        } catch (fallbackError) {
          console.error('Error loading conversations (fallback):', fallbackError);
          setChatHistory([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadConversations();

    // Listen for new chat messages (when first message is sent in a new conversation)
    const handleChatUpdate = () => {
      // Add a small delay to ensure database is updated
      setTimeout(loadConversations, 500);
    };

    window.addEventListener('firstChatMessageCreated', handleChatUpdate);
    window.addEventListener('newChatRequested', () => {
      // Clear list when new chat is requested (will be populated when user sends first message)
      setChatHistory([]);
    });
    
    // Listen for conversation deletions to refresh list
    const handleConversationDeleted = () => {
      setTimeout(loadConversations, 300);
    };
    window.addEventListener('conversationDeleted', handleConversationDeleted);

    // Poll for updates every 10 seconds (but respect if user just deleted something)
    const interval = setInterval(() => {
      // Don't poll immediately after a delete (wait 3 seconds to let delete complete)
      const lastDeleteTime = (window as any).lastDeleteTime || 0;
      if (Date.now() - lastDeleteTime > 3000) {
        loadConversations();
      }
    }, 10000);

    return () => {
      window.removeEventListener('firstChatMessageCreated', handleChatUpdate);
      window.removeEventListener('newChatRequested', handleChatUpdate);
      window.removeEventListener('conversationDeleted', handleConversationDeleted);
      clearInterval(interval);
    };
  }, [user]);

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
  };

  const deleteChat = async (id: string) => {
    if (!user) return;
    
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this conversation?')) {
      return;
    }
    
    // Remove from local state immediately (optimistic update)
    const previousHistory = [...chatHistory];
    setChatHistory(prev => prev.filter(chat => chat.id !== id));
    
    try {
      // Delete session and all associated messages from database
      await deleteChatSession(id, user.id);
      console.log(`Successfully deleted conversation ${id}`);
      
      // Mark delete time to prevent immediate polling refresh
      window.lastDeleteTime = Date.now();
      
      // Dispatch event to refresh conversations list
      window.dispatchEvent(new CustomEvent('conversationDeleted', { detail: { deletedId: id } }));
      
      // Force reload conversations after a delay to ensure database is updated
      setTimeout(async () => {
        try {
          const sessions = await getChatSessions(user.id, 20);
          const formatted: ChatSession[] = sessions.map(session => ({
            id: session.id,
            title: session.title || 'Untitled Conversation',
            timestamp: formatTimestamp(new Date(session.updated_at)),
          }));
          setChatHistory(formatted);
        } catch (reloadError) {
          console.error('Error reloading conversations:', reloadError);
          // Fallback: try old method if sessions table doesn't exist
          try {
            const { getFirstMessagesOfConversations } = await import('../../lib/database');
            const conversations = await getFirstMessagesOfConversations(user.id, 20);
            const formatted: ChatSession[] = conversations.map(conv => ({
              id: conv.id,
              title: conv.title,
              timestamp: formatTimestamp(conv.timestamp),
            }));
            setChatHistory(formatted);
          } catch (fallbackError) {
            console.error('Error reloading conversations (fallback):', fallbackError);
            // Restore previous state if reload completely fails
            setChatHistory(previousHistory);
          }
        }
      }, 800);
    } catch (error: any) {
      console.error('Error deleting conversation:', error);
      // Restore previous state on error
      setChatHistory(previousHistory);
      alert(`Failed to delete conversation: ${error?.message || 'Unknown error'}. Please try again.`);
    }
  };

  const togglePin = (id: string) => {
    setPinnedChats(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getConversationStatus = (timestamp: string) => {
    if (timestamp.includes('hour') || timestamp.includes('minute')) return 'today';
    return 'older';
  };

  const truncateMiddle = (text: string, maxLength: number = 30) => {
    if (text.length <= maxLength) return text;
    const halfLength = Math.floor(maxLength / 2);
    return `${text.slice(0, halfLength)}...${text.slice(-halfLength)}`;
  };

  const groupConversations = () => {
    const today: ChatSession[] = [];
    const thisWeek: ChatSession[] = [];
    const earlier: ChatSession[] = [];

    const filtered = chatHistory.filter(chat =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
      const aPin = pinnedChats.has(a.id) ? 1 : 0;
      const bPin = pinnedChats.has(b.id) ? 1 : 0;
      return bPin - aPin;
    });

    sorted.forEach(chat => {
      if (chat.timestamp.includes('hour') || chat.timestamp.includes('minute')) {
        today.push(chat);
      } else if (chat.timestamp.includes('yesterday') || chat.timestamp.includes('day')) {
        thisWeek.push(chat);
      } else {
        earlier.push(chat);
      }
    });

    return { today, thisWeek, earlier };
  };

  const navItems = [
    { id: 'chat', label: 'Chat With NIRA', icon: MessageSquare },
    { id: 'journal', label: 'Journal', icon: BookOpen, badge: '1' },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  const renderChatItem = (chat: ChatSession, index: number) => (
    <div
      key={chat.id}
      className="relative group"
      onMouseEnter={() => setHoveredItem(chat.id)}
      onMouseLeave={() => setHoveredItem(null)}
    >
      {pinnedChats.has(chat.id) && (
        <Pin className="absolute -left-2 top-3 w-3 h-3 text-[#187E5F] dark:text-sage-400 transform rotate-45" />
      )}
      <div
        className="flex items-start gap-3 p-3 rounded-xl hover:bg-[rgba(24,126,95,0.15)] dark:hover:bg-gray-700/50 transition-all duration-200 ease-in-out cursor-pointer hover:shadow-sm hover:border-l-[3px] hover:border-l-[#187E5F] border-l-[3px] border-l-transparent"
        style={{ animationDelay: `${index * 50}ms` }}
        tabIndex={0}
        role="button"
        aria-label={`Open conversation: ${chat.title}`}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-forest dark:text-gray-200" title={chat.title}>
            {truncateMiddle(chat.title, 30)}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <div className={`rounded-full ${
              getConversationStatus(chat.timestamp) === 'today'
                ? 'w-1 h-1 bg-[#76ac6d]'
                : 'w-[3px] h-[3px] bg-[#a4c1c3]'
            }`}></div>
            <p className="text-xs text-[#9CA3AF] dark:text-gray-500">
              {chat.timestamp}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePin(chat.id);
            }}
            className="p-1.5 hover:bg-sage-100 dark:hover:bg-gray-600 rounded-lg transition-all"
            title={pinnedChats.has(chat.id) ? 'Unpin' : 'Pin to top'}
            aria-label={pinnedChats.has(chat.id) ? 'Unpin conversation' : 'Pin conversation'}
          >
            <Pin className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400" size={14} strokeWidth={2} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteChat(chat.id);
            }}
            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
            title="Delete chat"
            aria-label="Delete conversation"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
      {hoveredItem === chat.id && (
        <div className="absolute left-0 top-full mt-1 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50 max-w-xs animate-tooltip-appear">
          {chat.title}
        </div>
      )}
    </div>
  );

  return (
    <aside className={`bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl flex flex-col transition-all duration-300 border-r border-sage-100/50 dark:border-gray-700 overflow-hidden relative ${
      isCollapsed ? 'w-20' : 'w-80'
    }`}>
      <div className="p-4 border-b border-sage-100/50 dark:border-gray-700">
        <div className={`flex items-center gap-4 ${isCollapsed ? 'justify-center mb-0' : 'mb-6'}`}>
          <div className="w-12 h-12 bg-gradient-to-br from-forest to-sage-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
            <Brain className="w-7 h-7 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-bold text-xl text-forest dark:text-white lowercase">mindshift</h2>
              <p className="text-sm text-sage-600 dark:text-sage-400 lowercase">your companion</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-b border-sage-100/50 dark:border-gray-700">
        {!isCollapsed && (
          <h3 className="text-[11px] uppercase tracking-[0.05em] text-sage-500 dark:text-sage-400 font-semibold mb-3 px-2">
            navigation
          </h3>
        )}

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'profile') {
                    navigate('/profile');
                  } else {
                    onViewChange(item.id as any);
                  }
                }}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'} px-4 py-3 rounded-2xl transition-all duration-200 ease-in-out relative group focus:outline-none focus:ring-2 focus:ring-[#187E5F] focus:ring-offset-2 ${
                  isActive
                    ? 'bg-[#E8EDE7] dark:bg-gray-700/50 font-semibold shadow-sm border-2 border-[#187E5F]/20 dark:border-sage-600/30'
                    : 'hover:bg-sage-50/80 dark:hover:bg-gray-700/50 hover:shadow-md hover:-translate-y-0.5 border-2 border-transparent'
                }`}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                title={isCollapsed ? item.label : ''}
              >
                {isActive && !isCollapsed && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#187E5F] dark:bg-sage-400 rounded-r-full transition-all duration-300" />
                )}
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${
                    isActive ? 'text-[#187E5F] dark:text-sage-400' : 'text-[#66887f] dark:text-gray-400 group-hover:text-[#187E5F]'
                  }`}
                  strokeWidth={2}
                  fill={isActive ? 'currentColor' : 'none'}
                  size={20}
                />
                {!isCollapsed && (
                  <>
                    <span className={`text-sm font-normal transition-colors duration-200 ${
                      isActive ? 'text-[#187E5F] dark:text-sage-400' : 'text-sage-600 dark:text-gray-400'
                    }`}>{item.label}</span>
                    {item.badge && (
                      <div
                        className="ml-auto w-[18px] h-[18px] bg-[#FF8C42] text-white rounded-full flex items-center justify-center text-[10px] font-bold animate-pulse"
                        aria-label={`${item.badge} new items`}
                      >
                        {item.badge}
                      </div>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {!isCollapsed && (
        <>
          <div className="border-t border-[#E5E7EB] dark:border-gray-700 my-4 mx-6"></div>

          <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6 space-y-4 relative">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-semibold text-[#6B7280] dark:text-gray-400 uppercase tracking-[0.05em]">
            recent conversations
          </h3>
          <div className="relative group">
            <button
              onClick={() => {
                // Clear current chat session
                sessionStorage.removeItem('chat-session-id');
                // Clear URL params to ensure clean chat view
                setSearchParams({});
                // Switch to chat view
                onViewChange('chat');
                // Trigger a custom event to notify ChatArea to reset
                window.dispatchEvent(new CustomEvent('newChatRequested'));
              }}
              className="p-2 hover:bg-sage-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#187E5F] focus:ring-offset-1"
              title="Start new conversation"
              aria-label="Start new conversation"
            >
              <Plus className="w-5 h-5 text-[#187E5F] dark:text-sage-400 transition-colors" size={20} strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#66887f] group-focus-within:text-[#187E5F] transition-colors duration-200" size={18} strokeWidth={2} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 bg-[#F8FAF9] dark:bg-gray-700 border border-[#E5E7EB] dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 placeholder-[#78968b] focus:outline-none focus:ring-2 focus:ring-[#187E5F] focus:border-transparent transition-all duration-200"
            aria-label="Search conversations"
          />
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-[#9CA3AF] dark:text-gray-500">Loading conversations...</div>
            </div>
          ) : (() => {
            const { today, thisWeek, earlier } = groupConversations();
            const hasAnyConversations = today.length > 0 || thisWeek.length > 0 || earlier.length > 0;
            
            if (!hasAnyConversations) {
              return (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <MessageSquare className="w-12 h-12 text-[#9CA3AF] dark:text-gray-500 mb-3 opacity-50" />
                  <p className="text-sm text-[#9CA3AF] dark:text-gray-500 mb-1">No conversations yet</p>
                  <p className="text-xs text-[#9CA3AF] dark:text-gray-600">Start a new chat to begin</p>
                </div>
              );
            }
            
            return (
              <>
                {today.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-semibold text-[#9CA3AF] dark:text-gray-500 uppercase tracking-[0.05em] mb-2 px-2">
                      Today
                    </h4>
                    <div className="space-y-1">
                      {today.map((chat, index) => renderChatItem(chat, index))}
                    </div>
                  </div>
                )}

                {thisWeek.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-semibold text-[#9CA3AF] dark:text-gray-500 uppercase tracking-[0.05em] mb-2 px-2">
                      This Week
                    </h4>
                    <div className="space-y-1">
                      {thisWeek.map((chat, index) => renderChatItem(chat, index))}
                    </div>
                  </div>
                )}

                {earlier.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-semibold text-[#9CA3AF] dark:text-gray-500 uppercase tracking-[0.05em] mb-2 px-2">
                      Earlier
                    </h4>
                    <div className="space-y-1">
                      {earlier.map((chat, index) => renderChatItem(chat, index))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>

            <div className="absolute bottom-0 left-0 right-0 h-12 sidebar-fade-gradient pointer-events-none"></div>
          </div>
        </>
      )}

      <button
        onClick={toggleCollapse}
        className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-[var(--color-dark-elevated-bg)] border-2 border-[var(--color-deep-emerald)] dark:border-[var(--color-neon-teal)] hover:bg-[var(--color-light-sage)] dark:hover:bg-[var(--color-dark-card-bg)] text-[var(--color-deep-emerald)] dark:text-[var(--color-neon-teal)] rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-110 z-30 focus:outline-none focus:ring-2 focus:ring-[var(--color-deep-emerald)] focus:ring-offset-2"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="w-5 h-5" strokeWidth={3} />
        ) : (
          <ChevronLeft className="w-5 h-5" strokeWidth={3} />
        )}
      </button>
    </aside>
  );
}
