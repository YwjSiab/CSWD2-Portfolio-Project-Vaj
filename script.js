import { displayFilteredProjects, projects } from './project.js';
import { addProjectForm } from './formhandler.js';
import { generateCSRFToken } from './security.js';

function filterProjects(category) {
  const filtered = projects.filter(p => category === 'All' || p.category === category);
  displayFilteredProjects(filtered);
}
// Sprint A3 Part 1: Ensure DOM is fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('🚀 Portfolio Project Loaded');

generateCSRFToken();

// Call the function to render the form
addProjectForm();

displayFilteredProjects(projects);

const dropdown = document.getElementById('filterDropdown');
  if (dropdown) {
    dropdown.addEventListener('change', (e) => filterProjects(e.target.value));
  }
  
} catch (error) {
    console.error('Error during page initialization:', error);
}
});