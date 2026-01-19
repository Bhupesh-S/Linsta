# Quick Start Guide - Linsta Backend

## 🚀 Getting Started

### 1. Installation
```bash
cd backend
npm install
```

### 2. Environment Setup
```bash
# Copy example and update with your values
cp .env.example .env
```

Required variables in `.env`:
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

### 3. Start Development Server
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 📋 New Features Quick Reference

### 1. Save/Bookmark Posts
```bash
# Save a post
POST /api/posts/:id/save

# Unsave a post
DELETE /api/posts/:id/save

# Get my saved posts
GET /api/users/me/saved-posts?page=1&limit=20
```

### 2. Follow System
```bash
# Follow a user
POST /api/users/:id/follow

# Unfollow a user
DELETE /api/users/:id/follow

# Get followers
GET /api/users/:id/followers?page=1&limit=20

# Get following
GET /api/users/:id/following?page=1&limit=20

# Get counts
GET /api/users/:id/follow-counts
```

### 3. Smart Feed
```bash
# Get personalized feed (from followed users)
GET /api/feed?page=1&limit=20

# Get explore feed (all posts)
GET /api/feed/explore?page=1&limit=20
```

### 4. Report Content
```bash
# Submit a report
POST /api/reports
Body: {
  targetType: "post" | "story" | "comment",
  targetId: "...",
  reason: "spam" | "abuse" | "fake" | "other",
  description: "..." // optional
}

# Get my reports
GET /api/reports/my?page=1&limit=20

# Get statistics (admin)
GET /api/reports/stats
```

---

## 🔍 Useful Commands

### Development
```bash
npm run dev          # Start with hot reload (ts-node-dev)
npm run build        # Compile TypeScript
npm start            # Run compiled version
```

### Database
```bash
# Connect to MongoDB Atlas
# Update MONGODB_URI in .env
```

### Testing
```bash
# Use Postman / Insomnia with the API_DOCUMENTATION.md
```

---

## 🛡️ Security Features

- ✅ JWT Authentication
- ✅ Rate Limiting (100 req/15min per IP)
- ✅ CORS Protection
- ✅ Input Validation
- ✅ Password Hashing
- ✅ Duplicate Prevention (unique indexes)
- ✅ Self-action Prevention (no self-follows, etc.)

---

## 📊 Database Collections

**New Collections:**
- `saved_posts` - User saved posts
- `saved_events` - User saved events
- `follows` - Follow relationships
- `reports` - Content reports

**Existing Collections:**
- `users` - User accounts
- `posts` - Posts and comments/likes
- `events` - Events and RSVP
- `stories` - Stories (24h TTL)
- `notifications` - User notifications
- `profiles` - User profiles

---

## 🔗 Related Documentation

- **Full API Docs:** `API_DOCUMENTATION.md`
- **Implementation Summary:** `IMPLEMENTATION_COMPLETE.md`
- **Code Examples:** Check test files or use Postman collection

---

## ⚠️ Common Issues

### Issue: "User not authenticated"
**Solution:** Add `Authorization: Bearer <token>` header to requests

### Issue: "You cannot follow yourself"
**Solution:** This is intentional - users cannot follow themselves

### Issue: "You have already reported this content"
**Solution:** Each user can only report content once

### Issue: "Post already saved"
**Solution:** This is intentional - unique constraint prevents duplicates

### Issue: Rate limit exceeded (429)
**Solution:** Wait 15 minutes or adjust RATE_LIMIT_WINDOW_MS and RATE_LIMIT_MAX_REQUESTS

---

## 🧪 Testing Endpoints

### Health Check
```bash
curl http://localhost:5000/health
```

### Save a Post (with auth)
```bash
curl -X POST http://localhost:5000/api/posts/[postId]/save \
  -H "Authorization: Bearer [token]" \
  -H "Content-Type: application/json"
```

### Follow a User (with auth)
```bash
curl -X POST http://localhost:5000/api/users/[userId]/follow \
  -H "Authorization: Bearer [token]" \
  -H "Content-Type: application/json"
```

### Get Personalized Feed (with auth)
```bash
curl http://localhost:5000/api/feed?page=1&limit=20 \
  -H "Authorization: Bearer [token]"
```

---

## 📱 Frontend Integration

### Important Headers
```javascript
// Add to all authenticated requests
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### CORS Setup
Update `CORS_ORIGIN` in `.env` to your frontend URL:
```env
CORS_ORIGIN=http://localhost:3000
```

For multiple origins:
```env
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,https://yourdomain.com
```

---

## 🚀 Deployment

### Using Heroku
```bash
# Add Procfile
echo "web: npm start" > Procfile

# Push to Heroku
git push heroku main
```

### Using Docker
```bash
docker build -t linsta-backend .
docker run -p 5000:5000 --env-file .env linsta-backend
```

### Using PM2 (Production)
```bash
pm2 start npm --name "linsta-backend" -- start
pm2 save
```

---

## 📞 Support

For issues or questions:
1. Check `API_DOCUMENTATION.md`
2. Review error messages and status codes
3. Check `.env` configuration
4. Verify MongoDB connection
5. Check rate limiting headers

---

**Version:** 1.0.0  
**Last Updated:** January 18, 2026  
**Status:** Production Ready ✅
