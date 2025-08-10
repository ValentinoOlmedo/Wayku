// --------------------- Navegación ---------------------
const searchToggle = document.getElementById('searchToggle');
const searchBar = document.getElementById('searchBar');
const links = document.querySelectorAll('a[href^="#"]');
const sections = document.querySelectorAll('section[data-section]');

// Referencias a las secciones
const catalogoSection = document.getElementById('catalogo'); 
const contactoSection = document.getElementById('contacto'); 
const preguntasfrecuentesSection = document.getElementById('preguntas-frecuentes'); 
const sobrenosotrosSection = document.getElementById('sobre-nosotros');
const carritoSection = document.getElementById('carrito');
const favoritosSection = document.getElementById('favoritos');
const pagoSection = document.getElementById('pago');
const pago2Section = document.getElementById('pago2');

// Toggle de búsqueda
if (searchToggle && searchBar) {
  searchToggle.addEventListener('click', () => {
    searchBar.classList.toggle('visible');
  });
}

// Función para mostrar solo la página de inicio
function mostrarInicio() {
  // Ocultar todas las secciones especiales
  const seccionesAOcultar = [
    'catalogo', 'contacto', 'preguntas-frecuentes', 
    'sobre-nosotros', 'carrito', 'favoritos', 'pago', 'pago2', 'cuenta'
  ];
  
  sections.forEach(section => {
    if (seccionesAOcultar.includes(section.id)) {
      section.style.display = 'none';
    } else {
      section.style.display = '';
    }
  });
  
  // Actualizar navegación activa
  actualizarNavegacionActiva('#inicio');
}

// Función para mostrar una sección específica
function mostrarSeccion(seccionId) {
  // Encontrar la sección primero; si no existe, no cambiar el layout
  const seccionObjetivo = document.getElementById(seccionId);
  if (!seccionObjetivo) {
    console.warn('Sección no encontrada:', seccionId);
    return;
  }

  // Ocultar todas las secciones primero
  sections.forEach(section => {
    section.style.display = 'none';
  });
  
  // Mostrar la sección solicitada
  seccionObjetivo.style.display = 'block';
  
  // Casos especiales
  if (seccionId === 'contacto') {
    // Mostrar también preguntas frecuentes con contacto
    if (preguntasfrecuentesSection) {
      preguntasfrecuentesSection.style.display = 'block';
    }
  }
  
  // Actualizar navegación activa
  actualizarNavegacionActiva(`#${seccionId}`);
  
  // Scroll al top
  window.scrollTo(0, 0);
}

// Función para actualizar la navegación activa
function actualizarNavegacionActiva(href) {
  const todosLosLinks = document.querySelectorAll('.nav-list a');
  todosLosLinks.forEach(link => link.classList.remove('active'));
  
  const linkActivo = document.querySelector(`.nav-list a[href="${href}"]`);
  if (linkActivo) {
    linkActivo.classList.add('active');
  }
}

// Event listeners para navegación
links.forEach(link => {
  const href = link.getAttribute('href');
  // Ignorar enlaces vacíos o '#', y enlaces dentro de la sección de cuenta
  if (!href || href === '#' || link.closest('#cuenta')) {
    return;
  }

  link.addEventListener('click', (e) => {
    e.preventDefault();
    
    const target = href; 
    const id = target.replace('#', '');
    
    if (id === 'inicio') {
      mostrarInicio();
    } else {
      mostrarSeccion(id);
    }
  });
});

// Función para volver al inicio (para usar desde otros scripts)
function volverAInicio() {
  mostrarInicio();
}

// Inicialización de navegación
function inicializarNavegacion() {
  mostrarInicio();
  
  // Asegurarse de que el link de inicio esté activo
  actualizarNavegacionActiva('#inicio');
}

// Exportar funciones para uso global
window.navegacion = {
  mostrarInicio,
  mostrarSeccion,
  volverAInicio
};