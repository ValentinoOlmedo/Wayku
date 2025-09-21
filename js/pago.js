// --------------------- Pago ---------------------
function inicializarPago() {
  console.log('Inicializando módulo de pago...');

  // Formulario de envío (primera parte)
  const formEnvio = document.getElementById("form-envio");
  if (formEnvio) {
    formEnvio.addEventListener("submit", function (e) {
      e.preventDefault();

      // Validar campos requeridos
      const camposRequeridos = formEnvio.querySelectorAll("[required]");
      let formValido = true;

      camposRequeridos.forEach((campo) => {
        if (!campo.value.trim()) {
          formValido = false;
          campo.style.borderColor = "#e74c3c";
        } else {
          campo.style.borderColor = "#ccc";
        }
      });

      if (!formValido) {
        alert("Por favor, completa todos los campos requeridos.");
        return;
      }

      // Navegar a la segunda parte del pago
      navegarAPago2();
    });
  }

  // Manejar selección de método de pago
  const metodosPago = document.querySelectorAll('input[name="metodo"]');
  metodosPago.forEach(metodo => {
    metodo.addEventListener('change', manejarCambioMetodo);
  });

  // Botón de confirmar pago
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    // Remover event listeners anteriores
    const nuevoBtn = checkoutBtn.cloneNode(true);
    checkoutBtn.parentNode.replaceChild(nuevoBtn, checkoutBtn);
    
    // Agregar nuevo event listener
    nuevoBtn.addEventListener("click", confirmarPago);
  }

  // Actualizar resumen
  actualizarResumen();
}

function navegarAPago2() {
  // Usar navegación centralizada si existe
  if (window.navegacion) {
    window.navegacion.mostrarSeccion("pago2");
  }

  // Ocultar sección actual y mostrar pago2
  const pagoSection = document.getElementById("pago");
  const pago2Section = document.getElementById("pago2");

  if (pagoSection) pagoSection.style.display = "none";
  if (pago2Section) {
    pago2Section.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function manejarCambioMetodo(e) {
  const metodo = e.target.value;
  const datosTargeta = document.getElementById('datos-tarjeta');
  
  // Mostrar/ocultar campos de tarjeta
  if (metodo === 'tarjeta' && datosTargeta) {
    datosTargeta.style.display = 'block';
  } else if (datosTargeta) {
    datosTargeta.style.display = 'none';
  }
  
  console.log('Método de pago seleccionado:', metodo);
}

async function confirmarPago() {
  const metodoSeleccionado = document.querySelector('input[name="metodo"]:checked');
  
  if (!metodoSeleccionado) {
    alert("Por favor, selecciona un método de pago.");
    return;
  }

  const boton = document.getElementById("checkout-btn");
  const textoOriginal = boton.textContent;
  
  // Deshabilitar botón y mostrar loading
  boton.disabled = true;
  boton.textContent = "Procesando...";

  try {
    await procesarPago(metodoSeleccionado.value);
  } catch (error) {
    console.error('Error al procesar pago:', error);
    alert('Error al procesar el pago. Por favor intenta nuevamente.');
  } finally {
    // Restaurar botón
    boton.disabled = false;
    boton.textContent = textoOriginal;
  }
}

async function procesarPago(metodo) {
  console.log('Procesando pago con método:', metodo);

  switch (metodo) {
    case "mercado-pago":
      await procesarMercadoPago();
      break;

    case "transferencia":
      mostrarDatosTransferencia();
      break;

    case "tarjeta":
      await procesarMercadoPago(); // Usar Mercado Pago para tarjetas también
      break;

    default:
      throw new Error('Método de pago no válido');
  }
}

async function procesarMercadoPago() {
  try {
    console.log('Iniciando proceso de Mercado Pago...');

    // Obtener items del carrito (puedes modificar esto según tu carrito)
    const items = obtenerItemsCarrito();
    
    if (items.length === 0) {
      alert('No hay productos en el carrito');
      return;
    }

    console.log('Items a procesar:', items);

    // Llamar al backend para crear la preferencia
    const response = await fetch("http://localhost:3000/api/pago/crear-preferencia", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ items })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('Preferencia creada:', data);

    // Redirigir al checkout de Mercado Pago
    if (data.init_point) {
      console.log('Redirigiendo a:', data.init_point);
      window.location.href = data.init_point;
    } else {
      throw new Error('No se recibió el init_point de Mercado Pago');
    }

  } catch (error) {
    console.error("Error en procesarMercadoPago:", error);
    throw error;
  }
}

function obtenerItemsCarrito() {
  // Por ahora retornamos datos de ejemplo
  // Puedes modificar esto para obtener datos reales de tu carrito
  
  // Intentar obtener del carrito global si existe
  if (window.carrito && window.carrito.length > 0) {
    return window.carrito.map(item => ({
      id: item.id || '1',
      title: item.nombre || item.title || 'Producto',
      quantity: item.cantidad || item.quantity || 1,
      unit_price: parseFloat(item.precio || item.unit_price || 0)
    }));
  }
  
  // Si no hay carrito, usar datos de ejemplo
  return [
    {
      id: '1',
      title: "Lámpara Waykú",
      quantity: 1,
      unit_price: 50000
    }
  ];
}
function mostrarDatosTransferencia() {
  // Mostrar modal en lugar de alert
  const modal = document.getElementById('modal-transferencia');
  if (modal) {
    modal.style.display = 'flex';
  } else {
    // Fallback si no existe el modal
    alert(`
🏦 DATOS PARA TRANSFERENCIA BANCARIA

Banco: Banco Galicia  
CBU: 0070055030004055550015
Alias: WAYKU.LAMPARAS
Titular: Wayku S.A.
CUIT: 30-12345678-9

💬 Enviá el comprobante por WhatsApp:
+54 351 384 4333
    `);
  }
}

function actualizarResumen() {
  // Actualizar resumen de compra
  const resumenProductos = document.getElementById('resumen-productos');
  const resumenEnvio = document.getElementById('resumen-envio');
  const resumenTotal = document.getElementById('resumen-total-final');
  
  const items = obtenerItemsCarrito();
  const subtotal = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  const envio = 5000; // Costo de envío fijo
  const total = subtotal + envio;
  
  if (resumenProductos) resumenProductos.textContent = `$ ${subtotal.toLocaleString()}`;
  if (resumenEnvio) resumenEnvio.textContent = `$ ${envio.toLocaleString()}`;
  if (resumenTotal) resumenTotal.textContent = `$ ${total.toLocaleString()}`;
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarPago);
} else {
  inicializarPago();
}

