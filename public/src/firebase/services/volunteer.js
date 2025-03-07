/**
 * TechServ Community Garden - Volunteer Service
 * 
 * This module handles volunteer opportunities management using Firebase
 */

import { 
  firestore,
  functions 
} from '../config.js';

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
  onSnapshot,
  increment
} from 'firebase/firestore';

import { getCurrentUserData } from '../auth.js';

// Collection references
const opportunitiesCollection = collection(firestore, 'volunteer_opportunities');
const signupsCollection = collection(firestore, 'volunteer_signups');

/**
 * Create a new volunteer opportunity
 * 
 * @param {Object} opportunityData - Opportunity data
 * @param {string} opportunityData.title - Title/role
 * @param {string} opportunityData.description - Description
 * @param {Date} opportunityData.startDate - Start date and time
 * @param {Date} opportunityData.endDate - End date and time
 * @param {string} opportunityData.location - Location within garden
 * @param {string} opportunityData.departmentId - Department ID
 * @param {number} opportunityData.totalSpots - Total number of volunteer spots
 * @returns {Promise<string>} - ID of created opportunity
 */
export const createOpportunity = async (opportunityData) => {
  try {
    // Get current user
    const user = await getCurrentUserData();
    
    if (!user) {
      throw new Error('You must be logged in to create volunteer opportunities');
    }
    
    // Check if user has permission (admin or coordinator)
    if (user.role !== 'admin' && user.role !== 'coordinator') {
      throw new Error('You do not have permission to create volunteer opportunities');
    }
    
    // Create opportunity document
    const opportunityDoc = {
      title: opportunityData.title,
      description: opportunityData.description || '',
      startDate: opportunityData.startDate,
      endDate: opportunityData.endDate,
      location: opportunityData.location || '',
      departmentId: opportunityData.departmentId,
      totalSpots: opportunityData.totalSpots || 1,
      spotsRemaining: opportunityData.totalSpots || 1,
      createdBy: user.id,
      createdAt: firestoreTimestamp(),
      updatedAt: firestoreTimestamp()
    };
    
    // Add opportunity to Firestore
    const docRef = await addDoc(opportunitiesCollection, opportunityDoc);
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating volunteer opportunity:', error);
    throw error;
  }
};

/**
 * Get a volunteer opportunity by ID
 * 
 * @param {string} opportunityId - Opportunity ID
 * @returns {Promise<Object|null>} - Opportunity data or null if not found
 */
export const getOpportunity = async (opportunityId) => {
  try {
    const opportunityDoc = await getDoc(doc(opportunitiesCollection, opportunityId));
    
    if (!opportunityDoc.exists()) {
      return null;
    }
    
    return {
      id: opportunityId,
      ...opportunityDoc.data()
    };
  } catch (error) {
    console.error('Error getting volunteer opportunity:', error);
    throw error;
  }
};

/**
 * Get volunteer opportunities with optional filtering
 * 
 * @param {Object} [filters={}] - Filters for opportunities
 * @param {string} [filters.departmentId] - Filter by department
 * @param {Date} [filters.startDate] - Filter by start date (on or after)
 * @param {Date} [filters.endDate] - Filter by end date (on or before)
 * @param {boolean} [filters.spotsAvailable] - Filter to only show opportunities with spots available
 * @param {string} [filters.orderBy='startDate'] - Field to order by
 * @param {string} [filters.orderDirection='asc'] - Order direction
 * @param {number} [filters.limit=20] - Maximum number of opportunities to return
 * @returns {Promise<Object>} - Object with opportunities array and pagination info
 */
