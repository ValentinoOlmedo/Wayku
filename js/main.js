// --------------------- Navegación ---------------------
const searchToggle = document.getElementById('searchToggle');
const searchBar = document.getElementById('searchBar');
const links = document.querySelectorAll('.main-nav a');
const sections = document.querySelectorAll('section[data-section]');
const catalogoSection = document.getElementById('catalogo'); 
const contactoSection = document.getElementById('contacto'); 
const preguntasfrecuentesSection = document.getElementById('preguntas-frecuentes'); 
const dropdown = document.querySelector('.dropdown');
const toggle = document.getElementById('dropdownText');
const menu = document.getElementById('dropdownMenu');
const selectedOption = document.querySelector('.selected-option');
const options = menu.querySelectorAll('li');
const gridProductos = document.querySelector('.grid-productos');


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
        if (section.id === 'catalogo' || section.id === 'contacto' || section.id === 'preguntas-frecuentes') {
          section.style.display = 'none'; 
        } else {
          section.style.display = ''; 
        }
      });
    } else if (id === 'catalogo') {
      sections.forEach(section => {
        section.style.display = section.id === 'catalogo' ? '' : 'none';
      });
    } else if (id === 'contacto') {
      sections.forEach(section => {
        if (section.id === 'contacto' || section.id === 'preguntas-frecuentes') {
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
    contactoSection.style.display = 'none';
    preguntasfrecuentesSection.style.display = 'none';
    
  }
});


toggle.addEventListener('click', () => {
      dropdown.classList.toggle('show');
    });

options.forEach(option => {
  option.addEventListener('click', () => {
    const criterio = option.dataset.value.toLowerCase();
    selectedOption.textContent = option.dataset.value;
    dropdown.classList.remove('show');
    ordenarProductos(criterio);
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
    const precioA = parseFloat(a.dataset.precio);
    const precioB = parseFloat(b.dataset.precio);

    if (criterio === 'menor precio') {
      return precioA - precioB;
    } else if (criterio === 'mayor precio') {
      return precioB - precioA;
    } else {
      return 0; // Relevancia o sin orden
    }
  });

  gridProductos.innerHTML = '';
  productosArray.forEach(producto => gridProductos.appendChild(producto));
}

document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
  checkbox.addEventListener('change', aplicarFiltros);
});


function aplicarFiltros() {
  const categoriaSeleccionadas = Array.from(document.querySelectorAll('[data-type="category"]:checked')).map(cb => cb.value.toLowerCase());
  const materialSeleccionados = Array.from(document.querySelectorAll('[data-type="material"]:checked')).map(cb => cb.value.toLowerCase());
  
  const desde = parseInt(document.getElementById('desde').value) || 0;
  const hasta = parseInt(document.getElementById('hasta').value) || Infinity;

  document.querySelectorAll('.product-card').forEach(card => {
    const categoria = card.dataset.categoria;
    const material = card.dataset.material;
    const precio = parseInt(card.dataset.precio);

    const matchCategoria = !categoriaSeleccionadas.length || categoriaSeleccionadas.includes(categoria);
    const matchMaterial = !materialSeleccionados.length || materialSeleccionados.includes(material);
    const matchPrecio = precio >= desde && precio <= hasta;

    card.style.display = (matchCategoria && matchMaterial && matchPrecio) ? '' : 'none';
  });
}


document.querySelector('.contacto-form').addEventListener('submit', function(e) {
  e.preventDefault(); 
  this.reset();
});


document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      item.classList.toggle('open');
    });
  });