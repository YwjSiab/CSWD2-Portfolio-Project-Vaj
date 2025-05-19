import { displayFilteredProjects } from './project.js';
import { addProjectForm } from './formhandler.js';
import { generateCSRFToken } from './security.js';
import { Project } from './project.js';

let allProjects = [];
window.allProjects = allProjects;
function filterProjects(category) {
  try {
        console.log("Filtering by:", category);
        const filtered = category === 'All'
        ? allProjects
        : allProjects.filter(p =>
        p.category.trim().toLowerCase() === category.trim().toLowerCase()
      );
      displayFilteredProjects(filtered);
  } catch (error) {
      console.error('Error filtering projects:', error);
  }
}

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      console.log(`📍 User location: ${pos.coords.latitude}, ${pos.coords.longitude}`);
    },
    (err) => {
      console.warn("Geolocation error:", err.message);
    }
  );
}

window.filterProjects = filterProjects;
// Sprint A3 Part 1: Ensure DOM is fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', async () => {
    try {
      console.log('🚀 Portfolio Project Loaded');

      generateCSRFToken();
      addProjectForm();
      
      try {
        const stored = localStorage.getItem("projects");
        if (stored) {
          const rawStored = JSON.parse(stored);
          const convertedStored = rawStored.map(p =>
          new Project(p.id, p.title, p.description, p.techStack, p.category, p.image)
          );
          allProjects.splice(0, allProjects.length, ...convertedStored);

          console.log("✅ Loaded projects from localStorage.");
        }
      } catch (error) {
        console.error("⚠️ Error loading projects from localStorage:", error);
      }
    
      // 📦 Sprint B3: Dynamic data loaded from JSON using fetch()
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error('Failed to fetch project data.');
      }      
      
      const raw = await response.json();
      const converted = raw.map(p =>
      new Project(p.id, p.title, p.description, p.techStack, p.category, p.image)
      );
      allProjects.splice(0, allProjects.length, ...converted);
      console.log("Projects:");
      allProjects.forEach((project) => {
        try {
          console.log(`ID: ${project.id}`);
          console.log(`Title: ${project.title}`);
          console.log(`Category: ${project.category}`);
          console.log(`Description: ${project.description}`);
          console.log(`Technologies Used: ${project.techStack.join(", ")}`);
          console.log(`Image: ${project.image}`);
          console.log("--------------------");
        } catch (err) {
          console.error("Error logging project info:", err);
        }
      });
      displayFilteredProjects(allProjects);
      localStorage.setItem("projects", JSON.stringify(allProjects));
  
      const dropdown = document.getElementById('filterDropdown');
      if (dropdown) {
        dropdown.addEventListener('change', (e) => filterProjects(e.target.value));
        filterProjects(dropdown.value);
      } else {
        console.warn('⚠️ Dropdown not found – skipping filterProjects init.');
      }
  

} catch (error) {
    console.error('Error during page initialization:', error);
}
});