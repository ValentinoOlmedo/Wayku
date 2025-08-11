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
function inicializarProductoDetalle() {
  // Event listeners para clicks en productos del catálogo
  document.addEventListener('click', function(e) {
    // Buscar si el click fue en un producto
    const productCard = e.target.closest('.product-card');
    const productCardBestseller = e.target.closest('.product-cardd');
    
    if (productCard || productCardBestseller) {
      const card = productCard || productCardBestseller;
      const nombreProducto = card.querySelector('h3').textContent;
      
      // Verificar que no sea un click en los botones de acción
      if (!e.target.closest('.btn-agregar-carrito') && 
          !e.target.closest('.btn-agregar-favorito') && 
          !e.target.closest('.card-icons')) {
        e.preventDefault();
        mostrarDetalleProducto(nombreProducto);
      }
    }
  });

  // Event listeners para thumbnails
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('thumbnail')) {
      const nuevaImagen = e.target.getAttribute('data-imagen');
      cambiarImagenPrincipal(nuevaImagen);
    }
  });

  // Event listener para agregar al carrito desde detalle
  const btnCarritoDetalle = document.getElementById('btn-agregar-carrito-detalle');
  if (btnCarritoDetalle) {
    btnCarritoDetalle.addEventListener('click', function() {
      const titulo = document.getElementById('producto-titulo').textContent;
      const precioTexto = document.getElementById('producto-precio').textContent;
      const precio = parseFloat(precioTexto.replace(/[^\d]/g, ''));
      const imagen = document.getElementById('imagen-principal').src;

      const producto = {
        nombre: titulo,
        precio: precio,
        imagen: imagen,
        cantidad: 1
      };

      // Verificar si ya está en el carrito
      if (carrito[titulo]) {
        carrito[titulo].cantidad += 1;
        // Actualizar cantidad en DOM si existe
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

      // Feedback visual
      this.textContent = '¡Agregado!';
      this.style.backgroundColor = '#28a745';
      setTimeout(() => {
        this.textContent = 'Add to cart';
        this.style.backgroundColor = '#5d725b';
      }, 1500);
    });
  }

  // Event listener para favoritos desde detalle
  const btnFavoritoDetalle = document.getElementById('btn-favorito-detalle');
  if (btnFavoritoDetalle) {
    btnFavoritoDetalle.addEventListener('click', function() {
      const titulo = document.getElementById('producto-titulo').textContent;
      const precioTexto = document.getElementById('producto-precio').textContent;
      const precio = parseFloat(precioTexto.replace(/[^\d]/g, ''));
      const imagen = document.getElementById('imagen-principal').src;

      const icono = this.querySelector('i');

      if (listaFavoritos[titulo]) {
        // Remover de favoritos
        delete listaFavoritos[titulo];
        icono.classList.remove('ph-fill');
        icono.classList.add('ph-bold');
        
        // Remover del DOM de favoritos si existe
        const item = document.querySelector(`.favorito-item[data-nombre="${titulo}"]`);
        if (item) item.remove();
      } else {
        // Agregar a favoritos
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

  console.log('✅ Producto detalle inicializado');
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