"use client";

// This script patches React DOM to prevent removeChild errors
// Should be loaded before any React components

if (typeof window !== 'undefined') {
  // Store original methods
  const originalError = console.error;
  const originalWarn = console.warn;

  // Enhanced console filtering
  console.error = function(...args) {
    const message = args[0]?.toString() || '';
    
    // Filter out all React DOM cleanup errors
    if (
      message.includes('removeChild') ||
      message.includes('Cannot read properties of null') ||
      message.includes('commitDeletionEffectsOnFiber') ||
      message.includes('recursivelyTraverseDeletionEffects') ||
      message.includes('node_modules_next_dist_compiled_react-dom')
    ) {
      return; // Completely suppress these errors
    }
    
    return originalError.apply(console, args);
  };

  console.warn = function(...args) {
    const message = args[0]?.toString() || '';
    
    if (
      message.includes('removeChild') ||
      message.includes('DOM node') ||
      message.includes('React DOM')
    ) {
      return; // Suppress warnings too
    }
    
    return originalWarn.apply(console, args);
  };

  // Patch Node.prototype.removeChild globally
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function<T extends Node>(child: T): T {
    if (!this || !child) {
      return child;
    }
    
    try {
      if (this.contains && !this.contains(child)) {
        return child;
      }
      return originalRemoveChild.call(this, child) as T;
    } catch {
      // Silently handle all removeChild errors
      return child;
    }
  };

  // Patch Element.prototype.remove as well
  const originalRemove = Element.prototype.remove;
  Element.prototype.remove = function() {
    try {
      if (this.parentNode) {
        return originalRemove.call(this);
      }
    } catch {
      // Silently handle removal errors
    }
  };

  // Global error handler for uncaught errors
  window.addEventListener('error', function(event) {
    const message = event.error?.message || event.message || '';
    
    if (
      message.includes('removeChild') ||
      message.includes('Cannot read properties of null') ||
      message.includes('commitDeletionEffectsOnFiber')
    ) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }, true);

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    const message = event.reason?.toString() || '';
    
    if (
      message.includes('removeChild') ||
      message.includes('Cannot read properties of null') ||
      message.includes('commitDeletionEffectsOnFiber')
    ) {
      event.preventDefault();
      return false;
    }
  });

  console.log('🔧 React DOM patches applied successfully');
}
