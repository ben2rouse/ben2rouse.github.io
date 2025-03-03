document.addEventListener('DOMContentLoaded', function() {
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
        displayProjects(projects);
      })
      .catch(error => console.error('Error loading projects:', error));
  
    // When the "Add Filter" button is clicked, add the current input value to the active filters list
    addFilterButton.addEventListener('click', function() {
      const filterValue = searchInput.value.trim().toLowerCase();
      if (filterValue && !activeFilters.includes(filterValue)) {
        activeFilters.push(filterValue);
        console.log("Added filter:", filterValue);
        updateActiveFiltersDisplay();
      }
      searchInput.value = '';
      filterAndDisplayProjects();
    });
  
    // Also allow pressing Enter to add the filter
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        addFilterButton.click();
      }
    });
  
    // Update the active filters display as tags with a remove option
    function updateActiveFiltersDisplay() {
      activeFiltersContainer.innerHTML = '';
      activeFilters.forEach((filter, index) => {
        const filterTag = document.createElement('span');
        filterTag.className = 'filter-tag';
        filterTag.textContent = filter;
  
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-filter';
        removeBtn.textContent = ' x';
        removeBtn.addEventListener('click', function() {
          activeFilters.splice(index, 1);
          updateActiveFiltersDisplay();
          filterAndDisplayProjects();
        });
        filterTag.appendChild(removeBtn);
        activeFiltersContainer.appendChild(filterTag);
      });
    }
  
    // Filter projects based on the active filters array
    function filterAndDisplayProjects() {
      console.log("Active filters:", activeFilters);
      let filteredProjects = allProjects;
      if (activeFilters.length > 0) {
        filteredProjects = allProjects.filter(project => {
          const projectTools = project.tools.map(tool => tool.toLowerCase());
          return activeFilters.every(filter => {
            const match = projectTools.some(tool => tool.includes(filter));
            if (!match) {
              console.log(`Project "${project.title}" does not match filter "${filter}"`);
            }
            return match;
          });
        });
      }
      console.log("Filtered projects:", filteredProjects);
      displayProjects(filteredProjects);
    }
  
    // Display projects in the featured and other sections
    function displayProjects(projects) {
      // Clear both containers
      featuredContainer.innerHTML = '';
      otherContainer.innerHTML = '';
  
      if (projects.length === 0) {
        featuredContainer.innerHTML = '<p>No projects found.</p>';
        return;
      }
  
      projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
  
        if (project.comingSoon) {
          projectCard.classList.add('coming-soon');
          fetch('../data/comingSoon.html')
            .then(response => response.text())
            .then(message => {
              projectCard.innerHTML = `<h2>${project.title}</h2>${message}`;
              // Do not add a click event for coming soon projects
              if (project.featured) {
                featuredContainer.appendChild(projectCard);
              } else {
                otherContainer.appendChild(projectCard);
              }
            })
            .catch(error => {
              projectCard.innerHTML = `<h2>${project.title}</h2><p>Sorry, this project is in the process of being added. Please check back soon.</p>`;
              if (project.featured) {
                featuredContainer.appendChild(projectCard);
              } else {
                otherContainer.appendChild(projectCard);
              }
            });
        } else {
          projectCard.innerHTML = `
            <h2>${project.title}</h2>
            <p>${project.description}</p>
            <p><strong>Category:</strong> ${project.category}</p>
            <p><strong>Tools:</strong> <i>${project.tools.join(', ')}</i></p>
          `;
          projectCard.addEventListener('click', () => {
            window.location.href = project.link;
          });
          if (project.featured) {
            featuredContainer.appendChild(projectCard);
          } else {
            otherContainer.appendChild(projectCard);
          }
        }
      });
    }
  });