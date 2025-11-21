import { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  tier: 'bronze' | 'silver' | 'gold';
  isEarned: boolean;
  daysAway?: number;
  progress?: { current: number; total: number };
  isNew?: boolean;
}

interface MilestonesAchievementsProps {
  streakDays: number;
  journalEntries: number;
  totalCheckIns: number;
}

// Seed Icon for First Step (bronze)
const SeedIcon = () => {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Seed body */}
      <ellipse cx="20" cy="24" rx="8" ry="10" fill="#8B4513" stroke="#654321" strokeWidth="1.5" />
      {/* Seed highlight */}
      <ellipse cx="18" cy="22" rx="3" ry="4" fill="#A0522D" opacity="0.6" />
      {/* Small sprout lines */}
      <path d="M20 14 L18 18" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 14 L22 18" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

// Sapling Icon for Week Warrior (gold)
const SaplingIcon = () => {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Stem */}
      <path
        d="M20 32 C20 32, 20 28, 20 24 C20 20, 20 16, 20 12"
        stroke="#4CAF50"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Lower leaves */}
      <path
        d="M20 20 C20 20, 16 18, 14 16 C12 14, 13 12, 15 13 C17 14, 20 20, 20 20"
        fill="#FFA500"
        stroke="#FF8C00"
        strokeWidth="1"
      />
      <path
        d="M20 20 C20 20, 24 18, 26 16 C28 14, 27 12, 25 13 C23 14, 20 20, 20 20"
        fill="#FFA500"
        stroke="#FF8C00"
        strokeWidth="1"
      />
      {/* Upper leaves */}
      <path
        d="M20 16 C20 16, 17 14, 15 12 C13 10, 14 8, 16 9 C18 10, 20 16, 20 16"
        fill="#FFD700"
        stroke="#FFA500"
        strokeWidth="1"
      />
      <path
        d="M20 16 C20 16, 23 14, 25 12 C27 10, 26 8, 24 9 C22 10, 20 16, 20 16"
        fill="#FFD700"
        stroke="#FFA500"
        strokeWidth="1"
      />
      <ellipse
        cx="20"
        cy="12"
        rx="4"
        ry="5"
        fill="#FFD700"
        stroke="#FFA500"
        strokeWidth="1"
      />
    </svg>
  );
};

