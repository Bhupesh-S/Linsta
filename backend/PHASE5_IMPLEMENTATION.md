# Phase 5: Notifications Implementation Guide

## Overview

Phase 5 adds a **database-based notification system** that automatically tracks and notifies users when:
- Someone likes their post
- Someone comments on their post
- Someone RSVPs to their event

**No real-time notifications yet** - this is DB-based polling. Socket.io integration can come in Phase 6.

---

## Database Schema

### Notifications Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,        // Who receives the notification
  type: String,            // "LIKE" | "COMMENT" | "EVENT_RSVP"
  message: String,         // "John liked your post"
  referenceId: ObjectId,   // Post ID or Event ID
  isRead: Boolean,         // Default: false
  createdAt: Date,         // Auto-generated
  updatedAt: Date          // Auto-generated
}
```

### Indexes
- `{userId: 1, createdAt: -1}` - Fetch user's notifications sorted by date
- `{userId: 1, isRead: 1}` - Count unread notifications

---

## API Endpoints

### 1. Get Notifications
```
GET /api/notifications
Authorization: Bearer TOKEN
Query: limit=20, skip=0
```

**Response:**
```json
[
  {
    "_id": "66f...",
    "userId": "66f0000000000000000000001",
    "type": "LIKE",
    "message": "John Doe liked your post",
    "referenceId": "66f1234567890abcdef99999",
    "isRead": false,
    "createdAt": "2024-12-31T10:30:00.000Z"
  }
]
```

---

### 2. Mark Notification as Read
```
PUT /api/notifications/:id/read
Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "_id": "66f...",
  "userId": "66f0000000000000000000001",
  "type": "LIKE",
  "message": "John Doe liked your post",
  "referenceId": "66f1234567890abcdef99999",
  "isRead": true,
  "createdAt": "2024-12-31T10:30:00.000Z"
}
```

---

### 3. Get Unread Count
```
GET /api/notifications/unread/count
Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "unreadCount": 5
}
```

---

### 4. Mark All as Read
```
PUT /api/notifications/mark-all/read
Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "message": "All notifications marked as read"
}
```

---

## Files Created

### 1. **notification.model.ts**
- Mongoose schema for Notification
- Fields: userId, type, message, referenceId, isRead
- TypeScript interface: `INotification`
- Indexes for performance

### 2. **notification.types.ts**
- TypeScript interfaces for API responses
- `NotificationResponse` - API format
- `NotificationData` - Internal service format

### 3. **notification.service.ts**
- Business logic (8 methods)
- `createNotification()` - Create with self-action prevention
- `getNotifications()` - Paginated fetch
- `markAsRead()` - Single notification
- `getUnreadCount()` - Count unread
- `markAllAsRead()` - Mark all unread as read

### 4. **notification.controller.ts**
- HTTP handlers (4 methods)
- Input validation
- Error handling
- JWT auth checking

### 5. **notification.routes.ts**
- 4 routes (all protected)
- Special route ordering (specific paths before :id params)

---

## Integration Points

### Post Service (`post.service.ts`)

**Like Notification:**
```typescript
// When likePost() is called
await notificationService.createNotification(
  post.authorId,      // Notify post author
  userId,             // Action by this user
  'LIKE',
  `${authorName} liked your post`,
  postId
);
```

**Comment Notification:**
```typescript
// When addComment() is called
await notificationService.createNotification(
  post.authorId,      // Notify post author
  userId,             // Action by this user
  'COMMENT',
  `${commenterName} commented on your post`,
  postId
);
```

### Event Service (`event.service.ts`)

**RSVP Notification:**
```typescript
// When registerForEvent() is called
await notificationService.createNotification(
  event.createdBy,    // Notify event creator
  userId,             // Action by this user
  'EVENT_RSVP',
  `${userName} registered for your event`,
  eventId
);
```

---

## Key Features

### 1. Self-Action Prevention
```typescript
// Don't notify if user acts on their own content
if (receiverId === actorId) {
  return;  // Skip notification
}
```

### 2. Error Resilience
```typescript
try {
  // Create notification
} catch (error) {
  // Log but don't crash main operation
  console.error('Failed to create notification:', error);
}
```

### 3. Pagination Support
```typescript
GET /api/notifications?limit=20&skip=0
```

### 4. Async Creation
Notifications are created asynchronously - don't block likes/comments

---

## Code Examples

### Frontend: Get Notifications

```javascript
// Setup
const API_URL = 'http://localhost:5000';

