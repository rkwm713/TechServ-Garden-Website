/**
 * TechServ Community Garden - Authentication Service
 * 
 * This module handles user authentication, registration, profile management,
 * and other user-related functionality using Firebase Authentication.
 */

import { 
  auth, 
  firestore,
  storage,
  functions
} from './config.js';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  onAuthStateChanged
} from 'firebase/auth';

import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp as firestoreTimestamp,
  onSnapshot
} from 'firebase/firestore';

import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';

import {
  httpsCallable
} from 'firebase/functions';

// Collection references
const usersCollection = collection(firestore, 'users');

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Register a new user with email and password
 * 
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @param {string} userData.displayName - User's display name
 * @returns {Promise<Object>} - User data object
 * @throws {Error} If registration fails
 */
export const registerWithEmail = async ({ email, password, displayName }) => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with display name
    await updateProfile(user, { displayName });
    
    // Create user document in Firestore
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName,
      photoURL: user.photoURL || null,
      role: 'user', // Default role
      createdAt: firestoreTimestamp(),
      updatedAt: firestoreTimestamp()
    };
    
    await setDoc(doc(usersCollection, user.uid), userData);
    
    return {
      uid: user.uid,
      email: user.email,
      displayName,
      role: 'user'
    };
  } catch (error) {
    console.error('Error registering user with email:', error);
    throw error;
  }
};

/**
 * Sign in with email and password
 * 
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} - User data object
 * @throws {Error} If sign in fails
 */
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update last login time
    await updateDoc(doc(usersCollection, user.uid), {
      lastLoginAt: firestoreTimestamp()
    });
    
    // Get user document from Firestore to get role
    const userDoc = await getDoc(doc(usersCollection, user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: userData.role || 'user'
      };
    } else {
      console.warn('User document not found in Firestore. Creating one now.');
      
      // Create user document if it doesn't exist
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || email.split('@')[0],
        photoURL: user.photoURL || null,
        role: 'user',
        createdAt: firestoreTimestamp(),
        updatedAt: firestoreTimestamp(),
        lastLoginAt: firestoreTimestamp()
      };
      
      await setDoc(doc(usersCollection, user.uid), userData);
      
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || email.split('@')[0],
        role: 'user'
      };
    }
  } catch (error) {
    console.error('Error signing in with email:', error);
    throw error;
  }
};

/**
 * Sign in with Google
 * 
 * @returns {Promise<Object>} - User data object
 * @throws {Error} If sign in fails
 */
export const signInWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;
    
    // Check if user document exists
    const userDocRef = doc(usersCollection, user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      // Update last login time
      await updateDoc(userDocRef, {
        lastLoginAt: firestoreTimestamp(),
        updatedAt: firestoreTimestamp(),
        // Update these fields in case they changed in Google
        displayName: user.displayName || userDoc.data().displayName,
        photoURL: user.photoURL || userDoc.data().photoURL
      });
      
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: userDoc.data().role || 'user'
      };
    } else {
      // Create new user document
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL || null,
        role: 'user',
        createdAt: firestoreTimestamp(),
        updatedAt: firestoreTimestamp(),
        lastLoginAt: firestoreTimestamp()
      };
      
      await setDoc(userDocRef, userData);
      
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: 'user'
      };
    }
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

/**
 * Sign out the current user
 * 
 * @returns {Promise<void>}
 * @throws {Error} If sign out fails
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Send password reset email
 * 
 * @param {string} email - User's email
 * @returns {Promise<void>}
 * @throws {Error} If sending reset email fails
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

/**
 * Update user profile
 * 
 * @param {Object} profileData - Profile data to update
 * @param {string} [profileData.displayName] - User's display name
 * @param {File} [profileData.photoFile] - User's profile photo file
 * @returns {Promise<Object>} - Updated user data
 * @throws {Error} If update fails
 */
