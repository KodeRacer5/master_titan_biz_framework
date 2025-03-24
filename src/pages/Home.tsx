import React from 'react';
import { Hero, MainSection } from '../components/sections';
import { Header, Footer, SEO } from '../components/layout';
import { siteProtection } from '../config/site-protection';

export function Home() {
  // Section protection verification moved to useEffect to avoid SSR issues
  React.useEffect(() => {
    const validateSections = () => {
      if (!siteProtection.validateModification('partnership-model', 'content') ||
          !siteProtection.validateModification('precision-workflows', 'content') ||
          !siteProtection.validateModification('patient-pipeline', 'content')) {
        console.error('Unauthorized modification attempt on protected section');
      }
    };
    validateSections();
  }, []);

  return (
    <>
      <SEO 
        title="Advanced Dental Technology Solutions"
        description="Transform your dental practice with Titan Surgical Systems. Attract high-value implant patients and streamline your workflow with cutting-edge technology and precision-first marketing."
      />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1" role="main" aria-label="Main content">
          <div 
            className="h-[calc(100vh-80px)] overflow-y-auto snap-y snap-mandatory scroll-smooth"
            style={{ 
              contentVisibility: 'auto',
              containIntrinsicSize: '100vh'
            }}
          >
            {/* Section 1: Partnership Model */}
            <MainSection 
              size="lg" 
              fullWidth 
              id="partnership-model"
              allowedEdits={['text', 'images']}
              data-protected="true"
              data-section-id="1"
            >
              <Hero
                title="Join Our Partnership Network"
                subtitle="Experience Premium Support and Guaranteed Growth"
                backgroundImage="https://raw.githubusercontent.com/KodeRacer5/sandiegodentalassets/refs/heads/main/Titan%20business%20growth%205.png"
                isDark={true}
              />
            </MainSection>

            {/* Section 2: Technology Solutions */}
            <MainSection 
              size="lg" 
              fullWidth 
              id="precision-workflows"
              allowedEdits={['text', 'images']}
              data-protected="true"
              data-section-id="2"
            >
              <Hero
                title="Advanced Dental Technology Solutions"
                subtitle="Streamline Your Workflow with Cutting-Edge Digital Solutions"
                backgroundImage="https://raw.githubusercontent.com/KodeRacer5/sandiegodentalassets/refs/heads/main/titan%20business%20growth2.png"
                isDark={true}
              />
            </MainSection>

            {/* Section 3: Patient Acquisition */}
            <MainSection 
              size="lg" 
              fullWidth 
              isLast 
              id="patient-pipeline"
              allowedEdits={['text', 'images']}
              data-protected="true"
              data-section-id="3"
            >
              <Hero
                title="Break Free from Insurance Dependency"
                subtitle="Attract 15+ High-Value Implant Patients/Month with Precision-First Marketing"
                backgroundImage="https://raw.githubusercontent.com/KodeRacer5/sandiegodentalassets/refs/heads/main/titan_main_hero.png"
                isDark={true}
                isLast={true}
              />
            </MainSection>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Home;
