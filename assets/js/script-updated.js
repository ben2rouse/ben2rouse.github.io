// Updated script.js for the portfolio site
document.addEventListener('DOMContentLoaded', function () {
    const featuredContainer = document.getElementById('featuredProjects');
    const otherContainer = document.getElementById('otherProjects');
    const searchInput = document.getElementById('searchInput');
    const addFilterButton = document.getElementById('addFilterButton');
    const activeFiltersContainer = document.getElementById('activeFiltersContainer');
  
    let activeFilters = [];
    let allProjects = [];
  
    // Load projects from JSON file
    fetch('../data/projects.json')
        .then(response => response.json())
        .then(projects => {
            allProjects = projects;
            if (featuredContainer && otherContainer) {
                displayProjects(projects);
            } else {
                console.error("Error: Project containers not found in the DOM.");
            }
        })
        .catch(error => console.error('Error loading projects:', error));
  
    // Add filter when button is clicked
    if (addFilterButton && searchInput) {
        addFilterButton.addEventListener('click', function () {
            const filterValue = searchInput.value.trim().toLowerCase();
            if (filterValue && !activeFilters.includes(filterValue)) {
                activeFilters.push(filterValue);
                updateActiveFiltersDisplay();
            }
            searchInput.value = '';
            filterAndDisplayProjects();
        });
  
        // Allow Enter key to add filter
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addFilterButton.click();
            }
        });
    }
  
    // Function to update active filters display
    function updateActiveFiltersDisplay() {
        if (!activeFiltersContainer) return;
        activeFiltersContainer.innerHTML = '';
        activeFilters.forEach((filter, index) => {
            const filterTag = document.createElement('span');
            filterTag.className = 'filter-tag';
            filterTag.textContent = filter;
  
            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.addEventListener('click', function () {
                activeFilters.splice(index, 1);
                updateActiveFiltersDisplay();
                filterAndDisplayProjects();
            });
            filterTag.appendChild(removeBtn);
            activeFiltersContainer.appendChild(filterTag);
        });
    }
  
    // Function to filter projects
    function filterAndDisplayProjects() {
        if (!featuredContainer || !otherContainer) return;
        let filteredProjects = allProjects;
        if (activeFilters.length > 0) {
            filteredProjects = allProjects.filter(project => {
                const projectTools = project.tools.map(tool => tool.toLowerCase());
                return activeFilters.every(filter => {
                    return projectTools.some(tool => tool.includes(filter));
                });
            });
        }
        displayProjects(filteredProjects);
    }
  
    // Function to display projects
    function displayProjects(projects) {
        if (!featuredContainer || !otherContainer) return;
        featuredContainer.innerHTML = '';
        otherContainer.innerHTML = '';
  
        if (projects.length === 0) {
            featuredContainer.innerHTML = '<p class="no-results">No projects found matching your filters. Try different criteria.</p>';
            return;
        }
  
        projects.forEach(project => {
            const projectCard = createProjectCard(project);
            
            if (project.featured) {
                featuredContainer.appendChild(projectCard);
            } else {
                otherContainer.appendChild(projectCard);
            }
        });
    }

    // Function to create project card with new design
    function createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        
        // Get random image from project tools for placeholder
        const toolImage = getToolImage(project.tools[0]);
        
        // Create card with new design
        if (project.comingSoon) {
            card.classList.add('coming-soon');
            card.innerHTML = `
                <div class="project-image">
                    <img src="../assets/images/${project.imageUrl || toolImage}" alt="${project.title}">
                    <div class="coming-soon-overlay">Coming Soon</div>
                </div>
                <div class="project-details">
                    <h4>${project.title}</h4>
                    <p>${project.description}</p>
                    <div class="project-tags">
                        ${project.tools.slice(0, 3).map(tool => `<span class="project-tag">${tool}</span>`).join('')}
                    </div>
                </div>
            `;
        } else {
            card.innerHTML = `
                <div class="project-image">
                    <img src="../assets/images/${project.imageUrl || toolImage}" alt="${project.title}">
                </div>
                <div class="project-details">
                    <h4>${project.title}</h4>
                    <p>${project.description}</p>
                    <div class="project-tags">
                        ${project.tools.slice(0, 3).map(tool => `<span class="project-tag">${tool}</span>`).join('')}
                    </div>
                    <a href="${project.link}" class="project-link">View Project</a>
                </div>
            `;
            card.addEventListener('click', function(e) {
                // Only navigate if the click wasn't on the view project link
                if (!e.target.classList.contains('project-link')) {
                    window.location.href = project.link;
                }
            });
        }
        
        return card;
    }
    
    // Function to get image based on tool name
    function getToolImage(tool) {
        const toolLower = tool.toLowerCase();
        if (toolLower.includes('power bi') || toolLower.includes('powerbi')) {
            return 'PBI Portfolio/PBI Course/Exec Dashboard.png';
        } else if (toolLower.includes('excel')) {
            return 'PBI Portfolio/QEP Excel/Main_FirstResults.png';
        } else if (toolLower.includes('sql')) {
            return 'PBI Portfolio/GenEd Assessment/Table Relationships.png';
        } else {
            return 'Headshot.png'; // Default image
        }
    }

    // Add animations when scrolling to project cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Observe all project cards after they're loaded
    setTimeout(() => {
        document.querySelectorAll('.project-card').forEach(card => {
            observer.observe(card);
        });
    }, 500);
});
