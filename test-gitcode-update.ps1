$headers = @{"Content-Type" = "application/json"}
$body = @{
    "id" = "77517493-4e87-44b6-847c-b6023c1e38db"
    "code" = "VIPGIFT02"
    "repo_url" = "https://github.com/sample/admin-dashboard-v2"
    "description" = "Updated Admin Dashboard React + TypeScript"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/gitcode" -Method PUT -Headers $headers -Body $body
    Write-Output "Success: $($response | ConvertTo-Json)"
} catch {
    Write-Output "Error: $($_.Exception.Message)"
    Write-Output "Status: $($_.Exception.Response.StatusCode.value__)"
}
