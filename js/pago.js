// --------------------- Pago ---------------------
function inicializarPago() {
  // Formulario de envío
  const formEnvio = document.getElementById("form-envio");
  if (formEnvio) {
    formEnvio.addEventListener("submit", function(e) {
      e.preventDefault();

      // Validar campos requeridos
      const camposRequeridos = formEnvio.querySelectorAll('[required]');
      let formValido = true;
      
      camposRequeridos.forEach(campo => {
        if (!campo.value.trim()) {
          formValido = false;
          campo.style.borderColor = '#e74c3c';
        } else {
          campo.style.borderColor = '#ccc';
        }
      });

      if (!formValido) {
        alert('Por favor, completa todos los campos requeridos.');
        return;
      }
      // Usar navegación centralizada
      if (window.navegacion) {
        window.navegacion.mostrarSeccion('pago2');
      }
      // Ocultar la sección actual y mostrar pago2
      const pagoSection = document.getElementById("pago");
      const pago2Section = document.getElementById("pago2");
      
      if (pagoSection) pagoSection.style.display = "none";
      if (pago2Section) {
        pago2Section.style.display = "block";
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  // Método de pago - mostrar/ocultar datos de tarjeta
  document.querySelectorAll('input[name="metodo"]').forEach((radio) => {
    radio.addEventListener('change', function () {
      const datosTarjeta = document.getElementById('datos-tarjeta');
      if (this.value === 'tarjeta' && datosTarjeta) {
        datosTarjeta.style.display = 'block';
        datosTarjeta.querySelectorAll('input, select').forEach(input => {
          input.required = true;
        });
      } else if (datosTarjeta) {
        datosTarjeta.style.display = 'none';
        datosTarjeta.querySelectorAll('input, select').forEach(input => {
          input.required = false;
        });
      }
    });
  });

  // Formulario de pago final
  const formPago = document.getElementById("form-pago");
  if (formPago) {
    formPago.addEventListener("submit", function(e) {
      e.preventDefault();
      
      // Validar método de pago seleccionado
      const metodoSeleccionado = document.querySelector('input[name="metodo"]:checked');
      if (!metodoSeleccionado) {
        alert('Por favor, selecciona un método de pago.');
        return;
      }

      // Si es tarjeta, validar campos adicionales
      if (metodoSeleccionado.value === 'tarjeta') {
        const camposTarjeta = document.querySelectorAll('#datos-tarjeta [required]');
        let tarjetaValida = true;
        
        camposTarjeta.forEach(campo => {
          if (!campo.value.trim()) {
            tarjetaValida = false;
            campo.style.borderColor = '#e74c3c';
          } else {
            campo.style.borderColor = '#ccc';
          }
        });

        if (!tarjetaValida) {
          alert('Por favor, completa todos los datos de la tarjeta.');
          return;
        }
      }

      // Procesar pago según método
      procesarPago(metodoSeleccionado.value);
    });
  }

  // Formateo de campos
  inicializarFormateoTarjeta();
}

function procesarPago(metodo) {
  switch (metodo) {
    case 'mercado-pago':
      // Simular redirección a Mercado Pago
      alert('Redirigiendo a Mercado Pago para completar el pago...');
      // window.location.href = 'https://mercadopago.com/...';
      break;
      
    case 'transferencia':
      // Mostrar datos para transferencia
      mostrarDatosTransferencia();
      break;
      
    case 'tarjeta':
      // Procesar tarjeta
      procesarTarjeta();
      break;
  }
}

function mostrarDatosTransferencia() {
  alert(`
    Datos para transferencia:
    
    Banco: Banco Galicia
    CBU: 0070055030004055550015
    Alias: WAYKU.LAMPARAS
    Titular: Wayku S.A.
    CUIT: 30-12345678-9
    
    Por favor, envía el comprobante por WhatsApp al +54 351 384 4333
  `);
}

function procesarTarjeta() {
  // Simular procesamiento de tarjeta
  const loadingOverlay = document.createElement('div');
  loadingOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 1.2rem;
    z-index: 10000;
  `;
  loadingOverlay.textContent = 'Procesando pago...';
  document.body.appendChild(loadingOverlay);

  setTimeout(() => {
    document.body.removeChild(loadingOverlay);
    alert('¡Pago procesado exitosamente! Recibirás un email de confirmación.');
    // Limpiar carrito y redirigir
    Object.keys(carrito).forEach(key => delete carrito[key]);
    actualizarTotales();
    // Redirigir a página de confirmación o inicio
  }, 3000);
}

function inicializarFormateoTarjeta() {
  // Formatear número de tarjeta
  const numeroTarjeta = document.querySelector('input[name="numeroTarjeta"]');
  if (numeroTarjeta) {
    numeroTarjeta.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
      e.target.value = value;
    });
  }

  // Formatear vencimiento
  const vencimiento = document.querySelector('input[name="vencimiento"]');
  if (vencimiento) {
    vencimiento.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      e.target.value = value;
    });
  }

  // Limitar CVV
  const cvv = document.querySelector('input[name="cvv"]');
  if (cvv) {
    cvv.addEventListener('input', function(e) {
      e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
    });
  }
}