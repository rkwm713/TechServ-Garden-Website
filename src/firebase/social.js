/**
 * TechServ Community Garden - Social Service
 * 
 * This module handles social interactions like comments, likes, shares, 
 * notifications, and activity feeds using Firebase Firestore.
 */

import { 
  firestore,
  functions 
} from './config.js';

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp as firestoreTimestamp,
  onSnapshot
} from 'firebase/firestore';

import {
  httpsCallable
} from 'firebase/functions';

import { getCurrentUserData } from './auth.js';

// Collection references
const commentsCollection = collection(firestore, 'comments');
const likesCollection = collection(firestore, 'likes');
const sharesCollection = collection(firestore, 'shares');
const notificationsCollection = collection(firestore, 'notifications');
const activitiesCollection = collection(firestore, 'activities');

/**
 * Add a comment to a content item
 * 
 * @param {Object} commentData - Comment data
 * @param {string} commentData.contentId - ID of the content being commented on
 * @param {string} commentData.contentType - Type of content (task, post, etc)
 * @param {string} commentData.text - Comment text
 * @param {string} [commentData.parentCommentId] - Parent comment ID for replies
 * @returns {Promise<string>} - ID of created comment
 * @throws {Error} If comment creation fails
 */
export const addComment = async (commentData) => {
  try {
    const user = await getCurrentUserData();
    
    if (!user) {
      throw new Error('You must be logged in to comment');
    }
    
    // Create comment document
    const commentDoc = {
      contentId: commentData.contentId,
      contentType: commentData.contentType,
      text: commentData.text,
      userId: user.id,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      parentCommentId: commentData.parentCommentId || null,
      createdAt: firestoreTimestamp(),
      updatedAt: firestoreTimestamp(),
      isEdited: false
    };
    
    // Add comment to Firestore
    const docRef = await addDoc(commentsCollection, commentDoc);
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

/**
 * Get comments for a content item
 * 
 * @param {string} contentId - ID of the content
 * @param {string} contentType - Type of content (task, post, etc)
 * @param {Object} [options={}] - Query options
 * @param {string} [options.parentCommentId=null] - Get replies to a specific comment
 * @param {number} [options.limit=50] - Maximum number of comments to return
 * @returns {Promise<Object>} - Object with comments array and pagination info
 * @throws {Error} If getting comments fails
 */
export const getComments = async (contentId, contentType, options = {}) => {
  try {
    // Build query constraints
    const constraints = [
      where('contentId', '==', contentId),
      where('contentType', '==', contentType)
    ];
    
    // Filter by parent comment if specified
    if (options.parentCommentId) {
      constraints.push(where('parentCommentId', '==', options.parentCommentId));
    } else {
      // Get top-level comments only
      constraints.push(where('parentCommentId', '==', null));
    }
    
    // Order by creation time
    constraints.push(orderBy('createdAt', 'desc'));
    
    // Limit results
    const limitCount = options.limit || 50;
    constraints.push(limit(limitCount));
    
    // Execute query
    const commentsQuery = query(commentsCollection, ...constraints);
    const commentsSnapshot = await getDocs(commentsQuery);
    
    // Process documents
    const comments = [];
    
    commentsSnapshot.forEach(doc => {
      comments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return {
      comments,
      total: commentsSnapshot.size,
      hasMore: commentsSnapshot.size === limitCount
    };
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
};

/**
 * Update a comment
 * 
 * @param {string} commentId - Comment ID
 * @param {string} text - Updated comment text
 * @returns {Promise<void>}
 * @throws {Error} If comment update fails
 */
export const updateComment = async (commentId, text) => {
  try {
    const user = await getCurrentUserData();
    
    if (!user) {
      throw new Error('You must be logged in to update comments');
    }
    
    // Get comment to check permissions
    const commentDoc = await getDoc(doc(commentsCollection, commentId));
    
    if (!commentDoc.exists()) {
      throw new Error('Comment not found');
    }
    
    const commentData = commentDoc.data();
    
    // Check permissions
    const isAdmin = user.role === 'admin';
    const isModerator = user.role === 'moderator';
    const isAuthor = commentData.userId === user.id;
    
    if (!isAdmin && !isModerator && !isAuthor) {
      throw new Error('You do not have permission to update this comment');
    }
    
    // Update comment
    await updateDoc(doc(commentsCollection, commentId), {
      text,
      updatedAt: firestoreTimestamp(),
      isEdited: true
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};

/**
 * Delete a comment
 * 
 * @param {string} commentId - Comment ID
 * @returns {Promise<void>}
 * @throws {Error} If comment deletion fails
 */
export const deleteComment = async (commentId) => {
  try {
    const user = await getCurrentUserData();
    
    if (!user) {
      throw new Error('You must be logged in to delete comments');
    }
    
    // Get comment to check permissions
    const commentDoc = await getDoc(doc(commentsCollection, commentId));
    
    if (!commentDoc.exists()) {
      throw new Error('Comment not found');
    }
    
    const commentData = commentDoc.data();
    
    // Check permissions
    const isAdmin = user.role === 'admin';
    const isModerator = user.role === 'moderator';
    const isAuthor = commentData.userId === user.id;
    
    if (!isAdmin && !isModerator && !isAuthor) {
      throw new Error('You do not have permission to delete this comment');
    }
    
    // Delete comment
    await deleteDoc(doc(commentsCollection, commentId));
    
    // Note: This doesn't delete replies, but they will be orphaned
    // A background function could clean these up
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

/**
 * Like a content item
 * 
 * @param {string} contentId - ID of the content
 * @param {string} contentType - Type of content (task, post, comment, etc)
 * @returns {Promise<string>} - ID of the like
 * @throws {Error} If like operation fails
 */
export const likeContent = async (contentId, contentType) => {
  try {
    const user = await getCurrentUserData();
    
    if (!user) {
      throw new Error('You must be logged in to like content');
    }
    
    // Check if user already liked the content
    const likesQuery = query(
      likesCollection,
      where('contentId', '==', contentId),
      where('contentType', '==', contentType),
      where('userId', '==', user.id)
    );
    
    const likesSnapshot = await getDocs(likesQuery);
    
    if (!likesSnapshot.empty) {
      // User already liked this content
      return likesSnapshot.docs[0].id;
    }
    
    // Create like document
    const likeDoc = {
      contentId,
      contentType,
      userId: user.id,
      createdAt: firestoreTimestamp()
    };
    
    // Add like to Firestore
    const docRef = await addDoc(likesCollection, likeDoc);
    
    return docRef.id;
  } catch (error) {
    console.error('Error liking content:', error);
    throw error;
  }
};

/**
 * Unlike a content item
 * 
 * @param {string} contentId - ID of the content
 * @param {string} contentType - Type of content (task, post, comment, etc)
 * @returns {Promise<void>}
 * @throws {Error} If unlike operation fails
 */
export const unlikeContent = async (contentId, contentType) => {
  try {
    const user = await getCurrentUserData();
    
    if (!user) {
      throw new Error('You must be logged in to unlike content');
    }
    
    // Find user's like
    const likesQuery = query(
      likesCollection,
      where('contentId', '==', contentId),
      where('contentType', '==', contentType),
      where('userId', '==', user.id)
    );
    
    const likesSnapshot = await getDocs(likesQuery);
    
    if (likesSnapshot.empty) {
      // User hasn't liked this content
      return;
    }
    
    // Delete like
    await deleteDoc(likesSnapshot.docs[0].ref);
  } catch (error) {
    console.error('Error unliking content:', error);
    throw error;
  }
};

/**
 * Check if user likes a content item
 * 
 * @param {string} contentId - ID of the content
 * @param {string} contentType - Type of content (task, post, comment, etc)
 * @returns {Promise<boolean>} - Whether user likes the content
 * @throws {Error} If check fails
 */
export const doesUserLikeContent = async (contentId, contentType) => {
  try {
    const user = await getCurrentUserData();
    
    if (!user) {
      return false;
    }
    
    // Find user's like
    const likesQuery = query(
      likesCollection,
      where('contentId', '==', contentId),
      where('contentType', '==', contentType),
      where('userId', '==', user.id)
    );
    
    const likesSnapshot = await getDocs(likesQuery);
    
    return !likesSnapshot.empty;
  } catch (error) {
    console.error('Error checking if user likes content:', error);
    throw error;
  }
};

/**
 * Get like count for a content item
 * 
 * @param {string} contentId - ID of the content
 * @param {string} contentType - Type of content (task, post, comment, etc)
 * @returns {Promise<number>} - Number of likes
 * @throws {Error} If getting like count fails
 */
export const getLikeCount = async (contentId, contentType) => {
  try {
    // Query likes for the content
    const likesQuery = query(
      likesCollection,
      where('contentId', '==', contentId),
      where('contentType', '==', contentType)
    );
    
    const likesSnapshot = await getDocs(likesQuery);
    
    return likesSnapshot.size;
  } catch (error) {
    console.error('Error getting like count:', error);
    throw error;
  }
};

/**
 * Share a content item
 * 
 * @param {Object} shareData - Share data
 * @param {string} shareData.contentId - ID of the content
 * @param {string} shareData.contentType - Type of content (task, post, etc)
 * @param {string} [shareData.message] - Optional share message
 * @returns {Promise<string>} - ID of the share
 * @throws {Error} If share operation fails
 */
export const shareContent = async (shareData) => {
  try {
    const user = await getCurrentUserData();
    
    if (!user) {
      throw new Error('You must be logged in to share content');
    }
    
    // Create share document
    const shareDoc = {
      contentId: shareData.contentId,
      contentType: shareData.contentType,
      message: shareData.message || '',
      userId: user.id,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      createdAt: firestoreTimestamp()
    };
    
    // Add share to Firestore
    const docRef = await addDoc(sharesCollection, shareDoc);
    
    return docRef.id;
  } catch (error) {
    console.error('Error sharing content:', error);
    throw error;
  }
};

/**
 * Get share count for a content item
 * 
 * @param {string} contentId - ID of the content
 * @param {string} contentType - Type of content (task, post, etc)
 * @returns {Promise<number>} - Number of shares
 * @throws {Error} If getting share count fails
 */
export const getShareCount = async (contentId, contentType) => {
  try {
    // Query shares for the content
    const sharesQuery = query(
      sharesCollection,
      where('contentId', '==', contentId),
      where('contentType', '==', contentType)
    );
    
    const sharesSnapshot = await getDocs(sharesQuery);
    
    return sharesSnapshot.size;
  } catch (error) {
    console.error('Error getting share count:', error);
    throw error;
  }
};

/**
 * Get user notifications
 * 
 * @param {Object} [options={}] - Query options
 * @param {boolean} [options.unreadOnly=false] - Only get unread notifications
 * @param {number} [options.limit=20] - Maximum number of notifications to return
 * @returns {Promise<Object>} - Object with notifications array and pagination info
 * @throws {Error} If getting notifications fails
 */
export const getNotifications = async (options = {}) => {
  try {
    const user = await getCurrentUserData();
    
    if (!user) {
      throw new Error('You must be logged in to get notifications');
    }
    
    // Build query constraints
    const constraints = [
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc')
    ];
    
    // Filter by read status if specified
    if (options.unreadOnly) {
      constraints.push(where('isRead', '==', false));
    }
    
    // Limit results
    const limitCount = options.limit || 20;
    constraints.push(limit(limitCount));
    
    // Execute query
    const notificationsQuery = query(notificationsCollection, ...constraints);
    const notificationsSnapshot = await getDocs(notificationsQuery);
    
    // Process documents
    const notifications = [];
    
    notificationsSnapshot.forEach(doc => {
      notifications.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return {
      notifications,
      total: notificationsSnapshot.size,
      hasMore: notificationsSnapshot.size === limitCount
    };
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw error;
  }
};

/**
 * Mark notifications as read
 * 
 * @param {string[]} notificationIds - Array of notification IDs to mark as read
 * @returns {Promise<void>}
 * @throws {Error} If marking notifications as read fails
 */
export const markNotificationsAsRead = async (notificationIds) => {
  try {
    const user = await getCurrentUserData();
    
    if (!user) {
      throw new Error('You must be logged in to update notifications');
    }
    
    // Call the Cloud Function to mark notifications as read
    const markReadFunction = httpsCallable(functions, 'markNotificationsRead');
    await markReadFunction({ notificationIds });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    throw error;
  }
};

/**
 * Get unread notification count
 * 
 * @returns {Promise<number>} - Number of unread notifications
 * @throws {Error} If getting unread notification count fails
 */
export const getUnreadNotificationCount = async () => {
  try {
    const user = await getCurrentUserData();
    
    if (!user) {
      return 0;
    }
    
    // Query unread notifications
    const notificationsQuery = query(
      notificationsCollection,
      where('userId', '==', user.id),
      where('isRead', '==', false)
    );
    
    const notificationsSnapshot = await getDocs(notificationsQuery);
    
    return notificationsSnapshot.size;
  } catch (error) {
    console.error('Error getting unread notification count:', error);
    throw error;
  }
};

/**
 * Get activity feed
 * 
 * @param {Object} [options={}] - Query options
 * @param {boolean} [options.publicOnly=true] - Only get public activities
 * @param {string} [options.contentType] - Filter by content type
 * @param {number} [options.limit=20] - Maximum number of activities to return
 * @returns {Promise<Object>} - Object with activities array and pagination info
 * @throws {Error} If getting activity feed fails
 */
export const getActivityFeed = async (options = {}) => {
  try {
    const user = await getCurrentUserData();
    
    if (!user) {
      throw new Error('You must be logged in to get the activity feed');
    }
    
    // Build query constraints
    const constraints = [
      orderBy('createdAt', 'desc')
    ];
    
    // Filter by publicity if specified
    const publicOnly = options.publicOnly !== false;
    if (publicOnly) {
      constraints.push(where('isPublic', '==', true));
    }
    
    // Filter by content type if specified
    if (options.contentType) {
      constraints.push(where('contentType', '==', options.contentType));
    }
    
    // Limit results
    const limitCount = options.limit || 20;
    constraints.push(limit(limitCount));
    
    // Execute query
    const activitiesQuery = query(activitiesCollection, ...constraints);
    const activitiesSnapshot = await getDocs(activitiesQuery);
    
    // Process documents
    const activities = [];
    
    activitiesSnapshot.forEach(doc => {
      activities.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return {
      activities,
      total: activitiesSnapshot.size,
      hasMore: activitiesSnapshot.size === limitCount
    };
  } catch (error) {
    console.error('Error getting activity feed:', error);
    throw error;
  }
};

/**
 * Subscribe to user notifications
 * 
 * @param {Function} callback - Callback function for updates
 * @returns {Function} - Unsubscribe function
 */
export const subscribeToNotifications = (callback) => {
  // Get current user
  return getCurrentUserData().then(user => {
    if (!user) {
      callback([]);
      return () => {}; // Empty unsubscribe function
    }
    
    // Build query
    const notificationsQuery = query(
      notificationsCollection,
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    
    // Subscribe to query
    return onSnapshot(notificationsQuery, (snapshot) => {
      const notifications = [];
      
      snapshot.forEach(doc => {
        notifications.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      callback(notifications);
    }, (error) => {
      console.error('Error subscribing to notifications:', error);
    });
  });
};

/**
 * Subscribe to unread notification count
 * 
 * @param {Function} callback - Callback function for updates
 * @returns {Function} - Unsubscribe function
 */
export const subscribeToUnreadNotificationCount = (callback) => {
  // Get current user
  return getCurrentUserData().then(user => {
    if (!user) {
      callback(0);
      return () => {}; // Empty unsubscribe function
    }
    
    // Build query
    const notificationsQuery = query(
      notificationsCollection,
      where('userId', '==', user.id),
      where('isRead', '==', false)
    );
    
    // Subscribe to query
    return onSnapshot(notificationsQuery, (snapshot) => {
      callback(snapshot.size);
    }, (error) => {
      console.error('Error subscribing to unread notification count:', error);
    });
  });
};

/**
 * Subscribe to activity feed
 * 
 * @param {Object} [options={}] - Query options
 * @param {boolean} [options.publicOnly=true] - Only get public activities
 * @param {Function} callback - Callback function for updates
 * @returns {Function} - Unsubscribe function
 */
export const subscribeToActivityFeed = (options = {}, callback) => {
  // Build query constraints
  const constraints = [
    orderBy('createdAt', 'desc')
  ];
  
  // Filter by publicity if specified
  const publicOnly = options.publicOnly !== false;
  if (publicOnly) {
    constraints.push(where('isPublic', '==', true));
  }
  
  // Filter by content type if specified
  if (options.contentType) {
    constraints.push(where('contentType', '==', options.contentType));
  }
  
  // Limit results
  const limitCount = options.limit || 20;
  constraints.push(limit(limitCount));
  
  // Execute query
  const activitiesQuery = query(activitiesCollection, ...constraints);
  
  // Subscribe to query
  return onSnapshot(activitiesQuery, (snapshot) => {
    const activities = [];
    
    snapshot.forEach(doc => {
      activities.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    callback(activities);
  }, (error) => {
    console.error('Error subscribing to activity feed:', error);
  });
};
