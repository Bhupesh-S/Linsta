# Group Chat - Testing & Verification Guide

**Status:** ✅ Production Ready  
**Last Updated:** January 26, 2026

---

## Quick Start Testing

### 1. Environment Setup

**Prerequisites:**
- Node.js running with `npm run dev` or similar
- MongoDB Atlas connected
- Valid JWT tokens for testing
- Postman or similar API client (or curl)
- Socket.IO client library (for real-time testing)

**Test Users:**
Create or use existing users with tokens:
```
User 1: user1Id = "user1token"
User 2: user2Id = "user2token"
User 3: user3Id = "user3token"
```

---

## REST API Testing

### Test Case 1: Create Group
**Objective:** Verify group creation with auth

```
POST http://localhost:5000/api/groups
Authorization: Bearer user1token
Content-Type: application/json

{
  "name": "Test Engineering Team",
  "description": "For API testing"
}
```

**Expected Result:**
```
Status: 201 Created
{
  "success": true,
  "message": "Group created successfully",
  "data": {
    "_id": "GROUP_ID",
    "name": "Test Engineering Team",
    "description": "For API testing",
    "createdBy": "user1Id",
    "members": ["user1Id"],
    "createdAt": "2026-01-26T..."
  }
}
```

**Validation Points:**
- ✅ Status is 201
- ✅ Group ID is generated
- ✅ Creator is in members array
- ✅ Only creator initially is member
- ✅ Timestamps created

**Save:** `GROUP_ID` for next tests

---

### Test Case 2: Create Group - Missing Name
**Objective:** Verify validation for required fields

```
POST http://localhost:5000/api/groups
Authorization: Bearer user1token
Content-Type: application/json

{
  "description": "No name provided"
}
```

**Expected Result:**
```
Status: 400 Bad Request
{
  "success": false,
  "message": "Group name is required"
}
```

---

### Test Case 3: Create Group - No Auth
**Objective:** Verify auth is required

```
POST http://localhost:5000/api/groups
Content-Type: application/json

{
  "name": "Unauthorized Group"
}
```

**Expected Result:**
```
Status: 401 Unauthorized
{
  "success": false,
  "message": "Unauthorized"
}
```

---

### Test Case 4: Get Group Details
**Objective:** Verify fetching group info

```
GET http://localhost:5000/api/groups/GROUP_ID
```

**Expected Result:**
```
Status: 200 OK
{
  "success": true,
  "data": {
    "_id": "GROUP_ID",
    "name": "Test Engineering Team",
    "description": "For API testing",
    "createdBy": {
      "_id": "user1Id",
      "name": "User 1",
      "email": "user1@example.com"
    },
    "members": [
      {
        "_id": "user1Id",
        "name": "User 1",
        "email": "user1@example.com"
      }
    ]
  }
}
```

---

### Test Case 5: Join Group
**Objective:** Verify user can join group

```
POST http://localhost:5000/api/groups/GROUP_ID/join
Authorization: Bearer user2token
```

**Expected Result:**
```
Status: 200 OK
{
  "success": true,
  "message": "User joined group successfully",
  "data": {
    "_id": "GROUP_ID",
    "members": ["user1Id", "user2Id"]
  }
}
```

**Validation Points:**
- ✅ User 2 now in members array
- ✅ User 1 still in members array
- ✅ No duplicates in members

---

### Test Case 6: Join Group - Already Member
**Objective:** Verify duplicate prevention

```
POST http://localhost:5000/api/groups/GROUP_ID/join
Authorization: Bearer user1token
```

**Expected Result:**
```
Status: 409 Conflict
{
  "success": false,
  "message": "User is already a member of this group"
}
```

---

### Test Case 7: Get User's Groups
**Objective:** Verify pagination on group list

```
GET http://localhost:5000/api/groups?limit=10&skip=0
Authorization: Bearer user1token
```

**Expected Result:**
```
Status: 200 OK
{
  "success": true,
  "data": [
    {
      "_id": "GROUP_ID",
      "name": "Test Engineering Team",
      "createdBy": {
        "_id": "user1Id",
        "name": "User 1"
      },
      "members": ["user1Id", "user2Id"],
      "createdAt": "2026-01-26T..."
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 10,
    "skip": 0,
    "hasMore": false
  }
}
```

