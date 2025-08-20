$headers = @{"Content-Type" = "application/json"}
$body = @{
    "id" = "test123"
    "code" = "TEST123"
    "repo_url" = "https://github.com/test/repo"
    "description" = "Test GitCode"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/gitcode" -Method PUT -Headers $headers -Body $body
    Write-Output "Success: $($response | ConvertTo-Json)"
} catch {
    Write-Output "Error: $($_.Exception.Message)"
    Write-Output "Status: $($_.Exception.Response.StatusCode.value__)"
}
