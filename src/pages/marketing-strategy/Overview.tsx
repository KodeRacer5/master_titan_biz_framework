import React from 'react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';
import { Target, Users, TrendingUp, Star, Shield, Clock } from 'lucide-react';
import { SEO } from '../../components/layout/SEO';

export function MarketingStrategyOverview() {
  return (
    <>
      <SEO 
        title="Marketing Strategy"
        description="Transform your practice with our proven marketing strategies that deliver 15+ qualified implant leads per month with a 3x ROI guarantee."
      />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative h-[80vh] flex items-center">
            <div 
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
            <div className="relative z-10 container mx-auto px-6 lg:px-8">
              <div className="max-w-3xl">
                <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                  Data-Driven Patient Acquisition
                </h1>
                <p className="text-xl text-white/90 mb-8">
                  Transform your practice with our proven marketing strategies that deliver 
                  15+ qualified implant leads per month with a 3x ROI guarantee.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="primary" size="lg" className="text-lg">
                    Get Your Growth Plan
                  </Button>
                  <Button variant="secondary" size="lg" className="text-lg">
                    View Case Studies
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-24 bg-white">
            <div className="container mx-auto px-6 lg:px-8">
              <div className="grid md:grid-cols-3 gap-12">
                {[
                  {
                    stat: '300%',
                    label: 'Average ROI',
                    description: 'Return on marketing investment within first 6 months',
                    icon: <TrendingUp className="w-8 h-8" />
                  },
                  {
                    stat: '15+',
                    label: 'Monthly Leads',
                    description: 'Qualified implant patient leads per month, guaranteed',
                    icon: <Users className="w-8 h-8" />
                  },
                  {
                    stat: '85%',
                    label: 'Case Acceptance',
                    description: 'Average treatment plan acceptance rate',
                    icon: <Target className="w-8 h-8" />
                  }
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="inline-block p-4 bg-blue-50 rounded-full mb-6 text-blue-600">
                      {stat.icon}
                    </div>
                    <div className="text-4xl font-bold mb-2">{stat.stat}</div>
                    <h3 className="text-xl font-semibold mb-3">{stat.label}</h3>
                    <p className="text-gray-600">{stat.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center mb-16">Our Approach</h2>
              <div className="grid md:grid-cols-3 gap-12">
                {[
                  {
                    title: 'Targeted Campaigns',
                    description: 'Precision marketing to high-value implant patients in your area',
                    icon: <Target className="w-8 h-8" />
                  },
                  {
                    title: 'Lead Nurturing',
                    description: 'Automated follow-up systems to convert leads into patients',
                    icon: <Users className="w-8 h-8" />
                  },
                  {
                    title: 'Performance Tracking',
                    description: 'Real-time analytics and ROI tracking for every campaign',
                    icon: <TrendingUp className="w-8 h-8" />
                  },
                  {
                    title: 'Quality Assurance',
                    description: 'Rigorous lead qualification process',
                    icon: <Star className="w-8 h-8" />
                  },
                  {
                    title: 'Brand Protection',
                    description: 'Reputation management and brand building',
                    icon: <Shield className="w-8 h-8" />
                  },
                  {
                    title: 'Fast Response',
                    description: '24/7 lead monitoring and instant notifications',
                    icon: <Clock className="w-8 h-8" />
                  }
                ].map((feature) => (
                  <div key={feature.title} className="text-center">
                    <div className="inline-block p-4 bg-white rounded-full mb-6 text-blue-600 shadow-md">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Case Study Section */}
          <section className="py-24 bg-white">
            <div className="container mx-auto px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="text-3xl font-bold mb-6">Success Stories</h2>
                <p className="text-xl text-gray-600">
                  See how our marketing strategies have transformed practices across the country.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-12">
                {[
                  {
                    title: "Dr. Smith's Practice Growth",
                    metric: "$400K → $1.2M",
                    period: "10 months",
                    description: "Increased monthly revenue through targeted implant marketing"
                  },
                  {
                    title: "Valley Dental Success",
                    metric: "12 → 45",
                    period: "Per month",
                    description: "Tripled monthly implant case acceptance rate"
                  }
                ].map((case_study) => (
                  <div key={case_study.title} className="bg-gray-50 rounded-xl p-8">
                    <h3 className="text-2xl font-bold mb-4">{case_study.title}</h3>
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {case_study.metric}
                    </div>
                    <div className="text-gray-500 mb-4">{case_study.period}</div>
                    <p className="text-gray-600">{case_study.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24 bg-blue-600">
            <div className="container mx-auto px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-8">
                Ready to Grow Your Practice?
              </h2>
              <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
                Get your personalized growth strategy and see how we can help you attract more high-value patients.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" size="lg">
                  Get Your Growth Plan
                </Button>
                <Button variant="secondary" size="lg">
                  Schedule Consultation
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