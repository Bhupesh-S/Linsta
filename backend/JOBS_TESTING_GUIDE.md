# Jobs Feature - Testing Guide

**Test Date:** January 26, 2026  
**Status:** Ready for Testing

---

## Prerequisites

1. Backend running: `npm run dev`
2. MongoDB connection active
3. User authentication tokens available (from login/signup)
4. Postman or curl for API testing

---

## Test Scenario 1: Create & Search Jobs

### Step 1.1: Create a job as User A
```
POST /api/jobs
Authorization: Bearer USER_A_TOKEN
Content-Type: application/json

{
  "title": "Senior Backend Engineer",
  "companyName": "TechCorp",
  "description": "Looking for experienced backend engineer with Node.js expertise",
  "location": "San Francisco, CA",
  "jobType": "Full-time"
}
```

**Expected Response:** 201 Created
```json
{
  "success": true,
  "message": "Job posted successfully",
  "data": {
    "_id": "...",
    "title": "Senior Backend Engineer",
    "companyName": "TechCorp",
    "createdBy": "USER_A_ID",
    "createdAt": "2026-01-26T..."
  }
}
```

### Step 1.2: Create another job with different type
```
POST /api/jobs
Authorization: Bearer USER_A_TOKEN

{
  "title": "Internship - Web Development",
  "companyName": "StartupXYZ",
  "description": "3-month paid internship for college students",
  "location": "New York, NY",
  "jobType": "Internship"
}
```

**Expected Response:** 201 Created

### Step 1.3: Search jobs by keyword
```
GET /api/jobs?search=Backend
```

**Expected Response:** 200 OK
- Should return jobs with "Backend" in title/description
- Result: Senior Backend Engineer job

### Step 1.4: Filter by job type
```
GET /api/jobs?jobType=Internship
```

**Expected Response:** 200 OK
- Should return only internship jobs
- Result: Internship - Web Development job

### Step 1.5: Filter by location
```
GET /api/jobs?location=San
```

**Expected Response:** 200 OK
- Should return jobs matching location "San"
- Result: Senior Backend Engineer job

### Step 1.6: Complex search with filters
```
GET /api/jobs?search=engineer&jobType=Full-time&limit=10&skip=0
```

**Expected Response:** 200 OK with pagination data

---

## Test Scenario 2: Apply for Jobs & Prevent Duplicates

### Step 2.1: User B applies for job
```
POST /api/jobs/{JOB_ID}/apply
Authorization: Bearer USER_B_TOKEN
Content-Type: application/json

{
  "resumeUrl": "https://example.com/resumes/john-doe.pdf"
}
```

**Expected Response:** 201 Created
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "_id": "...",
    "jobId": "JOB_ID",
    "applicantId": "USER_B_ID",
    "resumeUrl": "https://example.com/resumes/john-doe.pdf",
    "status": "Applied"
  }
}
```

### Step 2.2: User B tries to apply again (SHOULD FAIL)
```
POST /api/jobs/{JOB_ID}/apply
Authorization: Bearer USER_B_TOKEN

{
  "resumeUrl": "https://example.com/resumes/john-doe-updated.pdf"
}
```

**Expected Response:** 409 Conflict
```json
{
  "statusCode": 409,
  "message": "You have already applied for this job"
}
```

### Step 2.3: Different user applies for same job (SHOULD SUCCEED)
```
POST /api/jobs/{JOB_ID}/apply
Authorization: Bearer USER_C_TOKEN

{
  "resumeUrl": "https://example.com/resumes/jane-smith.pdf"
}
```

**Expected Response:** 201 Created (different user, so allowed)

---

## Test Scenario 3: View Applications

### Step 3.1: User B views their applications
```
GET /api/jobs/my/applications
Authorization: Bearer USER_B_TOKEN
```

**Expected Response:** 200 OK
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "jobId": {
        "_id": "...",
        "title": "Senior Backend Engineer",
        "companyName": "TechCorp"
      },
      "applicantId": "USER_B_ID",
      "resumeUrl": "...",
      "status": "Applied",
      "createdAt": "..."
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 20,
    "skip": 0,
    "hasMore": false
  }
}
```

### Step 3.2: User A views applications for their job
```
GET /api/jobs/{JOB_ID}/applications
Authorization: Bearer USER_A_TOKEN
```

**Expected Response:** 200 OK
- Should show applications from User B and User C
- Both with status "Applied"

### Step 3.3: User B tries to view applications for User A's job (SHOULD FAIL)
```
GET /api/jobs/{JOB_ID}/applications
Authorization: Bearer USER_B_TOKEN
```

**Expected Response:** 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "You can only view applications for your own jobs"
}
```

---

## Test Scenario 4: Update Application Status

### Step 4.1: User A updates application status to Reviewed
```
PATCH /api/jobs/{JOB_ID}/applications/{APP_ID}
Authorization: Bearer USER_A_TOKEN
Content-Type: application/json

{
  "status": "Reviewed"
}
```

**Expected Response:** 200 OK
```json
{
  "success": true,
  "message": "Application status updated successfully",
  "data": {
    "_id": "APP_ID",
    "status": "Reviewed"
  }
}
```

### Step 4.2: User A rejects the application
```
PATCH /api/jobs/{JOB_ID}/applications/{APP_ID}
Authorization: Bearer USER_A_TOKEN

{
  "status": "Rejected"
}
```

**Expected Response:** 200 OK

### Step 4.3: User B tries to update status (SHOULD FAIL)
```
PATCH /api/jobs/{JOB_ID}/applications/{APP_ID}
Authorization: Bearer USER_B_TOKEN

