// Basic test to verify module structure
import { initModals, openModal, closeModal, createModal } from './src/scripts/utils/modal.js';
import * as tasksFunctions from './src/scripts/features/tasks.js';

console.log('Modal utils imported successfully:', { initModals, openModal, closeModal, createModal });
console.log('Tasks functions imported successfully:', tasksFunctions);

// List all exported functions from tasks.js
console.log('Tasks exports:');
Object.keys(tasksFunctions).forEach(key => {
    console.log(`- ${key}`);
});
