import { Moon, Sun, User, ChevronDown, LogOut, Settings, UserCircle, BookOpen, Flag, AlertCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface DashboardHeaderProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
  onJournalClick?: () => void;
}

const regions = [
  { code: 'US', name: 'United States' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'IN', name: 'India' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
];

const regionalContacts: Record<string, { crisis: string; hotline: string; emergency: string }> = {
  US: {
    crisis: '988 (Suicide & Crisis Lifeline)',
    hotline: '1-800-273-8255 (National Suicide Prevention)',
    emergency: '911',
  },
  UK: {
    crisis: '116 123 (Samaritans)',
    hotline: '0800 689 5652 (Campaign Against Living Miserably)',
    emergency: '999',
  },
  CA: {
    crisis: '1-833-456-4566 (Talk Suicide Canada)',
    hotline: '1-866-277-3553 (Kids Help Phone)',
    emergency: '911',
  },
  AU: {
    crisis: '13 11 14 (Lifeline)',
    hotline: '1800 55 1800 (Kids Helpline)',
    emergency: '000',
  },
  IN: {
    crisis: '9152987821 (AASRA)',
    hotline: '080 46110007 (iCall)',
    emergency: '112',
  },
  DE: {
    crisis: '0800 1110111 (TelefonSeelsorge)',
    hotline: '0800 1110222 (TelefonSeelsorge)',
    emergency: '112',
  },
  FR: {
    crisis: '3114 (National Suicide Prevention)',
    hotline: '01 45 39 40 00 (SOS Amitié)',
    emergency: '112',
  },
  JP: {
    crisis: '0120-783-556 (TELL Lifeline)',
    hotline: '0570-064-556 (Mental Health Support)',
    emergency: '110',
  },
};

function getTimeBasedGreeting(name: string): { text: string; emoji: string } {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return { text: `Good morning, ${name}!`, emoji: '👋' };
  } else if (hour >= 12 && hour < 17) {
    return { text: `Good afternoon, ${name}!`, emoji: '👋' };
  } else if (hour >= 17 && hour < 21) {
    return { text: `Good evening, ${name}!`, emoji: '🌙' };
  } else {
    return { text: `Still up, ${name}? Take care of yourself`, emoji: '💙' };
  }
}