**Validation Points:**
- ✅ Array of groups returned
- ✅ Pagination metadata included
- ✅ Only groups where user is member

---

### Test Case 8: Send Message
**Objective:** Verify message sending with membership check

```
POST http://localhost:5000/api/groups/GROUP_ID/message
Authorization: Bearer user1token
Content-Type: application/json

{
  "message": "This is a test message"
}
```

**Expected Result:**
```
Status: 201 Created
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "_id": "MESSAGE_ID",
    "groupId": "GROUP_ID",
    "senderId": {
      "_id": "user1Id",
      "name": "User 1"
    },
    "message": "This is a test message",
    "createdAt": "2026-01-26T12:34:56Z"
  }
}
```

**Save:** `MESSAGE_ID` for deletion testing (if implemented)

---

### Test Case 9: Send Message - Empty
**Objective:** Verify message validation

```
POST http://localhost:5000/api/groups/GROUP_ID/message
Authorization: Bearer user1token
Content-Type: application/json

{
  "message": ""
}
```

**Expected Result:**
```
Status: 400 Bad Request
{
  "success": false,
  "message": "Message cannot be empty"
}
```

---

### Test Case 10: Send Message - Not Member
**Objective:** Verify membership check

```
POST http://localhost:5000/api/groups/GROUP_ID/message
Authorization: Bearer user3token
Content-Type: application/json

{
  "message": "I'm not a member!"
}
```

**Expected Result:**
```
Status: 403 Forbidden
{
  "success": false,
  "message": "You are not a member of this group"
}
```

---

### Test Case 11: Get Messages
**Objective:** Verify paginated message retrieval

```
GET http://localhost:5000/api/groups/GROUP_ID/messages?limit=10&skip=0
Authorization: Bearer user1token
```

**Expected Result:**
```
Status: 200 OK
{
  "success": true,
  "data": [
    {
      "_id": "MESSAGE_ID",
      "groupId": "GROUP_ID",
      "senderId": {
        "_id": "user1Id",
        "name": "User 1"
      },
      "message": "This is a test message",
      "createdAt": "2026-01-26T12:34:56Z"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 10,
    "skip": 0,
    "hasMore": false
  }
}
```

**Validation Points:**
- ✅ Messages returned in chronological order
- ✅ Pagination metadata included
- ✅ Sender details populated

---

### Test Case 12: Get Messages - Not Member
**Objective:** Verify member-only access to messages

```
GET http://localhost:5000/api/groups/GROUP_ID/messages?limit=10&skip=0
Authorization: Bearer user3token
```

**Expected Result:**
```
Status: 403 Forbidden
{
  "success": false,
  "message": "You are not a member of this group"
}
```

---

### Test Case 13: Leave Group
**Objective:** Verify member can leave group

```
POST http://localhost:5000/api/groups/GROUP_ID/leave
Authorization: Bearer user2token
```

**Expected Result:**
```
Status: 200 OK
{
  "success": true,
  "message": "User left group successfully"
}
```

**Validation Points:**
- ✅ User 2 removed from members
- ✅ Other members remain
- ✅ Messages still exist

---

### Test Case 14: Leave Group - Not Member
**Objective:** Verify cannot leave non-member group

```
POST http://localhost:5000/api/groups/GROUP_ID/leave
Authorization: Bearer user3token
```

**Expected Result:**
```
Status: 404 Not Found
{
  "success": false,
  "message": "Group not found or user is not a member"
}
```

---

## Socket.IO Real-Time Testing

### Setup Socket Connection

```javascript
const io = require('socket.io-client');

const socket = io('http://localhost:5000', {
  auth: {
    token: 'user1token'  // Replace with actual JWT
  }
});

socket.on('connect', () => {
  console.log('Connected to Socket.IO server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from Socket.IO server');
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
});
```

---

### Test Case 15: Join Group Via Socket
**Objective:** Verify Socket.IO join_group event

