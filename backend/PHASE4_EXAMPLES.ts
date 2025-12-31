/**
 * PHASE 4: Posts & Event Visibility - API Testing Examples
 * 
 * This file contains cURL examples for testing all Phase 4 endpoints.
 * Make sure to:
 * 1. Replace YOUR_TOKEN with an actual JWT token from login/register
 * 2. Replace IDs with actual MongoDB ObjectIds from your database
 * 3. Run the backend server: npm run dev
 */

// ============================================================================
// SETUP: Get a token first
// ============================================================================

/**
 * Register a new user
 * POST /api/auth/register
 */
export const registerExample = `
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
`;

/**
 * Login to get JWT token
 * POST /api/auth/login
 */
export const loginExample = `
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
`;
// Response will contain: { token: "eyJhbGc...", user: {...} }
// Use the token in Authorization header for all authenticated requests

// ============================================================================
// CREATE POST
// ============================================================================

/**
 * Create a simple post (caption only)
 * POST /api/posts
 */
export const createSimplePost = `
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "caption": "Just finished a great coding session!"
  }'
`;

/**
 * Create a post with media URLs
 * POST /api/posts
 */
export const createPostWithMedia = `
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "caption": "Check out this amazing tech conference!",
    "media": [
      {
        "url": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
        "type": "image"
      },
      {
        "url": "https://videos.example.com/conference-highlights.mp4",
        "type": "video"
      }
    ]
  }'
`;

/**
 * Create a post linked to an event
 * POST /api/posts
 */
export const createPostForEvent = `
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "caption": "Had an amazing time at the JavaScript Meetup!",
    "eventId": "66f1234567890abcdef12345",
    "media": [
      {
        "url": "https://images.example.com/event-photo.jpg",
        "type": "image"
      }
    ]
  }'
`;

// ============================================================================
// GET POSTS
// ============================================================================

/**
 * Get feed (authenticated)
 * GET /api/posts
 */
export const getFeed = `
curl -X GET "http://localhost:5000/api/posts?limit=10&skip=0" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
`;

/**
 * Get feed with custom pagination
 * GET /api/posts?limit=50&skip=100
 */
export const getFeedPaginated = `
curl -X GET "http://localhost:5000/api/posts?limit=50&skip=100" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
`;

/**
 * Get a single post (public, no auth needed)
 * GET /api/posts/:id
 */
export const getSinglePost = `
curl -X GET "http://localhost:5000/api/posts/66f1234567890abcdef12345" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
`;

// ============================================================================
// DELETE POST
// ============================================================================

/**
 * Delete your own post
 * DELETE /api/posts/:id
 */
export const deletePost = `
curl -X DELETE "http://localhost:5000/api/posts/66f1234567890abcdef12345" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
`;

// ============================================================================
// LIKES
// ============================================================================

/**
 * Like a post
 * POST /api/posts/:id/like
 */
export const likePost = `
curl -X POST "http://localhost:5000/api/posts/66f1234567890abcdef12345/like" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
`;

/**
 * Unlike a post
 * DELETE /api/posts/:id/like
 */
export const unlikePost = `
curl -X DELETE "http://localhost:5000/api/posts/66f1234567890abcdef12345/like" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
`;

// ============================================================================
// COMMENTS
// ============================================================================

/**
 * Add a comment to a post
 * POST /api/posts/:id/comment
 */
export const addComment = `
curl -X POST "http://localhost:5000/api/posts/66f1234567890abcdef12345/comment" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "text": "This is such a great post! Love the content."
  }'
`;

/**
 * Get all comments on a post (public, no auth needed)
 * GET /api/posts/:id/comments
 */
export const getComments = `
curl -X GET "http://localhost:5000/api/posts/66f1234567890abcdef12345/comments?limit=20&skip=0"
`;

/**
 * Get comments with pagination
 * GET /api/posts/:id/comments?limit=50&skip=0
 */
export const getCommentsPaginated = `
curl -X GET "http://localhost:5000/api/posts/66f1234567890abcdef12345/comments?limit=50&skip=0"
`;

/**
 * Delete your own comment
 * DELETE /api/posts/:postId/comments/:commentId
 */
export const deleteComment = `
curl -X DELETE "http://localhost:5000/api/posts/66f1234567890abcdef12345/comments/66f1234567890abcdef54321" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
`;

// ============================================================================
// RESPONSE EXAMPLES
// ============================================================================

/**
 * Successful post creation response (201)
 */
