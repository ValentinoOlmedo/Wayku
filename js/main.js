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
const gridProductos = document.querySelector('.grid-productos');
const categoryCheckboxes = document.querySelectorAll('.filtros-section:nth-of-type(1) input[type="checkbox"]'); // Categorías
const materialCheckboxes = document.querySelectorAll('.filtros-section:nth-of-type(2) input[type="checkbox"]'); // Materiales
const priceFrom = document.getElementById('desde');
const priceTo = document.getElementById('hasta');
const products = document.querySelectorAll('.grid-productos .product-card');
const selectedFiltersContainer = document.getElementById('selectedFilters');

    

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



function ordenarProductos(criterio) {
  
  const productosArray = Array.from(gridProductos.children);

  productosArray.sort((a, b) => {
    const precioA = parseInt(a.querySelector('p').textContent.replace(/[^0-9]/g, ''), 10);
    const precioB = parseInt(b.querySelector('p').textContent.replace(/[^0-9]/g, ''), 10);

    if (criterio === 'menor precio') {
      return precioA - precioB; 
    } else if (criterio === 'mayor precio') {
      return precioB - precioA; 
    } else if (criterio === 'relevancia') {
      
      return 0;
    }
  });

  
  gridProductos.innerHTML = '';
  productosArray.forEach(producto => gridProductos.appendChild(producto));
}


options.forEach(option => {
  option.addEventListener('click', () => {
    const valor = option.dataset.value;
    selectedOption.textContent = valor;
    dropdown.classList.remove('show');

    ordenarProductos(valor);
  });
});



// Variables para filtros seleccionados
let selectedCategories = new Set();
let selectedMaterials = new Set();
let priceRange = { from: null, to: null };

// Actualizar filtros activos visualmente
function updateActiveFilters() {
  selectedFiltersContainer.innerHTML = '';

  // Categorías
  selectedCategories.forEach(cat => {
    const filterSpan = document.createElement('span');
    filterSpan.className = 'active-filter';
    filterSpan.textContent = cat;
    selectedFiltersContainer.appendChild(filterSpan);
  });

  // Materiales
  selectedMaterials.forEach(mat => {
    const filterSpan = document.createElement('span');
    filterSpan.className = 'active-filter';
    filterSpan.textContent = mat;
    selectedFiltersContainer.appendChild(filterSpan);
  });

  // Precios
  if (priceRange.from !== null || priceRange.to !== null) {
    const priceText = `Precio: ${priceRange.from ?? '0'} - ${priceRange.to ?? '∞'}`;
    const filterSpan = document.createElement('span');
    filterSpan.className = 'active-filter';
    filterSpan.textContent = priceText;
    selectedFiltersContainer.appendChild(filterSpan);
  }
}

// Filtrar productos según filtros seleccionados
function filterProducts() {
  products.forEach(product => {
    const productCategory = product.dataset.category.toLowerCase();
    const productMaterial = product.dataset.material.toLowerCase();

    // Precio: obtener número desde el texto del precio (ejemplo: "$200.000")
    let priceText = product.querySelector('p').textContent;
    let productPrice = Number(priceText.replace(/[^0-9]/g, ''));

    // Verificación filtros
    let categoryMatch = selectedCategories.size === 0 || [...selectedCategories].some(cat => productCategory.includes(cat.toLowerCase()));
    let materialMatch = selectedMaterials.size === 0 || [...selectedMaterials].some(mat => productMaterial.includes(mat.toLowerCase()));
    
    let priceMatch = true;
    if (priceRange.from !== null && productPrice < priceRange.from) priceMatch = false;
    if (priceRange.to !== null && productPrice > priceRange.to) priceMatch = false;

    // Mostrar solo si todos coinciden
    if (categoryMatch && materialMatch && priceMatch) {
      product.style.display = '';
    } else {
      product.style.display = 'none';
    }
  });
}

// Función para actualizar filtros desde inputs
function updateFilters() {
  // Categorías
  selectedCategories.clear();
  categoryCheckboxes.forEach(cb => {
    if (cb.checked) selectedCategories.add(cb.parentElement.textContent.trim());
  });

  // Materiales
  selectedMaterials.clear();
  materialCheckboxes.forEach(cb => {
    if (cb.checked) selectedMaterials.add(cb.parentElement.textContent.trim());
  });

  // Precio
  const fromVal = priceFrom.value ? Number(priceFrom.value) : null;
  const toVal = priceTo.value ? Number(priceTo.value) : null;

  priceRange.from = fromVal;
  priceRange.to = toVal;

  updateActiveFilters();
  filterProducts();
}

// Agregar listeners a checkboxes
categoryCheckboxes.forEach(cb => cb.addEventListener('change', updateFilters));
materialCheckboxes.forEach(cb => cb.addEventListener('change', updateFilters));

// Agregar listeners a inputs de precio
priceFrom.addEventListener('input', updateFilters);
priceTo.addEventListener('input', updateFilters);

// Inicializar filtros al cargar la página
updateFilters();
