# Community Features - Backend Analysis

## ✅ Currently Implemented (Ready to Use)

### Backend Models
- ✅ **Community Model** (`community.model.ts`)
  - Fields: name, category, description, createdBy, createdAt
  - Indexes: name, category

- ✅ **CommunityMember Model** (`community-member.model.ts`)
  - Fields: communityId, userId, role (member/admin), joinedAt
  - Unique index on communityId + userId

### Backend Endpoints (NetworkService)
1. ✅ **GET /api/network/communities** - Get all communities
   - Returns: communities list with memberCount and isJoined status
   - Limit: 50 communities

2. ✅ **POST /api/network/community/join** - Join a community
   - Body: `{ communityId: string }`
   - Creates member with role: "member"

3. ✅ **POST /api/network/community/leave** - Leave a community
   - Body: `{ communityId: string }`
   - Deletes membership

### Frontend API Service
- ✅ Interface defined in `network.api.ts`
- ✅ HTTP implementation in `network.http.ts`
- ✅ Mock implementation in `network.mock.ts`
- ✅ Methods: `getCommunities()`, `joinCommunity()`, `leaveCommunity()`

### Data Structure
```typescript
// What you get from backend
interface CommunityDTO {
  id: string;
  name: string;
  category?: string;
  description?: string;
  memberCount: number;
  isJoined: boolean; // Based on current user
}
```

---

## 🔨 Needs to be Implemented

### 1. Core Community Features

#### Create Community
**Backend:**
```typescript
// POST /api/network/community/create
{
  name: string;
  description?: string;
  category?: string;
  visibility: 'public' | 'private';
  tags?: string[];
}
```

**Model Updates Needed:**
```typescript
// Add to Community schema:
visibility: 'public' | 'private';
tags: string[];
rules?: string;
imageUrl?: string;
coverImageUrl?: string;
```

#### Community Discovery
- **Search by name** - Already possible with MongoDB query
- **Search by category** - Already indexed
- **Search by tags** - Need to add tags field
- **Featured/Recommended communities** - Need algorithm

#### Community Detail View
```typescript
// GET /api/network/community/:id/detail
{
  ...CommunityDTO,
  rules?: string;
  imageUrl?: string;
  recentPosts: PostResponse[];
  topMembers: MemberDTO[];
  createdBy: UserDTO;
}
```

---

### 2. Member Management

#### Enhanced Member Model
```typescript
// Add to CommunityMember:
role: 'member' | 'moderator' | 'admin';
status: 'active' | 'banned' | 'pending'; // For private communities
requestedAt?: Date; // Join request timestamp
approvedAt?: Date;
approvedBy?: ObjectId;
```

#### Endpoints Needed
```typescript
// GET /api/network/community/:id/members
// GET /api/network/community/:id/requests (admin only)
// POST /api/network/community/:id/approve (admin only)
// POST /api/network/community/:id/reject (admin only)
// DELETE /api/network/community/:id/member/:userId (admin only)
// PUT /api/network/community/:id/member/:userId/role (admin only)
```

---

### 3. Posts & Interaction

#### Community Posts
**Modify Post Model:**
```typescript
// Add to post.model.ts:
communityId?: Types.ObjectId;
isPinned?: boolean;
pinnedBy?: Types.ObjectId;
pinnedAt?: Date;
```

**Endpoints:**
```typescript
// GET /api/posts/community/:id
// POST /api/posts (add communityId field)
// PUT /api/posts/:id/pin (admin/moderator only)
// PUT /api/posts/:id/unpin (admin/moderator only)
```

#### Sorting
- Recent: Already possible (sort by createdAt)
- Popular: Need engagement calculation (likes + comments)

---

### 4. Moderation & Control

#### New Models Needed

**CommunityReport:**
```typescript
{
  communityId: ObjectId;
  reportedBy: ObjectId;
  targetType: 'post' | 'comment' | 'member';
  targetId: ObjectId;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  resolvedBy?: ObjectId;
  createdAt: Date;
}
```

**CommunityBan:**
```typescript
{
  communityId: ObjectId;
  userId: ObjectId;
  bannedBy: ObjectId;
  reason: string;
  bannedAt: Date;
  expiresAt?: Date; // For temporary bans
}
```

**CommunityRules:**
```typescript
// Add to Community model:
rules: string; // Markdown text
guidelinesUrl?: string;
```

#### Endpoints
```typescript
// POST /api/network/community/:id/report
// GET /api/network/community/:id/reports (admin/mod)
// PUT /api/network/community/:id/report/:reportId/resolve
// POST /api/network/community/:id/ban
// DELETE /api/network/community/:id/ban/:userId
// GET /api/network/community/:id/banned-users (admin/mod)
```

---

### 5. Notifications

**Already have notification system!** Just extend types:

```typescript
// Add to notification.types.ts:
type: 'COMMUNITY_POST' | 'COMMUNITY_MENTION' | 'COMMUNITY_ANNOUNCEMENT' 
    | 'COMMUNITY_JOIN_REQUEST' | 'COMMUNITY_APPROVED' | 'COMMUNITY_INVITE'
```

