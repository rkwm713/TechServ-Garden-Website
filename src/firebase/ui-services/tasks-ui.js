/**
 * Tasks UI Service
 * Connects the Firebase tasks backend with the UI components
 */

import { 
  createTask, 
  updateTask, 
  deleteTask, 
  getTasks, 
  getTask,
  getUserTasks,
  assignTask, 
  unassignTask,
  subscribeToTasks,
  subscribeToTask
} from '../tasks.js';
import { getCurrentUserData } from '../auth.js';
import { getDepartments } from '../services/department.js';
import { showNotification } from '../../scripts/utils/helpers.js';

// Cache for user data to avoid repeated lookups
const userCache = new Map();

/**
 * Initialize the Tasks UI components
 * This connects Firebase to the existing UI elements
 */
export const initTasksUI = async () => {
  // Check if we're on the tasks page
  const taskBoard = document.querySelector('.task-board');
  if (!taskBoard) return;
  
  try {
    // Get current user
    const userData = await getCurrentUserData();
    if (!userData) {
      console.error('User not logged in');
      showLoginPrompt();
      return;
    }
    
    // Store current user in cache
    userCache.set(userData.id, userData);
    
    // Initialize column listeners
    initTaskColumns();
    
    // Load initial tasks
    await loadTasksByStatus();
    
    // Set up real-time updates
    initRealTimeUpdates();
    
    console.log('Tasks UI initialized successfully');
  } catch (error) {
    console.error('Error initializing Tasks UI:', error);
    showErrorMessage('There was an error loading your tasks. Please refresh the page.');
  }
};

/**
 * Initialize task columns and drag/drop functionality
 */
const initTaskColumns = () => {
  const taskColumns = document.querySelectorAll('.task-column');
  
  taskColumns.forEach(column => {
    // Clear existing cards first (we'll load from Firebase)
    const existingCards = column.querySelectorAll('.task-card');
    existingCards.forEach(card => card.remove());
    
    // Set up drop handling for drag and drop between columns
    column.addEventListener('dragover', e => {
      e.preventDefault();
      column.classList.add('drag-over');
    });
    
    column.addEventListener('dragleave', () => {
      column.classList.remove('drag-over');
    });
    
    column.addEventListener('drop', async e => {
      e.preventDefault();
      column.classList.remove('drag-over');
      
      // Get task ID from dragged element
      const taskId = e.dataTransfer.getData('text/plain');
      if (!taskId) return;
      
      // Extract the actual ID from the element ID (format: "task-123456")
      const actualTaskId = taskId.replace('task-', '');
      
      // Get the task element
      const taskElement = document.getElementById(taskId);
      if (!taskElement) return;
      
      // Get column status
      const status = getColumnStatus(column);
      
      try {
        // Update task status in Firebase
        await updateTask(actualTaskId, { status });
        
        // Move the task element
        column.appendChild(taskElement);
        
        // Update column counts
        updateColumnCounts();
      } catch (error) {
        console.error('Error updating task status:', error);
        showErrorMessage('Error updating task: ' + error.message);
      }
    });
  });
};

/**
 * Get the status corresponding to a column
 */
const getColumnStatus = (column) => {
  const columnTitle = column.querySelector('.column-title').textContent.trim().toLowerCase();
  
  switch (columnTitle) {
    case 'to do':
      return 'todo';
    case 'in progress':
      return 'in_progress';
    case 'completed':
      return 'completed';
    default:
      return 'todo';
  }
};

/**
 * Get the column corresponding to a status
 */
const getColumnForStatus = (status) => {
  const columns = document.querySelectorAll('.task-column');
  
  for (const column of columns) {
    const columnTitle = column.querySelector('.column-title').textContent.trim().toLowerCase();
    
    if (
      (status === 'todo' && columnTitle === 'to do') ||
      (status === 'in_progress' && columnTitle === 'in progress') ||
      (status === 'completed' && columnTitle === 'completed')
    ) {
      return column;
    }
  }
  
  // Default to first column
  return columns[0];
};

/**
 * Load tasks by status from Firebase
 */
