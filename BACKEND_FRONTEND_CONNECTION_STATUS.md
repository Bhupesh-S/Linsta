# Backend ↔️ Frontend Connection Status

## ✅ Connection Configuration

### Backend (Server)
- **Port:** 5000 ✅
- **Status:** RUNNING (0.0.0.0:5000 Listen)
- **File:** `backend/src/server.ts`
- **Config:** `backend/.env` (PORT=5000)

### Frontend (Client)
- **Port:** 5000 ✅
- **File:** `frontend/src/services/api.ts`
- **Auto-detection URLs:**
  ```javascript
  'http://localhost:5000',        // iOS Simulator / localhost
  'http://192.168.29.219:5000',   // Your PC's Wi-Fi IP ⭐
  'http://192.168.56.1:5000',     // Your PC's Ethernet IP
  'http://10.0.2.2:5000',         // Android Emulator
  ```

### Communities Endpoint
- **Backend Route:** `GET /api/network/communities`
- **Frontend Call:** `networkAPI.getCommunities()`
- **File:** `frontend/src/services/network.http.ts`
- **Authentication:** Required (JWT Bearer token)

---

## 🔍 Configuration Check

### ✅ Matching Configuration
| Component | Value | Status |
|-----------|-------|--------|
| Backend Port | 5000 | ✅ |
| Frontend Port | 5000 | ✅ |
| Backend Listening | 0.0.0.0:5000 | ✅ |
| MongoDB Connected | Atlas Cloud | ✅ |
| Test Data | 8 communities | ✅ |

### ✅ API Endpoints Match
| Frontend Call | Backend Route | Status |
|--------------|---------------|--------|
| `/api/network/communities` | `router.get("/communities", ...)` | ✅ |
| `/api/network/community` | `router.post("/community", ...)` | ✅ |
| `/api/network/community/:id` | `router.get("/community/:id", ...)` | ✅ |
| `/api/network/community/join` | `router.post("/community/join", ...)` | ✅ |

---

## 🧪 Testing the Connection

### Test 1: Backend is Running
```powershell
Get-NetTCPConnection -LocalPort 5000
```
**Expected:** Shows "Listen" state ✅

### Test 2: Backend Responds
```powershell
cd backend
node test-backend-connection.js
```
**Expected:** Shows communities list

### Test 3: Frontend Auto-Detection
The frontend will automatically:
1. Try each URL in order
2. Send a test request to `/api/health`
3. Use the first one that responds
4. Log the selected URL to console

**Check app console for:**
```
🌐 API URL detected: http://localhost:5000
```

### Test 4: Authentication Token
```powershell
# In React Native debugger/console
AsyncStorage.getItem('@auth_token')
```
**Expected:** Shows JWT token

---

## 🔧 How Frontend Connects

### Step-by-Step Flow:

1. **App Starts**
   ```typescript
   // frontend/src/services/api.ts
   detectAndSetApiUrl() // Auto-detects working URL
   ```

2. **User Opens Communities Tab**
   ```typescript
   // frontend/src/screens/NetworkScreen.tsx
   useEffect(() => {
     if (activeTab === 'communities') {
       loadCommunities(); // Triggers API call
     }
   }, [activeTab]);
   ```

3. **API Call Made**
   ```typescript
   // frontend/src/hooks/useNetwork.ts
   const loadCommunities = async () => {
     const response = await networkAPI.getCommunities();
     setCommunities(response.communities);
   }
   ```

4. **HTTP Request**
   ```typescript
   // frontend/src/services/network.http.ts
   async getCommunities() {
     return this.getJson('/api/network/communities');
   }
   ```

5. **Fetch with Auth**
   ```typescript
   // frontend/src/services/api.ts
   fetch(`${apiUrl}/api/network/communities`, {
     headers: {
       'Authorization': `Bearer ${token}`,
       'Content-Type': 'application/json'
     }
   })
   ```

6. **Backend Receives**
   ```typescript
   // backend/src/modules/network/network.routes.ts
   router.get("/communities", NetworkController.getCommunities);
   ```

7. **Data Returned**
   ```typescript
   // backend/src/modules/network/network.controller.ts
   const communities = await NetworkService.getCommunities(userId);
   res.json({ communities });
   ```

---

## 📱 Device-Specific URLs

### iOS Simulator
```
http://localhost:5000 ✅
```
**Reason:** iOS simulator shares localhost with host machine

### Android Emulator
```
http://10.0.2.2:5000 ✅
```
**Reason:** Android emulator uses special IP for host

