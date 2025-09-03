"use client";

import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ReactDOMErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Filter out known React DOM errors that are safe to ignore
    const message = error.message || error.toString();
    
    if (
      message.includes('removeChild') ||
      message.includes('Cannot read properties of null') ||
      message.includes('commitDeletionEffectsOnFiber') ||
      message.includes('recursivelyTraverseDeletionEffects')
    ) {
      // Don't trigger error state for these specific errors
      return { hasError: false };
    }
    
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const message = error.message || error.toString();
    
    // Only log non-DOM cleanup errors
    if (
      !message.includes('removeChild') &&
      !message.includes('Cannot read properties of null') &&
      !message.includes('commitDeletionEffectsOnFiber')
    ) {
      console.error('React Error Boundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong.</div>;
    }

    return this.props.children;
  }
}
