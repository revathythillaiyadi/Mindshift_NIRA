import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    navigate('/signup');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden hero-section">
      {/* Background Image with Enhanced Overlay */}
      <div className="absolute inset-0">
        <img
          src="/unnamed copy copy.jpg"
          alt="Person sitting peacefully on bench in serene park"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sage-900/30 via-sage-800/10 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-forest/40 via-transparent to-transparent"></div>

        {/* Liquid glass overlay effect */}
        <div className="absolute inset-0 liquid-glass-overlay"></div>
      </div>

      

      {/* Content */}
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center space-y-8 animate-fade-in">
          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight drop-shadow-2xl" style={{ color: 'rgba(120, 53, 15, 0.85)' }}>
            hey, feeling a little heavy lately?
          </h1>

          {/* Sub-headline */}
          <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed max-w-3xl mx-auto font-light drop-shadow-lg" style={{ color: 'rgba(120, 53, 15, 0.85)' }}>
            you're not alone. let's reframe those thoughts and reshape your world.
          </p>

          {/* Call-to-Action Button */}
          <div className="pt-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={handleStartJourney}
              className="px-12 py-5 bg-sage-600 text-white text-lg font-medium rounded-full hover:bg-sage-500 transition-all duration-300 hover:shadow-2xl hover:shadow-sage-900/30 hover:scale-105 active:scale-95"
            >
              Start Your Journey
            </button>
          </div>
        </div>
      </div>

      {/* Seamless transition gradient to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent via-sage-50/30 to-warm-white/80 pointer-events-none"></div>
    </section>
  );
}
