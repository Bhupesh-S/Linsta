# Group Chat - Deployment & Operations Guide

**Status:** ✅ Production Ready  
**Version:** 1.0  
**Last Updated:** January 26, 2026

---

## Pre-Deployment Checklist

### Code Quality

- [ ] **TypeScript Build Successful**
  ```bash
  npm run build
  # Expected: > tsc (no output = success, 0 errors)
  ```

- [ ] **No Linting Errors**
  ```bash
  npm run lint
  # Should pass all checks
  ```

- [ ] **All Tests Passing**
  ```bash
  npm test
  # All test cases should pass
  ```

### Code Review

- [ ] Code follows existing patterns
- [ ] No breaking changes to existing modules
- [ ] Comments added for complex logic
- [ ] Error handling comprehensive
- [ ] Security practices followed

### Database

- [ ] MongoDB Atlas connection verified
- [ ] Collections auto-create on first write
- [ ] Indexes automatically created by Mongoose
- [ ] No manual migrations needed

### Dependencies

- [ ] All required packages installed
  ```bash
  npm install
  ```

- [ ] No version conflicts
  ```bash
  npm audit
  # Minimal vulnerabilities
  ```

---

## Deployment Steps

### Step 1: Prepare Environment

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Build TypeScript
npm run build

# Verify build success
echo $?  # Should output: 0
```

### Step 2: Verify Configuration

```bash
# Check environment variables
echo $MONGODB_URI      # Should be set
echo $JWT_SECRET       # Should be set
echo $NODE_ENV         # Should be 'production'
```

### Step 3: Database Preparation

```bash
# No manual database setup needed
# Collections will auto-create on first use
# Indexes will auto-create from Mongoose schemas

# Verify MongoDB connection
mongosh $MONGODB_URI --eval "db.adminCommand('ping')"
```

### Step 4: Start Application

```bash
# Development (with auto-reload)
npm run dev

# Production (no auto-reload)
npm start

# With PM2 (recommended for production)
pm2 start "npm start" --name "linsta-backend"
```

### Step 5: Health Check

```bash
# Check server is running
curl http://localhost:5000/health

# Expected response (or similar):
{"status":"ok","timestamp":"2026-01-26T..."}
```

### Step 6: Smoke Test

```bash
# Test group creation endpoint
curl -X POST http://localhost:5000/api/groups \
  -H "Authorization: Bearer YOUR_TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Smoke Test Group"}'

# Should return 201 Created with group data
```

---

## Post-Deployment Verification

### 1. API Endpoints

Test all 7 endpoints:

```bash
# Create group
curl -X POST http://localhost:5000/api/groups \
  -H "Authorization: Bearer TOKEN"

# Get user's groups
curl http://localhost:5000/api/groups \
  -H "Authorization: Bearer TOKEN"

# Get group details
curl http://localhost:5000/api/groups/GROUP_ID

# Join group
curl -X POST http://localhost:5000/api/groups/GROUP_ID/join \
  -H "Authorization: Bearer TOKEN"

# Send message
curl -X POST http://localhost:5000/api/groups/GROUP_ID/message \
  -H "Authorization: Bearer TOKEN" \
  -d '{"message":"Test"}'

# Get messages
curl http://localhost:5000/api/groups/GROUP_ID/messages \
  -H "Authorization: Bearer TOKEN"

# Leave group
curl -X POST http://localhost:5000/api/groups/GROUP_ID/leave \
  -H "Authorization: Bearer TOKEN"
```

**Expected:** All return 200/201 success responses

### 2. Socket.IO

```javascript
// Test real-time connection
const io = require('socket.io-client');
const socket = io('http://localhost:5000', {
  auth: { token: 'YOUR_TOKEN' }
});

socket.on('connect', () => {
  console.log('✅ Socket.IO connected');
  
  socket.emit('join_group', {
    groupId: 'TEST_GROUP_ID',
    userId: 'TEST_USER_ID'
  });
});

