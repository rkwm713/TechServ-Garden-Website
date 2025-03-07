/**
 * TechServ Community Garden - Department Service
 * 
 * This module handles department data and task progress tracking
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
  onSnapshot
} from 'firebase/firestore';

import { getCurrentUserData } from '../auth.js';

// Collection references
const departmentsCollection = collection(firestore, 'departments');

/**
 * Create a new department
 * 
 * @param {Object} departmentData - Department data
 * @param {string} departmentData.name - Department name
 * @param {string} departmentData.description - Department description
 * @param {string} departmentData.icon - Font Awesome icon class
 * @param {string} departmentData.color - Department color (hex code)
 * @returns {Promise<string>} - ID of created department
 */
export const createDepartment = async (departmentData) => {
  try {
    // Get current user
    const user = await getCurrentUserData();
    
    if (!user) {
      throw new Error('You must be logged in to create departments');
    }
    
    // Check if user has permission (admin only)
    if (user.role !== 'admin') {
      throw new Error('You do not have permission to create departments');
    }
    
    // Create department document
    const departmentDoc = {
      name: departmentData.name,
      description: departmentData.description || '',
      icon: departmentData.icon || 'fa-solid fa-leaf',
      color: departmentData.color || '#4CAF50',
      createdBy: user.id,
      createdAt: firestoreTimestamp(),
      updatedAt: firestoreTimestamp()
    };
    
    // Add department to Firestore
    const docRef = await addDoc(departmentsCollection, departmentDoc);
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating department:', error);
    throw error;
  }
};

/**
 * Get a department by ID
 * 
 * @param {string} departmentId - Department ID
 * @returns {Promise<Object|null>} - Department data or null if not found
 */
export const getDepartment = async (departmentId) => {
  try {
    const departmentDoc = await getDoc(doc(departmentsCollection, departmentId));
    
    if (!departmentDoc.exists()) {
      return null;
    }
    
    return {
      id: departmentId,
      ...departmentDoc.data()
    };
  } catch (error) {
    console.error('Error getting department:', error);
    throw error;
  }
};

/**
 * Get all departments
 * 
 * @param {Object} [options={}] - Options for getting departments
 * @param {string} [options.orderBy='name'] - Field to order by
 * @param {string} [options.orderDirection='asc'] - Order direction
 * @returns {Promise<Array>} - Array of department objects
 */
