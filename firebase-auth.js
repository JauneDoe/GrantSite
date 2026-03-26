// Firebase Authentication Helper Functions
// Note: This assumes firebase-config.js has been loaded and firebase is available globally

/**
 * Sign up a new client user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} clientName - Client organization name
 * @returns {Promise<Object>} User credentials and success status
 */
async function signUpClient(email, password, clientName) {
  try {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Store client profile in Firestore
    await firebase.firestore().collection("clients").doc(user.uid).set({
      email: email,
      clientName: clientName,
      createdAt: new Date(),
      status: "active",
      role: "client"
    });

    return { success: true, user: user, uid: user.uid };
  } catch (error) {
    console.error("Signup error:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Sign in an existing user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User credentials and success status
 */
async function signInUser(email, password) {
  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Get user role
    const userDoc = await firebase.firestore().collection("clients").doc(user.uid).get();
    const role = userDoc.exists ? userDoc.data().role : "client";

    return { success: true, user: user, uid: user.uid, role: role };
  } catch (error) {
    console.error("Sign in error:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Sign out current user
 * @returns {Promise<Object>} Success status
 */
async function signOutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Check if user is authenticated
 * @returns {Promise<Object>} User data or null
 */
function checkAuth() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve({ authenticated: true, user: user });
      } else {
        resolve({ authenticated: false, user: null });
      }
    });
  });
}

/**
 * Reset password for user
 * @param {string} email - User email
 * @returns {Promise<Object>} Success status
 */
async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error("Password reset error:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Update user profile
 * @param {string} displayName - New display name
 * @returns {Promise<Object>} Success status
 */
async function updateUserProfile(displayName) {
  try {
    const user = auth.currentUser;
    if (user) {
      await updateProfile(user, { displayName: displayName });
      return { success: true };
    }
    return { success: false, error: "No user signed in" };
  } catch (error) {
    console.error("Profile update error:", error.message);
    return { success: false, error: error.message };
  }
}
