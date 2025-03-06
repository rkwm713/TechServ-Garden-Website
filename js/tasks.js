/**
 * TechServ Community Garden Website
 * Tasks Page JavaScript
 * Handles task management, volunteer sign-ups, and department progress tracking
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize task board functionality
    initTaskBoard();
    
    // Initialize task checkboxes in sidebar
    initTaskCheckboxes();
    
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
function initTaskBoard() {
    const taskColumns = document.querySelectorAll('.task-column');
    const taskCards = document.querySelectorAll('.task-card');
    
    // Update column counts
    updateColumnCounts();
    
    // Make task cards draggable
    taskCards.forEach(card => {
        card.setAttribute('draggable', 'true');
        
        // Add drag start event
        card.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', card.id || 'task-card');
            card.classList.add('dragging');
            
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
            updateColumnCounts();
        });
        
        // Add edit functionality to task cards
        addTaskCardActions(card);
    });
    
    // Make columns drop targets
    taskColumns.forEach(column => {
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
        }
    });
}

/**
 * Add edit and delete actions to task cards
 */
function addTaskCardActions(card) {
    // Create action buttons container if it doesn't exist
    if (!card.querySelector('.task-card-actions')) {
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'task-card-actions';
        
        // Edit button
        const editButton = document.createElement('button');
        editButton.className = 'task-action-btn edit-btn';
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.setAttribute('title', 'Edit Task');
        editButton.addEventListener('click', function(e) {
            e.stopPropagation();
            openEditTaskModal(card);
        });
        
        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'task-action-btn delete-btn';
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.setAttribute('title', 'Delete Task');
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
}

/**
 * Open modal to edit a task
 */
function openEditTaskModal(card) {
    // Get task details
    const title = card.querySelector('.task-card-title').textContent;
    const details = card.querySelector('.task-card-details').textContent;
    const priority = card.querySelector('.task-card-priority').classList.contains('priority-high') ? 'high' : 
                    card.querySelector('.task-card-priority').classList.contains('priority-medium') ? 'medium' : 'low';
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'edit-task-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Edit Task</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
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
            </div>
            <div class="modal-footer">
                <button class="btn secondary-btn modal-cancel">Cancel</button>
                <button class="btn primary-btn" id="save-edit-task">Save Changes</button>
            </div>
        </div>
    `;
    
    // Add modal to document
    document.body.appendChild(modal);
    
    // Initialize modal
    initModals();
    
    // Open the modal
    openModal(modal);
    
    // Add save functionality
    const saveButton = document.getElementById('save-edit-task');
    saveButton.addEventListener('click', function() {
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
    });
}

/**
 * Open modal to view task details
 */
function openTaskDetailsModal(card) {
    // Get task details
    const title = card.querySelector('.task-card-title').textContent;
    const details = card.querySelector('.task-card-details').textContent;
    const date = card.querySelector('.task-card-date').textContent;
    const assignee = card.querySelector('.task-card-assignee').textContent;
    const priority = card.querySelector('.task-card-priority').classList.contains('priority-high') ? 'High' : 
                    card.querySelector('.task-card-priority').classList.contains('priority-medium') ? 'Medium' : 'Low';
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'task-details-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Task Details</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <h4>${title}</h4>
                <div class="task-details-priority">
                    <span class="priority-indicator priority-${priority.toLowerCase()}"></span>
                    <span>${priority} Priority</span>
                </div>
                <p class="task-details-description">${details}</p>
                <div class="task-details-meta">
                    <div class="task-details-item">
                        <i class="far fa-calendar"></i>
                        <span>${date}</span>
                    </div>
                    <div class="task-details-item">
                        <i class="far fa-user"></i>
                        <span>${assignee}</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn secondary-btn modal-cancel">Close</button>
                <button class="btn primary-btn" id="edit-task-from-details">Edit Task</button>
            </div>
        </div>
    `;
    
    // Add modal to document
    document.body.appendChild(modal);
    
    // Initialize modal
    initModals();
    
    // Open the modal
    openModal(modal);
    
    // Add edit button functionality
    const editButton = document.getElementById('edit-task-from-details');
    editButton.addEventListener('click', function() {
        // Close details modal
        closeModal(modal);
        
        // Open edit modal
        openEditTaskModal(card);
    });
}

/**
 * Confirm task deletion
 */
function confirmDeleteTask(card) {
    // Get task title
    const title = card.querySelector('.task-card-title').textContent;
    
    // Create confirmation modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'confirm-delete-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Confirm Deletion</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to delete the task "${title}"?</p>
                <p class="text-muted">This action cannot be undone.</p>
            </div>
            <div class="modal-footer">
                <button class="btn secondary-btn modal-cancel">Cancel</button>
                <button class="btn primary-btn delete-confirm-btn">Delete Task</button>
            </div>
        </div>
    `;
    
    // Add modal to document
    document.body.appendChild(modal);
    
    // Initialize modal
    initModals();
    
    // Open the modal
    openModal(modal);
    
    // Add delete confirmation functionality
    const deleteButton = modal.querySelector('.delete-confirm-btn');
    deleteButton.addEventListener('click', function() {
        // Remove the card
        card.parentNode.removeChild(card);
        
        // Update column counts
        updateColumnCounts();
        
        // Close modal
        closeModal(modal);
        
        // Show success notification
        showNotification('Task deleted successfully', 'success');
    });
}

/**
 * Initialize task checkboxes in sidebar
 */
function initTaskCheckboxes() {
    const taskCheckboxes = document.querySelectorAll('.task-checkbox');
    
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const taskItem = this.closest('.task-item');
            
            if (this.checked) {
                taskItem.classList.add('completed');
                
                // Find corresponding task in main board and update if exists
                const taskTitle = taskItem.querySelector('.task-label').textContent;
                updateMainBoardTask(taskTitle, 'Completed');
            } else {
                taskItem.classList.remove('completed');
                
                // Find corresponding task in main board and update if exists
                const taskTitle = taskItem.querySelector('.task-label').textContent;
                updateMainBoardTask(taskTitle, 'To Do');
            }
        });
    });
}

/**
 * Update task in main board based on sidebar checkbox
 */
function updateMainBoardTask(taskTitle, newStatus) {
    // Find task card with matching title
    const taskCards = document.querySelectorAll('.task-card');
    let matchingCard = null;
    
    taskCards.forEach(card => {
        const cardTitle = card.querySelector('.task-card-title').textContent;
        if (cardTitle === taskTitle) {
            matchingCard = card;
        }
    });
    
    if (matchingCard) {
        // Find target column
        const columns = document.querySelectorAll('.task-column');
        let targetColumn = null;
        
        columns.forEach(column => {
            const columnTitle = column.querySelector('.column-title').textContent;
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
 * Initialize volunteer sign-up buttons
 */
function initVolunteerSignup() {
    const signupButtons = document.querySelectorAll('.volunteer-card .primary-btn');
    
    signupButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.volunteer-card');
            const role = card.querySelector('.volunteer-role').textContent;
            const details = card.querySelector('.volunteer-details').textContent;
            
            // Create signup modal
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.id = 'volunteer-signup-modal';
            
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">Volunteer Sign-Up</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
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
                    </div>
                    <div class="modal-footer">
                        <button class="btn secondary-btn modal-cancel">Cancel</button>
                        <button class="btn primary-btn" id="confirm-volunteer-signup">Sign Up</button>
                    </div>
                </div>
            `;
            
            // Add modal to document
            document.body.appendChild(modal);
            
            // Initialize modal
            initModals();
            
            // Open the modal
            openModal(modal);
            
            // Add signup confirmation functionality
            const confirmButton = document.getElementById('confirm-volunteer-signup');
            confirmButton.addEventListener('click', function() {
                // Get form values
                const name = document.getElementById('volunteer-name').value;
                const email = document.getElementById('volunteer-email').value;
                
                // Validate form
                if (!name || !email) {
                    alert('Please fill in all required fields.');
                    return;
                }
                
                // Update spots available
                const spotsElement = card.querySelector('.spots-available, .spots-limited');
                if (spotsElement) {
                    const currentSpots = parseInt(spotsElement.textContent);
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
                
                // Close modal
                closeModal(modal);
                
                // Show success notification
                showNotification(`You've successfully signed up for "${role}"`, 'success');
            });
        });
    });
}