// Export para usar en otros módulos si es necesario
window.pagoModule = {
  inicializarPago,
  procesarPago,
  actualizarResumen
};

// Funciones para el modal de transferencia
function mostrarModalTransferencia() {
  const modal = document.getElementById('modal-transferencia');
  if (modal) {
    modal.style.display = 'flex';
  }
}

function cerrarModalTransferencia() {
  const modal = document.getElementById('modal-transferencia');
  if (modal) {
    modal.style.display = 'none';
  }
}

function copiarDato(texto) {
  navigator.clipboard.writeText(texto).then(function() {
    // Encontrar el botón que fue clickeado
    const botones = document.querySelectorAll('.btn-copiar');
    botones.forEach(btn => {
      if (btn.textContent === 'Copiar' && btn.onclick.toString().includes(texto)) {
        btn.textContent = '¡Copiado!';
        btn.classList.add('copiado');
        
        setTimeout(() => {
          btn.textContent = 'Copiar';
          btn.classList.remove('copiado');
        }, 2000);
      }
    });
  }).catch(function(err) {
    console.error('Error al copiar: ', err);
    alert('Dato copiado: ' + texto);
  });
}

// Event listeners para el modal de transferencia
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('modal-transferencia');
  const cerrarBtn = document.getElementById('cerrar-modal-transferencia');
  
  if (cerrarBtn) {
    cerrarBtn.addEventListener('click', cerrarModalTransferencia);
  }
  
  // Cerrar al hacer clic fuera del modal
  if (modal) {
    window.addEventListener('click', function(event) {
      if (event.target === modal) {
        cerrarModalTransferencia();
      }
    });
  }
});