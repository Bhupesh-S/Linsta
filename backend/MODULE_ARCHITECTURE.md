# Module Architecture Reference

## Project Structure Overview

```
linsta-backend/
│
├── src/
│   ├── modules/
│   │   ├── analytics/          - Event & post analytics
│   │   ├── auth/               - JWT authentication (login, register)
│   │   ├── chat/               - Real-time chat messaging
│   │   ├── events/             - Event CRUD & RSVP
│   │   ├── feed/              - **NEW** Personalized & explore feeds
│   │   ├── follows/            - **NEW** Follow system
│   │   ├── notifications/      - Real-time notifications
│   │   ├── posts/              - Posts with comments/likes
│   │   ├── reports/            - **NEW** Report & moderation
│   │   ├── saved/              - **NEW** Save/bookmark feature
│   │   ├── stories/            - Stories with TTL
│   │   └── users/              - User profiles & auth
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts           - JWT verification
│   │   ├── errorHandler.middleware.ts   - Global error handling
│   │   ├── requestLogger.middleware.ts  - Request logging
│   │   └── rateLimit.middleware.ts      - **NEW** Rate limiting
│   │
│   ├── routes/
│   │   └── health.routes.ts    - **ENHANCED** Health check
│   │
│   ├── config/
│   │   ├── config.ts           - Environment configuration
│   │   └── db.ts               - MongoDB connection
│   │
│   ├── utils/
│   │   ├── appError.ts
│   │   ├── asyncHandler.ts
│   │   └── response.ts         - **NEW** Response utilities
│   │
│   ├── app.ts                  - **UPDATED** Express app setup
│   └── server.ts               - Server bootstrap
│
├── .env.example                - **NEW** Environment template
├── API_DOCUMENTATION.md        - **NEW** Complete API reference
├── IMPLEMENTATION_COMPLETE.md  - **NEW** Implementation summary
├── QUICK_START.md              - **NEW** Getting started guide
├── package.json
├── tsconfig.json
└── README.md
```

---

## Module Details

### 🔐 Auth Module
**Files:** `src/modules/auth/`
**Purpose:** User authentication & authorization
**Exports:** Login, Register
**Uses:** JWT tokens

### 👤 Users Module
**Files:** `src/modules/users/`
**Purpose:** User profiles & management
**Endpoints:**
- GET /profile - User's own profile
- GET /:id/followers - User's followers
- GET /:id/following - User's following
- GET /:id/follow-counts - Follow statistics
- POST /:id/follow - Follow user
- DELETE /:id/follow - Unfollow user
- GET /me/saved-posts - Saved posts
- GET /me/saved-events - Saved events

### 📱 Posts Module
**Files:** `src/modules/posts/`
**Purpose:** Post management with engagement
**Models:** Post, Like, Comment, PostMedia
**Features:**
- Create/Read/Update/Delete posts
- Like/Unlike posts
- Comment on posts
- Save/Unsave posts (**NEW**)
- Full-text search on captions

### 🎪 Events Module
**Files:** `src/modules/events/`
**Purpose:** Event management
**Features:**
- Create/Read/Update/Delete events
- RSVP management
- Attendee lists
- Save/Unsave events (**NEW**)

### 📖 Stories Module
**Files:** `src/modules/stories/`
**Purpose:** Ephemeral stories (24h TTL)
**Features:**
- Create stories
- View tracking
- Like/Comment stories

### 💬 Chat Module
**Files:** `src/modules/chat/`
**Purpose:** Real-time messaging
**Technology:** Socket.IO

### 🔔 Notifications Module
**Files:** `src/modules/notifications/`
**Purpose:** Event notifications
**Features:**
- Create notifications
- Mark as read
- Get unread count
- Bulk operations
- Auto-cleanup (90 days)

### 📊 Analytics Module
**Files:** `src/modules/analytics/`
**Purpose:** Tracking user activity
**Features:**
- Track post engagement
- Track event analytics
- User activity log

### ✅ **NEW** Saved Module
**Files:** `src/modules/saved/`
**Purpose:** Save/bookmark feature
**Collections:** SavedPost, SavedEvent
**Endpoints:**
- POST /posts/:id/save - Save post
- DELETE /posts/:id/save - Unsave post
- POST /events/:id/save - Save event
- DELETE /events/:id/save - Unsave event
- GET /users/me/saved-posts - Get saved posts
- GET /users/me/saved-events - Get saved events

### ✅ **NEW** Follows Module
**Files:** `src/modules/follows/`
**Purpose:** Follow/unfollow system
**Collection:** Follow
**Features:**
- Follow users
- Prevent self-follow
- Prevent duplicates
- Get followers with counts
- Get following with counts
**Endpoints:**
- POST /users/:id/follow - Follow
- DELETE /users/:id/follow - Unfollow
- GET /users/:id/followers - Get followers
- GET /users/:id/following - Get following
- GET /users/:id/follow-counts - Get counts

### ✅ **NEW** Feed Module
**Files:** `src/modules/feed/`
**Purpose:** Smart feed generation
**Features:**
- Personalized feed from followed users
- Explore feed for discovery
- Posts from RSVP'd events
- Engagement metrics
**Endpoints:**
- GET /feed - Personalized feed
- GET /feed/explore - Explore feed

