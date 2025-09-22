// --------------------- Navegación ---------------------
const searchToggle = document.getElementById('searchToggle');
const searchBar = document.getElementById('searchBar');
const searchInput = document.getElementById('searchInput');
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
const youmaySection = document.getElementById('youmay');

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
    'sobre-nosotros', 'youmay', 'carrito', 'favoritos', 'pago', 'pago2', 'cuenta', 'politicas', 'producto-detalle'
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
  // Limpiar búsqueda al cambiar de sección (excepto si vamos al catálogo)
  if (seccionId !== 'catalogo' && searchInput) {
    searchInput.value = '';
    limpiarBusqueda();
  }
  
  // Ocultar todas las secciones primero
  sections.forEach(section => {
    section.style.display = 'none';
  });
  
  // Mostrar la sección solicitada
  const seccionObjetivo = document.getElementById(seccionId);
  if (seccionObjetivo) {
    seccionObjetivo.style.display = 'block';
  }
  
  // Casos especiales
  if (seccionId === 'contacto') {
    // Mostrar también preguntas frecuentes con contacto
    if (preguntasfrecuentesSection) {
      preguntasfrecuentesSection.style.display = 'block';
    }
  }

  // Mostrar "youmay" cuando se abre producto-detalle
  if (seccionId === 'producto-detalle') {
    if (youmaySection) {
      youmaySection.style.display = 'block';
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
  link.addEventListener('click', (e) => {
    e.preventDefault();
    
    const target = link.getAttribute('href'); 
    const id = target.replace('#', '');
    
    if (id === 'inicio') {
      mostrarInicio();
    } else {
      mostrarSeccion(id);
    }
  });
});

// --------------------- Búsqueda ---------------------

// Función para realizar la búsqueda
function realizarBusqueda(termino) {
  if (!termino.trim()) {
    limpiarBusqueda();
    return;
  }
  
  // Navegar al catálogo si no estamos ahí
  mostrarSeccion('catalogo');
  
  // Filtrar productos
  filtrarProductosPorBusqueda(termino);
}

// Event listeners para la búsqueda
if (searchInput) {
  // Solo buscar al presionar Enter
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      realizarBusqueda(searchInput.value);
      // Cerrar la barra de búsqueda después de buscar
      if (searchBar) {
        searchBar.classList.remove('visible');
      }
    }
  });
  
  // Opcional: cerrar con Escape
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (searchBar) {
        searchBar.classList.remove('visible');
      }
    }
  });
}

// Función para filtrar productos con búsqueda inteligente
function filtrarProductosPorBusqueda(termino) {
  const productos = document.querySelectorAll('.product-card');
  console.log('Productos encontrados:', productos.length);
  console.log('Buscando:', termino);
  
  const terminoLower = normalizeText(termino);
  let productosVisibles = 0;
  
  productos.forEach(producto => {
    // Obtener datos del producto
    const nombre = normalizeText(producto.querySelector('h3')?.textContent || '');
    const categoria = normalizeText(producto.dataset.categoria || '');
    const material = normalizeText(producto.dataset.material || '');
    const precio = producto.dataset.precio || '';
    
    console.log('Producto:', nombre, categoria, material);
    
    // Crear texto completo para buscar
    const textoCompleto = `${nombre} ${categoria} ${material}`;
    
    // Crear array de palabras clave del producto
    const palabrasClave = extraerPalabrasClave(textoCompleto);
    
    if (coincideBusqueda(terminoLower, nombre, textoCompleto, palabrasClave)) {
      producto.style.display = 'block';
      productosVisibles++;
      console.log('Coincidencia encontrada:', nombre);
    } else {
      producto.style.display = 'none';
    }
  });
  
  console.log('Productos visibles:', productosVisibles);
  mostrarMensajeResultados(termino, productosVisibles);
}

// Función para normalizar texto (quitar acentos y convertir a minúsculas)
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
    .replace(/[^a-z0-9\s]/g, ' ') // Quitar caracteres especiales
    .replace(/\s+/g, ' ') // Normalizar espacios
    .trim();
}

// Función para extraer palabras clave específicas
function extraerPalabrasClave(texto) {
  const palabrasClave = [];
  const textoNormalizado = normalizeText(texto);
  
  // Tipos de lámparas
  const tipos = ['mesa', 'piso', 'techo', 'pared', 'colgante', 'suspension', 'aplique', 'escritorio', 'lectura', 'decorativa'];
  
  // Estilos
  const estilos = ['moderna', 'industrial', 'vintage', 'minimalista', 'rustica', 'clasica', 'contemporanea', 'nordica'];
  
  // Materiales
  const materiales = ['madera', 'metal', 'vidrio', 'ceramica', 'tela', 'papel', 'bambu', 'hierro', 'bronce'];
  
  // Colores
  const colores = ['blanco', 'negro', 'dorado', 'plateado', 'marron', 'gris', 'beige', 'natural'];
  
  // Habitaciones
  const habitaciones = ['sala', 'dormitorio', 'cocina', 'bano', 'oficina', 'comedor', 'living'];
  
  const todasLasPalabras = [...tipos, ...estilos, ...materiales, ...colores, ...habitaciones];
  
  todasLasPalabras.forEach(palabra => {
    if (textoNormalizado.includes(palabra)) {
      palabrasClave.push(palabra);
    }
  });
  
  return palabrasClave;
}

