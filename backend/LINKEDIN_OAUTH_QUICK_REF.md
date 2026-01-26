# LinkedIn OAuth - Quick Reference

**Status:** ✅ Implemented & Ready  
**Build:** ✅ Success (0 Errors)  

---

## 🚀 Quick Start (5 Minutes)

### 1. Get LinkedIn Credentials
Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps):
- Create new app
- In "Auth" tab, add redirect URI: `http://localhost:5000/api/auth/linkedin/callback`
- Copy **Client ID** and **Client Secret**

### 2. Update .env
```dotenv
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here
LINKEDIN_REDIRECT_URI=http://localhost:5000/api/auth/linkedin/callback
```

### 3. Start Server
```bash
npm run build  # Should show "0 errors"
npm run dev    # Start backend
```

### 4. Test It
```bash
# Get authorization URL
curl http://localhost:5000/api/auth/linkedin

# You'll get:
# {
#   "authUrl": "https://www.linkedin.com/oauth/v2/authorization?..."
# }
```

---

## 📋 API Endpoints

### Get LinkedIn Auth URL
```
GET /api/auth/linkedin

Response:
{
  "authUrl": "https://www.linkedin.com/oauth/v2/authorization?..."
}
```

Use this URL to redirect user to LinkedIn login.

### LinkedIn Callback
```
GET /api/auth/linkedin/callback?code=AUTHORIZATION_CODE

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

Backend handles this automatically. LinkedIn redirects here after user grants permission.

---

## 🔄 OAuth Flow (How It Works)

```
1. Frontend calls: GET /api/auth/linkedin
   ↓
2. Backend returns authUrl
   ↓
3. Frontend redirects user to LinkedIn login URL
   ↓
4. User logs in on LinkedIn
   ↓
5. User grants permission to app
   ↓
6. LinkedIn redirects to: GET /api/auth/linkedin/callback?code=...
   ↓
7. Backend exchanges code for access token (securely)
   ↓
8. Backend fetches user profile & email from LinkedIn
   ↓
9. Backend creates/updates user in database
   ↓
10. Backend generates JWT token
    ↓
11. Backend returns JWT token to frontend
    ↓
12. Frontend stores JWT and uses it for all API calls
```

**Key Point:** LinkedIn access token is NOT stored. Only JWT is returned.

---

## 💻 Frontend Integration

### React Example
```javascript
// 1. Redirect to LinkedIn login
async function handleLinkedinLogin() {
  const response = await fetch('http://localhost:5000/api/auth/linkedin');
  const { authUrl } = await response.json();
  window.location.href = authUrl;  // Redirect to LinkedIn
}

// 2. Handle callback (LinkedIn redirects here)
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  
  if (code) {
    // Code is sent to backend automatically
    // Backend returns JWT at /api/auth/linkedin/callback?code=...
    // Store the JWT and redirect to home
  }
}, []);
```

### React Native Example
```javascript
import InAppBrowser from 'react-native-inappbrowser-reborn';