export const getDepartments = async (options = {}) => {
  try {
    // Build query constraints
    const constraints = [];
    
    // Order by field
    const orderByField = options.orderBy || 'name';
    const orderDirection = options.orderDirection || 'asc';
    constraints.push(orderBy(orderByField, orderDirection));
    
    // Execute query
    const departmentsQuery = query(departmentsCollection, ...constraints);
    const departmentsSnapshot = await getDocs(departmentsQuery);
    
    // Process department documents
    const departments = [];
    
    departmentsSnapshot.forEach(doc => {
      departments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return departments;
  } catch (error) {
    console.error('Error getting departments:', error);
    throw error;
  }
};

/**
 * Update a department
 * 
 * @param {string} departmentId - Department ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateDepartment = async (departmentId, updates) => {
  try {
    const user = await getCurrentUserData();
    
    if (!user) {
      throw new Error('You must be logged in to update departments');
    }
    
    // Check if user has permission (admin only)
    if (user.role !== 'admin') {
      throw new Error('You do not have permission to update departments');
    }
    
    // Create update object
    const updateObj = {
      ...updates,
      updatedAt: firestoreTimestamp()
    };
    
    // Don't allow updating creator
    delete updateObj.createdBy;
    delete updateObj.createdAt;
    
    // Update department
    await updateDoc(doc(departmentsCollection, departmentId), updateObj);
  } catch (error) {
    console.error('Error updating department:', error);
    throw error;
  }
};

/**
 * Delete a department
 * 
 * @param {string} departmentId - Department ID
 * @returns {Promise<void>}
 */
export const deleteDepartment = async (departmentId) => {
  try {
    const user = await getCurrentUserData();
    
    if (!user) {
      throw new Error('You must be logged in to delete departments');
    }
    
    // Check if user has permission (admin only)
    if (user.role !== 'admin') {
      throw new Error('You do not have permission to delete departments');
    }
    
    // Delete department
    await deleteDoc(doc(departmentsCollection, departmentId));
  } catch (error) {
    console.error('Error deleting department:', error);
    throw error;
  }
};

/**
 * Get department progress statistics
 * 
 * @param {string} departmentId - Department ID
 * @param {Object} [options={}] - Options for department progress
 * @param {Date} [options.startDate] - Start date for tasks
 * @param {Date} [options.endDate] - End date for tasks
 * @returns {Promise<Object>} - Department progress object
 */
export const getDepartmentProgress = async (departmentId, options = {}) => {
  try {
    // Import tasks collection
    // Using dynamic import to avoid circular dependencies
    const { collection: tasksCollection } = await import('../tasks.js');
    
    // Build query constraints
    const constraints = [
      where('departmentId', '==', departmentId)
    ];
    
    // Filter by start date
    if (options.startDate) {
      constraints.push(where('createdAt', '>=', options.startDate));
    }
    
    // Filter by end date
    if (options.endDate) {
      constraints.push(where('createdAt', '<=', options.endDate));
    }
    
    // Execute query
    const tasksQuery = query(tasksCollection, ...constraints);
    const tasksSnapshot = await getDocs(tasksQuery);
    
    // Calculate progress statistics
    let totalTasks = 0;
    let completedTasks = 0;
    let inProgressTasks = 0;
    let todoTasks = 0;
    
    tasksSnapshot.forEach(doc => {
      const task = doc.data();
      totalTasks++;
      
      if (task.status === 'completed') {
        completedTasks++;
      } else if (task.status === 'in_progress') {
        inProgressTasks++;
      } else {
        todoTasks++;
      }
    });
    
    // Calculate completion percentage
    const progressPercentage = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100) 
      : 0;
    
    return {
      departmentId,
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      progressPercentage
    };
  } catch (error) {
    console.error('Error getting department progress:', error);
    throw error;
  }
};

/**
 * Get progress for all departments
 * 
 * @param {Object} [options={}] - Options for department progress
 * @param {Date} [options.startDate] - Start date for tasks
 * @param {Date} [options.endDate] - End date for tasks
 * @returns {Promise<Array>} - Array of department progress objects
 */
export const getAllDepartmentsProgress = async (options = {}) => {
  try {
    // Get all departments
    const departments = await getDepartments();
    
    // Get progress for each department
    const progressPromises = departments.map(department => 
      getDepartmentProgress(department.id, options)
        .then(progress => ({
          ...department,
          ...progress
        }))
    );
    
    // Wait for all progress calculations
    const departmentsWithProgress = await Promise.all(progressPromises);
    
    return departmentsWithProgress;
  } catch (error) {
    console.error('Error getting all departments progress:', error);
    throw error;
  }
};

/**
 * Subscribe to department changes
 * 
 * @param {Function} callback - Callback function for updates
 * @returns {Function} - Unsubscribe function
 */
export const subscribeToDepartments = (callback) => {
  // Build query constraints
  const constraints = [
    orderBy('name', 'asc')
  ];
  
  // Execute query
  const departmentsQuery = query(departmentsCollection, ...constraints);
  
  // Subscribe to query
  return onSnapshot(departmentsQuery, (snapshot) => {
    const departments = [];
    
    snapshot.forEach(doc => {
      departments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    callback(departments);
  }, (error) => {
    console.error('Error subscribing to departments:', error);
  });
};

/**
 * Subscribe to a department's progress
 * 
 * @param {string} departmentId - Department ID
 * @param {Object} [options={}] - Options for department progress
 * @param {Date} [options.startDate] - Start date for tasks
 * @param {Date} [options.endDate] - End date for tasks
 * @param {Function} callback - Callback function for updates
 * @returns {Function} - Unsubscribe function
 */
export const subscribeToDepartmentProgress = (departmentId, options = {}, callback) => {
  // Import tasks collection
  // Using dynamic import to avoid circular dependencies
  return import('../tasks.js')
    .then(({ collection: tasksCollection }) => {
      // Build query constraints
      const constraints = [
        where('departmentId', '==', departmentId)
      ];
      
      // Filter by start date
      if (options.startDate) {
        constraints.push(where('createdAt', '>=', options.startDate));
      }
      
      // Filter by end date
      if (options.endDate) {
        constraints.push(where('createdAt', '<=', options.endDate));
      }
      
      // Execute query
      const tasksQuery = query(tasksCollection, ...constraints);
      
      // Subscribe to query
      return onSnapshot(tasksQuery, (snapshot) => {
        // Calculate progress statistics
        let totalTasks = 0;
        let completedTasks = 0;
        let inProgressTasks = 0;
        let todoTasks = 0;
        
        snapshot.forEach(doc => {
          const task = doc.data();
          totalTasks++;
          
          if (task.status === 'completed') {
            completedTasks++;
          } else if (task.status === 'in_progress') {
            inProgressTasks++;
          } else {
            todoTasks++;
          }
        });
        
        // Calculate completion percentage
        const progressPercentage = totalTasks > 0 
          ? Math.round((completedTasks / totalTasks) * 100) 
          : 0;
        
        callback({
          departmentId,
          totalTasks,
          completedTasks,
          inProgressTasks,
          todoTasks,
          progressPercentage
        });
      }, (error) => {
        console.error('Error subscribing to department progress:', error);
      });
    });
};
