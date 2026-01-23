# How to Create Test Notifications

## ✅ Good News: Your Notification System is Working!

The logs confirm everything is working correctly:
- ✅ API requests successful (200 status)
- ✅ Authentication working (valid token)
- ✅ Backend responding correctly
- ✅ Socket.IO connected for real-time updates

**The only issue: Your database has 0 notifications!**

## Quick Ways to Create Notifications

### Method 1: Use Existing Features (Recommended)

Notifications are automatically created when users interact with content:

1. **Get a LIKE notification**:
   - Have another user like your post
   - Or create a second account and like your own posts

2. **Get a COMMENT notification**:
   - Have someone comment on your post
   - Creates a notification automatically

3. **Get an EVENT_RSVP notification**:
   - Have someone RSVP to your event
   - Creates a notification automatically

### Method 2: Directly Insert into MongoDB

If you have MongoDB Compass or mongo shell access:

```javascript
// Connect to your database
use linsta

// Insert test notifications
db.notifications.insertMany([
  {
    userId: ObjectId("6953d04158fd982dfa2e1dd6"),
    type: "LIKE",
    message: "John liked your post",
    referenceId: ObjectId(),
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60000)
  },
  {
    userId: ObjectId("6953d04158fd982dfa2e1dd6"),
    type: "COMMENT",
    message: "Sarah commented: 'Great content!'",
    referenceId: ObjectId(),
    isRead: false,
    createdAt: new Date(Date.now() - 15 * 60000)
  },
  {
    userId: ObjectId("6953d04158fd982dfa2e1dd6"),
    type: "EVENT_RSVP",
    message: "Mike RSVP'd to your event",
    referenceId: ObjectId(),
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60000)
  }
])

// Check count
db.notifications.countDocuments({ userId: ObjectId("6953d04158fd982dfa2e1dd6") })
```

### Method 3: Create Backend API Endpoint

Add a test endpoint to create notifications (for development only):

```typescript
// In backend/src/modules/notifications/notification.routes.ts

// Add this route (development only!)
router.post('/test/create', authMiddleware, async (req, res) => {
  const userId = req.userId!;
  
  const testNotifications = [
    {
      userId: new mongoose.Types.ObjectId(userId),
      type: 'LIKE',
      message: 'Test User liked your post',
      referenceId: new mongoose.Types.ObjectId(),
      isRead: false,
    },
    {
      userId: new mongoose.Types.ObjectId(userId),
      type: 'COMMENT',
      message: 'Test User commented: "Nice!"',
      referenceId: new mongoose.Types.ObjectId(),
      isRead: false,
    }
  ];
  
  await Notification.insertMany(testNotifications);
  res.json({ message: 'Test notifications created', count: testNotifications.length });
});
```

Then call it from your app or Postman:
```
POST http://192.168.43.114:5000/api/notifications/test/create
Authorization: Bearer YOUR_TOKEN
```

## Test the System

Once you have notifications in the database:

1. **Restart the app** (if needed)
2. **Navigate to Notifications screen**
3. **You should see**:
   ```
   ✅ Notifications loaded: X items
   ✅ Converted notifications: X
   ✅ Unread count loaded: X
   ```

4. **Test real-time updates**:
   - Keep Notifications screen open
   - Create a new notification via another user/method
   - Should appear instantly via Socket.IO

## What You're Seeing Now

Current logs show:
```
✅ Notifications loaded: 0 items
ℹ️ No notifications found
```

This is **correct behavior** - the system is working, just no data to display.

## Summary

🎉 **Your notification system is fully functional!**

What's working:
- ✅ Frontend fetching notifications correctly
- ✅ Backend API responding correctly
- ✅ Authentication working
- ✅ Socket.IO real-time connection active
- ✅ Error handling in place

What you need:
- 📝 Test notifications in the database
- 👥 Users to interact with your content

**Next step**: Use one of the methods above to create test notifications, then check the app again!
