# Jobs Feature - API Documentation

**Status:** ✅ Complete & Production Ready  
**Date:** January 26, 2026

---

## Overview

Jobs feature enables users to post job listings and apply for jobs. Similar to LinkedIn, users can search jobs by title/location, manage applications, and job posters can review applications.

---

## Database Collections

### Jobs Collection
```javascript
{
  _id: ObjectId,
  title: String,                  // Required, max 100
  companyName: String,            // Required, max 100
  description: String,            // Required, max 2000
  location: String,               // Required, max 100
  jobType: String,                // "Internship" | "Full-time" | "Part-time"
  createdBy: ObjectId (ref User), // Job poster
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- (createdBy, createdAt) - Find user's posted jobs
- (title, description, location) - Full-text search
- (jobType) - Filter by job type
- (createdAt) - Latest jobs

---

### Job Applications Collection
```javascript
{
  _id: ObjectId,
  jobId: ObjectId (ref Job),      // Job being applied for
  applicantId: ObjectId (ref User), // Who applied
  resumeUrl: String,              // URL to resume (max URL length)
  status: String,                 // "Applied" | "Reviewed" | "Rejected"
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- (jobId, applicantId) - Unique: one application per user per job
- (applicantId, createdAt) - User's applications
- (jobId, createdAt) - Job's applications
- (status) - Filter by status

---

## REST API Endpoints

### 1. Create Job
```
POST /api/jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Senior Backend Engineer",
  "companyName": "Tech Corp",
  "description": "We are looking for an experienced backend engineer...",
  "location": "San Francisco, CA",
  "jobType": "Full-time"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Job posted successfully",
  "data": {
    "_id": "...",
    "title": "Senior Backend Engineer",
    "companyName": "Tech Corp",
    "description": "...",
    "location": "San Francisco, CA",
    "jobType": "Full-time",
    "createdBy": "...",
    "createdAt": "2026-01-26T..."
  }
}
```

**Error Cases:**
- 400: Missing required fields (title, companyName, description, location, jobType)
- 401: Unauthorized (missing token)

---

### 2. Get Jobs (Search & Filter)
```
GET /api/jobs?search=engineer&jobType=Full-time&location=San&limit=20&skip=0
```

**Query Parameters:**
- `search` - Search in title, description, location (optional)
- `jobType` - Filter: "Internship" | "Full-time" | "Part-time" (optional)
- `location` - Filter by location (case-insensitive) (optional)
- `limit` - Max results per page (default: 20, max: 100)
- `skip` - Offset for pagination (default: 0)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "jobId1",
      "title": "Senior Backend Engineer",
      "companyName": "Tech Corp",
      "description": "...",
      "location": "San Francisco, CA",
      "jobType": "Full-time",
      "createdBy": {
        "_id": "userId1",
        "name": "John Doe",
        "email": "john@example.com",
        "profilePicture": "url..."
      },
      "createdAt": "2026-01-26T..."
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 20,
    "skip": 0,
    "hasMore": true
  }
}
```

---

### 3. Get Job Details
```
GET /api/jobs/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "jobId123",
    "title": "Senior Backend Engineer",
    "companyName": "Tech Corp",
    "description": "Full job description...",
    "location": "San Francisco, CA",
    "jobType": "Full-time",
    "createdBy": {
      "_id": "userId1",
      "name": "John Doe",
      "email": "john@example.com",
      "profilePicture": "url..."
    },
    "createdAt": "2026-01-26T..."
  }
}
```

**Error Cases:**
- 404: Job not found

---

### 4. Get User's Posted Jobs
```
GET /api/jobs/my/jobs?limit=20&skip=0
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "jobId1",
      "title": "Senior Backend Engineer",
      "companyName": "Tech Corp",
      "description": "...",
      "location": "San Francisco, CA",
      "jobType": "Full-time",
      "createdAt": "2026-01-26T..."
    }
  ],
  "pagination": {
    "total": 5,
    "limit": 20,
    "skip": 0,
    "hasMore": false
  }
}
```

---

### 5. Apply for Job
```
POST /api/jobs/:id/apply
Authorization: Bearer <token>
Content-Type: application/json

