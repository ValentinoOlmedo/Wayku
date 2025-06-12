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
const dropdown = document.querySelector('.dropdown');
const toggle = document.getElementById('dropdownText');
const menu = document.getElementById('dropdownMenu');
const selectedOption = document.querySelector('.selected-option');
const options = menu.querySelectorAll('li');
const gridProductos = document.querySelector('.grid-productos');

// Mostrar/ocultar barra de búsqueda
searchToggle.addEventListener('click', () => {
  searchBar.classList.toggle('visible');
});
// Manejo de navegación por secciones
links.forEach(link => {
  link.addEventListener('click', (e) => {
    const target = link.getAttribute('href'); 
    const id = target.replace('#', '');

    // Subrayar solo el enlace del menú correspondiente
    const menuLink = document.querySelector('.nav-list a[href="' + target + '"]');
    if (menuLink) {
      links.forEach(l => l.classList.remove('active'));
      menuLink.classList.add('active');
    }

    // Mostrar/ocultar secciones
    if (id === 'inicio') {
      sections.forEach(section => {
        if (
          section.id === 'catalogo' ||
          section.id === 'contacto' ||
          section.id === 'preguntas-frecuentes' ||
          section.id === 'sobre-nosotros' ||
          section.id === 'carrito'
        ) {
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
        section.style.display = (section.id === 'contacto' || section.id === 'preguntas-frecuentes') ? '' : 'none';
      });
    } else if (id === 'sobre-nosotros') {
      sections.forEach(section => {
        section.style.display = section.id === 'sobre-nosotros' ? '' : 'none';
      });
    } else if (id === 'carrito') {
      sections.forEach(section => {
        section.style.display = section.id === 'carrito' ? '' : 'none';
      });
    } else if (id === 'favoritos') {
      sections.forEach(section => {
        section.style.display = section.id === 'favoritos' ? '' : 'none';
      });
    }
  });
});

// Ocultar todas las secciones especiales al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  if (catalogoSection) {
    catalogoSection.style.display = 'none';
    contactoSection.style.display = 'none';
    preguntasfrecuentesSection.style.display = 'none';
    sobrenosotrosSection.style.display = 'none';
    carritoSection.style.display = 'none';
    favoritosSection.style.display = 'none';
  }
});

// Dropdown de ordenamiento
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

// Ordenamiento de productos
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

// Filtros de productos
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

// Formulario de contacto
document.querySelector('.contacto-form').addEventListener('submit', function(e) {
  e.preventDefault(); 
  this.reset();
});

// Preguntas frecuentes
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    item.classList.toggle('open');
  });
});

const carrito = {};

document.addEventListener("DOMContentLoaded", () => {
  actualizarTotales();
  const botonesCarrito = document.querySelectorAll(".ph-shopping-cart");

  botonesCarrito.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      e.preventDefault();

      const productCard = boton.closest(".product-card");
      const nombre = productCard.querySelector("h3").textContent;
      const imagen = productCard.querySelector("img").src;
      const precioData = productCard.getAttribute("data-precio");

      let precio = parseFloat(precioData);
      if (isNaN(precio)) {
        // Fallback si data-precio falla
        const textoVisible = pElemento.textContent;
        precio = parseFloat(textoVisible.replace(/[^\d.]/g, ""));
      }

      if (carrito[nombre]) return;

      carrito[nombre] = { nombre, precio, imagen, cantidad: 1 };

      agregarProductoAlCarrito(carrito[nombre]);
      actualizarTotales();
      
    });
  });
});

function agregarProductoAlCarrito(producto) {
  const lista = document.getElementById("lista-carrito");

  const item = document.createElement("div");
  item.classList.add("carrito-item");
  item.dataset.nombre = producto.nombre;

  item.innerHTML = `
    <div>
      <img src="${producto.imagen}" alt="${producto.nombre}">
    </div>
    <div class="info-producto">
      <h3>${producto.nombre}</h3>
    </div>
    <div class="precio-unitario">
      $${producto.precio.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </div>
    <div>
      <input type="number" class="input-cantidad" value="1" min="1">
    </div>
    <div class="subtotal">
      $${producto.precio.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </div>
    <div>
      <button class="eliminar-producto" data-nombre="${producto.nombre}">&#10005;</button>
    </div>
  `;

  const inputCantidad = item.querySelector(".input-cantidad");
  inputCantidad.addEventListener("input", () => {
    const nuevaCantidad = Math.max(1, parseInt(inputCantidad.value) || 1);
    carrito[producto.nombre].cantidad = nuevaCantidad;
    actualizarSubtotal(producto.nombre, item);
    actualizarTotales();
  });

  item.querySelector(".eliminar-producto").addEventListener("click", () => {
    delete carrito[producto.nombre];
    item.remove();
    actualizarTotales();
  });

  lista.appendChild(item);
}

