## STORIES FEATURE - IMPLEMENTATION GUIDE

### ✅ FEATURES IMPLEMENTED

#### 1. **Story Model**
```typescript
{
  _id: ObjectId
  userId: ObjectId (ref User)
  mediaType: "image" | "video"
  mediaUrl: string
  caption: string (optional)
  expiresAt: Date (24 hours from creation)
  createdAt: Date
}
```

**Key Features:**
- TTL index on `expiresAt` for automatic deletion after 24 hours
- Compound index on `(userId, createdAt)` for efficient querying
- All URLs stored as strings (no file storage in DB)

#### 2. **Story Expiration**
- Stories automatically expire 24 hours after creation
- MongoDB TTL index automatically deletes expired stories
- Fallback query-level filtering: `expiresAt > now`
- Ensures only active stories are returned in APIs

#### 3. **API Endpoints (All Protected with JWT)**

**POST /api/stories - Create Story**
```bash
POST /api/stories
Authorization: Bearer <token>
Content-Type: application/json

{
  "mediaType": "image",
  "mediaUrl": "https://example.com/image.jpg",
  "caption": "Beautiful sunset!" // optional
}

Response 201:
{
  "_id": "507f1f77bcf86cd799439011",
  "userId": "507f1f77bcf86cd799439012",
  "mediaType": "image",
  "mediaUrl": "https://example.com/image.jpg",
  "caption": "Beautiful sunset!",
  "expiresAt": "2026-01-14T19:41:00Z",
  "createdAt": "2026-01-13T19:41:00Z",
  "user": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**GET /api/stories - Get All Active Stories (Grouped by User)**
```bash
GET /api/stories
Authorization: Bearer <token>

Response 200:
{
  "data": {
    "507f1f77bcf86cd799439012": {
      "userId": "507f1f77bcf86cd799439012",
      "user": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "stories": [
        {
          "_id": "507f1f77bcf86cd799439011",
          "mediaType": "image",
          "mediaUrl": "https://example.com/image1.jpg",
          "caption": "Latest story",
          "expiresAt": "2026-01-14T19:41:00Z",
          "createdAt": "2026-01-13T19:41:00Z"
        },
        {
          "_id": "507f1f77bcf86cd799439010",
          "mediaType": "video",
          "mediaUrl": "https://example.com/video.mp4",
          "expiresAt": "2026-01-14T19:35:00Z",
          "createdAt": "2026-01-13T19:35:00Z"
        }
      ]
    },
    "507f1f77bcf86cd799439013": {
      "userId": "507f1f77bcf86cd799439013",
      "user": {...},
      "stories": [...]
    }
  },
  "count": 2
}
```

**GET /api/stories/user/:userId - Get User's Stories**
```bash
GET /api/stories/user/507f1f77bcf86cd799439012
Authorization: Bearer <token>

Response 200:
{
  "userId": "507f1f77bcf86cd799439012",
  "user": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "stories": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "mediaType": "image",
      "mediaUrl": "https://example.com/image1.jpg",
      "caption": "Latest story",
      "expiresAt": "2026-01-14T19:41:00Z",
      "createdAt": "2026-01-13T19:41:00Z"
    }
  ]
}
```

#### 4. **Input Validation**

**Validation Rules:**
- `mediaType`: Required, must be "image" or "video"
- `mediaUrl`: Required, valid URL, max 2048 chars
- `caption`: Optional, max 500 characters

**Error Responses:**
```json
{
  "error": "Media type must be 'image' or 'video'"
}

{
  "error": "Media URL must be a valid URL"
}

{
  "error": "Caption cannot exceed 500 characters"
}
```

#### 5. **Error Handling**

| Scenario | Status | Error |
|----------|--------|-------|
| Not authenticated | 401 | "User not authenticated" |
| Invalid media type | 400 | "Media type must be 'image' or 'video'" |
| Missing media URL | 400 | "Media URL is required" |
| Invalid URL | 400 | "Media URL must be a valid URL" |
| No active stories | 404 | "No active stories found" |
| User has no stories | 404 | "This user has no active stories" |
| Invalid input | 400 | "Invalid story input" |

#### 6. **Folder Structure**

```
src/
├── modules/
│   ├── stories/
│   │   ├── story.model.ts       # Mongoose schema
│   │   ├── story.types.ts       # TypeScript interfaces
│   │   ├── story.errors.ts      # Error handling
│   │   ├── story.validators.ts  # Input validation
│   │   ├── story.service.ts     # Business logic
│   │   ├── story.controller.ts  # API handlers
│   │   └── story.routes.ts      # Route definitions
```

### 🎯 **DESIGN DECISIONS**

1. **Lightweight Implementation**
   - No likes, comments, or reactions (keeps it simple)
   - No story replies or DMs
   - No highlights or story archives
   - No analytics or view counts
   - URLs only (no actual file storage)

2. **Auto-Expiration**
   - TTL index handles automatic cleanup
   - Query-level filtering ensures non-expired stories only
   - 24-hour expiration matches Instagram/WhatsApp standard

3. **Isolation**
   - Stories are completely separate from posts module
   - No shared code or dependencies with posts
   - Can be extended independently later

4. **Performance**
   - Indexes on userId, createdAt, and expiresAt
   - Efficient grouping by userId in memory
   - Query filters on expiresAt for reliability

5. **Type Safety**
   - Full TypeScript typing throughout
   - Interfaces for requests and responses
   - Validated inputs with detailed error messages

### 📋 **HOW IT WORKS**

#### User Creates a Story:
1. Client sends POST request with mediaUrl, mediaType, optional caption
2. Server validates input
3. Server calculates expiresAt = now + 24 hours
4. Story saved to MongoDB
5. Response includes story details with expiration time

#### Stories Auto-Expire:
1. MongoDB TTL index monitors expiresAt field
2. When current time > expiresAt, MongoDB automatically deletes story
3. API query-level filter ensures only expiresAt > now stories returned

#### Users View Stories:
1. GET /api/stories returns all active stories grouped by user
2. GET /api/stories/user/:userId returns specific user's active stories
3. Both endpoints filter out expired stories

### 🚀 **USAGE EXAMPLE**

```bash
# 1. Create a story
curl -X POST http://localhost:5000/api/stories \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "mediaType": "image",
    "mediaUrl": "https://example.com/photo.jpg",
    "caption": "Having a great day!"
  }'

# 2. Get all stories
curl -X GET http://localhost:5000/api/stories \
  -H "Authorization: Bearer <token>"

# 3. Get user's stories
curl -X GET http://localhost:5000/api/stories/user/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer <token>"
```

### ✨ **KEY FEATURES**

- ✅ Stories expire after 24 hours automatically
- ✅ TTL index + query-level filtering for reliability
- ✅ Grouped stories by user for efficient display
- ✅ Full TypeScript type safety
- ✅ Comprehensive input validation
- ✅ Proper error handling with HTTP status codes
- ✅ Isolated module (doesn't affect existing code)
- ✅ URLs only (no file storage)
- ✅ Protected routes (JWT required)
- ✅ Ready for production use

### 🔄 **BACKWARD COMPATIBILITY**

- No changes to existing modules
- No changes to existing APIs
- Stories are completely isolated
- Can be added/removed without affecting other features

