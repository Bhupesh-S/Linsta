# Authentication Setup - Frontend & Backend Integration

## Overview
The authentication system has been successfully connected between the frontend (React Native) and backend (Express + MongoDB).

## What's Been Implemented

### Backend (Express)
- **Auth Routes**: `/api/auth/register`, `/api/auth/login`, `/api/auth/google`
- **MongoDB Connection**: Connected to MongoDB Atlas
- **JWT Authentication**: Token-based authentication
- **Environment Variables**: Configured in `.env` file

### Frontend (React Native)
- **Auth Context**: Manages authentication state globally
- **Login/Signup**: Full authentication flow with forms
- **AsyncStorage**: Persists user session
- **API Service**: Centralized API calls to backend
- **Protected Routes**: Automatic navigation based on auth state

## Setup Instructions

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**
   Already configured in `backend/.env`:
   - PORT=5000
   - MONGO_URI (MongoDB Atlas connection)
   - JWT_SECRET
   - GOOGLE_CLIENT_ID

3. **Start Backend Server**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Frontend**
   ```bash
   npm start
   ```

3. **Run on Device/Emulator**
   - Press `a` for Android
   - Press `i` for iOS
   - Press `w` for Web

## API Endpoints

### Register
- **POST** `/api/auth/register`
- **Body**: `{ name, email, password }`
- **Response**: `{ user: {...}, token: "..." }`

### Login
- **POST** `/api/auth/login`
- **Body**: `{ email, password }`
- **Response**: `{ user: {...}, token: "..." }`

### Google Login
- **POST** `/api/auth/google`
- **Body**: `{ idToken }`
- **Response**: `{ user: {...}, token: "..." }`

## Features

### Frontend Features
✅ Login/Signup forms with validation
✅ Loading states during authentication
✅ Error handling with alerts
✅ Persistent authentication (AsyncStorage)
✅ Auto-logout functionality
✅ User profile display
✅ Protected routes

### Backend Features
✅ User registration with password hashing
✅ Login with JWT token generation
✅ Google OAuth support
✅ MongoDB user storage
✅ CORS enabled for cross-origin requests

## File Structure

### Frontend Key Files
- `src/services/api.ts` - API service layer
- `src/context/AuthContext.tsx` - Auth state management
- `src/screens/auth/LoginScreen.tsx` - Login/Signup UI
- `src/screens/profile/ProfileScreen.tsx` - User profile with logout
- `src/navigation/RootNavigator.tsx` - Auth-aware navigation

### Backend Key Files
- `src/modules/auth/auth.controller.ts` - Auth controllers
- `src/modules/auth/auth.service.ts` - Auth business logic
- `src/modules/auth/auth.routes.ts` - Auth routes
- `src/config/db.ts` - MongoDB connection
- `.env` - Environment variables

## Testing

### Test Registration
1. Open the app
2. Click "Sign Up"
3. Enter name, email, and password
4. Click "Sign Up" button
5. Should automatically login and navigate to main app

### Test Login
1. Open the app
2. Enter registered email and password
3. Click "Sign In" button
4. Should navigate to main app

### Test Logout
1. Navigate to Profile tab
2. Click "Logout" button
3. Should navigate back to login screen

## Important Notes

1. **Backend URL**: Currently set to `http://localhost:5000` in `frontend/src/services/api.ts`
   - For physical devices, replace with your computer's IP address
   - Example: `http://192.168.1.x:5000`

2. **AsyncStorage**: Install package if not already installed
   ```bash
   cd frontend
   npx expo install @react-native-async-storage/async-storage
   ```

3. **CORS**: Backend is configured to accept requests from any origin

## Troubleshooting

### Can't Connect to Backend
- Ensure backend is running on port 5000
- For physical devices, update API_BASE_URL with your computer's IP
- Check if MongoDB connection is successful

### Login/Signup Not Working
- Check backend console for errors
- Verify MongoDB is connected
- Check network inspector for API responses

### Session Not Persisting
- Verify AsyncStorage is installed
- Check browser/device storage permissions
- Clear app data and try again

## Next Steps

- [ ] Add password reset functionality
- [ ] Implement refresh tokens
- [ ] Add profile picture upload
- [ ] Add email verification
- [ ] Enhance error messages
- [ ] Add loading indicators throughout the app
