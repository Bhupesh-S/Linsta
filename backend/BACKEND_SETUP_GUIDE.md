# 🔧 Backend Setup & Deployment Guide for Frontend Team

---

## 🚀 Getting the Backend Running

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone & Install

```bash
# Clone the repository
git clone <repo-url>
cd backend

# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env` file in the `backend` directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/linsta
# OR use MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/linsta?retryWrites=true&w=majority

# JWT Secret (use any random string)
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development
```

### 3. Start Backend

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

**Backend will run on**: `http://localhost:5000`

---

## 📦 Required Dependencies

The backend already has all required packages. Here's what's installed:

```json
{
  "express": "Web framework",
  "mongoose": "MongoDB ODM",
  "typescript": "Type safety",
  "cors": "Cross-origin requests",
  "jsonwebtoken": "JWT tokens",
  "dotenv": "Environment variables",
  "bcryptjs": "Password hashing",
  "google-auth-library": "Google authentication"
}
```

---

## 🗄️ MongoDB Setup

### Option 1: Local MongoDB

```bash
# Install MongoDB locally
# https://docs.mongodb.com/manual/installation/

# Start MongoDB
mongod

# Use in .env:
MONGODB_URI=mongodb://localhost:27017/linsta
```

### Option 2: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create account & cluster
3. Get connection string
4. Use in .env:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/linsta?retryWrites=true&w=majority
```

---

## ✅ Verify Backend is Working

### Test 1: Health Check
```bash
curl http://localhost:5000/
# Should return: {"status":"OK"}
```

### Test 2: Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123"
  }'
# Should return user object with token
```

### Test 3: Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
# Should return user object with token
```

---

## 🌐 CORS Configuration

CORS is already enabled. Backend accepts requests from any origin during development.

**For production**, update `app.ts`:

```typescript
const corsOptions = {
  origin: 'https://yourdomain.com', // Your frontend URL
  credentials: true
};

app.use(cors(corsOptions));
```

---

## 📡 API Base URLs

### Development
```
http://localhost:5000
```

### Production
```
https://your-backend-domain.com
```

Update in frontend `.env`:
```env
REACT_APP_API_URL=https://your-backend-domain.com
```

---

## 🔐 JWT Configuration

### How JWT Works

1. **User logs in** → Backend creates JWT token
2. **Token is returned** → Frontend stores in localStorage
3. **Each request** → Token sent in Authorization header
4. **Backend verifies** → Token is valid & not expired

### Token Anatomy
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmYxMjM0NTY3ODkwYWJjZGVmMTIzNDUiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE3MDM5MTIwMDAsImV4cCI6MTcwNDUxNjgwMH0.abc123xyz
```

- **Header**: Algorithm (HS256)
- **Payload**: User ID, email, issue time, expiration
- **Signature**: Verification hash

### Token Expiration
- Default: 7 days
- Change in `auth.service.ts` if needed

---

## 📊 Database Collections

### Collections Created Automatically

When you run the app, these collections are created:

1. **users** - User accounts
2. **events** - Events
3. **posts** - Social posts
4. **post_medias** - Post media URLs
5. **likes** - Post likes
6. **comments** - Post comments
7. **eventrsps** - Event RSVPs

### View in MongoDB

```bash
# In MongoDB CLI
use linsta
show collections
db.users.find()
```

---

## 📝 Log Files & Debugging

### Console Logs
```bash
# Development logs in console
npm run dev

# Look for:
# - "Connected to MongoDB"
# - "Server running on port 5000"
# - API request logs
```

### Common Issues

**"Cannot connect to MongoDB"**
```
Solution: 
1. Verify MongoDB is running
2. Check MONGODB_URI in .env
3. Ensure network access (if using Atlas)
```

**"Port 5000 already in use"**
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or change PORT in .env
PORT=3001
```

**"JWT Secret not set"**
```
Solution: Add JWT_SECRET to .env
JWT_SECRET=any_random_string_here
```

---

## 🚀 Deployment Options

### Option 1: Heroku

```bash
# 1. Create Heroku app
heroku create linsta-backend

# 2. Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGODB_URI=your_mongodb_url

# 3. Deploy
git push heroku main
```

### Option 2: AWS (EC2)

```bash
# 1. SSH into EC2 instance
ssh -i key.pem ec2-user@your-ip

# 2. Install Node & MongoDB
sudo yum install nodejs npm

# 3. Clone & setup
git clone <repo>
cd backend
npm install
npm run build

# 4. Start with PM2
npm install -g pm2
pm2 start npm --name "linsta-backend" -- start
```

### Option 3: Docker

```dockerfile
# Dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

