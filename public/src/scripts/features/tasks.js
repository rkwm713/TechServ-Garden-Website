/**
 * TechServ Community Garden Website
 * Tasks JavaScript file for task management functionality
 * Handles task board, filters, drag & drop, and volunteer sign-ups
 */

import { showNotification, formatDate, debounce } from '../utils/helpers.js';
import { initModals, openModal, closeModal, createModal } from '../utils/modal.js';

// Initialize everything on DOM load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize task board functionality
    initTaskBoard();
    
    // Initialize task filters
    initTaskFilters();
    
    // Initialize task checkboxes in sidebar
    initTaskCheckboxes();
    
    // Initialize task actions
    initTaskActions();
    
    // Initialize volunteer sign-up buttons
    initVolunteerSignup();
    
    // Initialize department filters
    initDepartmentFilters();
    
    // Initialize add task functionality
    initAddTask();
    
    // Initialize filter buttons
    initFilterButtons();
});

/**
 * Task Board Functionality
 * Enables drag and drop between task columns
 */
export function initTaskBoard() {
    const taskColumns = document.querySelectorAll('.task-column');
    const taskCards = document.querySelectorAll('.task-card');
    
    // Update column counts
    updateColumnCounts();
    
    // Make task cards draggable
    taskCards.forEach(card => {
        card.setAttribute('draggable', 'true');
        card.setAttribute('aria-grabbed', 'false');
        card.setAttribute('role', 'listitem');
        
        // Add drag start event
        card.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', card.id || 'task-card');
            card.classList.add('dragging');
            card.setAttribute('aria-grabbed', 'true');
            
            // Create a ghost image that's a clone of the card
            const ghost = card.cloneNode(true);
            ghost.style.position = 'absolute';
            ghost.style.top = '-1000px';
            document.body.appendChild(ghost);
            e.dataTransfer.setDragImage(ghost, 0, 0);
            
            // Remove ghost after drag ends
            setTimeout(() => {
                if (ghost.parentNode) {
                    ghost.parentNode.removeChild(ghost);
                }
            }, 0);
        });
        
        // Add drag end event
        card.addEventListener('dragend', function() {
            card.classList.remove('dragging');
            card.setAttribute('aria-grabbed', 'false');
            updateColumnCounts();
        });
        
        // Add edit functionality to task cards
        addTaskCardActions(card);
    });
    
    // Make columns drop targets
    taskColumns.forEach(column => {
        column.setAttribute('role', 'list');
        column.setAttribute('aria-dropeffect', 'move');
        
        column.addEventListener('dragover', function(e) {
            e.preventDefault();
            column.classList.add('drag-over');
        });
        
        column.addEventListener('dragleave', function() {
            column.classList.remove('drag-over');
        });
        
        column.addEventListener('drop', function(e) {
            e.preventDefault();
            column.classList.remove('drag-over');
            
            // Get the dragged card
            const draggedCard = document.querySelector('.dragging');
            if (draggedCard) {
                // Insert before the next card (if any)
                const afterElement = getDropPosition(column, e.clientY);
                if (afterElement) {
                    column.insertBefore(draggedCard, afterElement);
                } else {
                    // Append to the end if no position found
                    column.appendChild(draggedCard);
                }
                
                // Update task status based on column
                updateTaskStatus(draggedCard, column);
                
                // Update column counts
                updateColumnCounts();
                
                // Show success notification
                showNotification('Task moved successfully', 'success');
            }
        });
    });
}

/**
 * Determine where to drop the card based on mouse position
 * @param {HTMLElement} column - The column element
 * @param {number} y - The mouse Y position
 * @returns {HTMLElement|null} - The element to insert before, or null to append
 */
function getDropPosition(column, y) {
    // Get all cards in the column that aren't being dragged
    const cards = Array.from(column.querySelectorAll('.task-card:not(.dragging)'));
    
    // Find the first card that's below the cursor
    return cards.find(card => {
        const box = card.getBoundingClientRect();
        const cardMiddleY = box.top + box.height / 2;
        return y < cardMiddleY;
    });
}