// Large Banyan Tree Icon for Thoughtful (silver tier but green leaves)
const TreeIcon = () => {
  return (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main trunk - wider at base */}
      <path d="M23 40 L23 28 L27 28 L27 40 Z" fill="#8B4513" />
      <path d="M23 28 Q25 26 27 28" fill="#654321" opacity="0.6" />
      
      {/* Aerial roots - characteristic of banyan tree */}
      <path d="M22 32 Q20 38 19 40" stroke="#654321" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M28 32 Q30 38 31 40" stroke="#654321" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M25 30 Q24 36 23 38" stroke="#654321" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M25 30 Q26 36 27 38" stroke="#654321" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      
      {/* Large spreading canopy - lower layer (dark green) */}
      <ellipse cx="25" cy="22" rx="14" ry="10" fill="#2D5016" />
      <ellipse cx="25" cy="22" rx="12" ry="8" fill="#3A6B1F" opacity="0.9" />
      
      {/* Middle canopy layer (medium green) */}
      <ellipse cx="25" cy="18" rx="12" ry="9" fill="#4A8B2E" />
      <ellipse cx="25" cy="18" rx="10" ry="7" fill="#5A9B3E" opacity="0.9" />
      
      {/* Upper canopy layer (bright green) */}
      <ellipse cx="25" cy="14" rx="10" ry="8" fill="#5C9C3F" />
      <ellipse cx="25" cy="14" rx="8" ry="6" fill="#6CAC4F" opacity="0.9" />
      
      {/* Top crown (lighter green) */}
      <ellipse cx="25" cy="10" rx="8" ry="7" fill="#7ABC5F" />
      <ellipse cx="25" cy="10" rx="6" ry="5" fill="#8ACC6F" opacity="0.9" />
      
      {/* Extended branches - left side */}
      <ellipse cx="18" cy="20" rx="4" ry="5" fill="#4A8B2E" transform="rotate(-20 18 20)" />
      <ellipse cx="15" cy="17" rx="3" ry="4" fill="#5C9C3F" transform="rotate(-25 15 17)" />
      <ellipse cx="12" cy="15" rx="2.5" ry="3.5" fill="#6CAC4F" transform="rotate(-30 12 15)" />
      
      {/* Extended branches - right side */}
      <ellipse cx="32" cy="20" rx="4" ry="5" fill="#4A8B2E" transform="rotate(20 32 20)" />
      <ellipse cx="35" cy="17" rx="3" ry="4" fill="#5C9C3F" transform="rotate(25 35 17)" />
      <ellipse cx="38" cy="15" rx="2.5" ry="3.5" fill="#6CAC4F" transform="rotate(30 38 15)" />
      
      {/* Leaf clusters for detail */}
      <circle cx="20" cy="16" r="2" fill="#7ABC5F" opacity="0.8" />
      <circle cx="30" cy="16" r="2" fill="#7ABC5F" opacity="0.8" />
      <circle cx="22" cy="19" r="1.5" fill="#8ACC6F" opacity="0.8" />
      <circle cx="28" cy="19" r="1.5" fill="#8ACC6F" opacity="0.8" />
      <circle cx="25" cy="12" r="2.5" fill="#8ACC6F" opacity="0.9" />
      
      {/* Highlights for dimension */}
      <ellipse cx="23" cy="14" rx="2" ry="3" fill="#9ADC7F" opacity="0.7" />
      <ellipse cx="27" cy="18" rx="2" ry="3" fill="#9ADC7F" opacity="0.7" />
      <ellipse cx="25" cy="10" rx="2.5" ry="3" fill="#AAF09F" opacity="0.8" />
      
      {/* Tree rings on trunk */}
      <ellipse cx="25" cy="32" rx="1.5" ry="2" fill="#654321" opacity="0.4" />
      <ellipse cx="25" cy="35" rx="1.5" ry="2" fill="#654321" opacity="0.4" />
    </svg>
  );
};

