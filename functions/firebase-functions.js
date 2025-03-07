/**
 * TechServ Community Garden - Firebase Cloud Functions
 * 
 * This file contains the implementation of our Firebase Cloud Functions
 * for the TechServ Community Garden website.
 */

import { onCall, onRequest, HttpsError } from 'firebase-functions/v2/https';
import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import cors from 'cors';
import express from 'express';

// Initialize Firebase Admin SDK
const app = initializeApp();

// Reference to Firestore
const db = getFirestore();
const corsHandler = cors({ origin: true });

/**
 * Update a user's role
 * 
 * Allows admins to update a user's role (admin, moderator, user)
 * Requires admin authentication
 */
export const updateUserRole = onCall(async (request) => {
  // Verify authentication
  if (!request.auth) {
    throw new HttpsError(
      'unauthenticated', 
      'You must be logged in to update roles'
    );
  }

  // Get caller data
  const callerUid = request.auth.uid;
  const callerRef = db.collection('users').doc(callerUid);
  const callerDoc = await callerRef.get();
  
  // Verify caller is an admin
  if (!callerDoc.exists || callerDoc.data().role !== 'admin') {
    throw new HttpsError(
      'permission-denied',
      'Only administrators can update user roles'
    );
  }
  
  // Extract request data
  const { userId, role } = request.data;
  
  // Validate requested role
  const validRoles = ['admin', 'moderator', 'user'];
  if (!validRoles.includes(role)) {
    throw new HttpsError(
      'invalid-argument',
      'Role must be one of: admin, moderator, user'
    );
  }
  
  try {
    // Update the user's role in Firestore
    await db.collection('users').doc(userId).update({ role });
    
    // Set custom claims for Firebase Auth
    await getAuth().setCustomUserClaims(userId, { role });
    
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
    console.error('Error updating user role:', error);
    throw new HttpsError('internal', error.message);
  }
});

/**
 * Task Assignment Trigger
 * 
 * Triggered when a task is assigned to a user
 * Creates a notification for the assigned user
 */
export const onTaskAssigned = onDocumentCreated('task_assignments/{assignmentId}', async (event) => {
  try {
    const snapshot = event.data;
    if (!snapshot) return;
    
    const assignment = snapshot.data();
    const { taskId, userId } = assignment;
    
    // Get task details
    const taskDoc = await db.collection('tasks').doc(taskId).get();
    
    if (!taskDoc.exists) {
      console.error(`Task ${taskId} not found`);
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
    
    console.log(`Notification created for user ${userId} for task ${taskId}`);
    return null;
  } catch (error) {
    console.error('Error creating task assignment notification:', error);
    return null;
  }
});

/**
 * Comment Added Trigger
 * 
 * Triggered when a comment is added
 * Notifies relevant users (mentioned users, task owner, etc.)
 */
export const onCommentAdded = onDocumentCreated('comments/{commentId}', async (event) => {
  try {
    const snapshot = event.data;
    if (!snapshot) return;
    
    const comment = snapshot.data();
    const { contentId, contentType, userId, text } = comment;
    
    // Skip processing if essential data is missing
    if (!contentId || !contentType || !userId) {
      console.error('Comment missing required fields:', comment);
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
      console.error(`${contentType} ${contentId} not found`);
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
    
    console.log(`Processed notifications for comment ${snapshot.id}`);
    return null;
  } catch (error) {
    console.error('Error processing comment notifications:', error);
    return null;
  }
});

/**
 * Task Updated Trigger
 * 
 * Triggered when a task is updated
 * Notifies relevant users of changes
 */
export const onTaskUpdated = onDocumentUpdated('tasks/{taskId}', async (event) => {
  try {
    if (!event.data) return null;
    
    const taskId = event.params.taskId;
    const oldTask = event.data.before.data();
    const newTask = event.data.after.data();
    
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
    
    console.log(`Processed notifications for task update ${taskId}`);
    return null;
  } catch (error) {
    console.error('Error processing task update notifications:', error);
    return null;
  }
});

/**
 * Mark Notifications as Read
 * 
 * Allows users to mark their notifications as read
 */
export const markNotificationsRead = onCall(async (request) => {
  // Verify authentication
  if (!request.auth) {
    throw new HttpsError(
      'unauthenticated', 
      'You must be logged in to update notifications'
    );
  }
  
  const userId = request.auth.uid;
  const { notificationIds } = request.data;
  
  // Validate input
  if (!notificationIds || !Array.isArray(notificationIds)) {
    throw new HttpsError(
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
    console.error('Error marking notifications as read:', error);
    throw new HttpsError('internal', error.message);
  }
});

/**
 * Cleanup Old Notifications
 * 
 * Scheduled function to delete old, read notifications
 * Runs daily at midnight
 */
export const cleanupOldNotifications = onSchedule({
  schedule: '0 0 * * *', // Every day at midnight
  timeZone: 'America/Chicago'
}, async (event) => {
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
      console.log('No old notifications to clean up');
      return null;
    }
    
    const batch = db.batch();
    let count = 0;
    
    notificationsSnapshot.forEach(doc => {
      batch.delete(doc.ref);
      count++;
    });
    
    await batch.commit();
    
    console.log(`Cleaned up ${count} old notifications`);
    return null;
  } catch (error) {
    console.error('Error cleaning up old notifications:', error);
    return null;
  }
});
