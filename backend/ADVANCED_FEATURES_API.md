# Advanced Features API Documentation

This document covers the 5 new advanced features added to Linsta backend.

## Table of Contents
1. [Close Friends Feature](#close-friends-feature)
2. [Story Highlights](#story-highlights)
3. [Post Sharing](#post-sharing)
4. [Extended Comments (Threaded)](#extended-comments-threaded)
5. [@Mentions System](#mentions-system)

---

## Close Friends Feature

Allow users to manage their close friends list and restrict story visibility to close friends only.

### Endpoints

#### Add Close Friend
```
POST /api/users/:friendId/close-friends
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Close friend added successfully",
  "data": {
    "_id": "...",
    "userId": "...",
    "friendId": "...",
    "createdAt": "2026-01-26T..."
  }
}
```

**Error Cases:**
- 400: Cannot add yourself as close friend
- 409: User already in close friends list

---

#### Remove Close Friend
```
DELETE /api/users/:friendId/close-friends
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Close friend removed successfully"
}
```

---

#### Get Close Friends List
```
GET /api/users/:userId/close-friends?limit=100&skip=0
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "friendId": {
        "_id": "...",
        "username": "john_doe",
        "profilePicture": "url..."
      },
      "createdAt": "2026-01-26T..."
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 100,
    "skip": 0,
    "hasMore": false
  }
}
```

---

## Story Highlights

Archive expired stories into reusable highlights displayed on user profile.

### Endpoints

#### Create Highlight
```
POST /api/stories/highlights
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Summer 2025"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Highlight created successfully",
  "data": {
    "_id": "...",
    "userId": "...",
    "title": "Summer 2025",
    "stories": [],
    "createdAt": "2026-01-26T..."
  }
}
```

---

#### Add Story to Highlight
```
POST /api/stories/highlights/stories
Authorization: Bearer <token>
Content-Type: application/json

{
  "highlightId": "...",
  "storyId": "..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Story added to highlight successfully",
  "data": {
    "_id": "...",
    "userId": "...",
    "title": "Summer 2025",
    "stories": ["storyId1", "storyId2"],
    "coverImageUrl": "url...",
    "createdAt": "2026-01-26T..."
  }
}
```

**Error Cases:**
- 404: Highlight not found or Story not found
- 409: Story already in highlight

---

#### Remove Story from Highlight
```
DELETE /api/stories/highlights/:highlightId/stories/:storyId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Story removed from highlight successfully"
}
```

---

#### Get User's Highlights
```
GET /api/stories/highlights/:userId?limit=100&skip=0
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "userId": "...",
      "title": "Summer 2025",
      "coverImageUrl": "url...",
      "stories": [
        {
          "_id": "...",
          "mediaUrl": "url...",
          "caption": "Beach day!"
        }
      ],
      "createdAt": "2026-01-26T..."
    }
  ],
  "pagination": {
    "total": 5,
    "limit": 100,
    "skip": 0,
    "hasMore": false
  }
}
```

---

#### Get Specific Highlight
```
GET /api/stories/highlights/details/:highlightId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "userId": "...",
    "title": "Summer 2025",
    "coverImageUrl": "url...",
    "stories": [
      {
        "_id": "...",
        "mediaUrl": "url...",
        "caption": "Beach day!",
        "mediaType": "image"
      }
    ],
    "createdAt": "2026-01-26T..."
  }
}
```

---

#### Update Highlight
```
PUT /api/stories/highlights/:highlightId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "coverImageUrl": "new_url..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Highlight updated successfully",
  "data": {
    "_id": "...",
    "title": "Updated Title",
    "coverImageUrl": "new_url...",
    "stories": ["..."],
    "createdAt": "2026-01-26T..."
  }
}
```

---

#### Delete Highlight
```
DELETE /api/stories/highlights/:highlightId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Highlight deleted successfully"
}
```

---

## Post Sharing

Share posts with specific users, triggering notifications.

### Endpoints

#### Share Post
```
POST /api/posts/share
Authorization: Bearer <token>
Content-Type: application/json

{
  "receiverId": "...",
  "postId": "...",
  "message": "Check this out!" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Post shared successfully",
  "data": {
    "_id": "...",
    "postId": "...",
    "senderId": "...",
    "receiverId": "...",
    "message": "Check this out!",
    "createdAt": "2026-01-26T..."
  }
}
```

**Trigger:**
- Notification sent to receiver with type: "post_share"

**Error Cases:**
- 400: Cannot share with yourself
- 404: Post not found

---

#### Get Shared Posts (Received)
```
GET /api/posts/shared?limit=100&skip=0
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "postId": {
        "_id": "...",
        "caption": "Amazing sunset!",
        "mediaUrl": "url...",
        "likesCount": 45,
        "commentsCount": 12
      },
      "senderId": {
        "_id": "...",
        "username": "john_doe",
        "profilePicture": "url..."
      },
      "message": "Check this out!",
      "createdAt": "2026-01-26T..."
    }
  ],
  "pagination": {
    "total": 10,
    "limit": 100,
    "skip": 0,
    "hasMore": false
  }
}
```

---

#### Get Sent Shares
```
GET /api/posts/shares-sent?limit=100&skip=0
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "postId": {
        "_id": "...",
        "caption": "Amazing sunset!",
        "mediaUrl": "url..."
      },
      "receiverId": {
        "_id": "...",
        "username": "jane_doe",
        "profilePicture": "url..."
      },
      "message": "Check this out!",
      "createdAt": "2026-01-26T..."
    }
  ],
  "pagination": {
    "total": 8,
    "limit": 100,
    "skip": 0,
    "hasMore": false
  }
}
```

---

## Extended Comments (Threaded)

Support nested comment replies with mention parsing.

### Endpoints

#### Create Reply
```
POST /api/posts/:postId/comments/:parentCommentId/reply
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Great point @john_doe!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reply created successfully",
  "data": {
    "_id": "...",
    "postId": "...",
    "userId": "...",
    "text": "Great point @john_doe!",
    "mentions": ["userId1"],
    "parentCommentId": "...",
    "createdAt": "2026-01-26T..."
  }
}
```

**Trigger:**
- Mention notification sent to @john_doe
- Reply notification sent to parent comment author

**Error Cases:**
- 404: Parent comment not found

---

#### Get Threaded Comments
```
GET /api/posts/:postId/comments/threaded?limit=100&skip=0
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "postId": "...",
      "userId": {
        "_id": "...",
        "username": "john_doe",
        "profilePicture": "url..."
      },
      "text": "This is amazing!",
      "mentions": [],
      "createdAt": "2026-01-26T...",
      "replies": [
        {
          "_id": "...",
          "userId": {
            "_id": "...",
            "username": "jane_doe",
            "profilePicture": "url..."
          },
          "text": "I agree @john_doe!",
          "mentions": [
            {
              "_id": "...",
              "username": "john_doe"
            }
          ],
          "createdAt": "2026-01-26T..."
        }
      ],
      "replyCount": 1
    }
  ],
  "pagination": {
    "total": 5,
    "limit": 100,
    "skip": 0,
    "hasMore": false
  }
}
```

---

#### Get Replies to Comment
```
GET /api/posts/comments/:commentId/replies?limit=100&skip=0
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "userId": {
        "_id": "...",
        "username": "jane_doe",
        "profilePicture": "url..."
      },
      "text": "I agree @john_doe!",
      "mentions": [
        {
          "_id": "...",
          "username": "john_doe"
        }
      ],
      "createdAt": "2026-01-26T..."
    }
  ],
  "pagination": {
    "total": 2,
    "limit": 100,
    "skip": 0,
    "hasMore": false
  }
}
```

---

#### Update Comment
```
PUT /api/posts/comments/:commentId
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Updated comment with @mention"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Comment updated successfully",
  "data": {
    "_id": "...",
    "postId": "...",
    "userId": "...",
    "text": "Updated comment with @mention",
    "mentions": ["userId1"],
    "parentCommentId": null,
    "createdAt": "2026-01-26T..."
  }
}
```

**Trigger:**
- Mention notification sent to newly mentioned users

---

## @Mentions System

Automatically parse and resolve @mentions in posts and comments.

### Features

#### Mention Detection
- Pattern: `@username` (alphanumeric and underscores)
- Resolved from User collection
- Works in posts, comments, and replies
- Triggers notifications

#### Mention Notification
When a user is mentioned:
1. Username is resolved to User ID
2. Notification created with type: "mention"
3. Contains reference to post/comment
4. Includes context preview

#### Example

**Creating a post with mentions:**
```
POST /api/posts
Authorization: Bearer <token>

{
  "caption": "Check out @john_doe and @jane_smith work together!"
}
```

**Parsing Result:**
- Detects: `@john_doe`, `@jane_smith`
- Resolves usernames to IDs
- Stores mention IDs in post.mentions array
- Notifications sent to both users

#### Mention Response Format
```json
{
  "success": true,
  "message": "Post created",
  "data": {
    "_id": "...",
    "authorId": "...",
    "caption": "Check out @john_doe and @jane_smith work together!",
    "mentions": [
      "johnDoeUserId",
      "janeSmithUserId"
    ],
    "createdAt": "2026-01-26T..."
  }
}
```

#### Mention Notification
```json
{
  "_id": "...",
  "recipientId": "johnDoeUserId",
  "senderId": "currentUserId",
  "type": "mention",
  "content": "@currentUsername mentioned you in a post",
  "relatedId": "postId",
  "relatedType": "post",
  "createdAt": "2026-01-26T..."
}
```

---

## Story Visibility with Close Friends

### Feature Details

Stories now support visibility levels:
```
visibility: "public" | "close_friends"
```

### Viewing Logic

**Fetching Stories:**
```typescript
// Public story: visible to all followers
if (story.visibility === "public") {
  return story; // Show to all
}

// Close friends story: visible only to close friends
if (story.visibility === "close_friends") {
  const isCloseFriend = await CloseFriend.findOne({
    userId: storyOwnerId,
    friendId: viewerId
  });
  if (isCloseFriend) {
    return story;
  }
}
```

---

## Error Handling

### Common Status Codes

| Code | Scenario |
|------|----------|
| 201 | Resource created successfully |
| 200 | Request succeeded |
| 400 | Invalid request (missing fields, self-action) |
| 401 | Unauthorized (missing/invalid token) |
| 404 | Resource not found |
| 409 | Conflict (duplicate, already exists) |
| 429 | Too many requests (rate limit) |
| 500 | Server error |

---

## Rate Limiting

All endpoints subject to rate limiting:
- **Default:** 100 requests per 15 minutes per IP
- **Response:** 429 status with `Retry-After` header
- **Headers:** `X-RateLimit-*` included

---

## Pagination

List endpoints support pagination:
```
GET /endpoint?limit=50&skip=0
```

**Limits:**
- Max `limit`: 100
- Default `limit`: 100
- Default `skip`: 0

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 150,
    "limit": 50,
    "skip": 0,
    "hasMore": true
  }
}
```

---

## Testing

### Sample Requests

**Add close friend:**
```bash
curl -X POST http://localhost:5000/api/users/userId123/close-friends \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json"
```

**Share a post:**
```bash
curl -X POST http://localhost:5000/api/posts/share \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{
    "receiverId": "userId456",
    "postId": "postId789",
    "message": "Check this out!"
  }'
```

**Get threaded comments:**
```bash
curl http://localhost:5000/api/posts/postId789/comments/threaded \
  -H "Authorization: Bearer token"
```

---

## Database Collections

### New Collections

1. **close_friends**
   - Fields: userId, friendId, createdAt
   - Indexes: (userId, friendId) unique

2. **story_highlights**
   - Fields: userId, title, coverImageUrl, stories[], timestamps
   - Indexes: (userId) for fetching user highlights

3. **post_shares**
   - Fields: postId, senderId, receiverId, message, createdAt
   - Indexes: (receiverId), (senderId), (postId)

### Updated Collections

1. **stories**
   - Added: visibility field ("public" | "close_friends")

2. **posts**
   - Added: mentions array (User IDs)

3. **comments**
   - Added: parentCommentId (optional, for replies)
   - Added: mentions array (User IDs)

---

## Summary

**5 New Features:**
- ✅ Close Friends (manage private story visibility)
- ✅ Story Highlights (archive and organize stories)
- ✅ Post Sharing (share with mentions and notifications)
- ✅ Extended Comments (threaded discussions)
- ✅ @Mentions (auto-detect and notify)

**Total New Endpoints:** 23
**Total Updated Models:** 3
**New Collections:** 3

All features follow existing patterns and integrate seamlessly with current notification system.
