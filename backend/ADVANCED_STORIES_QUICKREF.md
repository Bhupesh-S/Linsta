# Advanced Stories - Quick Reference

## API Endpoints (All require JWT Authentication)

### Basic Story Management (Existing)
```
POST   /api/stories                        Create story (24h TTL)
GET    /api/stories                        All active stories (grouped by user)
GET    /api/stories/user/:userId           Stories for specific user
```

### NEW: Engagement Tracking

#### Views
```
POST   /api/stories/:id/view               Mark story as viewed
  Response: { success, message, data: { viewsCount } }
```

#### Likes
```
POST   /api/stories/:id/like               Like a story
  Response: { success, message, data: { likesCount } }
  
DELETE /api/stories/:id/like               Unlike a story
  Response: { success, message, data: { likesCount } }
```

#### Comments
```
POST   /api/stories/:id/comment            Add comment
  Body: { text: string }
  Response: { success, message, data: StoryCommentResponse }
  
GET    /api/stories/:id/comments           Get comments (paginated)
  Query: ?limit=20&skip=0
  Response: { success, message, data: { comments, total, hasMore } }
  
DELETE /api/stories/comment/:commentId     Delete comment (author only)
  Response: { success, message }
```

#### Viewers
```
GET    /api/stories/:id/viewers            Get story viewers list
  Response: { success, message, data: { viewers, total } }
```

## Data Models

### Story Schema (Updated)
```typescript
{
  userId: ObjectId,
  mediaType: "image" | "video",
  mediaUrl: string,
  caption?: string,
  viewsCount: number,        // NEW
  likesCount: number,         // NEW
  commentsCount: number,      // NEW
  expiresAt: Date,           // 24h from creation
  createdAt: Date
}
```

### StoryView (New)
```typescript
{
  storyId: ObjectId,
  userId: ObjectId,
  seenAt: Date
}
// Unique: (storyId, userId) - one view per user per story
```

### StoryLike (New)
```typescript
{
  storyId: ObjectId,
  userId: ObjectId,
  createdAt: Date
}
// Unique: (storyId, userId) - one like per user per story
```

### StoryComment (New)
```typescript
{
  storyId: ObjectId,
  userId: ObjectId,
  text: string,           // Max 300 chars
  createdAt: Date
}
// Multiple comments per user allowed
```

## Error Responses

| Code | Error | Cause |
|------|-------|-------|
| 400 | MISSING_COMMENT | Comment text missing/invalid |
| 401 | Unauthorized | Missing/invalid JWT token |
| 403 | CANNOT_DELETE_COMMENT | Not comment author |
| 404 | NOT_FOUND | Story doesn't exist |
| 404 | NOT_LIKED | Haven't liked this story |
| 404 | COMMENT_NOT_FOUND | Comment doesn't exist |
| 409 | ALREADY_LIKED | Already liked this story |
| 409 | ALREADY_VIEWED | Already viewed this story |
| 410 | EXPIRED | Story has expired (24h old) |

## Notifications Triggered

| Action | Type | Message |
|--------|------|---------|
| View | STORY_VIEW | "{Name} viewed your story" |
| Like | STORY_LIKE | "{Name} liked your story" |
| Comment | STORY_COMMENT | "{Name} commented on your story" |

**Important:** No notifications for user's own actions

## Testing Examples

### Using cURL

#### Mark story as viewed
```bash
curl -X POST http://localhost:5000/api/stories/:id/view \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

#### Like a story
```bash
curl -X POST http://localhost:5000/api/stories/:id/like \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Add comment
```bash
curl -X POST http://localhost:5000/api/stories/:id/comment \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"Amazing story!"}'
```

#### Get comments (paginated)
```bash
curl -X GET "http://localhost:5000/api/stories/:id/comments?limit=10&skip=0" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get viewers list
```bash
curl -X GET http://localhost:5000/api/stories/:id/viewers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Key Features

✅ **Duplicate Prevention** - DB-level unique indexes prevent duplicate views/likes
✅ **Auto-Expiration** - TTL index + query-level checks ensure 24h lifecycle
✅ **Atomic Counts** - Counters updated atomically with engagement operations
✅ **Paginated Results** - Comments support limit/skip pagination
✅ **Notifications** - Integrated with existing notification service
✅ **Authorization** - Proper permission checks for delete operations
✅ **Type Safety** - Full TypeScript interfaces for all responses

## Story Lifecycle

1. **Creation** - Story created with 24h expiration (expiresAt = now + 24h)
2. **Active Period** - Views, likes, comments allowed (viewsCount increments, etc.)
3. **Engagement** - Each view/like/comment tracked and counted
4. **Notifications** - Actor notified on view/like/comment (except self)
5. **Expiration** - Story returns HTTP 410 after 24h
6. **Cleanup** - TTL index automatically removes expired document

## Common Scenarios

### Get engagement stats for a story
```bash
# Get story with counts
GET /api/stories (returns viewsCount, likesCount, commentsCount)

# Get viewers
GET /api/stories/:id/viewers

# Get comments
GET /api/stories/:id/comments
```

### Like a story and check count
```bash
# Like it
POST /api/stories/:id/like
# Response includes new likesCount

# Check later
GET /api/stories (includes current likesCount)
```

### Read comments on a story
```bash
# Get first 20
GET /api/stories/:id/comments?limit=20&skip=0

# Get next 20
GET /api/stories/:id/comments?limit=20&skip=20

# Response includes hasMore flag
```

## Database Indexes

```javascript
// StoryView
db.story_views.createIndex({ storyId: 1, userId: 1 }, { unique: true })
db.story_views.createIndex({ storyId: 1, seenAt: -1 })

// StoryLike
db.story_likes.createIndex({ storyId: 1, userId: 1 }, { unique: true })
db.story_likes.createIndex({ storyId: 1, createdAt: -1 })

// StoryComment
db.story_comments.createIndex({ storyId: 1 })
db.story_comments.createIndex({ userId: 1, createdAt: -1 })

// Story (existing)
db.stories.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
db.stories.createIndex({ userId: 1, createdAt: -1 })
```

## Implementation Files

**New Models:**
- `src/modules/stories/storyView.model.ts`
- `src/modules/stories/storyLike.model.ts`
- `src/modules/stories/storyComment.model.ts`

**Modified:**
- `src/modules/stories/story.model.ts`
- `src/modules/stories/story.service.ts`
- `src/modules/stories/story.controller.ts`
- `src/modules/stories/story.routes.ts`
- `src/modules/stories/story.errors.ts`
- `src/modules/stories/story.validators.ts`
- `src/modules/stories/story.types.ts`
