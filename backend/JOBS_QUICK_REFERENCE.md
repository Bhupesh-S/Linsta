# Jobs Feature - Quick Reference Guide

**Status:** ✅ Production Ready  
**Last Updated:** January 26, 2026

---

## Quick API Cheat Sheet

### Create Job
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Backend Engineer",
    "companyName": "Tech Corp",
    "description": "Job description",
    "location": "San Francisco, CA",
    "jobType": "Full-time"
  }'
```

### Search Jobs
```bash
curl "http://localhost:5000/api/jobs?search=backend&jobType=Full-time&location=San"
curl "http://localhost:5000/api/jobs?limit=20&skip=0"
```

### Get Job Details
```bash
curl http://localhost:5000/api/jobs/JOB_ID
```

### Get Your Posted Jobs
```bash
curl http://localhost:5000/api/jobs/my/jobs \
  -H "Authorization: Bearer TOKEN"
```

### Apply for Job
```bash
curl -X POST http://localhost:5000/api/jobs/JOB_ID/apply \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"resumeUrl": "https://example.com/resume.pdf"}'
```

### View Your Applications
```bash
curl http://localhost:5000/api/jobs/my/applications \
  -H "Authorization: Bearer TOKEN"
```

### View Job Applicants (Job Poster)
```bash
curl http://localhost:5000/api/jobs/JOB_ID/applications \
  -H "Authorization: Bearer TOKEN"
```

### Update Application Status
```bash
curl -X PATCH http://localhost:5000/api/jobs/JOB_ID/applications/APP_ID \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "Reviewed"}'
```

---

## Endpoints Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | /api/jobs | ✅ | Create job |
| GET | /api/jobs | ❌ | Search jobs |
| GET | /api/jobs/:id | ❌ | Job details |
| GET | /api/jobs/my/jobs | ✅ | Your posted jobs |
| POST | /api/jobs/:id/apply | ✅ | Apply for job |
| GET | /api/jobs/my/applications | ✅ | Your applications |
| GET | /api/jobs/:jobId/applications | ✅ | Job applicants |
| PATCH | /api/jobs/:jobId/applications/:applicationId | ✅ | Update status |

---

## Error Codes Quick Reference

| Code | Common Causes |
|------|---------------|
| 400 | Missing fields, invalid job type, invalid status |
| 401 | No token, invalid token |
| 403 | Not job poster, accessing others' data |
| 404 | Job/application not found |
| 409 | Already applied for job |

---

## Pagination Examples

```bash
# Get first page
curl "http://localhost:5000/api/jobs?limit=20&skip=0"

# Get next page
curl "http://localhost:5000/api/jobs?limit=20&skip=20"

# Get with search
curl "http://localhost:5000/api/jobs?search=engineer&limit=10&skip=0"
```

---

## Job Types

- `Internship`
- `Full-time`
- `Part-time`

---

## Application Statuses

- `Applied` (default)
- `Reviewed`
- `Rejected`

---

## Common Tasks

### "I want to post a job"
→ Use: `POST /api/jobs`

### "I want to find jobs"
→ Use: `GET /api/jobs?search=...`

### "I want to apply for a job"
→ Use: `POST /api/jobs/:id/apply`

### "I want to see who applied"
→ Use: `GET /api/jobs/:jobId/applications`

### "I want to update application status"
→ Use: `PATCH /api/jobs/:jobId/applications/:applicationId`

---

## Validation Rules

**Job Title:** Required, max 100 chars  
**Company Name:** Required, max 100 chars  
**Description:** Required, max 2000 chars  
**Location:** Required, max 100 chars  
**Job Type:** Required, must be Internship/Full-time/Part-time  
**Resume URL:** Required, must be valid URL  

---

## Database Structure

### Jobs Collection
- _id, title, companyName, description, location, jobType
- createdBy (User), createdAt, updatedAt
- Indexes: (createdBy, createdAt), text search, jobType, createdAt

### Job Applications Collection
- _id, jobId, applicantId, resumeUrl, status
- createdAt, updatedAt
- Indexes: unique (jobId, applicantId), applicantId, jobId, status

---

## Key Features

✅ Full-text search on title, description, location  
✅ Filter by job type  
✅ Pagination on all lists  
✅ Prevent duplicate applications (unique constraint)  
✅ Track application status  
✅ Only job posters can review applications  
✅ One application per user per job  

---

## Testing Tips

1. **Search with multiple filters:**
   - `?search=engineer&jobType=Full-time&location=San`

2. **Pagination:**
   - Always use limit and skip for large datasets
   - Check `hasMore` to determine next page

3. **Error handling:**
   - 409 if applying twice to same job
   - 403 if viewing others' applications

4. **Resume URL:**
   - Must be valid URL (string)
   - Stored as-is (no file upload)

---

## Performance Notes

- Full-text search indexed on title, description, location
- Filter queries indexed for fast results
- Pagination prevents large data transfers
- Unique constraint prevents duplicate applications

---

**Version:** 1.0  
**Status:** Production Ready  

For detailed documentation, see [JOBS_API.md](JOBS_API.md)

