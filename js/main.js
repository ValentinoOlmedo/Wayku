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

searchToggle.addEventListener('click', () => {
  searchBar.classList.toggle('visible');
});

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

// --------------------- Filtros y Ordenamiento ---------------------
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

    if (criterio === 'menor precio') return precioA - precioB;
    if (criterio === 'mayor precio') return precioB - precioA;
    return 0;
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

// --------------------- Carrito ---------------------
const carrito = {};
let porcentajeDescuento = 0;

function agregarProductoAlCarrito(producto) {
  const lista = document.getElementById("lista-carrito");

  const item = document.createElement("div");
  item.classList.add("carrito-item");
  item.dataset.nombre = producto.nombre;

  item.innerHTML = `
    <div><img src="${producto.imagen}" alt="${producto.nombre}"></div>
    <div class="info-producto"><h3>${producto.nombre}</h3></div>
    <div class="precio-unitario">$${producto.precio.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</div>
    <div><input type="number" class="input-cantidad" value="1" min="1"></div>
    <div class="subtotal">$${producto.precio.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</div>
    <div><button class="eliminar-producto" data-nombre="${producto.nombre}">&#10005;</button></div>
  `;

  item.querySelector(".input-cantidad").addEventListener("input", () => {
    const nuevaCantidad = Math.max(1, parseInt(item.querySelector(".input-cantidad").value) || 1);
    carrito[producto.nombre].cantidad = nuevaCantidad;
    actualizarSubtotal(producto.nombre, item);
    actualizarTotales();
  });

  item.querySelector(".eliminar-producto").addEventListener("click", () => {
    delete carrito[producto.nombre];
    item.remove();
    actualizarTotales();

    // Desmarcar ícono de carrito en el catálogo
    const todasLasCards = document.querySelectorAll(".product-card");
    todasLasCards.forEach((card) => {
      const nombreCard = card.querySelector("h3").textContent;
      if (nombreCard === producto.nombre) {
        const icono = card.querySelector(".btn-agregar-carrito i");
        if (icono) {
          icono.classList.remove("ph-fill");
          icono.classList.add("ph-bold");
        }
      }
    });
  });

  lista.appendChild(item);
}

