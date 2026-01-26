# Group Chat - Quick Reference Guide

**Status:** ✅ Production Ready  
**Last Updated:** January 26, 2026

---

## Quick Start

### 1. API Endpoints Cheat Sheet

```bash
# Create group
curl -X POST http://localhost:5000/api/groups \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name":"Team","description":"Group description"}'

# Get my groups
curl http://localhost:5000/api/groups \
  -H "Authorization: Bearer TOKEN"

# Get group details (public)
curl http://localhost:5000/api/groups/GROUP_ID

# Join group
curl -X POST http://localhost:5000/api/groups/GROUP_ID/join \
  -H "Authorization: Bearer TOKEN"

# Leave group
curl -X POST http://localhost:5000/api/groups/GROUP_ID/leave \
  -H "Authorization: Bearer TOKEN"

# Get messages
curl http://localhost:5000/api/groups/GROUP_ID/messages \
  -H "Authorization: Bearer TOKEN"

# Send message
curl -X POST http://localhost:5000/api/groups/GROUP_ID/message \
  -H "Authorization: Bearer TOKEN" \
  -d '{"message":"Hello!"}'
```

---

## Socket.IO Quick Start

### Connect & Join Group

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: { token: 'YOUR_JWT_TOKEN' }
});

socket.on('connect', () => {
  socket.emit('join_group', {
    groupId: 'GROUP_ID',
    userId: 'YOUR_USER_ID'
  });
});
```

### Send & Receive Messages

```javascript
// Send message
socket.emit('send_group_message', {
  groupId: 'GROUP_ID',
  userId: 'YOUR_USER_ID',
  message: 'Hello team!'
});

// Receive message
socket.on('receive_group_message', (data) => {
  console.log(`${data.senderId.name}: ${data.message}`);
});
```

### Listen for Events

```javascript
// User joined
socket.on('user_joined_group', (data) => {
  console.log(`User ${data.userId} joined`);
});

// User left
socket.on('user_left_group', (data) => {
  console.log(`User ${data.userId} left`);
});

// Error
socket.on('error', (data) => {
  console.error('Error:', data.message);
});
```

---

## Pagination

### List Endpoints

All list endpoints support pagination:

```bash
# Get first 10 groups
curl "http://localhost:5000/api/groups?limit=10&skip=0"

# Get next 10 groups
curl "http://localhost:5000/api/groups?limit=10&skip=10"

# Get first 50 messages
curl "http://localhost:5000/api/groups/GROUP_ID/messages?limit=50&skip=0"
```

### Response Format

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 150,
    "limit": 10,
    "skip": 0,
    "hasMore": true
  }
}
```

**Key Points:**
- `total`: Total number of items
- `hasMore`: Whether more items exist
- `limit`: Items returned per page
- `skip`: Number of items skipped

---

## Error Codes

| Code | Meaning | Cause |
|------|---------|-------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid input (empty message, missing name) |
| 401 | Unauthorized | Missing/invalid JWT token |
| 403 | Forbidden | Not a group member |
| 404 | Not Found | Group/message not found |
| 409 | Conflict | User already a member |
| 500 | Error | Server error |

---

## Common Use Cases

### Use Case 1: Create Group & Send Message

```bash
# Step 1: Create group
RESPONSE=$(curl -X POST http://localhost:5000/api/groups \
  -H "Authorization: Bearer TOKEN1" \
  -d '{"name":"Engineering"}')
GROUP_ID=$(echo $RESPONSE | jq -r '.data._id')

# Step 2: User 2 joins
curl -X POST http://localhost:5000/api/groups/$GROUP_ID/join \
  -H "Authorization: Bearer TOKEN2"

# Step 3: Send message
curl -X POST http://localhost:5000/api/groups/$GROUP_ID/message \
  -H "Authorization: Bearer TOKEN1" \
  -d '{"message":"Welcome to the team!"}'
```

### Use Case 2: Real-Time Chat

```javascript
// User 1 client
const socket1 = io(..., { auth: { token: 'TOKEN1' } });
socket1.emit('join_group', { groupId, userId: 'user1' });

// User 2 client
const socket2 = io(..., { auth: { token: 'TOKEN2' } });
socket2.emit('join_group', { groupId, userId: 'user2' });

// User 1 sends message (both receive it)
socket1.emit('send_group_message', {
  groupId, userId: 'user1', message: 'Hi!'
});

socket1.on('receive_group_message', (msg) => {
  console.log('User 1 received:', msg);
});

socket2.on('receive_group_message', (msg) => {
  console.log('User 2 received:', msg);
});
```

