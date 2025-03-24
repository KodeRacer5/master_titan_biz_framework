import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { TechnologyOverview } from './pages/digital-scanning/TechnologyOverview';
import { MarketingStrategyOverview } from './pages/marketing-strategy/Overview';
import { LabServicesOverview } from './pages/lab-services/Overview';
import { InsightsOverview } from './pages/insights/Overview';
import { PartnershipOverview } from './pages/partnership/Overview';
import { NotificationContainer } from './components/ui/NotificationContainer';

function App() {
  return (
    <Router basename="/">
      <NotificationContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Digital Scanning Routes */}
        <Route path="/digital-scanning/technology-overview" element={<TechnologyOverview />} />
        <Route path="/digital-scanning/case-studies" element={<TechnologyOverview />} />
        <Route path="/digital-scanning/roi-calculator" element={<TechnologyOverview />} />
        
        {/* Lab Services Routes */}
        <Route path="/lab-services" element={<LabServicesOverview />} />
        <Route path="/lab-services/workflow-demo" element={<LabServicesOverview />} />
        <Route path="/lab-services/quality-standards" element={<LabServicesOverview />} />
        <Route path="/lab-services/partner-network" element={<LabServicesOverview />} />
        <Route path="/lab-services/quality" element={<LabServicesOverview />} />
        <Route path="/lab-services/turnaround" element={<LabServicesOverview />} />
        <Route path="/lab-services/technology" element={<LabServicesOverview />} />
        
        {/* Marketing Strategy Routes */}
        <Route path="/marketing-strategy/acquisition" element={<MarketingStrategyOverview />} />
        <Route path="/marketing-strategy/lead-generation" element={<MarketingStrategyOverview />} />
        <Route path="/marketing-strategy/case-acceptance" element={<MarketingStrategyOverview />} />
        <Route path="/marketing-strategy/referrals" element={<MarketingStrategyOverview />} />
        <Route path="/marketing-strategy/retention" element={<MarketingStrategyOverview />} />
        
        {/* Insights Routes */}
        <Route path="/insights/clear-choice" element={<InsightsOverview />} />
        <Route path="/insights/differentiation" element={<InsightsOverview />} />
        <Route path="/insights/exclusivity" element={<InsightsOverview />} />
        <Route path="/insights/trends" element={<InsightsOverview />} />
        
        {/* Partnership Routes */}
        <Route path="/partnership-model" element={<PartnershipOverview />} />
        <Route path="/partnership-model/integration" element={<PartnershipOverview />} />
        <Route path="/partnership-model/support" element={<PartnershipOverview />} />
        <Route path="/partnership-model/training" element={<PartnershipOverview />} />
        <Route path="/partnership-model/network" element={<PartnershipOverview />} />
        <Route path="/partnership-model/benefits" element={<PartnershipOverview />} />
        <Route path="/partnership-model/success-stories" element={<PartnershipOverview />} />
      </Routes>
    </Router>
  );
}

export default App;
