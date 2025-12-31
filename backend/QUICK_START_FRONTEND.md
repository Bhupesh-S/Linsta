# 🚀 Quick Reference for Frontend - All Endpoints at a Glance

## 📍 Base URL
```
http://localhost:5000
```

---

## 🔐 Authentication Pattern
```javascript
// All protected endpoints need this header:
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN'
}
```

---

## 📋 ALL ENDPOINTS QUICK MAP

### AUTH (No Auth Required)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/google` | Google login |

### USERS (No Auth Required)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:userId` | Get user profile |

### EVENTS
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/api/events` | Create event | ✅ |
| GET | `/api/events` | Get all events | ❌ |
| GET | `/api/events/:eventId` | Get event details | ❌ |
| POST | `/api/events/:eventId/rsvp` | Register for event | ✅ |
| DELETE | `/api/events/:eventId/rsvp` | Cancel registration | ✅ |
| GET | `/api/events/:eventId/attendees` | Get event attendees | ❌ |

### POSTS
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/api/posts` | Create post | ✅ |
| GET | `/api/posts` | Get feed | ✅ |
| GET | `/api/posts/:postId` | Get single post | ❌ |
| DELETE | `/api/posts/:postId` | Delete post | ✅ |
| POST | `/api/posts/:postId/like` | Like post | ✅ |
| DELETE | `/api/posts/:postId/like` | Unlike post | ✅ |
| POST | `/api/posts/:postId/comment` | Add comment | ✅ |
| GET | `/api/posts/:postId/comments` | Get comments | ❌ |
| DELETE | `/api/posts/:postId/comments/:commentId` | Delete comment | ✅ |

---

## 💻 Code Snippets Ready to Copy

### Setup (Do this once)
```javascript
// Save token after login
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const data = await response.json();
localStorage.setItem('token', data.token);
localStorage.setItem('userId', data.user.id);
```

### Get Token (Use in every protected request)
```javascript
const token = localStorage.getItem('token');
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};
```

### Login
```javascript
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
})
.then(r => r.json())
.then(data => {
  localStorage.setItem('token', data.token);
  console.log('User:', data.user);
});
```

### Get Feed
```javascript
const token = localStorage.getItem('token');
fetch('http://localhost:5000/api/posts?limit=20&skip=0', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(posts => console.log('Posts:', posts));
```

### Create Post
```javascript
const token = localStorage.getItem('token');
fetch('http://localhost:5000/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    caption: 'My post caption',
    eventId: 'event-id-here', // optional
    media: [
      { url: 'https://...jpg', type: 'image' },
      { url: 'https://...mp4', type: 'video' }
    ]
  })
})
.then(r => r.json())
.then(post => console.log('Post created:', post));
```

### Create Event
```javascript
const token = localStorage.getItem('token');
fetch('http://localhost:5000/api/events', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'My Event',
    description: 'Event description',
    category: 'Technology',
    date: '2024-12-31T18:00:00Z',
    time: '6:00 PM',
    venue: 'Location',
    isOnline: false,
    meetingLink: ''
  })
})
.then(r => r.json())
.then(event => console.log('Event created:', event));
```

### Like Post
```javascript
const token = localStorage.getItem('token');
const postId = 'post-id-here';
fetch(`http://localhost:5000/api/posts/${postId}/like`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(data => console.log(data));
```

### Unlike Post
```javascript
const token = localStorage.getItem('token');
const postId = 'post-id-here';
fetch(`http://localhost:5000/api/posts/${postId}/like`, {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(data => console.log(data));
```

### Add Comment
```javascript
const token = localStorage.getItem('token');
const postId = 'post-id-here';
fetch(`http://localhost:5000/api/posts/${postId}/comment`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    text: 'Great post!'
  })
})
.then(r => r.json())
.then(comment => console.log('Comment added:', comment));
```

### Get Comments
```javascript
const postId = 'post-id-here';
fetch(`http://localhost:5000/api/posts/${postId}/comments?limit=20&skip=0`)
.then(r => r.json())
.then(comments => console.log('Comments:', comments));
```

### RSVP for Event
```javascript
const token = localStorage.getItem('token');
const eventId = 'event-id-here';
fetch(`http://localhost:5000/api/events/${eventId}/rsvp`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(data => console.log(data));
```

### Get All Events
```javascript
fetch('http://localhost:5000/api/events?limit=20&skip=0')
.then(r => r.json())
.then(events => console.log('Events:', events));
```

---

## 🚨 Error Handling Template

```javascript
async function apiCall(url, options = {}) {
  try {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token && { 'Authorization': `Bearer ${token}` })
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const error = await response.json();
      
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
      
      throw new Error(error.error || 'API Error');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error.message);
    throw error;
  }
}

// Usage:
try {
  const posts = await apiCall('http://localhost:5000/api/posts');
  console.log(posts);
} catch (error) {
  console.error('Failed to fetch posts:', error);
}
```

---

## 📱 Common Patterns

### Pattern 1: Login & Store Token
```javascript
const login = async (email, password) => {
  const data = await apiCall('http://localhost:5000/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  
  localStorage.setItem('token', data.token);
  return data.user;
};
```

### Pattern 2: Get Current User ID
```javascript
const getCurrentUserId = () => {
  return localStorage.getItem('userId');
};

// After login:
localStorage.setItem('userId', data.user.id);
```

### Pattern 3: Check if Authenticated
```javascript
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};
```

### Pattern 4: Logout
```javascript
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  window.location.href = '/login';
};
```

---

## 🎨 Response Structure

### Success Response (Created)
```json
{
  "property1": "value",
  "property2": "value"
}
```

### Success Response (Simple)
```json
{
  "success": true,
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "error": "Error message here"
}
```

---

## 🔍 Status Codes You'll See

| Code | When | What to do |
|------|------|-----------|
| 200 | Success with data | Process the data |
| 201 | Resource created | Show success message |
| 400 | Bad request | Check required fields |
| 401 | Unauthorized | Redirect to login |
| 403 | Forbidden | Show "Not allowed" error |
| 404 | Not found | Show "Not found" error |
| 409 | Conflict | (e.g., already liked) |
| 500 | Server error | Show "Server error" message |

---

## 📝 Common Mistakes to Avoid

❌ **Forgetting the Authorization header**
```javascript
// WRONG
fetch('http://localhost:5000/api/posts')

// RIGHT
fetch('http://localhost:5000/api/posts', {
  headers: { 'Authorization': `Bearer ${token}` }
})
```

❌ **Sending body for GET requests**
```javascript
// WRONG
fetch('http://localhost:5000/api/posts', {
  method: 'GET',
  body: JSON.stringify({...})
})

// RIGHT
fetch('http://localhost:5000/api/posts?limit=20')
```

❌ **Not handling errors**
```javascript
// WRONG
const data = await fetch(url).then(r => r.json());

// RIGHT
const response = await fetch(url);
if (!response.ok) {
  const error = await response.json();
  console.error(error.error);
  return;
}
const data = await response.json();
```

❌ **Forgetting Content-Type header**
```javascript
// WRONG
fetch(url, {
  method: 'POST',
  body: JSON.stringify(data)
})

// RIGHT
fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
```

---

## 🎯 Next Steps

1. **Copy the code snippets** to your project
2. **Test each endpoint** with provided examples
3. **Implement error handling** in your app
4. **Build your UI** around the data structures
5. **Deploy** when ready

---

**Questions?** Refer to `FRONTEND_API_GUIDE.md` for detailed documentation of each endpoint.

Good luck with your frontend! 🚀