export const updateUserProfile = async ({ displayName, photoFile }) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('No user is currently signed in');
    }
    
    const updateData = {};
    
    // Update display name if provided
    if (displayName) {
      await updateProfile(user, { displayName });
      updateData.displayName = displayName;
    }
    
    // Upload and update photo if provided
    if (photoFile) {
      // Upload photo to Firebase Storage
      const storageRef = ref(storage, `profile_photos/${user.uid}`);
      await uploadBytes(storageRef, photoFile);
      
      // Get download URL
      const photoURL = await getDownloadURL(storageRef);
      
      // Update profile with photo URL
      await updateProfile(user, { photoURL });
      
      updateData.photoURL = photoURL;
    }
    
    // Update Firestore document
    updateData.updatedAt = firestoreTimestamp();
    await updateDoc(doc(usersCollection, user.uid), updateData);
    
    return {
      uid: user.uid,
      email: user.email,
      displayName: displayName || user.displayName,
      photoURL: updateData.photoURL || user.photoURL
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Update user email
 * 
 * @param {string} newEmail - New email address
 * @param {string} password - Current password for verification
 * @returns {Promise<void>}
 * @throws {Error} If update fails
 */
export const updateUserEmail = async (newEmail, password) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('No user is currently signed in');
    }
    
    // Re-authenticate user before changing email
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
    
    // Update email in Firebase Auth
    await updateEmail(user, newEmail);
    
    // Update email in Firestore
    await updateDoc(doc(usersCollection, user.uid), {
      email: newEmail,
      updatedAt: firestoreTimestamp()
    });
  } catch (error) {
    console.error('Error updating user email:', error);
    throw error;
  }
};

/**
 * Update user password
 * 
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<void>}
 * @throws {Error} If update fails
 */
export const updateUserPassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('No user is currently signed in');
    }
    
    // Re-authenticate user before changing password
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // Update password in Firebase Auth
    await updatePassword(user, newPassword);
    
    // Update Firestore document
    await updateDoc(doc(usersCollection, user.uid), {
      updatedAt: firestoreTimestamp()
    });
  } catch (error) {
    console.error('Error updating user password:', error);
    throw error;
  }
};

/**
 * Update user role (admin function)
 * 
 * @param {string} userId - ID of user to update
 * @param {string} role - New role (admin, moderator, user)
 * @returns {Promise<Object>} - Result of the operation
 * @throws {Error} If update fails
 */
export const updateUserRole = async (userId, role) => {
  try {
    // Call the Cloud Function to update user role
    const updateRoleFunction = httpsCallable(functions, 'updateUserRole');
    const result = await updateRoleFunction({ userId, role });
    
    return result.data;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

/**
 * Get current user data
 * 
 * @returns {Promise<Object|null>} - User data or null if not signed in
 */
export const getCurrentUserData = async () => {
  const user = auth.currentUser;
  
  if (!user) {
    return null;
  }
  
  try {
    // Get user document from Firestore to get role and other data
    const userDoc = await getDoc(doc(usersCollection, user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      
      return {
        id: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: userData.role || 'user',
        createdAt: userData.createdAt,
        lastLoginAt: userData.lastLoginAt
      };
    } else {
      console.warn('User is authenticated but has no Firestore document');
      return {
        id: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: 'user'
      };
    }
  } catch (error) {
    console.error('Error getting current user data:', error);
    throw error;
  }
};

/**
 * Get user data by ID
 * 
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} - User data or null if not found
 */
export const getUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(usersCollection, userId));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      
      return {
        id: userData.uid,
        email: userData.email,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        role: userData.role || 'user',
        createdAt: userData.createdAt
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

/**
 * Subscribe to user data changes
 * 
 * @param {string} userId - User ID
 * @param {Function} callback - Function to call with user data
 * @returns {Function} - Unsubscribe function
 */
export const subscribeToUserData = (userId, callback) => {
  const userRef = doc(usersCollection, userId);
  
  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      const userData = doc.data();
      
      callback({
        id: userData.uid,
        email: userData.email,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        role: userData.role || 'user',
        createdAt: userData.createdAt,
        lastLoginAt: userData.lastLoginAt
      });
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('Error subscribing to user data:', error);
  });
};

/**
 * Subscribe to authentication state changes
 * 
 * @param {Function} callback - Function to call with auth state
 * @returns {Function} - Unsubscribe function
 */
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        // Get user document from Firestore
        const userDoc = await getDoc(doc(usersCollection, user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          callback({
            isAuthenticated: true,
            user: {
              id: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              role: userData.role || 'user'
            }
          });
        } else {
          callback({
            isAuthenticated: true,
            user: {
              id: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              role: 'user'
            }
          });
        }
      } catch (error) {
        console.error('Error getting user data in auth change:', error);
        callback({
          isAuthenticated: true,
          user: {
            id: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: 'user'
          }
        });
      }
    } else {
      callback({
        isAuthenticated: false,
        user: null
      });
    }
  });
};
