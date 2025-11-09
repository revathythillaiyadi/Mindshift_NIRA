import { UserPlus, MessageCircle, RefreshCw, BookOpen, TrendingUp, AlertCircle } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

const steps = [
  {
    number: 1,
    title: 'Sign Up',
    description: 'Create your secure space and begin your journey to mental wellness in minutes.',
    icon: UserPlus,
    emoji: '🌱',
  },
  {
    number: 2,
    title: 'Start Chatting',
    description: 'Connect with NIRA, your companion who listens without judgment and guides with empathy.',
    icon: MessageCircle,
    emoji: '🌿',
  },
  {
    number: 3,
    title: 'Reframe',
    description: 'Learn to transform negative thought patterns into constructive perspectives.',
    icon: RefreshCw,
    emoji: '🌿',
  },
  {
    number: 4,
    title: 'Record Your Journey',
    description: 'Capture your progress with gentle journaling that helps you reflect and grow.',
    icon: BookOpen,
    emoji: '🌿',
  },
  {
    number: 5,
    title: 'Monitor Growth',
    description: 'Track your progress and celebrate your achievements along the way.',
    icon: TrendingUp,
    emoji: '🌿',
  },
  {
    number: 6,
    title: 'Reach Help',
    description: 'Access immediate support and emergency resources whenever you need it.',
    icon: AlertCircle,
    emoji: '🌸',
  },
];

export default function HowItWorks() {
  const [visibleSteps, setVisibleSteps] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && visibleSteps < steps.length) {
            const timer = setInterval(() => {
              setVisibleSteps((prev) => {
                if (prev < steps.length) {
                  return prev + 1;
                }
                clearInterval(timer);
                return prev;
              });
            }, 400);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [visibleSteps]);

  return (
    <section id="how-it-works" ref={sectionRef} className="py-20 px-6 bg-warm-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-warm-gray mb-4">
            Your Path to Growth
          </h2>
          <p className="text-xl text-warm-gray/70 max-w-2xl mx-auto">
            A gentle, natural journey to better mental health
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <svg
            className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-8 hidden md:block"
            style={{ zIndex: 0 }}
          >
            <path
              d={`M 16 0 Q 16 ${100 * 0.2} 24 ${100 * 0.3} T 16 ${100 * 0.5} T 24 ${100 * 0.7} T 16 ${100 * 0.9} L 16 100%`}
              fill="none"
              stroke="url(#vineGradient)"
              strokeWidth="3"
              className={visibleSteps > 0 ? 'animate-grow-vine' : ''}
              style={{
                strokeDasharray: '1000',
                strokeDashoffset: visibleSteps > 0 ? '0' : '1000',
                transition: 'stroke-dashoffset 2s ease-out'
              }}
            />
            <defs>
              <linearGradient id="vineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#5e7a5e" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#14b89d" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#eb6b35" stopOpacity="0.6" />
              </linearGradient>
            </defs>
          </svg>

          <div className="space-y-16 relative" style={{ zIndex: 1 }}>
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isVisible = index < visibleSteps;

              return (
                <div
                  key={step.number}
                  className={`relative flex items-center gap-8 transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  <div className="flex-1 md:text-right">
                    <div className={`bg-white/90 backdrop-blur-sm p-6 rounded-pebble shadow-lg border border-sage-100/50 hover:shadow-xl transition-all inline-block max-w-md ${
                      isVisible ? 'animate-fade-in' : ''
                    }`}>
                      <div className="flex items-center gap-3 mb-3 md:flex-row-reverse md:justify-end">
                        <span className="text-3xl">{step.emoji}</span>
                        <h3 className="text-2xl font-bold text-warm-gray">{step.title}</h3>
                      </div>
                      <p className="text-warm-gray/70 leading-relaxed">{step.description}</p>
                    </div>
                  </div>

                  <div className="relative z-10 flex-shrink-0 hidden md:block">
                    <div className={`w-16 h-16 bg-gradient-to-br from-sage-400 to-mint-400 rounded-full flex items-center justify-center shadow-lg ${
                      isVisible ? 'animate-unfurl-leaf' : 'opacity-0'
                    }`}>
                      <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </div>
                  </div>

                  <div className="flex-1 hidden md:block"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
