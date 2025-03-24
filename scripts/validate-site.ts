import { siteIndexValidator } from '../src/utils/sitemap/validate-protection';
import { siteProtection } from '../src/config/site-protection';

async function validateSite() {
  console.log('Validating site protection...');

  const isValid = await siteIndexValidator.validateProtection();
  
  if (!isValid) {
    console.error('Site validation failed');
    process.exit(1);
  }

  console.log('Site protection validated successfully');
  console.log('Protected sections:', siteProtection.getProtectedSections());
  console.log('Allowed modifications:', siteProtection.getAllowedModifications());
}

validateSite().catch(error => {
  console.error('Validation error:', error);
  process.exit(1);
});