import { LinkChecker } from '../src/utils/links/LinkChecker';
import { NotificationManager } from '../src/utils/notify/NotificationManager';

async function main() {
  const checker = LinkChecker.getInstance();
  const notificationManager = NotificationManager.getInstance();
  const isSectionCheck = process.argv.includes('--section');

  try {
    console.log('\nLink Checker Analysis Started\n' + '='.repeat(30));
    
    if (isSectionCheck) {
      // Check section by section
      const sections = ['partnership-section', 'technology-solutions-section', 'patient-acquisition-section'];
      
      for (const sectionId of sections) {
        console.log(`\nAnalyzing section: ${sectionId}`);
        const results = await checker.checkSection(sectionId);
        console.log(checker.generateReport());
        
        // Notify progress
        notificationManager.info(`Completed checking section: ${sectionId}`, {
          title: 'Link Check Progress',
          duration: 3000
        });
      }
    } else {
      // Check full site
      console.log('\nAnalyzing all site links...');
      const results = await checker.checkFullSite();
      
      // Generate and display comprehensive report
      const report = checker.generateReport();
      console.log('\nFull Site Analysis Report\n' + '='.repeat(30));
      console.log(report);
      
      // Notify completion
      notificationManager.success('Full site link analysis completed', {
        title: 'Link Check Complete',
        duration: 5000
      });
    }
  } catch (error) {
    console.error('Link check failed:', error);
    notificationManager.error('Link check failed', {
      title: 'Error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
    process.exit(1);
  }
}

main().catch(console.error);