/**
 * Update task status based on which column it's in
 * @param {HTMLElement} card - The task card element
 * @param {HTMLElement} column - The column element
 */
function updateTaskStatus(card, column) {
    // Get column title
    const columnTitle = column.querySelector('.column-title').textContent.trim();
    
    // Update task status visually if needed
    if (columnTitle === 'Completed') {
        card.classList.add('completed');
    } else {
        card.classList.remove('completed');
    }
    
    // In a real app, this would update the task status in the database
    console.log(`Task "${card.querySelector('.task-card-title').textContent}" status updated to "${columnTitle}"`);
}

/**
 * Update the count of tasks in each column
 */
function updateColumnCounts() {
    const columns = document.querySelectorAll('.task-column');
    
    columns.forEach(column => {
        const count = column.querySelectorAll('.task-card').length;
        const countElement = column.querySelector('.column-count');
        
        if (countElement) {
            countElement.textContent = count;
            countElement.setAttribute('aria-label', `${count} tasks`);
        }
    });
}

/**
 * Add edit and delete actions to task cards
 * @param {HTMLElement} card - The task card element
 */
function addTaskCardActions(card) {
    // Create action buttons container if it doesn't exist
    if (!card.querySelector('.task-card-actions')) {
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'task-card-actions';
        
        // Edit button
        const editButton = document.createElement('button');
        editButton.className = 'task-action-btn edit-btn';
        editButton.innerHTML = '<i class="fas fa-edit" aria-hidden="true"></i>';
        editButton.setAttribute('title', 'Edit Task');
        editButton.setAttribute('aria-label', 'Edit Task');
        editButton.addEventListener('click', function(e) {
            e.stopPropagation();
            openEditTaskModal(card);
        });
        
        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'task-action-btn delete-btn';
        deleteButton.innerHTML = '<i class="fas fa-trash-alt" aria-hidden="true"></i>';
        deleteButton.setAttribute('title', 'Delete Task');
        deleteButton.setAttribute('aria-label', 'Delete Task');
        deleteButton.addEventListener('click', function(e) {
            e.stopPropagation();
            confirmDeleteTask(card);
        });
        
        // Add buttons to container
        actionsContainer.appendChild(editButton);
        actionsContainer.appendChild(deleteButton);
        
        // Add container to card header
        const cardHeader = card.querySelector('.task-card-header');
        cardHeader.appendChild(actionsContainer);
    }
    
    // Make the whole card clickable to show details
    card.addEventListener('click', function() {
        openTaskDetailsModal(card);
    });
    
    // Add keyboard support for accessibility
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openTaskDetailsModal(card);
        }
    });
}

/**
 * Task Filters Initialization
 */
export function initTaskFilters() {
    const filterOptions = document.querySelectorAll('.filter-option');
    const taskItems = document.querySelectorAll('.task-card');
    
    if (filterOptions.length > 0) {
        filterOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove active class from all filters
                filterOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to clicked filter
                this.classList.add('active');
                
                // Get filter type
                const filterType = this.getAttribute('data-filter');
                
                // Show/hide tasks based on filter
                if (taskItems.length > 0) {
                    if (filterType === 'all') {
                        // Show all tasks
                        taskItems.forEach(item => {
                            item.style.display = 'block';
                        });
                    } else {
                        // Show only tasks that match the filter
                        taskItems.forEach(item => {
                            if (item.classList.contains(filterType)) {
                                item.style.display = 'block';
                            } else {
                                item.style.display = 'none';
                            }
                        });
                    }
                }
                
                // Announce filter change for screen readers
                const announcer = document.getElementById('aria-announcer') || 
                                  document.createElement('div');
                if (!document.getElementById('aria-announcer')) {
                    announcer.id = 'aria-announcer';
                    announcer.className = 'sr-only';
                    announcer.setAttribute('aria-live', 'polite');
                    document.body.appendChild(announcer);
                }
                announcer.textContent = `Filtered by ${this.textContent.trim()}`;
            });
        });
    }
}

