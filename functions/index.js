/**
 * TechServ Community Garden - Firebase Cloud Functions Index
 * 
 * This is the main entry point for Firebase Cloud Functions.
 * It exports all the functions defined in our firebase-functions.js file.
 */

// Import all functions from our implementation file
const functions = require('./firebase-functions');

// Export all functions for Firebase
exports.updateUserRole = functions.updateUserRole;
exports.onTaskAssigned = functions.onTaskAssigned;
exports.onCommentAdded = functions.onCommentAdded;
exports.onTaskUpdated = functions.onTaskUpdated;
exports.markNotificationsRead = functions.markNotificationsRead;
exports.cleanupOldNotifications = functions.cleanupOldNotifications;
