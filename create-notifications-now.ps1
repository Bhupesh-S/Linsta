# Quick script to create test notifications
# Run: .\create-notifications-now.ps1

$API_URL = "http://192.168.43.114:5000"

Write-Host "🔐 Step 1: Getting authentication token..." -ForegroundColor Cyan

# Login to get fresh token
$loginBody = @{
    email = "bharanidharan5544@gmail.com"
    password = "Bharani@123"  # UPDATE THIS IF WRONG!
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$API_URL/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody

    $token = $loginResponse.token
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "📝 Token: $($token.Substring(0, 30))..." -ForegroundColor Gray
    
    Write-Host "`n🧪 Step 2: Creating test notifications..." -ForegroundColor Cyan
    
    # Create test notifications
    $createResponse = Invoke-RestMethod -Uri "$API_URL/api/notifications/test/create" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        }
    
    Write-Host "✅ Success!" -ForegroundColor Green
    Write-Host "📊 Created: $($createResponse.created) notifications" -ForegroundColor Green
    Write-Host "📬 Unread: $($createResponse.unreadCount)" -ForegroundColor Green
    
    Write-Host "`n🎉 Done! Check your app now - notifications should appear!" -ForegroundColor Green
    Write-Host "📱 Navigate to Notifications screen to see them" -ForegroundColor Yellow
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`n💡 If login failed, update the password in this script (line 9)" -ForegroundColor Yellow
}
