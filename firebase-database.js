// Firebase Firestore Database Helper Functions
// Note: This assumes firebase-config.js has been loaded and firebase is available globally

/**
 * Create a new grant application
 * @param {string} clientId - Client user ID
 * @param {Object} grantData - Grant application data
 * @returns {Promise<Object>} Success status and document ID
 */
async function createGrant(clientId, grantData) {
  try {
    const docRef = await firebase.firestore().collection("grants").add({
      clientId: clientId,
      ...grantData,
      createdAt: new Date(),
      status: "submitted",
      lastUpdated: new Date()
    });

    return { success: true, grantId: docRef.id };
  } catch (error) {
    console.error("Create grant error:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Get all grants for a client
 * @param {string} clientId - Client user ID
 * @returns {Promise<Array>} Array of grant objects
 */
async function getClientGrants(clientId) {
  try {
    const snapshot = await firebase.firestore().collection("grants")
      .where("clientId", "==", clientId)
      .orderBy("createdAt", "desc")
      .get();

    const grants = [];
    snapshot.forEach((doc) => {
      grants.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, grants: grants };
  } catch (error) {
    console.error("Get grants error:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Update a grant application
 * @param {string} grantId - Grant document ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Success status
 */
async function updateGrant(grantId, updates) {
  try {
    await firebase.firestore().collection("grants").doc(grantId).update({
      ...updates,
      lastUpdated: new Date()
    });

    return { success: true };
  } catch (error) {
    console.error("Update grant error:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Get a single grant by ID
 * @param {string} grantId - Grant document ID
 * @returns {Promise<Object>} Grant data
 */
async function getGrant(grantId) {
  try {
    const doc = await firebase.firestore().collection("grants").doc(grantId).get();

    if (doc.exists) {
      return { success: true, grant: { id: doc.id, ...doc.data() } };
    } else {
      return { success: false, error: "Grant not found" };
    }
  } catch (error) {
    console.error("Get grant error:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Delete a grant application
 * @param {string} grantId - Grant document ID
 * @returns {Promise<Object>} Success status
 */
async function deleteGrant(grantId) {
  try {
    await firebase.firestore().collection("grants").doc(grantId).delete();
    return { success: true };
  } catch (error) {
    console.error("Delete grant error:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Create a message
 * @param {string} senderId - Sender user ID
 * @param {string} recipientId - Recipient user ID
 * @param {string} message - Message content
 * @returns {Promise<Object>} Success status and message ID
 */
async function sendMessage(senderId, recipientId, message) {
  try {
    const docRef = await firebase.firestore().collection("messages").add({
      senderId: senderId,
      recipientId: recipientId,
      message: message,
      timestamp: new Date(),
      read: false
    });

    return { success: true, messageId: docRef.id };
  } catch (error) {
    console.error("Send message error:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Get messages for a user
 * @param {string} userId - User ID
 * @param {boolean} unreadOnly - Get only unread messages
 * @returns {Promise<Array>} Array of message objects
 */
async function getMessages(userId, unreadOnly = false) {
  try {
    // Load inbound and outbound messages for this user
    const [inboundSnap, outboundSnap] = await Promise.all([
      firebase.firestore().collection("messages")
        .where("recipientId", "==", userId)
        .get(),
      firebase.firestore().collection("messages")
        .where("senderId", "==", userId)
        .get()
    ]);

    const messages = [];

    inboundSnap.forEach((doc) => {
      if (!unreadOnly || doc.data().read === false) {
        messages.push({ id: doc.id, ...doc.data() });
      }
    });
    if (!unreadOnly) {
      outboundSnap.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
    }

    messages.sort((a,b) => (b.timestamp?.toDate?.() || new Date(b.timestamp || 0)) - (a.timestamp?.toDate?.() || new Date(a.timestamp || 0)));

    return { success: true, messages: messages };
  } catch (error) {
    console.error("Get messages error:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Get conversation between two users
 * @param {string} userId
 * @param {string} otherId
 * @returns {Promise<Object>} messages sorted by timestamp
 */
async function getConversation(userId, otherId) {
  try {
    const [sentSnap, receivedSnap] = await Promise.all([
      firebase.firestore().collection("messages")
        .where("senderId", "==", userId)
        .where("recipientId", "==", otherId)
        .get(),
      firebase.firestore().collection("messages")
        .where("senderId", "==", otherId)
        .where("recipientId", "==", userId)
        .get()
    ]);

    const messages = [];
    sentSnap.forEach((doc) => messages.push({ id: doc.id, ...doc.data() }));
    receivedSnap.forEach((doc) => messages.push({ id: doc.id, ...doc.data() }));

    messages.sort((a,b) => (b.timestamp?.toDate?.() || new Date(b.timestamp || 0)) - (a.timestamp?.toDate?.() || new Date(a.timestamp || 0)));

    return { success: true, messages };
  } catch (error) {
    console.error("Get conversation error:", error.message);
    return { success: false, error: error.message };
  }
}

// Ensure function is globally available if 3rd-party environment scope is limited
window.getConversation = getConversation;
window.getMessages = getMessages;
window.sendMessage = sendMessage;
window.markMessageAsRead = markMessageAsRead;

/**
 * Mark a message as read
 * @param {string} messageId - Message document ID
 * @returns {Promise<Object>} Success status
 */
async function markMessageAsRead(messageId) {
  try {
    await firebase.firestore().collection("messages").doc(messageId).update({ read: true });
    return { success: true };
  } catch (error) {
    console.error("Mark message error:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Save site content edits
 * @param {string} pageId - Page identifier
 * @param {Object} contentData - Content to save
 * @returns {Promise<Object>} Success status
 */
async function saveSiteContent(pageId, contentData) {
  try {
    await firebase.firestore().collection("site-content").doc(pageId).set({
      ...contentData,
      lastUpdated: new Date(),
      updatedBy: firebase.auth().currentUser.uid
    }, { merge: true });

    return { success: true };
  } catch (error) {
    console.error("Save content error:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Get site content
 * @param {string} pageId - Page identifier
 * @returns {Promise<Object>} Site content data
 */
async function getSiteContent(pageId) {
  try {
    const doc = await firebase.firestore().collection("site-content").doc(pageId).get();

    if (doc.exists) {
      return { success: true, content: doc.data() };
    } else {
      return { success: false, error: "Content not found" };
    }
  } catch (error) {
    console.error("Get content error:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Save client preferences
 * @param {string} clientId - User ID
 * @param {Object} preferences - preferences object
 * @returns {Promise<Object>} success status
 */
async function saveClientPreferences(clientId, preferences) {
  try {
    await firebase.firestore().collection("client-preferences").doc(clientId).set({
      ...preferences,
      updatedAt: new Date()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Save preferences error:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Get client preferences
 * @param {string} clientId - User ID
 * @returns {Promise<Object>} preferences
 */
async function getClientPreferences(clientId) {
  try {
    const doc = await firebase.firestore().collection("client-preferences").doc(clientId).get();
    if (doc.exists) return { success: true, preferences: doc.data() };
    else return { success: true, preferences: { updates: true, messages: true, news: true } };
  } catch (error) {
    console.error("Get preferences error:", error.message);
    return { success: false, error: error.message };
  }
}