socket.on('user_joined_group', (data) => {
  console.log('✅ Received user_joined_group event');
});

socket.on('error', (error) => {
  console.error('❌ Socket error:', error);
});

// Cleanup
setTimeout(() => socket.disconnect(), 5000);
```

**Expected:** Connect successfully, receive events

### 3. Database Collections

```javascript
// Verify collections exist
db.groups.stats()           // Should have documents
db.group_messages.stats()   // May be empty initially

// Verify indexes
db.groups.getIndexes()      // Should show 3 indexes
db.group_messages.getIndexes()  // Should show 2 indexes
```

**Expected:** Collections exist with proper indexes

### 4. Error Handling

Test error responses:

```bash
# 400 - Missing required field
curl -X POST http://localhost:5000/api/groups \
  -H "Authorization: Bearer TOKEN" \
  -d '{}'
# Expected: 400 with "Group name is required"

# 401 - Missing auth
curl http://localhost:5000/api/groups
# Expected: 401 Unauthorized

# 403 - Not a member
curl http://localhost:5000/api/groups/GROUP_ID/messages
# Expected: 403 Forbidden

# 404 - Not found
curl http://localhost:5000/api/groups/nonexistent
# Expected: 404 Not Found

# 409 - Duplicate member
curl -X POST http://localhost:5000/api/groups/GROUP_ID/join \
  -H "Authorization: Bearer EXISTING_MEMBER_TOKEN"
# Expected: 409 Conflict
```

**Expected:** All error codes returned correctly

### 5. Logging

Check application logs for errors:

```bash
# Check log files (if configured)
tail -f logs/app.log

# Check for ERROR or WARN levels
grep -i "error" logs/app.log
grep -i "warn" logs/app.log

# Should have minimal warnings/errors (excluding startup info)
```

---

## Monitoring & Health Checks

### Application Monitoring

```bash
# Monitor process
pm2 status

# Watch logs in real-time
pm2 logs

# Monitor memory/CPU
pm2 monit
```

### Database Monitoring

```javascript
// Connection status
db.adminCommand('ping')

// Collection sizes
db.groups.stats().size
db.group_messages.stats().size

// Document counts
db.groups.countDocuments({})
db.group_messages.countDocuments({})

// Index performance
db.groups.aggregate([{ $indexStats: {} }])
```

### API Performance

Monitor response times:

```bash
# Using Apache Bench
ab -n 100 -c 10 http://localhost:5000/api/groups

# Expected:
# - Requests per second: > 100
# - Failed requests: 0
# - Mean time per request: < 100ms
```

---

## Troubleshooting

### Issue: Collections Don't Auto-Create

**Symptoms:** 404 errors when accessing groups/messages

**Solution:**
```bash
# Manually create collections (rare)
mongosh
> use linsta
> db.createCollection('groups')
> db.createCollection('group_messages')

