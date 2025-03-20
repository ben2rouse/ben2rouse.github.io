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
    } else {
        console.error("Error: Search input or add filter button not found.");
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
            removeBtn.className = 'remove-filter';
            removeBtn.textContent = ' x';
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
  
    // --------- FIXED PROJECT CAROUSEL SCROLL FUNCTIONALITY ---------
    document.querySelectorAll(".prev").forEach((button) => {
        button.addEventListener("click", function () {
            const carousel = this.nextElementSibling;
            if (carousel && carousel.classList.contains("image-track")) {
                carousel.scrollLeft -= 400; // Scroll left
            }
        });
    });
  
    document.querySelectorAll(".next").forEach((button) => {
        button.addEventListener("click", function () {
            const carousel = this.previousElementSibling;
            if (carousel && carousel.classList.contains("image-track")) {
                carousel.scrollLeft += 400; // Scroll right
            }
        });
    });
  
    // --------- HIGHLIGHT CAROUSEL FUNCTIONALITY ---------
    const highlightTrack = document.querySelector(".highlight-track");
    if (highlightTrack) {
        highlightTrack.addEventListener("scroll", function () {
            document.querySelector(".highlight-scroll-indicator.left").style.opacity =
                highlightTrack.scrollLeft > 10 ? "1" : "0";
            document.querySelector(".highlight-scroll-indicator.right").style.opacity =
                highlightTrack.scrollLeft + highlightTrack.clientWidth < highlightTrack.scrollWidth ? "1" : "0";
        });
    } else {
        console.error("Error: Highlight track not found.");
    }
  
    // --------- MODAL FUNCTIONALITY FOR IMAGE SLIDES ---------
    // Ensure modal elements exist in the DOM
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const modalText = document.getElementById('modal-text');
    const closeBtn = document.querySelector('.modal-close');
  
    if (modal && modalImage && modalText && closeBtn) {
      // Attach click event to each image slide for modal pop-up
      const slides = document.querySelectorAll('.image-slide');
      slides.forEach(slide => {
        slide.addEventListener('click', () => {
          // Get image and text within the slide
          const img = slide.querySelector('img');
          const text = slide.querySelector('p');
          if (img) {
            modalImage.src = img.src;
          }
          if (text) {
            modalText.textContent = text.textContent;
          }
          modal.style.display = 'block'; // Show the modal
        });
      });
      
      // Close the modal when the close button is clicked
      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
      });
      
      // Also close the modal if user clicks outside the modal content
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.display = 'none';
        }
      });
    } else {
      console.error("Modal elements not found.");
    }
  });