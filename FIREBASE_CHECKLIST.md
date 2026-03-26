# Firebase Integration Checklist

## ✅ Setup Complete
- [x] Firebase configuration file created (`firebase-config.js`)
- [x] Firebase authentication functions created (`firebase-auth.js`)
- [x] Firebase database functions created (`firebase-database.js`)
- [x] Firebase SDK scripts added to all HTML files
- [x] Setup guide created (`FIREBASE_SETUP.md`)

## 📋 Next Steps (In Order)

### 1. Create Firebase Project
- [ ] Go to [https://console.firebase.google.com](https://console.firebase.google.com)
- [ ] Click "Add project"
- [ ] Name it `grantsite` (or similar)
- [ ] Wait for project creation

### 2. Get Firebase Credentials
- [ ] In Firebase Console, go to Settings ⚙️
- [ ] Click "Project Settings"
- [ ] Scroll to "Your apps" > Web app
- [ ] Click "Add app"
- [ ] Register as "GrantSite Web"
- [ ] Copy the Firebase config object

### 3. Update firebase-config.js
- [ ] Open `firebase-config.js`
- [ ] Replace placeholder values with your credentials:
  - `apiKey`
  - `authDomain`
  - `projectId`
  - `storageBucket`
  - `messagingSenderId`
  - `appId`

### 4. Enable Authentication
- [ ] In Firebase Console, go to "Build" > "Authentication"
- [ ] Click "Get started"
- [ ] Enable "Email/Password" authentication
- [ ] Save changes

### 5. Create Firestore Database
- [ ] Go to "Build" > "Firestore Database"
- [ ] Click "Create database"
- [ ] Choose region (closest to your users)
- [ ] Start in "Test mode" for development
- [ ] Create

### 6. Update Firestore Security Rules
- [ ] In Firestore, go to "Rules" tab
- [ ] Replace with the rules from `FIREBASE_SETUP.md` "Set Firestore Security Rules" section
- [ ] Click "Publish"

### 7. Enable Cloud Storage (Optional)
- [ ] Go to "Build" > "Storage"
- [ ] Click "Get started"
- [ ] Start in "Test mode"
- [ ] Select location and "Done"

### 8. Test Connection
- [ ] Open your site in browser
- [ ] Check browser console (F12)
- [ ] Look for Firebase initialization message
- [ ] Try creating a client account
- [ ] Check Firebase Console > Authentication to see new user

### 9. Migrate Existing Data
- [ ] Export existing client data (if any)
- [ ] Import into Firestore collections
- [ ] Test data retrieval

### 10. Production Setup
- [ ] Update security rules for production
- [ ] Set up environment variables
- [ ] Enable HTTPS on domain
- [ ] Configure domain in Firebase Console
- [ ] Set up monitoring
- [ ] Enable backups

## 📁 Files Created/Modified

### New Files
- `firebase-config.js` - Firebase configuration (update with your credentials)
- `firebase-auth.js` - Authentication helper functions
- `firebase-database.js` - Database operations helper functions
- `FIREBASE_SETUP.md` - Detailed setup guide
- `FIREBASE_CHECKLIST.md` - This file

### Modified Files
- `index.html` - Added Firebase scripts
- `login.html` - Added Firebase scripts
- `client-dashboard.html` - Added Firebase scripts
- `client-register.html` - Added Firebase scripts
- `owner.html` - Added Firebase scripts
- `editor.html` - Added Firebase scripts

## 🔑 Important Files to Update

### firebase-config.js
Contains your Firebase project credentials. Keep this file secure and never commit sensitive keys to public repositories.

**Required values:**
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",           // From Firebase Console
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## 🚀 Available Functions

### Authentication (`firebase-auth.js`)
- `signUpClient(email, password, clientName)` - Register new client
- `signInUser(email, password)` - Sign in existing user
- `signOutUser()` - Sign out current user
- `checkAuth()` - Check if user is authenticated
- `resetPassword(email)` - Send password reset email
- `updateUserProfile(displayName)` - Update user display name

### Database Operations (`firebase-database.js`)
- `createGrant(clientId, grantData)` - Create new grant application
- `getClientGrants(clientId)` - Get all grants for a client
- `updateGrant(grantId, updates)` - Update grant details
- `getGrant(grantId)` - Get single grant by ID
- `deleteGrant(grantId)` - Delete a grant
- `sendMessage(senderId, recipientId, message)` - Send message
- `getMessages(userId, unreadOnly)` - Retrieve messages
- `markMessageAsRead(messageId)` - Mark message as read
- `saveSiteContent(pageId, contentData)` - Save site content
- `getSiteContent(pageId)` - Get site content

## 📚 Useful Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Firebase CLI](https://firebase.google.com/docs/cli)

## ⚠️ Important Security Notes

1. **Never commit firebase-config.js with real credentials to public repos**
2. **Use environment variables in production**
3. **Review and test security rules before going live**
4. **Enable HTTPS for production**
5. **Set up database backups**
6. **Monitor security alerts in Firebase Console**

## 🆘 Troubleshooting

### Firebase is not defined
- Check that Firebase SDK scripts load before config file
- Check browser console for script errors

### CORS Errors
- Update Firebase Storage CORS configuration
- Review Firestore security rules

### Authentication Failing
- Verify email/password auth is enabled
- Check security rules allow user creation
- Look for errors in browser console

### Data not saving
- Check Firestore security rules
- Verify user is authenticated
- Check browser console for errors
- Verify collection names match your code

## 📝 Notes

- Start with test mode security rules in development
- Monitor Firebase usage and billing
- Plan for scaling as your user base grows
- Regular backup of important data
- Document your database schema
- Test thoroughly before production deployment

---

**Last Updated:** January 31, 2026
**Status:** Ready for Firebase credentials
