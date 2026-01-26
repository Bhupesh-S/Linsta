# Group Chat Feature - API Documentation

**Status:** ✅ Complete & Production Ready  
**Date:** January 26, 2026

---

## Overview

Group Chat feature enables real-time group messaging with member management, message persistence, and Socket.IO real-time updates.

---

## Database Collections

### Groups Collection
```javascript
{
  _id: ObjectId,
  name: String,                    // Required, max 100
  description: String,             // Optional, max 500
  createdBy: ObjectId (ref User),  // Group creator
  members: [ObjectId (ref User)],  // Array of member IDs
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- (createdBy, createdAt) - Find groups created by user
- (members) - Find groups containing specific user
- name (text) - Full-text search on group name

---

### Group Messages Collection
```javascript
{
  _id: ObjectId,
  groupId: ObjectId (ref Group),   // Group this message belongs to
  senderId: ObjectId (ref User),   // Who sent the message
  message: String,                 // Message content, max 1000
  createdAt: Date
}
```

**Indexes:**
- (groupId, createdAt DESC) - Get messages for group
- (senderId, createdAt DESC) - Get user's messages
- groupId - Find all messages for group

---

## REST API Endpoints

### 1. Create Group
```
POST /api/groups
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Project Team",
  "description": "Discussing the new project"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Group created successfully",
  "data": {
    "_id": "...",
    "name": "Project Team",
    "description": "Discussing the new project",
    "createdBy": "...",
    "members": ["userId1"],
    "createdAt": "2026-01-26T..."
  }
}
```

**Error Cases:**
- 400: Group name is required
- 401: Unauthorized (missing token)

---

### 2. Get User's Groups
```
GET /api/groups?limit=100&skip=0
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "groupId1",
      "name": "Project Team",
      "description": "...",
      "createdBy": {
        "_id": "...",
        "name": "John",
        "email": "john@example.com"
      },
      "members": ["userId1", "userId2"],
      "createdAt": "2026-01-26T..."
    }
  ],
  "pagination": {
    "total": 15,
    "limit": 100,
    "skip": 0,
    "hasMore": false
  }
}
```

---

### 3. Get Group Details
```
GET /api/groups/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "groupId123",
    "name": "Project Team",
    "description": "Discussing the new project",
    "createdBy": {
      "_id": "...",
      "name": "John",
      "email": "john@example.com"
    },
    "members": [
      {
        "_id": "userId1",
        "name": "John",
        "email": "john@example.com",
        "profilePicture": "url..."
      },
      {
        "_id": "userId2",
        "name": "Jane",
        "email": "jane@example.com",
        "profilePicture": "url..."
      }
    ],
    "createdAt": "2026-01-26T..."
  }
}
```

---

### 4. Join Group
```
POST /api/groups/:id/join
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User joined group successfully",
  "data": {
    "_id": "groupId123",
    "name": "Project Team",
    "members": ["userId1", "userId2", "userId3"],
    "createdAt": "2026-01-26T..."
  }
}
```

**Error Cases:**
- 404: Group not found
- 409: User is already a member of this group
- 401: Unauthorized

---

### 5. Leave Group
```
POST /api/groups/:id/leave
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User left group successfully"
}
```

**Error Cases:**
- 404: Group not found or user not a member
- 401: Unauthorized

---

### 6. Get Group Messages
```
GET /api/groups/:id/messages?limit=50&skip=0
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "messageId1",
      "groupId": "groupId123",
      "senderId": {
        "_id": "userId1",
        "name": "John",
        "profilePicture": "url...",
        "email": "john@example.com"
      },
      "message": "Great work everyone!",
      "createdAt": "2026-01-26T12:30:00Z"
    },
    {
      "_id": "messageId2",
      "groupId": "groupId123",
      "senderId": {
        "_id": "userId2",
        "name": "Jane",
        "profilePicture": "url...",
        "email": "jane@example.com"
      },
      "message": "Thanks! Let's continue tomorrow",
      "createdAt": "2026-01-26T12:31:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 50,
    "skip": 0,
    "hasMore": true
  }
}
```

**Error Cases:**
- 404: Group not found
- 403: You are not a member of this group
- 401: Unauthorized

---

### 7. Send Message to Group
```
POST /api/groups/:id/message
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Let's discuss the timeline"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "_id": "messageId123",
    "groupId": "groupId123",
    "senderId": {
      "_id": "userId1",
      "name": "John",
      "profilePicture": "url..."
    },
    "message": "Let's discuss the timeline",
    "createdAt": "2026-01-26T12:32:00Z"
  }
}
```

**Error Cases:**
- 400: Message cannot be empty
- 403: You are not a member of this group
- 404: Group not found
- 401: Unauthorized

---

## Socket.IO Real-Time Events

### Client-to-Server Events

#### 1. Join Group (On Connection)
```javascript
socket.emit('join_group', {
  groupId: 'groupId123',
  userId: 'userId456'
});
```

#### 2. Send Group Message
```javascript
socket.emit('send_group_message', {
  groupId: 'groupId123',
  userId: 'userId456',
  message: 'Hello everyone!'
});
```

#### 3. Leave Group
```javascript
socket.emit('leave_group', {
  groupId: 'groupId123',
  userId: 'userId456'
});
```

---

### Server-to-Client Events

#### 1. Message Received
```javascript
socket.on('receive_group_message', {
  _id: 'messageId123',
  groupId: 'groupId123',
  senderId: {
    _id: 'userId456',
    name: 'John',
    profilePicture: 'url...'
  },
  message: 'Hello everyone!',
  createdAt: '2026-01-26T...'
});
```

#### 2. User Joined
```javascript
socket.on('user_joined_group', {
  groupId: 'groupId123',
  userId: 'userId789',
  timestamp: '2026-01-26T...'
});
```

#### 3. User Left
```javascript
socket.on('user_left_group', {
  groupId: 'groupId123',
  userId: 'userId789',
  timestamp: '2026-01-26T...'
});
```

#### 4. Error
```javascript
socket.on('error', {
  message: 'Error description'
});
```

---

## Business Rules

### Group Creation
- Creator becomes a member automatically
- Group name is required (max 100 chars)
- Description is optional (max 500 chars)

### Member Management
- Only group members can send messages
- Users can join any group
- Users can leave any group they're a member of
- Creator is not special (can also leave/be removed)
- No deletion logic (groups persist)

### Messaging
- Only members can send messages
- Messages max 1000 characters
- Messages are persisted immediately
- Timestamps are server-generated

### Authorization
- Auth required on all write operations (POST/DELETE)
- Group details visible to everyone (public)
- Messages only visible to group members

---

## Error Handling

| Code | Scenario | Message |
|------|----------|---------|
| 201 | Message created | "Message sent successfully" |
| 200 | Operation successful | "Operation successful" |
| 400 | Invalid input | "Group name is required" |
| 401 | Missing/invalid auth | "Unauthorized" |
| 403 | Not a member | "You are not a member of this group" |
| 404 | Not found | "Group not found" |
| 409 | Duplicate | "User is already a member of this group" |
| 500 | Server error | "Internal server error" |

---

## Pagination

All list endpoints support pagination:

```
GET /endpoint?limit=50&skip=0
```

**Guidelines:**
- Default `limit`: 100 (messages), 100 (groups)
- Max `limit`: 100
- Default `skip`: 0
- Check `hasMore` to determine if more data exists
- Increment `skip` by `limit` to get next page

---

## Authentication

All write operations require JWT token in Authorization header:

```
Authorization: Bearer <jwt_token>
```

**Token Format:**
```javascript
{
  "userId": "...",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234671490
}
```

---

## Examples

### Example 1: Create and Use Group

**Step 1: Create Group**
```bash
curl -X POST http://localhost:5000/api/groups \
  -H "Authorization: Bearer token123" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Engineering Team",
    "description": "For discussing technical matters"
  }'
