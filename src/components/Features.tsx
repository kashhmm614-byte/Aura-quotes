import React from 'react';
import { BookOpen, Zap, Shield } from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      title: 'Curated Wisdom',
      description: 'Access thousands of hand-picked quotes from visionaries, thinkers, and creators.',
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      title: 'Daily Insights',
      description: 'A new quote every day to help you stay focused and motivated.',
      icon: <Zap className="w-5 h-5" />
    },
    {
      title: 'Permanent Archive',
      description: 'Save your favorites and sync them across all your devices securely.',
      icon: <Shield className="w-5 h-5" />
    }
  ];

  return (
    <section id="features" className="py-24 px-4 bg-muted/50 border-y border-border">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Elevate your daily routine</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to find the perfect words for any moment, organized and accessible everywhere.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4 text-foreground">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold tracking-tight mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
