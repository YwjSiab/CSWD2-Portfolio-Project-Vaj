class Project {
    #viewCount = 0; // private field
  
    constructor(id, title, description, techStack = [], category = "Uncategorized", image = "default-placeholder.jpg") {
        if (!id || !title || !description || !Array.isArray(techStack)) {
          throw new Error("Invalid project data: All fields must be provided and techStack must be an array.");
        }
      
        this.id = id;
        this.title = title;
        this.description = description;
        this.techStack = techStack;
        this.category = category;
        this.image = image || "images/default-placeholder.jpg";
    }

      incrementViews() {
        this.#viewCount++;
      }
      
      getViews() {
        return this.#viewCount;
      }      
  
    usesTechnology(tech) {
      if (!tech || typeof tech !== "string") {
        console.warn("⚠️ Invalid technology input.");
        return false;
      }
      return this.techStack.includes(tech);
    }
  
    static createViewTracker() {
      let views = 0;
      return {
        increment: () => ++views,
        getViews: () => views
      };
    }
  }

const projects = [
    new Project(
      1,
      "Tri and Succeed Sports",
      "Worked on website layout and text styling. Adjusted fonts, images, and positioning.",
      ["HTML", "CSS"],
      "Web Development",
      "tss_logo.png"
    ),
    new Project(
      2,
      "Trusted Friends DayCare",
      "Styled the website for different screen sizes (responsive design).",
      ["HTML", "CSS", "Responsive Design"],
      "Responsive Design",
      "tf_logo.png"
    ),
    new Project(
      3,
      "Slate & Pencil Tutoring",
      "Utilized grid layouts for better positioning and website organization.",
      ["HTML", "CSS", "Grid Layout"],
      "UI/UX Design",
      "slate-and-pencil_logo.png"
    )
  ];
  
  
  // Log projects array to console
  console.log("Projects:");
  projects.forEach((project) => {
    console.log(`ID: ${project.id}`);
    console.log(`Title: ${project.title}`);
    console.log(`Category: ${project.category}`);
    console.log(`Description: ${project.description}`);
    console.log(`Technologies Used: ${project.techStack.join(", ")}`);
    console.log(`Image: ${project.image}`);
    console.log("--------------------");
  });
  
  
  // Part 3: Testing and Validation
  console.log("JavaScript functionality is running as expected. Check the console for output.");

// Sprint A3 Part 2: Dynamic Project Display
export function displayProjects(projectArray) {
    const container = document.getElementById("projectList");
  
    if (!container) {
      console.warn("Project container not found.");
      return;
    }
  
    function escapeHTML(str) {
        return str
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
      }
        
    projectArray.forEach((project) => {
      try {
        if (!(project instanceof Project)) {
          throw new Error("Invalid project object.");
        }
  
        const card = document.createElement("div");
        card.classList.add("project-card");
  
        const title = document.createElement("h3");
        title.textContent = project.title;

        const image = document.createElement("img");
        image.src = project.image;
        image.alt = `${project.title} image`;
        image.className = "project-image";

  
        const description = document.createElement("p");
        description.textContent = project.description;
  
        const tech = document.createElement("p");
        tech.innerHTML = `<strong>Technologies:</strong> ${project.techStack.map(t => escapeHTML(t)).join(", ")}`;
  
        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(tech);
        container.appendChild(card);
      } catch (error) {
        console.error("Error displaying project:", error.message);
      }
    });
  }


// ✅ Function to load project details dynamically
// This function retrieves and displays the details of a selected project
window.loadProjectDetails = (projectId) => {
  try {
      console.log(`Attempting to load details for project ID: ${projectId}`);

      const project = projects.find(p => p.id === projectId);
      if (!project) {
          console.error(`Error: Project with ID ${projectId} not found`);
          const detailsContainer = document.getElementById('projectDetails');
          if (detailsContainer) {
            detailsContainer.textContent = 'Project not found. Please select a valid project.';
            detailsContainer.classList.add('error-message');
          }
          return;
        }

        // ✅ Track and log project views
        if (typeof project.incrementViews === "function") {
            project.incrementViews();
            console.log(`👁️ Views for "${project.title}": ${project.getViews()}`);
        }
  


        const detailsContainer = document.getElementById('projectDetails');
        if (!detailsContainer) {
          console.error('Error: Project details container not found');
          return;
        }

        console.log(`Found project: ${project.title}`);

        // Clear previous project details before updating
        while (detailsContainer.firstChild) {
          detailsContainer.removeChild(detailsContainer.firstChild);
        }

        // Dynamically create and append elements for better security and structure
        const titleElement = document.createElement('h2');
        titleElement.innerText = project.title;
        detailsContainer.appendChild(titleElement);

      const categoryElement = document.createElement('p');
      categoryElement.innerText = `Category: ${project.category}`;
      detailsContainer.appendChild(categoryElement);

      const imageElement = document.createElement('img');
      imageElement.src = project.image;
      imageElement.alt = project.title;
      imageElement.className = 'project-detail-image';
      detailsContainer.appendChild(imageElement);

      const descriptionElement = document.createElement('p');
      descriptionElement.innerText = project.description;
      detailsContainer.appendChild(descriptionElement);

      const techElement = document.createElement('p');
      techElement.innerText = `Technologies Used: ${project.techStack.join(', ')}`;
      detailsContainer.appendChild(techElement);

      console.log(`Project details updated for: ${project.title}`);
    } catch (error) {
      console.error('Error loading project details:', error);
      const detailsContainer = document.getElementById('projectDetails');
      if (detailsContainer) {
          detailsContainer.innerText = 'An error occurred while loading project details. Please try again.';
          detailsContainer.classList.add('error-message');
        }
    }
};

// ✅ Function to display filtered projects dynamically
const displayFilteredProjects = (filteredProjects) => {
  try {
      const projectContainer = document.getElementById('projectContainer');
      if (!projectContainer) {
          console.error('Error: Project container not found');
          throw new Error('Project container not found');
      }

      projectContainer.textContent = '';
      filteredProjects.forEach(project => {
          const projectCard = document.createElement('div');
          projectCard.className = 'project-card';

          const titleElement = document.createElement('h3');
          titleElement.textContent = project.title;
          projectCard.appendChild(titleElement);

          const categoryElement = document.createElement('p');
          categoryElement.textContent = `Category: ${project.category}`;
          projectCard.appendChild(categoryElement);

          const imageElement = document.createElement('img');
          imageElement.src = project.image;
          imageElement.alt = project.title;
          imageElement.className = 'project-image';
          projectCard.appendChild(imageElement);

          const descriptionElement = document.createElement('p');
          descriptionElement.textContent = project.description;
          projectCard.appendChild(descriptionElement);

          const techElement = document.createElement('p');
          techElement.textContent = `Technologies: ${project.techStack.join(', ')}`;
          projectCard.appendChild(techElement);

          const detailsButton = document.createElement('button');
          detailsButton.textContent = 'View Details';
          detailsButton.addEventListener('click', () => window.loadProjectDetails(project.id));
          projectCard.appendChild(detailsButton);

          projectContainer.appendChild(projectCard);
        });
    } catch (error) {
      console.error('Error displaying filtered projects:', error);
    }
};

export { Project, projects, displayFilteredProjects };
