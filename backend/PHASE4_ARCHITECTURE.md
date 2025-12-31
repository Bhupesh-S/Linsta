# PHASE 4: Posts & Event Visibility - Architecture Overview

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    EXPRESS APP (app.ts)                      │
├─────────────────────────────────────────────────────────────┤
│  Middleware Stack:                                            │
│  ├─ express.json()                                           │
│  ├─ cors()                                                   │
│  └─ authMiddleware (selective)                              │
├─────────────────────────────────────────────────────────────┤
│  Route Handlers:                                             │
│  ├─ /api/posts ..................... Post Routes            │
│  ├─ /api/auth ....................... Auth Routes           │
│  ├─ /api/users ...................... User Routes           │
│  └─ /api/events ..................... Event Routes          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Posts Module Architecture

```
┌──────────────────────────────────────────────────────────────┐
│              POST ROUTES (post.routes.ts)                    │
├──────────────────────────────────────────────────────────────┤
│  POST   /api/posts              → createPost()              │
│  GET    /api/posts              → getFeed() [Auth]          │
│  GET    /api/posts/:id          → getPost()                 │
│  DELETE /api/posts/:id          → deletePost() [Auth]       │
│  POST   /api/posts/:id/like     → likePost() [Auth]         │
│  DELETE /api/posts/:id/like     → unlikePost() [Auth]       │
│  POST   /api/posts/:id/comment  → addComment() [Auth]       │
│  GET    /api/posts/:id/comments → getComments()             │
│  DELETE .../comments/:commentId → deleteComment() [Auth]    │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│          CONTROLLERS (post.controller.ts)                    │
├──────────────────────────────────────────────────────────────┤
│  • Input Validation                                          │
│  • Authentication/Authorization Checks                       │
│  • Call Service Methods                                      │
│  • Format HTTP Responses                                     │
│  • Error Handling                                            │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│            SERVICE LAYER (post.service.ts)                   │
├──────────────────────────────────────────────────────────────┤
│  POST Operations:          LIKE Operations:                  │
│  ├─ createPost()          ├─ likePost()                     │
│  ├─ getFeed()             └─ unlikePost()                   │
│  ├─ getPostById()                                           │
│  └─ deletePost()         COMMENT Operations:                │
│                          ├─ addComment()                    │
│                          ├─ getComments()                   │
│                          └─ deleteComment()                 │
│                                                              │
│  Features:                                                   │
│  • Business Logic                                           │
│  • Data Validation                                          │
│  • Error Handling                                           │
│  • Type Safety                                              │
│  • Cascading Delete                                         │
│  • Duplicate Prevention                                     │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│           MONGOOSE MODELS & SCHEMAS                          │
├──────────────────────────────────────────────────────────────┤
│  ┌────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ Post Schema    │  │ PostMedia Schema│  │ Like Schema  │ │
│  ├────────────────┤  ├─────────────────┤  ├──────────────┤ │
│  │ _id (OId)      │  │ _id (OId)       │  │ _id (OId)    │ │
│  │ authorId (ref) │  │ postId (ref)    │  │ postId (ref) │ │
│  │ eventId (ref)* │  │ mediaType       │  │ userId (ref) │ │
│  │ caption        │  │ mediaUrl        │  │ createdAt    │ │
│  │ createdAt      │  │ createdAt       │  │ updatedAt    │ │
│  │ updatedAt      │  │ updatedAt       │  └──────────────┘ │
│  └────────────────┘  └─────────────────┘  * UNIQUE INDEX   │
│         ▲                     ▲             {postId, userId}│
│         │                     │                             │
│  ┌──────┴─────────────────────┴───────────────────────────┐ │
│  │                  Comment Schema                        │ │
│  ├──────────────────────────────────────────────────────┤ │
│  │ _id (OId)         postId (ref)    userId (ref)       │ │
│  │ text              createdAt       updatedAt          │ │
│  └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│                  MONGODB COLLECTIONS                         │
├──────────────────────────────────────────────────────────────┤
│  posts          post_medias         likes            comments│
│  ────────       ────────────        ─────            ────────│
│  [Post docs]    [Media metadata]    [Like pairs]     [Comments]
└──────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagrams

### CREATE POST FLOW
```
User Input
    │
    ▼
POST /api/posts
    │
    ├─► authMiddleware
    │   └─► Verify JWT Token
    │       └─► Extract userId
    │
    ▼
PostController.createPost()
    │
    ├─► Validate caption exists
    ├─► Validate authentication
    │
    ▼
PostService.createPost()
    │
    ├─► Create Post document
    │   └─► Save to posts collection
    │
    ├─► Create PostMedia documents (if media exists)
    │   └─► Save to post_medias collection
    │
    ├─► Get Post with relations
    │   └─► Populate author & event info
    │
    ▼
