# Network Connection Troubleshooting Guide

## ✅ Your Network Configuration
- **Wi-Fi IP**: `192.168.28.61` ⭐ (Primary)
- **Ethernet IP**: `192.168.56.1`
- **Backend Port**: `5000`

## 🔍 Connection Test Results
All IPs are accessible! ✅
- http://192.168.28.61:5000 ✅
- http://192.168.56.1:5000 ✅
- http://localhost:5000 ✅

## 🚀 How to Use

### Option 1: Auto-Detection (Recommended)
The app will automatically try all URLs and use the first one that works.

### Option 2: Manual Override (For Debugging)
If auto-detection fails, edit `frontend/src/services/api.ts`:

```typescript
// Line ~6: Change from null to your IP
const MANUAL_URL: string | null = 'http://192.168.28.61:5000';
```

## 📱 Testing Connection

### From your phone/emulator:
1. Make sure your phone is on the same Wi-Fi network (not mobile data)
2. Backend must be running: `cd backend && npm start`
3. Check logs in Metro bundler for connection attempts

### Expected logs:
```
🔍 Auto-detecting backend server...
Testing: http://192.168.28.61:5000
✅ Server found at: http://192.168.28.61:5000
🎯 Using detected backend URL: http://192.168.28.61:5000
```

## ❌ Error Handling
The app now has better error messages with OR conditions:

```typescript
// Network error OR timeout error
if (error.name === 'AbortError' || error.message === 'Network request failed') {
  // Shows helpful message with checklist
}
```

## 🔧 Common Issues & Solutions

### Issue: "Network request failed"
**Solutions:**
1. ✅ Backend running? → `cd backend && npm start`
2. ✅ Same network? → Phone and PC on same Wi-Fi
3. ✅ Firewall? → Allow Node.js in Windows Firewall
4. ✅ Port 5000? → Check with `netstat -ano | findstr :5000`

### Issue: Timeout errors
**Solutions:**
1. Increase timeout in api.ts (currently 10 seconds)
2. Use MANUAL_URL to force specific IP
3. Check Windows Defender Firewall settings

### Issue: Wrong IP detected
**Solutions:**
1. Set MANUAL_URL to force your IP
2. Update getCommonUrls() array order
3. Your Wi-Fi IP is first in the list now

## 🎯 Quick Commands

### Test connection manually:
```bash
node test-connection.js
```

### Check backend status:
```bash
cd backend
npm start
```

### Check firewall:
```powershell
Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*Node*"}
```

### Find which process uses port 5000:
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess
```

## 📞 Support
If still having issues:
1. Check Metro bundler logs
2. Check backend logs
3. Run test-connection.js
4. Verify phone is on Wi-Fi (not mobile data)
