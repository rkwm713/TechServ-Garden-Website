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
    
    // Initialize column listeners
    initTaskColumns();
    
    // Initialize task creation
    initTaskCreation();
    
    // Initialize task filters
    initTaskFilters();
    
    // Load initial tasks
    loadTasksByStatus();
    
    // Initialize user's task list in sidebar
    initUserTaskList(userData.id);
    
    console.log('Tasks UI initialized successfully');
  } catch (error) {
    console.error('Error initializing Tasks UI:', error);
    showErrorMessage('There was an error loading your tasks. Please try refreshing the page.');
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
    existingCards.forEach(card => {
      if (!card.classList.contains('loading-placeholder')) {
        card.remove();
      }
    });
    
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
      
      // Get the task element
      const taskElement = document.getElementById(taskId);
      if (!taskElement) return;
      
      // Get column status
      const status = getColumnStatus(column);
      
      try {
        // Update task status in Firebase
        await updateTask(taskId, { status });
        
        // Move the task element
        const afterElement = getDropPosition(column, e.clientY);
        if (afterElement) {
          column.insertBefore(taskElement, afterElement);
        } else {
          column.appendChild(taskElement);
        }
        
        // Update column counts
        updateColumnCounts();
        
        showSuccessMessage('Task updated successfully');
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
 * Determine where to drop the card based on mouse position
 */
const getDropPosition = (column, y) => {
  const cards = Array.from(column.querySelectorAll('.task-card:not(.dragging)'));
  
  return cards.find(card => {
    const box = card.getBoundingClientRect();
    const cardMiddleY = box.top + box.height / 2;
    return y < cardMiddleY;
  });
};

/**
 * Initialize task creation functionality
 */
const initTaskCreation = () => {
  const addTaskButton = document.querySelector('.section-actions .primary-btn');
  if (!addTaskButton) return;
  
  addTaskButton.addEventListener('click', () => {
    // Show task creation modal or form
    // Implementation will depend on your UI
  });
};

/**
 * Initialize task filters
 */
const initTaskFilters = () => {
  // Implementation depends on your UI
  console.log("Task filters initialized");
};

/**
 * Initialize user task list in sidebar
 */
const initUserTaskList = async (userId) => {
  try {
    // Get user tasks from Firebase
    const { tasks } = await getUserTasks(userId);
    
    // Update UI with tasks
    console.log(`Loaded ${tasks.length} tasks for user ${userId}`);
  } catch (error) {
    console.error('Error loading user tasks:', error);
  }
};

/**
 * Load tasks by status from Firebase
 */
const loadTasksByStatus = async () => {
  try {
    // Show loading state
    showLoadingPlaceholders();
    
    // Get tasks from Firebase
    const { tasks } = await getTasks();
    
    // Hide loading state
    removeLoadingPlaceholders();
    
    // Add tasks to columns
    tasks.forEach(task => {
      createTaskCardElement(task.id, task);
    });
    
    // Update column counts
    updateColumnCounts();
    
    // Set up real-time updates
    setupRealTimeUpdates();
  } catch (error) {
    console.error('Error loading tasks:', error);
    removeLoadingPlaceholders();
    showErrorMessage('Error loading tasks: ' + error.message);
  }
};

/**
 * Setup real-time updates for tasks
 */
const setupRealTimeUpdates = () => {
  // Get current user
  getCurrentUserData().then(userData => {
    if (!userData) return;
    
    // Subscribe to tasks
    subscribeToTasks({}, (tasks) => {
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
  });
};

/**
 * Show loading placeholders
 */
const showLoadingPlaceholders = () => {
  // Implementation depends on your UI
  console.log("Showing loading placeholders");
};

/**
 * Remove loading placeholders
 */
const removeLoadingPlaceholders = () => {
  // Implementation depends on your UI
  console.log("Removing loading placeholders");
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
  
  if (taskData.isPersonal) {
    taskCard.classList.add('personal-task');
  }
  
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
      <span class="task-card-assignee">${taskData.assigneeId || 'Unassigned'}</span>
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
  
  // Update column counts
  updateColumnCounts();
  
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
  const assigneeElement = taskElement.querySelector('.task-card-assignee');
  
  if (titleElement) titleElement.textContent = taskData.title;
  if (detailsElement) detailsElement.textContent = taskData.description || '';
  
  if (priorityElement) {
    priorityElement.className = `task-card-priority priority-${taskData.priority || 'medium'}`;
  }
  
  // Update personal task class
  if (taskData.isPersonal) {
    taskElement.classList.add('personal-task');
  } else {
    taskElement.classList.remove('personal-task');
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

/**
 * Show success message
 */
const showSuccessMessage = (message) => {
  console.log(message);
};