/**
 * Task Checkboxes Initialization
 */
export function initTaskCheckboxes() {
    const taskCheckboxes = document.querySelectorAll('.task-checkbox');
    
    taskCheckboxes.forEach(checkbox => {
        // Remove existing event listeners (to prevent duplicates)
        checkbox.removeEventListener('change', handleTaskCheckboxChange);
        
        // Add new event listener
        checkbox.addEventListener('change', handleTaskCheckboxChange);
    });
}

/**
 * Handle task checkbox change
 * @param {Event} event - The change event
 */
export function handleTaskCheckboxChange() {
    const taskItem = this.closest('.task-item') || this.closest('.task-card');
    
    if (taskItem) {
        if (this.checked) {
            taskItem.classList.add('completed');
            
            // If it's a task card, update status
            const statusBadge = taskItem.querySelector('.task-status');
            if (statusBadge) {
                statusBadge.textContent = 'Completed';
                statusBadge.className = 'task-status status-completed';
            }
            
            // Find corresponding task in main board and update if exists
            const taskTitle = taskItem.querySelector('.task-label')?.textContent || 
                              taskItem.querySelector('.task-card-title')?.textContent;
            
            if (taskTitle) {
                updateMainBoardTask(taskTitle, 'Completed');
            }
            
            showNotification('Task marked as completed', 'success');
        } else {
            taskItem.classList.remove('completed');
            
            // If it's a task card, update status
            const statusBadge = taskItem.querySelector('.task-status');
            if (statusBadge) {
                statusBadge.textContent = 'Open';
                statusBadge.className = 'task-status status-open';
            }
            
            // Find corresponding task in main board and update if exists
            const taskTitle = taskItem.querySelector('.task-label')?.textContent || 
                              taskItem.querySelector('.task-card-title')?.textContent;
            
            if (taskTitle) {
                updateMainBoardTask(taskTitle, 'To Do');
            }
            
            showNotification('Task marked as incomplete', 'info');
        }
    }
}

/**
 * Update task in main board based on sidebar checkbox
 * @param {string} taskTitle - The task title to find
 * @param {string} newStatus - The new status to set
 */
function updateMainBoardTask(taskTitle, newStatus) {
    // Find task card with matching title
    const taskCards = document.querySelectorAll('.task-card');
    let matchingCard = null;
    
    taskCards.forEach(card => {
        const cardTitle = card.querySelector('.task-card-title')?.textContent;
        if (cardTitle === taskTitle) {
            matchingCard = card;
        }
    });
    
    if (matchingCard) {
        // Find target column
        const columns = document.querySelectorAll('.task-column');
        let targetColumn = null;
        
        columns.forEach(column => {
            const columnTitle = column.querySelector('.column-title')?.textContent;
            if (columnTitle === newStatus) {
                targetColumn = column;
            }
        });
        
        if (targetColumn) {
            // Move card to target column
            targetColumn.appendChild(matchingCard);
            
            // Update task status
            updateTaskStatus(matchingCard, targetColumn);
            
            // Update column counts
            updateColumnCounts();
        }
    }
}

/**
 * Task Actions Initialization
 */
