import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';

export function Contact() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-14">
        {/* Contact Form Section */}
        <section className="py-24 px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h1 className="text-4xl font-medium mb-6">Contact Us</h1>
                <p className="text-lg text-gray-700 mb-12">
                  Have questions about Tesla products or services? We're here to help.
                </p>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-medium mb-2">Sales</h3>
                    <p className="text-gray-700">For vehicle and energy product purchases</p>
                    <p className="text-gray-900 font-medium mt-1">1-888-518-3752</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium mb-2">Support</h3>
                    <p className="text-gray-700">For product support and service</p>
                    <p className="text-gray-900 font-medium mt-1">1-888-518-3752</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium mb-2">Roadside Assistance</h3>
                    <p className="text-gray-700">24/7 emergency support</p>
                    <p className="text-gray-900 font-medium mt-1">1-877-798-3752</p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <select
                      id="subject"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="sales">Sales Inquiry</option>
                      <option value="support">Product Support</option>
                      <option value="service">Service Request</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <Button variant="primary" size="lg" className="w-full">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}