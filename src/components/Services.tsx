import { Bot, BookText, Heart, Target } from 'lucide-react';

const services = [
  {
    title: 'Meet NIRA, your empathetic companion',
    description: 'A warm presence available 24/7, offering gentle conversations and compassionate support whenever you need someone to listen.',
    icon: Bot,
    gradient: 'from-sage-400 to-mint-400',
  },
  {
    title: 'A quiet place for your thoughts',
    description: 'Gentle prompts and reflective exercises help you process emotions and discover insights at your own pace.',
    icon: BookText,
    gradient: 'from-mint-400 to-sage-500',
  },
  {
    title: 'Understand your feelings',
    description: 'Visual insights into your emotional patterns help you recognize what you\'re experiencing and celebrate your progress.',
    icon: Heart,
    gradient: 'from-peach-400 to-sunrise-400',
  },
  {
    title: 'Map your unique journey',
    description: 'Personalized objectives based on your needs, with gentle milestones to keep you motivated and moving forward.',
    icon: Target,
    gradient: 'from-lavender-400 to-sage-400',
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 px-6 bg-gradient-to-br from-mint-50/30 via-warm-white to-peach-50/20">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-warm-gray mb-4">
            Your Personal Space for Growth
          </h2>
          <p className="text-xl text-warm-gray/70 max-w-3xl mx-auto">
            Everything you need to nurture your mental wellness, thoughtfully designed for your journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="bg-white/80 backdrop-blur-sm p-8 rounded-pebble shadow-lg border border-sage-100/50 hover:shadow-xl transition-all hover:-translate-y-1 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-pebble flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md`}>
                  <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-warm-gray mb-3">{service.title}</h3>
                <p className="text-warm-gray/70 leading-relaxed">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
