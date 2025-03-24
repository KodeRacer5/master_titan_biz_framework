import React from 'react';
import { PageTemplate } from '../../templates/PageTemplate';

export const PartnershipOverview: React.FC = () => {
  return (
    <PageTemplate
      title="Partnership Model - Titan Surgical Systems"
      description="Discover our comprehensive partnership approach to dental technology and marketing solutions. Learn about integration, support, training, and success stories."
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Partnership Model</h1>
        <p className="text-lg mb-4">
          Learn about our comprehensive partnership approach to dental technology and marketing solutions.
        </p>
      </div>
    </PageTemplate>
  );
};
