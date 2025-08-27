// Test script to verify API fix
console.log('Testing Settings API...');

// Test individual setting update
async function testIndividualUpdate() {
  try {
    const response = await fetch('http://localhost:3000/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: 'site_name',
        value: 'Test Market Code - Individual Update'
      })
    });
    
    console.log('Individual Update - Status:', response.status);
    const data = await response.text();
    console.log('Individual Update - Response:', data);
  } catch (error) {
    console.error('Individual Update Error:', error.message);
  }
}

// Test bulk settings update
async function testBulkUpdate() {
  try {
    const response = await fetch('http://localhost:3000/api/admin/settings', {
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
    
    console.log('Bulk Update - Status:', response.status);
    const data = await response.text();
    console.log('Bulk Update - Response:', data);
  } catch (error) {
    console.error('Bulk Update Error:', error.message);
  }
}

// Run tests
testIndividualUpdate().then(() => {
  return testBulkUpdate();
}).then(() => {
  console.log('Tests completed');
}).catch(console.error);