function actualizarSubtotal(nombre, item) {
  const producto = carrito[nombre];
  const subtotal = producto.precio * producto.cantidad;
  item.querySelector(".subtotal").textContent = `$${subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
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
  const descuento = totalProductos * (porcentajeDescuento / 100);
  const totalFinal = totalProductos - descuento + envio;

  const formatoPesos = (monto) =>
    `$ ${monto.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;

  // --- Sección carrito ---
  const totalProductosEl = document.getElementById("total-productos");
  const costoEnvioEl = document.getElementById("costo-envio");
  const totalFinalEl = document.getElementById("total-final");
  const tituloCarritoEl = document.getElementById("titulo-carrito");
  const cabeceraEl = document.getElementById("cabecera-carrito");
  const resumenEl = document.getElementById("resumen-carrito");
  const lineaDescuento = document.getElementById("linea-descuento");
  const valorDescuento = document.getElementById("valor-descuento");

  if (cantidadItems === 0) {
    if (tituloCarritoEl) tituloCarritoEl.textContent = "Tu carrito está vacío.";
    if (cabeceraEl) cabeceraEl.style.display = "none";
    if (resumenEl) resumenEl.style.display = "none";
    if (lineaDescuento) lineaDescuento.style.display = "none";
  } else {
    if (tituloCarritoEl) tituloCarritoEl.textContent = "Tu pedido /";
    if (cabeceraEl) cabeceraEl.style.display = "grid";
    if (resumenEl) resumenEl.style.display = "block";

    if (totalProductosEl) totalProductosEl.textContent = formatoPesos(totalProductos);
    if (costoEnvioEl) costoEnvioEl.textContent = formatoPesos(envio);
    if (totalFinalEl) totalFinalEl.textContent = formatoPesos(totalFinal);

    // Actualizar texto de productos/pluralidad en carrito
    const lineaProducto = document.querySelector("#resumen-carrito .linea-resumen span:first-child");
    if (lineaProducto) {
      lineaProducto.textContent = cantidadItems === 1 ? "Producto" : `Productos (${cantidadItems})`;
    }

    if (lineaDescuento && valorDescuento) {
      if (porcentajeDescuento > 0) {
        lineaDescuento.style.display = "flex";
        valorDescuento.textContent = `- ${formatoPesos(descuento)}`;
      } else {
        lineaDescuento.style.display = "none";
      }
    }
  }

  // --- Sección pago ---
  const totalProductosPagoEl = document.getElementById("total-productos-pago");
  const costoEnvioPagoEl = document.getElementById("costo-envio-pago");
  const totalFinalPagoEl = document.getElementById("total-final-pago");
  const lineaDescuentoPago = document.getElementById("linea-descuento-pago");
  const valorDescuentoPago = document.getElementById("valor-descuento-pago");

  // Actualizamos siempre (aunque cantidadItems sea 0, para mantener coherencia)
  if (totalProductosPagoEl) totalProductosPagoEl.textContent = formatoPesos(totalProductos);
  if (costoEnvioPagoEl) costoEnvioPagoEl.textContent = formatoPesos(envio);
  if (totalFinalPagoEl) totalFinalPagoEl.textContent = formatoPesos(totalFinal);

  if (lineaDescuentoPago && valorDescuentoPago) {
    if (porcentajeDescuento > 0) {
      lineaDescuentoPago.style.display = "flex";
      valorDescuentoPago.textContent = `- ${formatoPesos(descuento)}`;
    } else {
      lineaDescuentoPago.style.display = "none";
    }
  }
}

function aplicarDescuento(porcentaje) {
  porcentajeDescuento = porcentaje;
  let totalProductos = 0;
  for (const nombre in carrito) {
    const producto = carrito[nombre];
    totalProductos += producto.cantidad * producto.precio;
  }

  const descuento = totalProductos * (porcentaje / 100);
  const envio = 4827.59;
  const totalFinal = totalProductos - descuento + envio;

  const formatoPesos = (monto) => `$ ${monto.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;

  document.getElementById("total-productos").textContent = formatoPesos(totalProductos);
  document.getElementById("costo-envio").textContent = formatoPesos(envio);
  document.getElementById("total-final").textContent = formatoPesos(totalFinal);

  const lineaDescuento = document.getElementById("linea-descuento");
  const valorDescuento = document.getElementById("valor-descuento");

  if (lineaDescuento && valorDescuento) {
    lineaDescuento.style.display = "flex";
    valorDescuento.textContent = `- ${formatoPesos(descuento)}`;
  }
  actualizarTotales();
}


document.querySelector(".boton-catalogo").addEventListener("click", () => {
  // Oculta la sección del carrito
  document.getElementById("carrito").style.display = "none";
  // Muestra la sección de pago
  document.getElementById("pago").style.display = "block";

  // (Opcional) Desplazar hacia arriba la nueva sección
  document.getElementById("pago").scrollIntoView({ behavior: "smooth" });
});



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

// --------------------- Código de Cupón ---------------------
const botonAplicarCupon = document.querySelector(".formulario-cupon button");
const inputCupon = document.getElementById("campo-cupon");
const mensajeError = document.querySelector(".mensaje-error");
let cuponAplicado = false;

botonAplicarCupon.addEventListener("click", () => {
  const codigo = inputCupon.value.trim().toUpperCase();
  if (codigo === "FIRSTORDER5" && !cuponAplicado) {
    cuponAplicado = true;
    mensajeError.style.display = "none";
    aplicarDescuento(5);
    document.getElementById("modal-cupon").style.display = "none";
  } else {
    mensajeError.style.display = "block";
  }
});

// --------------------- Inicialización al cargar ---------------------
document.addEventListener("DOMContentLoaded", () => {
  catalogoSection.style.display = 'none';
  contactoSection.style.display = 'none';
  preguntasfrecuentesSection.style.display = 'none';
  sobrenosotrosSection.style.display = 'none';
  carritoSection.style.display = 'none';
  favoritosSection.style.display = 'none';
  actualizarTotales();

  // Carrito
  document.querySelectorAll(".btn-agregar-carrito").forEach((boton) => {
    boton.addEventListener("click", (e) => {
      e.preventDefault();

      const productCard = boton.closest(".product-card");
      const nombre = productCard.querySelector("h3").textContent;
      const imagen = productCard.querySelector("img").src;
      const precioData = productCard.getAttribute("data-precio");
      let precio = parseFloat(precioData);

      if (isNaN(precio)) {
        const textoVisible = productCard.querySelector("p").textContent;
        precio = parseFloat(textoVisible.replace(/[^\d.]/g, ""));
      }

      const icono = boton.querySelector("i");

      if (carrito[nombre]) {
        // Quitar del carrito si ya existe
        delete carrito[nombre];

        // Quitar del DOM el item del carrito
        const item = document.querySelector(`.carrito-item[data-nombre="${nombre}"]`);
        if (item) item.remove();

        // Cambiar ícono a no relleno
        icono.classList.remove("ph-fill");
        icono.classList.add("ph-bold");

        actualizarTotales();
      } else {
        // Agregar al carrito
        carrito[nombre] = { nombre, precio, imagen, cantidad: 1 };
        agregarProductoAlCarrito(carrito[nombre]);
        actualizarTotales();

        // Cambiar ícono a relleno
        icono.classList.remove("ph-bold");
        icono.classList.add("ph-fill");
      }
    });
  });

  // Inicializar favoritos
  inicializarFavoritos();

  // Modal cupón
  const botonCupon = document.querySelector(".codigo-cupon");
  const modal = document.getElementById("modal-cupon");
  const cerrarModal = document.getElementById("cerrar-modal");

  if (botonCupon && modal && cerrarModal) {
    botonCupon.addEventListener("click", () => modal.style.display = "flex");
    cerrarModal.addEventListener("click", () => modal.style.display = "none");
    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
    });
  }

  // Contacto
  const contactoForm = document.querySelector('.contacto-form');
  if (contactoForm) {
    contactoForm.addEventListener('submit', function(e) {
      e.preventDefault();
      this.reset();
    });
  }

  // FAQ
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.parentElement.classList.toggle('open');
    });
  });
});




document.getElementById("form-envio").addEventListener("submit", function(e) {
    e.preventDefault();

    // Ocultar la sección actual
    document.getElementById("pago").style.display = "none";

    // Mostrar la siguiente sección
    document.getElementById("pago2").style.display = "block";

    // Opcional: scroll al inicio
    window.scrollTo({ top: 0, behavior: "smooth" });

  });



document.querySelectorAll('input[name="metodo"]').forEach((radio) => {
  radio.addEventListener('change', function () {
    const datosTarjeta = document.getElementById('datos-tarjeta');
    if (this.value === 'tarjeta') {
      datosTarjeta.style.display = 'block';
      datosTarjeta.querySelectorAll('input, select').forEach(i => i.required = true);
    } else {
      datosTarjeta.style.display = 'none';
      datosTarjeta.querySelectorAll('input, select').forEach(i => i.required = false);
    }
  });
});