export function initTaskActions() {
    // Add task button
    const addTaskButton = document.querySelector('.add-task-btn, .primary-btn .fa-plus');
    
    if (addTaskButton) {
        addTaskButton.addEventListener('click', function() {
            openAddTaskModal();
        });
    }
    
    // Task card action buttons using event delegation
    const taskContainer = document.querySelector('.tasks-container, .task-board');
    
    if (taskContainer) {
        taskContainer.addEventListener('click', function(event) {
            // Edit button
            const editButton = event.target.closest('.task-edit-btn, .edit-btn');
            if (editButton) {
                event.preventDefault();
                const taskCard = editButton.closest('.task-card');
                if (taskCard) {
                    openEditTaskModal(taskCard);
                }
            }
            
            // Delete button
            const deleteButton = event.target.closest('.task-delete-btn, .delete-btn');
            if (deleteButton) {
                event.preventDefault();
                const taskCard = deleteButton.closest('.task-card');
                if (taskCard) {
                    confirmDeleteTask(taskCard);
                }
            }
        });
    }
    
    // Task sort dropdown
    const sortDropdown = document.querySelector('.task-sort-select');
    
    if (sortDropdown) {
        sortDropdown.addEventListener('change', function() {
            const sortValue = this.value;
            sortTasks(sortValue);
        });
    }
}

/**
 * Sort tasks based on the selected value
 * @param {string} sortBy - The sort criteria
 */
function sortTasks(sortBy) {
    // This is a placeholder for actual sorting logic
    showNotification(`Tasks sorted by ${sortBy}`, 'info');
}

/**
 * Open modal to edit a task
 * @param {HTMLElement} card - The task card element
 */
function openEditTaskModal(card) {
    // Get task details
    const title = card.querySelector('.task-card-title').textContent;
    const details = card.querySelector('.task-card-details').textContent;
    const priority = card.querySelector('.task-card-priority').classList.contains('priority-high') ? 'high' : 
                    card.querySelector('.task-card-priority').classList.contains('priority-medium') ? 'medium' : 'low';
    
    const content = `
        <div class="form-group">
            <label for="edit-task-title" class="form-label">Task Title</label>
            <input type="text" id="edit-task-title" class="form-input" value="${title}">
        </div>
        <div class="form-group">
            <label for="edit-task-details" class="form-label">Task Details</label>
            <textarea id="edit-task-details" class="form-textarea">${details}</textarea>
        </div>
        <div class="form-group">
            <label class="form-label">Priority</label>
            <div class="priority-options">
                <label class="priority-option">
                    <input type="radio" name="edit-task-priority" value="low" ${priority === 'low' ? 'checked' : ''}>
                    <span class="priority-indicator priority-low"></span>
                    <span>Low</span>
                </label>
                <label class="priority-option">
                    <input type="radio" name="edit-task-priority" value="medium" ${priority === 'medium' ? 'checked' : ''}>
                    <span class="priority-indicator priority-medium"></span>
                    <span>Medium</span>
                </label>
                <label class="priority-option">
                    <input type="radio" name="edit-task-priority" value="high" ${priority === 'high' ? 'checked' : ''}>
                    <span class="priority-indicator priority-high"></span>
                    <span>High</span>
                </label>
            </div>
        </div>
        <div class="form-group">
            <label for="edit-task-date" class="form-label">Due Date</label>
            <input type="date" id="edit-task-date" class="form-input">
        </div>
        <div class="form-group">
            <label for="edit-task-assignee" class="form-label">Assignee</label>
            <select id="edit-task-assignee" class="form-select">
                <option value="">Unassigned</option>
                <option value="js">J.S.</option>
                <option value="al">A.L.</option>
                <option value="me">Me</option>
            </select>
        </div>
    `;
    
    const modal = createModal({
        id: 'edit-task-modal',
        title: 'Edit Task',
        content: content,
        buttons: [
            {
                text: 'Cancel',
                type: 'secondary-btn',
                action: 'cancel',
                handler: (e, modal) => {
                    closeModal(modal);
                }
            },
            {
                text: 'Save Changes',
                type: 'primary-btn',
                action: 'save',
                handler: (e, modal) => {
                    // Get updated values
                    const updatedTitle = document.getElementById('edit-task-title').value;
                    const updatedDetails = document.getElementById('edit-task-details').value;
                    const updatedPriority = document.querySelector('input[name="edit-task-priority"]:checked').value;
                    
                    // Update card
                    card.querySelector('.task-card-title').textContent = updatedTitle;
                    card.querySelector('.task-card-details').textContent = updatedDetails;
                    
                    // Update priority
                    const priorityElement = card.querySelector('.task-card-priority');
                    priorityElement.classList.remove('priority-high', 'priority-medium', 'priority-low');
                    priorityElement.classList.add(`priority-${updatedPriority}`);
                    
                    // Close modal
                    closeModal(modal);
                    
                    // Show success notification
                    showNotification('Task updated successfully', 'success');
                }
            }
        ]
    });
    
    openModal(modal);
}