# Or trigger creation:
curl -X POST http://localhost:5000/api/groups \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name":"Test"}'
```

### Issue: Indexes Not Created

**Symptoms:** Slow queries, timeouts

**Solution:**
```javascript
// In MongoDB
db.groups.createIndex({ createdBy: 1, createdAt: -1 })
db.groups.createIndex({ members: 1 })
db.groups.createIndex({ name: "text" })
db.group_messages.createIndex({ groupId: 1, createdAt: -1 })
db.group_messages.createIndex({ senderId: 1, createdAt: -1 })
```

### Issue: Socket.IO Connection Failures

**Symptoms:** "Connection refused" errors, WebSocket errors

**Solution:**
1. Verify Socket.IO server running on same port
2. Check firewall allows WebSocket connections
3. Verify CORS configuration in app.ts
4. Check browser console for specific errors

### Issue: 401 Unauthorized Errors

**Symptoms:** All authenticated requests fail

**Solution:**
1. Verify JWT_SECRET environment variable set
2. Verify token is valid and not expired
3. Check Authorization header format: `Bearer <token>`
4. Test with valid token from auth system

### Issue: 403 Member-Only Access Failing

**Symptoms:** Members can't access messages/send

**Solution:**
1. Verify user ID in token matches database
2. Check user is actually in members array:
   ```javascript
   db.groups.findOne({ _id: ObjectId('GROUP_ID') }).members
   ```
3. Re-join group if necessary

### Issue: Real-Time Messages Not Broadcast

**Symptoms:** Socket.IO messages sent but not received

**Solution:**
1. Verify socket room joined: `group_${groupId}`
2. Check user is group member before sending
3. Verify message persisted to database:
   ```javascript
   db.group_messages.findOne({ groupId: ObjectId('GROUP_ID') })
   ```
4. Check Socket.IO logs for emit errors

### Issue: High Memory Usage

**Symptoms:** Process consuming excessive RAM

**Solution:**
1. Check pagination limits are enforced
2. Verify no infinite loops in real-time handlers
3. Monitor concurrent Socket.IO connections
4. Implement connection limits:
   ```javascript
   io.engine.maxHttpBufferSize = 1e5; // 100 KB
   ```

---

## Rollback Plan

If critical issues occur after deployment:

### Immediate Rollback

```bash
# Stop application
npm stop
# or
pm2 stop linsta-backend

# Restore previous code version
git checkout previous-commit-hash

# Rebuild
npm run build

# Restart application
npm start
# or
pm2 start linsta-backend
```

### Database Rollback

If database corruption occurs:

```bash
# Backup current data
mongodump --uri $MONGODB_URI --archive=backup.archive

# Restore from previous backup (if available)
mongorestore --uri $MONGODB_URI --archive=backup.archive

# Or manually delete problematic collections:
db.groups.drop()
db.group_messages.drop()
```

### Verification After Rollback

```bash
# Build and test
npm run build
npm test

# Health check
curl http://localhost:5000/health

# Smoke test endpoints
npm run smoke-test
```

---

## Performance Optimization

### Database Optimization

```javascript
// Rebuild indexes for performance
db.groups.reIndex()
db.group_messages.reIndex()

// Monitor index usage
db.groups.aggregate([{ $indexStats: {} }]).pretty()

// Drop unused indexes (rarely needed)
db.groups.dropIndex('index_name')
```

### Query Optimization

Already implemented:
- ✅ Compound indexes on frequently queried fields
- ✅ Text search index on group name
- ✅ Pagination on all list endpoints
- ✅ Lean queries for read-only operations

### Caching (Future)

For high-traffic deployments:
```typescript
// Consider Redis for:
// - Group membership checks
// - Recent messages
// - User's groups list
// - Message pagination
```

### Connection Pooling

```typescript
// MongoDB connection pooling (already configured)
// Max connections automatically managed by Mongoose
// Configure in MongoDB URI:
// mongodb+srv://user:pass@host/db?maxPoolSize=50
```

---

## Backup & Recovery

### Automated Backups

```bash
# Weekly backup script
#!/bin/bash
BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mongodump --uri $MONGODB_URI \
  --archive=$BACKUP_DIR/linsta-$TIMESTAMP.archive
```

### Manual Backup

```bash
# Full database backup
mongodump --uri $MONGODB_URI --archive=backup.archive

# Single collection backup
mongodump --uri $MONGODB_URI -c groups \
  --archive=groups_backup.archive
```

### Recovery

```bash
# Restore full database
mongorestore --uri $MONGODB_URI --archive=backup.archive

# Restore single collection
mongorestore --uri $MONGODB_URI --archive=groups_backup.archive
```

---

## Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] MongoDB URI uses SSL/TLS
- [ ] API rate limiting enabled (global middleware)
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] XSS protection enabled
- [ ] CSRF tokens used (if applicable)
- [ ] Secrets not committed to Git
- [ ] Error messages don't leak sensitive info
- [ ] Authentication required for sensitive operations

---

## Scaling Considerations

### Horizontal Scaling

For multiple server instances:

```javascript
// Use Redis adapter for Socket.IO
const { createAdapter } = require("@socket.io/redis-adapter");
const redis = require("redis");