Response (201)
{
  _id, authorId, caption, media[], author{}, 
  event{}, likeCount: 0, commentCount: 0
}
```

### GET FEED FLOW
```
GET /api/posts?limit=20&skip=0
    │
    ├─► authMiddleware
    │   └─► Verify JWT Token
    │
    ▼
PostController.getFeed()
    │
    ├─► Extract limit, skip
    ├─► Validate limit <= 100
    │
    ▼
PostService.getFeed(userId, limit, skip)
    │
    ├─► Query posts collection
    │   └─► Sort by createdAt desc
    │   └─► Limit & skip
    │
    ├─► For each post:
    │   ├─► Populate author info
    │   ├─► Populate event info (if exists)
    │   ├─► Count likes
    │   ├─► Count comments
    │   ├─► Check if user liked post
    │   └─► Fetch media URLs
    │
    ▼
Response (200)
[
  {_id, caption, author{}, event{}, likeCount, 
   commentCount, userLiked, media[], ...},
  ...
]
```

### LIKE/UNLIKE FLOW
```
POST /api/posts/:id/like
    │
    ├─► authMiddleware
    │   └─► Verify JWT Token
    │
    ▼
PostController.likePost()
    │
    ├─► Validate post ID
    ├─► Validate authentication
    │
    ▼
PostService.likePost(postId, userId)
    │
    ├─► Verify post exists
    │
    ├─► Check if like already exists
    │   └─► If exists: throw error (409)
    │
    ├─► Create Like document
    │   └─► postId + userId pair
    │   └─► MongoDB UNIQUE INDEX prevents duplicates
    │
    ▼
Response (201)
{"success": true, "message": "Post liked"}


DELETE /api/posts/:id/like
    │
    ├─► authMiddleware
    │
    ▼
PostController.unlikePost()
    │
    ▼
PostService.unlikePost(postId, userId)
    │
    ├─► Find and delete Like document
    │   └─► Match {postId, userId}
    │
    ├─► If not found: throw error (404)
    │
    ▼
Response (200)
{"success": true, "message": "Like removed"}
```

### COMMENT FLOW
```
POST /api/posts/:id/comment
    │
    ├─► authMiddleware
    │
    ▼
PostController.addComment()
    │
    ├─► Validate text exists
    ├─► Validate authentication
    │
    ▼
PostService.addComment(postId, userId, text)
    │
    ├─► Verify post exists
    │
    ├─► Create Comment document
    │   └─► postId, userId, text
    │
    ├─► Populate user info
    │
    ▼
Response (201)
{_id, postId, userId, text, user{name, email}, createdAt}


GET /api/posts/:id/comments?limit=20&skip=0
    │
    ▼
PostController.getComments()
    │
    ├─► Extract limit, skip
    ├─► Validate post exists
    │
    ▼
PostService.getComments(postId, limit, skip)
    │
    ├─► Query comments by postId
    │   └─► Sort by createdAt desc
    │   └─► Limit & skip
    │
    ├─► Populate user info for each
    │
    ▼
Response (200)
[
  {_id, postId, userId, text, user{}, createdAt},
  ...
]


DELETE /api/posts/:postId/comments/:commentId
    │
    ├─► authMiddleware
    │
    ▼
PostController.deleteComment()
    │
    ├─► Validate authentication
    │
    ▼
PostService.deleteComment(commentId, userId)
    │
    ├─► Find comment
    │
    ├─► Check if author = userId
    │   └─► If not: throw error (403)
    │
    ├─► Delete comment
    │
    ▼
Response (200)
{"success": true, "message": "Comment deleted"}
```

### DELETE POST FLOW
```
DELETE /api/posts/:id
    │
    ├─► authMiddleware
    │
    ▼
PostController.deletePost()
    │
    ├─► Validate authentication
    │
    ▼
PostService.deletePost(postId, userId)
    │
    ├─► Find post
    │
    ├─► Check if author = userId
    │   └─► If not: throw error (403)
    │
    ├─► Delete post
    │   └─► Remove from posts collection
    │
    ├─► Delete media
    │   └─► Remove all PostMedia docs with this postId
    │
    ├─► Delete likes
    │   └─► Remove all Like docs with this postId
    │
    ├─► Delete comments
    │   └─► Remove all Comment docs with this postId
    │
    ▼
