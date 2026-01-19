# Linsta Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require JWT authentication via the `Authorization` header:
```
Authorization: Bearer <token>
```

---

## AUTH Endpoints

### POST /auth/register
Register a new user
```
Body: {
  name: string,
  email: string,
  password: string
}
Response: { user, token }
```

### POST /auth/login
Login user
```
Body: {
  email: string,
  password: string
}
Response: { user, token }
```

---

## USERS Endpoints

### GET /users/profile
Get authenticated user's profile
```
Response: { user, profile }
```

### GET /users/:id/followers
Get user's followers list
```
Query: ?page=1&limit=20
Response: { data: [], total, page, limit }
```

### GET /users/:id/following
Get user's following list
```
Query: ?page=1&limit=20
Response: { data: [], total, page, limit }
```

### GET /users/:id/follow-counts
Get user's follow statistics
```
Response: { followersCount, followingCount }
```

### POST /users/:id/follow
Follow a user
```
Response: { success, message, data }
```

### DELETE /users/:id/follow
Unfollow a user
```
Response: { success, message }
```

### GET /users/me/saved-posts
Get authenticated user's saved posts
```
Query: ?page=1&limit=20
Response: { data: [], total, page, limit }
```

### GET /users/me/saved-events
Get authenticated user's saved events
```
Query: ?page=1&limit=20
Response: { data: [], total, page, limit }
```

---

## POSTS Endpoints

### POST /posts
Create a new post
```
Body: {
  caption: string,
  eventId?: string,
  media?: array
}
Response: { id, caption, authorId, createdAt }
```

### GET /posts/:id
Get a specific post
```
Response: { id, caption, author, likes, comments }
```

### PUT /posts/:id
Update a post (owner only)
```
Body: { caption }
Response: { success, message }
```

### DELETE /posts/:id
Delete a post (owner only)
```
Response: { success, message }
```

### POST /posts/:id/like
Like a post
```
Response: { success, message }
```

### DELETE /posts/:id/like
Unlike a post
```
Response: { success, message }
```

### POST /posts/:id/comment
Add comment to post
```
Body: { text }
Response: { id, text, authorId, createdAt }
```

### DELETE /posts/:postId/comments/:commentId
Delete a comment
```
Response: { success, message }
```

### POST /posts/:id/save
Save a post
```
Response: { success, message, data }
```

### DELETE /posts/:id/save
Unsave a post
```
Response: { success, message }
```

---

## EVENTS Endpoints

### GET /events
Get all events
```
Query: ?page=1&limit=20
Response: { data: [], total, page, limit }
```

### GET /events/:id
Get a specific event
```
Response: { id, title, description, startDate, endDate, attendees }
```

### POST /events
Create an event
```
Body: {
  title: string,
  description: string,
  startDate: date,
  endDate: date,
  location: string
}
Response: { id, title, description, createdAt }
```

### PUT /events/:id
Update an event (creator only)
```
Body: { title, description, startDate, endDate, location }
Response: { success, message }
```

### DELETE /events/:id
Delete an event (creator only)
```
Response: { success, message }
```

### POST /events/:id/rsvp
RSVP to an event
```
Response: { success, message }
```

### DELETE /events/:id/rsvp
Cancel RSVP
```
Response: { success, message }
```

### GET /events/:id/attendees
Get event attendees
```
Query: ?page=1&limit=20
Response: { data: [], total, page, limit }
```

### POST /events/:id/save
Save an event
```
Response: { success, message, data }
```

### DELETE /events/:id/save
Unsave an event
```
Response: { success, message }
```

---

## FEED Endpoints

### GET /feed
Get personalized feed (posts from followed users & RSVP'd events)
```
Query: ?page=1&limit=20
Response: { data: [], total, page, limit, hasMore }
```

### GET /feed/explore
Get explore feed (all posts for discovery)
```
Query: ?page=1&limit=20
Response: { data: [], total, page, limit, hasMore }
```

---

## STORIES Endpoints

### POST /stories
Create a story
```
Body: {
  content: string,
  media?: array
}
Response: { id, content, authorId, expiresAt }
```

### GET /stories/:id
Get a specific story
```
Response: { id, content, author, views, likes, comments }
```

### DELETE /stories/:id
Delete a story (owner only)
```
Response: { success, message }
```

### POST /stories/:id/view
Record a view for a story
```
Response: { success, message }
```

### POST /stories/:id/like
Like a story
```
Response: { success, message }
```

### DELETE /stories/:id/like
Unlike a story
```
Response: { success, message }
```

---

## REPORTS Endpoints

### POST /reports
Submit a report
```
Body: {
  targetType: "post" | "story" | "comment",
  targetId: string,
  reason: "spam" | "abuse" | "fake" | "other",
  description?: string
}
Response: { success, message, data }
```

### GET /reports/my
Get authenticated user's reports
```
Query: ?page=1&limit=20
Response: { data: [], total, page, limit }
```

### GET /reports/stats
Get report statistics
```
Response: { totalReports, reportsByReason, reportsByType }
```

---

## NOTIFICATIONS Endpoints

### GET /notifications
Get all notifications
```
Query: ?page=1&limit=20
Response: { data: [], total, page, limit }
```

### GET /notifications/unread
Get unread notifications only
```
Query: ?page=1&limit=20
Response: { data: [], total, page, limit }
```

### GET /notifications/unread/count
Get count of unread notifications
```
Response: { unreadCount }
```

### GET /notifications/:id
Get a specific notification
```
Response: { id, userId, actorId, type, message, isRead }
```

### PUT /notifications/:id/read
Mark notification as read
```
Response: { success, message, data }
```

### PUT /notifications/mark-all-read
Mark all notifications as read
```
Response: { success, message, data: { modifiedCount } }
```

### PUT /notifications/mark-multiple-read
Mark multiple notifications as read
```
Body: { notificationIds: string[] }
Response: { success, message, data: { modifiedCount } }
```

### DELETE /notifications/cleanup
Clean old notifications
```
Body: { olderThanDays?: 90 }
Response: { success, message, data: { deletedCount } }
```

---

## Error Responses

All error responses follow this format:
```
{
  success: false,
  error: "Error message",
  timestamp: "2026-01-18T..."
}
```

### Common Status Codes
- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing/invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate resource
- `429 Too Many Requests` - Rate limited
- `500 Internal Server Error` - Server error

---

## Rate Limiting
- Default: 100 requests per 15 minutes per IP
- Headers: `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- Exceeded: `429 Too Many Requests` status

---

## Pagination
All list endpoints support pagination:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

Response includes:
```
{
  data: [],
  total: number,
  page: number,
  limit: number,
  hasMore: boolean
}
```