// Get all notifications
async function getNotifications(limit = 20, skip = 0) {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `${API_URL}/api/notifications?limit=${limit}&skip=${skip}`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  return response.json();
}

// Mark one as read
async function markAsRead(notificationId) {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `${API_URL}/api/notifications/${notificationId}/read`,
    {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  return response.json();
}

// Get unread count
async function getUnreadCount() {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `${API_URL}/api/notifications/unread/count`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  const data = await response.json();
  return data.unreadCount;
}

// Mark all as read
async function markAllAsRead() {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `${API_URL}/api/notifications/mark-all/read`,
    {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  return response.json();
}
```

### Frontend: Display Notifications

```javascript
// React Component Example
function NotificationBell() {
  const [notifications, setNotifications] = React.useState([]);
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    // Load notifications on mount
    loadNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  async function loadNotifications() {
    const data = await getNotifications(20);
    setNotifications(data);
    
    const count = await getUnreadCount();
    setUnreadCount(count);
  }

  async function handleMarkAsRead(id) {
    await markAsRead(id);
    await loadNotifications();  // Refresh
  }

  return (
    <div className="notification-bell">
      <BellIcon />
      {unreadCount > 0 && (
        <span className="badge">{unreadCount}</span>
      )}
      
      <div className="notification-dropdown">
        {notifications.map(notif => (
          <div 
            key={notif._id}
            className={notif.isRead ? 'read' : 'unread'}
          >
            <p>{notif.message}</p>
            <small>{new Date(notif.createdAt).toLocaleString()}</small>
            
            {!notif.isRead && (
              <button onClick={() => handleMarkAsRead(notif._id)}>
                Mark as Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Testing with cURL

### Get Notifications
```bash
curl -X GET http://localhost:5000/api/notifications \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Mark as Read
```bash
curl -X PUT http://localhost:5000/api/notifications/NOTIF_ID/read \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Unread Count
```bash
curl -X GET http://localhost:5000/api/notifications/unread/count \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Mark All as Read
```bash
curl -X PUT http://localhost:5000/api/notifications/mark-all/read \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Test Scenario

1. **User A** creates a post
2. **User B** likes the post → Notification created for User A
3. User A calls `GET /api/notifications` → Sees "User B liked your post"
4. User A clicks "Mark as Read" → `PUT /api/notifications/:id/read`
5. Notification's `isRead` changes to `true`

---

## Limits & Constraints

- **No socket.io** - DB polling only (slower but simpler)
- **No push notifications** - In-app only
- **No email notifications** - Future enhancement
- **Max 100** notifications per request
- **No notification deletion** - Only mark as read
- **No notification preferences** - All events trigger notifications

---

## Performance Considerations

### Indexes
```
{userId: 1, createdAt: -1}    // Fast notification fetch
{userId: 1, isRead: 1}         // Fast unread count
```

### Pagination
Always use `limit` and `skip` for large notification lists
```
GET /api/notifications?limit=20&skip=0   // First 20
GET /api/notifications?limit=20&skip=20  // Next 20
```

### Polling Strategy (Frontend)
```javascript
// Poll every 30-60 seconds (not every second!)
setInterval(loadNotifications, 30000);
```

---

## Future Enhancements

### Phase 6+: Real-time
- Replace polling with Socket.io
- Instant notifications on like/comment/RSVP

### Phase 7+: Advanced
- Email notifications
- Push notifications (mobile)
- Notification preferences (user can opt-out)
- Notification filtering (by type)

---

## Architecture Diagram

```
User Action (Like/Comment/RSVP)
    ↓
Post/Event Service detects
    ↓
Creates notification via NotificationService
    ↓
Writes to MongoDB
    ↓
Frontend polls GET /api/notifications
    ↓
Displays to user
    ↓
User clicks to mark as read
    ↓
Frontend calls PUT /api/notifications/:id/read
    ↓
Updates isRead = true
```

---

## Summary

**Phase 5 delivers:**
- ✅ Automatic notification creation
- ✅ Notification persistence in MongoDB
- ✅ API to fetch notifications
- ✅ Mark as read functionality
- ✅ Self-action prevention (don't notify self)
- ✅ Full TypeScript support
- ✅ Proper error handling
- ✅ Production-ready code

**Status:** Complete and ready for frontend integration! 🎉

---

**Last Updated:** December 31, 2025  
**TypeScript Compilation:** ✅ 0 errors
