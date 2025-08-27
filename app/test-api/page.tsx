'use client';

import { useState } from 'react';

export default function TestAPIPage() {
  const [result, setResult] = useState('');

  const testIndividualUpdate = async () => {
    setResult('Testing individual setting update...');
    
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: 'site_name',
          value: 'Test Market Code - Individual Update'
        })
      });
      
      const data = await response.text();
      setResult(`Individual Update - Status: ${response.status}\nResponse: ${data}`);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  const testBulkUpdate = async () => {
    setResult('Testing bulk settings update...');
    
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settings: {
            site_name: 'Test Market Code - Bulk Update',
            site_description: 'Testing bulk update functionality'
          }
        })
      });
      
      const data = await response.text();
      setResult(`Bulk Update - Status: ${response.status}\nResponse: ${data}`);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Settings API Test</h1>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={testIndividualUpdate} style={{ marginRight: '10px', padding: '10px' }}>
          Test Individual Setting Update
        </button>
        <button onClick={testBulkUpdate} style={{ padding: '10px' }}>
          Test Bulk Settings Update
        </button>
      </div>
      <pre style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '20px', 
        border: '1px solid #ddd',
        whiteSpace: 'pre-wrap'
      }}>
        {result}
      </pre>
    </div>
  );
}
