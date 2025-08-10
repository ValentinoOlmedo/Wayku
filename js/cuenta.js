// js/cuenta.js - VERSIÓN COMPLETA CON BASE DE DATOS

// Estado del usuario
let usuarioActual = null;

// Cambiar entre formularios
function cambiarFormulario(tipo) {
  const forms = document.querySelectorAll('.auth-form');
  forms.forEach(form => form.classList.remove('active'));
  
  const targetForm = document.getElementById(`${tipo}-form`);
  if (targetForm) {
    targetForm.classList.add('active');
    limpiarMensajeAuth();
  }
}

// Mostrar mensajes
function mostrarMensajeAuth(texto, tipo = 'success') {
  const messageEl = document.getElementById('auth-message');
  if (messageEl) {
    messageEl.textContent = texto;
    messageEl.className = `auth-message ${tipo}`;
    messageEl.style.display = 'block';
    
    setTimeout(() => {
      messageEl.style.display = 'none';
    }, 5000);
  }
}

function limpiarMensajeAuth() {
  const messageEl = document.getElementById('auth-message');
  if (messageEl) {
    messageEl.style.display = 'none';
  }
}

// Validar email
function validarEmailAuth(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Validar contraseña
function validarPassword(password) {
  return password.length >= 8;
}

// Inicializar sistema de cuenta
function inicializarCuenta() {
  console.log('🔐 Inicializando sistema de cuenta...');

  // Manejar login con BASE DE DATOS
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = this.querySelector('input[type="email"]').value;
      const password = this.querySelector('input[type="password"]').value;
      
      if (!email || !password) {
        mostrarMensajeAuth('Por favor completa todos los campos', 'error');
        return;
      }
      
      if (!validarEmailAuth(email)) {
        mostrarMensajeAuth('Por favor ingresa un email válido', 'error');
        return;
      }
      
      const btnSubmit = this.querySelector('.btn-primary');
      const textoOriginal = btnSubmit.textContent;
      btnSubmit.textContent = 'Iniciando sesión...';
      btnSubmit.disabled = true;
      
      // CONEXIÓN CON BASE DE DATOS
      fetch('api/auth.php?action=login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          usuarioActual = data.user;
          mostrarMensajeAuth(`¡Bienvenido de vuelta, ${data.user.nombre}!`, 'success');
          
          setTimeout(() => {
            actualizarHeaderUsuario(usuarioActual);
            if (window.navegacion) {
              window.navegacion.volverAInicio();
            }
          }, 1500);
        } else {
          mostrarMensajeAuth(data.error || 'Error al iniciar sesión', 'error');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        mostrarMensajeAuth('Error de conexión. Verifica que el servidor esté funcionando.', 'error');
      })
      .finally(() => {
        btnSubmit.textContent = textoOriginal;
        btnSubmit.disabled = false;
      });
    });
  }

  // Manejar registro con BASE DE DATOS
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = this.querySelector('input[type="email"]').value;
      const password = this.querySelector('input[placeholder="Contraseña"]').value;
      const confirmPassword = this.querySelector('input[placeholder="Confirmar contraseña"]').value;
      const terms = this.querySelector('#terms').checked;
      
      const nombre = email.split('@')[0]; // Usar parte del email como nombre
      
      // Validaciones
      if (!email || !password || !confirmPassword) {
        mostrarMensajeAuth('Por favor completa todos los campos', 'error');
        return;
      }
      
      if (!validarEmailAuth(email)) {
        mostrarMensajeAuth('Por favor ingresa un email válido', 'error');
        return;
      }
      
      if (password !== confirmPassword) {
        mostrarMensajeAuth('Las contraseñas no coinciden', 'error');
        return;
      }
      
      if (!validarPassword(password)) {
        mostrarMensajeAuth('La contraseña debe tener al menos 8 caracteres', 'error');
        return;
      }
      
      if (!terms) {
        mostrarMensajeAuth('Debes aceptar los términos y condiciones', 'error');
        return;
      }
      
      const btnSubmit = this.querySelector('.btn-primary');
      const textoOriginal = btnSubmit.textContent;
      btnSubmit.textContent = 'Creando cuenta...';
      btnSubmit.disabled = true;
      
      // CONEXIÓN CON BASE DE DATOS
      fetch('api/auth.php?action=register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, email, password })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          usuarioActual = data.user;
          mostrarMensajeAuth(`¡Cuenta creada exitosamente! Bienvenido, ${data.user.nombre}`, 'success');
          
          setTimeout(() => {
            actualizarHeaderUsuario(usuarioActual);
            if (window.navegacion) {
              window.navegacion.volverAInicio();
            }
          }, 1500);
        } else {
          mostrarMensajeAuth(data.error || 'Error al crear la cuenta', 'error');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        mostrarMensajeAuth('Error de conexión. Verifica que el servidor esté funcionando.', 'error');
      })
      .finally(() => {
        btnSubmit.textContent = textoOriginal;
        btnSubmit.disabled = false;
      });
    });
  }

  // Manejar recuperación
  const recoveryForm = document.getElementById('recovery-form');
  if (recoveryForm) {
    recoveryForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = this.querySelector('input[type="email"]').value;
      
      if (!email) {
        mostrarMensajeAuth('Por favor ingresa tu email', 'error');
        return;
      }
      
      if (!validarEmailAuth(email)) {
        mostrarMensajeAuth('Por favor ingresa un email válido', 'error');
        return;
      }
      
      const btnSubmit = this.querySelector('.btn-primary');
      const textoOriginal = btnSubmit.textContent;
      btnSubmit.textContent = 'Enviando...';
      btnSubmit.disabled = true;
      
      // CONEXIÓN CON BASE DE DATOS
      fetch('api/auth.php?action=recovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          mostrarMensajeAuth(data.message, 'success');
          setTimeout(() => {
            cambiarFormulario('login');
          }, 2000);
        } else {
          mostrarMensajeAuth(data.error || 'Error al enviar el enlace', 'error');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        mostrarMensajeAuth('Error de conexión. Verifica que el servidor esté funcionando.', 'error');
      })
      .finally(() => {
        btnSubmit.textContent = textoOriginal;
        btnSubmit.disabled = false;
      });
    });
  }

  // Manejar botones sociales (simulado)
  document.querySelectorAll('.btn-social').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const provider = this.textContent.trim().includes('Google') ? 'Google' : 'Apple';
      mostrarMensajeAuth(`Función de ${provider} no implementada aún`, 'error');
    });
  });

  // Agregar link de recuperación
  agregarLinkRecuperacion();
  
  console.log('✅ Sistema de cuenta inicializado con base de datos');
}

