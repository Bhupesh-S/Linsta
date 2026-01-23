# Profile Image Upload with Cloudinary - Complete Guide

## ✅ Implementation Summary

The profile image upload feature is now fully integrated with the backend and Cloudinary storage. Users can upload profile pictures from their device, which are automatically processed and stored in Cloudinary.

## 🏗️ Architecture

### Frontend (React Native)
- **Location**: `frontend/src/pages/profile/EditProfileScreen.tsx`
- **Image Picker**: Uses `expo-image-picker` to select images from device
- **Upload Service**: `frontend/src/services/profile.api.ts`
- **Display Component**: `frontend/src/components/profile/ProfileHeader.tsx`

### Backend (Node.js/Express)
- **Route**: `POST /api/users/profile/image`
- **Location**: `backend/src/modules/users/user.routes.ts`
- **Middleware**: `backend/src/middlewares/upload.middleware.ts` (Multer)
- **Storage**: `backend/src/config/cloudinary.ts`

## 📝 How It Works

### 1. Image Selection (Frontend)
```tsx
// User taps on profile image in EditProfileScreen
const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });
  
  if (!result.canceled) {
    setProfileImageUri(result.assets[0].uri);
  }
};
```

### 2. Image Upload (Frontend → Backend)
```tsx
// When user saves profile
const onSave = async () => {
  // Only upload if image is new (local URI, not Cloudinary URL)
  if (profileImageUri && !profileImageUri.startsWith('http')) {
    await profileApi.uploadProfileImage(profileImageUri);
  }
};
```

### 3. API Request (Frontend Service)
```typescript
// profile.api.ts creates FormData and sends via XMLHttpRequest
uploadProfileImage: async (imageUri: string) => {
  const formData = new FormData();
  formData.append('profileImage', {
    uri: imageUri,
    name: 'profile.jpg',
    type: 'image/jpeg',
  });
  
  // POST to /api/users/profile/image
  xhr.send(formData);
}
```

### 4. Backend Processing
```typescript
// Route with multer middleware
router.post("/profile/image", 
  authMiddleware,                    // Verify JWT token
  upload.single('profileImage'),     // Parse multipart/form-data
  async (req, res) => {
    // Upload to Cloudinary
    const imageUrl = await uploadProfileImage(req.file.buffer);
    
    // Update profile with new image URL
    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { profileImageUrl: imageUrl },
      { new: true, upsert: true }
    );
    
    res.json({ user, profile });
  }
);
```

### 5. Cloudinary Upload
```typescript
// Uploads buffer to Cloudinary with transformations
export const uploadProfileImage = async (fileBuffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'linsta/profiles',          // Organize in folder
        resource_type: 'image',
        transformation: [
          { 
            width: 500, 
            height: 500, 
            crop: 'fill',           // Fill square
            gravity: 'face'         // Focus on face
          },
          { quality: 'auto' }       // Auto-optimize
        ]
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);    // Return HTTPS URL
      }
    );
    uploadStream.end(fileBuffer);
  });
};
```

### 6. Display Image (Frontend)
```tsx
// ProfileScreen automatically refreshes when returning from edit
<ProfileHeader
  name={profileData?.user?.name}
  photoUrl={profileData?.profile?.profileImageUrl}  // Cloudinary URL
/>

// ProfileHeader component
{photoUrl ? (
  <Image source={{ uri: photoUrl }} style={styles.avatar} />
) : (
  <View style={styles.avatarPlaceholder}>
    <Text>{name?.charAt(0).toUpperCase()}</Text>
  </View>
)}
```

## 🎯 Key Features

### Image Processing
- ✅ Automatic 500x500 resize
- ✅ Face detection and centering
- ✅ Auto quality optimization
- ✅ Secure HTTPS URLs
- ✅ CDN delivery (fast loading)

### Security
- ✅ JWT authentication required
- ✅ File type validation (images only)
- ✅ File size limit (50MB max)
- ✅ Secure upload to Cloudinary

### User Experience
- ✅ Image preview before upload
- ✅ Loading states during upload
- ✅ Error handling with alerts
- ✅ Auto-refresh after save
- ✅ Fallback avatar with initials

## 🔧 Configuration