// Función para verificar coincidencias (versión corregida)
function coincideBusqueda(termino, nombre, textoCompleto, palabrasClave) {
  // Para búsquedas de múltiples palabras, ser más estricto
  if (termino.includes(' ')) {
    // Dividir el término en palabras
    const palabrasTermino = termino.split(' ').filter(p => p.length > 1);
    
    // Verificar que TODAS las palabras importantes estén presentes
    const todasPresentes = palabrasTermino.every(palabra => {
      return textoCompleto.includes(palabra) || palabrasClave.includes(palabra);
    });
    
    return todasPresentes;
  }
  
  // Para términos de una sola palabra, búsqueda normal
  if (nombre.includes(termino) || textoCompleto.includes(termino)) {
    return true;
  }
  
  if (palabrasClave.some(palabra => palabra.includes(termino) || termino.includes(palabra))) {
    return true;
  }
  
 
  // Sinónimos específicos para tu catálogo
  const sinonimos = {
    'lampara': ['luz', 'iluminacion', 'luminaria'],
    'mesa': ['escritorio', 'velador'],
    'piso': ['pie', 'suelo'],
    'techo': ['cielo', 'superior', 'plafon'],
    'pared': ['aplique', 'muro'],
    'colgante': ['suspension', 'pendiente'],
    'petiribi': ['madera', 'natural'],
    'guayubira': ['madera', 'natural'], 
    'palo blanco': ['madera', 'natural', 'claro']
  };
  
  for (let [palabra, sins] of Object.entries(sinonimos)) {
    if (termino.includes(palabra)) {
      if (sins.some(sin => nombre.includes(sin) || textoCompleto.includes(sin))) {
        return true;
      }
    }
    if (sins.some(sin => termino.includes(sin))) {
      if (nombre.includes(palabra) || textoCompleto.includes(palabra)) {
        return true;
      }
    }
  }
  
  return false;
}
// Función para mostrar mensaje de resultados
function mostrarMensajeResultados(termino, productosVisibles) {
  let mensaje = document.getElementById('mensaje-busqueda');
  
  if (!mensaje) {
    mensaje = document.createElement('div');
    mensaje.id = 'mensaje-busqueda';
    mensaje.style.cssText = 'text-align: center; padding: 2rem; color: #666; font-family: Poppins, sans-serif;';
    
    const catalogoGrid = document.querySelector('.productos-grid');
    if (catalogoGrid) {
      catalogoGrid.parentNode.insertBefore(mensaje, catalogoGrid);
    }
  }
  
  if (productosVisibles === 0) {
    mensaje.innerHTML = `
      <h3 style="margin-bottom: 1rem;">No encontramos resultados para "${termino}"</h3>
      <p style="margin-bottom: 1.5rem;">Intenta con otros términos de búsqueda</p>
      <button onclick="limpiarBusqueda()" style="
        background: #5d725b; 
        color: white; 
        border: none; 
        padding: 0.8rem 1.5rem; 
        border-radius: 4px; 
        cursor: pointer;
        font-family: Poppins, sans-serif;
      ">Ver todos los productos</button>
    `;
  } else {
    mensaje.innerHTML = `<p>Mostrando ${productosVisibles} resultado(s) para "${termino}"</p>`;
  }
  
  mensaje.style.display = 'block';
}

// Función para limpiar búsqueda
function limpiarBusqueda() {
  const productos = document.querySelectorAll('.product-card');
  productos.forEach(producto => {
    producto.style.display = 'block';
  });
  
  const mensaje = document.getElementById('mensaje-busqueda');
  if (mensaje) {
    mensaje.style.display = 'none';
  }
  
  if (searchInput) {
    searchInput.value = '';
  }
}

// Función para volver al inicio
function volverAInicio() {
  mostrarInicio();
}

// Inicialización
function inicializarNavegacion() {
  mostrarInicio();
  actualizarNavegacionActiva('#inicio');
}

// Exportar funciones
window.navegacion = {
  mostrarInicio,
  mostrarSeccion,
  volverAInicio
};

// Inicializar cuando carga la página
document.addEventListener('DOMContentLoaded', inicializarNavegacion);