/**
 * Open modal to view task details
 * @param {HTMLElement} card - The task card element
 */
function openTaskDetailsModal(card) {
    // Get task details
    const title = card.querySelector('.task-card-title').textContent;
    const details = card.querySelector('.task-card-details').textContent;
    const date = card.querySelector('.task-card-date').textContent;
    const assignee = card.querySelector('.task-card-assignee').textContent;
    const priority = card.querySelector('.task-card-priority').classList.contains('priority-high') ? 'High' : 
                    card.querySelector('.task-card-priority').classList.contains('priority-medium') ? 'Medium' : 'Low';
    
    const content = `
        <h4>${title}</h4>
        <div class="task-details-priority">
            <span class="priority-indicator priority-${priority.toLowerCase()}"></span>
            <span>${priority} Priority</span>
        </div>
        <p class="task-details-description">${details}</p>
        <div class="task-details-meta">
            <div class="task-details-item">
                <i class="far fa-calendar" aria-hidden="true"></i>
                <span>${date}</span>
            </div>
            <div class="task-details-item">
                <i class="far fa-user" aria-hidden="true"></i>
                <span>${assignee}</span>
            </div>
        </div>
    `;
    
    const modal = createModal({
        id: 'task-details-modal',
        title: 'Task Details',
        content: content,
        buttons: [
            {
                text: 'Close',
                type: 'secondary-btn',
                action: 'close',
                handler: (e, modal) => {
                    closeModal(modal);
                }
            },
            {
                text: 'Edit Task',
                type: 'primary-btn',
                action: 'edit',
                handler: (e, modal) => {
                    closeModal(modal);
                    openEditTaskModal(card);
                }
            }
        ]
    });
    
    openModal(modal);
}

/**
 * Confirm task deletion
 * @param {HTMLElement} card - The task card element
 */
function confirmDeleteTask(card) {
    // Get task title
    const title = card.querySelector('.task-card-title').textContent;
    
    const modal = createModal({
        id: 'confirm-delete-modal',
        title: 'Confirm Deletion',
        content: `
            <p>Are you sure you want to delete the task "${title}"?</p>
            <p class="text-muted">This action cannot be undone.</p>
        `,
        buttons: [
            {
                text: 'Cancel',
                type: 'secondary-btn',
                action: 'cancel',
                handler: (e, modal) => {
                    closeModal(modal);
                }
            },
            {
                text: 'Delete Task',
                type: 'error-btn', // Using error-btn for destructive actions
                action: 'delete',
                handler: (e, modal) => {
                    // Remove the card with animation
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    // Remove the card after animation completes
                    setTimeout(() => {
                        if (card.parentNode) {
                            card.parentNode.removeChild(card);
                            
                            // Update column counts
                            updateColumnCounts();
                        }
                    }, 300);
                    
                    closeModal(modal);
                    showNotification('Task deleted successfully', 'success');
                }
            }
        ]
    });
    
    openModal(modal);
}

/**
 * Open modal to add a new task
 */
