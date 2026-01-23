# 📚 Complete Linsta Backend Documentation - Share with Frontend Team

This document contains everything your frontend team needs to integrate with the backend.

---

## 📖 Documentation Files Overview

| File | Purpose | For Whom |
|------|---------|----------|
| **FRONTEND_API_GUIDE.md** | Complete API reference with examples | Frontend Developers |
| **QUICK_START_FRONTEND.md** | Quick reference & code snippets | All Frontend Team |
| **BACKEND_SETUP_GUIDE.md** | How to run backend locally | DevOps / Project Lead |
| **This File** | Overview & next steps | Project Coordinator |

---

## 🚀 For Your Frontend Friend

### Step 1: Get the Backend Running
1. Have backend developer share the code
2. Follow `BACKEND_SETUP_GUIDE.md`
3. Verify it runs on `http://localhost:5000`

### Step 2: Learn the API
1. Read `FRONTEND_API_GUIDE.md` for detailed endpoint info
2. Use `QUICK_START_FRONTEND.md` for quick reference & code snippets
3. Test endpoints with provided cURL examples

### Step 3: Integrate with Frontend
1. Copy code snippets from `QUICK_START_FRONTEND.md`
2. Set `API_URL = 'http://localhost:5000'`
3. Start building UI components

### Step 4: Test Everything
1. Test login/register
2. Test creating posts, events
3. Test like/comment functionality
4. Handle errors properly

---

## 🎯 Key Information for Frontend

### API Base URL
```
http://localhost:5000
```

### Authentication
- Use JWT tokens from login/register endpoints
- Include in `Authorization: Bearer TOKEN` header
- Store in localStorage

### Main Features
1. **User Management** - Register, login, profiles
2. **Events** - Create, list, RSVP
3. **Posts** - Create, feed, like, comment
4. **Social** - Likes, comments on posts

### Data You'll Work With
```javascript
// User Object
{
  _id: "ObjectId",
  name: "John Doe",
  email: "john@example.com"
}

// Post Object
{
  _id: "ObjectId",
  caption: "Post text",
  author: { name, email },
  event: { title }, // optional
  media: [], // images/videos
  likeCount: 0,
  commentCount: 0,
  userLiked: false
}

// Event Object
{
  _id: "ObjectId",
  title: "Event name",
  description: "...",
  date: "ISO Date",
  createdBy: { name, email },
  attendeeCount: 0
}
```

---

## 📋 25 Most Common API Calls

### Authentication (3)
```javascript
// 1. Register
POST /api/auth/register
{ name, email, password }

// 2. Login
POST /api/auth/login
{ email, password }

// 3. Google Login
POST /api/auth/google
{ idToken }
```

### Users (2)
```javascript
// 4. Get all users
GET /api/users

// 5. Get user profile
GET /api/users/:userId
```

### Events (6)
```javascript
// 6. Create event
POST /api/events
{ title, description, date, time, venue, isOnline, meetingLink }

// 7. Get all events
GET /api/events?limit=20&skip=0

// 8. Get event details
GET /api/events/:eventId

// 9. Get attendees
GET /api/events/:eventId/attendees

// 10. Register for event
POST /api/events/:eventId/rsvp

// 11. Cancel registration
DELETE /api/events/:eventId/rsvp
```

### Posts (9)
```javascript
// 12. Create post
POST /api/posts
{ caption, eventId, media: [{url, type}] }

// 13. Get feed
GET /api/posts?limit=20&skip=0

// 14. Get single post
GET /api/posts/:postId

// 15. Delete post
DELETE /api/posts/:postId

// 16. Like post
POST /api/posts/:postId/like

// 17. Unlike post
DELETE /api/posts/:postId/like

// 18. Add comment
POST /api/posts/:postId/comment
{ text }

// 19. Get comments
GET /api/posts/:postId/comments?limit=20&skip=0

// 20. Delete comment
DELETE /api/posts/:postId/comments/:commentId
```

---

## 💻 Copy-Paste Ready Code

### 1. Setup (Do Once)
```javascript
const API_URL = 'http://localhost:5000';

// Reusable fetch with auth
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  return response;
};
```