```javascript
socket.emit('join_group', {
  groupId: 'GROUP_ID',
  userId: 'user1Id'
});

// Listen for confirmation
socket.on('user_joined_group', (data) => {
  console.log('Joined group:', data);
  // Expected:
  // {
  //   groupId: 'GROUP_ID',
  //   userId: 'user1Id',
  //   timestamp: '2026-01-26T...'
  // }
});
```

---

### Test Case 16: Send Message Via Socket
**Objective:** Verify real-time message sending

```javascript
// User 1 sends message
socket.emit('send_group_message', {
  groupId: 'GROUP_ID',
  userId: 'user1Id',
  message: 'Real-time message test'
});

// All members in group room receive it
socket.on('receive_group_message', (data) => {
  console.log('New message:', data);
  // Expected:
  // {
  //   _id: 'MESSAGE_ID',
  //   groupId: 'GROUP_ID',
  //   senderId: {
  //     _id: 'user1Id',
  //     name: 'User 1',
  //     profilePicture: 'url...'
  //   },
  //   message: 'Real-time message test',
  //   createdAt: '2026-01-26T...'
  // }
});
```

---

### Test Case 17: Send Message - Not Member (Socket)
**Objective:** Verify Socket.IO member check

Create 2 connections - one member (user1), one non-member (user3):

```javascript
// User 1 socket (member)
const socket1 = io(..., { auth: { token: 'user1token' } });

// User 3 socket (non-member)
const socket3 = io(..., { auth: { token: 'user3token' } });

// User 3 tries to send message
socket3.emit('send_group_message', {
  groupId: 'GROUP_ID',
  userId: 'user3Id',
  message: 'Should fail'
});

// User 3 should receive error
socket3.on('error', (data) => {
  console.log('Error:', data);
  // Expected: "You are not a member of this group"
});
```

---

### Test Case 18: Multiple Users Real-Time
**Objective:** Verify broadcast to all room members

**Setup:**
```javascript
// Create 2 connections for same group
const socket1 = io(..., { auth: { token: 'user1token' } });
const socket2 = io(..., { auth: { token: 'user2token' } });

// Both join same group
socket1.emit('join_group', { groupId: 'GROUP_ID', userId: 'user1Id' });
socket2.emit('join_group', { groupId: 'GROUP_ID', userId: 'user2Id' });

// User 1 sends message
socket1.emit('send_group_message', {
  groupId: 'GROUP_ID',
  userId: 'user1Id',
  message: 'Message from user 1'
});

// Both sockets should receive it
socket1.on('receive_group_message', (data) => {
  console.log('Socket 1 received:', data.message);  // "Message from user 1"
});

socket2.on('receive_group_message', (data) => {
  console.log('Socket 2 received:', data.message);  // "Message from user 1"
});
```

---

### Test Case 19: Leave Group Via Socket
**Objective:** Verify leave_group event

```javascript
socket.emit('leave_group', {
  groupId: 'GROUP_ID',
  userId: 'user1Id'
});

// Other users should see notification
socket2.on('user_left_group', (data) => {
  console.log('User left:', data);
  // Expected:
  // {
  //   groupId: 'GROUP_ID',
  //   userId: 'user1Id',
  //   timestamp: '2026-01-26T...'
  // }
});
```

---

### Test Case 20: Disconnect Cleanup
**Objective:** Verify socket cleanup on disconnect

```javascript
socket.disconnect();

// Verify socket disconnected
console.log('Socket connected:', socket.connected);  // false
```

---

## Load Testing Scenarios

### Scenario 1: Multiple Messages
**Objective:** Test message persistence and pagination

```bash
# Send 100 messages to group via API
for i in {1..100}
do
  curl -X POST http://localhost:5000/api/groups/GROUP_ID/message \
    -H "Authorization: Bearer user1token" \
    -H "Content-Type: application/json" \
    -d "{\"message\": \"Message $i\"}"
done

# Fetch with pagination
curl "http://localhost:5000/api/groups/GROUP_ID/messages?limit=10&skip=0" \
  -H "Authorization: Bearer user1token"

# Test different pages
curl "http://localhost:5000/api/groups/GROUP_ID/messages?limit=10&skip=10" \
  -H "Authorization: Bearer user1token"
```