async function linkedinLogin() {
  // 1. Get auth URL
  const res = await fetch('http://localhost:5000/api/auth/linkedin');
  const { authUrl } = await res.json();
  
  // 2. Open in browser
  InAppBrowser.open(authUrl);
  
  // 3. Listen for redirect
  InAppBrowser.addEventListener('browserFinished', async () => {
    // Check if user is authenticated
  });
}
```

---

## 🔐 Environment Variables

Add these to `.env`:

```dotenv
# LinkedIn OAuth Configuration
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here
LINKEDIN_REDIRECT_URI=http://localhost:5000/api/auth/linkedin/callback
```

**Important:**
- Never commit real credentials to git
- Use `.gitignore` to exclude `.env`
- In production, use environment variables from server

---

## ⚠️ Common Issues & Solutions

### Issue: "Cannot find module 'axios'"
**Solution:** `npm install axios`

### Issue: "Redirect URI mismatch"
**Error:** LinkedIn says redirect URI doesn't match

**Solution:** 
- Check `.env` `LINKEDIN_REDIRECT_URI` matches LinkedIn app settings exactly
- Common issues:
  - Using `localhost` vs `127.0.0.1`
  - Missing trailing slash
  - Wrong port number

### Issue: "Code is invalid or expired"
**Error:** Authorization code is not valid

**Solution:**
- Authorization codes are valid for ~10 seconds
- Codes are single-use only
- User must start login from beginning

### Issue: "Could not retrieve email from LinkedIn"
**Error:** 400 - Email not accessible

**Solution:**
- User needs to grant email permission in LinkedIn settings
- Try login again
- Or use a different approach if email is not available

---

## 📊 What Changed

### Files Modified
- ✅ `src/modules/users/user.model.ts` - Added `linkedinId` field
- ✅ `src/modules/auth/auth.types.ts` - Added `LinkedinLoginRequest` interface
- ✅ `src/modules/auth/auth.service.ts` - Added LinkedIn OAuth methods
- ✅ `src/modules/auth/auth.controller.ts` - Added LinkedIn handlers
- ✅ `src/modules/auth/auth.routes.ts` - Added LinkedIn routes
- ✅ `.env` - Added LinkedIn configuration
- ✅ `package.json` - Added axios dependency

### Database Changes
```typescript
// User model now includes:
linkedinId?: string;                    // LinkedIn user ID
authProvider: "local" | "google" | "linkedin"  // Updated enum
```

---

## 🧪 Testing Checklist

- [ ] LinkedIn app created and credentials obtained
- [ ] `.env` updated with LinkedIn credentials
- [ ] `npm run build` succeeds with 0 errors
- [ ] `npm run dev` starts without errors
- [ ] `GET /api/auth/linkedin` returns authUrl
- [ ] Can open authUrl in browser
- [ ] Can log in with LinkedIn credentials
- [ ] Redirected back to callback endpoint
- [ ] JWT token received in response
- [ ] User created in database
- [ ] Can use JWT token for protected endpoints

---

## 🔑 Key Methods in auth.service.ts

### `getLinkedinAuthUrl(): string`
Returns the LinkedIn OAuth authorization URL that frontend should redirect to.

**Usage:**
```typescript
const authUrl = AuthService.getLinkedinAuthUrl();
// Returns: https://www.linkedin.com/oauth/v2/authorization?...
```

### `linkedinLogin(code: string): Promise<AuthResponse>`
Exchanges authorization code for JWT token.

**Flow:**
1. Exchange code for access token
2. Fetch user profile
3. Fetch user email
4. Create/update user in database
5. Generate JWT token
6. Return token (destroy access token)

---

## 📖 Full Documentation

See [LINKEDIN_OAUTH_SETUP.md](LINKEDIN_OAUTH_SETUP.md) for:
- Complete OAuth flow explanation
- Setup instructions with screenshots
- Security features
- Error handling details
- Testing procedures
- Troubleshooting guide

---

## ✨ Features

✅ OAuth 2.0 authorization code flow  
✅ Secure token exchange (no token storage)  
✅ Automatic user creation  
✅ Email & profile fetching  
✅ Graceful error handling  
✅ JWT token issuance  
✅ TypeScript type safety  
✅ Production-ready code  

---

## Next Steps

1. **Get LinkedIn Credentials** (5 min)
   - Go to LinkedIn Developer Portal
   - Create app

2. **Update .env** (1 min)
   - Add credentials

3. **Test Endpoints** (5 min)
   - Try GET /api/auth/linkedin
   - Follow the authUrl

4. **Integrate Frontend** (varies)
   - Add LinkedIn login button
   - Redirect to authUrl
   - Handle JWT response

---

**Build Status:** ✅ SUCCESS (0 errors)  
**Ready:** ✅ Yes  