{
  "status": "Reviewed"
}
```

**Expected Response:** 403 Forbidden

---

## Test Scenario 5: View Posted Jobs

### Step 5.1: User A views their posted jobs
```
GET /api/jobs/my/jobs
Authorization: Bearer USER_A_TOKEN
```

**Expected Response:** 200 OK
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": "Senior Backend Engineer",
      "companyName": "TechCorp",
      "description": "...",
      "createdBy": "USER_A_ID",
      "createdAt": "..."
    },
    {
      "_id": "...",
      "title": "Internship - Web Development",
      "companyName": "StartupXYZ",
      "description": "...",
      "createdBy": "USER_A_ID",
      "createdAt": "..."
    }
  ],
  "pagination": {
    "total": 2,
    "limit": 20,
    "skip": 0,
    "hasMore": false
  }
}
```

---

## Test Scenario 6: Error Cases

### Test 6.1: Create job with missing field
```
POST /api/jobs
Authorization: Bearer USER_A_TOKEN

{
  "title": "Test Job",
  "companyName": "TestCorp"
  // Missing: description, location, jobType
}
```

**Expected Response:** 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Job description is required"
}
```

### Test 6.2: Apply without authentication
```
POST /api/jobs/{JOB_ID}/apply

{
  "resumeUrl": "https://example.com/resume.pdf"
}
```

**Expected Response:** 401 Unauthorized

### Test 6.3: Invalid job type
```
POST /api/jobs
Authorization: Bearer USER_A_TOKEN

{
  "title": "Test Job",
  "companyName": "TestCorp",
  "description": "Test description",
  "location": "Test City",
  "jobType": "InvalidType"
}
```

**Expected Response:** 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Invalid job type"
}
```

### Test 6.4: Apply for non-existent job
```
POST /api/jobs/invalid_id/apply
Authorization: Bearer USER_A_TOKEN

{
  "resumeUrl": "https://example.com/resume.pdf"
}
```

**Expected Response:** 404 Not Found

### Test 6.5: Get non-existent job
```
GET /api/jobs/invalid_id
```

**Expected Response:** 404 Not Found

---

## Test Scenario 7: Pagination

### Test 7.1: Get first page
```
GET /api/jobs?limit=5&skip=0
```

**Expected Response:** 200 OK with hasMore flag

### Test 7.2: Get second page
```
GET /api/jobs?limit=5&skip=5
```

**Expected Response:** 200 OK

### Test 7.3: Invalid pagination values
```
GET /api/jobs?limit=1000  // exceeds max of 100
```

**Expected Response:** 400 Bad Request

---

## Test Scenario 8: Data Validation

### Test 8.1: Title too long
```
POST /api/jobs
Authorization: Bearer USER_A_TOKEN

{
  "title": "A very long title that exceeds the maximum allowed length of 100 characters for job titles in the system",
  "companyName": "TestCorp",
  "description": "Test",
  "location": "Test",
  "jobType": "Full-time"
}
```

**Expected Response:** 400 Bad Request

### Test 8.2: Description too long
```
POST /api/jobs
Authorization: Bearer USER_A_TOKEN

{
  "title": "Test Job",
  "companyName": "TestCorp",
  "description": "[2000+ character string]",
  "location": "Test",
  "jobType": "Full-time"
}
```

**Expected Response:** 400 Bad Request

---

## Test Execution Checklist

- [ ] Scenario 1: Create & Search Jobs
  - [ ] 1.1 Create job
  - [ ] 1.2 Create another job
  - [ ] 1.3 Search by keyword
  - [ ] 1.4 Filter by type
  - [ ] 1.5 Filter by location
  - [ ] 1.6 Complex search

- [ ] Scenario 2: Apply & Duplicate Prevention
  - [ ] 2.1 First application succeeds
  - [ ] 2.2 Second application fails (409)
  - [ ] 2.3 Different user succeeds

- [ ] Scenario 3: View Applications
  - [ ] 3.1 User views their applications
  - [ ] 3.2 Job poster views applications
  - [ ] 3.3 Non-poster gets 403

- [ ] Scenario 4: Update Status
  - [ ] 4.1 Update to Reviewed
  - [ ] 4.2 Update to Rejected
  - [ ] 4.3 Non-poster gets 403

- [ ] Scenario 5: View Posted Jobs
  - [ ] 5.1 View own jobs

- [ ] Scenario 6: Error Cases
  - [ ] 6.1 Missing field
  - [ ] 6.2 No auth
  - [ ] 6.3 Invalid type
  - [ ] 6.4 Non-existent job
  - [ ] 6.5 Non-existent job

- [ ] Scenario 7: Pagination
  - [ ] 7.1 First page
  - [ ] 7.2 Second page
  - [ ] 7.3 Invalid values

- [ ] Scenario 8: Data Validation
  - [ ] 8.1 Title too long
  - [ ] 8.2 Description too long

---

## Test Data Collection

```json
{
  "USER_A_TOKEN": "eyJ...",
  "USER_B_TOKEN": "eyJ...",
  "USER_C_TOKEN": "eyJ...",
  "JOB_ID": "...",
  "APP_ID": "..."
}
```

Store actual values here after first successful test.

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check token validity and expiration |
| 403 Forbidden | Verify you are the job poster |
| 409 Conflict | Already applied - use different user |
| 404 Not Found | Check job/application IDs are valid |
| 400 Bad Request | Validate all required fields present |

---

**Version:** 1.0  
**Last Updated:** January 26, 2026  
**Status:** Ready for Testing

