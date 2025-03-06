/**
 * TechServ Community Garden Website
 * Garden Map JavaScript file for interactive garden map functionality
 */

import { showNotification } from '../utils/helpers.js';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize garden map functionality
    initGardenMap();
    
    // Initialize section detail functionality
    initSectionDetail();
    
    // Initialize map controls
    initMapControls();
    
    // Initialize task checkboxes
    initTaskCheckboxes();
    
    // Initialize alert actions
    initAlertActions();
});

/**
 * Garden Map Initialization
 */
function initGardenMap() {
    const gardenSections = document.querySelectorAll('.garden-section');
    const sectionDetail = document.querySelector('.section-detail');
    
    // Store the original section detail content for restoration
    const originalSectionDetail = sectionDetail ? sectionDetail.innerHTML : '';
    
    // Section data - in a real application, this would come from a database
    const sectionData = {
        'section-a': {
            title: 'Section A - Leafy Greens Area',
            subtitle: 'North-facing, partial shade',
            plants: 18,
            varieties: 6,
            spaceUtilized: '65%',
            alertCount: 0,
            inventory: [
                { name: 'Lettuce', variety: 'Romaine', quantity: 8, planted: 'Feb 10, 2025', status: 'Healthy', harvest: 'Apr 5, 2025' },
                { name: 'Spinach', variety: 'Bloomsdale', quantity: 6, planted: 'Feb 12, 2025', status: 'Healthy', harvest: 'Apr 10, 2025' },
                { name: 'Kale', variety: 'Lacinato', quantity: 4, planted: 'Feb 8, 2025', status: 'Healthy', harvest: 'Apr 15, 2025' }
            ],
            alerts: [],
            tasks: [
                { id: 'a1', text: 'Thin lettuce seedlings', completed: false, priority: 'medium' },
                { id: 'a2', text: 'Apply organic fertilizer', completed: false, priority: 'low' },
                { id: 'a3', text: 'Check for pests', completed: true, priority: 'high' }
            ]
        },
        'section-b': {
            title: 'Section B - Tomato & Pepper Area',
            subtitle: 'South-facing, full sun exposure',
            plants: 24,
            varieties: 4,
            spaceUtilized: '75%',
            alertCount: 1,
            inventory: [
                { name: 'Tomato', variety: 'Roma', quantity: 12, planted: 'Feb 15, 2025', status: 'Healthy', harvest: 'May 10, 2025' },
                { name: 'Tomato', variety: 'Cherry', quantity: 8, planted: 'Feb 15, 2025', status: 'Needs Water', harvest: 'May 5, 2025' },
                { name: 'Pepper', variety: 'Bell', quantity: 6, planted: 'Feb 20, 2025', status: 'Healthy', harvest: 'May 15, 2025' },
                { name: 'Pepper', variety: 'Jalapeño', quantity: 4, planted: 'Feb 20, 2025', status: 'Healthy', harvest: 'May 20, 2025' }
            ],
            alerts: [
                { 
                    severity: 'medium', 
                    icon: 'tint', 
                    title: 'Watering Needed', 
                    description: 'Cherry tomato plants need watering. Soil moisture is below optimal levels.',
                    detected: 'March 5, 2025',
                    priority: 'Medium'
                }
            ],
            tasks: [
                { id: 'b1', text: 'Water cherry tomato plants', completed: false, priority: 'high' },
                { id: 'b2', text: 'Apply compost to tomato beds', completed: false, priority: 'medium' },
                { id: 'b3', text: 'Install tomato cages', completed: true, priority: 'low' }
            ]
        },
        'section-c': {
            title: 'Section C - Root Vegetables',
            subtitle: 'East-facing, morning sun',
            plants: 32,
            varieties: 5,
            spaceUtilized: '80%',
            alertCount: 0,
            inventory: [
                { name: 'Carrot', variety: 'Nantes', quantity: 15, planted: 'Feb 5, 2025', status: 'Healthy', harvest: 'Apr 20, 2025' },
                { name: 'Radish', variety: 'Cherry Belle', quantity: 10, planted: 'Feb 25, 2025', status: 'Healthy', harvest: 'Mar 25, 2025' },
                { name: 'Beet', variety: 'Detroit Dark Red', quantity: 7, planted: 'Feb 10, 2025', status: 'Healthy', harvest: 'Apr 25, 2025' }
            ],
            alerts: [],
            tasks: [
                { id: 'c1', text: 'Thin carrot seedlings', completed: false, priority: 'medium' },
                { id: 'c2', text: 'Harvest early radishes', completed: false, priority: 'high' }
            ]
        },
        'section-d': {
            title: 'Section D - Herbs Garden',
            subtitle: 'Central location, mixed sun exposure',
            plants: 28,
            varieties: 8,
            spaceUtilized: '60%',
            alertCount: 0,
            inventory: [
                { name: 'Basil', variety: 'Genovese', quantity: 6, planted: 'Feb 18, 2025', status: 'Healthy', harvest: 'Ongoing' },
                { name: 'Cilantro', variety: 'Slow Bolt', quantity: 4, planted: 'Feb 20, 2025', status: 'Healthy', harvest: 'Ongoing' },
                { name: 'Parsley', variety: 'Italian Flat Leaf', quantity: 4, planted: 'Feb 15, 2025', status: 'Healthy', harvest: 'Ongoing' },
                { name: 'Mint', variety: 'Spearmint', quantity: 2, planted: 'Feb 10, 2025', status: 'Healthy', harvest: 'Ongoing' }
            ],
            alerts: [],
            tasks: [
                { id: 'd1', text: 'Harvest basil leaves', completed: false, priority: 'low' },
                { id: 'd2', text: 'Contain mint growth', completed: true, priority: 'medium' }
            ]
        },
        'section-e': {
            title: 'Section E - Squash & Cucumber Area',
            subtitle: 'West-facing, afternoon sun',
            plants: 16,
            varieties: 4,
            spaceUtilized: '85%',
            alertCount: 2,
            inventory: [
                { name: 'Zucchini', variety: 'Black Beauty', quantity: 4, planted: 'Feb 22, 2025', status: 'Pest Issue', harvest: 'May 1, 2025' },
                { name: 'Cucumber', variety: 'Marketmore', quantity: 6, planted: 'Feb 22, 2025', status: 'Pest Issue', harvest: 'May 5, 2025' },
                { name: 'Squash', variety: 'Yellow Crookneck', quantity: 3, planted: 'Feb 24, 2025', status: 'Healthy', harvest: 'May 10, 2025' },
                { name: 'Pumpkin', variety: 'Sugar Pie', quantity: 3, planted: 'Feb 24, 2025', status: 'Healthy', harvest: 'July 15, 2025' }
            ],
            alerts: [
                { 
                    severity: 'high', 
                    icon: 'bug', 
                    title: 'Pest Infestation', 
                    description: 'Squash bugs detected on zucchini plants. Immediate treatment recommended.',
                    detected: 'March 4, 2025',
                    priority: 'High'
                },
                { 
                    severity: 'medium', 
                    icon: 'leaf', 
                    title: 'Powdery Mildew', 
                    description: 'Early signs of powdery mildew on cucumber leaves. Monitor closely.',
                    detected: 'March 5, 2025',
                    priority: 'Medium'
                }
            ],
            tasks: [
                { id: 'e1', text: 'Apply organic pest control', completed: false, priority: 'high' },
                { id: 'e2', text: 'Remove affected leaves', completed: false, priority: 'medium' },
                { id: 'e3', text: 'Apply neem oil spray', completed: false, priority: 'high' }
            ]
        },
        'compost-area': {
            title: 'Compost Area',
            subtitle: 'Organic waste processing station',
            stats: [
                { value: '3', label: 'Bins' },
                { value: '75%', label: 'Capacity' },
                { value: '4', label: 'Weeks Old' },
                { value: '0', label: 'Alerts' }
            ],
            tasks: [
                { id: 'comp1', text: 'Turn compost pile', completed: false, priority: 'medium' },
                { id: 'comp2', text: 'Add brown materials', completed: false, priority: 'low' }
            ]
        },
        'garden-shed': {
            title: 'Garden Shed',
            subtitle: 'Tool storage and work area',
            stats: [
                { value: '24', label: 'Tools' },
                { value: '12', label: 'Supplies' },
                { value: '85%', label: 'Organization' },
                { value: '0', label: 'Alerts' }
            ],
            tasks: [
                { id: 'shed1', text: 'Organize seed packets', completed: false, priority: 'low' },
                { id: 'shed2', text: 'Clean garden tools', completed: true, priority: 'medium' }
            ]
        },
        'water-collection': {
            title: 'Water Collection',
            subtitle: 'Rainwater harvesting system',
            stats: [
                { value: '2', label: 'Barrels' },
                { value: '75%', label: 'Capacity' },
                { value: '120', label: 'Gallons' },
                { value: '0', label: 'Alerts' }
            ],
            tasks: [
                { id: 'water1', text: 'Clean filters', completed: false, priority: 'medium' },
                { id: 'water2', text: 'Check for leaks', completed: true, priority: 'high' }
            ]
        },
        'meeting-area': {
            title: 'Meeting Area',
            subtitle: 'Community gathering space',
            stats: [
                { value: '12', label: 'Seats' },
                { value: '1', label: 'Table' },
                { value: '100%', label: 'Shade' },
                { value: '0', label: 'Alerts' }
            ],
            tasks: [
                { id: 'meet1', text: 'Clean seating area', completed: false, priority: 'low' },
                { id: 'meet2', text: 'Prepare for weekend workshop', completed: false, priority: 'medium' }
            ]
        },
        'entrance': {
            title: 'Garden Entrance',
            subtitle: 'Main access point and information',
            stats: [
                { value: '1', label: 'Gate' },
                { value: '2', label: 'Signs' },
                { value: '4', label: 'Planters' },
                { value: '0', label: 'Alerts' }
            ],
            tasks: [
                { id: 'ent1', text: 'Update information board', completed: false, priority: 'medium' },
                { id: 'ent2', text: 'Water entrance planters', completed: true, priority: 'high' }
            ]
        }
    };
    
    // Add click event listeners to garden sections
    if (gardenSections.length > 0 && sectionDetail) {
        gardenSections.forEach(section => {
            section.addEventListener('click', function() {
                // Remove active class from all sections
                gardenSections.forEach(s => s.classList.remove('active'));
                
                // Add active class to clicked section
                this.classList.add('active');
                
                // Get section ID
                const sectionId = this.classList[1]; // e.g., section-a, section-b, etc.
                
                // Update section detail with data for the clicked section
                updateSectionDetail(sectionId, sectionData[sectionId]);
                
                // Scroll to section detail
                document.querySelector('.section-detail').scrollIntoView({ behavior: 'smooth' });
            });
        });
        
        // Trigger click on Section B to show its details by default
        const sectionB = document.querySelector('.garden-section.section-b');
        if (sectionB) {
            sectionB.click();
        }
    }
    
    // Function to update section detail
    function updateSectionDetail(sectionId, data) {
        if (!data) {
            console.error('No data found for section:', sectionId);
            return;
        }
        
        // Update section title and subtitle
        const detailTitle = document.querySelector('.section-detail-title');
        const detailSubtitle = document.querySelector('.section-detail-subtitle');
        
        if (detailTitle) detailTitle.textContent = data.title;
        if (detailSubtitle) detailSubtitle.textContent = data.subtitle;
        
        // Update section stats
        updateSectionStats(data);
        
        // Update plant inventory
        updatePlantInventory(data);
        
        // Update maintenance alerts
        updateMaintenanceAlerts(data);
        
        // Update section tasks
        updateSectionTasks(data);
    }
    
    // Function to update section stats
    function updateSectionStats(data) {
        const statsContainer = document.querySelector('.section-stats');
        
        if (!statsContainer) return;
        
        // For garden sections (A-E)
        if (data.plants !== undefined) {
            statsContainer.innerHTML = `
                <div class="section-stat">
                    <div class="section-stat-value">${data.plants}</div>
                    <div class="section-stat-label">Plants</div>
                </div>
                <div class="section-stat">
                    <div class="section-stat-value">${data.varieties}</div>
                    <div class="section-stat-label">Varieties</div>
                </div>
                <div class="section-stat">
                    <div class="section-stat-value">${data.spaceUtilized}</div>
                    <div class="section-stat-label">Space Utilized</div>
                </div>
                <div class="section-stat">
                    <div class="section-stat-value">${data.alertCount}</div>
                    <div class="section-stat-label">Alert${data.alertCount !== 1 ? 's' : ''}</div>
                </div>
            `;
        } 
        // For non-planting areas (compost, shed, etc.)
        else if (data.stats) {
            statsContainer.innerHTML = '';
            
            data.stats.forEach(stat => {
                const statElement = document.createElement('div');
                statElement.className = 'section-stat';
                statElement.innerHTML = `
                    <div class="section-stat-value">${stat.value}</div>
                    <div class="section-stat-label">${stat.label}</div>
                `;
                statsContainer.appendChild(statElement);
            });
        }
    }
    
    // Function to update plant inventory
    function updatePlantInventory(data) {
        const inventoryContainer = document.querySelector('.plant-inventory');
        
        if (!inventoryContainer) return;
        
        // If this section has plant inventory
        if (data.inventory && data.inventory.length > 0) {
            inventoryContainer.style.display = 'block';
            
            const tableBody = inventoryContainer.querySelector('tbody');
            
            if (tableBody) {
                tableBody.innerHTML = '';
                
                data.inventory.forEach(plant => {
                    const statusClass = plant.status === 'Healthy' ? 'status-good' : 
                                        plant.status === 'Needs Water' ? 'status-warning' : 'status-alert';
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>
                            <div class="plant-name">
                                <div class="plant-icon"><i class="fas fa-seedling"></i></div>
                                <span>${plant.name}</span>
                            </div>
                        </td>
                        <td>${plant.variety}</td>
                        <td>${plant.quantity}</td>
                        <td>${plant.planted}</td>
                        <td>
                            <div class="plant-status">
                                <span class="status-indicator ${statusClass}"></span>
                                <span>${plant.status}</span>
                            </div>
                        </td>
                        <td>${plant.harvest}</td>
                    `;
                    
                    tableBody.appendChild(row);
                });
            }
        } else {
            // Hide plant inventory section for non-planting areas
            inventoryContainer.style.display = 'none';
        }
    }
    
    // Function to update maintenance alerts
    function updateMaintenanceAlerts(data) {
        const alertsContainer = document.querySelector('.maintenance-alerts');
        
        if (!alertsContainer) return;
        
        const alertsList = alertsContainer.querySelector('.alert-list');
        
        if (alertsList) {
            // If this section has alerts
            if (data.alerts && data.alerts.length > 0) {
                alertsContainer.style.display = 'block';
                alertsList.innerHTML = '';
                
                data.alerts.forEach(alert => {
                    const alertItem = document.createElement('li');
                    alertItem.className = `alert-item ${alert.severity}`;
                    alertItem.innerHTML = `
                        <div class="alert-icon">
                            <i class="fas fa-${alert.icon}"></i>
                        </div>
                        <div class="alert-content">
                            <div class="alert-title">${alert.title}</div>
                            <div class="alert-description">${alert.description}</div>
                            <div class="alert-meta">
                                <span><i class="far fa-calendar"></i> Detected: ${alert.detected}</span>
                                <span><i class="far fa-clock"></i> Priority: ${alert.priority}</span>
                            </div>
                        </div>
                        <div class="alert-actions">
                            <button class="btn small-btn primary-btn">Resolve</button>
                            <button class="btn small-btn secondary-btn">Assign</button>
                        </div>
                    `;
                    
                    alertsList.appendChild(alertItem);
                });
            } else {
                // If no alerts, show a message
                alertsContainer.style.display = 'block';
                alertsList.innerHTML = `
                    <li class="text-center" style="padding: var(--spacing-md); color: var(--neutral-medium);">
                        <i class="fas fa-check-circle" style="color: var(--success-color); margin-right: 8px;"></i>
                        No maintenance alerts for this section
                    </li>
                `;
            }
        }
    }
    
    // Function to update section tasks
    function updateSectionTasks(data) {
        const tasksContainer = document.querySelector('.section-tasks');
        
        if (!tasksContainer) return;
        
        const tasksList = tasksContainer.querySelector('.task-list');
        
        if (tasksList) {
            // If this section has tasks
            if (data.tasks && data.tasks.length > 0) {
                tasksContainer.style.display = 'block';
                tasksList.innerHTML = '';
                
                data.tasks.forEach(task => {
                    const taskItem = document.createElement('li');
                    taskItem.className = `task-item${task.completed ? ' completed' : ''}`;
                    
                    const priorityClass = task.priority === 'high' ? 'priority-high' : 
                                         task.priority === 'medium' ? 'priority-medium' : 'priority-low';
                    
                    taskItem.innerHTML = `
                        <input type="checkbox" class="task-checkbox" id="${task.id}" ${task.completed ? 'checked' : ''}>
                        <label for="${task.id}" class="task-label">${task.text}</label>
                        <span class="task-priority ${priorityClass}"></span>
                    `;
                    
                    tasksList.appendChild(taskItem);
                });
                
                // Reinitialize task checkboxes
                initTaskCheckboxes();
            } else {
                // If no tasks, show a message
                tasksContainer.style.display = 'block';
                tasksList.innerHTML = `
                    <li class="text-center" style="padding: var(--spacing-md); color: var(--neutral-medium);">
                        <i class="fas fa-clipboard-check" style="color: var(--success-color); margin-right: 8px;"></i>
                        No tasks for this section
                    </li>
                `;
            }
        }
    }
}

/**
 * Section Detail Initialization
 */
function initSectionDetail() {
    // Add event listeners for section detail actions
    const editButton = document.querySelector('.section-detail-actions .secondary-btn');
    const addTaskButton = document.querySelector('.section-detail-actions .primary-btn');
    
    if (editButton) {
        editButton.addEventListener('click', function() {
            showNotification('Edit functionality would open a form to edit section details', 'info');
        });
    }
    
    if (addTaskButton) {
        addTaskButton.addEventListener('click', function() {
            showNotification('Add Task functionality would open a form to add a new task', 'info');
        });
    }
    
    // Plant inventory actions
    const filterButton = document.querySelector('.plant-inventory-actions .btn:first-child');
    const exportButton = document.querySelector('.plant-inventory-actions .btn:last-child');
    
    if (filterButton) {
        filterButton.addEventListener('click', function() {
            showNotification('Filter functionality would allow filtering the plant inventory', 'info');
        });
    }
    
    if (exportButton) {
        exportButton.addEventListener('click', function() {
            showNotification('Export functionality would download the plant inventory as CSV', 'info');
        });
    }
    
    // View all tasks button
    const viewAllTasksButton = document.querySelector('.section-tasks-header .btn');
    
    if (viewAllTasksButton) {
        viewAllTasksButton.addEventListener('click', function() {
            showNotification('View All would navigate to the Tasks page filtered for this section', 'info');
        });
    }
}

/**
 * Map Controls Initialization
 */
function initMapControls() {
    // Zoom controls
    const zoomInButton = document.querySelector('.map-zoom-controls .btn:nth-child(1)');
    const zoomOutButton = document.querySelector('.map-zoom-controls .btn:nth-child(2)');
    const expandButton = document.querySelector('.map-zoom-controls .btn:nth-child(3)');
    
    // Current zoom level
    let zoomLevel = 1;
    const minZoom = 0.5;
    const maxZoom = 2;
    const zoomStep = 0.1;
    
    // Get the garden grid
    const gardenGrid = document.querySelector('.garden-grid');
    
    if (zoomInButton && gardenGrid) {
        zoomInButton.addEventListener('click', function() {
            if (zoomLevel < maxZoom) {
                zoomLevel += zoomStep;
                updateZoom();
            }
        });
    }
    
    if (zoomOutButton && gardenGrid) {
        zoomOutButton.addEventListener('click', function() {
            if (zoomLevel > minZoom) {
                zoomLevel -= zoomStep;
                updateZoom();
            }
        });
    }
    
    if (expandButton && gardenGrid) {
        expandButton.addEventListener('click', function() {
            // Toggle fullscreen mode for the map
            const mapWrapper = document.querySelector('.garden-map-wrapper');
            
            if (mapWrapper) {
                mapWrapper.classList.toggle('fullscreen');
                
                if (mapWrapper.classList.contains('fullscreen')) {
                    expandButton.innerHTML = '<i class="fas fa-compress"></i>';
                } else {
                    expandButton.innerHTML = '<i class="fas fa-expand"></i>';
                }
            }
        });
    }
    
    // Function to update zoom
    function updateZoom() {
        if (gardenGrid) {
            gardenGrid.style.transform = `scale(${zoomLevel})`;
            gardenGrid.style.transformOrigin = 'center';
        }
    }
    
    // Map filter
    const mapFilter = document.querySelector('.map-filter select');
    
    if (mapFilter) {
        mapFilter.addEventListener('change', function() {
            const filterValue = this.value;
            const gardenSections = document.querySelectorAll('.garden-section');
            
            // Reset all sections
            gardenSections.forEach(section => {
                section.style.opacity = '1';
            });
            
            // Apply filter
            if (filterValue === 'plants') {
                // Show only planting sections (A-E)
                gardenSections.forEach(section => {
                    if (!section.classList.contains('section-a') && 
                        !section.classList.contains('section-b') && 
                        !section.classList.contains('section-c') && 
                        !section.classList.contains('section-d') && 
                        !section.classList.contains('section-e')) {
                        section.style.opacity = '0.3';
                    }
                });
            } else if (filterValue === 'irrigation') {
                // Show only water-related sections
                gardenSections.forEach(section => {
                    if (!section.classList.contains('water-collection')) {
                        section.style.opacity = '0.3';
                    }
                });
            } else if (filterValue === 'alerts') {
                // Show only sections with alerts
                gardenSections.forEach(section => {
                    if (!section.querySelector('.section-alert')) {
                        section.style.opacity = '0.3';
                    }
                });
            }
            // 'all' will show everything (already reset above)
        });
    }
    
    // Print and Share buttons
    const printButton = document.querySelector('.garden-map-actions .btn:first-child');
    const shareButton = document.querySelector('.garden-map-actions .btn:last-child');
    
    if (printButton) {
        printButton.addEventListener('click', function() {
            window.print();
        });
    }
    
    if (shareButton) {
        shareButton.addEventListener('click', function() {
            // In a real implementation, this would open a share dialog
            showNotification('Share functionality would open options to share the garden map', 'info');
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
    const taskItem = this.closest('.task-item');
    
    if (taskItem) {
        if (this.checked) {
            taskItem.classList.add('completed');
            showNotification('Task marked as completed', 'success');
        } else {
            taskItem.classList.remove('completed');
            showNotification('Task marked as incomplete', 'info');
        }
    }
}

/**
 * Alert Actions Initialization
 */
function initAlertActions() {
    // Add event delegation for alert actions
    const alertList = document.querySelector('.alert-list');
    
    if (alertList) {
        alertList.addEventListener('click', function(event) {
            const resolveButton = event.target.closest('.alert-actions .primary-btn');
            const assignButton = event.target.closest('.alert-actions .secondary-btn');
            
            if (resolveButton) {
                const alertItem = resolveButton.closest('.alert-item');
                if (alertItem) {
                    // In a real implementation, this would mark the alert as resolved in the database
                    alertItem.style.opacity = '0.5';
                    alertItem.style.pointerEvents = 'none';
                    showNotification('Alert marked as resolved', 'success');
                }
            } else if (assignButton) {
                // In a real implementation, this would open a dialog to assign the alert to someone
                showNotification('Assign functionality would open a dialog to assign this alert', 'info');
            }
        });
    }
}

// Export functions for use in other modules
export {
    initGardenMap,
    initSectionDetail,
    initMapControls,
    initTaskCheckboxes,
    initAlertActions,
    handleTaskCheckboxChange
};
