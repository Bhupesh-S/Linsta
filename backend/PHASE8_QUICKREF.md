# 🚀 PHASE 8 QUICK REFERENCE

## What's New: Analytics System

Simple counters for events and posts. Non-blocking. No dashboards.

---

## 📊 API ENDPOINTS

### Event Analytics
```bash
GET /api/analytics/events/:eventId
Authorization: Bearer {JWT}

# Response
{
  "eventId": "66f...",
  "viewsCount": 150,
  "rsvpCount": 25,
  "updatedAt": "2026-01-05T14:00:00Z"
}
```

### Post Analytics
```bash
GET /api/analytics/posts/:postId
Authorization: Bearer {JWT}

# Response
{
  "postId": "66f...",
  "likesCount": 45,
  "commentsCount": 12,
  "updatedAt": "2026-01-05T14:00:00Z"
}
```

### User Activity Log
```bash
GET /api/analytics/activity?limit=20&skip=0
Authorization: Bearer {JWT}

# Response: Array of activity logs
[
  {
    "_id": "66f...",
    "userId": "66f...",
    "action": "LIKE_POST",
    "referenceId": "66f...",
    "createdAt": "2026-01-05T14:00:00Z"
  }
]
```

---

## 🔄 AUTOMATIC TRACKING

No need to call anything. Automatically tracked:

✅ **Event Views** - Incremented when user views event  
✅ **Event RSVPs** - Incremented when user registers  
✅ **Post Likes** - Incremented when user likes post  
✅ **Post Comments** - Incremented when user comments  
✅ **User Activity** - Logged for all major actions  

---

## 💻 EXAMPLE REQUESTS

### Check Event Views
```bash
curl http://localhost:5000/api/analytics/events/EVENTID \
  -H "Authorization: Bearer YOUR_JWT"
```

### Check Post Engagement
```bash
curl http://localhost:5000/api/analytics/posts/POSTID \
  -H "Authorization: Bearer YOUR_JWT"
```

### Get My Activity
```bash
curl http://localhost:5000/api/analytics/activity \
  -H "Authorization: Bearer YOUR_JWT"
```

---

## 📊 DATA STRUCTURE

### EventAnalytics
```typescript
{
  eventId: ObjectId
  viewsCount: number
  rsvpCount: number
  updatedAt: Date
}
```

### PostAnalytics
```typescript
{
  postId: ObjectId
  likesCount: number
  commentsCount: number
  updatedAt: Date
}
```

### UserActivityLog
```typescript
{
  userId: ObjectId
  action: string
  referenceId: ObjectId (optional)
  createdAt: Date
}
```

---

## 🎯 TRACKED ACTIONS

```
VIEW_EVENT      - Viewing event details
RSVP_EVENT      - Registering for event
CREATE_POST     - Creating new post
LIKE_POST       - Liking a post
COMMENT_POST    - Commenting on post
FOLLOW_USER     - Following a user
LOGIN           - User login
LOGOUT          - User logout
```

---

## ⚡ KEY POINTS

- **Non-blocking:** Analytics updates don't slow down operations
- **Default values:** Returns 0 if no analytics exists
- **Atomic:** Uses MongoDB upsert for concurrency safety
- **Indexed:** Fast queries with proper database indexes
- **JWT Protected:** All endpoints require authentication
- **Read-only:** No delete/modify endpoints
- **Lightweight:** Simple counters, no aggregation

---

## ✅ VERIFICATION

```bash
# Build
npm run build                    # Should succeed

# TypeScript check
npx tsc --noEmit               # Should be 0 errors

# Test event analytics
curl http://localhost:5000/api/analytics/events/ID \
  -H "Authorization: Bearer TOKEN"

# Should return
# {eventId, viewsCount, rsvpCount, updatedAt}
```

---

## 📁 NEW FILES

```
src/modules/analytics/
├── event-analytics.model.ts    - EventAnalytics schema
├── post-analytics.model.ts     - PostAnalytics schema
├── user-activity-log.model.ts  - UserActivityLog schema
├── analytics.service.ts         - All analytics logic
└── analytics.routes.ts          - API endpoints
```

---

## 📝 MODIFIED FILES

```
src/modules/events/event.service.ts
- trackEventView() on GET event
- trackEventRSVP() on registration

src/modules/posts/post.service.ts
- trackPostLike() on like
- trackPostComment() on comment

src/app.ts
- Added /api/analytics routes
```

---

## 🧪 QUICK TEST

### 1. Get Event Analytics
```javascript
fetch('/api/analytics/events/66f1234567890abcdef01234', {
  headers: {'Authorization': 'Bearer TOKEN'}
})
.then(r => r.json())
.then(data => console.log(data))
```

### 2. Get Post Analytics
```javascript
fetch('/api/analytics/posts/66f1234567890abcdef01234', {
  headers: {'Authorization': 'Bearer TOKEN'}
})
.then(r => r.json())
.then(data => console.log(data))
```

### 3. Check Activity Log
```javascript
fetch('/api/analytics/activity?limit=10', {
  headers: {'Authorization': 'Bearer TOKEN'}
})
.then(r => r.json())
.then(data => console.log(data))
```

---

## ✨ HIGHLIGHTS

🎯 Simple - Only 3 schemas + 1 service + 1 routes file  
⚡ Fast - Async tracking doesn't block users  
📊 Complete - Events, posts, and user activities tracked  
🔒 Secure - JWT protected, read-only endpoints  
📈 Scalable - Indexed, atomic operations, no aggregation  

---

## ❌ NOT INCLUDED (By Design)

- No dashboard
- No aggregation pipelines
- No charts
- No admin panel
- No role-based access
- No delete endpoints
- No heavy computations

---

## 🎊 STATUS

**✅ PHASE 8 COMPLETE AND PRODUCTION READY**

Analytics system is lightweight, secure, and efficient.