export default function DashboardHeader({
  selectedRegion,
  onRegionChange,
  darkMode,
  onDarkModeToggle,
  onJournalClick,
}: DashboardHeaderProps) {
  const [showRegionMenu, setShowRegionMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [greeting, setGreeting] = useState<{ text: string; emoji: string }>({ text: '', emoji: '' });
  const [fadeIn, setFadeIn] = useState(false);
  const regionMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleNavigateToProfile = () => {
    setShowProfileMenu(false);
    navigate('/profile');
  };

  const handleNavigateToSettings = () => {
    setShowProfileMenu(false);
    navigate('/dashboard?view=settings');
  };

  useEffect(() => {
    async function fetchUserProfile() {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .maybeSingle();

        if (data && data.full_name) {
          const firstName = data.full_name.split(' ')[0];
          setUserName(firstName);
          setGreeting(getTimeBasedGreeting(firstName));
        } else {
          setUserName('there');
          setGreeting(getTimeBasedGreeting('there'));
        }

        setTimeout(() => setFadeIn(true), 50);
      }
    }

    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (regionMenuRef.current && !regionMenuRef.current.contains(event.target as Node)) {
        setShowRegionMenu(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl px-6 py-4 transition-colors relative z-50">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-sage-600 to-mint-600 dark:from-sage-400 dark:to-mint-400 bg-clip-text text-transparent">
            MindShift: Your Space for Growth
          </h1>
          {greeting.text && (
            <p
              className={`text-base font-normal text-soft-gray dark:text-gray-300 transition-opacity duration-700 flex items-center gap-1 ${
                fadeIn ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <span>{greeting.text}</span>
              <span className="ml-1">{greeting.emoji}</span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onJournalClick}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#187E5F] to-[#0B5844] text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 hover:from-[#0B5844] hover:to-[#187E5F] font-medium"
            title="Open Journal"
          >
            <BookOpen className="w-5 h-5" strokeWidth={2} />
            <span className="text-sm">Journal</span>
          </button>

          <button
            onClick={() => setShowSOSModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold text-sm shadow-[0_4px_12px_rgba(255,140,66,0.35)] hover:shadow-xl transition-all hover:scale-105 hover:-translate-y-[1px] animate-gentle-pulse"
            style={{ backgroundColor: '#FF8C42', backgroundImage: 'linear-gradient(135deg, #FF8C42 0%, #FFB347 100%)' }}
            title="Get Help Now"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Get Help Now</span>
          </button>

          <div className="relative" ref={regionMenuRef}>
            <button
              onClick={() => setShowRegionMenu(!showRegionMenu)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-[1rem] border-2 border-sage-200 dark:border-gray-600 hover:bg-sage-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Flag className="w-4 h-4 text-sage-500 dark:text-gray-400" strokeWidth={2} />
              <span className="text-sm font-medium text-soft-gray dark:text-gray-200">
                {regions.find(r => r.code === selectedRegion)?.name || 'Select Region'}
              </span>
              <ChevronDown className="w-4 h-4 text-sage-500 dark:text-gray-400" strokeWidth={2} />
            </button>

            {showRegionMenu && (
              <div className="fixed right-6 mt-14 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-sage-200 dark:border-gray-600 py-3 z-[1000]">
                {regions.map((region) => (
                  <button
                    key={region.code}
                    onClick={() => {
                      onRegionChange(region.code);
                      setShowRegionMenu(false);
                    }}
                    className={`w-full text-left px-5 py-3 hover:bg-sage-100 dark:hover:bg-gray-700 transition-all rounded-xl mx-2 text-base ${
                      selectedRegion === region.code ? 'bg-sage-100 dark:bg-gray-700 text-forest dark:text-sage-400 font-semibold' : 'text-soft-gray dark:text-gray-200'
                    }`}
                  >
                    {region.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onDarkModeToggle}
            className="w-10 h-10 flex items-center justify-center rounded-[1rem] border-2 border-sage-200 dark:border-gray-600 hover:bg-sage-50 dark:hover:bg-gray-700 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" strokeWidth={2} />
            ) : (
              <Moon className="w-5 h-5 text-sage-600" strokeWidth={2} />
            )}
          </button>

          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center justify-center w-10 h-10 rounded-[1rem] border-2 border-sage-200 dark:border-gray-600 hover:bg-sage-50/50 dark:hover:bg-gray-700/50 transition-all"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-sage-500 to-mint-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
            </button>

            {showProfileMenu && (
              <div className="fixed right-6 mt-14 w-52 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-sage-200 dark:border-gray-600 py-3 z-[1000]">
                <button
                  onClick={handleNavigateToProfile}
                  className="w-full text-left px-5 py-3 hover:bg-sage-100 dark:hover:bg-gray-700 transition-all text-soft-gray dark:text-gray-200 flex items-center gap-3 rounded-xl mx-2 text-base"
                >
                  <UserCircle className="w-5 h-5" strokeWidth={2} />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={handleNavigateToSettings}
                  className="w-full text-left px-5 py-3 hover:bg-sage-100 dark:hover:bg-gray-700 transition-all text-soft-gray dark:text-gray-200 flex items-center gap-3 rounded-xl mx-2 text-base"
                >
                  <Settings className="w-5 h-5" strokeWidth={2} />
                  <span>Account Settings</span>
                </button>
                <div className="my-3 h-px bg-sage-200 dark:bg-gray-600 mx-4"></div>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-5 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-red-600 dark:text-red-400 flex items-center gap-3 font-semibold rounded-xl mx-2 text-base"
                >
                  <LogOut className="w-5 h-5" strokeWidth={2} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SOS Modal */}
      {showSOSModal && (() => {
        const contacts = regionalContacts[selectedRegion] || regionalContacts.US;
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-2xl max-w-md w-full p-6 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-2xl font-bold lowercase text-gray-800 dark:text-white">emergency resources</h2>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                If you're in crisis or need immediate support, please reach out to one of these services:
              </p>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-[1rem] border border-red-200 dark:border-red-800">
                  <h3 className="font-semibold text-red-900 dark:text-red-200 mb-2">Crisis Hotline</h3>
                  <a
                    href={`tel:${contacts.crisis.split(' ')[0]}`}
                    className="text-lg font-bold text-red-600 dark:text-red-400 hover:underline"
                  >
                    {contacts.crisis}
                  </a>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-[1rem] border border-amber-200 dark:border-amber-800">
                  <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-2">Support Hotline</h3>
                  <a
                    href={`tel:${contacts.hotline.split(' ')[0]}`}
                    className="text-lg font-bold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    {contacts.hotline}
                  </a>
                </div>

                <div className="p-4 bg-sage-50 dark:bg-sage-900/20 rounded-[1rem] border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Emergency Services</h3>
                  <a
                    href={`tel:${contacts.emergency}`}
                    className="text-lg font-bold text-sage-600 dark:text-sage-400 hover:underline"
                  >
                    {contacts.emergency}
                  </a>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSOSModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-[1rem] hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Close
                </button>
                <button className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-[1rem] hover:shadow-lg transition-all font-medium">
                  Call Now
                </button>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                You're not alone. Help is available 24/7.
              </p>
            </div>
          </div>
        );
      })()}
    </header>
  );
}
