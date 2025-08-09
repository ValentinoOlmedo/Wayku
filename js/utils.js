// --------------------- Utilidades y FAQ ---------------------

// Inicializar FAQ
function inicializarFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('open');
      
      // Cerrar todos los otros items
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
        }
      });
      
      // Toggle del item actual
      item.classList.toggle('open');
    });
  });
}

// Inicializar formulario de contacto
function inicializarContacto() {
  const contactoForm = document.querySelector('.contacto-form');
  if (contactoForm) {
    contactoForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validar campos
      const campos = this.querySelectorAll('input[required], textarea[required]');
      let formularioValido = true;
      
      campos.forEach(campo => {
        if (!campo.value.trim()) {
          formularioValido = false;
          campo.style.borderColor = '#e74c3c';
        } else {
          campo.style.borderColor = '#ccc';
        }
      });
      
      if (!formularioValido) {
        alert('Por favor, completa todos los campos requeridos.');
        return;
      }
      
      // Simular envío
      const btnEnviar = this.querySelector('.btn-enviar');
      const textoOriginal = btnEnviar.textContent;
      
      btnEnviar.textContent = 'Enviando...';
      btnEnviar.disabled = true;
      
      setTimeout(() => {
        alert('¡Mensaje enviado correctamente! Te responderemos a la brevedad.');
        this.reset();
        btnEnviar.textContent = textoOriginal;
        btnEnviar.disabled = false;
      }, 2000);
    });
  }
}

// Función para validar email
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Función para validar teléfono
function validarTelefono(telefono) {
  const regex = /^[\d\s\-\+\(\)]{8,15}$/;
  return regex.test(telefono.replace(/\s/g, ''));
}

// Función para formatear números de teléfono
function formatearTelefono(input) {
  input.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
      if (value.length <= 3) {
        value = value;
      } else if (value.length <= 6) {
        value = value.substring(0, 3) + ' ' + value.substring(3);
      } else {
        value = value.substring(0, 3) + ' ' + value.substring(3, 6) + ' ' + value.substring(6, 10);
      }
    }
    e.target.value = value;
  });
}

// Función para animar elementos al scroll (opcional)
function animarAlScroll() {
  const elementos = document.querySelectorAll('.product-card, .bloque-info, .faq-item');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elementos.forEach(elemento => {
    elemento.style.opacity = '0';
    elemento.style.transform = 'translateY(20px)';
    elemento.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(elemento);
  });
}

// Función para detectar dispositivos móviles
function esMobile() {
  return window.innerWidth <= 768;
}

// Función para smooth scroll personalizado
function smoothScrollTo(elementId, offset = 0) {
  const elemento = document.getElementById(elementId);
  if (elemento) {
    const posicion = elemento.offsetTop - offset;
    window.scrollTo({
      top: posicion,
      behavior: 'smooth'
    });
  }
}

// Función para copiar texto al portapapeles
function copiarAlPortapapeles(texto) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(texto);
  } else {
    // Fallback para navegadores más antiguos
    const textArea = document.createElement("textarea");
    textArea.value = texto;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((resolve, reject) => {
      document.execCommand('copy') ? resolve() : reject();
      textArea.remove();
    });
  }
}

// Función para formatear precios
function formatearPrecio(precio) {
  return `${precio.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
}

// Función para debounce (útil para search, filtros, etc.)
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Función para mostrar notificaciones toast
function mostrarNotificacion(mensaje, tipo = 'info', duracion = 3000) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: ${tipo === 'success' ? '#28a745' : tipo === 'error' ? '#dc3545' : '#007bff'};
    color: white;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10001;
    font-family: 'Poppins', sans-serif;
    max-width: 300px;
    animation: slideInRight 0.3s ease;
  `;
  
  toast.textContent = mensaje;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease forwards';
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, duracion);
}

// Agregar estilos para las animaciones de toast
if (!document.querySelector('#toast-styles')) {
  const style = document.createElement('style');
  style.id = 'toast-styles';
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}