Response (200)
{"success": true, "message": "Post deleted"}
```

---

## 🗄️ Database Relationships

```
                    ┌──────────────────┐
                    │     USERS        │
                    │ ────────────────│
                    │ _id (PK)         │
                    │ name, email, ... │
                    └────┬────────┬────┘
                         │        │
         ┌───────────────┘        └────────────────┐
         │                                         │
         │ authorId                      userId
         │                                         │
    ┌────▼─────────┐  ┌────────────────┐  ┌──────▼────┐
    │    POSTS      │  │ COMMENT        │  │  LIKES    │
    ├───────────────┤  ├────────────────┤  ├───────────┤
    │ _id (PK)      │  │ _id (PK)       │  │ _id (PK)  │
    │ authorId (FK) │  │ postId (FK)────┼──┤ postId(FK)│
    │ eventId (FK)* │  │ userId (FK)────┴──┤ userId(FK)│
    │ caption       │  │ text           │  │           │
    │ createdAt     │  │ createdAt      │  │ createdAt │
    └────┬──────────┘  └────────────────┘  └───────────┘
         │                                    [UNIQUE]
         │ postId
         │
    ┌────▼────────────────┐
    │    POST_MEDIAS      │
    ├─────────────────────┤
    │ _id (PK)            │
    │ postId (FK)         │
    │ mediaType           │
    │ mediaUrl            │
    │ createdAt           │
    └─────────────────────┘

FK = Foreign Key
PK = Primary Key
* = Optional
[UNIQUE] = {postId, userId} unique index
```

---

## 🔒 Security Layers

```
┌────────────────────────────────────────────────────┐
│ 1. ROUTE PROTECTION                                │
│    ├─ Public: GET /api/posts/:id                  │
│    ├─ Public: GET /api/posts/:id/comments         │
│    └─ Protected: All other endpoints              │
└────────────────────────────────────────────────────┘
                     ▼
┌────────────────────────────────────────────────────┐
│ 2. AUTH MIDDLEWARE                                 │
│    ├─ Extract Bearer token from header            │
│    ├─ Verify JWT signature                        │
│    └─ Extract userId from payload                 │
└────────────────────────────────────────────────────┘
                     ▼
┌────────────────────────────────────────────────────┐
│ 3. AUTHORIZATION CHECKS                            │
│    ├─ DELETE post: Check req.userId === post.author│
│    ├─ DELETE comment: Check req.userId === comment.user│
│    └─ Like: Prevent duplicate via UNIQUE index    │
└────────────────────────────────────────────────────┘
                     ▼
┌────────────────────────────────────────────────────┐
│ 4. INPUT VALIDATION                                │
│    ├─ Check caption is not empty                  │
│    ├─ Check comment text is not empty             │
│    └─ Validate ObjectId formats                   │
└────────────────────────────────────────────────────┘
                     ▼
┌────────────────────────────────────────────────────┐
│ 5. DATABASE CONSTRAINTS                            │
│    ├─ UNIQUE index on {postId, userId} in likes   │
│    ├─ Foreign key references                      │
│    └─ Required fields enforced                    │
└────────────────────────────────────────────────────┘
```

---

## 📊 HTTP Status Code Distribution

```
Success Responses:
├─ 200 OK
│  ├─ GET /posts        [Get feed]
│  ├─ GET /posts/:id    [Get single post]
│  ├─ GET /comments     [Get comments]
│  ├─ DELETE /like      [Unlike]
│  └─ DELETE /comment   [Delete comment]
│
└─ 201 Created
   ├─ POST /posts       [Create post]
   ├─ POST /like        [Like post]
   └─ POST /comment     [Add comment]

Error Responses:
├─ 400 Bad Request
│  └─ Missing required fields (caption, text)
│
├─ 401 Unauthorized
│  └─ Missing or invalid JWT token
│
├─ 403 Forbidden
│  └─ Attempting to delete other user's post/comment
│
├─ 404 Not Found
│  ├─ Post not found
│  ├─ Comment not found
│  └─ Like not found
│
├─ 409 Conflict
│  └─ Post already liked by this user
│
└─ 500 Server Error
   └─ Unexpected database/server errors
```

---

## 🎯 Performance Optimizations

```
Database Indexes:
┌─────────────────────────────────────────┐
│ Collection  │ Index                     │
├─────────────────────────────────────────┤
│ posts       │ {authorId: 1, createdAt} │
│             │ {eventId: 1, createdAt}  │
│             │ {createdAt: -1}          │
├─────────────────────────────────────────┤
│ post_medias │ {postId: 1}               │
├─────────────────────────────────────────┤
│ likes       │ {postId: 1, userId: 1}   │ ← UNIQUE
│             │ {postId: 1}               │
│             │ {userId: 1}               │
├─────────────────────────────────────────┤
│ comments    │ {postId: 1, createdAt}   │
│             │ {userId: 1}               │
└─────────────────────────────────────────┘

Pagination Limits:
├─ Default: 20 items
├─ Maximum: 100 items
└─ Prevents: Large data transfers & DB overload
```

---

## 📈 Scalability Considerations

### Current Implementation Handles:
✅ Thousands of posts  
✅ Millions of likes/comments  
✅ Efficient pagination  
✅ Quick lookups via indexes  

### Future Improvements:
🔮 Redis caching for feed  
🔮 Aggregation pipeline for metrics  
🔮 Sharding by user/date  
🔮 Read replicas for scaling reads  

---

**Architecture Status: ✅ OPTIMIZED**

All components follow best practices for security, performance, and maintainability.