export const getOpportunities = async (filters = {}) => {
  try {
    // Build query constraints
    const constraints = [];
    
    // Filter by department
    if (filters.departmentId) {
      constraints.push(where('departmentId', '==', filters.departmentId));
    }
    
    // Filter by start date
    if (filters.startDate) {
      constraints.push(where('startDate', '>=', filters.startDate));
    }
    
    // Filter by end date
    if (filters.endDate) {
      constraints.push(where('endDate', '<=', filters.endDate));
    }
    
    // Filter to only show opportunities with spots available
    if (filters.spotsAvailable) {
      constraints.push(where('spotsRemaining', '>', 0));
    }
    
    // Order by field
    const orderByField = filters.orderBy || 'startDate';
    const orderDirection = filters.orderDirection || 'asc';
    constraints.push(orderBy(orderByField, orderDirection));
    
    // Limit results
    const limitCount = filters.limit || 20;
    constraints.push(limit(limitCount));
    
    // Execute query
    const opportunitiesQuery = query(opportunitiesCollection, ...constraints);
    const opportunitiesSnapshot = await getDocs(opportunitiesQuery);
    
    // Process opportunity documents
    const opportunities = [];
    
    opportunitiesSnapshot.forEach(doc => {
      opportunities.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return {
      opportunities,
      total: opportunitiesSnapshot.size,
      hasMore: opportunitiesSnapshot.size === limitCount
    };
  } catch (error) {
    console.error('Error getting volunteer opportunities:', error);
    throw error;
  }
};

/**
 * Update a volunteer opportunity
 * 
 * @param {string} opportunityId - Opportunity ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateOpportunity = async (opportunityId, updates) => {
  try {
    const user = await getCurrentUserData();
    
    if (!user) {
      throw new Error('You must be logged in to update volunteer opportunities');
    }
    
    // Get opportunity to check permissions
    const opportunityDoc = await getDoc(doc(opportunitiesCollection, opportunityId));
    
    if (!opportunityDoc.exists()) {
      throw new Error('Volunteer opportunity not found');
    }
    
    const opportunityData = opportunityDoc.data();
    
    // Check permissions
    const isAdmin = user.role === 'admin';
    const isCoordinator = user.role === 'coordinator';
    const isCreator = opportunityData.createdBy === user.id;
    
    if (!isAdmin && !isCoordinator && !isCreator) {
      throw new Error('You do not have permission to update this volunteer opportunity');
    }
    
    // Create update object
    const updateObj = {
      ...updates,
      updatedAt: firestoreTimestamp()
    };
    
    // Don't allow updating creator
    delete updateObj.createdBy;
    delete updateObj.createdAt;
    
    // Update opportunity
    await updateDoc(doc(opportunitiesCollection, opportunityId), updateObj);
  } catch (error) {
    console.error('Error updating volunteer opportunity:', error);
    throw error;
  }
};

/**
 * Delete a volunteer opportunity
 * 
 * @param {string} opportunityId - Opportunity ID
 * @returns {Promise<void>}
 */
export const deleteOpportunity = async (opportunityId) => {
  try {
    const user = await getCurrentUserData();
    
    if (!user) {
      throw new Error('You must be logged in to delete volunteer opportunities');
    }
    
    // Get opportunity to check permissions
    const opportunityDoc = await getDoc(doc(opportunitiesCollection, opportunityId));
    
    if (!opportunityDoc.exists()) {
      throw new Error('Volunteer opportunity not found');
    }
    
    const opportunityData = opportunityDoc.data();
    
    // Check permissions
    const isAdmin = user.role === 'admin';
    const isCoordinator = user.role === 'coordinator';
    const isCreator = opportunityData.createdBy === user.id;
    
    if (!isAdmin && !isCoordinator && !isCreator) {
      throw new Error('You do not have permission to delete this volunteer opportunity');
    }
    
    // Delete signups for this opportunity
    const signupsQuery = query(
      signupsCollection,
      where('opportunityId', '==', opportunityId)
    );
    
    const signupsSnapshot = await getDocs(signupsQuery);
    
    const deletePromises = signupsSnapshot.docs.map(doc => 
      deleteDoc(doc.ref)
    );
    
    await Promise.all(deletePromises);
    
    // Delete opportunity
    await deleteDoc(doc(opportunitiesCollection, opportunityId));
  } catch (error) {
    console.error('Error deleting volunteer opportunity:', error);
    throw error;
  }
};

/**
 * Sign up for a volunteer opportunity
 * 
 * @param {string} opportunityId - Opportunity ID
 * @param {Object} userData - User data for signup
 * @param {string} userData.name - User's name
 * @param {string} userData.email - User's email
 * @param {string} [userData.phone] - User's phone number
 * @param {string} [userData.notes] - Additional notes
 * @returns {Promise<string>} - ID of the signup
 */
export const signUpForOpportunity = async (opportunityId, userData) => {
  try {
    // Get current user
    const user = await getCurrentUserData();
    
    if (!user) {
      throw new Error('You must be logged in to sign up for volunteer opportunities');
    }
    
    // Get opportunity to check availability
    const opportunityDoc = await getDoc(doc(opportunitiesCollection, opportunityId));
    
    if (!opportunityDoc.exists()) {
      throw new Error('Volunteer opportunity not found');
    }
    
    const opportunityData = opportunityDoc.data();
    
    // Check if there are spots available
    if (opportunityData.spotsRemaining <= 0) {
      throw new Error('No spots available for this volunteer opportunity');
    }
    
    // Check if user is already signed up
    const existingSignupQuery = query(
      signupsCollection,
      where('opportunityId', '==', opportunityId),
      where('userId', '==', user.id)
    );
    
    const existingSignupSnapshot = await getDocs(existingSignupQuery);
    
    if (!existingSignupSnapshot.empty) {
      throw new Error('You are already signed up for this volunteer opportunity');
    }
    
    // Create signup document
    const signupDoc = {
      opportunityId,
      userId: user.id,
      name: userData.name || `${user.firstName} ${user.lastName}`,
      email: userData.email || user.email,
      phone: userData.phone || user.phone || '',
      notes: userData.notes || '',
      signedUpAt: firestoreTimestamp()
    };
    
    // Add signup to Firestore
    const signupRef = await addDoc(signupsCollection, signupDoc);
    
    // Update spots remaining
    await updateDoc(doc(opportunitiesCollection, opportunityId), {
      spotsRemaining: increment(-1),
      updatedAt: firestoreTimestamp()
    });
    
    return signupRef.id;
  } catch (error) {
    console.error('Error signing up for volunteer opportunity:', error);
    throw error;
  }
};

/**
 * Cancel signup for a volunteer opportunity
 * 
 * @param {string} opportunityId - Opportunity ID
 * @returns {Promise<void>}
 */
export const cancelSignup = async (opportunityId) => {
  try {
    // Get current user
    const user = await getCurrentUserData();
    
    if (!user) {
      throw new Error('You must be logged in to cancel volunteer signups');
    }
    
    // Find user's signup
    const signupQuery = query(
      signupsCollection,
      where('opportunityId', '==', opportunityId),
      where('userId', '==', user.id)
    );
    
    const signupSnapshot = await getDocs(signupQuery);
    
    if (signupSnapshot.empty) {
      throw new Error('You are not signed up for this volunteer opportunity');
    }
    
    // Delete signup
    await deleteDoc(signupSnapshot.docs[0].ref);
    
    // Update spots remaining
    await updateDoc(doc(opportunitiesCollection, opportunityId), {
      spotsRemaining: increment(1),
      updatedAt: firestoreTimestamp()
    });
  } catch (error) {
    console.error('Error canceling volunteer signup:', error);
    throw error;
  }
};

/**
 * Get signups for an opportunity
 * 
 * @param {string} opportunityId - Opportunity ID
 * @returns {Promise<Array>} - Array of signup objects
 */
export const getOpportunitySignups = async (opportunityId) => {
  try {
    const user = await getCurrentUserData();
    
    if (!user) {
      throw new Error('You must be logged in to view volunteer signups');
    }
    
    // Get opportunity to check permissions
    const opportunityDoc = await getDoc(doc(opportunitiesCollection, opportunityId));
    
    if (!opportunityDoc.exists()) {
      throw new Error('Volunteer opportunity not found');
    }
    
    const opportunityData = opportunityDoc.data();
    
    // Check permissions
    const isAdmin = user.role === 'admin';
    const isCoordinator = user.role === 'coordinator';
    const isCreator = opportunityData.createdBy === user.id;
    
    if (!isAdmin && !isCoordinator && !isCreator) {
      throw new Error('You do not have permission to view signups for this opportunity');
    }
    
    // Get signups
    const signupsQuery = query(
      signupsCollection,
      where('opportunityId', '==', opportunityId),
      orderBy('signedUpAt', 'asc')
    );
    
    const signupsSnapshot = await getDocs(signupsQuery);
    
    // Process signup documents
    const signups = [];
    
    signupsSnapshot.forEach(doc => {
      signups.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return signups;
  } catch (error) {
    console.error('Error getting volunteer signups:', error);
    throw error;
  }
};

/**
 * Get user's volunteer signups
 * 
 * @returns {Promise<Array>} - Array of signup objects with opportunity details
 */
export const getUserSignups = async () => {
  try {
    // Get current user
    const user = await getCurrentUserData();
    
    if (!user) {
      throw new Error('You must be logged in to view your volunteer signups');
    }
    
    // Get user's signups
    const signupsQuery = query(
      signupsCollection,
      where('userId', '==', user.id),
      orderBy('signedUpAt', 'desc')
    );
    
    const signupsSnapshot = await getDocs(signupsQuery);
    
    // Process signup documents and get opportunity details
    const signups = [];
    
    for (const doc of signupsSnapshot.docs) {
      const signup = doc.data();
      signup.id = doc.id;
      
      // Get opportunity details
      const opportunityDoc = await getDoc(doc(opportunitiesCollection, signup.opportunityId));
      
      if (opportunityDoc.exists()) {
        signup.opportunity = {
          id: signup.opportunityId,
          ...opportunityDoc.data()
        };
      }
      
      signups.push(signup);
    }
    
    return signups;
  } catch (error) {
    console.error('Error getting user volunteer signups:', error);
    throw error;
  }
};

/**
 * Subscribe to volunteer opportunities
 * 
 * @param {Object} [filters={}] - Filters for opportunities
 * @param {Function} callback - Callback function for updates
 * @returns {Function} - Unsubscribe function
 */
export const subscribeToOpportunities = (filters = {}, callback) => {
  // Build query constraints
  const constraints = [];
  
  // Filter by department
  if (filters.departmentId) {
    constraints.push(where('departmentId', '==', filters.departmentId));
  }
  
  // Filter by start date
  if (filters.startDate) {
    constraints.push(where('startDate', '>=', filters.startDate));
  }
  
  // Filter to only show opportunities with spots available
  if (filters.spotsAvailable) {
    constraints.push(where('spotsRemaining', '>', 0));
  }
  
  // Order by field
  const orderByField = filters.orderBy || 'startDate';
  const orderDirection = filters.orderDirection || 'asc';
  constraints.push(orderBy(orderByField, orderDirection));
  
  // Execute query
  const opportunitiesQuery = query(opportunitiesCollection, ...constraints);
  
  // Subscribe to query
  return onSnapshot(opportunitiesQuery, (snapshot) => {
    const opportunities = [];
    
    snapshot.forEach(doc => {
      opportunities.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    callback(opportunities);
  }, (error) => {
    console.error('Error subscribing to volunteer opportunities:', error);
  });
};
