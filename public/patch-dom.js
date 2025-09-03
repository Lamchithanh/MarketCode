// Early DOM patch script - should be loaded in <head>
(function() {
  'use strict';
  
  if (typeof window === 'undefined') return;
  
  // Patch console methods immediately
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.error = function() {
    const message = arguments[0]?.toString() || '';
    if (
      message.includes('removeChild') ||
      message.includes('Cannot read properties of null') ||
      message.includes('commitDeletionEffectsOnFiber') ||
      message.includes('recursivelyTraverseDeletionEffects')
    ) {
      return; // Suppress completely
    }
    return originalError.apply(console, arguments);
  };
  
  console.warn = function() {
    const message = arguments[0]?.toString() || '';
    if (message.includes('removeChild') || message.includes('DOM node')) {
      return;
    }
    return originalWarn.apply(console, arguments);
  };
  
  // Global error suppression
  window.addEventListener('error', function(e) {
    const msg = e.error?.message || e.message || '';
    if (msg.includes('removeChild') || msg.includes('Cannot read properties of null')) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
    }
  }, { capture: true, passive: false });
  
  console.log('🩹 Early DOM patches applied');
})();
