import { Bot, BookText, Heart, Target, Radio } from 'lucide-react';

const services = [
  {
    title: 'Meet NIRA, your empathetic companion',
    description: 'A warm presence available 24/7, offering gentle conversations and compassionate support whenever you need someone to listen.',
    icon: Bot,
  },
  {
    title: 'A quiet place for your thoughts',
    description: 'Gentle prompts and reflective exercises help you process emotions and discover insights at your own pace.',
    icon: BookText,
  },
  {
    title: 'Understand your feelings',
    description: 'Visual insights into your emotional patterns help you recognize what you\'re experiencing and celebrate your progress.',
    icon: Heart,
  },
  {
    title: 'Map your unique journey',
    description: 'Personalized objectives based on your needs, with gentle milestones to keep you motivated and moving forward.',
    icon: Target,
  },
  {
    title: 'Guided Audio Reframing',
    description: 'Go beyond typing. Talk to NIRA with our new voice chat option. You can engage in 5-minute guided audio sessions where NIRA helps you actively challenge and shift difficult thought patterns, just by listening and speaking.',
    icon: Radio,
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 px-6 bg-warm-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-forest mb-4">
            Your Personal Space for Growth
          </h2>
          <p className="text-xl text-gentle-gray/70 max-w-3xl mx-auto">
            Everything you need to nurture your mental wellness, thoughtfully designed for your journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="bg-white/80 backdrop-blur-sm p-8 rounded-[2rem] shadow-lg border border-sage-100/50 hover:shadow-xl transition-all hover:-translate-y-1 group"
              >
                <div className="w-16 h-16 bg-forest rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                  <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-forest mb-3">{service.title}</h3>
                <p className="text-gentle-gray/70 leading-relaxed text-sm">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