// Actualizar header cuando usuario se loguea
function actualizarHeaderUsuario(usuario) {
  const userIcon = document.querySelector('.header-icons a[href="#cuenta"] i');
  if (userIcon && usuario) {
    userIcon.classList.remove('ph-bold', 'ph-user');
    userIcon.classList.add('ph-fill', 'ph-user-circle');
    
    const userLink = userIcon.parentElement;
    userLink.title = `${usuario.nombre} (${usuario.email})`;
  }
}

// Agregar link de recuperación
function agregarLinkRecuperacion() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    const existingLink = loginForm.querySelector('.forgot-password-link');
    if (!existingLink) {
      const forgotLink = document.createElement('div');
      forgotLink.className = 'form-switch forgot-password-link';
      forgotLink.style.marginTop = '1rem';
      forgotLink.innerHTML = '<a href="#" onclick="cambiarFormulario(\'recovery\')">¿Olvidaste tu contraseña?</a>';
      
      const divider = loginForm.querySelector('.divider');
      if (divider) {
        loginForm.insertBefore(forgotLink, divider);
      }
    }
  }
}

// Funciones para políticas como sección
function mostrarPoliticasPrivacidad() {
  if (window.navegacion) {
    window.navegacion.mostrarSeccion('politicas');
  }
}

// Event listeners para políticas
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href="#"]').forEach(link => {
    const texto = link.textContent.toLowerCase();
    
    if (texto.includes('privacidad')) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        mostrarPoliticasPrivacidad();
      });
    }
  });
});

// Función para logout
function cerrarSesion() {
  usuarioActual = null;
  const userIcon = document.querySelector('.header-icons a[href="#cuenta"] i');
  if (userIcon) {
    userIcon.classList.remove('ph-fill', 'ph-user-circle');
    userIcon.classList.add('ph-bold', 'ph-user');
    
    const userLink = userIcon.parentElement;
    userLink.title = '';
  }
  
  document.querySelectorAll('.auth-form').forEach(form => {
    if (form.tagName === 'FORM') {
      form.reset();
    }
  });
  
  cambiarFormulario('login');
  console.log('Sesión cerrada');
}

// Funciones para usar desde otros archivos
function obtenerUsuarioActual() {
  return usuarioActual;
}

function usuarioLogueado() {
  return usuarioActual !== null;
}

function irAContacto() {
  if (window.navegacion) {
    window.navegacion.mostrarSeccion('contacto');
  }
}

// Exportar funciones
window.cuenta = {
  cambiarFormulario,
  cerrarSesion,
  obtenerUsuarioActual,
  usuarioLogueado
};

window.mostrarPoliticasPrivacidad = mostrarPoliticasPrivacidad;
window.irAContacto = irAContacto;