```bash
# Build & run
docker build -t linsta-backend .
docker run -p 5000:5000 -e MONGODB_URI=... linsta-backend
```

### Option 4: DigitalOcean/Linode

```bash
# Similar to AWS EC2
# 1. Create droplet
# 2. SSH in
# 3. Install Node
# 4. Deploy code
# 5. Use PM2 or systemd for auto-restart
```

---

## 📋 Pre-Deployment Checklist

- [ ] All environment variables set in `.env`
- [ ] MongoDB connection verified
- [ ] All tests passing
- [ ] API endpoints responding correctly
- [ ] CORS configured for frontend domain
- [ ] JWT_SECRET is strong & unique
- [ ] No console.log() left in code (optional)
- [ ] Error handling is comprehensive
- [ ] Database indexes are created
- [ ] Backup strategy in place

---

## 🔍 Monitoring & Logs

### View Real-time Logs
```bash
npm run dev
# Logs appear in console
```

### MongoDB Logs
```bash
# View MongoDB operations
db.setProfilingLevel(1)
db.system.profile.find().limit(5).sort({ ts: -1 }).pretty()
```

### Performance Monitoring
```bash
# Check response times
# Use tools like:
# - New Relic
# - Datadog
# - PM2 Plus
```

---

## 🔐 Security Checklist

- [ ] JWT_SECRET is strong (min 32 characters)
- [ ] Passwords are hashed (bcryptjs)
- [ ] CORS is restricted to your domain
- [ ] HTTPS is enabled in production
- [ ] Database credentials not in code
- [ ] Environment variables are protected
- [ ] Input validation on all endpoints
- [ ] Rate limiting (optional, can add)
- [ ] HTTPS only (set in production)

---

## 📞 Troubleshooting

### Backend won't start

```bash
# Check Node version
node --version  # Should be 14+

# Check npm
npm --version

# Clear cache
npm cache clean --force
rm -rf node_modules
npm install

# Try again
npm run dev
```

### MongoDB connection fails

```bash
# Check MongoDB is running
mongod --version

# Test connection
mongo mongodb://localhost:27017/test

# If using Atlas, check:
# - Username/password correct
# - IP whitelist includes your IP
# - Network access enabled
```

### Port 5000 in use

```bash
# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### CORS issues

```
Error: "Access to XMLHttpRequest ... blocked by CORS policy"

Solution:
1. Verify backend is running
2. Check CORS is enabled in app.ts
3. Use correct backend URL
4. Include Authorization header if needed
```

---

## 📚 Additional Resources

- **MongoDB Documentation**: https://docs.mongodb.com
- **Express.js Guide**: https://expressjs.com
- **TypeScript Handbook**: https://www.typescriptlang.org/docs
- **JWT Introduction**: https://jwt.io/introduction

---

## 💡 Tips for Frontend Team

1. **Store token safely**
   ```javascript
   // Store in localStorage
   localStorage.setItem('token', token);
   
   // Retrieve when needed
   const token = localStorage.getItem('token');
   ```

2. **Set base URL for all requests**
   ```javascript
   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
   ```

3. **Create API service module**
   ```javascript
   // api.js
   export const apiCall = async (endpoint, options = {}) => {
     const token = localStorage.getItem('token');
     return fetch(`${API_URL}${endpoint}`, {
       ...options,
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`,
         ...options.headers
       }
     });
   };
   ```

4. **Handle token expiration**
   ```javascript
   // If you get 401, redirect to login
   if (response.status === 401) {
     localStorage.removeItem('token');
     window.location.href = '/login';
   }
   ```

---

## 📋 Environment Template

Save as `.env` in backend folder:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/linsta

# JWT
JWT_SECRET=change_this_to_a_random_string_at_least_32_chars_long

# Server
PORT=5000
NODE_ENV=development

# CORS (optional, defaults to all origins)
CORS_ORIGIN=*

# Google OAuth (optional, if using Google login)
GOOGLE_CLIENT_ID=your_google_client_id
```

---

## ✅ Quick Verification

After starting the backend, run these commands:

```bash
# 1. Health check
curl http://localhost:5000/

# 2. Register test user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"Test123"}'

# 3. Copy the token from response

# 4. Test protected endpoint
curl http://localhost:5000/api/posts \
  -H "Authorization: Bearer PASTE_TOKEN_HERE"

# If all three work, backend is ready!
```

---

**Backend is ready for frontend integration!** 🎉

Share `FRONTEND_API_GUIDE.md` and `QUICK_START_FRONTEND.md` with your frontend team.
