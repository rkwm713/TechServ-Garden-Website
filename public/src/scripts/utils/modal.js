/**
 * TechServ Community Garden Website
 * Modal Utility Functions
 * Handles creation, opening, closing, and management of modals
 */

/**
 * Initialize all modals
 */
export function initModals() {
    const modalCloseButtons = document.querySelectorAll('.modal-close, .modal-cancel');
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modal when clicking outside content
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.active');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });
}

/**
 * Open a modal
 * @param {HTMLElement} modal - The modal element to open
 */
export function openModal(modal) {
    // Add accessibility attributes
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    
    // Get first focusable element
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length > 0) {
        // Store previously focused element to restore later
        modal.previouslyFocused = document.activeElement;
        
        // Focus the first element after a short delay (for animation)
        setTimeout(() => {
            focusableElements[0].focus();
        }, 50);
    }
    
    modal.classList.add('active');
    document.body.classList.add('modal-open');
}

/**
 * Close a modal
 * @param {HTMLElement} modal - The modal element to close
 */
export function closeModal(modal) {
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
    
    // Restore focus to previously focused element
    if (modal.previouslyFocused) {
        modal.previouslyFocused.focus();
    }
    
    // Remove from DOM after animation if it's a dynamically created modal
    setTimeout(() => {
        if (modal.parentNode && !modal.classList.contains('active') && !modal.classList.contains('static-modal')) {
            modal.parentNode.removeChild(modal);
        }
    }, 300);
}

/**
 * Create a modal with the given content and options
 * @param {Object} options - Modal options
 * @param {string} options.id - Modal ID
 * @param {string} options.title - Modal title
 * @param {string|HTMLElement} options.content - Modal content (HTML string or element)
 * @param {Array} options.buttons - Array of button configs {text, type, handler}
 * @param {string} options.size - Modal size (small, medium, large)
 * @returns {HTMLElement} The created modal element
 */
export function createModal(options) {
    const { id, title, content, buttons = [], size = 'medium' } = options;
    
    const modal = document.createElement('div');
    modal.className = `modal ${size}`;
    if (id) modal.id = id;
    
    // Create modal content
    let buttonsHtml = '';
    if (buttons.length > 0) {
        buttonsHtml = buttons.map(btn => {
            return `<button class="btn ${btn.type || 'secondary-btn'}" data-action="${btn.action || ''}">${btn.text}</button>`;
        }).join('');
    }
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">${title}</h3>
                <button class="modal-close" aria-label="Close modal">&times;</button>
            </div>
            <div class="modal-body">
                ${typeof content === 'string' ? content : ''}
            </div>
            ${buttons.length > 0 ? `<div class="modal-footer">${buttonsHtml}</div>` : ''}
        </div>
    `;
    
    // If content is an element, append it to the body
    if (typeof content !== 'string') {
        modal.querySelector('.modal-body').appendChild(content);
    }
    
    // Add to document
    document.body.appendChild(modal);
    
    // Add button event handlers
    if (buttons.length > 0) {
        buttons.forEach(btn => {
            if (btn.handler && btn.action) {
                const buttonElement = modal.querySelector(`button[data-action="${btn.action}"]`);
                if (buttonElement) {
                    buttonElement.addEventListener('click', (e) => {
                        btn.handler(e, modal);
                    });
                }
            }
        });
    }
    
    // Initialize this modal
    const closeButtons = modal.querySelectorAll('.modal-close, .modal-cancel');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => closeModal(modal));
    });
    
    return modal;
}
