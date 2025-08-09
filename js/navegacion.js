// --------------------- Navegación ---------------------
const searchToggle = document.getElementById('searchToggle');
const searchBar = document.getElementById('searchBar');
const links = document.querySelectorAll('a[href^="#"]');
const sections = document.querySelectorAll('section[data-section]');
const catalogoSection = document.getElementById('catalogo'); 
const contactoSection = document.getElementById('contacto'); 
const preguntasfrecuentesSection = document.getElementById('preguntas-frecuentes'); 
const sobrenosotrosSection = document.getElementById('sobre-nosotros');
const carritoSection = document.getElementById('carrito');
const favoritosSection = document.getElementById('favoritos');

// Toggle de búsqueda
searchToggle.addEventListener('click', () => {
  searchBar.classList.toggle('visible');
});

// Navegación entre secciones
links.forEach(link => {
  link.addEventListener('click', (e) => {
    window.scrollTo(0, 0);
    const target = link.getAttribute('href'); 
    const id = target.replace('#', '');

    const menuLink = document.querySelector('.nav-list a[href="' + target + '"]');
    if (menuLink) {
      links.forEach(l => l.classList.remove('active'));
      menuLink.classList.add('active');
    }

    sections.forEach(section => {
      section.style.display = section.id === id || (id === 'contacto' && section.id === 'preguntas-frecuentes') ? '' : 'none';
    });

    if (id === 'inicio') {
      sections.forEach(section => {
        if (['catalogo', 'contacto', 'preguntas-frecuentes', 'sobre-nosotros', 'carrito', 'favoritos'].includes(section.id)) {
          section.style.display = 'none'; 
        } else {
          section.style.display = ''; 
        }
      });
    }
  });
});

// Inicialización de navegación
function inicializarNavegacion() {
  catalogoSection.style.display = 'none';
  contactoSection.style.display = 'none';
  preguntasfrecuentesSection.style.display = 'none';
  sobrenosotrosSection.style.display = 'none';
  carritoSection.style.display = 'none';
  favoritosSection.style.display = 'none';
}