function openAddTaskModal() {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    const content = `
        <div class="form-group">
            <label for="new-task-title" class="form-label">Task Title</label>
            <input type="text" id="new-task-title" class="form-input" placeholder="Enter task title">
        </div>
        <div class="form-group">
            <label for="new-task-details" class="form-label">Task Details</label>
            <textarea id="new-task-details" class="form-textarea" placeholder="Enter task details"></textarea>
        </div>
        <div class="form-group">
            <label class="form-label">Priority</label>
            <div class="priority-options">
                <label class="priority-option">
                    <input type="radio" name="new-task-priority" value="low">
                    <span class="priority-indicator priority-low"></span>
                    <span>Low</span>
                </label>
                <label class="priority-option">
                    <input type="radio" name="new-task-priority" value="medium" checked>
                    <span class="priority-indicator priority-medium"></span>
                    <span>Medium</span>
                </label>
                <label class="priority-option">
                    <input type="radio" name="new-task-priority" value="high">
                    <span class="priority-indicator priority-high"></span>
                    <span>High</span>
                </label>
            </div>
        </div>
        <div class="form-group">
            <label for="new-task-date" class="form-label">Due Date</label>
            <input type="date" id="new-task-date" class="form-input" value="${today}">
        </div>
        <div class="form-group">
            <label for="new-task-assignee" class="form-label">Assignee</label>
            <select id="new-task-assignee" class="form-select">
                <option value="">Unassigned</option>
                <option value="js">J.S.</option>
                <option value="al">A.L.</option>
                <option value="me">Me</option>
            </select>
        </div>
        <div class="form-group">
            <label for="new-task-department" class="form-label">Department</label>
            <select id="new-task-department" class="form-select">
                <option value="planting">Planting Team</option>
                <option value="irrigation">Irrigation Team</option>
                <option value="composting">Composting Team</option>
                <option value="harvesting">Harvesting Team</option>
            </select>
        </div>
    `;
    
    const modal = createModal({
        id: 'add-task-modal',
        title: 'Add New Task',
        content: content,
        buttons: [
            {
                text: 'Cancel',
                type: 'secondary-btn',
                action: 'cancel',
                handler: (e, modal) => {
                    closeModal(modal);
                }
            },
            {
                text: 'Create Task',
                type: 'primary-btn',
                action: 'create',
                handler: (e, modal) => {
                    // Get form values
                    const title = document.getElementById('new-task-title').value;
                    const details = document.getElementById('new-task-details').value;
                    const priority = document.querySelector('input[name="new-task-priority"]:checked').value;
                    const date = document.getElementById('new-task-date').value;
                    const assignee = document.getElementById('new-task-assignee').value;
                    
                    // Validate form
                    if (!title || !details) {
                        showNotification('Please fill in all required fields.', 'error');
                        return;
                    }
                    
                    // Format date
                    const formattedDate = date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date';
                    
                    // Format assignee
                    const formattedAssignee = assignee ? assignee : 'Unassigned';
                    
                    // Create new task card
                    const newCard = document.createElement('div');
                    newCard.className = 'task-card';
                    newCard.id = `task-${Date.now()}`;
                    
                    newCard.innerHTML = `
                        <div class="task-card-header">
                            <h4 class="task-card-title">${title}</h4>
                            <span class="task-card-priority priority-${priority}"></span>
                        </div>
                        <p class="task-card-details">${details}</p>
                        <div class="task-card-meta">
                            <span class="task-card-date"><i class="far fa-calendar"></i> ${formattedDate}</span>
                            <span class="task-card-assignee"><i class="far fa-user"></i> ${formattedAssignee}</span>
                        </div>
                    `;
                    
                    // Add to To Do column
                    const toDoColumn = document.querySelector('.task-column:first-child');
                    if (toDoColumn) {
                        toDoColumn.appendChild(newCard);
                        
                        // Initialize drag and drop for new card
                        newCard.setAttribute('draggable', 'true');
                        newCard.setAttribute('aria-grabbed', 'false');
                        newCard.setAttribute('role', 'listitem');
                        
                        newCard.addEventListener('dragstart', function(e) {
                            e.dataTransfer.setData('text/plain', newCard.id);
                            newCard.classList.add('dragging');
                            newCard.setAttribute('aria-grabbed', 'true');
                        });
                        
                        newCard.addEventListener('dragend', function() {
                            newCard.classList.remove('dragging');
                            newCard.setAttribute('aria-grabbed', 'false');
                            updateColumnCounts();
                        });
                        
                        // Add edit and delete functionality
                        addTaskCardActions(newCard);
                        
                        // Update column counts
                        updateColumnCounts();
                    }
                    
                    // Close modal
                    closeModal(modal);
                    
                    // Show success notification
                    showNotification('New task created successfully', 'success');
                }
            }
        ]
    });
    
    openModal(modal);
}

