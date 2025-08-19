"use client";

import { useState, useEffect } from 'react';

export function useEmailSupport() {
  const [email, setEmail] = useState('thanhlc.dev@gmail.com'); // default fallback
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmail() {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        
        if (data.success && data.settings?.contact_email) {
          setEmail(data.settings.contact_email);
        }
      } catch (error) {
        console.error('Failed to fetch contact email:', error);
        // Keep default fallback
      } finally {
        setLoading(false);
      }
    }

    fetchEmail();
  }, []);

  return { email, loading };
}
