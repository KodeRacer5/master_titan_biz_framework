import React from 'react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';
import { LineChart, PieChart, BarChart } from 'lucide-react';

export function InsightsOverview() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center">
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
          <div className="relative z-10 container mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                Data-Driven Market Intelligence
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Stay ahead of industry trends with our comprehensive market analysis and 
                competitive intelligence platform, updated in real-time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="primary" size="lg" className="text-lg">
                  Access Reports
                </Button>
                <Button variant="secondary" size="lg" className="text-lg">
                  Schedule Consultation
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Insights Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  title: 'Market Analysis',
                  description: 'Real-time data on market trends, competitor pricing, and patient demographics.',
                  icon: <LineChart className="w-8 h-8" />
                },
                {
                  title: 'Performance Metrics',
                  description: 'Comprehensive analytics on practice performance and growth opportunities.',
                  icon: <PieChart className="w-8 h-8" />
                },
                {
                  title: 'Competitive Edge',
                  description: 'Strategic insights to position your practice ahead of competitors.',
                  icon: <BarChart className="w-8 h-8" />
                }
              ].map((insight) => (
                <div key={insight.title} className="text-center">
                  <div className="inline-block p-4 bg-blue-50 rounded-full mb-6 text-blue-600">
                    {insight.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{insight.title}</h3>
                  <p className="text-gray-600">{insight.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}