// Firebase Authentication Helper Functions
// Note: This assumes firebase-config.js has been loaded and firebase is available globally
/**
 * Sign up a new client user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {Object} clientData - Client profile data
 * @returns {Promise<Object>} User credentials and success status
 */
async function signUpClient(email, password, clientData) {
  try {
    // persist auth across browser sessions
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // store client profile in Firestore
    await firebase.firestore().collection("clients").doc(user.uid).set({
      email: email,
      createdAt: new Date(),
      status: "active",
      role: "client",
      ...clientData
    });

    console.log("Client signed up and profile saved:", user.uid);
    return { success: true, user: user, uid: user.uid };
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error: error.message || String(error) };
  }
}
/**
 * Delete the current authenticated user
 * @returns {Promise<Object>} Success status
 */
async function deleteCurrentUser() {
  try {
    await firebase.auth().currentUser.delete();
    return { success: true };
  } catch (error) {
    console.error("Delete user error:", error.message);
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
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    const userDocRef = firebase.firestore().collection("clients").doc(user.uid);
    const userDoc = await userDocRef.get();
    let profile = userDoc.exists ? userDoc.data() : null;

    if (!profile) {
      // If the account came directly from Auth console, create a minimal Firestore profile
      profile = {
        email: user.email,
        clientName: user.email,
        role: user.email === "owner@2xclusive.com" ? "owner" : "client",
        createdAt: new Date(),
      };
      await userDocRef.set(profile, { merge: true });
    }

    // Auto-upgrade legacy owner missing the role
    if (user.email === "owner@2xclusive.com" && profile.role !== "owner") {
        profile.role = "owner";
        await userDocRef.set({ role: "owner" }, { merge: true });
    }

    const role = profile.role || "client";

    console.log("User signed in:", user.uid, "role:", role, "profile:", profile);
    return { success: true, user: user, uid: user.uid, role: role, profile: profile };
  } catch (error) {
    console.error("Sign in error:", error);
    return { success: false, error: error.message || String(error) };
  }
}
/**
 * Sign out current user
 * @returns {Promise<Object>} Success status
 */
async function signOutUser() {
  try {
    await firebase.auth().signOut();
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
    firebase.auth().onAuthStateChanged((user) => {
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
    await firebase.auth().sendPasswordResetEmail(email);
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
    const user = firebase.auth().currentUser;
    if (user) {
      await user.updateProfile({ displayName: displayName });
      return { success: true };
    }
    return { success: false, error: "No user signed in" };
  } catch (error) {
    console.error("Profile update error:", error.message);
    return { success: false, error: error.message };
  }
}
// Export all functions to global scope
window.signUpClient = signUpClient;
window.signInUser = signInUser;
window.signOutUser = signOutUser;
window.checkAuth = checkAuth;
window.resetPassword = resetPassword;
window.updateUserProfile = updateUserProfile;
window.deleteCurrentUser = deleteCurrentUser;