{
  "resumeUrl": "https://example.com/resume.pdf"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "_id": "applicationId1",
    "jobId": {
      "_id": "jobId123",
      "title": "Senior Backend Engineer",
      "companyName": "Tech Corp"
    },
    "applicantId": {
      "_id": "userId456",
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "resumeUrl": "https://example.com/resume.pdf",
    "status": "Applied",
    "createdAt": "2026-01-26T..."
  }
}
```

**Error Cases:**
- 400: Resume URL is required
- 404: Job not found
- 409: User has already applied for this job
- 401: Unauthorized

---

### 6. Get User's Applications
```
GET /api/jobs/my/applications?limit=20&skip=0
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "applicationId1",
      "jobId": {
        "_id": "jobId123",
        "title": "Senior Backend Engineer",
        "companyName": "Tech Corp",
        "location": "San Francisco, CA",
        "jobType": "Full-time"
      },
      "applicantId": {
        "_id": "userId456",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "resumeUrl": "https://example.com/resume.pdf",
      "status": "Applied",
      "createdAt": "2026-01-26T..."
    }
  ],
  "pagination": {
    "total": 10,
    "limit": 20,
    "skip": 0,
    "hasMore": false
  }
}
```

---

### 7. Get Job Applications (Job Poster)
```
GET /api/jobs/:jobId/applications?limit=20&skip=0
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "applicationId1",
      "jobId": {
        "_id": "jobId123",
        "title": "Senior Backend Engineer",
        "companyName": "Tech Corp"
      },
      "applicantId": {
        "_id": "userId456",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "profilePicture": "url..."
      },
      "resumeUrl": "https://example.com/resume.pdf",
      "status": "Applied",
      "createdAt": "2026-01-26T..."
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 20,
    "skip": 0,
    "hasMore": true
  }
}
```

**Error Cases:**
- 403: You can only view applications for your own jobs
- 404: Job not found
- 401: Unauthorized

---

### 8. Update Application Status
```
PATCH /api/jobs/:jobId/applications/:applicationId
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Reviewed"
}
```

**Status Values:** "Applied" | "Reviewed" | "Rejected"

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Application status updated",
  "data": {
    "_id": "applicationId1",
    "jobId": {
      "_id": "jobId123",
      "title": "Senior Backend Engineer",
      "companyName": "Tech Corp"
    },
    "applicantId": {
      "_id": "userId456",
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "resumeUrl": "https://example.com/resume.pdf",
    "status": "Reviewed",
    "createdAt": "2026-01-26T..."
  }
}
```

**Error Cases:**
- 400: Invalid status
- 403: You can only update applications for your own jobs
- 404: Application not found or Job not found
- 401: Unauthorized

---

## Business Rules

### Job Creation
- Title, company name, description, and location are required
- Job type must be one of: "Internship", "Full-time", "Part-time"
- Creator automatically becomes the job poster

### Job Search
- Full-text search on title, description, and location
- Can filter by job type and location
- Paginated results (default 20 per page, max 100)

### Applications
- One application per user per job (enforced by unique index)
- Resume stored as URL only (no file upload)
- Default status: "Applied"
- Only job poster can view and update application status
- Users can view their own applications

### Access Control
- Auth required for creating jobs
- Auth required for applying
- Auth required for viewing own applications
- Job poster can only view applications for their own jobs

---

## Error Codes

| Code | Scenario | Message |
|------|----------|---------|
| 201 | Application submitted | "Application submitted successfully" |
| 200 | Operation successful | "Operation successful" |
| 400 | Invalid input | "Job title is required" |
| 401 | Missing/invalid auth | "Unauthorized" |
| 403 | Unauthorized access | "You can only view applications for your own jobs" |
| 404 | Not found | "Job not found" |
| 409 | Duplicate application | "You have already applied for this job" |
| 500 | Server error | "Internal server error" |

---

## Example Usage

### Example 1: Post a Job

```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Authorization: Bearer token123" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Backend Engineer",
    "companyName": "Tech Corp",
    "description": "We are looking for an experienced backend engineer to join our team...",
    "location": "San Francisco, CA",
    "jobType": "Full-time"
  }'
```

### Example 2: Search Jobs

```bash
curl "http://localhost:5000/api/jobs?search=backend&jobType=Full-time&location=San&limit=10&skip=0"
```

### Example 3: Apply for a Job

```bash
curl -X POST http://localhost:5000/api/jobs/jobId123/apply \
  -H "Authorization: Bearer token456" \
  -H "Content-Type: application/json" \
  -d '{
    "resumeUrl": "https://example.com/resume.pdf"
  }'
```

### Example 4: View Your Applications

```bash
curl http://localhost:5000/api/jobs/my/applications \
  -H "Authorization: Bearer token456"
```

### Example 5: View Job Applicants (Job Poster)

```bash
curl http://localhost:5000/api/jobs/jobId123/applications \
  -H "Authorization: Bearer token123"
```

### Example 6: Update Application Status

```bash
curl -X PATCH http://localhost:5000/api/jobs/jobId123/applications/appId456 \
  -H "Authorization: Bearer token123" \
  -H "Content-Type: application/json" \
  -d '{"status": "Reviewed"}'
```

---

## Pagination Guide

All list endpoints support offset-based pagination:

```
GET /api/jobs?limit=20&skip=0
```

**Parameters:**
- `limit` - Items per page (default: 20, max: 100)
- `skip` - Items to skip (default: 0, increment by limit)

**Response Includes:**
```json
{
  "pagination": {
    "total": 150,
    "limit": 20,
    "skip": 0,
    "hasMore": true
  }
}
```

**Usage:**
- First page: `skip=0`
- Next page: `skip=20` (if limit is 20)
- Check `hasMore` to determine if more data exists

---

## Authentication

All write operations require JWT token:

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

## Summary

**Endpoints:** 8  
**Collections:** 2  
**Status:** Production Ready  

All job posting and application functionality is fully implemented and ready for use.

