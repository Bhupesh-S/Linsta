# Phase 5: Notifications - Quick Reference

## API Endpoints Summary

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/api/notifications` | Get all notifications | ✅ |
| GET | `/api/notifications/unread/count` | Count unread | ✅ |
| PUT | `/api/notifications/:id/read` | Mark one as read | ✅ |
| PUT | `/api/notifications/mark-all/read` | Mark all as read | ✅ |

---

## Quick Code Snippets

### Setup (Reusable Helper)
```javascript
const API_URL = 'http://localhost:5000';

async function notificationApi(endpoint, method = 'GET') {
  const token = localStorage.getItem('token');
  return fetch(`${API_URL}/api/notifications${endpoint}`, {
    method,
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
```

### 1. Get Notifications
```javascript
async function getNotifications(limit = 20, skip = 0) {
  const response = await notificationApi(`?limit=${limit}&skip=${skip}`);
  return response.json();
}

// Usage
const notifications = await getNotifications(20, 0);
console.log(notifications);
```

### 2. Get Unread Count
```javascript
async function getUnreadCount() {
  const response = await notificationApi('/unread/count');
  const data = await response.json();
  return data.unreadCount;
}

// Usage
const count = await getUnreadCount();
console.log(`You have ${count} unread notifications`);
```

### 3. Mark as Read (Single)
```javascript
async function markAsRead(notificationId) {
  const response = await notificationApi(`/${notificationId}/read`, 'PUT');
  return response.json();
}

// Usage
await markAsRead('66f...');
```

### 4. Mark All as Read
```javascript
async function markAllAsRead() {
  const response = await notificationApi('/mark-all/read', 'PUT');
  return response.json();
}

// Usage
await markAllAsRead();
```

---

## Notification Types

```javascript
const types = {
  LIKE: "Someone liked your post",
  COMMENT: "Someone commented on your post",
  EVENT_RSVP: "Someone registered for your event"
};
```

---

## Data Structure

```javascript
{
  _id: "66f...",                    // Notification ID
  userId: "66f0000000000000000001", // Receiver
  type: "LIKE",                     // Type
  message: "John Doe liked...",     // Human-readable
  referenceId: "66f1234567...",     // Post or Event ID
  isRead: false,                    // Read status
  createdAt: "2024-12-31T10:30Z"    // Time
}
```

---

## Frontend Component Pattern

### Notification Bell with Badge
```javascript
function NotificationBell() {
  const [notifications, setNotifications] = React.useState([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [showDropdown, setShowDropdown] = React.useState(false);

  React.useEffect(() => {
    refreshNotifications();
    // Poll every 30 seconds
    const interval = setInterval(refreshNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  async function refreshNotifications() {
    const notifs = await getNotifications(20);
    setNotifications(notifs);
    
    const count = await getUnreadCount();
    setUnreadCount(count);
  }

  const handleNotificationClick = async (id) => {
    await markAsRead(id);
    await refreshNotifications();
  };

  const handleMarkAll = async () => {
    await markAllAsRead();
    await refreshNotifications();
  };

  return (
    <div className="notification-bell-container">
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        className="bell-icon"
      >
        🔔
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={handleMarkAll}>Mark all as read</button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <p>No notifications</p>
            ) : (
              notifications.map(notif => (
                <NotificationItem
                  key={notif._id}
                  notification={notif}
                  onRead={handleNotificationClick}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationItem({ notification, onRead }) {
  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diff = now - notifDate;
    
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return notifDate.toLocaleDateString();
  };

  return (
    <div 
      className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
      onClick={() => onRead(notification._id)}
    >
      <div className="content">
        <p className="message">{notification.message}</p>
        <small className="time">{formatTime(notification.createdAt)}</small>
      </div>
      {!notification.isRead && <div className="dot"></div>}
    </div>
  );
}
```

### CSS Styles
```css
.notification-bell-container {
  position: relative;
}

.bell-icon {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  position: relative;
}

.badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff4444;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.notification-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 350px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  max-height: 500px;
  overflow-y: auto;
  z-index: 1000;
}

.notification-dropdown .header {
  padding: 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-dropdown h3 {
  margin: 0;
  font-size: 16px;
}

.notification-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.notification-item:hover {
  background: #f9f9f9;
}

.notification-item.unread {
  background: #f0f8ff;
}

.notification-item .content {
  flex: 1;
}

.notification-item .message {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}

.notification-item .time {
  color: #999;
  font-size: 12px;
  margin-top: 4px;
}

.notification-item .dot {
  width: 8px;
  height: 8px;
  background: #0066ff;
  border-radius: 50%;
  margin-left: 8px;
}
```

---

## Common Patterns

### Check for Notifications on App Load
```javascript
async function initializeNotifications() {
  try {
    const count = await getUnreadCount();
    if (count > 0) {
      console.log(`You have ${count} unread notifications`);
      // Show notification indicator
    }
  } catch (error) {
    console.error('Failed to load notifications:', error);
  }
}

// Call on app startup
initializeNotifications();
```

### Refresh Notifications Periodically
```javascript
// Check every 30 seconds
setInterval(async () => {
  try {
    const notifs = await getNotifications(20);
    // Update UI
  } catch (error) {
    console.error('Notification refresh failed:', error);
  }
}, 30000);
```

### Handle Errors
```javascript
async function safeGetNotifications() {
  try {
    return await getNotifications();
  } catch (error) {
    if (error.message.includes('401')) {
      // Token expired
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else {
      console.error('Failed to fetch notifications:', error);
      return [];
    }
  }
}
```

---

## Testing Checklist

- [ ] Login with User A
- [ ] Get token from response
- [ ] Use token in notifications API calls
- [ ] Call `GET /api/notifications` → See empty array
- [ ] Create a post as User A
- [ ] Login as User B (different terminal)
- [ ] Like the post from User B
- [ ] Go back to User A
- [ ] Call `GET /api/notifications` → See like notification
- [ ] Call `GET /api/notifications/unread/count` → See count = 1
- [ ] Call `PUT /api/notifications/:id/read` → Mark as read
- [ ] Call `GET /api/notifications` → See `isRead: true`
- [ ] Create 5 more notifications
- [ ] Call `PUT /api/notifications/mark-all/read`
- [ ] Verify all are marked as read

---

## Integration Points in Existing Code

### When Like Happens (post.service.ts)
```typescript
await notificationService.createNotification(
  post.authorId,
  userId,
  'LIKE',
  `${authorName} liked your post`,
  postId
);
```

### When Comment Happens (post.service.ts)
```typescript
await notificationService.createNotification(
  post.authorId,
  userId,
  'COMMENT',
  `${commenterName} commented on your post`,
  postId
);
```

### When RSVP Happens (event.service.ts)
```typescript
await notificationService.createNotification(
  event.createdBy,
  userId,
  'EVENT_RSVP',
  `${userName} registered for your event`,
  eventId
);
```

---

## Response Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Notification fetched/updated |
| 400 | Bad request | Missing notification ID |
| 401 | Unauthorized | Invalid/missing token |
| 404 | Not found | Notification doesn't exist |
| 500 | Server error | Database error |

---

## Performance Tips

1. **Poll at 30-60 second intervals**, not every second
2. **Use pagination** - `limit=20` is standard
3. **Cache unread count** on frontend to avoid excessive calls
4. **Only mark as read** when user clicks, not automatically
5. **Debounce** mark-all-as-read to prevent spam clicks

---

## Summary

**Phase 5 provides:**
- Automatic notifications on like/comment/RSVP
- Database persistence
- Mark as read functionality
- Unread count tracking
- Full API documented with examples

**Integration:** Add notification bell to header with unread count badge, refresh every 30 seconds!

---

**Last Updated:** December 31, 2025
