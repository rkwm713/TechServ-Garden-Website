/**
 * TechServ Community Garden Website
 * Tasks JavaScript file for task management functionality
 */

import { showNotification } from '../utils/helpers.js';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize task filters
    initTaskFilters();
    
    // Initialize task checkboxes
    initTaskCheckboxes();
    
    // Initialize task actions
    initTaskActions();
});

/**
 * Task Filters Initialization
 */
function initTaskFilters() {
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
            });
        });
    }
}

/**
 * Task Checkboxes Initialization
 */
function initTaskCheckboxes() {
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
 */
function handleTaskCheckboxChange() {
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
            
            showNotification('Task marked as completed', 'success');
        } else {
            taskItem.classList.remove('completed');
            
            // If it's a task card, update status
            const statusBadge = taskItem.querySelector('.task-status');
            if (statusBadge) {
                statusBadge.textContent = 'Open';
                statusBadge.className = 'task-status status-open';
            }
            
            showNotification('Task marked as incomplete', 'info');
        }
    }
}

/**
 * Task Actions Initialization
 */
function initTaskActions() {
    // Add task button
    const addTaskButton = document.querySelector('.add-task-btn');
    
    if (addTaskButton) {
        addTaskButton.addEventListener('click', function() {
            showNotification('Add Task functionality would open a form to add a new task', 'info');
        });
    }
    
    // Task card action buttons using event delegation
    const taskContainer = document.querySelector('.tasks-container');
    
    if (taskContainer) {
        taskContainer.addEventListener('click', function(event) {
            // Edit button
            const editButton = event.target.closest('.task-edit-btn');
            if (editButton) {
                event.preventDefault();
                showNotification('Edit Task functionality would open a form to edit the task', 'info');
            }
            
            // Delete button
            const deleteButton = event.target.closest('.task-delete-btn');
            if (deleteButton) {
                event.preventDefault();
                const taskCard = deleteButton.closest('.task-card');
                
                if (taskCard) {
                    // In a real app, this would call an API to delete the task
                    // For demo, just hide the task card
                    taskCard.style.opacity = '0';
                    setTimeout(() => {
                        taskCard.style.display = 'none';
                    }, 300);
                    
                    showNotification('Task has been deleted', 'success');
                }
            }
            
            // Assign button
            const assignButton = event.target.closest('.task-assign-btn');
            if (assignButton) {
                event.preventDefault();
                showNotification('Assign Task functionality would open a dialog to assign the task', 'info');
            }
        });
    }
    
    // Task sort dropdown
    const sortDropdown = document.querySelector('.task-sort-select');
    
    if (sortDropdown) {
        sortDropdown.addEventListener('change', function() {
            const sortValue = this.value;
            
            showNotification(`Tasks would be sorted by ${sortValue}`, 'info');
            
            // In a real app, this would sort the tasks based on the selected value
            // For demo, just show a notification
        });
    }
}

// Export functions for use in other modules
export {
    initTaskFilters,
    initTaskCheckboxes,
    initTaskActions,
    handleTaskCheckboxChange
};
