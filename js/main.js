const searchToggle = document.getElementById('searchToggle');
const searchBar = document.getElementById('searchBar');
const links = document.querySelectorAll('.main-nav a');
const sections = document.querySelectorAll('section[data-section]');
const catalogoSection = document.getElementById('catalogo'); 
const dropdown = document.querySelector('.dropdown');
const toggle = document.getElementById('dropdownText');
const menu = document.getElementById('dropdownMenu');
const selectedOption = document.querySelector('.selected-option');
const options = menu.querySelectorAll('li');

    

searchToggle.addEventListener('click', () => {
  if (searchBar.style.display === 'block') {
    searchBar.style.opacity = 0;
    setTimeout(() => {
      searchBar.style.display = 'none';
    }, 200);
  } else {
    searchBar.style.display = 'block';
    searchBar.style.opacity = 0;
    setTimeout(() => {
      searchBar.style.opacity = 1;
    }, 10);
  }
});

  

links.forEach(link => {
  link.addEventListener('click', (e) => {
    const target = link.getAttribute('href'); 
    const id = target.replace('#', '');

        
    links.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

        
    if (id === 'inicio') {
      sections.forEach(section => {
        if (section.id === 'catalogo') {
          section.style.display = 'none'; 
        } else {
          section.style.display = ''; 
        }
      });
    } else if (id === 'catalogo') {
      sections.forEach(section => {
        if (section.id === 'catalogo') {
          section.style.display = ''; 
        } else {
          section.style.display = 'none'; 
        }
      });
    }
  });
});

    
window.addEventListener('DOMContentLoaded', () => {
  if (catalogoSection) {
    catalogoSection.style.display = 'none';
  }
});


toggle.addEventListener('click', () => {
      dropdown.classList.toggle('show');
    });

options.forEach(option => {
  option.addEventListener('click', () => {
    selectedOption.textContent = option.dataset.value;
    dropdown.classList.remove('show');
  });
});

document.addEventListener('click', (e) => {
  if (!dropdown.contains(e.target)) {
    dropdown.classList.remove('show');
  }
});