### Cloudinary Environment Variables
Located in `backend/.env`:
```env
CLOUDINARY_CLOUD_NAME=do552lhuo
CLOUDINARY_API_KEY=939756468427687
CLOUDINARY_API_SECRET=W91jlKcakGnWuHX3rUGHlJzsOok
```

### Multer Configuration
Located in `backend/src/middlewares/upload.middleware.ts`:
```typescript
export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});
```

## 📱 Frontend Dependencies

```json
{
  "expo-image-picker": "^15.0.7",  // For selecting images
  "@expo/vector-icons": "^14.0.0"  // For icons
}
```

## 🚀 Testing

### Test Cloudinary Connection
```bash
cd backend
node test-cloudinary.js
```

Expected output:
```
✅ Cloudinary connection successful!
Response: { status: 'ok' }
```

### Test Upload Manually

1. Start backend server:
```bash
cd backend
npm run dev
```

2. Start frontend app:
```bash
cd frontend
npm start
```

3. Navigate to: Profile → Edit Profile → Tap profile image → Select image → Save

## 🐛 Troubleshooting

### Image Not Uploading
- Check backend logs for errors
- Verify Cloudinary credentials in `.env`
- Check network connectivity
- Ensure file size < 50MB

### Image Not Displaying
- Check `profileImageUrl` in database
- Verify Cloudinary URL is accessible
- Check console logs in app
- Clear app cache and restart

### Permission Errors
```tsx
// Request permissions explicitly
const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
if (status !== 'granted') {
  Alert.alert('Permission denied');
}
```

## 📁 File Structure

```
backend/
  ├── src/
  │   ├── config/
  │   │   └── cloudinary.ts          # Cloudinary upload functions
  │   ├── middlewares/
  │   │   └── upload.middleware.ts    # Multer configuration
  │   └── modules/
  │       └── users/
  │           ├── user.routes.ts      # Profile image route
  │           └── profile.model.ts    # Profile schema
  ├── .env                            # Cloudinary credentials
  └── test-cloudinary.js             # Connection test

frontend/
  ├── src/
  │   ├── pages/profile/
  │   │   ├── EditProfileScreen.tsx   # Image picker & upload
  │   │   └── ProfileScreen.tsx       # Display profile with image
  │   ├── components/profile/
  │   │   └── ProfileHeader.tsx       # Avatar display component
  │   └── services/
  │       └── profile.api.ts          # Upload API function
```

## 🔄 Data Flow Diagram

```
User Device                Frontend App              Backend Server         Cloudinary
    │                          │                          │                      │
    │─── Select Image ────────▶│                          │                      │
    │                          │                          │                      │
    │                          │─── FormData ───────────▶│                      │
    │                          │    (profileImage)        │                      │
    │                          │                          │                      │
    │                          │                          │─── Upload Buffer ──▶│
    │                          │                          │                      │
    │                          │                          │◀── Image URL ───────│
    │                          │                          │  (secure HTTPS)      │
    │                          │                          │                      │
    │                          │                          │─ Save to MongoDB     │
    │                          │                          │  (profileImageUrl)   │
    │                          │                          │                      │
    │                          │◀── Response ─────────────│                      │
    │                          │    (user + profile)      │                      │
    │                          │                          │                      │
    │◀── Display Image ────────│                          │                      │
    │    (Cloudinary CDN)      │                          │                      │
```

## ✨ Benefits of Cloudinary

1. **Automatic Optimization**: Images are automatically compressed and optimized
2. **Fast Delivery**: CDN ensures fast loading worldwide
3. **Transformations**: Resize, crop, and enhance images on-the-fly
4. **Face Detection**: Smart cropping focuses on faces
5. **Backup**: Images are securely stored with redundancy
6. **Scalability**: Handles unlimited uploads

## 🎉 Success!

The profile image upload feature is now fully functional and integrated with Cloudinary. Users can:
- ✅ Select images from their device
- ✅ Preview images before uploading
- ✅ Upload to Cloudinary with automatic optimization
- ✅ See their profile picture immediately after save
- ✅ Have images delivered via fast CDN

---

**Note**: Keep your Cloudinary credentials secure and never commit them to public repositories!
