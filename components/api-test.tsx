"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function APITest() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testSimpleAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/simple-test');
      const data = await response.json();
      setResult('Simple API: ' + JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Simple API Error: ' + error);
    }
    setLoading(false);
  };

  const testSettingsAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      setResult('Settings API: ' + JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Settings API Error: ' + error);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>API Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Button onClick={testSimpleAPI} disabled={loading}>
              Test Simple API
            </Button>
            <Button onClick={testSettingsAPI} disabled={loading}>
              Test Settings API
            </Button>
          </div>
          
          {result && (
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
              {result}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