**Notification Creation:**
- New post → Notify all community members
- Mention → Notify mentioned user
- Join request → Notify admins
- Request approved → Notify requester

---

### 6. Events & Engagement

**Link existing Event system to Communities:**

```typescript
// Add to event.model.ts:
communityId?: Types.ObjectId;
```

**Endpoints:**
```typescript
// GET /api/events/community/:communityId
// POST /api/events (add communityId field)
```

**Event Features:**
- RSVP: Already implemented in events module
- Reminders: Can use existing notification system
- Archive: Filter by date

---

### 7. Resources & Knowledge

**New Model:**
```typescript
CommunityResource {
  communityId: ObjectId;
  title: string;
  description?: string;
  url?: string; // For external links
  fileUrl?: string; // For uploaded files
  type: 'link' | 'file' | 'document';
  uploadedBy: ObjectId;
  isPinned: boolean;
  createdAt: Date;
}
```

**Endpoints:**
```typescript
// POST /api/network/community/:id/resources
// GET /api/network/community/:id/resources
// DELETE /api/network/community/:id/resources/:resourceId
// PUT /api/network/community/:id/resources/:resourceId/pin
```

---

### 8. Analytics (Admin Dashboard)

**New Service Methods:**
```typescript
CommunityAnalytics {
  // Member stats
  totalMembers: number;
  newMembersThisWeek: number;
  memberGrowthChart: { date: string, count: number }[];
  
  // Engagement
  totalPosts: number;
  postsThisWeek: number;
  avgLikesPerPost: number;
  avgCommentsPerPost: number;
  mostActiveMembers: UserDTO[];
  
  // Content
  topPosts: PostResponse[];
  reportCount: number;
}
```

**Endpoint:**
```typescript
// GET /api/network/community/:id/analytics (admin only)
```

---

### 9. Integration & Extras

#### Invite System
```typescript
// POST /api/network/community/:id/invite
{
  userId: string;
  message?: string;
}
```

#### Share Community
- Generate shareable link with metadata
- Deep linking support

#### Cross-post
```typescript
// POST /api/posts/:id/crosspost
{
  communityIds: string[];
}
```

#### Archive/Delete Community
```typescript
// PUT /api/network/community/:id/archive (admin only)
// DELETE /api/network/community/:id (creator only)
```

---

## 📊 Implementation Priority

### Phase 1 - Basic Extension (Quick Wins)
1. ✅ Get communities (DONE)
2. ✅ Join/Leave (DONE)
3. 🔨 Create community
4. 🔨 Community detail page
5. 🔨 Search communities

### Phase 2 - Content & Engagement
1. 🔨 Community posts (filter posts by communityId)
2. 🔨 Pin posts
3. 🔨 Notifications for community activity
4. 🔨 Link events to communities

### Phase 3 - Advanced Features
1. 🔨 Private communities + approval flow
2. 🔨 Member roles (moderator)
3. 🔨 Moderation tools
4. 🔨 Resources section

### Phase 4 - Admin & Analytics
1. 🔨 Analytics dashboard
2. 🔨 Report handling
3. 🔨 Member management
4. 🔨 Bulk actions

---

## 🎯 Immediate Next Steps

### Frontend Changes Needed:
1. **CommunitiesScreen** - Already exists, connect to `getCommunities()` API
2. **CommunityDetailScreen** - Create new screen
3. **CreateCommunityScreen** - Create new screen
4. **Community Posts Feed** - Filter PostCard by communityId

### Backend Changes Needed:
1. Add `createCommunity` endpoint
2. Add `getCommunityDetail` endpoint
3. Add `communityId` field to Post model
4. Add search/filter to `getCommunities`

### Example Frontend Usage:
```typescript
import { networkService } from '../services/network.http';

// In CommunitiesScreen
const loadCommunities = async () => {
  const response = await networkService.getCommunities();
  setCommunities(response.communities);
};

const handleJoinCommunity = async (communityId: string) => {
  const result = await networkService.joinCommunity(communityId);
  if (result.success) {
    // Refresh list
    loadCommunities();
  }
};
```

---

## 📝 Database Queries You Can Run Now

```typescript
// Get all communities
Community.find().sort({ name: 1 });

// Get community by ID
Community.findById(communityId);

// Get user's communities
const userCommunities = await CommunityMember.find({ userId })
  .populate('communityId');

// Get community members
const members = await CommunityMember.find({ communityId })
  .populate('userId', 'name email');

// Check if user is admin
const membership = await CommunityMember.findOne({ 
  communityId, 
  userId, 
  role: 'admin' 
});
```

---

## 🚀 Quick Start Implementation

To start using communities in your app RIGHT NOW:

1. **In CommunitiesScreen.tsx:**
```typescript
import { networkService } from '../../services/network.http';
import { useEffect, useState } from 'react';

const [communities, setCommunities] = useState([]);

useEffect(() => {
  const loadData = async () => {
    const data = await networkService.getCommunities();
    setCommunities(data.communities);
  };
  loadData();
}, []);
```

2. **Display communities** - Map through the array and show cards
3. **Join button** - Call `networkService.joinCommunity(id)`
4. **Leave button** - Call `networkService.leaveCommunity(id)`

That's it! Basic functionality is ready to use immediately.
