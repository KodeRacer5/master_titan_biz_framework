import React from 'react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';
import { Microscope, CheckCircle, ArrowRight } from 'lucide-react';
import { SEO } from '../../components/layout/SEO';

export function TechnologyOverview() {
  return (
    <>
      <SEO 
        title="Digital Scanning Technology"
        description="Experience unparalleled precision with our advanced intraoral scanning system. Learn about our revolutionary digital scanning technology."
      />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative h-[80vh] flex items-center">
            <div 
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
            <div className="relative z-10 container mx-auto px-6 lg:px-8">
              <div className="max-w-3xl">
                <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                  Revolutionary Digital Scanning Technology System
                </h1>
                <p className="text-xl text-white/90 mb-8">
                  Experience unparalleled precision with our advanced intraoral scanning system
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="primary" size="lg" className="text-lg">
                    Schedule Demo
                  </Button>
                  <Button variant="secondary" size="lg" className="text-lg">
                    View Technical Specs
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-24 bg-white">
            <div className="container mx-auto px-6 lg:px-8">
              <div className="grid md:grid-cols-3 gap-12">
                {[
                  {
                    title: 'Sub-Micron Precision',
                    description: 'Industry-leading accuracy with real-time artifact removal and automatic margin detection.',
                    icon: <Microscope className="w-8 h-8" />
                  },
                  {
                    title: 'AI-Powered Analysis',
                    description: 'Advanced algorithms ensure perfect captures every time with instant feedback.',
                    icon: <CheckCircle className="w-8 h-8" />
                  },
                  {
                    title: 'Seamless Integration',
                    description: 'Direct connection to our lab network with automated case submission.',
                    icon: <ArrowRight className="w-8 h-8" />
                  }
                ].map((feature) => (
                  <div key={feature.title} className="text-center">
                    <div className="inline-block p-4 bg-blue-50 rounded-full mb-6 text-blue-600">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Technical Specifications */}
          <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center mb-16">Technical Specifications</h2>
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Scanner Specifications</h3>
                    <ul className="space-y-4 text-gray-600">
                      <li>• Resolution: 0.5 microns</li>
                      <li>• Field of View: 16mm x 14mm</li>
                      <li>• Scan Speed: 60 FPS</li>
                      <li>• Color Scanning: Yes, True Color</li>
                      <li>• Anti-Fog Technology: Advanced Heating System</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Software Features</h3>
                    <ul className="space-y-4 text-gray-600">
                      <li>• Real-time Modeling</li>
                      <li>• AI-powered Margin Detection</li>
                      <li>• Automatic Bite Registration</li>
                      <li>• Cloud Integration</li>
                      <li>• HIPAA Compliant Storage</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Connectivity</h3>
                    <ul className="space-y-4 text-gray-600">
                      <li>• USB 3.0 Connection</li>
                      <li>• Wireless Option Available</li>
                      <li>• Cloud Backup</li>
                      <li>• Automatic Updates</li>
                      <li>• Multi-device Sync</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Support & Training</h3>
                    <ul className="space-y-4 text-gray-600">
                      <li>• 24/7 Technical Support</li>
                      <li>• Online Training Portal</li>
                      <li>• In-person Training Available</li>
                      <li>• Regular Webinars</li>
                      <li>• Comprehensive Documentation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24 bg-blue-600">
            <div className="container mx-auto px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-8">
                Ready to Transform Your Practice?
              </h2>
              <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
                Join the digital revolution and experience the future of dental scanning technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" size="lg">
                  Request Demo
                </Button>
                <Button variant="secondary" size="lg">
                  Contact Sales
                </Button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}