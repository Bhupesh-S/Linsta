# 🚀 Linsta Backend API Guide - For Frontend Integration

**Backend URL**: `http://localhost:5000` (Development)  
**Production URL**: Replace with your deployed server

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [API Base URL & Headers](#api-base-url--headers)
3. [Auth Endpoints](#auth-endpoints)
4. [User Endpoints](#user-endpoints)
5. [Events Endpoints](#events-endpoints)
6. [Posts Endpoints](#posts-endpoints)
7. [Error Codes](#error-codes)
8. [Data Types](#data-types)

---

## 🔐 Authentication

### JWT Token
- **Type**: Bearer Token
- **Location**: `Authorization` header
- **Format**: `Authorization: Bearer <token>`
- **Validity**: Tokens are generated on login/register

### How to Use Token
```javascript
// In fetch/axios request
fetch('http://localhost:5000/api/posts', {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
})

// Or in axios
axios.get('http://localhost:5000/api/posts', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

---

## 📍 API Base URL & Headers

### Base URL
```
http://localhost:5000
```

### Default Headers (All Requests)
```json
{
  "Content-Type": "application/json"
}
```

### For Protected Endpoints
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

---

## 🔑 AUTH ENDPOINTS

### 1. Register (Create Account)
**Endpoint**: `POST /api/auth/register`  
**Auth Required**: ❌ No  
**Status**: ✅ Working

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Success Response** (201):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "66f1234567890abcdef12345",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response** (400):
```json
{
  "error": "Missing required fields"
}
```

---

### 2. Login
**Endpoint**: `POST /api/auth/login`  
**Auth Required**: ❌ No  
**Status**: ✅ Working

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Success Response** (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "66f1234567890abcdef12345",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response** (401):
```json
{
  "error": "Invalid email or password"
}
```

---

### 3. Google Login
**Endpoint**: `POST /api/auth/google`  
**Auth Required**: ❌ No  
**Status**: ✅ Working

**Request Body**:
```json
{
  "idToken": "GOOGLE_ID_TOKEN_FROM_FRONTEND"
}
```

**Success Response** (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "66f1234567890abcdef12345",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

## 👤 USER ENDPOINTS

### 1. Get User Profile
**Endpoint**: `GET /api/users/:userId`  
**Auth Required**: ❌ No  
**Status**: ✅ Working

**URL Parameters**:
- `userId` - User's MongoDB ID

**Success Response** (200):
```json
{
  "_id": "66f1234567890abcdef12345",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-12-30T10:00:00.000Z"
}
```

---

### 2. Get All Users
**Endpoint**: `GET /api/users`  
**Auth Required**: ❌ No  
**Status**: ✅ Working

**Success Response** (200):
```json
[
  {
    "_id": "66f1234567890abcdef12345",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-12-30T10:00:00.000Z"
  },
  {
    "_id": "66f1234567890abcdef54321",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "createdAt": "2024-12-30T10:05:00.000Z"
  }
]
```

---

## 🎉 EVENTS ENDPOINTS

### 1. Create Event
**Endpoint**: `POST /api/events`  
**Auth Required**: ✅ Yes (JWT Token)  
**Status**: ✅ Working

**Request Body**:
```json
{
  "title": "Tech Meetup 2024",
  "description": "A great gathering of tech enthusiasts",
  "category": "Technology",
  "date": "2024-12-31T18:00:00Z",
  "time": "6:00 PM",
  "venue": "Community Center",
  "isOnline": false,
  "meetingLink": ""
}
```

**Success Response** (201):
```json
{
  "_id": "66f1234567890abcdef12345",
  "title": "Tech Meetup 2024",
  "description": "A great gathering of tech enthusiasts",
  "category": "Technology",
  "date": "2024-12-31T18:00:00Z",
  "time": "6:00 PM",
  "venue": "Community Center",
  "isOnline": false,
  "meetingLink": "",
  "createdBy": {
    "_id": "66f0000000000000000000001",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "createdAt": "2024-12-30T10:00:00.000Z"
}
```

---

### 2. Get All Events
**Endpoint**: `GET /api/events`  
**Auth Required**: ❌ No  
**Status**: ✅ Working

**Query Parameters** (Optional):
- `limit` - Number of events (default: 20)
- `skip` - Number to skip for pagination (default: 0)

**Example**: `GET /api/events?limit=10&skip=0`

**Success Response** (200):
```json
[
  {
    "_id": "66f1234567890abcdef12345",
    "title": "Tech Meetup 2024",
    "description": "A great gathering of tech enthusiasts",
    "category": "Technology",
    "date": "2024-12-31T18:00:00Z",
    "time": "6:00 PM",
    "venue": "Community Center",
    "isOnline": false,
    "meetingLink": "",
    "createdBy": {
      "_id": "66f0000000000000000000001",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-12-30T10:00:00.000Z",
    "attendeeCount": 5
  }
]
```

---

### 3. Get Single Event
**Endpoint**: `GET /api/events/:eventId`  
**Auth Required**: ❌ No  
**Status**: ✅ Working

**Success Response** (200):
```json
{
  "_id": "66f1234567890abcdef12345",
  "title": "Tech Meetup 2024",
  "description": "A great gathering of tech enthusiasts",
  "category": "Technology",
  "date": "2024-12-31T18:00:00Z",
  "time": "6:00 PM",
  "venue": "Community Center",
  "isOnline": false,
  "meetingLink": "",
  "createdBy": {
    "_id": "66f0000000000000000000001",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "createdAt": "2024-12-30T10:00:00.000Z",
  "attendeeCount": 5
}
```

---

### 4. Register for Event (RSVP)
**Endpoint**: `POST /api/events/:eventId/rsvp`  
**Auth Required**: ✅ Yes (JWT Token)  
**Status**: ✅ Working

**URL Parameters**:
- `eventId` - Event's MongoDB ID

**Request Body**: Empty (no body needed)

**Success Response** (201):
```json
{
  "message": "Successfully registered for event",
  "rsvp": {
    "_id": "66f2234567890abcdef12345",
    "eventId": "66f1234567890abcdef12345",
    "userId": "66f0000000000000000000001",
    "createdAt": "2024-12-30T10:10:00.000Z"
  }
}
```

**Error Response** (409 - Already registered):
```json
{
  "error": "Already registered for this event"
}
```

---

### 5. Cancel RSVP
**Endpoint**: `DELETE /api/events/:eventId/rsvp`  
**Auth Required**: ✅ Yes (JWT Token)  
**Status**: ✅ Working

**Success Response** (200):
```json
{
  "message": "RSVP cancelled successfully"
}
```

---

### 6. Get Event Attendees
**Endpoint**: `GET /api/events/:eventId/attendees`  
**Auth Required**: ❌ No  
**Status**: ✅ Working

**Success Response** (200):
```json
[
  {
    "_id": "66f0000000000000000000001",
    "name": "John Doe",
    "email": "john@example.com"
  },
  {
    "_id": "66f0000000000000000000002",
    "name": "Jane Smith",
    "email": "jane@example.com"
  }
]
```

---

## 📸 POSTS ENDPOINTS

### 1. Create Post
**Endpoint**: `POST /api/posts`  
**Auth Required**: ✅ Yes (JWT Token)  
**Status**: ✅ Working

**Request Body**:
```json
{
  "caption": "Had an amazing time at the tech conference!",
  "eventId": "66f1234567890abcdef12345",
  "media": [
    {
      "url": "https://s3.amazonaws.com/images/photo1.jpg",
      "type": "image"
    },
    {
      "url": "https://s3.amazonaws.com/videos/video1.mp4",
      "type": "video"
    }
  ]
}
```

**Fields**:
- `caption` (required) - Post description
- `eventId` (optional) - Link post to an event
- `media` (optional) - Array of media objects
  - `url` - Media URL (image or video)
  - `type` - "image" or "video"

**Success Response** (201):
```json
{
  "_id": "66f1234567890abcdef99999",
  "authorId": "66f0000000000000000000001",
  "eventId": "66f1234567890abcdef12345",
  "caption": "Had an amazing time at the tech conference!",
  "media": [
    {
      "_id": "66f1111111111111111111111",
      "postId": "66f1234567890abcdef99999",
      "mediaType": "image",
      "mediaUrl": "https://s3.amazonaws.com/images/photo1.jpg"
    },
    {
      "_id": "66f2222222222222222222222",
      "postId": "66f1234567890abcdef99999",
      "mediaType": "video",
      "mediaUrl": "https://s3.amazonaws.com/videos/video1.mp4"
    }
  ],
  "author": {
    "_id": "66f0000000000000000000001",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "event": {
    "_id": "66f1234567890abcdef12345",
    "title": "Tech Meetup 2024"
  },
  "likeCount": 0,
  "commentCount": 0,
  "userLiked": false,
  "createdAt": "2024-12-30T10:30:00.000Z",
  "updatedAt": "2024-12-30T10:30:00.000Z"
}
```

---

### 2. Get Feed (All Posts)
**Endpoint**: `GET /api/posts`  
**Auth Required**: ✅ Yes (JWT Token)  
**Status**: ✅ Working

**Query Parameters**:
- `limit` - Number of posts (default: 20, max: 100)
- `skip` - Number to skip for pagination (default: 0)

**Example**: `GET /api/posts?limit=10&skip=0`

**Success Response** (200):
```json
[
  {
    "_id": "66f1234567890abcdef99999",
    "authorId": "66f0000000000000000000001",
    "eventId": "66f1234567890abcdef12345",
    "caption": "Had an amazing time at the tech conference!",
    "media": [
      {
        "_id": "66f1111111111111111111111",
        "postId": "66f1234567890abcdef99999",
        "mediaType": "image",
        "mediaUrl": "https://s3.amazonaws.com/images/photo1.jpg"
      }
    ],
    "author": {
      "_id": "66f0000000000000000000001",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "event": {
      "_id": "66f1234567890abcdef12345",
      "title": "Tech Meetup 2024"
    },
    "likeCount": 5,
    "commentCount": 2,
    "userLiked": false,
    "createdAt": "2024-12-30T10:30:00.000Z",
    "updatedAt": "2024-12-30T10:30:00.000Z"
  }
]
```

---

### 3. Get Single Post
**Endpoint**: `GET /api/posts/:postId`  
**Auth Required**: ❌ No  
**Status**: ✅ Working

**Success Response** (200): Same as post object above

---

### 4. Delete Post
**Endpoint**: `DELETE /api/posts/:postId`  
**Auth Required**: ✅ Yes (JWT Token)  
**Status**: ✅ Working  
**Note**: Only post author can delete

**Success Response** (200):
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

**Error Response** (403 - Not author):
```json
{
  "error": "Unauthorized: Can only delete own posts"
}
```

---

### 5. Like Post
**Endpoint**: `POST /api/posts/:postId/like`  
**Auth Required**: ✅ Yes (JWT Token)  
**Status**: ✅ Working

**Request Body**: Empty

**Success Response** (201):
```json
{
  "success": true,
  "message": "Post liked successfully"
}
```

**Error Response** (409 - Already liked):
```json
{
  "error": "Post already liked by this user"
}
```

---

### 6. Unlike Post
**Endpoint**: `DELETE /api/posts/:postId/like`  
**Auth Required**: ✅ Yes (JWT Token)  
**Status**: ✅ Working

**Request Body**: Empty

**Success Response** (200):
```json
{
  "success": true,
  "message": "Like removed successfully"
}
```

---

### 7. Add Comment
**Endpoint**: `POST /api/posts/:postId/comment`  
**Auth Required**: ✅ Yes (JWT Token)  
**Status**: ✅ Working

**Request Body**:
```json
{
  "text": "Great post! Really enjoyed reading this."
}
```

**Success Response** (201):
```json
{
  "_id": "66f3333333333333333333333",
  "postId": "66f1234567890abcdef99999",
  "userId": "66f0000000000000000000002",
  "text": "Great post! Really enjoyed reading this.",
  "user": {
    "_id": "66f0000000000000000000002",
    "name": "Jane Smith",
    "email": "jane@example.com"
  },
  "createdAt": "2024-12-30T10:35:00.000Z"
}
```

---

### 8. Get Comments
**Endpoint**: `GET /api/posts/:postId/comments`  
**Auth Required**: ❌ No  
**Status**: ✅ Working

**Query Parameters**:
- `limit` - Number of comments (default: 20, max: 100)
- `skip` - Number to skip for pagination (default: 0)

**Example**: `GET /api/posts/66f1234567890abcdef99999/comments?limit=10&skip=0`

**Success Response** (200):
```json
[
  {
    "_id": "66f3333333333333333333333",
    "postId": "66f1234567890abcdef99999",
    "userId": "66f0000000000000000000002",
    "text": "Great post! Really enjoyed reading this.",
    "user": {
      "_id": "66f0000000000000000000002",
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "createdAt": "2024-12-30T10:35:00.000Z"
  },
  {
    "_id": "66f4444444444444444444444",
    "postId": "66f1234567890abcdef99999",
    "userId": "66f0000000000000000000003",
    "text": "Awesome insights!",
    "user": {
      "_id": "66f0000000000000000000003",
      "name": "Bob Johnson",
      "email": "bob@example.com"
    },
    "createdAt": "2024-12-30T10:40:00.000Z"
  }
]
```

---

### 9. Delete Comment
**Endpoint**: `DELETE /api/posts/:postId/comments/:commentId`  
**Auth Required**: ✅ Yes (JWT Token)  
**Status**: ✅ Working  
**Note**: Only comment author can delete

**Success Response** (200):
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

---

## ⚠️ Error Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | Invalid or missing token |
| 403 | Forbidden | Not authorized to perform action |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists (e.g., duplicate like) |
| 500 | Server Error | Internal server error |

### Common Error Responses

**Missing Token** (401):
```json
{
  "error": "Missing or invalid token"
}
```

**Invalid Credentials** (401):
```json
{
  "error": "Invalid email or password"
}
```

**Post Not Found** (404):
```json
{
  "error": "Post not found"
}
```

**User Not Authenticated** (401):
```json
{
  "error": "User not authenticated"
}
```

---

## 📊 Data Types & Schemas

### User Object
```json
{
  "_id": "MongoDB ObjectId (string)",
  "name": "String",
  "email": "String",
  "createdAt": "ISO Date String",
  "updatedAt": "ISO Date String"
}
```

### Event Object
```json
{
  "_id": "MongoDB ObjectId (string)",
  "title": "String (required)",
  "description": "String (optional)",
  "category": "String (optional)",
  "date": "ISO Date String (optional)",
  "time": "String (optional)",
  "venue": "String (optional)",
  "isOnline": "Boolean",
  "meetingLink": "String (optional)",
  "createdBy": "User Object",
  "createdAt": "ISO Date String",
  "attendeeCount": "Number"
}
```

### Post Object
```json
{
  "_id": "MongoDB ObjectId (string)",
  "authorId": "MongoDB ObjectId (string)",
  "eventId": "MongoDB ObjectId (string, optional)",
  "caption": "String (required)",
  "media": [
    {
      "_id": "MongoDB ObjectId (string)",
      "postId": "MongoDB ObjectId (string)",
      "mediaType": "image | video",
      "mediaUrl": "String (URL)"
    }
  ],
  "author": "User Object",
  "event": "Event Object (if linked)",
  "likeCount": "Number",
  "commentCount": "Number",
  "userLiked": "Boolean (only in feed/get post)",
  "createdAt": "ISO Date String",
  "updatedAt": "ISO Date String"
}
```

### Comment Object
```json
{
  "_id": "MongoDB ObjectId (string)",
  "postId": "MongoDB ObjectId (string)",
  "userId": "MongoDB ObjectId (string)",
  "text": "String (required)",
  "user": "User Object",
  "createdAt": "ISO Date String"
}
```

---

## 🔗 Frontend Integration Examples

### Using Fetch API

#### Register User
```javascript
async function registerUser() {
  const response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'SecurePass123'
    })
  });
  
  const data = await response.json();
  if (response.ok) {
    localStorage.setItem('token', data.token);
    console.log('User registered:', data.user);
  } else {
    console.error('Error:', data.error);
  }
}
```

#### Get Posts Feed
```javascript
async function getPosts() {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/posts?limit=20&skip=0', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const posts = await response.json();
  console.log('Posts:', posts);
}
```

#### Create Post
```javascript
async function createPost(caption, eventId, media) {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      caption: caption,
      eventId: eventId,
      media: media
    })
  });
  
  const post = await response.json();
  console.log('Post created:', post);
}
```

#### Like Post
```javascript
async function likePost(postId) {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const result = await response.json();
  console.log('Like result:', result);
}
```

---

### Using Axios

#### Setup
```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Add token to all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### Login
```javascript
async function login(email, password) {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password
    });
    localStorage.setItem('token', response.data.token);
    return response.data.user;
  } catch (error) {
    console.error('Login error:', error.response.data);
  }
}
```

#### Get Events
```javascript
async function getEvents(limit = 20, skip = 0) {
  try {
    const response = await axios.get(`${API_URL}/api/events`, {
      params: { limit, skip }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
  }
}
```

#### Add Comment
```javascript
async function addComment(postId, text) {
  try {
    const response = await axios.post(
      `${API_URL}/api/posts/${postId}/comment`,
      { text }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error.response.data);
  }
}
```

---

## 📱 Important Notes for Frontend Developers

### 1. Token Management
- Store JWT token in localStorage after login/register
- Include token in ALL authenticated requests
- Remove token on logout

### 2. CORS
- Backend has CORS enabled
- Can make requests from frontend on different port

### 3. Media URLs
- Media storage is handled externally (AWS S3, Cloudinary, etc.)
- Frontend must upload files first and get URLs
- Send URLs to backend, not files

### 4. Timestamps
- All timestamps are in ISO 8601 format
- Example: `2024-12-30T10:30:00.000Z`
- All times are in UTC

### 5. Pagination
- Use `limit` and `skip` parameters for pagination
- Default limit is 20
- Maximum limit is 100

### 6. Error Handling
- Always check response status codes
- Parse error messages from response body
- Handle 401 (unauthorized) by redirecting to login

### 7. ObjectIds
- MongoDB IDs are returned as strings
- Always keep them as strings in frontend
- Don't convert to numbers

---

## 🧪 Testing the API

### Using cURL (Command Line)

#### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

#### Get Posts (with token)
```bash
curl -X GET "http://localhost:5000/api/posts?limit=10&skip=0" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📞 Need Help?

- Check the endpoint documentation above
- Verify you're using the correct HTTP method (GET, POST, DELETE)
- Ensure you're sending the required fields
- Check that token is included for protected endpoints
- Review error messages in response body

---

**Last Updated**: 2024-12-30  
**API Version**: 1.0  
**Status**: Production Ready ✅