const pubClient = redis.createClient();
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));
```

### Load Balancing

```nginx
# Nginx configuration
upstream linsta_backend {
  server localhost:5000;
  server localhost:5001;
  server localhost:5002;
}

server {
  listen 80;
  location / {
    proxy_pass http://linsta_backend;
  }
}
```

### Database Sharding (Future)

If data grows significantly:
- Shard by `groupId` for messages
- Shard by `createdBy` for groups
- Use MongoDB Atlas sharding

---

## Incident Response

### If Group Chat Service Goes Down

1. **Check server status**
   ```bash
   npm run health-check
   ```

2. **Check database connection**
   ```bash
   mongosh $MONGODB_URI --eval "db.adminCommand('ping')"
   ```

3. **Restart application**
   ```bash
   npm stop && npm start
   ```

4. **Verify endpoints respond**
   ```bash
   curl http://localhost:5000/api/groups
   ```

5. **Check logs for errors**
   ```bash
   pm2 logs linsta-backend | tail -n 100
   ```

6. **Notify users if outage persists**

---

## Version Management

### Tracking Deployments

```bash
# Tag releases
git tag -a v1.0.0 -m "Group Chat Release"
git push origin v1.0.0

# View deployment history
git log --oneline --graph --all | head -20
```

### Changelog

Create CHANGELOG.md:
```
## [1.0.0] - 2026-01-26
### Added
- Group chat feature
- 7 REST API endpoints
- Socket.IO real-time messaging
- Member management

### Security
- JWT authentication required
- Member-only access to messages
- Input validation on all endpoints
```

---

## Support Resources

### Debugging

```bash
# Enable debug logging
DEBUG=* npm start

# Check specific module
DEBUG=socket.io:* npm start

# Check database operations
DEBUG=mongoose:* npm start
```

### Logs

```bash
# Clear logs
rm logs/*

# Compress old logs
tar -czf logs/archive-$(date +%Y%m%d).tar.gz logs/*.log

# Monitor live
tail -f logs/app.log | grep -i "group"
```

---

## Maintenance Windows

### Planned Maintenance

Before performing maintenance:

1. **Notify users**
2. **Stop accepting new connections**
3. **Wait for existing operations to complete**
4. **Backup database**
5. **Perform maintenance**
6. **Verify service**
7. **Resume operations**

```bash
# Graceful shutdown (100 second timeout)
pm2 gracefulReload linsta-backend
```

---

## Contact & Escalation

**Issues discovered during deployment:**

1. Contact: DevOps/Backend Team
2. Escalation: Technical Lead
3. Emergency: Engineering Manager

---

## Deployment Checklist (Final)

- [ ] All code committed and pushed
- [ ] Branch merged to main
- [ ] Build successful (`npm run build`)
- [ ] Tests passing (`npm test`)
- [ ] Database verified
- [ ] Environment variables set
- [ ] SSL/TLS certificates valid
- [ ] Backups current
- [ ] Monitoring configured
- [ ] Team notified
- [ ] Deployment window scheduled
- [ ] Rollback plan documented
- [ ] Post-deployment verification ready

---

## Success Criteria

Deployment is successful when:

✅ All 7 endpoints responding correctly  
✅ Socket.IO real-time working  
✅ Database collections created  
✅ No error logs (except startup warnings)  
✅ Health check passing  
✅ Smoke tests passing  
✅ Performance metrics acceptable  
✅ Users can create and use groups  

---

**Document Version:** 1.0  
**Last Updated:** January 26, 2026  
**Status:** Production Ready

For questions or issues, refer to [GROUP_CHAT_API.md](GROUP_CHAT_API.md) and [GROUP_CHAT_TESTING_GUIDE.md](GROUP_CHAT_TESTING_GUIDE.md)