---

## Database Queries

### MongoDB Cheat Sheet

```javascript
// Find groups created by user
db.groups.find({ createdBy: ObjectId('USER_ID') })

// Find groups containing user
db.groups.find({ members: ObjectId('USER_ID') })

// Get all messages for group
db.group_messages.find({ groupId: ObjectId('GROUP_ID') })
  .sort({ createdAt: -1 }).limit(50)

// Count messages in group
db.group_messages.countDocuments({ groupId: ObjectId('GROUP_ID') })

// Delete test data
db.groups.deleteMany({ createdBy: ObjectId('TEST_USER_ID') })
db.group_messages.deleteMany({ groupId: ObjectId('TEST_GROUP_ID') })
```

---

## Code Structure

### Service Methods

```typescript
// Group service
GroupService.createGroup(userId, name, description?)
GroupService.getGroup(groupId)
GroupService.joinGroup(userId, groupId)
GroupService.leaveGroup(userId, groupId)
GroupService.isMember(userId, groupId)
GroupService.getUserGroups(userId, limit, skip)

// Message service
GroupMessageService.sendMessage(userId, groupId, message)
GroupMessageService.getMessages(groupId, userId, limit, skip)
GroupMessageService.deleteMessage(messageId, userId)
```

### How to Use Services

```typescript
import { GroupService } from '../modules/groups/group.service';
import { GroupMessageService } from '../modules/groups/groupmessage.service';

// Create group
const result = await GroupService.createGroup(
  'user123',
  'Engineering Team',
  'Discussion group'
);
console.log(result.data._id); // Group ID

// Send message
const msg = await GroupMessageService.sendMessage(
  'user123',
  'groupId456',
  'Hello team!'
);
console.log(msg.data._id); // Message ID
```

---

## Type Definitions

### Key Interfaces

```typescript
// Group
interface IGroup {
  _id: ObjectId;
  name: string;
  description?: string;
  createdBy: ObjectId;
  members: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Message
interface IGroupMessage {
  _id: ObjectId;
  groupId: ObjectId;
  senderId: ObjectId;
  message: string;
  createdAt: Date;
}

// Request
interface CreateGroupRequest {
  name: string;
  description?: string;
}

interface SendMessageRequest {
  message: string;
}
```

---

## Common Scenarios

### Scenario 1: Non-member tries to send message

```bash
curl -X POST http://localhost:5000/api/groups/GROUP_ID/message \
  -H "Authorization: Bearer NON_MEMBER_TOKEN" \
  -d '{"message":"Hello"}'

# Response: 403 Forbidden
{
  "success": false,
  "message": "You are not a member of this group"
}
```

### Scenario 2: Get messages from non-member

```bash
curl http://localhost:5000/api/groups/GROUP_ID/messages \
  -H "Authorization: Bearer NON_MEMBER_TOKEN"

# Response: 403 Forbidden
{
  "success": false,
  "message": "You are not a member of this group"
}
```

### Scenario 3: User already member (join)

```bash
curl -X POST http://localhost:5000/api/groups/GROUP_ID/join \
  -H "Authorization: Bearer EXISTING_MEMBER_TOKEN"

# Response: 409 Conflict
{
  "success": false,
  "message": "User is already a member of this group"
}
```

---

## Performance Tips

1. **Pagination:** Always paginate large lists
   ```bash
   # Good
   GET /api/groups?limit=50&skip=0
   
   # Avoid without pagination
   GET /api/groups  # Gets ALL groups
   ```

2. **Message Retrieval:** Use pagination
   ```bash
   # Good
   GET /api/groups/ID/messages?limit=50&skip=0
   
   # Avoid
   GET /api/groups/ID/messages  # Gets ALL messages
   ```

3. **Check Membership First:** Use isMember for authorization
   ```typescript
   const isMember = await GroupService.isMember(userId, groupId);
   if (!isMember) {
     // Return 403 early
   }
   ```

4. **Real-Time vs REST:** Use Socket.IO for chat, REST for management
   ```
   REST API → Group management (create, join, leave)
   Socket.IO → Real-time messaging
   ```