const loadTasksByStatus = async () => {
  try {
    // Get departments for tasks
    const departments = await getDepartments();
    const departmentsMap = new Map();
    departments.forEach(dept => departmentsMap.set(dept.id, dept));
    
    // Get tasks from Firebase
    const { tasks } = await getTasks();
    
    // Add tasks to columns
    for (const task of tasks) {
      // Get department details if available
      if (task.departmentId && departmentsMap.has(task.departmentId)) {
        task.department = departmentsMap.get(task.departmentId);
      }
      
      createTaskCardElement(task.id, task);
    }
    
    // Update column counts
    updateColumnCounts();
  } catch (error) {
    console.error('Error loading tasks:', error);
    showErrorMessage('Error loading tasks: ' + error.message);
  }
};

/**
 * Initialize real-time updates for tasks
 */
const initRealTimeUpdates = () => {
  // Subscribe to tasks with real-time updates
  const unsubscribe = subscribeToTasks({}, (tasks) => {
    // Handle task updates
    tasks.forEach(task => {
      // Update UI
      const existingCard = document.getElementById(`task-${task.id}`);
      
      if (existingCard) {
        // Update existing card
        updateTaskCardElement(existingCard, task);
      } else {
        // Create new card
        createTaskCardElement(task.id, task);
      }
    });
    
    // Update column counts
    updateColumnCounts();
  });
  
  // Store unsubscribe function for cleanup
  window.__taskUnsubscribe = unsubscribe;
};

/**
 * Create a task card element
 */
const createTaskCardElement = (taskId, taskData) => {
  const column = getColumnForStatus(taskData.status);
  if (!column) return;
  
  const taskCard = document.createElement('div');
  taskCard.className = 'task-card';
  taskCard.id = `task-${taskId}`;
  taskCard.setAttribute('data-task-id', taskId);
  taskCard.setAttribute('draggable', 'true');
  
  // Format due date if present
  let formattedDate = 'No due date';
  if (taskData.dueDate) {
    const date = new Date(taskData.dueDate);
    formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  
  // Add task content
  taskCard.innerHTML = `
    <div class="task-card-header">
      <h4 class="task-card-title">${taskData.title}</h4>
      <span class="task-card-priority priority-${taskData.priority || 'medium'}"></span>
    </div>
    <p class="task-card-details">${taskData.description || ''}</p>
    <div class="task-card-meta">
      <span class="task-card-date">${formattedDate}</span>
    </div>
  `;
  
  // Add drag and drop handlers
  taskCard.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', taskCard.id);
    taskCard.classList.add('dragging');
  });
  
  taskCard.addEventListener('dragend', () => {
    taskCard.classList.remove('dragging');
  });
  
  // Add to column
  column.appendChild(taskCard);
  
  return taskCard;
};

/**
 * Update a task card element
 */
const updateTaskCardElement = (taskElement, taskData) => {
  // Update card content
  const titleElement = taskElement.querySelector('.task-card-title');
  const detailsElement = taskElement.querySelector('.task-card-details');
  const priorityElement = taskElement.querySelector('.task-card-priority');
  const dateElement = taskElement.querySelector('.task-card-date');
  
  if (titleElement) titleElement.textContent = taskData.title;
  if (detailsElement) detailsElement.textContent = taskData.description || '';
  
  if (priorityElement) {
    priorityElement.className = `task-card-priority priority-${taskData.priority || 'medium'}`;
  }
  
  // Update due date if present
  if (dateElement) {
    let formattedDate = 'No due date';
    if (taskData.dueDate) {
      const date = new Date(taskData.dueDate);
      formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    dateElement.textContent = formattedDate;
  }
  
  // Move to correct column if status changed
  const currentColumn = taskElement.closest('.task-column');
  const correctColumn = getColumnForStatus(taskData.status);
  
  if (currentColumn !== correctColumn && correctColumn) {
    correctColumn.appendChild(taskElement);
  }
};

/**
 * Update column counts
 */
const updateColumnCounts = () => {
  const columns = document.querySelectorAll('.task-column');
  
  columns.forEach(column => {
    const count = column.querySelectorAll('.task-card').length;
    const countElement = column.querySelector('.column-count');
    
    if (countElement) {
      countElement.textContent = count;
    }
  });
};

/**
 * Show login prompt
 */
const showLoginPrompt = () => {
  console.log("User needs to log in to view tasks");
};

/**
 * Show error message
 */
const showErrorMessage = (message) => {
  console.error(message);
};
