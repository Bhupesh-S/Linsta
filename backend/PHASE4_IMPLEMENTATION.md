# Phase 4: Posts & Event Visibility - Implementation Guide

## Overview
Phase 4 implements a complete post system with likes, comments, and event integration for the Linsta backend.

## Database Schemas

### 1. Post Schema
**Collection**: `posts`

```typescript
{
  _id: ObjectId,
  authorId: ObjectId (ref: User) - required,
  eventId: ObjectId (ref: Event) - optional,
  caption: String - required,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{authorId: 1, createdAt: -1}` - Query posts by author
- `{eventId: 1, createdAt: -1}` - Query posts by event
- `{createdAt: -1}` - Query latest posts

### 2. PostMedia Schema
**Collection**: `post_medias`

```typescript
{
  _id: ObjectId,
  postId: ObjectId (ref: Post) - required,
  mediaType: String (enum: "image" | "video") - required,
  mediaUrl: String - required,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{postId: 1}` - Query media for a post

### 3. Like Schema
**Collection**: `likes`

```typescript
{
  _id: ObjectId,
  postId: ObjectId (ref: Post) - required,
  userId: ObjectId (ref: User) - required,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{postId: 1, userId: 1}` - UNIQUE: Prevents duplicate likes
- `{postId: 1}` - Count likes on a post
- `{userId: 1}` - Query user's likes

### 4. Comment Schema
**Collection**: `comments`

```typescript
{
  _id: ObjectId,
  postId: ObjectId (ref: Post) - required,
  userId: ObjectId (ref: User) - required,
  text: String - required,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{postId: 1, createdAt: -1}` - Get comments on a post
- `{userId: 1}` - Query user's comments

## API Endpoints

### 1. Create Post
**Endpoint**: `POST /api/posts`  
**Authentication**: Required (JWT)

**Request Body**:
```json
{
  "caption": "string (required)",
  "eventId": "string (optional)",
  "media": [
    {
      "url": "string",
      "type": "image | video"
    }
  ]
}
```

**Response** (201):
```json
{
  "_id": "string",
  "authorId": "string",
  "eventId": "string (optional)",
  "caption": "string",
  "media": [
    {
      "_id": "string",
      "postId": "string",
      "mediaType": "image | video",
      "mediaUrl": "string"
    }
  ],
  "author": {
    "_id": "string",
    "name": "string",
    "email": "string"
  },
  "event": {
    "_id": "string",
    "title": "string"
  },
  "likeCount": 0,
  "commentCount": 0,
  "userLiked": false,
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```

**Error** (400):
```json
{ "error": "Caption is required" }
```

---

### 2. Get Feed
**Endpoint**: `GET /api/posts`  
**Authentication**: Required (JWT)

**Query Parameters**:
- `limit` (optional): Number of posts (default: 20, max: 100)
- `skip` (optional): Number of posts to skip for pagination (default: 0)

**Response** (200):
```json
[
  {
    "_id": "string",
    "authorId": "string",
    "eventId": "string (optional)",
    "caption": "string",
    "media": [...],
    "author": {...},
    "event": {...},
    "likeCount": 0,
    "commentCount": 0,
    "userLiked": false,
    "createdAt": "ISO timestamp",
    "updatedAt": "ISO timestamp"
  }
]
```

---

### 3. Get Single Post
**Endpoint**: `GET /api/posts/:id`  
**Authentication**: Optional

**Response** (200): Same as Create Post response

**Error** (404):
```json
{ "error": "Post not found" }
```

---

### 4. Delete Post
**Endpoint**: `DELETE /api/posts/:id`  
**Authentication**: Required (JWT)

**Response** (200):
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

**Error Cases**:
- (403): `"Unauthorized: Can only delete own posts"`
- (404): `"Post not found"`

---

### 5. Like Post
**Endpoint**: `POST /api/posts/:id/like`  
**Authentication**: Required (JWT)

**Response** (201):
```json
{
  "success": true,
  "message": "Post liked successfully"
}
```

**Error Cases**:
- (409): `"Post already liked by this user"`
- (404): `"Post not found"`

---

### 6. Unlike Post
**Endpoint**: `DELETE /api/posts/:id/like`  
**Authentication**: Required (JWT)

**Response** (200):
```json
{
  "success": true,
  "message": "Like removed successfully"
}
```

**Error** (404):
```json
{ "error": "Like not found" }
```

---