---

## Troubleshooting

### Issue: 401 Unauthorized on all requests

**Solution:** Verify JWT token is:
- Present in Authorization header
- Valid (not expired)
- Format: `Authorization: Bearer <token>`

### Issue: 403 Forbidden when sending message

**Solution:** Verify user is a group member:
```bash
curl http://localhost:5000/api/groups/GROUP_ID
```
Check if `userId` is in `members` array

### Issue: Messages not appearing in real-time

**Solution:** Ensure:
1. Socket connected (`socket.connected === true`)
2. `join_group` event emitted
3. User is group member
4. Room name is correct (`group_${groupId}`)

### Issue: Duplicate members in group

**Solution:** This shouldn't happen - joinGroup prevents duplicates with 409 error. If it occurs:
```javascript
db.groups.updateOne(
  { _id: ObjectId('GROUP_ID') },
  { $push: { members: ObjectId('USER_ID') } }
)
```

---

## Testing Commands

### Quick Test All Endpoints

```bash
# Create test group
curl -X POST http://localhost:5000/api/groups \
  -H "Authorization: Bearer TOKEN1" \
  -H "Content-Type: application/json" \
  -d '{"name":"Quick Test Group"}'

# Should return 201 Created with group details
```

### Load Test (Send 100 messages)

```bash
for i in {1..100}
do
  curl -X POST http://localhost:5000/api/groups/GROUP_ID/message \
    -H "Authorization: Bearer TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"message\": \"Message $i\"}"
done
```

### Real-Time Test

```javascript
// Open two browser consoles

// Client 1
const s1 = io('http://localhost:5000', { auth: { token: 'T1' } });
s1.on('connect', () => s1.emit('join_group', { groupId: 'ID', userId: 'u1' }));
s1.on('receive_group_message', m => console.log('S1 received:', m));

// Client 2
const s2 = io('http://localhost:5000', { auth: { token: 'T2' } });
s2.on('connect', () => s2.emit('join_group', { groupId: 'ID', userId: 'u2' }));
s2.on('receive_group_message', m => console.log('S2 received:', m));

// S1 sends message
s1.emit('send_group_message', { groupId: 'ID', userId: 'u1', message: 'Hi!' });

// Both should receive it
```

---

## Key Concepts

### Authentication
- **JWT Required:** All write operations (POST, DELETE)
- **Public Read:** GET /api/groups/:id (no auth needed)
- **Private Read:** GET /api/groups, /messages (auth required)

### Authorization
- **Creator:** Automatically added as member
- **Members:** Only members can send/read messages
- **Public:** Group details visible to all

### Real-Time Rooms
- **Format:** `group_${groupId}`
- **Members:** Only group members join room
- **Broadcast:** Messages sent to all in room

### Pagination
- **Limit:** Max 100 items per request
- **Offset:** Use skip to paginate
- **Check hasMore:** Determine if more data exists

---

## API Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* Response data */ },
  "pagination": { /* Optional */ }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

---

## Integration Checklist

- [ ] Route registered: `/api/groups`
- [ ] Socket handler: `group.socket.ts`
- [ ] Models created: `group.model.ts`, `groupmessage.model.ts`
- [ ] Services created: `group.service.ts`, `groupmessage.service.ts`
- [ ] Controller created: `group.controller.ts`
- [ ] Types defined: `group.types.ts`
- [ ] Routes defined: `group.routes.ts`
- [ ] App.ts updated with routes
- [ ] Socket.ts updated with handlers
- [ ] TypeScript build successful
- [ ] All tests passing

---

## Resources

- **Full API Docs:** [GROUP_CHAT_API.md](GROUP_CHAT_API.md)
- **Testing Guide:** [GROUP_CHAT_TESTING_GUIDE.md](GROUP_CHAT_TESTING_GUIDE.md)
- **Implementation:** [GROUP_CHAT_IMPLEMENTATION_SUMMARY.md](GROUP_CHAT_IMPLEMENTATION_SUMMARY.md)

---

## Command Cheat Sheet

```bash
# Build project
npm run build

# Start dev server
npm run dev

# Run tests
npm test

# Check MongoDB connection
mongosh

# Kill port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

---

**Version:** 1.0  
**Status:** Production Ready  
**Build:** ✅ SUCCESS

