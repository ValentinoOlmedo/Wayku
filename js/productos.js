// --------------------- Vista Detallada de Productos ---------------------

// Base de datos de productos con información detallada
const productosDetallados = {
  'Amaí': {
    id: 'amai',
    titulo: 'AMAÍ',
    precio: 200000,
    descripcion: 'Lámpara de mesa artesanal elaborada con madera de petíribi del norte argentino. Su diseño minimalista y cálido aporta una luz suave y acogedora, perfecta para espacios de lectura y relajación.',
    imagenes: [
      'img/amai.png',
      'img/amai-2.jpg',
      'img/amai-3.jpg',
      'img/amai-4.jpg'
    ],
    categoria: 'lamparas de mesa',
    material: 'petiribi',
    dimensiones: ['1m', '1.2m', '2m'],
    materiales: ['Petíribi', 'Guayubira', 'Palo blanco']
  },
  'Kirú': {
    id: 'kiru',
    titulo: 'KIRÚ',
    precio: 350000,
    descripcion: 'Lámpara colgante de diseño contemporáneo con acabados en madera noble. Su forma elegante y líneas limpias la convierten en el punto focal perfecto para comedores y salas de estar.',
    imagenes: [
      'img/kiru.png',
      'img/kiru-2.jpg',
      'img/kiru-3.jpg',
      'img/kiru-4.jpg'
    ],
    categoria: 'lamparas colgantes',
    material: 'guayubira',
    dimensiones: ['1m', '1.2m', '2m'],
    materiales: ['Petíribi', 'Guayubira', 'Palo blanco']
  },
  'Tani': {
    id: 'tani',
    titulo: 'TANI',
    precio: 150000,
    descripcion: 'Aplique de pared con diseño geométrico en madera de palo blanco. Su instalación sencilla y luz direccional lo hacen ideal para crear ambientes íntimos y sofisticados.',
    imagenes: [
      'img/tani.png',
      'img/tani-2.jpg',
      'img/tani-3.jpg',
      'img/tani-4.jpg'
    ],
    categoria: 'apliques de pared',
    material: 'palo blanco',
    dimensiones: ['1m', '1.2m', '2m'],
    materiales: ['Petíribi', 'Guayubira', 'Palo blanco']
  },
  'Unui': {
    id: 'unui',
    titulo: 'UNUI',
    precio: 450000,
    descripcion: 'Lámpara colgante de gran formato con estructura en madera de guayubira. Su presencia imponente y luz difusa la convierten en la pieza central de espacios amplios.',
    imagenes: [
      'img/unui.jpg',
      'img/unui-2.jpg',
      'img/unui-3.jpg',
      'img/unul-4.jpg'
    ],
    categoria: 'lamparas colgantes',
    material: 'guayubira',
    dimensiones: ['1m', '1.2m', '2m'],
    materiales: ['Petíribi', 'Guayubira', 'Palo blanco']
  }
};

// Función para mostrar el detalle del producto
function mostrarDetalleProducto(nombreProducto) {
  const producto = productosDetallados[nombreProducto];
  
  if (!producto) {
    console.error('Producto no encontrado:', nombreProducto);
    return;
  }

  // Actualizar información del producto
  document.getElementById('breadcrumb-producto').textContent = producto.titulo;
  document.getElementById('producto-titulo').textContent = producto.titulo;
  document.getElementById('producto-descripcion').textContent = producto.descripcion;
  document.getElementById('producto-precio').textContent = `${producto.precio.toLocaleString('es-AR')} $`;

  // Actualizar imágenes
  const imagenPrincipal = document.getElementById('imagen-principal');
  const thumbnails = document.querySelectorAll('.thumbnail');
  
  imagenPrincipal.src = producto.imagenes[0];
  imagenPrincipal.alt = producto.titulo;

  // Actualizar thumbnails
  thumbnails.forEach((thumb, index) => {
    if (producto.imagenes[index]) {
      thumb.src = producto.imagenes[index];
      thumb.alt = `${producto.titulo} ${index + 1}`;
      thumb.style.display = 'block';
      thumb.setAttribute('data-imagen', producto.imagenes[index]);
    } else {
      thumb.style.display = 'none';
    }
  });

  // Mostrar la sección de detalle
  if (window.navegacion) {
    window.navegacion.mostrarSeccion('producto-detalle');
  }

  // Scroll al top
  window.scrollTo(0, 0);
}

