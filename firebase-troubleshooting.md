# Google Authentication Troubleshooting Guide

## Common Issues and Solutions

### 1. "auth/unauthorized-domain" Error
**Problem**: The domain you're testing on is not authorized in Firebase Auth settings.

**Solution**:
1. Go to Firebase Console → Authentication → Settings → Authorized domains
2. Add your development domain: `localhost:3001` (or your current port)
3. Add production domain: `yourdomain.com`
4. Save and wait a few minutes for changes to propagate

### 2. Google Provider Not Enabled
**Problem**: Google sign-in provider is not enabled in Firebase.

**Solution**:
1. Go to Firebase Console → Authentication → Sign-in method
2. Click on Google
3. Enable the toggle
4. Add your authorized domains (same as above)
5. Save configuration

### 3. API Key Issues
**Problem**: Firebase API key is missing or incorrect.

**Solution**:
1. Check your `.env` file has all required Firebase variables
2. Verify the API key matches your Firebase project
3. Ensure the API key has proper restrictions if any are set

### 4. Popup Blocked
**Problem**: Browser is blocking the Google sign-in popup.

**Solution**:
1. Allow popups for your development domain
2. Try using incognito/private window
3. Check browser popup blocker settings

## Current Configuration Check

Based on your `.env` file:
- ✅ Firebase API Key: Present
- ✅ Auth Domain: `luminatoolkit.firebaseapp.com`
- ✅ Project ID: `luminatoolkit`
- ✅ Storage Bucket: Configured
- ✅ Messaging Sender ID: Present
- ✅ App ID: Present

## Next Steps to Fix

1. **Check Firebase Console Settings**:
   - Go to https://console.firebase.google.com/project/luminatoolkit/authentication/providers
   - Ensure Google provider is enabled
   - Add `localhost:3001` to authorized domains

2. **Test with Console Logs**:
   - Open browser developer tools
   - Try Google sign-in
   - Check console for detailed error messages

3. **Verify Network Requests**:
   - Check Network tab in dev tools
   - Look for Firebase API calls
   - Ensure no CORS or network errors

## Debug Commands

Run these in browser console to test Firebase setup:

```javascript
// Check if Firebase is initialized
import { auth } from './src/config/firebase.js'
console.log('Auth object:', auth)

// Check current user
auth.onAuthStateChanged(user => {
  console.log('Current user:', user)
})
```

## Environment Variables Template

Copy this to your `.env` file if any are missing:

```env
VITE_FIREBASE_API_KEY="AIzaSyBB_YUBIhS1CcbXNeD3rYGNToXFA3A9OL0"
VITE_FIREBASE_AUTH_DOMAIN="luminatoolkit.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="luminatoolkit"
VITE_FIREBASE_STORAGE_BUCKET="luminatoolkit.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="492584336630"
VITE_FIREBASE_APP_ID="1:492584336630:web:509e7c7803298bc40d00d7"
```

## Testing Steps

1. Open browser to `http://localhost:3001`
2. Open Developer Tools (F12)
3. Go to Console tab
4. Try Google sign-in
5. Look for error messages in console
6. Check Network tab for failed requests

## Contact Support

If issues persist:
1. Check Firebase project status
2. Verify billing is active if required
3. Check Firebase service status page
4. Recreate Firebase project if necessary
