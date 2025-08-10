// --------------------- Favoritos ---------------------
const listaFavoritos = {};

function inicializarFavoritos() {
  const botonesFavorito = document.querySelectorAll(".ph-heart");

  botonesFavorito.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      e.preventDefault();

      const card = boton.closest(".product-card");
      const nombre = card.querySelector("h3").textContent;
      const imagen = card.querySelector("img").src;
      const precio = parseFloat(card.getAttribute("data-precio")) || 0;

      if (listaFavoritos[nombre]) {
        delete listaFavoritos[nombre];
        boton.classList.remove("ph-fill");
        boton.classList.add("ph-bold");
        const item = document.querySelector(`.favorito-item[data-nombre="${nombre}"]`);
        if (item) item.remove();
      } else {
        listaFavoritos[nombre] = { nombre, precio, imagen };
        agregarAFavoritos(listaFavoritos[nombre]);
        boton.classList.remove("ph-bold");
        boton.classList.add("ph-fill");
      }

      actualizarVistaFavoritos();
    });
  });

  actualizarVistaFavoritos();
}

// Función para agregar producto a favoritos con el nuevo diseño
function agregarAFavoritos(producto) {
  const lista = document.getElementById("lista-favoritos");
  if (!lista) return;

  const item = document.createElement("div");
  item.classList.add("favorito-item");
  item.dataset.nombre = producto.nombre;

  item.innerHTML = `
    <div class="imagen-producto">
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <button class="eliminar-favorito" data-nombre="${producto.nombre}">
        <i class="ph ph-x"></i>
      </button>
    </div>
    <div class="info-producto">
      <h3>${producto.nombre}</h3>
      <p class="precio">$${producto.precio.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</p>
      <div class="favorito-actions">
        <button class="btn-agregar-carrito-fav" data-nombre="${producto.nombre}">
          Agregar al carrito
        </button>
        <button class="btn-ver-producto" title="Ver producto">
          <i class="ph ph-eye"></i>
        </button>
      </div>
    </div>
  `;

  // Event listeners
  const btnEliminar = item.querySelector(".eliminar-favorito");
  const btnAgregarCarrito = item.querySelector(".btn-agregar-carrito-fav");
  const btnVerProducto = item.querySelector(".btn-ver-producto");

  // Eliminar de favoritos
  btnEliminar.addEventListener("click", () => {
    delete listaFavoritos[producto.nombre];
    item.remove();
    actualizarVistaFavoritos();

    // Desmarcar el ícono de "me gusta" en el catálogo
    const todasLasCards = document.querySelectorAll(".product-card");
    todasLasCards.forEach((card) => {
      const nombreCard = card.querySelector("h3").textContent;
      if (nombreCard === producto.nombre) {
        const icono = card.querySelector(".ph-heart");
        if (icono) {
          icono.classList.remove("ph-fill");
          icono.classList.add("ph-bold");
        }
      }
    });
  });

  // Agregar al carrito desde favoritos
  btnAgregarCarrito.addEventListener("click", () => {
    // Verificar si ya está en el carrito
    if (carrito[producto.nombre]) {
      // Si ya está, incrementar cantidad
      carrito[producto.nombre].cantidad += 1;
      
      // Actualizar la cantidad en el DOM del carrito
      const itemCarrito = document.querySelector(`.carrito-item[data-nombre="${producto.nombre}"]`);
      if (itemCarrito) {
        const inputCantidad = itemCarrito.querySelector('.input-cantidad');
        inputCantidad.value = carrito[producto.nombre].cantidad;
        actualizarSubtotal(producto.nombre, itemCarrito);
      }
    } else {
      // Si no está, agregarlo
      carrito[producto.nombre] = { 
        nombre: producto.nombre, 
        precio: producto.precio, 
        imagen: producto.imagen, 
        cantidad: 1 
      };
      agregarProductoAlCarrito(carrito[producto.nombre]);

      // Marcar como agregado en el catálogo
      const todasLasCards = document.querySelectorAll(".product-card");
      todasLasCards.forEach((card) => {
        const nombreCard = card.querySelector("h3").textContent;
        if (nombreCard === producto.nombre) {
          const icono = card.querySelector(".btn-agregar-carrito i");
          if (icono) {
            icono.classList.remove("ph-bold");
            icono.classList.add("ph-fill");
          }
        }
      });
    }

    actualizarTotales();
    
    // Feedback visual
    btnAgregarCarrito.textContent = "¡Agregado!";
    btnAgregarCarrito.style.backgroundColor = "#28a745";
    setTimeout(() => {
      btnAgregarCarrito.textContent = "Agregar al carrito";
      btnAgregarCarrito.style.backgroundColor = "#5d725b";
    }, 1500);
  });

  // Ver producto (scroll al catálogo y resaltar)
  btnVerProducto.addEventListener("click", () => {
    // Usar la función de navegación centralizada
    if (window.navegacion) {
      window.navegacion.mostrarSeccion('catalogo');
    }
    // Ir al catálogo
    const catalogoEl = document.getElementById('catalogo');
    const favoritosEl = document.getElementById('favoritos');
    
    if (catalogoEl) catalogoEl.style.display = 'block';
    if (favoritosEl) favoritosEl.style.display = 'none';
    
    // Actualizar navegación
    document.querySelectorAll('.nav-list a').forEach(link => link.classList.remove('active'));
    const catalogoLink = document.querySelector('.nav-list a[href="#catalogo"]');
    if (catalogoLink) catalogoLink.classList.add('active');
    
    // Scroll al top
    window.scrollTo(0, 0);
    
    // Resaltar producto (opcional)
    setTimeout(() => {
      const todasLasCards = document.querySelectorAll(".product-card");
      todasLasCards.forEach((card) => {
        const nombreCard = card.querySelector("h3").textContent;
        if (nombreCard === producto.nombre) {
          card.style.transform = "scale(1.05)";
          card.style.boxShadow = "0 8px 24px rgba(93, 114, 91, 0.3)";
          setTimeout(() => {
            card.style.transform = "";
            card.style.boxShadow = "";
          }, 2000);
        }
      });
    }, 500);
  });

  lista.appendChild(item);
}

// Función mejorada para actualizar vista de favoritos
function actualizarVistaFavoritos() {
  const lista = document.getElementById("lista-favoritos");
  const mensajeVacio = document.getElementById("favoritos-vacio");
  const titulo = document.getElementById("titulo-favoritos");

  const cantidad = Object.keys(listaFavoritos).length;

  if (cantidad === 0) {
    if (mensajeVacio) {
      mensajeVacio.style.display = "flex";
      mensajeVacio.innerHTML = `
        <i class="ph ph-heart"></i>
        <span>Todavía no agregaste favoritos</span>
        <small style="margin-top: 0.5rem; color: #999;">Explorá nuestro catálogo y marcá los productos que más te gusten</small>
      `;
    }
    if (titulo) titulo.textContent = "Tus favoritos";
    if (lista) lista.innerHTML = "";
  } else {
    if (mensajeVacio) mensajeVacio.style.display = "none";
    if (titulo) titulo.textContent = `Tus favoritos (${cantidad})`;
  }
}