// Función para cambiar imagen principal
function cambiarImagenPrincipal(nuevaImagen) {
  const imagenPrincipal = document.getElementById('imagen-principal');
  imagenPrincipal.src = nuevaImagen;

  // Actualizar thumbnails activos
  document.querySelectorAll('.thumbnail').forEach(thumb => {
    thumb.classList.remove('active');
    if (thumb.getAttribute('data-imagen') === nuevaImagen) {
      thumb.classList.add('active');
    }
  });
}

// Función para inicializar la funcionalidad de producto detallado
// REEMPLAZAR la función existente con esta versión mejorada:
function inicializarProductoDetalle() {
  // Event listeners para clicks en productos del catálogo (mantener igual)
  document.addEventListener('click', function(e) {
    const productCard = e.target.closest('.product-card');
    const productCardBestseller = e.target.closest('.product-cardd');
    
    if (productCard || productCardBestseller) {
      const card = productCard || productCardBestseller;
      const nombreProducto = card.querySelector('h3').textContent;
      
      if (!e.target.closest('.btn-agregar-carrito') && 
          !e.target.closest('.btn-agregar-favorito') && 
          !e.target.closest('.card-icons')) {
        e.preventDefault();
        mostrarDetalleProducto(nombreProducto);
      }
    }
  });

  // Event listeners para thumbnails (mantener igual)
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('thumbnail')) {
      const nuevaImagen = e.target.getAttribute('data-imagen');
      cambiarImagenPrincipal(nuevaImagen);
    }
  });

  // NUEVO: Inicializar dropdowns
  inicializarDropdowns();
  
  // NUEVO: Inicializar cantidad
  inicializarCantidadDetalle();

  // Event listener para agregar al carrito desde detalle (MODIFICAR)
  const btnCarritoDetalle = document.getElementById('btn-agregar-carrito-detalle');
  if (btnCarritoDetalle) {
    btnCarritoDetalle.addEventListener('click', function() {
      const titulo = document.getElementById('producto-titulo').textContent;
      const precioTexto = document.getElementById('producto-precio').textContent;
      const precio = parseFloat(precioTexto.replace(/[^\d]/g, ''));
      const imagen = document.getElementById('imagen-principal').src;
      const cantidad = parseInt(document.querySelector('.cantidad-input').value) || 1;

      const producto = {
        nombre: titulo,
        precio: precio,
        imagen: imagen,
        cantidad: cantidad
      };

      // Verificar si ya está en el carrito
      if (carrito[titulo]) {
        carrito[titulo].cantidad += cantidad;
        const itemCarrito = document.querySelector(`.carrito-item[data-nombre="${titulo}"]`);
        if (itemCarrito) {
          const inputCantidad = itemCarrito.querySelector('.input-cantidad');
          inputCantidad.value = carrito[titulo].cantidad;
          actualizarSubtotal(titulo, itemCarrito);
        }
      } else {
        carrito[titulo] = producto;
        agregarProductoAlCarrito(carrito[titulo]);
      }

      actualizarTotales();

      // Feedback visual mejorado
      const textoOriginal = this.textContent;
      this.textContent = '¡Agregado al carrito!';
      this.style.backgroundColor = '#28a745';
      this.disabled = true;
      
      setTimeout(() => {
        this.textContent = textoOriginal;
        this.style.backgroundColor = '#5d725b';
        this.disabled = false;
      }, 2000);
    });
  }

  // Event listener para favoritos (mantener igual)
  const btnFavoritoDetalle = document.getElementById('btn-favorito-detalle');
  if (btnFavoritoDetalle) {
    btnFavoritoDetalle.addEventListener('click', function() {
      const titulo = document.getElementById('producto-titulo').textContent;
      const precioTexto = document.getElementById('producto-precio').textContent;
      const precio = parseFloat(precioTexto.replace(/[^\d]/g, ''));
      const imagen = document.getElementById('imagen-principal').src;

      const icono = this.querySelector('i');

      if (listaFavoritos[titulo]) {
        delete listaFavoritos[titulo];
        icono.classList.remove('ph-fill');
        icono.classList.add('ph-bold');
        
        const item = document.querySelector(`.favorito-item[data-nombre="${titulo}"]`);
        if (item) item.remove();
      } else {
        const producto = {
          nombre: titulo,
          precio: precio,
          imagen: imagen
        };
        
        listaFavoritos[titulo] = producto;
        agregarAFavoritos(producto);
        
        icono.classList.remove('ph-bold');
        icono.classList.add('ph-fill');
      }

      actualizarVistaFavoritos();
    });
  }

  console.log('✅ Producto detalle inicializado con dropdowns');
  
}


