import { validateMenu } from '../src/utils/menu/validateMenu';
import { menuProtection } from '../src/config/menu-protection';

async function validateMenuProtection() {
  console.log('Validating menu protection...');

  const isValid = validateMenu();
  
  if (!isValid) {
    console.error('Menu validation failed');
    process.exit(1);
  }

  console.log('Menu protection validated successfully');
  console.log('Protected elements:', menuProtection.getProtectedElements());
  console.log('Allowed modifications:', menuProtection.getAllowedModifications());
}

validateMenuProtection().catch(error => {
  console.error('Validation error:', error);
  process.exit(1);
});