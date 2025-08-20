$headers = @{"Content-Type" = "application/json"}
$body = @{
    "code" = "TESTAPI123"
    "repo_url" = "https://github.com/test/new-repo"
    "description" = "Test GitCode via API"
    "expire_date" = "2025-12-31T23:59:59Z"
    "usage_limit" = 5
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/gitcode" -Method POST -Headers $headers -Body $body
    Write-Output "Success: $($response | ConvertTo-Json)"
} catch {
    Write-Output "Error: $($_.Exception.Message)"
    Write-Output "Status: $($_.Exception.Response.StatusCode.value__)"
}
