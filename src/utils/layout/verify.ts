import { LayoutVerifier } from './LayoutVerifier';

export function verifyLayout(): void {
  const verifier = LayoutVerifier.getInstance();
  
  // First pass: capture original layout
  verifier.freezeCurrentLayout();
  
  // Add mutation observer to check for layout changes
  const observer = new MutationObserver(() => {
    const isValid = verifier.verifyLayout();
    if (!isValid) {
      console.error('Layout verification failed: Layout differs from original by more than threshold');
    }
  });

  // Observe DOM changes
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: false,
    attributeFilter: ['class', 'style']
  });

  // Verify on resize
  let resizeTimeout: NodeJS.Timeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      verifier.verifyLayout();
    }, 100);
  }, { passive: true });

  // Initial verification
  verifier.verifyLayout();
}

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
  window.addEventListener('load', verifyLayout);
}