### 2. Login & Save Token
```javascript
async function handleLogin(email, password) {
  const response = await apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  
  if (response.ok) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.user.id);
    localStorage.setItem('userName', data.user.name);
    return data.user;
  } else {
    throw new Error(data.error);
  }
}
```

### 3. Get Feed
```javascript
async function getFeed(limit = 20, skip = 0) {
  const response = await apiCall(`/api/posts?limit=${limit}&skip=${skip}`);
  return response.json();
}
```

### 4. Create Post
```javascript
async function createPost(caption, eventId = null, media = []) {
  const response = await apiCall('/api/posts', {
    method: 'POST',
    body: JSON.stringify({ caption, eventId, media })
  });
  return response.json();
}
```

### 5. Like/Unlike Post
```javascript
async function toggleLike(postId, isLiked) {
  const method = isLiked ? 'DELETE' : 'POST';
  const response = await apiCall(`/api/posts/${postId}/like`, {
    method
  });
  return response.json();
}
```

### 6. Get/Add Comments
```javascript
async function getComments(postId, limit = 20, skip = 0) {
  const response = await apiCall(
    `/api/posts/${postId}/comments?limit=${limit}&skip=${skip}`
  );
  return response.json();
}

async function addComment(postId, text) {
  const response = await apiCall(`/api/posts/${postId}/comment`, {
    method: 'POST',
    body: JSON.stringify({ text })
  });
  return response.json();
}
```

### 7. Create Event
```javascript
async function createEvent(eventData) {
  const response = await apiCall('/api/events', {
    method: 'POST',
    body: JSON.stringify(eventData)
  });
  return response.json();
}
```

### 8. Get Events
```javascript
async function getEvents(limit = 20, skip = 0) {
  const response = await apiCall(`/api/events?limit=${limit}&skip=${skip}`);
  return response.json();
}
```

### 9. RSVP for Event
```javascript
async function toggleRsvp(eventId, isRsvped) {
  const method = isRsvped ? 'DELETE' : 'POST';
  const response = await apiCall(`/api/events/${eventId}/rsvp`, {
    method
  });
  return response.json();
}
```

### 10. Logout
```javascript
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  window.location.href = '/login';
}
```

---

## 🎨 Frontend Features Checklist

- [ ] **Auth Pages**
  - [ ] Register/Sign Up
  - [ ] Login
  - [ ] Logout
  - [ ] Google login (if needed)

- [ ] **Home/Feed**
  - [ ] Display posts list
  - [ ] Pagination
  - [ ] Like button
  - [ ] Comment button

- [ ] **Create Post**
  - [ ] Text input for caption
  - [ ] Media upload (images/videos)
  - [ ] Link to event (optional)
  - [ ] Submit button

- [ ] **Comments**
  - [ ] Display comments list
  - [ ] Add comment form
  - [ ] Delete comment (if author)
  - [ ] Author info displayed

- [ ] **Events**
  - [ ] List all events
  - [ ] Event details page
  - [ ] RSVP button
  - [ ] Show attendees
  - [ ] Create event form

- [ ] **User Profile**
  - [ ] Display user info
  - [ ] Show user's posts
  - [ ] Edit profile (if needed)

- [ ] **Error Handling**
  - [ ] Show error messages
  - [ ] Handle 401 (redirect to login)
  - [ ] Handle 404 (show not found)
  - [ ] Handle network errors

---

## 📊 Response Examples

### Post Object
```json
{
  "_id": "66f1234567890abcdef99999",
  "authorId": "66f0000000000000000000001",
  "eventId": "66f1234567890abcdef12345",
  "caption": "Great event!",
  "media": [
    {
      "_id": "66f1111111111111111111111",
      "postId": "66f1234567890abcdef99999",
      "mediaType": "image",
      "mediaUrl": "https://..."
    }
  ],
  "author": {
    "_id": "66f0000000000000000000001",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "event": {
    "_id": "66f1234567890abcdef12345",
    "title": "Tech Meetup"
  },
  "likeCount": 5,
  "commentCount": 2,
  "userLiked": false,
  "createdAt": "2024-12-30T10:30:00.000Z",
  "updatedAt": "2024-12-30T10:30:00.000Z"
}
```

