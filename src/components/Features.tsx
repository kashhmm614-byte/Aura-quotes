import React from 'react';
import { BookOpen, Zap, Shield } from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      title: 'Curated Wisdom',
      description: 'Access thousands of hand-picked quotes from visionaries, thinkers, and creators.',
      icon: <BookOpen className="w-6 h-6 text-primary" />
    },
    {
      title: 'Daily Insights',
      description: 'A new quote every day to help you stay focused and motivated.',
      icon: <Zap className="w-6 h-6 text-accent" />
    },
    {
      title: 'Permanent Archive',
      description: 'Save your favorites and sync them across all your devices securely.',
      icon: <Shield className="w-6 h-6 text-primary" />
    }
  ];

  return (
    <section id="features" className="py-24 px-4 bg-white/50 border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Elevate your daily routine</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Everything you need to find the perfect words for any moment, organized and accessible everywhere.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="glass-panel rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
