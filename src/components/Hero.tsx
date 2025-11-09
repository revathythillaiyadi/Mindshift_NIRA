import { QrCode, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/signup');
  };

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-warm-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-peach-200/40 to-lavender-200/40 rounded-full blur-3xl animate-breathing"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-mint-200/40 to-sage-200/40 rounded-full blur-3xl animate-breathing" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-sunrise-200/30 to-peach-200/30 rounded-full blur-3xl animate-breathing" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-sage-600 via-mint-600 to-peach-500 bg-clip-text text-transparent leading-tight">
            Reframe your thoughts, Reshape your world...
          </h1>

          <p className="text-2xl text-warm-gray/80 leading-relaxed max-w-3xl mx-auto">
            Feeling stuck in your career or overwhelmed by work? MindShift is your gentle guide to building a more positive, resilient mindset. No judgment, just support.
          </p>

          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-pebble-lg shadow-lg border border-sage-100/50 max-w-xl mx-auto">
            <h3 className="text-xl font-semibold text-warm-gray mb-6">Begin Your Journey</h3>
            <form onSubmit={handleWaitlistSubmit} className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-pebble border-2 border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all text-warm-gray placeholder:text-warm-gray/40"
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-sage-500 to-mint-500 text-white rounded-pebble hover:from-sage-600 hover:to-mint-600 transition-all hover:shadow-lg font-semibold flex items-center justify-center gap-2"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <div className="flex-1 border-t border-sage-200"></div>
                <span className="text-sm text-warm-gray/60">or scan QR code</span>
                <div className="flex-1 border-t border-sage-200"></div>
              </div>
              <div className="flex justify-center">
                <div className="p-4 bg-sage-50 rounded-pebble">
                  <QrCode className="w-24 h-24 text-sage-600" />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
