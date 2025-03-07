/**
 * TechServ Community Garden - Firebase Cloud Functions
 * 
 * This file contains the implementation of our Firebase Cloud Functions
 * for the TechServ Community Garden website.
 */

const admin = require('firebase-admin');
const functions = require('firebase-functions');
const logger = functions.logger;

// Initialize Firebase Admin SDK
admin.initializeApp();

// Reference to Firestore
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

/**
 * Update a user's role
 * 
 * Allows admins to update a user's role (admin, moderator, user)
 * Requires admin authentication
 */
exports.updateUserRole = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated', 
      'You must be logged in to update roles'
    );
  }

  // Get caller data
  const callerUid = context.auth.uid;
  const callerRef = db.collection('users').doc(callerUid);
  const callerDoc = await callerRef.get();
  
  // Verify caller is an admin
  if (!callerDoc.exists || callerDoc.data().role !== 'admin') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only administrators can update user roles'
    );
  }
  
  // Extract request data
  const { userId, role } = data;
  
  // Validate requested role
  const validRoles = ['admin', 'moderator', 'user'];
  if (!validRoles.includes(role)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Role must be one of: admin, moderator, user'
    );
  }
  
  try {
    // Update the user's role in Firestore
    await db.collection('users').doc(userId).update({ role });
    
    // Set custom claims for Firebase Auth
    await admin.auth().setCustomUserClaims(userId, { role });
    
    // Log role change
    await db.collection('admin_logs').add({
      action: 'role_update',
      adminId: callerUid,
      targetUserId: userId,
      oldRole: callerDoc.data().role,
      newRole: role,
      timestamp: FieldValue.serverTimestamp()
    });
    
    // Return success
    return { success: true, message: `User role updated to ${role}` };
  } catch (error) {
    logger.error('Error updating user role:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Task Assignment Trigger
 * 
 * Triggered when a task is assigned to a user
 * Creates a notification for the assigned user
 */
exports.onTaskAssigned = functions.firestore
  .document('task_assignments/{assignmentId}')
  .onCreate(async (snapshot, context) => {
    try {
      const assignment = snapshot.data();
      const { taskId, userId } = assignment;
      
      // Get task details
      const taskDoc = await db.collection('tasks').doc(taskId).get();
      
      if (!taskDoc.exists) {
        logger.error(`Task ${taskId} not found`);
        return null;
      }
      
      const task = taskDoc.data();
      
      // Create notification
      await db.collection('notifications').add({
        userId,
        type: 'task_assigned',
        title: 'New Task Assigned',
        message: `You have been assigned to the task: ${task.title}`,
        taskId,
        isRead: false,
        createdAt: FieldValue.serverTimestamp()
      });
      
      // Create activity log
      await db.collection('activities').add({
        userId,
        type: 'task_assigned',
        taskId,
        taskTitle: task.title,
        isPublic: !task.isPersonal,
        createdAt: FieldValue.serverTimestamp()
      });
      
      logger.info(`Notification created for user ${userId} for task ${taskId}`);
      return null;
    } catch (error) {
      logger.error('Error creating task assignment notification:', error);
      return null;
    }
  });

/**
 * Comment Added Trigger
 * 
 * Triggered when a comment is added
 * Notifies relevant users (mentioned users, task owner, etc.)
 */
exports.onCommentAdded = functions.firestore
  .document('comments/{commentId}')
  .onCreate(async (snapshot, context) => {
    try {
      const comment = snapshot.data();
      const { contentId, contentType, userId, text } = comment;
      
      // Skip processing if essential data is missing
      if (!contentId || !contentType || !userId) {
        logger.error('Comment missing required fields:', comment);
        return null;
      }
      
      // Get content details based on type
      let contentDoc;
      let contentData;
      let ownerId;
      let contentTitle = '';
      
      if (contentType === 'task') {
        contentDoc = await db.collection('tasks').doc(contentId).get();
        if (contentDoc.exists) {
          contentData = contentDoc.data();
          ownerId = contentData.createdBy;
          contentTitle = contentData.title;
        }
      } else if (contentType === 'profile') {
        contentDoc = await db.collection('users').doc(contentId).get();
        if (contentDoc.exists) {
          contentData = contentDoc.data();
          ownerId = contentId; // User's own profile
          contentTitle = contentData.displayName || 'User Profile';
        }
      }
      
      if (!contentDoc?.exists) {
        logger.error(`${contentType} ${contentId} not found`);
        return null;
      }
      
      // Get commenter's name
      const commenterDoc = await db.collection('users').doc(userId).get();
      const commenterName = commenterDoc.exists 
        ? (commenterDoc.data().displayName || 'A user') 
        : 'A user';
      
      // Create activity
      await db.collection('activities').add({
        userId,
        type: 'comment_added',
        contentId,
        contentType,
        contentTitle,
        commentId: snapshot.id,
        isPublic: contentType === 'task' ? !contentData.isPersonal : false,
        createdAt: FieldValue.serverTimestamp()
      });
      
      // Notify content owner if not the commenter
      if (ownerId && ownerId !== userId) {
        await db.collection('notifications').add({
          userId: ownerId,
          type: 'comment_added',
          title: 'New Comment',
          message: `${commenterName} commented on your ${contentType}: ${contentTitle}`,
          contentId,
          contentType,
          commentId: snapshot.id,
          isRead: false,
          createdAt: FieldValue.serverTimestamp()
        });
      }
      
      // Extract mentioned users from comment text (like @username)
      const mentionRegex = /@(\w+)/g;
      const mentionMatches = text.match(mentionRegex) || [];
      
      // Notify mentioned users
      for (const mention of mentionMatches) {
        const username = mention.substring(1); // Remove @ symbol
        
        // Find user by username
        const usersQuery = await db.collection('users')
          .where('username', '==', username)
          .limit(1)
          .get();
        
        if (!usersQuery.empty) {
          const mentionedUser = usersQuery.docs[0];
          const mentionedUserId = mentionedUser.id;
          
          // Don't notify if it's the commenter or already notified as owner
          if (mentionedUserId !== userId && mentionedUserId !== ownerId) {
            await db.collection('notifications').add({
              userId: mentionedUserId,
              type: 'user_mentioned',
              title: 'You were mentioned',
              message: `${commenterName} mentioned you in a comment on ${contentType}: ${contentTitle}`,
              contentId,
              contentType,
              commentId: snapshot.id,
              isRead: false,
              createdAt: FieldValue.serverTimestamp()
            });
          }
        }
      }
      
      logger.info(`Processed notifications for comment ${snapshot.id}`);
      return null;
    } catch (error) {
      logger.error('Error processing comment notifications:', error);
      return null;
    }
  });

/**
 * Task Updated Trigger
 * 
 * Triggered when a task is updated
 * Notifies relevant users of changes
 */
exports.onTaskUpdated = functions.firestore
  .document('tasks/{taskId}')
  .onUpdate(async (change, context) => {
    try {
      const taskId = context.params.taskId;
      const oldTask = change.before.data();
      const newTask = change.after.data();
      
      // Skip processing if the task has been deleted (data is null)
      if (!newTask) return null;
      
      // Skip if status hasn't changed
      if (oldTask.status === newTask.status) return null;
      
      // Get assignments to notify assigned users
      const assignmentsQuery = await db.collection('task_assignments')
        .where('taskId', '==', taskId)
        .get();
      
      // Create notifications for assigned users
      const batch = db.batch();
      
      assignmentsQuery.forEach(doc => {
        const assignment = doc.data();
        
        // Create notification
        const notificationRef = db.collection('notifications').doc();
        batch.set(notificationRef, {
          userId: assignment.userId,
          type: 'task_updated',
          title: 'Task Status Updated',
          message: `Task "${newTask.title}" has been updated to ${newTask.status.replace('_', ' ')}`,
          taskId,
          oldStatus: oldTask.status,
          newStatus: newTask.status,
          isRead: false,
          createdAt: FieldValue.serverTimestamp()
        });
        
        // Create activity log
        const activityRef = db.collection('activities').doc();
        batch.set(activityRef, {
          userId: assignment.userId,
          type: 'task_updated',
          taskId,
          taskTitle: newTask.title,
          oldStatus: oldTask.status,
          newStatus: newTask.status,
          isPublic: !newTask.isPersonal,
          createdAt: FieldValue.serverTimestamp()
        });
      });
      
      // Execute batch
      await batch.commit();
      
      logger.info(`Processed notifications for task update ${taskId}`);
      return null;
    } catch (error) {
      logger.error('Error processing task update notifications:', error);
      return null;
    }
  });

/**
 * Mark Notifications as Read
 * 
 * Allows users to mark their notifications as read
 */
exports.markNotificationsRead = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated', 
      'You must be logged in to update notifications'
    );
  }
  
  const userId = context.auth.uid;
  const { notificationIds } = data;
  
  // Validate input
  if (!notificationIds || !Array.isArray(notificationIds)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'You must provide an array of notification IDs'
    );
  }
  
  try {
    const batch = db.batch();
    
    // Get notifications and verify ownership
    for (const notificationId of notificationIds) {
      const notificationRef = db.collection('notifications').doc(notificationId);
      const notificationDoc = await notificationRef.get();
      
      if (notificationDoc.exists && notificationDoc.data().userId === userId) {
        batch.update(notificationRef, { isRead: true });
      }
    }
    
    // Execute batch
    await batch.commit();
    
    return { success: true, message: 'Notifications marked as read' };
  } catch (error) {
    logger.error('Error marking notifications as read:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Cleanup Old Notifications
 * 
 * Scheduled function to delete old, read notifications
 * Runs daily at midnight
 */
exports.cleanupOldNotifications = functions.pubsub
  .schedule('0 0 * * *') // Every day at midnight
  .timeZone('America/Chicago')
  .onRun(async (context) => {
    try {
      // Calculate date threshold (30 days ago)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      // Query old, read notifications
      const oldNotificationsQuery = db.collection('notifications')
        .where('isRead', '==', true)
        .where('createdAt', '<', thirtyDaysAgo)
        .limit(500); // Firestore limits batch operations
      
      // Delete in batches
      const notificationsSnapshot = await oldNotificationsQuery.get();
      
      if (notificationsSnapshot.empty) {
        logger.info('No old notifications to clean up');
        return null;
      }
      
      const batch = db.batch();
      let count = 0;
      
      notificationsSnapshot.forEach(doc => {
        batch.delete(doc.ref);
        count++;
      });
      
      await batch.commit();
      
      logger.info(`Cleaned up ${count} old notifications`);
      return null;
    } catch (error) {
      logger.error('Error cleaning up old notifications:', error);
      return null;
    }
  });