export const createPostResponse = {
  _id: "66f1234567890abcdef12345",
  authorId: "66f0000000000000000000001",
  eventId: "66f5555555555555555555555",
  caption: "Check out this amazing tech conference!",
  media: [
    {
      _id: "66f1111111111111111111111",
      postId: "66f1234567890abcdef12345",
      mediaType: "image",
      mediaUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800"
    },
    {
      _id: "66f2222222222222222222222",
      postId: "66f1234567890abcdef12345",
      mediaType: "video",
      mediaUrl: "https://videos.example.com/conference-highlights.mp4"
    }
  ],
  author: {
    _id: "66f0000000000000000000001",
    name: "John Doe",
    email: "john@example.com"
  },
  event: {
    _id: "66f5555555555555555555555",
    title: "Tech Conference 2024"
  },
  likeCount: 0,
  commentCount: 0,
  userLiked: false,
  createdAt: "2024-12-30T10:30:00.000Z",
  updatedAt: "2024-12-30T10:30:00.000Z"
};

/**
 * Get feed response (200)
 */
export const getFeedResponse = [
  {
    _id: "66f1234567890abcdef12345",
    authorId: "66f0000000000000000000001",
    eventId: "66f5555555555555555555555",
    caption: "Check out this amazing tech conference!",
    media: [
      {
        _id: "66f1111111111111111111111",
        postId: "66f1234567890abcdef12345",
        mediaType: "image",
        mediaUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800"
      }
    ],
    author: {
      _id: "66f0000000000000000000001",
      name: "John Doe",
      email: "john@example.com"
    },
    event: {
      _id: "66f5555555555555555555555",
      title: "Tech Conference 2024"
    },
    likeCount: 5,
    commentCount: 2,
    userLiked: false,
    createdAt: "2024-12-30T10:30:00.000Z",
    updatedAt: "2024-12-30T10:30:00.000Z"
  }
];

/**
 * Add comment response (201)
 */
export const addCommentResponse = {
  _id: "66f3333333333333333333333",
  postId: "66f1234567890abcdef12345",
  userId: "66f0000000000000000000002",
  text: "This is such a great post! Love the content.",
  user: {
    _id: "66f0000000000000000000002",
    name: "Jane Smith",
    email: "jane@example.com"
  },
  createdAt: "2024-12-30T10:35:00.000Z"
};

/**
 * Like post response (201)
 */
export const likePostResponse = {
  success: true,
  message: "Post liked successfully"
};

/**
 * Get comments response (200)
 */
export const getCommentsResponse = [
  {
    _id: "66f3333333333333333333333",
    postId: "66f1234567890abcdef12345",
    userId: "66f0000000000000000000002",
    text: "This is such a great post! Love the content.",
    user: {
      _id: "66f0000000000000000000002",
      name: "Jane Smith",
      email: "jane@example.com"
    },
    createdAt: "2024-12-30T10:35:00.000Z"
  },
  {
    _id: "66f4444444444444444444444",
    postId: "66f1234567890abcdef12345",
    userId: "66f0000000000000000000003",
    text: "Amazing insight! Thanks for sharing.",
    user: {
      _id: "66f0000000000000000000003",
      name: "Bob Johnson",
      email: "bob@example.com"
    },
    createdAt: "2024-12-30T10:40:00.000Z"
  }
];

// ============================================================================
// ERROR RESPONSE EXAMPLES
// ============================================================================

/**
 * Missing required field (400)
 */
export const missingCaptionError = {
  error: "Caption is required"
};

/**
 * Duplicate like error (409)
 */
export const duplicateLikeError = {
  error: "Post already liked by this user"
};

/**
 * Post not found (404)
 */
export const postNotFoundError = {
  error: "Post not found"
};

/**
 * Unauthorized to delete post (403)
 */
export const unauthorizedDeleteError = {
  error: "Unauthorized: Can only delete own posts"
};

/**
 * Missing authentication token (401)
 */
export const missingAuthError = {
  error: "Missing or invalid token"
};

// ============================================================================
// TESTING WORKFLOW
// ============================================================================

/**
 * Recommended testing order:
 * 
 * 1. Register & Login
 *    - Get JWT token
 * 
 * 2. Create Posts
 *    - Simple post
 *    - Post with media
 *    - Post linked to event
 * 
 * 3. Get Posts
 *    - Get feed (paginated)
 *    - Get single post
 * 
 * 4. Engagement
 *    - Like/unlike posts
 *    - Add comments
 *    - Get comments
 * 
 * 5. Cleanup
 *    - Delete comments
 *    - Delete posts
 */

// ============================================================================
// NOTES
// ============================================================================

/**
 * Important Points:
 * 
 * - All POST/PUT/DELETE endpoints require authentication
 * - GET endpoints for individual posts and comments are public
 * - Media URLs are stored as-is; no file upload processing
 * - Like system prevents duplicates via unique index
 * - Timestamps (createdAt, updatedAt) are automatically managed
 * - Post deletion cascades to delete media, likes, and comments
 * - Event linking is optional; posts can exist without events
 */