### Comment Object
```json
{
  "_id": "66f3333333333333333333333",
  "postId": "66f1234567890abcdef99999",
  "userId": "66f0000000000000000000002",
  "text": "Great post!",
  "user": {
    "_id": "66f0000000000000000000002",
    "name": "Jane Smith",
    "email": "jane@example.com"
  },
  "createdAt": "2024-12-30T10:35:00.000Z"
}
```

### Event Object
```json
{
  "_id": "66f1234567890abcdef12345",
  "title": "Tech Meetup 2024",
  "description": "...",
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

## ⚠️ Important Notes

1. **Token Storage**
   - Store in localStorage after login
   - Include in every API request (except public endpoints)
   - Remove on logout

2. **Media Handling**
   - Upload files to external storage (AWS S3, Cloudinary, etc.)
   - Get URL from upload service
   - Send URL to backend (not the file itself)

3. **CORS**
   - Backend has CORS enabled for development
   - For production, configure specific domain

4. **Timestamps**
   - All timestamps are ISO 8601 format
   - Returned as UTC timezone
   - Parse with JavaScript Date: `new Date(timestamp)`

5. **Pagination**
   - Use `limit` (default 20, max 100)
   - Use `skip` for offset
   - Example: `?limit=20&skip=40` for page 3

6. **ObjectIds**
   - MongoDB IDs are strings
   - Keep them as strings in frontend
   - Use for API calls and comparisons

---

## 🔗 Summary of Document Files

**For Backend Team:**
- `BACKEND_SETUP_GUIDE.md` - How to run backend

**For Frontend Team:**
- `FRONTEND_API_GUIDE.md` - Complete API reference
- `QUICK_START_FRONTEND.md` - Code snippets & quick ref
- This file - Overview & integration guide

---

## ✅ Integration Checklist

- [ ] Backend is running on `http://localhost:5000`
- [ ] MongoDB is connected
- [ ] Can register new user
- [ ] Can login with email/password
- [ ] Can get feed (with valid token)
- [ ] Can create post
- [ ] Can like/unlike post
- [ ] Can comment on post
- [ ] Can create event
- [ ] Can RSVP to event
- [ ] Error handling is working
- [ ] Token persistence works
- [ ] Logout clears token

---

## 📞 Quick Reference

### Base URL
```
http://localhost:5000
```

### Common Headers
```
Content-Type: application/json
Authorization: Bearer TOKEN_HERE
```

### Status Codes
- 200: Success
- 201: Created
- 400: Bad request
- 401: Unauthorized (no/invalid token)
- 403: Forbidden (not allowed)
- 404: Not found
- 409: Conflict
- 500: Server error

### Common Errors
```
"error": "Missing required fields"
"error": "Invalid email or password"
"error": "Missing or invalid token"
"error": "Post not found"
"error": "Already registered for this event"
"error": "Post already liked by this user"
```

---

## 🎓 Learning Path

**Day 1:**
- [ ] Read this overview
- [ ] Get backend running
- [ ] Test endpoints with cURL

**Day 2:**
- [ ] Read `FRONTEND_API_GUIDE.md`
- [ ] Understand data structures
- [ ] Test with Postman/Thunder Client

**Day 3:**
- [ ] Copy setup code from `QUICK_START_FRONTEND.md`
- [ ] Build login page
- [ ] Implement token storage

**Day 4+:**
- [ ] Build feed page
- [ ] Add create post
- [ ] Implement comments
- [ ] Build events section
- [ ] Polish UI/UX

---

## 🚀 You're Ready!

Everything your frontend team needs is in these documents:

1. **FRONTEND_API_GUIDE.md** - Detailed API reference
2. **QUICK_START_FRONTEND.md** - Code snippets to copy
3. **BACKEND_SETUP_GUIDE.md** - How to run backend

**Good luck with the integration!** 🎉

---

Last Updated: 2024-12-30  
Linsta Backend API v1.0  
Status: Production Ready ✅
