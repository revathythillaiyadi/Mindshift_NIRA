import { Bot, User, Mic, Smile, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function MeetNira() {
  const [visibleMessages, setVisibleMessages] = useState(0);

  const messages = [
    { type: 'bot', text: "Hello! I'm NIRA - Neural Insight and Reframing Assistant. I'm your compassionate companion for mental wellness. How can I help you today?" },
    { type: 'user', text: "I feel overwhelmed with everything going on..." },
    { type: 'bot', text: "I hear you. Let's work through this together. What specifically feels most overwhelming right now?" },
    { type: 'user', text: "Work deadlines and personal life feel impossible to balance" }
  ];

  useEffect(() => {
    if (visibleMessages < messages.length) {
      const timer = setTimeout(() => {
        setVisibleMessages(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [visibleMessages, messages.length]);

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-sage-50/50 via-warm-white to-mint-50/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-warm-gray mb-4">
            Meet NIRA, your personal companion
          </h2>
          <p className="text-xl text-warm-gray/70 max-w-2xl mx-auto">
            A warm, empathetic presence that's always here to listen and guide you
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-pebble-lg shadow-2xl border border-sage-100 overflow-hidden">
              <div className="bg-gradient-to-r from-sage-500 via-mint-500 to-sage-500 p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Bot className="w-7 h-7 text-sage-600" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">NIRA</h3>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-mint-300 rounded-full animate-pulse"></div>
                      <span className="text-white/90 text-sm">Always here for you</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4 h-96 overflow-y-auto bg-gradient-to-b from-sage-50/30 to-mint-50/20">
                {messages.slice(0, visibleMessages).map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 animate-fade-in ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                      message.type === 'bot'
                        ? 'bg-gradient-to-br from-sage-400 to-mint-400'
                        : 'bg-gradient-to-br from-peach-400 to-sunrise-400'
                    }`}>
                      {message.type === 'bot' ? (
                        <Bot className="w-6 h-6 text-white" />
                      ) : (
                        <User className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className={`max-w-[75%] ${message.type === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div className={`px-5 py-3.5 rounded-pebble ${
                        message.type === 'bot'
                          ? 'bg-white text-warm-gray shadow-sm border border-sage-100/50'
                          : 'bg-gradient-to-r from-peach-400 to-sunrise-400 text-white'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.text}</p>
                      </div>
                      <span className="text-xs text-warm-gray/50 mt-1.5 px-2">
                        Just now
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-5 bg-white border-t border-sage-100">
                <div className="flex items-center gap-2">
                  <button className="p-2.5 hover:bg-sage-50 rounded-full transition-colors" title="Voice input">
                    <Mic className="w-5 h-5 text-sage-600" />
                  </button>
                  <button className="p-2.5 hover:bg-sage-50 rounded-full transition-colors" title="Emoji picker">
                    <Smile className="w-5 h-5 text-sage-600" />
                  </button>
                  <input
                    type="text"
                    placeholder="Share what's on your mind..."
                    className="flex-1 px-5 py-3 rounded-pebble border-2 border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all text-sm text-warm-gray placeholder:text-warm-gray/40"
                    disabled
                  />
                  <button className="w-11 h-11 bg-gradient-to-r from-sage-500 to-mint-500 text-white rounded-full hover:shadow-lg transition-all flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-mint-300/20 rounded-full blur-3xl"></div>
            <div className="absolute -top-8 -left-8 w-64 h-64 bg-peach-300/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
