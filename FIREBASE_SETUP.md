# Firebase Setup Guide for GrantSite

## Overview
This guide will help you set up Firebase for the 2xclusive Solutions Consulting GrantSite project, enabling cloud authentication, database management, and file storage.

## Prerequisites
- Firebase account (create at https://firebase.google.com)
- A Google Cloud project
- Administrative access to the project

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name: `grantsite` (or your preferred name)
4. Accept Firebase terms and click "Continue"
5. Enable Google Analytics (optional but recommended)
6. Click "Create project"
7. Wait for project creation to complete

## Step 2: Get Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ > "Project Settings"
2. Scroll to "Your apps" section
3. Click the Web icon `</>`
4. Enter app name: `GrantSite Web`
5. Check "Also set up Firebase Hosting" (optional)
6. Click "Register app"
7. **Copy the configuration object** that appears

## Step 3: Update firebase-config.js

1. Open `firebase-config.js` in your editor
2. Replace the configuration values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

**⚠️ Security Note:** 
- Keep your API key private
- Consider using Firebase Security Rules to restrict access
- Never commit credentials with sensitive keys to public repositories

## Step 4: Set Up Authentication

1. In Firebase Console, go to "Build" > "Authentication"
2. Click "Get started"
3. Click "Email/Password"
4. Enable "Email/Password" 
5. Click "Save"

### Optional: Enable Additional Auth Methods
- Google Sign-in
- GitHub
- Phone authentication

## Step 5: Create Firestore Database

1. Go to "Build" > "Firestore Database"
2. Click "Create database"
3. Choose region (select one closest to your users)
4. Start in **Test mode** (for development)
5. Click "Create"

## Step 6: Set Firestore Security Rules

Replace the default rules with these for development:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own documents
    match /clients/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Allow clients to read/write their grants
    match /grants/{grantId} {
      allow read, write: if request.auth.uid == resource.data.clientId;
    }
    
    // Allow messaging
    match /messages/{messageId} {
      allow read: if request.auth.uid == resource.data.recipientId || request.auth.uid == resource.data.senderId;
      allow create: if request.auth != null;
    }
    
    // Allow admins full access to site-content
    match /site-content/{document=**} {
      allow read: if true; // Anyone can read site content
      allow write: if request.auth != null; // Only authenticated users can write
    }
  }
}
```

**Important:** Update these rules with proper security rules before going to production.

## Step 7: Enable Cloud Storage (Optional)

For file uploads (documents, reports, etc.):

1. Go to "Build" > "Storage"
2. Click "Get started"
3. Start in **Test mode**
4. Select location
5. Click "Done"

## Step 8: Include Scripts in HTML Files

Add these Firebase scripts to the `<head>` section of your HTML files:

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js"></script>

<!-- Your Firebase Configuration -->
<script src="firebase-config.js"></script>

<!-- Firebase Helper Functions -->
<script src="firebase-auth.js"></script>
<script src="firebase-database.js"></script>
```

## Step 9: Update Login Pages

### For Client Registration (client-register.html)
Replace the form submission with:

```javascript
document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const clientName = document.getElementById('clientName').value;
  
  const result = await signUpClient(email, password, clientName);
  
  if (result.success) {
    // Store user data
    sessionStorage.setItem('clientAccess', 'granted');
    sessionStorage.setItem('userId', result.uid);
    window.location.href = 'client-dashboard.html';
  } else {
    document.getElementById('error-message').textContent = result.error;
  }
});
```

### For Login (login.html)
Replace the simple credentials check with:

```javascript
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  const result = await signInUser(email, password);
  
  if (result.success) {
    sessionStorage.setItem('clientAccess', 'granted');
    sessionStorage.setItem('userId', result.uid);
    window.location.href = 'client-dashboard.html';
  } else {
    document.getElementById('login-error').textContent = result.error;
  }
});
```

## Step 10: Test the Setup

1. Open your application in a browser
2. Try creating a new client account
3. Check Firebase Console > Authentication to see new users
4. Check Firestore Database to see new documents

## Database Schema

### Collections Structure:

```
clients/
├── {userId}/
│   ├── email: string
│   ├── clientName: string
│   ├── createdAt: timestamp
│   ├── status: string (active/inactive)
│   └── role: string (client/admin)

grants/
├── {grantId}/
│   ├── clientId: string
│   ├── grantName: string
│   ├── description: string
│   ├── amount: number
│   ├── status: string (submitted/approved/rejected)
│   ├── createdAt: timestamp
│   └── lastUpdated: timestamp

messages/
├── {messageId}/
│   ├── senderId: string
│   ├── recipientId: string
│   ├── message: string
│   ├── timestamp: timestamp
│   └── read: boolean

site-content/
├── homepage/
│   ├── title: string
│   ├── description: string
│   └── lastUpdated: timestamp
```

## Environment Variables (Production)

For production deployment, use environment variables instead of hardcoding credentials:

```javascript
// Use environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};
```

## Common Issues

### Issue: "Firebase is not defined"
- Make sure Firebase SDK scripts are loaded before your config file
- Check browser console for script loading errors

### Issue: CORS errors
- Enable Cloud Storage CORS configuration
- Update Firestore security rules

### Issue: Users can't access data
- Check Firestore security rules
- Verify user authentication status
- Check browser console for error messages

## Next Steps

1. Migrate existing client data to Firestore
2. Set up Cloud Functions for server-side logic
3. Implement backup strategy
4. Set up monitoring and logging
5. Configure security rules for production
6. Set up automated testing

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Firebase CLI](https://firebase.google.com/docs/cli)

## Support

For issues or questions:
1. Check Firebase documentation
2. Search Firebase GitHub issues
3. Check browser console for error messages
4. Review Firestore logs in Firebase Console