/**
 * Initialize volunteer sign-up buttons
 */
export function initVolunteerSignup() {
    const signupButtons = document.querySelectorAll('.volunteer-card .primary-btn');
    
    signupButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.volunteer-card');
            const role = card.querySelector('.volunteer-role').textContent;
            const details = card.querySelector('.volunteer-details').textContent;
            
            const content = `
                <h4>${role}</h4>
                <p class="volunteer-details-text">${details}</p>
                <div class="form-group">
                    <label for="volunteer-name" class="form-label">Your Name</label>
                    <input type="text" id="volunteer-name" class="form-input" placeholder="Enter your name">
                </div>
                <div class="form-group">
                    <label for="volunteer-email" class="form-label">Email</label>
                    <input type="email" id="volunteer-email" class="form-input" placeholder="Enter your email">
                </div>
                <div class="form-group">
                    <label for="volunteer-phone" class="form-label">Phone (optional)</label>
                    <input type="tel" id="volunteer-phone" class="form-input" placeholder="Enter your phone number">
                </div>
                <div class="form-group">
                    <label for="volunteer-notes" class="form-label">Notes (optional)</label>
                    <textarea id="volunteer-notes" class="form-textarea" placeholder="Any special skills or requirements?"></textarea>
                </div>
            `;
            
            const modal = createModal({
                id: 'volunteer-signup-modal',
                title: 'Volunteer Sign-Up',
                content: content,
                buttons: [
                    {
                        text: 'Cancel',
                        type: 'secondary-btn',
                        action: 'cancel',
                        handler: (e, modal) => {
                            closeModal(modal);
                        }
                    },
                    {
                        text: 'Sign Up',
                        type: 'primary-btn',
                        action: 'signup',
                        handler: (e, modal) => {
                            // Get form values
                            const name = document.getElementById('volunteer-name').value;
                            const email = document.getElementById('volunteer-email').value;
                            
                            // Validate form
                            if (!name || !email) {
                                showNotification('Please fill in all required fields.', 'error');
                                return;
                            }
                            
                            // Update spots available
                            const spotsElement = card.querySelector('.spots-available, .spots-limited');
                            if (spotsElement) {
                                const currentText = spotsElement.textContent;
                                const match = currentText.match(/(\d+)/);
                                
                                if (match && match[1]) {
                                    const currentSpots = parseInt(match[1]);
                                    if (currentSpots > 1) {
                                        const newSpots = currentSpots - 1;
                                        spotsElement.textContent = `${newSpots} spots available`;
                                        
                                        // Change class if spots are limited
                                        if (newSpots <= 3) {
                                            spotsElement.classList.remove('spots-available');
                                            spotsElement.classList.add('spots-limited');
                                        }
                                    } else {
                                        spotsElement.textContent = 'No spots available';
                                        spotsElement.classList.remove('spots-available', 'spots-limited');
                                        spotsElement.classList.add('spots-filled');
                                        
                                        // Disable button
                                        button.disabled = true;
                                        button.textContent = 'Full';
                                    }
                                }
                            }
                            
                            // Close modal
                            closeModal(modal);
                            
                            // Show success notification
                            showNotification(`You've successfully signed up for "${role}"`, 'success');
                        }
                    }
                ]
            });
            
            openModal(modal);
        });
    });
}

/**
 * Initialize department filters
 */
