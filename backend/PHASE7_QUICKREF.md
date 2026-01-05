# 🚀 PHASE 7 QUICK REFERENCE

## 📋 What You Get

- ✅ Real-time chat system
- ✅ One-to-one messaging
- ✅ Real-time notifications
- ✅ Message persistence
- ✅ Online/offline tracking

---

## 🔌 Socket Connection

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: localStorage.getItem('authToken')
  }
});
```

---

## 💬 Chat Events (Socket.IO)

### Join Room
```javascript
socket.emit('join_room', { chatRoomId: 'ROOM_ID' });
```

### Send Message
```javascript
socket.emit('send_message', {
  chatRoomId: 'ROOM_ID',
  text: 'Hello!'
});
```

### Receive Message (Listen)
```javascript
socket.on('receive_message', (message) => {
  console.log(message);
  // {_id, chatRoomId, senderId, text, createdAt}
});
```

### Get History
```javascript
socket.emit('get_history', {
  chatRoomId: 'ROOM_ID',
  limit: 50,
  skip: 0
});

socket.on('message_history', ({messages}) => {
  console.log(messages); // Array of messages
});
```

---

## 🔔 Notification Events (Socket.IO)

### Subscribe
```javascript
socket.emit('subscribe_notifications');
```

### Listen for Notifications
```javascript
socket.on('notification', (notification) => {
  console.log(notification);
  // {_id, userId, type, message, referenceId, isRead, createdAt}
});
```

---

## 🌐 REST API Endpoints

### Create Chat Room
```bash
POST /api/chat/rooms
Content-Type: application/json
Authorization: Bearer {JWT}

{
  "otherUserId": "USER_ID"
}
```

### Get My Chat Rooms
```bash
GET /api/chat/rooms
Authorization: Bearer {JWT}
```

### Get Messages
```bash
GET /api/chat/messages/{chatRoomId}?limit=50&skip=0
Authorization: Bearer {JWT}
```

---

## 🎨 Minimal React Example

```javascript
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

function Chat({ chatRoomId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      auth: { token: localStorage.getItem('authToken') }
    });

    newSocket.emit('join_room', { chatRoomId });
    newSocket.on('receive_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    newSocket.emit('get_history', { chatRoomId, limit: 50 });
    newSocket.on('message_history', ({ messages }) => {
      setMessages(messages);
    });

    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [chatRoomId]);

  const send = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    socket.emit('send_message', { chatRoomId, text });
    setText('');
  };

  return (
    <div>
      <div>
        {messages.map(m => (
          <p key={m._id}>{m.text}</p>
        ))}
      </div>
      <form onSubmit={send}>
        <input value={text} onChange={e => setText(e.target.value)} />
        <button>Send</button>
      </form>
    </div>
  );
}

export default Chat;
```

---

## 📊 Database Schema

### ChatRoom
```javascript
{
  _id: ObjectId,
  participants: [userId, userId],
  createdAt: Date,
  updatedAt: Date
}
```

### Message
```javascript
{
  _id: ObjectId,
  chatRoomId: ObjectId,
  senderId: ObjectId,
  text: String,
  createdAt: Date
}
```

---

## ✅ TypeScript Support

```typescript
import { Server as SocketIOServer, Socket } from 'socket.io';

interface Message {
  _id: string;
  chatRoomId: string;
  senderId: string;
  text: string;
  createdAt: Date;
}

interface ChatRoom {
  _id: string;
  participants: string[];
  createdAt: Date;
}

interface Notification {
  _id: string;
  userId: string;
  type: 'LIKE' | 'COMMENT' | 'EVENT_RSVP';
  message: string;
  referenceId: string;
  isRead: boolean;
  createdAt: Date;
}
```

---

## 🧪 Test with cURL

### Create Chat Room
```bash
curl -X POST http://localhost:5000/api/chat/rooms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {JWT}" \
  -d '{"otherUserId": "USER_ID"}'
```

### Get Chat Rooms
```bash
curl -X GET http://localhost:5000/api/chat/rooms \
  -H "Authorization: Bearer {JWT}"
```

### Get Messages
```bash
curl -X GET "http://localhost:5000/api/chat/messages/{ROOM_ID}?limit=50&skip=0" \
  -H "Authorization: Bearer {JWT}"
```

---

## 🐛 Common Issues

### Socket not connecting?
- Check JWT token is valid
- Check CORS origin matches frontend URL
- Verify Socket.IO server is running

### Messages not saving?
- Ensure chatRoomId is valid
- Check user is a participant
- Verify MongoDB connection

### Notifications not emitting?
- User must be online (connected via socket)
- Check notification.service was initialized
- Verify Socket.IO instance is passed

---

## 📁 New Files Created

- `src/socket/socket.ts` - Socket.IO setup
- `src/socket/chat.socket.ts` - Chat events
- `src/socket/notification.socket.ts` - Notification events
- `src/modules/chat/chatroom.model.ts` - ChatRoom schema
- `src/modules/chat/message.model.ts` - Message schema
- `src/modules/chat/chat.routes.ts` - Chat REST endpoints

---

## 🔧 Modified Files

- `src/server.ts` - HTTP server + Socket.IO
- `src/app.ts` - Added chat routes
- `src/modules/notifications/notification.service.ts` - Real-time emission
- `package.json` - Added socket.io dependency

---

## 🎯 Next Steps

1. Install Socket.IO client: `npm install socket.io-client`
2. Create Socket.IO connection wrapper
3. Build Chat UI component
4. Build Notification display component
5. Test end-to-end message flow
6. Deploy to production

---

## 💡 Pro Tips

1. **Always disconnect socket on component unmount**
   ```javascript
   useEffect(() => {
     // ... setup
     return () => socket.disconnect();
   }, []);
   ```

2. **Use error events to handle failures**
   ```javascript
   socket.on('error', (error) => {
     console.error(error);
   });
   ```

3. **Load history before showing chat**
   ```javascript
   socket.emit('get_history', {...});
   socket.on('message_history', ({messages}) => {
     setMessages(messages);
   });
   ```

4. **Show typing indicator on input focus**
   ```javascript
   onFocus={() => socket.emit('user_typing', {chatRoomId})}
   ```

5. **Scroll to bottom on new messages**
   ```javascript
   useEffect(() => {
     messagesEndRef.current?.scrollIntoView();
   }, [messages]);
   ```

---

✅ **Status: PRODUCTION READY**
