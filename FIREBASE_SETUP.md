# Firebase Setup Guide

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" 
3. Enter your project name (e.g., "lumina-toolkit")
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Set Up Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Enable "Email/Password" sign-in method
4. Enable "Google" sign-in method
5. For Google sign-in, you'll need to:
   - Add your authorized domains (localhost:3000 for development)
   - Add your production domain when deployed

## 3. Set Up Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)
5. Click "Create database"

## 4. Get Firebase Configuration

1. Go to Project Settings (gear icon) → General
2. Under "Your apps", click the web icon (</>)
3. Register your app (nickname: "Lumina Toolkit")
4. Copy the firebaseConfig object

## 5. Update Environment Variables

Copy the configuration values to your `.env` file:

```env
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"
```

## 6. Test the Application

1. Run `npm run dev` to start the development server
2. Navigate to `http://localhost:3000/login`
3. Test email/password registration
4. Test Google sign-in
5. Check the Firestore Database to see user data

## Database Structure

The app automatically creates a `users` collection with the following structure:

```javascript
{
  uid: "user-uid",
  email: "user@example.com", 
  displayName: "User Name",
  photoURL: "https://... (for Google users)",
  createdAt: "2024-01-01T00:00:00.000Z",
  authProvider: "google" | "email"
}
```

## Security Rules

For production, update your Firestore security rules in Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Features Implemented

✅ Email/password authentication
✅ Google OAuth authentication  
✅ User registration
✅ User login/logout
✅ Protected routes
✅ User data storage in Firestore
✅ Responsive UI with Tailwind CSS
✅ Form validation
✅ Error handling
✅ Loading states