### 7. Add Comment
**Endpoint**: `POST /api/posts/:id/comment`  
**Authentication**: Required (JWT)

**Request Body**:
```json
{
  "text": "string (required)"
}
```

**Response** (201):
```json
{
  "_id": "string",
  "postId": "string",
  "userId": "string",
  "text": "string",
  "user": {
    "_id": "string",
    "name": "string",
    "email": "string"
  },
  "createdAt": "ISO timestamp"
}
```

**Error Cases**:
- (400): `"Comment text is required"`
- (404): `"Post not found"`

---

### 8. Get Post Comments
**Endpoint**: `GET /api/posts/:id/comments`  
**Authentication**: Optional

**Query Parameters**:
- `limit` (optional): Number of comments (default: 20, max: 100)
- `skip` (optional): Pagination offset (default: 0)

**Response** (200):
```json
[
  {
    "_id": "string",
    "postId": "string",
    "userId": "string",
    "text": "string",
    "user": {
      "_id": "string",
      "name": "string",
      "email": "string"
    },
    "createdAt": "ISO timestamp"
  }
]
```

**Error** (404):
```json
{ "error": "Post not found" }
```

---

### 9. Delete Comment
**Endpoint**: `DELETE /api/posts/:postId/comments/:commentId`  
**Authentication**: Required (JWT)

**Response** (200):
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

**Error Cases**:
- (403): `"Unauthorized: Can only delete own comments"`
- (404): `"Comment not found"`

---

## File Structure

```
src/modules/posts/
├── post.model.ts          # Post schema & interface
├── post-media.model.ts    # PostMedia schema & interface
├── like.model.ts          # Like schema & interface
├── comment.model.ts       # Comment schema & interface
├── post.types.ts          # TypeScript types & request/response interfaces
├── post.service.ts        # Business logic
├── post.controller.ts     # Route handlers
└── post.routes.ts         # Route definitions
```

## Key Features

✅ **Simple Post Creation**: Caption + optional event link + media URLs  
✅ **Media Management**: Store image/video URLs as metadata  
✅ **Like System**: Prevent duplicate likes with unique index  
✅ **Comments**: Full comment CRUD with user info  
✅ **Feed**: Chronological posts with engagement counts  
✅ **Event Visibility**: Posts can be linked to events  
✅ **TypeScript**: Full type safety throughout  
✅ **Service-Controller Pattern**: Clean separation of concerns  
✅ **JWT Auth**: Protected endpoints with middleware  
✅ **Proper Error Handling**: Detailed error messages with appropriate HTTP status codes  

## Usage Examples

### Create a Post with Media
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "caption": "Had an amazing time at the tech meetup!",
    "eventId": "66f1234567890abcdef12345",
    "media": [
      {
        "url": "https://s3.example.com/image1.jpg",
        "type": "image"
      },
      {
        "url": "https://s3.example.com/video1.mp4",
        "type": "video"
      }
    ]
  }'
```

### Get Feed
```bash
curl -X GET "http://localhost:5000/api/posts?limit=10&skip=0" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Like a Post
```bash
curl -X POST http://localhost:5000/api/posts/66f1234567890abcdef12345/like \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Add Comment
```bash
curl -X POST http://localhost:5000/api/posts/66f1234567890abcdef12345/comment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{ "text": "Great post!" }'
```

### Get Comments
```bash
curl -X GET "http://localhost:5000/api/posts/66f1234567890abcdef12345/comments?limit=20&skip=0"
```

---

## Technical Details

### Database Constraints
- **Unique Like**: MongoDB unique index on `{postId, userId}` prevents duplicates
- **Data Integrity**: Foreign keys enforce references to existing users, posts, and events
- **Cascading Delete**: Deleting a post also removes all associated media, likes, and comments

### Performance Optimizations
- **Indexed Queries**: All frequently used filters have database indexes
- **Pagination Support**: Feed and comments support limit/skip for efficient data fetching
- **Aggregated Counts**: Like and comment counts computed on-read for accuracy

### Authentication
- All endpoints (except GET /api/posts/:id and GET /api/posts/:id/comments) require JWT token
- Token verified via Bearer scheme in Authorization header
- User ID extracted from token payload and stored in `req.userId`

## Dependencies
- mongoose: ODM for MongoDB
- express: Web framework (already configured)
- typescript: Type safety
- cors: CORS middleware (already configured)

All models follow the established patterns from Phase 1-3 and integrate seamlessly with existing auth, event, and user modules.
