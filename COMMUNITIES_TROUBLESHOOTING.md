# Communities Not Showing - Troubleshooting Guide

## ✅ What We Fixed

### 1. Added Data Loading
The CommunitiesScreen was not calling `loadCommunities()` on mount. We added:

```typescript
useEffect(() => {
  loadCommunities();
}, []);
```

### 2. Added Pull-to-Refresh
You can now pull down to refresh the communities list:

```typescript
<RefreshControl 
  refreshing={refreshing} 
  onRefresh={handleRefresh} 
  colors={['#0A66C2']} 
/>
```

### 3. Added Loading State
Shows a spinner while communities are being fetched:

```typescript
{loading && communities.length === 0 ? (
  <ActivityIndicator size="large" color="#0A66C2" />
) : ...}
```

### 4. Created Test Data
Seeded 8 test communities in the database:
- Tech Innovators (public)
- Business Leaders Network (public)
- Healthcare Professionals (private)
- Digital Marketing Hub (public)
- UX/UI Designers (public)
- Finance & Investment Club (private)
- EdTech Pioneers (public)
- Software Engineers Lounge (public)

---

## 🚀 How to See Communities Now

### Option 1: Restart the App
1. **Kill the app completely** (swipe away from recent apps)
2. **Reopen the app** and login
3. Navigate to **My Network** → **Communities tab**
4. **Pull down to refresh** the list
5. Communities should now appear!

### Option 2: Clear App Data (if Option 1 doesn't work)
1. Go to phone **Settings** → **Apps** → **Linsta**
2. **Clear Storage/Data** (you'll need to login again)
3. Reopen app and login
4. Navigate to Communities
5. Pull to refresh

---

## 🔍 Debugging Steps

### Check 1: Is the Backend Running?
```powershell
# In terminal
cd backend
npm run dev
# or
ts-node src/server.ts
```

Backend should be running on `http://localhost:3000`

### Check 2: Check Network Request in App
When you open CommunitiesScreen, check the console/debugger for:
- `GET /api/network/communities` request
- Response with communities array
- Any error messages

### Check 3: Verify Database Has Communities
```powershell
cd backend
npx ts-node create-test-communities.ts
```

This will show if communities were created successfully.

### Check 4: Check Authentication
The communities endpoint requires authentication (`authMiddleware`). Make sure:
- User is logged in
- Auth token is valid
- Token is being sent in request headers

---

## 🧪 Testing the Full Flow

### 1. Start Backend
```powershell
cd C:\CubeAI\bharani\Linsta\backend
npm run dev
```

### 2. Start Frontend
```powershell
cd C:\CubeAI\bharani\Linsta
npx expo start
```

### 3. In the App
1. **Login** with valid credentials
2. Go to **My Network** (bottom nav)
3. Tap **Communities** tab (4th tab)
4. **Pull down to refresh**
5. Should see 8 communities

### 4. Test Interactions
- **Tap a community** → Opens CommunityDetailScreen
- **Tap Join** → Joins public community (instant) or requests to join private community
- **Search** communities by name or tags
- **Filter** by category using chips
- **Tap + icon** in header → Create new community

---

## 🐛 Common Issues & Solutions

### Issue: "No communities available"
**Causes:**
- Backend not running
- Not logged in
- Network request failed
- Database is empty

**Solutions:**
1. Check backend is running on port 3000
2. Verify you're logged in (check AsyncStorage for @auth_token)
3. Pull to refresh
4. Run `create-test-communities.ts` to seed data
5. Check React Native console for error messages

### Issue: Loading spinner forever
**Causes:**
- Backend unreachable
- Network timeout
- API endpoint error

**Solutions:**
1. Check backend logs for errors
2. Verify API base URL in `frontend/src/services/network.http.ts`
3. Check network connectivity
4. Look for CORS or authentication errors

### Issue: Communities show but can't join
**Causes:**
- Join API endpoint not working
- User already a member
- Permission denied

**Solutions:**
1. Check backend logs when clicking Join
2. Verify `POST /api/network/community/join` is working
3. Check if user is already in the community
4. For private communities, request should create pending membership

### Issue: Can't create community
**Causes:**
- CreateCommunityScreen not in navigation
- Image picker permissions not granted
- Form validation failing

**Solutions:**
1. Grant camera/photo library permissions
2. Ensure name is at least 3 characters
3. Check console for validation errors
4. Verify backend endpoint: `POST /api/network/community`

---

## 📝 Expected Behavior

### Public Communities
- **Join:** Instant membership (status: active)
- **Button:** Shows "Join" → changes to "Joined"
- **Access:** Immediate access to posts/members

### Private Communities
- **Join:** Creates pending request (status: pending)
- **Button:** Shows "Join" → changes to "Pending"
- **Alert:** "Request sent, awaiting approval"
- **Access:** Must be approved by admin/moderator first

---

## 🔗 Related Files

- **Screen:** `frontend/src/pages/network/CommunitiesScreen.tsx`
- **Hook:** `frontend/src/hooks/useNetwork.ts`
- **API Service:** `frontend/src/services/network.http.ts`
- **Backend Routes:** `backend/src/modules/network/network.routes.ts`
- **Backend Controller:** `backend/src/modules/network/network.controller.ts`
- **Backend Service:** `backend/src/modules/network/network.service.ts`
- **Seed Script:** `backend/create-test-communities.ts`

---

## ✅ Verification Checklist

- [ ] Backend running on http://localhost:3000
- [ ] User logged in with valid token
- [ ] Database has communities (run seed script)
- [ ] App restarted after code changes
- [ ] Navigation to Communities tab works
- [ ] Pull-to-refresh triggers loadCommunities()
- [ ] Network request sent to GET /api/network/communities
- [ ] Communities array returned from API
- [ ] Communities displayed in UI
- [ ] Join button works for public communities
- [ ] Create button (+ icon) navigates to CreateCommunityScreen
- [ ] Tap on community opens CommunityDetailScreen

---

## 🎯 Quick Fix Summary

**What was wrong:** Screen wasn't loading communities because `useEffect` to call `loadCommunities()` was missing.

**What we fixed:**
1. Added `useEffect` to call `loadCommunities()` on mount
2. Added pull-to-refresh functionality
3. Added loading state with spinner
4. Seeded test data (8 communities)

**What you need to do:**
1. **Restart the app** (kill and reopen)
2. **Navigate to Communities**
3. **Pull down to refresh**
4. Communities should now appear!

If you still don't see communities, check the debugging steps above and verify your backend is running with the test data.