function actualizarTotales() {
  let totalProductos = 0;
  let cantidadItems = 0;

  for (const nombre in carrito) {
    const producto = carrito[nombre];
    totalProductos += producto.cantidad * producto.precio;
    cantidadItems += producto.cantidad;
  }

  const envio = 4827.59;
  const totalFinal = totalProductos + envio;

  const formatoPesos = (monto) =>
    `$ ${monto.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const totalProductosEl = document.getElementById("total-productos");
  const costoEnvioEl = document.getElementById("costo-envio");
  const totalFinalEl = document.getElementById("total-final");
  const tituloCarritoEl = document.getElementById("titulo-carrito");
  const cabeceraEl = document.getElementById("cabecera-carrito");
  const resumenEl = document.getElementById("resumen-carrito");

  if (cantidadItems === 0) {
    // Carrito vacío: ocultar columnas y resumen, cambiar título
    if (tituloCarritoEl) tituloCarritoEl.textContent = "Tu carrito está vacío.";
    if (cabeceraEl) cabeceraEl.style.display = "none";
    if (resumenEl) resumenEl.style.display = "none";
  } else {
    // Carrito con productos: mostrar todo normalmente
    if (tituloCarritoEl) tituloCarritoEl.textContent = "Tu pedido /";
    if (cabeceraEl) cabeceraEl.style.display = "grid";
    if (resumenEl) resumenEl.style.display = "block";

    totalProductosEl.textContent = formatoPesos(totalProductos);
    costoEnvioEl.textContent = formatoPesos(envio);
    totalFinalEl.textContent = formatoPesos(totalFinal);

    const lineaProducto = document.querySelector(".linea-resumen span");
    if (lineaProducto) {
      lineaProducto.textContent = cantidadItems === 1 ? "Producto" : `Productos (${cantidadItems})`;
    }
  }
}


function aplicarDescuento(porcentaje) {
  let totalProductos = 0;

  for (const nombre in carrito) {
    const producto = carrito[nombre];
    totalProductos += producto.cantidad * producto.precio;
  }

  const descuento = totalProductos * (porcentaje / 100);
  const envio = 4827.59;
  const totalFinal = totalProductos - descuento + envio;

  const formatoPesos = (monto) =>
    `$ ${monto.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Mostrar valores sin modificar el total de productos
  document.getElementById("total-productos").textContent = formatoPesos(totalProductos);
  document.getElementById("costo-envio").textContent = formatoPesos(envio);
  document.getElementById("total-final").textContent = formatoPesos(totalFinal);

  // Mostrar línea de descuento
  const lineaDescuento = document.getElementById("linea-descuento");
  const valorDescuento = document.getElementById("valor-descuento");

  if (lineaDescuento && valorDescuento) {
    lineaDescuento.style.display = "flex";
    valorDescuento.textContent = `- ${formatoPesos(descuento)}`;
  }
}


// MOSTRAR y CERRAR el modal de cupón
document.addEventListener("DOMContentLoaded", () => {
  const botonCupon = document.querySelector(".codigo-cupon");
  const modal = document.getElementById("modal-cupon");
  const cerrarModal = document.getElementById("cerrar-modal");

  if (botonCupon && modal && cerrarModal) {
    botonCupon.addEventListener("click", () => {
      modal.style.display = "flex";  // Mostrar el modal
    });

    cerrarModal.addEventListener("click", () => {
      modal.style.display = "none";  // Ocultar modal al hacer click en ❌
    });

    // También cerrar si clickea fuera del modal
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }
});

const botonAplicarCupon = document.querySelector(".formulario-cupon button");
const inputCupon = document.getElementById("campo-cupon");
const mensajeError = document.querySelector(".mensaje-error");

let cuponAplicado = false;

botonAplicarCupon.addEventListener("click", () => {
  const codigo = inputCupon.value.trim().toUpperCase();

  if (codigo === "FIRSTORDER5" && !cuponAplicado) {
    cuponAplicado = true;
    mensajeError.style.display = "none";
    aplicarDescuento(5); // 5% de descuento
    document.getElementById("modal-cupon").style.display = "none";
  } else {
    mensajeError.style.display = "block";
  }
});


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

      if (listaFavoritos[nombre]) return;

      listaFavoritos[nombre] = { nombre, precio, imagen };

      agregarAFavoritos(listaFavoritos[nombre]);
      actualizarVistaFavoritos();
    });
  });

  actualizarVistaFavoritos(); // Ejecutar al cargar también
}

function agregarAFavoritos(producto) {
  const lista = document.getElementById("lista-favoritos");

  const item = document.createElement("div");
  item.classList.add("favorito-item");
  item.dataset.nombre = producto.nombre;

  item.innerHTML = `
    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
      <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 50px; height: auto;">
      <div>
        <h3 style="margin: 0;">${producto.nombre}</h3>
        <p style="margin: 0; color: gray;">$${producto.precio.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</p>
      </div>
      <button class="eliminar-favorito" data-nombre="${producto.nombre}" style="margin-left: auto; background: none; border: none; font-size: 1.2rem; color: red; cursor: pointer;">
        &#10005;
      </button>
    </div>
  `;

  item.querySelector(".eliminar-favorito").addEventListener("click", () => {
    delete listaFavoritos[producto.nombre];
    item.remove();
    actualizarVistaFavoritos();
  });

  lista.appendChild(item);
}

function actualizarVistaFavoritos() {
  const lista = document.getElementById("lista-favoritos");
  const mensajeVacio = document.getElementById("favoritos-vacio");
  const titulo = document.getElementById("titulo-favoritos");

  const cantidad = Object.keys(listaFavoritos).length;

  if (cantidad === 0) {
    mensajeVacio.style.display = "block";
    titulo.textContent = "Todavía no agregaste favoritos.";
    lista.innerHTML = "";
  } else {
    mensajeVacio.style.display = "none";
    titulo.textContent = "Tus favoritos /";
  }
}

// Ejecutar una sola vez todo después de que el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  inicializarFavoritos();
});