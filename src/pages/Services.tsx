import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';

export function Services() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-14">
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center">
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1633934542430-0905ccb5f050?auto=format&fit=crop&q=80&w=2070)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 text-center text-white">
            <h1 className="text-5xl font-medium mb-4">Our Services</h1>
            <p className="text-xl max-w-2xl mx-auto">Comprehensive solutions for sustainable energy and transportation</p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-24 px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {[
                {
                  title: 'Vehicle Service',
                  description: 'Expert maintenance and repair services for your Tesla vehicle.',
                  image: 'https://images.unsplash.com/photo-1635758506569-8eb73b0ea899?auto=format&fit=crop&q=80&w=1035',
                },
                {
                  title: 'Solar Installation',
                  description: 'Professional installation of Tesla Solar Roof and Solar Panels.',
                  image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=1035',
                },
                {
                  title: 'Energy Solutions',
                  description: 'Custom energy storage solutions for homes and businesses.',
                  image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1035',
                },
                {
                  title: 'Charging Installation',
                  description: 'Home charging system installation and setup services.',
                  image: 'https://images.unsplash.com/photo-1647500666762-6263aa86d7cf?auto=format&fit=crop&q=80&w=1035',
                },
              ].map((service) => (
                <div key={service.title} className="bg-white rounded-lg overflow-hidden shadow-lg">
                  <div 
                    className="h-64"
                    style={{
                      backgroundImage: `url(${service.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div className="p-8">
                    <h3 className="text-2xl font-medium mb-4">{service.title}</h3>
                    <p className="text-gray-700 mb-6">{service.description}</p>
                    <Button variant="primary" size="lg">Learn More</Button>
                  </div>
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