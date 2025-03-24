import React from 'react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';
import { Clock, Shield, Star } from 'lucide-react';

export function LabServicesOverview() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center">
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1581093458791-9d42e3c7e117?auto=format&fit=crop&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
          <div className="relative z-10 container mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                Premium Lab Services
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Experience the perfect blend of cutting-edge technology and artisanal craftsmanship, 
                backed by our industry-leading warranty and satisfaction guarantee.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="primary" size="lg" className="text-lg">
                  Start Free Trial
                </Button>
                <Button variant="secondary" size="lg" className="text-lg">
                  Compare Services
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  title: '48hr Turnaround',
                  description: 'Industry-leading turnaround time with real-time case tracking.',
                  icon: <Clock className="w-8 h-8" />
                },
                {
                  title: 'Lifetime Warranty',
                  description: 'Comprehensive coverage for all our lab products.',
                  icon: <Shield className="w-8 h-8" />
                },
                {
                  title: 'Premium Quality',
                  description: 'ISO-certified processes with multi-point quality checks.',
                  icon: <Star className="w-8 h-8" />
                }
              ].map((benefit) => (
                <div key={benefit.title} className="text-center">
                  <div className="inline-block p-4 bg-blue-50 rounded-full mb-6 text-blue-600">
                    {benefit.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
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