export function initDepartmentFilters() {
    const departmentButtons = document.querySelectorAll('.department-card');
    
    departmentButtons.forEach(button => {
        button.addEventListener('click', function() {
            const departmentName = this.querySelector('.department-name').textContent.trim();
            
            // Toggle active class
            departmentButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter tasks (in a real app, this would filter by department)
            filterTasksByDepartment(departmentName);
        });
    });
}

/**
 * Filter tasks by department
 * @param {string} department - The department name
 */
function filterTasksByDepartment(department) {
    // This is a placeholder for actual filtering logic
    console.log(`Filtering tasks by department: ${department}`);
    
    // Show notification
    showNotification(`Showing tasks for ${department}`, 'info');
}

/**
 * Initialize add task functionality
 */
export function initAddTask() {
    const addTaskButton = document.querySelector('.section-actions .primary-btn');
    
    if (addTaskButton) {
        addTaskButton.addEventListener('click', function() {
            openAddTaskModal();
        });
    }
}

/**
 * Initialize filter buttons
 */
export function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.section-actions .secondary-btn, .volunteer-header .secondary-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Determine if this is for tasks or volunteers
            const isVolunteerFilter = button.closest('.volunteer-header') !== null;
            
            const content = isVolunteerFilter ? `
                <div class="form-group">
                    <label class="form-label">Date Range</label>
                    <div class="date-range-inputs">
                        <input type="date" class="form-input" placeholder="Start Date">
                        <span>to</span>
                        <input type="date" class="form-input" placeholder="End Date">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Department</label>
                    <select class="form-select">
                        <option value="">All Departments</option>
                        <option value="planting">Planting Team</option>
                        <option value="irrigation">Irrigation Team</option>
                        <option value="composting">Composting Team</option>
                        <option value="harvesting">Harvesting Team</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Show Only</label>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="show-available">
                        <label for="show-available" class="form-check-label">Available Spots</label>
                    </div>
                </div>
            ` : `
                <div class="form-group">
                    <label class="form-label">Priority</label>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="priority-high" checked>
                        <label for="priority-high" class="form-check-label">High Priority</label>
                    </div>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="priority-medium" checked>
                        <label for="priority-medium" class="form-check-label">Medium Priority</label>
                    </div>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="priority-low" checked>
                        <label for="priority-low" class="form-check-label">Low Priority</label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Status</label>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="status-todo" checked>
                        <label for="status-todo" class="form-check-label">To Do</label>
                    </div>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="status-inprogress" checked>
                        <label for="status-inprogress" class="form-check-label">In Progress</label>
                    </div>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="status-completed" checked>
                        <label for="status-completed" class="form-check-label">Completed</label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Department</label>
                    <select class="form-select">
                        <option value="">All Departments</option>
                        <option value="planting">Planting Team</option>
                        <option value="irrigation">Irrigation Team</option>
                        <option value="composting">Composting Team</option>
                        <option value="harvesting">Harvesting Team</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Assignee</label>
                    <select class="form-select">
                        <option value="">All Assignees</option>
                        <option value="unassigned">Unassigned</option>
                        <option value="js">J.S.</option>
                        <option value="al">A.L.</option>
                        <option value="me">Me</option>
                    </select>
                </div>
            `;
            
            const modal = createModal({
                id: 'filter-modal',
                title: `Filter ${isVolunteerFilter ? 'Volunteer Opportunities' : 'Tasks'}`,
                content: content,
                buttons: [
                    {
                        text: 'Cancel',
                        type: 'secondary-btn',
                        action: 'cancel',
                        handler: (e, modal) => {
                            closeModal(modal);
                        }
                    },
                    {
                        text: 'Apply Filter',
                        type: 'primary-btn',
                        action: 'apply',
                        handler: (e, modal) => {
                            // In a real app, this would apply the selected filters
                            console.log('Applying filters...');
                            
                            // Close modal
                            closeModal(modal);
                            
                            // Show notification
                            showNotification('Filters applied', 'success');
                        }
                    }
                ]
            });
            
            openModal(modal);
        });
    });
}
