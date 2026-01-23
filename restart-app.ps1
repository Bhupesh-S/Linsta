# Restart the React Native app with cache cleared
Write-Host "Stopping any running Metro bundler..." -ForegroundColor Yellow
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue

Write-Host "`nClearing React Native cache..." -ForegroundColor Yellow
Set-Location "d:\intern\frontend"

# Clear watchman
npx react-native start --reset-cache

Write-Host "`nApp restarted! Press 'r' in the terminal to reload." -ForegroundColor Green
