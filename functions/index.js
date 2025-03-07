/**
 * TechServ Community Garden - Firebase Cloud Functions Index
 * 
 * This is the main entry point for Firebase Cloud Functions.
 * It exports all the functions defined in our firebase-functions.js file.
 */

// Import all functions from our implementation file
import * as functionsImpl from './firebase-functions.js';

// Export all functions for Firebase
export const updateUserRole = functionsImpl.updateUserRole;
export const onTaskAssigned = functionsImpl.onTaskAssigned;
export const onCommentAdded = functionsImpl.onCommentAdded;
export const onTaskUpdated = functionsImpl.onTaskUpdated;
export const markNotificationsRead = functionsImpl.markNotificationsRead;
export const cleanupOldNotifications = functionsImpl.cleanupOldNotifications;