export default function MilestonesAchievements({
  streakDays,
  journalEntries,
  totalCheckIns,
}: MilestonesAchievementsProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [newBadgeId, setNewBadgeId] = useState<string | null>(null);

  const badges: Badge[] = [
    {
      id: 'first-step',
      name: 'First Step',
      description: 'Completed your first check-in',
      tier: 'bronze',
      isEarned: totalCheckIns >= 1,
      progress: { current: Math.min(totalCheckIns, 1), total: 1 },
    },
    {
      id: 'week-warrior',
      name: 'Week Warrior',
      description: 'Maintained a 7-day streak',
      tier: 'gold',
      isEarned: streakDays >= 7,
      progress: { current: Math.min(streakDays, 7), total: 7 },
      daysAway: streakDays < 7 ? 7 - streakDays : undefined,
    },
    {
      id: 'thoughtful',
      name: 'Thoughtful',
      description: 'Chatted 3 times in a day',
      tier: 'silver',
      isEarned: totalCheckIns >= 3,
      progress: { current: Math.min(totalCheckIns, 3), total: 3 },
    },
  ];

  const tierStyles = {
    bronze: {
      gradient: 'radial-gradient(circle, #CD7F32 0%, #B87333 50%, #8B4513 100%)',
      shadow: '0 4px 8px rgba(139, 69, 19, 0.4), inset 0 2px 4px rgba(255,255,255,0.3)',
      hoverShadow: '0 6px 12px rgba(139, 69, 19, 0.5), inset 0 2px 4px rgba(255,255,255,0.4)',
      progressGradient: 'from-[#CD7F32] to-[#B87333]',
    },
    silver: {
      gradient: 'radial-gradient(circle, #C0C0C0 0%, #A8A8A8 50%, #989898 100%)',
      shadow: '0 4px 8px rgba(192, 192, 192, 0.4), inset 0 2px 4px rgba(255,255,255,0.3)',
      hoverShadow: '0 6px 12px rgba(192, 192, 192, 0.5), inset 0 2px 4px rgba(255,255,255,0.4)',
      progressGradient: 'from-[#C0C0C0] to-[#A8A8A8]',
    },
    gold: {
      gradient: 'radial-gradient(circle, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
      shadow: '0 6px 12px rgba(255, 215, 0, 0.5), inset 0 2px 4px rgba(255,255,255,0.4)',
      hoverShadow: '0 8px 16px rgba(255, 215, 0, 0.6), inset 0 2px 4px rgba(255,255,255,0.5)',
      progressGradient: 'from-[#FFD700] to-[#FFA500]',
    },
  };

  const lockedStyle = {
    gradient: 'radial-gradient(circle, #E8F5F0 0%, #D4EDE5 100%)',
  };

  const earnedBadges = badges.filter(b => b.isEarned);
  const totalBadges = badges.length;
  const achievementPercentage = Math.round((earnedBadges.length / totalBadges) * 100);

  const nextMilestone = badges.find((badge) => !badge.isEarned);

  useEffect(() => {
    const earnedBadges = badges.filter((b) => b.isEarned);
    const lastEarnedKey = 'last-earned-badges';
    const lastEarned = localStorage.getItem(lastEarnedKey);
    const lastEarnedIds = lastEarned ? JSON.parse(lastEarned) : [];

    const newlyEarned = earnedBadges.find((b) => !lastEarnedIds.includes(b.id));

    if (newlyEarned) {
      setNewBadgeId(newlyEarned.id);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);

      localStorage.setItem(
        lastEarnedKey,
        JSON.stringify(earnedBadges.map((b) => b.id))
      );
    }
  }, [streakDays, journalEntries, totalCheckIns]);

  const getBadgeIcon = (badge: Badge) => {
    if (badge.id === 'first-step') {
      return <SeedIcon />;
    } else if (badge.id === 'week-warrior') {
      return <SaplingIcon />;
    } else if (badge.id === 'thoughtful') {
      return <TreeIcon />;
    }
    return <SeedIcon />; // fallback
  };

  return (
    <div className="bg-white dark:bg-gray-700 rounded-xl border border-sage-100 dark:border-gray-600 overflow-hidden shadow-sm hover:shadow-md transition-all">
      {showConfetti && (
        <div className="confetti-container">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="px-5 py-4 bg-sage-50/50 dark:bg-gray-600/30 border-b border-sage-100 dark:border-gray-600">
        <h3 className="font-semibold text-base text-gray-800 dark:text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#FFD700]" />
          Milestones & Achievements
        </h3>
      </div>

      <div className="p-5">
        <div className="flex justify-center gap-6 mb-6">
          {badges.map((badge) => {
            const isNew = badge.id === newBadgeId;

            return (
              <div
                key={badge.id}
                className={`group relative flex flex-col items-center ${
                  isNew ? 'animate-badge-earn' : ''
                }`}
              >
                <div className="relative">
                  <div
                    className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                      badge.isEarned
                        ? 'animate-badge-float hover:-translate-y-1'
                        : 'hover:scale-105'
                    }`}
                    style={{
                      background: badge.isEarned ? tierStyles[badge.tier].gradient : lockedStyle.gradient,
                      boxShadow: badge.isEarned ? tierStyles[badge.tier].shadow : '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                    onMouseEnter={(e) => {
                      if (badge.isEarned) {
                        e.currentTarget.style.boxShadow = tierStyles[badge.tier].hoverShadow;
                      } else {
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (badge.isEarned) {
                        e.currentTarget.style.boxShadow = tierStyles[badge.tier].shadow;
                      } else {
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                      }
                    }}
                  >
                    {getBadgeIcon(badge)}

                    {badge.isEarned && badge.tier === 'gold' && (
                      <>
                        <div className="absolute -top-1 -right-1 text-xl animate-sparkle" style={{ animationDelay: '0s' }}>✨</div>
                        <div className="absolute top-1 -left-2 text-lg animate-sparkle" style={{ animationDelay: '0.5s' }}>✨</div>
                        <div className="absolute -bottom-1 right-1 text-lg animate-sparkle" style={{ animationDelay: '1s' }}>✨</div>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-center mt-3 max-w-[90px]">
                  <div
                    className={`text-xs font-semibold leading-tight ${
                      badge.isEarned
                        ? 'text-gray-800 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {badge.name}
                  </div>
                </div>

                <div className="absolute left-1/2 top-full mt-3 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                  <div className="bg-gray-900 dark:bg-gray-950 text-white px-4 py-3 rounded-xl shadow-xl text-center whitespace-nowrap min-w-[200px]">
                    <div className="font-bold text-sm mb-1">{badge.name}</div>
                    <div className="text-xs text-gray-300 mb-2">
                      {badge.description}
                    </div>
                    {!badge.isEarned && badge.progress && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                          <div
                            className={`bg-gradient-to-r ${tierStyles[badge.tier].progressGradient} h-2 rounded-full transition-all duration-300`}
                            style={{
                              width: `${
                                (badge.progress.current / badge.progress.total) * 100
                              }%`,
                            }}
                          />
                        </div>
                        <div className="text-xs text-gray-400">
                          {badge.progress.current} / {badge.progress.total}
                          {badge.daysAway && (
                            <span className="text-amber-400 font-semibold ml-1">
                              ({badge.daysAway}{' '}
                              {badge.daysAway === 1 ? 'day' : 'days'} away!)
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    {badge.isEarned && (
                      <div className="text-xs text-green-400 font-semibold">
                        ✓ Earned!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              Progress
            </span>
            <span className="text-[#187E5F] dark:text-sage-400 font-semibold">
              {earnedBadges.length} of {totalBadges} achievements ({achievementPercentage}%)
            </span>
          </div>
          <div className="w-full bg-[#E8F5F0] dark:bg-gray-600 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#187E5F] h-2 rounded-full transition-all duration-500"
              style={{ width: `${achievementPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {nextMilestone && (
        <div className="mx-5 mb-5 p-5 bg-gradient-to-br from-[rgba(24,126,95,0.12)] to-[rgba(11,88,68,0.06)] dark:from-[rgba(24,126,95,0.2)] dark:to-[rgba(11,88,68,0.1)] rounded-xl border-l-4 border-l-[#FF8C42] relative">
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#E8F5F0"
                  strokeWidth="4"
                  fill="none"
                  className="dark:stroke-gray-600"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#187E5F"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - (nextMilestone.progress ? nextMilestone.progress.current / nextMilestone.progress.total : 0))}`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-[#FF8C42]" />
              </div>
            </div>

            <div className="flex-1">
              <div className="font-bold text-sage-700 dark:text-white mb-1 text-sm">
                Next Milestone: {nextMilestone.name}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                {nextMilestone.daysAway && nextMilestone.daysAway > 0 ? (
                  <>
                    <span className="font-semibold text-[#FF8C42]">
                      {nextMilestone.daysAway}{' '}
                      {nextMilestone.daysAway === 1 ? 'day' : 'days'} to go!
                    </span>{' '}
                    Keep it up!
                  </>
                ) : nextMilestone.progress ? (
                  <>
                    <span className="font-semibold text-[#FF8C42]">
                      {nextMilestone.progress.total - nextMilestone.progress.current}{' '}
                      more to go!
                    </span>{' '}
                    Keep it up!
                  </>
                ) : (
                  'Keep going! You can do it!'
                )}
              </div>
              {nextMilestone.progress && (
                <div className="w-full bg-[#E8F5F0] dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#FF8C42] to-[#FFB347] h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        (nextMilestone.progress.current /
                          nextMilestone.progress.total) *
                        100
                      }%`,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
