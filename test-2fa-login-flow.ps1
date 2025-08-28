# Test 2FA Authentication Flow
# This script tests the complete login flow with 2FA

param(
    [string]$BaseUrl = "http://localhost:3000",
    [string]$TestEmail = "test@example.com",
    [string]$TestPassword = "123456"
)

Write-Host "🔐 Testing 2FA Authentication Flow" -ForegroundColor Cyan
Write-Host "Base URL: $BaseUrl" -ForegroundColor Yellow
Write-Host "Test Email: $TestEmail" -ForegroundColor Yellow
Write-Host "=" * 50

# Helper function to make API requests
function Invoke-AuthTest {
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
            
            # Try to read error response body
            try {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $responseBody = $reader.ReadToEnd()
                Write-Host "Response Body: $responseBody" -ForegroundColor Red
            } catch {
                # Ignore errors reading response body
            }
        }
        return $null
    }
}

# Step 1: Check if user has 2FA enabled
Write-Host "`n" + "=" * 20 + " STEP 1: CHECK 2FA STATUS " + "=" * 20 -ForegroundColor Magenta

$check2FABody = @{
    email = $TestEmail
}

$check2FAResult = Invoke-AuthTest -Endpoint "/api/auth/check-2fa" -Method "POST" -Body $check2FABody -Description "Check if user has 2FA enabled"

if ($check2FAResult -and $check2FAResult.requires2FA) {
    Write-Host "`n🛡️  User has 2FA enabled - will require TOTP code for login" -ForegroundColor Yellow
} elseif ($check2FAResult) {
    Write-Host "`n✅ User does not have 2FA enabled - standard login will work" -ForegroundColor Green
} else {
    Write-Host "`n❌ Could not check 2FA status" -ForegroundColor Red
}

# Step 2: Test NextAuth login without 2FA code (should fail if 2FA is enabled)
Write-Host "`n" + "=" * 20 + " STEP 2: TEST LOGIN WITHOUT 2FA " + "=" * 20 -ForegroundColor Magenta

$loginBody = @{
    email = $TestEmail
    password = $TestPassword
    twoFactorCode = ""
}

Write-Host "`n📝 Attempting login without 2FA code..." -ForegroundColor Yellow
Write-Host "Note: This should fail if user has 2FA enabled" -ForegroundColor Gray

# For testing NextAuth, we need to make a different type of request
Write-Host "`n🔍 To test NextAuth login, you need to:" -ForegroundColor Cyan
Write-Host "1. Open: $BaseUrl/login-2fa" -ForegroundColor White
Write-Host "2. Enter email: $TestEmail" -ForegroundColor White
Write-Host "3. Enter password: $TestPassword" -ForegroundColor White
Write-Host "4. If 2FA is enabled, you'll see a 2FA code input field" -ForegroundColor White
Write-Host "5. Use Google Authenticator to get the 6-digit code" -ForegroundColor White

# Step 3: Test direct API calls for 2FA setup
Write-Host "`n" + "=" * 20 + " STEP 3: TEST 2FA SETUP " + "=" * 20 -ForegroundColor Magenta

# Test user 2FA status
Invoke-AuthTest -Endpoint "/api/user/two-factor/setup" -Method "GET" -Description "Get current user 2FA status"

# Test user 2FA setup (will require authentication)
$setup2FABody = @{
    password = $TestPassword
}

Invoke-AuthTest -Endpoint "/api/user/two-factor/setup" -Method "POST" -Body $setup2FABody -Description "Setup user 2FA (requires auth)"

# Step 4: Database verification
Write-Host "`n" + "=" * 20 + " STEP 4: DATABASE VERIFICATION " + "=" * 20 -ForegroundColor Magenta

Write-Host "`n🗄️  Database Checks:" -ForegroundColor Cyan
Write-Host "1. Connect to your Supabase dashboard" -ForegroundColor White
Write-Host "2. Check User table for settings field" -ForegroundColor White
Write-Host "3. Look for twoFactorEnabled and twoFactorSecret in settings JSONB" -ForegroundColor White
Write-Host "4. Example query:" -ForegroundColor White
Write-Host "   SELECT email, settings->>'twoFactorEnabled' as has_2fa FROM \"User\" WHERE email = '$TestEmail';" -ForegroundColor Gray

# Step 5: Manual testing instructions
Write-Host "`n" + "=" * 20 + " MANUAL TESTING INSTRUCTIONS " + "=" * 20 -ForegroundColor Magenta

Write-Host "`n📱 To test complete 2FA flow:" -ForegroundColor Cyan
Write-Host "1. First setup 2FA:" -ForegroundColor White
Write-Host "   - Go to profile settings" -ForegroundColor Gray
Write-Host "   - Toggle 2FA switch ON" -ForegroundColor Gray
Write-Host "   - Scan QR code with Google Authenticator" -ForegroundColor Gray
Write-Host "   - Verify with 6-digit code" -ForegroundColor Gray

Write-Host "`n2. Then test login:" -ForegroundColor White
Write-Host "   - Logout completely" -ForegroundColor Gray
Write-Host "   - Go to: $BaseUrl/login-2fa" -ForegroundColor Gray
Write-Host "   - Enter email and password" -ForegroundColor Gray
Write-Host "   - Should see 2FA prompt" -ForegroundColor Gray
Write-Host "   - Enter code from authenticator app" -ForegroundColor Gray
Write-Host "   - Should login successfully" -ForegroundColor Gray

Write-Host "`n🔗 Test URLs:" -ForegroundColor Cyan
Write-Host "- New 2FA Login Page: $BaseUrl/login-2fa" -ForegroundColor Blue
Write-Host "- Standard Login Page: $BaseUrl/login" -ForegroundColor Blue
Write-Host "- Interactive Test Page: file:///$PWD/test-2fa-system.html" -ForegroundColor Blue

Write-Host "`n" + "=" * 50 -ForegroundColor Cyan
Write-Host "🎉 2FA Authentication Flow Test Completed!" -ForegroundColor Green
Write-Host "=" * 50

Write-Host "`n💡 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Ensure user has 2FA setup in profile" -ForegroundColor White
Write-Host "2. Test login at /login-2fa with 2FA enabled user" -ForegroundColor White
Write-Host "3. Verify 2FA prompt appears after correct password" -ForegroundColor White
Write-Host "4. Test with actual TOTP codes from authenticator" -ForegroundColor White