---

### Scenario 2: Concurrent Messages (Socket.IO)
**Objective:** Test real-time broadcast with multiple senders

```javascript
// Simulate 5 concurrent senders
const sockets = [];
for (let i = 1; i <= 5; i++) {
  const socket = io(..., { auth: { token: `user${i}token` } });
  sockets.push(socket);
  
  socket.emit('join_group', { groupId: 'GROUP_ID', userId: `user${i}Id` });
}

// Each sends message every second
sockets.forEach((socket, i) => {
  setInterval(() => {
    socket.emit('send_group_message', {
      groupId: 'GROUP_ID',
      userId: `user${i+1}Id`,
      message: `Message from user ${i+1} at ${new Date()}`
    });
  }, 1000);
});

// Monitor incoming messages
sockets[0].on('receive_group_message', (data) => {
  console.log(`Received: ${data.message}`);
});
```

---

## Database Verification

### Check Groups Collection
```javascript
// MongoDB Shell / Compass
db.groups.find({ _id: ObjectId('GROUP_ID') }).pretty()

// Expected output:
{
  _id: ObjectId('...'),
  name: 'Test Engineering Team',
  description: 'For API testing',
  createdBy: ObjectId('user1Id'),
  members: [ObjectId('user1Id'), ObjectId('user2Id')],
  createdAt: ISODate('2026-01-26T...'),
  updatedAt: ISODate('2026-01-26T...')
}
```

### Check Messages Collection
```javascript
db.group_messages.find({ groupId: ObjectId('GROUP_ID') }).limit(5).pretty()

// Expected output:
{
  _id: ObjectId('...'),
  groupId: ObjectId('GROUP_ID'),
  senderId: ObjectId('user1Id'),
  message: 'This is a test message',
  createdAt: ISODate('2026-01-26T12:34:56Z')
}
```

### Verify Indexes
```javascript
db.groups.getIndexes()
db.group_messages.getIndexes()

// Should see:
// - (createdBy, createdAt)
// - (members)
// - name (text)
// - (groupId, createdAt)
// - (senderId, createdAt)
```

---

## Error Recovery Testing

### Test Case: Server Restart
1. Start server normally
2. Create group and send messages
3. Stop server (`Ctrl+C`)
4. Restart server
5. Verify group and messages still exist

**Expected:** Data persisted in MongoDB

---

### Test Case: Network Failure (Socket.IO)
1. Connect socket
2. Join group
3. Disconnect network
4. Attempt to send message
5. Reconnect
6. Retry message

**Expected:** Graceful error handling, no crashes

---

## Performance Benchmarks

Target benchmarks:

| Operation | Target Time | Accept |
|-----------|------------|--------|
| Create Group | < 100ms | < 200ms |
| Send Message | < 100ms | < 200ms |
| Get 50 Messages | < 200ms | < 500ms |
| List Groups | < 200ms | < 500ms |
| Socket Message Broadcast | < 50ms | < 100ms |

---

## Cleanup After Testing

```bash
# Remove test groups (MongoDB)
db.groups.deleteMany({ createdBy: ObjectId('testUserId') })

# Remove test messages
db.group_messages.deleteMany({ 
  groupId: ObjectId('testGroupId') 
})
```

---

## Test Checklist

- [ ] REST API: All 7 endpoints working
- [ ] Auth: 401/403 errors properly triggered
- [ ] Membership: Join, leave, and verification working
- [ ] Messages: Send, retrieve, and pagination working
- [ ] Socket.IO: Real-time events broadcasting correctly
- [ ] Validation: Empty messages and invalid inputs rejected
- [ ] Database: Collections and indexes created
- [ ] Error Handling: Proper status codes returned
- [ ] Pagination: Limit/skip working correctly
- [ ] Duplicates: Prevented for group members

---

## Summary

**Status:** ✅ Ready for Testing  
**Total Test Cases:** 20+  
**Coverage:** REST API + Socket.IO + Database  
**Build Status:** ✅ Passed

All group chat features are fully implemented and ready for comprehensive testing.

