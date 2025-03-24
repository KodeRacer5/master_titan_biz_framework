import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

export function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-14">
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center">
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1621447504864-d8686f12c84a?auto=format&fit=crop&q=80&w=2070)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 text-center text-white">
            <h1 className="text-5xl font-medium mb-4">About Tesla</h1>
            <p className="text-xl max-w-2xl mx-auto">Accelerating the world's transition to sustainable energy</p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24 px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-medium mb-12 text-center">Our Mission</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Tesla's mission is to accelerate the world's transition to sustainable energy. We believe that a future powered by clean, renewable energy is not only possible but essential for the preservation of our planet.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Through our electric vehicles, energy storage systems, and solar products, we're working to create a sustainable energy ecosystem that scales globally.
                </p>
              </div>
              <div 
                className="h-[400px] rounded-lg shadow-xl"
                style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1564244374855-43fb9c0ed850?auto=format&fit=crop&q=80&w=1035)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-medium mb-16 text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  title: 'Innovation',
                  description: 'Pushing the boundaries of what's possible in sustainable technology and transportation.',
                },
                {
                  title: 'Sustainability',
                  description: 'Creating products and solutions that help accelerate the world's transition to clean energy.',
                },
                {
                  title: 'Excellence',
                  description: 'Maintaining the highest standards in everything we do, from design to manufacturing.',
                },
              ].map((value) => (
                <div key={value.title} className="text-center">
                  <h3 className="text-2xl font-medium mb-4">{value.title}</h3>
                  <p className="text-gray-700">{value.description}</p>
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