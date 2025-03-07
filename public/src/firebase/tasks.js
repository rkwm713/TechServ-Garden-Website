/**
 * TechServ Community Garden - Tasks Service
 * 
 * This module handles task creation, management, assignment, and subscription
 * using Firebase Firestore for the task management system.
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
const tasksCollection = collection(firestore, 'tasks');
const taskAssignmentsCollection = collection(firestore, 'task_assignments');

/**
 * Create a new task
 * 
 * @param {Object} taskData - Task data
 * @param {string} taskData.title - Task title
 * @param {string} taskData.description - Task description
 * @param {string} taskData.status - Task status (todo, in_progress, completed)
 * @param {string} taskData.priority - Task priority (low, medium, high)
 * @param {string} [taskData.dueDate] - Task due date
 * @param {string} [taskData.departmentId] - Department ID
 * @param {boolean} [taskData.isPersonal=false] - Whether task is personal
 * @param {string} [taskData.assigneeId] - ID of user assigned to task
 * @returns {Promise<string>} - ID of created task
 * @throws {Error} If task creation fails
 */
export const createTask = async (taskData) => {
  try {
    // Get current user
    const user = await getCurrentUserData();
    
    if (!user) {
      throw new Error('You must be logged in to create tasks');
    }
    
    // Create task document
    const taskDoc = {
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      departmentId: taskData.departmentId || null,
      isPersonal: taskData.isPersonal || false,
      createdBy: user.id,
      createdAt: firestoreTimestamp(),
      updatedAt: firestoreTimestamp()
    };
    
    // Add task to Firestore
    const docRef = await addDoc(tasksCollection, taskDoc);
    
    // Assign task if assignee is specified
    if (taskData.assigneeId) {
      await assignTask(docRef.id, taskData.assigneeId);
    }
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

/**
 * Get a task by ID
 * 
 * @param {string} taskId - Task ID
 * @returns {Promise<Object|null>} - Task data or null if not found
 * @throws {Error} If getting task fails
 */
export const getTask = async (taskId) => {
  try {
    const taskDoc = await getDoc(doc(tasksCollection, taskId));
    
    if (!taskDoc.exists()) {
      return null;
    }
    
    const taskData = taskDoc.data();
    
    // Get task assignments
    const assignmentsQuery = query(
      taskAssignmentsCollection,
      where('taskId', '==', taskId)
    );
    
    const assignmentsSnapshot = await getDocs(assignmentsQuery);
    const assignees = [];
    
    assignmentsSnapshot.forEach(doc => {
      assignees.push(doc.data().userId);
    });
    
    return {
      id: taskId,
      ...taskData,
      assignees
    };
  } catch (error) {
    console.error('Error getting task:', error);
    throw error;
  }
};

/**
 * Get tasks with optional filtering
 * 
 * @param {Object} [filters={}] - Filters for tasks
 * @param {boolean} [filters.isPersonal=false] - Whether to get personal tasks
 * @param {string} [filters.status] - Filter by status
 * @param {string} [filters.priority] - Filter by priority
 * @param {string} [filters.departmentId] - Filter by department
 * @param {string} [filters.createdBy] - Filter by creator
 * @param {string} [filters.assigneeId] - Filter by assignee
 * @param {string} [filters.orderBy='createdAt'] - Field to order by
 * @param {string} [filters.orderDirection='desc'] - Order direction
 * @param {number} [filters.limit=50] - Maximum number of tasks to return
 * @returns {Promise<Object>} - Object with tasks array and pagination info
 * @throws {Error} If getting tasks fails
 */
export const getTasks = async (filters = {}) => {
  try {
    const user = await getCurrentUserData();
    
    if (!user) {
      throw new Error('You must be logged in to get tasks');
    }
    
    // Build query constraints
    const constraints = [];
    
    // Filter by personal/community
    if (filters.isPersonal) {
      constraints.push(where('isPersonal', '==', true));
      constraints.push(where('createdBy', '==', user.id));
    } else {
      constraints.push(where('isPersonal', '==', false));
    }
    
    // Apply additional filters
    if (filters.status) {
      constraints.push(where('status', '==', filters.status));
    }
    
    if (filters.priority) {
      constraints.push(where('priority', '==', filters.priority));
    }
    
    if (filters.departmentId) {
      constraints.push(where('departmentId', '==', filters.departmentId));
    }
    
    if (filters.createdBy) {
      constraints.push(where('createdBy', '==', filters.createdBy));
    }
    
    // Order by field
    const orderByField = filters.orderBy || 'createdAt';
    const orderDirection = filters.orderDirection || 'desc';
    constraints.push(orderBy(orderByField, orderDirection));
    
    // Limit results
    const limitCount = filters.limit || 50;
    constraints.push(limit(limitCount));
    
    // Execute query
    const tasksQuery = query(tasksCollection, ...constraints);
    const tasksSnapshot = await getDocs(tasksQuery);
    
    // Process task documents
    const tasks = [];
    
    for (const taskDoc of tasksSnapshot.docs) {
      const task = taskDoc.data();
      
      // Add doc ID
      task.id = taskDoc.id;
      
      // Get assignees
      const assignmentsQuery = query(
        taskAssignmentsCollection,
        where('taskId', '==', taskDoc.id)
      );
      
      const assignmentsSnapshot = await getDocs(assignmentsQuery);
      const assignees = [];
      
      assignmentsSnapshot.forEach(doc => {
        assignees.push(doc.data().userId);
      });
      
      task.assignees = assignees;
      
      tasks.push(task);
    }
    
    return {
      tasks,
      total: tasksSnapshot.size,
      hasMore: tasksSnapshot.size === limitCount
    };
  } catch (error) {
    console.error('Error getting tasks:', error);
    throw error;
  }
};

/**
 * Get tasks assigned to a user
 * 
 * @param {string} userId - User ID
 * @param {Object} [filters={}] - Additional filters
 * @returns {Promise<Object>} - Object with tasks array and pagination info
 * @throws {Error} If getting user tasks fails
 */
export const getUserTasks = async (userId, filters = {}) => {
  try {
    // Get task assignments for user
    const assignmentsQuery = query(
      taskAssignmentsCollection,
      where('userId', '==', userId)
    );
    
    const assignmentsSnapshot = await getDocs(assignmentsQuery);
    
    // Extract task IDs
    const taskIds = [];
    assignmentsSnapshot.forEach(doc => {
      taskIds.push(doc.data().taskId);
    });
    
    // If no assignments, return empty array
    if (taskIds.length === 0) {
      return { tasks: [], total: 0, hasMore: false };
    }
    
    // Build query constraints
    const constraints = [];
    
    // Filter by status if provided
    if (filters.status) {
      constraints.push(where('status', '==', filters.status));
    }
    
    // Order by field
    const orderByField = filters.orderBy || 'createdAt';
    const orderDirection = filters.orderDirection || 'desc';
    constraints.push(orderBy(orderByField, orderDirection));
    
    // We'll need to manually filter by task IDs since Firestore doesn't support OR queries
    // and we can't use 'in' with other filters easily
    
    // Execute query
    const tasksQuery = query(tasksCollection, ...constraints);
    const tasksSnapshot = await getDocs(tasksQuery);
    
    // Filter and process task documents
    const tasks = [];
    
    for (const taskDoc of tasksSnapshot.docs) {
      // Only include tasks in the taskIds array
      if (taskIds.includes(taskDoc.id)) {
        const task = taskDoc.data();
        
        // Add doc ID
        task.id = taskDoc.id;
        
        // Get all assignees
        const assignmentsQuery = query(
          taskAssignmentsCollection,
          where('taskId', '==', taskDoc.id)
        );
        
        const assignmentsSnapshot = await getDocs(assignmentsQuery);
        const assignees = [];
        
        assignmentsSnapshot.forEach(doc => {
          assignees.push(doc.data().userId);
        });
        
        task.assignees = assignees;
        
        tasks.push(task);
      }
    }
    
    return {
      tasks,
      total: tasks.length,
      hasMore: false // We fetched all assigned tasks
    };
  } catch (error) {
    console.error('Error getting user tasks:', error);
    throw error;
  }
};

/**
 * Update a task
 * 
 * @param {string} taskId - Task ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 * @throws {Error} If task update fails
 */
export const updateTask = async (taskId, updates) => {
  try {
    const user = await getCurrentUserData();
    
    if (!user) {
      throw new Error('You must be logged in to update tasks');
    }
    
    // Get task to check permissions
    const taskDoc = await getDoc(doc(tasksCollection, taskId));
    
    if (!taskDoc.exists()) {
      throw new Error('Task not found');
    }
    
    const taskData = taskDoc.data();
    
    // Check permissions
    const isAdmin = user.role === 'admin';
    const isModerator = user.role === 'moderator';
    const isCreator = taskData.createdBy === user.id;
    
    // Check if user is assigned to the task
    const assignmentQuery = query(
      taskAssignmentsCollection,
      where('taskId', '==', taskId),
      where('userId', '==', user.id)
    );
    
    const assignmentSnapshot = await getDocs(assignmentQuery);
    const isAssigned = !assignmentSnapshot.empty;
    
    if (!isAdmin && !isModerator && !isCreator && !isAssigned) {
      throw new Error('You do not have permission to update this task');
    }
    
    // Create update object
    const updateObj = {
      ...updates,
      updatedAt: firestoreTimestamp()
    };
    
    // Don't allow updating creator
    delete updateObj.createdBy;
    delete updateObj.createdAt;
    
    // Update task
    await updateDoc(doc(tasksCollection, taskId), updateObj);
    
    // Handle assignee updates if needed
    if (updates.assigneeId) {
      await assignTask(taskId, updates.assigneeId);
    }
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

/**
 * Delete a task
 * 
 * @param {string} taskId - Task ID
 * @returns {Promise<void>}
 * @throws {Error} If task deletion fails
 */
export const deleteTask = async (taskId) => {
  try {
    const user = await getCurrentUserData();
    
    if (!user) {
      throw new Error('You must be logged in to delete tasks');
    }
    
    // Get task to check permissions
    const taskDoc = await getDoc(doc(tasksCollection, taskId));
    
    if (!taskDoc.exists()) {
      throw new Error('Task not found');
    }
    
    const taskData = taskDoc.data();
    
    // Check permissions
    const isAdmin = user.role === 'admin';
    const isModerator = user.role === 'moderator';
    const isCreator = taskData.createdBy === user.id;
    
    if (!isAdmin && !isModerator && !isCreator) {
      throw new Error('You do not have permission to delete this task');
    }
    
    // Delete task assignments
    const assignmentsQuery = query(
      taskAssignmentsCollection,
      where('taskId', '==', taskId)
    );
    
    const assignmentsSnapshot = await getDocs(assignmentsQuery);
    
    const deletePromises = assignmentsSnapshot.docs.map(doc => 
      deleteDoc(doc.ref)
    );
    
    await Promise.all(deletePromises);
    
    // Delete task
    await deleteDoc(doc(tasksCollection, taskId));
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

/**
 * Assign a task to a user
 * 
 * @param {string} taskId - Task ID
 * @param {string} userId - User ID to assign
 * @returns {Promise<string>} - ID of the assignment
 * @throws {Error} If task assignment fails
 */
export const assignTask = async (taskId, userId) => {
  try {
    const user = await getCurrentUserData();
    
    if (!user) {
      throw new Error('You must be logged in to assign tasks');
    }
    
    // Get task to check permissions
    const taskDoc = await getDoc(doc(tasksCollection, taskId));
    
    if (!taskDoc.exists()) {
      throw new Error('Task not found');
    }
    
    const taskData = taskDoc.data();
    
    // Check permissions
    const isAdmin = user.role === 'admin';
    const isModerator = user.role === 'moderator';
    const isCreator = taskData.createdBy === user.id;
    
    if (!isAdmin && !isModerator && !isCreator) {
      throw new Error('You do not have permission to assign this task');
    }
    
    // Check if assignment already exists
    const assignmentQuery = query(
      taskAssignmentsCollection,
      where('taskId', '==', taskId),
      where('userId', '==', userId)
    );
    
    const assignmentSnapshot = await getDocs(assignmentQuery);
    
    if (!assignmentSnapshot.empty) {
      // Assignment already exists
      return assignmentSnapshot.docs[0].id;
    }
    
    // Create assignment
    const assignmentData = {
      taskId,
      userId,
      assignedBy: user.id,
      assignedAt: firestoreTimestamp()
    };
    
    const assignmentRef = await addDoc(taskAssignmentsCollection, assignmentData);
    return assignmentRef.id;
  } catch (error) {
    console.error('Error assigning task:', error);
    throw error;
  }
};

/**
 * Unassign a task from a user
 * 
 * @param {string} taskId - Task ID
 * @param {string} userId - User ID to unassign
 * @returns {Promise<void>}
 * @throws {Error} If task unassignment fails
 */
export const unassignTask = async (taskId, userId) => {
  try {
    const user = await getCurrentUserData();
    
    if (!user) {
      throw new Error('You must be logged in to unassign tasks');
    }
    
    // Get task to check permissions
    const taskDoc = await getDoc(doc(tasksCollection, taskId));
    
    if (!taskDoc.exists()) {
      throw new Error('Task not found');
    }
    
    const taskData = taskDoc.data();
    
    // Check permissions
    const isAdmin = user.role === 'admin';
    const isModerator = user.role === 'moderator';
    const isCreator = taskData.createdBy === user.id;
    const isSelfUnassign = userId === user.id;
    
    if (!isAdmin && !isModerator && !isCreator && !isSelfUnassign) {
      throw new Error('You do not have permission to unassign this task');
    }
    
    // Find assignment
    const assignmentQuery = query(
      taskAssignmentsCollection,
      where('taskId', '==', taskId),
      where('userId', '==', userId)
    );
    
    const assignmentSnapshot = await getDocs(assignmentQuery);
    
    if (assignmentSnapshot.empty) {
      // Assignment doesn't exist
      return;
    }
    
    // Delete assignment
    await deleteDoc(assignmentSnapshot.docs[0].ref);
  } catch (error) {
    console.error('Error unassigning task:', error);
    throw error;
  }
};

/**
 * Subscribe to tasks with optional filtering
 * 
 * @param {Object} [filters={}] - Filters for tasks
 * @param {Function} callback - Callback function for updates
 * @returns {Function} - Unsubscribe function
 */
export const subscribeToTasks = (filters = {}, callback) => {
  // Build query constraints
  const constraints = [];
  
  // Filter by personal/community
  if (filters.isPersonal) {
    constraints.push(where('isPersonal', '==', true));
    
    // If userId is provided, filter by creator
    if (filters.userId) {
      constraints.push(where('createdBy', '==', filters.userId));
    }
  } else {
    constraints.push(where('isPersonal', '==', false));
  }
  
  // Apply additional filters
  if (filters.status) {
    constraints.push(where('status', '==', filters.status));
  }
  
  if (filters.priority) {
    constraints.push(where('priority', '==', filters.priority));
  }
  
  if (filters.departmentId) {
    constraints.push(where('departmentId', '==', filters.departmentId));
  }
  
  // Order by field
  const orderByField = filters.orderBy || 'createdAt';
  const orderDirection = filters.orderDirection || 'desc';
  constraints.push(orderBy(orderByField, orderDirection));
  
  // Execute query
  const tasksQuery = query(tasksCollection, ...constraints);
  
  // Subscribe to query
  return onSnapshot(tasksQuery, (snapshot) => {
    const tasks = [];
    
    snapshot.forEach(doc => {
      tasks.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    callback(tasks);
  }, (error) => {
    console.error('Error subscribing to tasks:', error);
  });
};

/**
 * Subscribe to a single task
 * 
 * @param {string} taskId - Task ID
 * @param {Function} callback - Callback function for updates
 * @returns {Function} - Unsubscribe function
 */
export const subscribeToTask = (taskId, callback) => {
  const taskRef = doc(tasksCollection, taskId);
  
  return onSnapshot(taskRef, async (doc) => {
    if (doc.exists()) {
      const task = doc.data();
      
      // Add doc ID
      task.id = doc.id;
      
      // Get assignees
      const assignmentsQuery = query(
        taskAssignmentsCollection,
        where('taskId', '==', taskId)
      );
      
      try {
        const assignmentsSnapshot = await getDocs(assignmentsQuery);
        const assignees = [];
        
        assignmentsSnapshot.forEach(doc => {
          assignees.push(doc.data().userId);
        });
        
        task.assignees = assignees;
        
        callback(task);
      } catch (error) {
        console.error('Error getting task assignees:', error);
        callback({
          id: doc.id,
          ...doc.data(),
          assignees: []
        });
      }
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('Error subscribing to task:', error);
  });
};
