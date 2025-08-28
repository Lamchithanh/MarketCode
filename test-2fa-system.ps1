# 2FA System API Test Script
# Test all 2FA endpoints for both User and Admin roles

param(
    [string]$BaseUrl = "http://localhost:3000",
    [string]$TestPassword = "123456",
    [string]$AdminPassword = "admin123"
)

Write-Host "🔐 Testing 2FA System APIs" -ForegroundColor Cyan
Write-Host "Base URL: $BaseUrl" -ForegroundColor Yellow
Write-Host "=" * 50

# Helper function to make API requests
function Invoke-APITest {
    param(
        [string]$Endpoint,
        [string]$Method = "GET",
        [hashtable]$Body = $null,
        [string]$Description = ""
    )
    
    Write-Host "`n📡 Testing: $Description" -ForegroundColor Green
    Write-Host "Endpoint: $Method $Endpoint" -ForegroundColor Gray
    
    try {
        $headers = @{
            "Content-Type" = "application/json"
        }
        
        $params = @{
            Uri = "$BaseUrl$Endpoint"
            Method = $Method
            Headers = $headers
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
            Write-Host "Body: $($params.Body)" -ForegroundColor Gray
        }
        
        $response = Invoke-RestMethod @params -ErrorAction Stop
        
        Write-Host "✅ SUCCESS" -ForegroundColor Green
        Write-Host ($response | ConvertTo-Json -Depth 10) -ForegroundColor White
        
        return $response
    }
    catch {
        Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $statusCode = $_.Exception.Response.StatusCode
            Write-Host "Status Code: $statusCode" -ForegroundColor Red
        }
        return $null
    }
}

# Test 1: User Settings API
Write-Host "`n" + "=" * 20 + " USER SETTINGS TESTS " + "=" * 20 -ForegroundColor Magenta

Invoke-APITest -Endpoint "/api/user/settings" -Method "GET" -Description "Get User Settings"

$userSettingsUpdate = @{
    settings = @{
        twoFactorEnabled = $true
        notifications = $true
        emailAlerts = $false
    }
}
Invoke-APITest -Endpoint "/api/user/settings" -Method "PUT" -Body $userSettingsUpdate -Description "Update User Settings"

# Test 2: User 2FA APIs
Write-Host "`n" + "=" * 20 + " USER 2FA TESTS " + "=" * 20 -ForegroundColor Magenta

Invoke-APITest -Endpoint "/api/user/two-factor/setup" -Method "GET" -Description "Get User 2FA Status"

$user2FASetup = @{
    password = $TestPassword
}
$setupResult = Invoke-APITest -Endpoint "/api/user/two-factor/setup" -Method "POST" -Body $user2FASetup -Description "Setup User 2FA"

if ($setupResult -and $setupResult.qrCodeUrl) {
    Write-Host "`n🎯 QR Code URL: $($setupResult.qrCodeUrl)" -ForegroundColor Yellow
    Write-Host "🔑 Manual Entry Key: $($setupResult.manualEntryKey)" -ForegroundColor Yellow
    Write-Host "📋 Backup Codes: $($setupResult.backupCodes -join ', ')" -ForegroundColor Yellow
}

# Test verification (will fail without actual TOTP code)
$userVerify = @{
    code = "123456"  # This will fail, but tests the endpoint
}
Invoke-APITest -Endpoint "/api/user/two-factor/verify" -Method "POST" -Body $userVerify -Description "Verify User 2FA (Test Code)"

# Test disable
Invoke-APITest -Endpoint "/api/user/two-factor/disable" -Method "POST" -Description "Disable User 2FA"

# Test 3: Admin 2FA APIs
Write-Host "`n" + "=" * 20 + " ADMIN 2FA TESTS " + "=" * 20 -ForegroundColor Magenta

Invoke-APITest -Endpoint "/api/admin/two-factor/setup" -Method "GET" -Description "Get Admin 2FA Status"

$admin2FASetup = @{
    password = $AdminPassword
}
$adminSetupResult = Invoke-APITest -Endpoint "/api/admin/two-factor/setup" -Method "POST" -Body $admin2FASetup -Description "Setup Admin 2FA"

if ($adminSetupResult -and $adminSetupResult.qrCodeUrl) {
    Write-Host "`n🎯 Admin QR Code URL: $($adminSetupResult.qrCodeUrl)" -ForegroundColor Yellow
    Write-Host "🔑 Admin Manual Entry Key: $($adminSetupResult.manualEntryKey)" -ForegroundColor Yellow
    Write-Host "📋 Admin Backup Codes: $($adminSetupResult.backupCodes -join ', ')" -ForegroundColor Yellow
}

# Test 4: System Settings APIs
Write-Host "`n" + "=" * 20 + " SYSTEM SETTINGS TESTS " + "=" * 20 -ForegroundColor Magenta

Invoke-APITest -Endpoint "/api/admin/system-settings" -Method "GET" -Description "Get System Settings"

# Test email service
$emailTest = @{
    to = "test@example.com"
    subject = "2FA System Test Email"
    text = "This is a test email from the 2FA system PowerShell test script."
}
Invoke-APITest -Endpoint "/api/admin/email/test" -Method "POST" -Body $emailTest -Description "Test Email Service"

# Test 5: Database Health Check
Write-Host "`n" + "=" * 20 + " DATABASE HEALTH CHECK " + "=" * 20 -ForegroundColor Magenta

# Test database connection (if endpoint exists)
Invoke-APITest -Endpoint "/api/health" -Method "GET" -Description "Health Check"

Write-Host "`n" + "=" * 50 -ForegroundColor Cyan
Write-Host "🎉 2FA System API Tests Completed!" -ForegroundColor Green
Write-Host "=" * 50

# Summary
Write-Host "`n📊 TEST SUMMARY:" -ForegroundColor Cyan
Write-Host "- User Settings API: Tested GET/PUT operations" -ForegroundColor White
Write-Host "- User 2FA API: Tested setup, verify, disable endpoints" -ForegroundColor White
Write-Host "- Admin 2FA API: Tested admin-only 2FA operations" -ForegroundColor White
Write-Host "- System Settings: Tested configuration and email service" -ForegroundColor White

Write-Host "`n💡 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Open test-2fa-system.html in browser for interactive testing" -ForegroundColor White
Write-Host "2. Use Google Authenticator to scan QR codes" -ForegroundColor White
Write-Host "3. Test actual TOTP codes for verification" -ForegroundColor White
Write-Host "4. Check Supabase dashboard for database changes" -ForegroundColor White

Write-Host "`n🔗 USEFUL LINKS:" -ForegroundColor Cyan
Write-Host "- Interactive Test Page: file:///$PWD/test-2fa-system.html" -ForegroundColor Blue
Write-Host "- Next.js Dev Server: $BaseUrl" -ForegroundColor Blue
Write-Host "- Supabase Dashboard: https://supabase.com/dashboard/project/tpatqvqlfklagdkxeqpt" -ForegroundColor Blue
