# Test tạo GitCode với giới hạn rỗng (vô hạn)
$headers = @{"Content-Type" = "application/json"}

Write-Host "🧪 Test 1: Tạo GitCode KHÔNG CÓ usage_limit (mong đợi: vô hạn = -1)"
$body1 = @{
    "code" = "UNLIMITED_TEST1"
    "repo_url" = "https://github.com/test/unlimited1"
    "description" = "Test vô hạn - không có usage_limit"
} | ConvertTo-Json

try {
    $response1 = Invoke-RestMethod -Uri "http://localhost:3000/api/gitcode" -Method POST -Headers $headers -Body $body1
    Write-Host "✅ Success: usage_limit = $($response1.data.usage_limit)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🧪 Test 2: Tạo GitCode với usage_limit = null (mong đợi: vô hạn = -1)"
$body2 = @{
    "code" = "UNLIMITED_TEST2"
    "repo_url" = "https://github.com/test/unlimited2"
    "description" = "Test vô hạn - usage_limit null"
    "usage_limit" = $null
} | ConvertTo-Json

try {
    $response2 = Invoke-RestMethod -Uri "http://localhost:3000/api/gitcode" -Method POST -Headers $headers -Body $body2
    Write-Host "✅ Success: usage_limit = $($response2.data.usage_limit)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🧪 Test 3: Tạo GitCode với usage_limit = 0 (mong đợi: vô hạn = -1)"
$body3 = @{
    "code" = "UNLIMITED_TEST3"
    "repo_url" = "https://github.com/test/unlimited3"
    "description" = "Test vô hạn - usage_limit 0"
    "usage_limit" = 0
} | ConvertTo-Json

try {
    $response3 = Invoke-RestMethod -Uri "http://localhost:3000/api/gitcode" -Method POST -Headers $headers -Body $body3
    Write-Host "✅ Success: usage_limit = $($response3.data.usage_limit)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🧪 Test 4: Tạo GitCode với usage_limit = 5 (mong đợi: giới hạn = 5)"
$body4 = @{
    "code" = "LIMITED_TEST4"
    "repo_url" = "https://github.com/test/limited4"
    "description" = "Test giới hạn 5 lần"
    "usage_limit" = 5
} | ConvertTo-Json

try {
    $response4 = Invoke-RestMethod -Uri "http://localhost:3000/api/gitcode" -Method POST -Headers $headers -Body $body4
    Write-Host "✅ Success: usage_limit = $($response4.data.usage_limit)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
