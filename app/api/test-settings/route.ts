import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse(`
<!DOCTYPE html>
<html>
<head>
    <title>API Test</title>
</head>
<body>
    <h1>Settings API Test</h1>
    <button onclick="testIndividualUpdate()">Test Individual Setting Update</button>
    <button onclick="testBulkUpdate()">Test Bulk Settings Update</button>
    <div id="result"></div>

    <script>
        async function testIndividualUpdate() {
            const result = document.getElementById('result');
            result.innerHTML = 'Testing individual setting update...';
            
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
                result.innerHTML = 'Individual Update - Status: ' + response.status + '<br>Response: ' + data;
            } catch (error) {
                result.innerHTML = 'Error: ' + error.message;
            }
        }
        
        async function testBulkUpdate() {
            const result = document.getElementById('result');
            result.innerHTML = 'Testing bulk settings update...';
            
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
                result.innerHTML = 'Bulk Update - Status: ' + response.status + '<br>Response: ' + data;
            } catch (error) {
                result.innerHTML = 'Error: ' + error.message;
            }
        }
    </script>
</body>
</html>
  `, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
