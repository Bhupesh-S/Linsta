# Cloudinary Setup for Media Uploads

This guide will help you set up Cloudinary for handling image and video uploads in posts.

## 1. Create a Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Click "Sign Up for Free"
3. Complete the registration process

## 2. Get Your Cloudinary Credentials

1. After logging in, go to your Dashboard
2. You'll see your **Cloud Name**, **API Key**, and **API Secret**
3. Copy these values

## 3. Update Backend Environment Variables

Open `backend/.env` and update the following values:

```env
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

Replace the placeholder values with your actual Cloudinary credentials from step 2.

## 4. Test the Setup

1. Restart the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. In the frontend app, try creating a post with an image or video
3. The media will be uploaded to Cloudinary and stored there

## Features Implemented

✅ **Backend:**
- Cloudinary integration for image/video storage
- Multer middleware for file uploads (up to 50MB)
- POST `/api/posts/upload` endpoint for creating posts with media
- Automatic media upload to Cloudinary
- Support for multiple images/videos per post

✅ **Frontend:**
- CreatePost screen with media picker
- Camera integration for taking photos
- Gallery picker for selecting images/videos
- Multiple media selection support
- Preview of selected media before posting
- Floating action button on Home screen to create posts

## API Endpoints

### Create Post with Media Upload
```
POST /api/posts/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- caption: string (required)
- eventId: string (optional)
- media: file[] (up to 5 files)
```

### Create Post (with pre-uploaded media URLs)
```
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "caption": "string",
  "eventId": "string (optional)",
  "media": [
    {
      "url": "string",
      "type": "image" | "video"
    }
  ]
}
```

## Usage in Frontend

1. Click the **+** floating button on Home screen
2. Enter your post caption
3. Click "Photo/Video" to select from gallery
4. Click "Camera" to take a photo
5. Preview selected media
6. Click "Post" to create

The app will:
- Upload media to Cloudinary
- Create the post with media URLs
- Return to Home screen
- Refresh the feed to show your new post

## Folder Structure on Cloudinary

Media is organized in folders:
- `linsta/posts/images/` - All post images
- `linsta/posts/videos/` - All post videos

## Notes

- Maximum file size: 50MB per file
- Maximum files per post: 5
- Supported image formats: JPEG, JPG, PNG, GIF, WEBP
- Supported video formats: MP4, MOV, AVI, WMV, FLV, MKV
- Images are automatically optimized by Cloudinary
- Videos are automatically transcoded by Cloudinary
