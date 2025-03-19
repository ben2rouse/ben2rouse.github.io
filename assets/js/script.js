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

  // Add filter when button is clicked
  addFilterButton.addEventListener('click', function() {
    const filterValue = searchInput.value.trim().toLowerCase();
    if (filterValue && !activeFilters.includes(filterValue)) {
      activeFilters.push(filterValue);
      updateActiveFiltersDisplay();
    }
    searchInput.value = '';
    filterAndDisplayProjects();
  });

  // Allow Enter key to add filter
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFilterButton.click();
    }
  });

  // Update the active filters display
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

  // Filter projects based on active filters
  function filterAndDisplayProjects() {
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

  // Display projects in the featured and other sections
  function displayProjects(projects) {
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

  // --------- FIXED CAROUSEL SCROLL FUNCTIONALITY ---------
  
  function scrollLeft(carouselId) {
      const carousel = document.getElementById(carouselId);
      if (carousel) {
          carousel.scrollBy({ left: -400, behavior: 'smooth' });
      }
  }

  function scrollRight(carouselId) {
      const carousel = document.getElementById(carouselId);
      if (carousel) {
          carousel.scrollBy({ left: 400, behavior: 'smooth' });
      }
  }

  // Attach event listeners to all carousel buttons
  document.querySelectorAll('.prev').forEach(button => {
      button.addEventListener('click', function() {
          const carousel = this.parentElement.querySelector('.image-track');
          if (carousel) {
              scrollLeft(carousel.id);
          }
      });
  });

  document.querySelectorAll('.next').forEach(button => {
      button.addEventListener('click', function() {
          const carousel = this.parentElement.querySelector('.image-track');
          if (carousel) {
              scrollRight(carousel.id);
          }
      });
  });

});