### ✅ **NEW** Reports Module
**Files:** `src/modules/reports/`
**Purpose:** Content reporting & moderation
**Collection:** Report
**Features:**
- Report posts, stories, comments
- Prevent duplicate reports
- Track report statistics
**Endpoints:**
- POST /reports - Submit report
- GET /reports/my - User's reports
- GET /reports/stats - Statistics

---

## Data Flow Examples

### Follow User Flow
```
1. User clicks follow
2. POST /api/users/:id/follow
3. Auth middleware validates token
4. FollowController.followUser()
5. FollowService.followUser()
6. Create Follow document
7. Return success (201) or error
   - 400: Self-follow attempt
   - 409: Already following
   - 404: Target user not found
```

### Save Post Flow
```
1. User saves post
2. POST /api/posts/:id/save
3. Auth middleware validates token
4. SavedController.savePost()
5. SavedService.savePost()
6. Create SavedPost document
7. Return success (201) or error
   - 409: Already saved
   - 404: Post not found
```

### Get Feed Flow
```
1. User requests feed
2. GET /api/feed?page=1&limit=20
3. Auth middleware validates token
4. FeedController.getFeed()
5. FeedService.getFeed()
6. Query Follow collection for following list
7. Query Post collection where author in following
8. Query Event collection for RSVP'd events
9. Query posts where eventId in RSVP'd events
10. Combine results, sort by date, paginate
11. Return paginated posts with engagement metrics
```

---

## Common Patterns Used

### 1. Service Pattern
```typescript
// Service handles business logic
export class UserService {
  static async followUser(userId, targetId) {
    // Validation
    // Database operations
    // Error handling
  }
}
```

### 2. Controller Pattern
```typescript
// Controller handles HTTP requests
export class UserController {
  static async follow(req: Request, res: Response) {
    try {
      const result = await UserService.followUser(...)
      res.status(201).json(result)
    } catch (error) {
      res.status(error.statusCode).json({ error })
    }
  }
}
```

### 3. Type Safety
```typescript
// Separate types file for interfaces
export interface FollowResponse {
  _id: string
  followerId: string
  followingId: string
  createdAt: string
}
```

### 4. Error Handling
```typescript
// Throw with statusCode for HTTP response
throw {
  statusCode: 409,
  message: "You are already following this user"
}
```

### 5. Pagination
```typescript
// Consistent pagination across all list endpoints
const skip = (page - 1) * limit
const [data, total] = await Promise.all([
  Model.find(...).skip(skip).limit(limit),
  Model.countDocuments(...)
])
```

---

## API Response Format

### Standard Success
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2026-01-18T10:30:00Z"
}
```

### Standard Error
```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2026-01-18T10:30:00Z"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8,
    "hasMore": true
  },
  "timestamp": "2026-01-18T10:30:00Z"
}
```

---

## Authentication Flow

```
1. User submits credentials
2. POST /api/auth/login
3. Hash password, verify against database
4. Generate JWT token
5. Return token to client
6. Client stores token (localStorage/sessionStorage)
7. Client sends token in Authorization header
8. authMiddleware verifies token
9. Extract userId from token payload
10. Attach to req.user
```

---

## Rate Limiting

**Default:** 100 requests per 15 minutes per IP
**Behavior:**
- Tracks by IP address
- In-memory store (can use Redis in production)
- Auto-cleanup of old entries
- Returns 429 when exceeded

**Headers:**
- X-RateLimit-Remaining
- X-RateLimit-Reset

---

## Database Indexes Summary

**Critical Indexes:**
- Users: email (unique), createdAt
- Posts: authorId + createdAt, eventId + createdAt
- Events: createdAt, attendees
- Follows: (followerId, followingId) unique, (followerId, createdAt), (followingId, createdAt)
- SavedPost: (userId, postId) unique, (userId, createdAt)
- SavedEvent: (userId, eventId) unique, (userId, createdAt)
- Reports: (reporterId, targetType, targetId) unique

---

## Deployment Checklist

- [ ] Copy `.env.example` to `.env`
- [ ] Fill in production values
- [ ] Run `npm run build`
- [ ] Verify no TypeScript errors
- [ ] Test with MongoDB connection string
- [ ] Set NODE_ENV=production
- [ ] Configure CORS_ORIGIN
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Test all endpoints
- [ ] Load test rate limiting
- [ ] Monitor error logs

---

## Useful SQL Queries (MongoDB)

```javascript
// Find all followers of a user
db.follows.find({ followingId: ObjectId("...") })

// Find all users that a user follows
db.follows.find({ followerId: ObjectId("...") })

// Find all saved posts by user
db.savedposts.find({ userId: ObjectId("...") }).populate("postId")

// Get report statistics
db.reports.aggregate([
  { $group: { _id: "$reason", count: { $sum: 1 } } }
])

// Find duplicate reports (debug)
db.reports.aggregate([
  { $group: { _id: "$targetId", count: { $sum: 1 } } },
  { $match: { count: { $gt: 1 } } }
])
```

---

**Last Updated:** January 18, 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
