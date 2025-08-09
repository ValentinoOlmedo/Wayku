// --------------------- Carrito ---------------------
const carrito = {};
let porcentajeDescuento = 0;

function agregarProductoAlCarrito(producto) {
  const lista = document.getElementById("lista-carrito");
  if (!lista) return;

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
  item.querySelector(".subtotal").textContent = `${subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
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
  actualizarTotales();
}

// Navegación del carrito al pago
function inicializarCarrito() {
  const botonCatalogo = document.querySelector(".boton-catalogo");
  if (botonCatalogo) {
    botonCatalogo.addEventListener("click", () => {
      // Oculta la sección del carrito
      const carritoSection = document.getElementById("carrito");
      const pagoSection = document.getElementById("pago");
      
      if (carritoSection) carritoSection.style.display = "none";
      if (pagoSection) {
        pagoSection.style.display = "block";
        pagoSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Event listeners para agregar al carrito
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
}