// Función para volver al catálogo desde detalle
function volverAlCatalogo() {
  if (window.navegacion) {
    window.navegacion.mostrarSeccion('catalogo');
  }
}

// Exportar funciones para uso global
window.productoDetalle = {
  mostrarDetalleProducto,
  volverAlCatalogo,
  inicializarProductoDetalle
};




// Función para inicializar dropdowns personalizados
function inicializarDropdowns() {
  document.querySelectorAll('.opciones-dropdown').forEach(dropdown => {
    const selected = dropdown.querySelector('.dropdown-selected');
    const options = dropdown.querySelector('.dropdown-options');
    const optionItems = dropdown.querySelectorAll('.dropdown-option');

    selected.addEventListener('click', () => {
      // Cerrar otros dropdowns
      document.querySelectorAll('.dropdown-options.show').forEach(other => {
        if (other !== options) {
          other.classList.remove('show');
          other.parentElement.querySelector('.dropdown-selected').classList.remove('active');
        }
      });

      options.classList.toggle('show');
      selected.classList.toggle('active');
    });

    optionItems.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Actualizar selección
        optionItems.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        
        // Actualizar texto mostrado
        const selectedText = selected.querySelector('.selected-text');
        selectedText.textContent = option.textContent;
        
        // Cerrar dropdown
        options.classList.remove('show');
        selected.classList.remove('active');
        
        // Actualizar precio si es necesario
        actualizarPrecioSegunOpciones();
      });
    });
  });

  // Cerrar dropdowns al hacer click fuera
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.opciones-dropdown')) {
      document.querySelectorAll('.dropdown-options.show').forEach(options => {
        options.classList.remove('show');
        options.parentElement.querySelector('.dropdown-selected').classList.remove('active');
      });
    }
  });
}

// Función para actualizar precio según opciones seleccionadas
function actualizarPrecioSegunOpciones() {
  const material = document.querySelector('[data-opcion="material"] .selected-text').textContent;
  const dimension = document.querySelector('[data-opcion="dimensiones"] .selected-text').textContent;
  
  // Aquí puedes implementar lógica para cambiar precios según material/dimensión
  // Por ahora mantiene el precio base
  console.log('Opciones seleccionadas:', { material, dimension });
}

// Función para manejar cantidad en detalle
function inicializarCantidadDetalle() {
  const cantidadInput = document.querySelector('.cantidad-input');
  if (cantidadInput) {
    cantidadInput.addEventListener('change', function() {
      const cantidad = Math.max(1, parseInt(this.value) || 1);
      this.value = cantidad;
    });
  }
}

// Función para cambiar cantidad
let cantidadActual = 1;

function cambiarCantidad(cambio) {
  cantidadActual = Math.max(1, cantidadActual + cambio);
  document.getElementById('cantidad-actual').textContent = cantidadActual;
}

// Función para manejar radio buttons
function inicializarRadioButtons() {
  document.querySelectorAll('input[name="material"]').forEach(radio => {
    radio.addEventListener('change', function() {
      // Actualizar labels visuales
      document.querySelectorAll('input[name="material"] + label').forEach(label => {
        label.textContent = label.textContent.replace('●', '○');
      });
      this.nextElementSibling.textContent = this.nextElementSibling.textContent.replace('○', '●');
    });
  });

  document.querySelectorAll('input[name="dimensiones"]').forEach(radio => {
    radio.addEventListener('change', function() {
      // Actualizar labels visuales
      document.querySelectorAll('input[name="dimensiones"] + label').forEach(label => {
        label.textContent = label.textContent.replace('●', '○');
      });
      this.nextElementSibling.textContent = this.nextElementSibling.textContent.replace('○', '●');
    });
  });
}


// Inicializar dropdowns de detalle (Material y Dimensiones)
function inicializarDropdownDetalle(idToggle, idMenu) {
  const toggle = document.getElementById(idToggle);
  const menu = document.getElementById(idMenu);
  const selectedText = toggle.querySelector('.selected-option');

  toggle.addEventListener('click', () => {
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  });

  menu.querySelectorAll('li').forEach(item => {
    item.addEventListener('click', () => {
      selectedText.textContent = item.textContent;
      menu.style.display = 'none';
    });
  });

  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      menu.style.display = 'none';
    }
  });
}

// Llamar cuando cargue detalle
inicializarDropdownDetalle('dropdownMaterial', 'dropdownMenuMaterial');
inicializarDropdownDetalle('dropdownDimensiones', 'dropdownMenuDimensiones');