```

**Step 2: Join Group (User 2)**
```bash
curl -X POST http://localhost:5000/api/groups/groupId123/join \
  -H "Authorization: Bearer token456"
```

**Step 3: Send Message**
```bash
curl -X POST http://localhost:5000/api/groups/groupId123/message \
  -H "Authorization: Bearer token123" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Let's start with the architecture discussion"
  }'
```

**Step 4: Get Messages**
```bash
curl http://localhost:5000/api/groups/groupId123/messages \
  -H "Authorization: Bearer token123"
```

---

### Example 2: Real-Time Chat with Socket.IO

**Client-side (JavaScript):**
```javascript
import io from 'socket.io-client';

// Connect with authentication
const socket = io('http://localhost:5000', {
  auth: {
    token: 'jwt_token_here'
  }
});

// Join group
socket.emit('join_group', {
  groupId: 'groupId123',
  userId: 'userId456'
});

// Listen for new messages
socket.on('receive_group_message', (data) => {
  console.log(`${data.senderId.name}: ${data.message}`);
});

// Send message
socket.emit('send_group_message', {
  groupId: 'groupId123',
  userId: 'userId456',
  message: 'Hello team!'
});

// Listen for user joined
socket.on('user_joined_group', (data) => {
  console.log(`User ${data.userId} joined`);
});

// Leave group
socket.emit('leave_group', {
  groupId: 'groupId123',
  userId: 'userId456'
});
```

---

## Best Practices

1. **Message Size:** Keep messages under 1000 characters
2. **Pagination:** Always use pagination on message lists
3. **Real-Time:** Use Socket.IO for live chat experience
4. **Membership Check:** Always verify user is member before accessing messages
5. **Error Handling:** Handle 403 Forbidden when not a member

---

## Rate Limiting

Group chat endpoints subject to global rate limiting:
- **Default:** 100 requests per 15 minutes per IP
- **Response:** 429 status with `Retry-After` header

---

## Testing

### Health Check
```bash
curl http://localhost:5000/health
```

### Create Test Group
```bash
curl -X POST http://localhost:5000/api/groups \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Group"}'
```

### List User's Groups
```bash
curl http://localhost:5000/api/groups \
  -H "Authorization: Bearer token"
```

---

## Performance Considerations

- Messages indexed by (groupId, createdAt) for fast pagination
- Groups indexed by members for quick lookup
- Text search available on group names
- Lean queries for read-only operations

---

## Future Enhancements

1. **Message Editing:** Edit/delete sent messages
2. **Read Receipts:** Track message reads
3. **Typing Indicators:** Show who's typing
4. **Message Search:** Search within group messages
5. **File Sharing:** Share media in group
6. **Pinned Messages:** Pin important messages
7. **Group Roles:** Admin, moderator roles
8. **Notifications:** Group message notifications

---

## Summary

**Endpoints:** 7  
**Collections:** 2  
**Real-time Events:** 4  
**Status:** Production Ready  

All group chat functionality is fully implemented and ready for deployment.

