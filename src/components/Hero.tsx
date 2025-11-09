import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    navigate('/signup');
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 overflow-hidden bg-white">
      {/* Tree Rings Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Multiple tree ring patterns */}
        <div className="absolute top-20 -left-40 w-[600px] h-[600px] tree-ring opacity-30 animate-breathing"></div>
        <div className="absolute top-0 right-10 w-[400px] h-[400px] tree-ring opacity-25 animate-breathing" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] tree-ring opacity-20 animate-breathing" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-20 right-1/4 w-[350px] h-[350px] tree-ring opacity-25 animate-breathing" style={{ animationDelay: '6s' }}></div>
        <div className="absolute top-1/3 left-1/2 w-[450px] h-[450px] tree-ring opacity-15 animate-breathing" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center space-y-8 animate-fade-in">
          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-[#1a3a2e]">
            hey, feeling a little heavy lately?
          </h1>

          {/* Sub-headline */}
          <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed max-w-3xl mx-auto text-[#2d5f4f] font-light">
            you're not alone. let's reframe those thoughts and reshape your world.
          </p>

          {/* Call-to-Action Button */}
          <div className="pt-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={handleStartJourney}
              className="px-12 py-5 bg-[#2d5f4f] text-white text-lg font-medium rounded-full hover:bg-[#3d7f6f] transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95"
            >
              Start Your Journey
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
