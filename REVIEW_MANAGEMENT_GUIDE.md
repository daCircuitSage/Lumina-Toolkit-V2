# Review Management Guide

## Overview
This guide shows you how to control which reviews appear as "featured" on your Lumina Toolkit homepage.

## Method 1: Firebase Console (Recommended)

### Step 1: Access Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: "luminatoolkit"
3. Navigate to **Firestore Database** in the left sidebar

### Step 2: Navigate to Reviews Collection
1. Click on your database (likely named "luminatoolkit-default-rtdb")
2. Look for the "reviews" collection
3. If you don't see it, wait for users to submit reviews first

### Step 3: Feature/Unfeature Reviews
1. Click on any review document in the collection
2. You'll see the review data with fields like:
   - `name`: User's name
   - `role`: User's role/title
   - `content`: Review text
   - `rating`: Number 1-5
   - `userId`: User's Firebase ID
   - `userEmail`: User's email
   - `createdAt`: Timestamp
   - `featured`: Boolean field (this is what you control)

3. To **feature** a review:
   - Click "Add field"
   - Field name: `featured`
   - Field type: `boolean`
   - Value: `true`
   - Click "Save"

4. To **unfeature** a review:
   - Click on the `featured` field
   - Change value from `true` to `false`
   - Click "Save"

## Method 2: Admin Panel (Advanced)

### Access Admin Panel
Navigate to: `http://localhost:3001/admin/reviews`

### What You Can Do
- View all submitted reviews
- See which reviews are currently featured
- Toggle featured status (requires security rules setup)

### Security Rules Setup (Optional)
To enable admin controls from the web interface, you need to set up Firebase security rules:

1. Go to Firebase Console → Firestore Database → Rules
2. Replace existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Anyone can read reviews
    match /reviews/{docId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Only authenticated users can create reviews
    match /reviews/{docId} {
      allow create: if request.auth != null;
    }
  }
}
```

## How Featured Reviews Work

### Display Logic
- Homepage shows **only reviews where `featured: true`**
- Maximum of **3 featured reviews** displayed
- Reviews are sorted by `createdAt` (newest first)
- If no featured reviews exist, shows "No featured reviews yet"

### Review Structure
```json
{
  "name": "John Doe",
  "role": "Software Engineer", 
  "content": "Great tool for resume building!",
  "rating": 5,
  "userId": "firebase-user-id",
  "userEmail": "user@example.com",
  "createdAt": "2024-01-01T12:00:00Z",
  "featured": true
}
```

## Best Practices

### Featuring Reviews
1. **Quality over quantity** - Feature well-written, detailed reviews
2. **Variety** - Feature users from different roles/industries
3. **Recent** - Feature recent reviews to show active community
4. **Rating** - Prioritize 4-5 star reviews for homepage

### Managing Reviews
1. **Regular updates** - Check and update featured reviews weekly
2. **Remove outdated** - Unfeature reviews that are no longer relevant
3. **Monitor spam** - Remove inappropriate or spam reviews

## Troubleshooting

### Reviews Not Showing
1. Check if `featured` field exists and is `true`
2. Verify Firestore rules allow reading
3. Check browser console for errors

### Can't Access Admin
1. Ensure you're logged in as an admin user
2. Check if security rules are properly set up
3. Verify Firebase project configuration

### Review Submission Issues
1. Check user is authenticated
2. Verify Firestore write permissions
3. Check network connectivity

## Support

If you encounter issues:
1. Check browser console (F12) for error messages
2. Verify Firebase project is active
3. Ensure environment variables are correctly set
4. Review Firebase security rules

For advanced issues, refer to [Firebase Documentation](https://firebase.google.com/docs/firestore).