/**
 * Initialize department filters
 */
function initDepartmentFilters() {
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
 */
function filterTasksByDepartment(department) {
    // In a real app, this would filter tasks by department
    console.log(`Filtering tasks by department: ${department}`);
    
    // Show notification
    showNotification(`Showing tasks for ${department}`, 'info');
}

/**
 * Initialize add task functionality
 */
function initAddTask() {
    const addTaskButton = document.querySelector('.section-actions .primary-btn');
    
    if (addTaskButton) {
        addTaskButton.addEventListener('click', function() {
            // Create add task modal
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.id = 'add-task-modal';
            
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">Add New Task</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
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
                            <input type="date" id="new-task-date" class="form-input">
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
                    </div>
                    <div class="modal-footer">
                        <button class="btn secondary-btn modal-cancel">Cancel</button>
                        <button class="btn primary-btn" id="create-new-task">Create Task</button>
                    </div>
                </div>
            `;
            
            // Add modal to document
            document.body.appendChild(modal);
            
            // Initialize modal
            initModals();
            
            // Open the modal
            openModal(modal);
            
            // Add create task functionality
            const createButton = document.getElementById('create-new-task');
            createButton.addEventListener('click', function() {
                // Get form values
                const title = document.getElementById('new-task-title').value;
                const details = document.getElementById('new-task-details').value;
                const priority = document.querySelector('input[name="new-task-priority"]:checked').value;
                const date = document.getElementById('new-task-date').value;
                const assignee = document.getElementById('new-task-assignee').value;
                
                // Validate form
                if (!title || !details) {
                    alert('Please fill in all required fields.');
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
                toDoColumn.appendChild(newCard);
                
                // Initialize drag and drop for new card
                newCard.setAttribute('draggable', 'true');
                
                newCard.addEventListener('dragstart', function(e) {
                    e.dataTransfer.setData('text/plain', newCard.id);
                    newCard.classList.add('dragging');
                });
                
                newCard.addEventListener('dragend', function() {
                    newCard.classList.remove('dragging');
                    updateColumnCounts();
                });
                
                // Add edit and delete functionality
                addTaskCardActions(newCard);
                
                // Update column counts
                updateColumnCounts();
                
                // Close modal
                closeModal(modal);
                
                // Show success notification
                showNotification('New task created successfully', 'success');
            });
        });
    }
}

/**
 * Initialize filter buttons
 */
function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.section-actions .secondary-btn, .volunteer-header .secondary-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Create filter modal
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.id = 'filter-modal';
            
            // Determine if this is for tasks or volunteers
            const isVolunteerFilter = button.closest('.volunteer-header') !== null;
            
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">Filter ${isVolunteerFilter ? 'Volunteer Opportunities' : 'Tasks'}</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        ${isVolunteerFilter ? `
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
                        `}
                    </div>
                    <div class="modal-footer">
                        <button class="btn secondary-btn modal-cancel">Cancel</button>
                        <button class="btn primary-btn" id="apply-filter">Apply Filter</button>
                    </div>
                </div>
            `;
            
            // Add modal to document
            document.body.appendChild(modal);
            
            // Initialize modal
            initModals();
            
            // Open the modal
            openModal(modal);
            
            // Add filter functionality
            const applyButton = document.getElementById('apply-filter');
            if (applyButton) {
                applyButton.addEventListener('click', function() {
                    // In a real app, this would apply the selected filters
                    console.log('Applying filters...');
                    
                    // Close modal
                    closeModal(modal);
                    
                    // Show notification
                    showNotification('Filters applied', 'success');
                });
            }
        });
    });
}