### Physical Device (Same Wi-Fi)
```
http://192.168.29.219:5000 ✅
```
**Reason:** Your PC's current Wi-Fi IP address
**Check with:** `ipconfig` (Windows) or `ifconfig` (Mac)

### Physical Device (USB Debugging)
```
adb reverse tcp:5000 tcp:5000
http://localhost:5000 ✅
```
**Reason:** ADB port forwarding

---

## ⚠️ Common Connection Issues

### Issue 1: "Network request failed"
**Causes:**
- Backend not running
- Wrong port
- Firewall blocking
- Different network

**Solutions:**
1. Start backend: `cd backend && npm run dev`
2. Check port: `Get-NetTCPConnection -LocalPort 5000`
3. Check firewall: Allow port 5000
4. Ensure same Wi-Fi network

### Issue 2: "401 Unauthorized"
**Cause:** Missing or invalid auth token

**Solutions:**
1. Login again to get fresh token
2. Check AsyncStorage: `@auth_token`
3. Token might be expired (JWT expiration)

### Issue 3: "No communities available"
**Causes:**
- Backend connected but no data
- Database empty
- API call not triggered

**Solutions:**
1. Seed data: `cd backend && npx ts-node create-test-communities.ts`
2. Check MongoDB: Communities collection should have 8 documents
3. Pull to refresh in app

### Issue 4: Can't connect on physical device
**Causes:**
- Device on different network
- IP address changed
- Port not accessible

**Solutions:**
1. Connect device to same Wi-Fi as PC
2. Get PC's IP: `ipconfig` → find "IPv4 Address"
3. Update `frontend/src/services/api.ts` with your IP
4. Restart app

---

## 🛠️ Manual Override (For Debugging)

If auto-detection fails, you can force a specific URL:

```typescript
// frontend/src/services/api.ts
const MANUAL_URL: string | null = 'http://192.168.29.219:5000'; // Your IP
```

Then restart the app.

---

## ✅ Verification Checklist

- [x] Backend running on port 5000
- [x] Frontend configured for port 5000
- [x] MongoDB connected (Atlas Cloud)
- [x] 8 test communities in database
- [x] API routes match between frontend/backend
- [x] Authentication middleware configured
- [ ] User logged in with valid token
- [ ] Auto-detection finds working URL
- [ ] Communities load in app

---

## 🎯 Quick Test Commands

### Backend Status
```powershell
cd backend
npm run dev
# Should show: "Server running on port 5000"
```

### Database Check
```powershell
cd backend
npx ts-node -e "
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const Community = require('./src/modules/network/community.model').Community;
  const count = await Community.countDocuments();
  console.log('Communities in DB:', count);
  process.exit(0);
});
"
```

### Frontend API Test
```javascript
// In React Native debugger console
import { networkAPI } from './src/services/network.http';
networkAPI.getCommunities().then(console.log).catch(console.error);
```

---

## 📊 Connection Summary

```
┌─────────────┐
│   MOBILE    │
│    APP      │
└──────┬──────┘
       │ Auto-detect URL
       │ Add auth token
       │ GET /api/network/communities
       ↓
┌─────────────┐
│  API Layer  │ http://localhost:5000 (or detected IP)
│  api.ts     │
└──────┬──────┘
       │ HTTP Request
       │ Authorization: Bearer <token>
       ↓
┌─────────────┐
│   BACKEND   │ Port 5000 (0.0.0.0:5000)
│  server.ts  │
└──────┬──────┘
       │ authMiddleware
       │ Verify JWT
       ↓
┌─────────────┐
│   ROUTES    │ /api/network/communities
│network.routes│
└──────┬──────┘
       │ NetworkController
       ↓
┌─────────────┐
│  SERVICE    │ getCommunities(userId)
│network.svc  │
└──────┬──────┘
       │ MongoDB Query
       ↓
┌─────────────┐
│  DATABASE   │ MongoDB Atlas
│ Communities │ (8 test communities)
└─────────────┘
       │
       │ Return data
       ↓
┌─────────────┐
│   MOBILE    │ Display communities
│    APP      │ in NetworkScreen
└─────────────┘
```

---

## 🎉 Summary

**Status:** ✅ **BACKEND IS PROPERLY LINKED WITH FRONTEND**

**Port Configuration:** ✅ Both use port 5000
**API Endpoints:** ✅ All routes match
**Authentication:** ✅ JWT middleware configured
**Database:** ✅ MongoDB connected with test data
**Auto-Detection:** ✅ Multiple fallback URLs configured

**The connection is properly configured!** If communities aren't showing, the issue is likely:
1. User not logged in (no auth token)
2. Backend not running
3. App needs restart to pick up changes
