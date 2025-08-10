// --------------------- Sistema de Cuenta ---------------------

// Estado del usuario (simulado)
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
    
    // Auto-ocultar después de 5 segundos
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

// Enviar link por email
function enviarLinkEmail() {
  const emailInput = document.querySelector('#login-form input[type="email"]');
  if (!emailInput) return;
  
  const email = emailInput.value;
  
  if (!email) {
    mostrarMensajeAuth('Por favor ingresa tu email', 'error');
    return;
  }
  
  // Simular envío
  mostrarMensajeAuth(`Se envió un link de inicio de sesión a ${email}`, 'success');
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
  // Manejar login
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = this.querySelector('input[type="email"]').value;
      const password = this.querySelector('input[type="password"]').value;
      
      // Validaciones básicas
      if (!email || !password) {
        mostrarMensajeAuth('Por favor completa todos los campos', 'error');
        return;
      }
      
      if (!validarEmailAuth(email)) {
        mostrarMensajeAuth('Por favor ingresa un email válido', 'error');
        return;
      }
      
      // Simular login (aquí harías la petición real al servidor)
      const btnSubmit = this.querySelector('.btn-primary');
      const textoOriginal = btnSubmit.textContent;
      btnSubmit.textContent = 'Iniciando sesión...';
      btnSubmit.disabled = true;
      
      setTimeout(() => {
        usuarioActual = { email, nombre: email.split('@')[0] };
        mostrarMensajeAuth(`¡Bienvenido de vuelta, ${usuarioActual.nombre}!`, 'success');
        
        btnSubmit.textContent = textoOriginal;
        btnSubmit.disabled = false;
        
        // Aquí podrías redirigir o actualizar el header
        setTimeout(() => {
          console.log('Usuario logueado:', usuarioActual);
          
          // Volver al inicio
          if (window.navegacion) {
            window.navegacion.volverAInicio();
          }
        }, 1500);
      }, 1000);
    });
  }

  // Manejar registro
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const nombre = this.querySelector('input[placeholder="Nombre completo"]').value;
      const email = this.querySelector('input[type="email"]').value;
      const password = this.querySelector('input[placeholder="Contraseña"]').value;
      const confirmPassword = this.querySelector('input[placeholder="Confirmar contraseña"]').value;
      const terms = this.querySelector('#terms').checked;
      
      // Validaciones
      if (!nombre || !email || !password || !confirmPassword) {
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
      
      // Simular registro
      const btnSubmit = this.querySelector('.btn-primary');
      const textoOriginal = btnSubmit.textContent;
      btnSubmit.textContent = 'Creando cuenta...';
      btnSubmit.disabled = true;
      
      setTimeout(() => {
        usuarioActual = { email, nombre };
        mostrarMensajeAuth(`¡Cuenta creada exitosamente! Bienvenido, ${nombre}`, 'success');
        
        btnSubmit.textContent = textoOriginal;
        btnSubmit.disabled = false;
        
        setTimeout(() => {
          console.log('Usuario registrado:', usuarioActual);
          // Volver al inicio
          if (window.navegacion) {
            window.navegacion.volverAInicio();
          }
        }, 1500);
      }, 1000);
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
      
      // Simular envío
      const btnSubmit = this.querySelector('.btn-primary');
      const textoOriginal = btnSubmit.textContent;
      btnSubmit.textContent = 'Enviando...';
      btnSubmit.disabled = true;
      
      setTimeout(() => {
        mostrarMensajeAuth(`Se envió un enlace de recuperación a ${email}`, 'success');
        btnSubmit.textContent = textoOriginal;
        btnSubmit.disabled = false;
        
        setTimeout(() => {
          cambiarFormulario('login');
        }, 2000);
      }, 1000);
    });
  }

  // Manejar botones sociales
  document.querySelectorAll('.btn-social').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const provider = this.textContent.trim().split(' ').pop();
      mostrarMensajeAuth(`Conectando con ${provider}...`, 'success');
      
      // Aquí implementarías la integración real con OAuth
      setTimeout(() => {
        // Simular login exitoso
        usuarioActual = { email: `usuario@${provider.toLowerCase()}.com`, nombre: 'Usuario', provider };
        mostrarMensajeAuth(`Login con ${provider} exitoso`, 'success');
        
        setTimeout(() => {
          actualizarHeaderUsuario(usuarioActual);
          if (window.navegacion) {
            window.navegacion.volverAInicio();
          }
        }, 1500);
      }, 2000);
    });
  });

  // Agregar link de recuperación al formulario de login
  agregarLinkRecuperacion();
  
  console.log('Sistema de cuenta inicializado correctamente');
}



// Función para logout (para usar desde otros scripts)
function cerrarSesion() {
  usuarioActual = null;
  const userIcon = document.querySelector('.header-icons a[href="#cuenta"] i');
  if (userIcon) {
    userIcon.classList.remove('ph-fill', 'ph-user-circle');
    userIcon.classList.add('ph-bold', 'ph-user');
    
    const userLink = userIcon.parentElement;
    userLink.title = '';
  }
  
  // Limpiar formularios
  document.querySelectorAll('.auth-form').forEach(form => {
    if (form.tagName === 'FORM') {
      form.reset();
    }
  });
  
  // Mostrar formulario de login
  cambiarFormulario('login');
  
  console.log('Sesión cerrada');
}

// Obtener usuario actual
function obtenerUsuarioActual() {
  return usuarioActual;
}

// Verificar si hay usuario logueado
function usuarioLogueado() {
  return usuarioActual !== null;
}

// Exportar funciones para uso global
window.cuenta = {
  cambiarFormulario,
  cerrarSesion,
  obtenerUsuarioActual,
  usuarioLogueado,
  enviarLinkEmail
};



// Agregar link de recuperación al formulario de login
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

// Funciones para mostrar políticas
function mostrarPoliticas() {
  document.getElementById('modal-politicas').style.display = 'flex';
}

function mostrarPrivacidad() {
  document.getElementById('modal-privacidad').style.display = 'flex';
}

// Exportar las funciones
window.mostrarPoliticas = mostrarPoliticas;
window.mostrarPrivacidad = mostrarPrivacidad;


function irAContacto() {
  if (window.navegacion) {
    window.navegacion.mostrarSeccion('contacto');
  }
}

window.irAContacto = irAContacto;