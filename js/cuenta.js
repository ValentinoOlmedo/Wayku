// --------------------- Sistema de Cuenta ---------------------

// Estado del usuario
let usuarioActual = null;

// Cambiar entre formularios - CORREGIDO
function cambiarFormulario(tipo) {
  console.log('Cambiando a formulario:', tipo);
  
  const forms = document.querySelectorAll('.auth-form');
  forms.forEach(form => {
    form.classList.remove('active');
    form.style.display = 'none';
  });
  
  const targetForm = document.getElementById(`${tipo}-form`);
  if (targetForm) {
    targetForm.style.display = 'block';
    targetForm.classList.add('active');
    limpiarMensajeAuth();
  } else {
    console.error('No se encontró el formulario:', `${tipo}-form`);
  }
}

// Mostrar mensajes
function mostrarMensajeAuth(texto, tipo = 'success') {
  console.log('Mostrando mensaje:', texto, tipo);
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

// Enviar link por email
function enviarLinkEmail() {
  console.log('Enviando link por email...');
  const emailInput = document.querySelector('#login-form input[type="email"]');
  if (!emailInput) {
    console.error('No se encontró el input de email');
    return;
  }
  
  const email = emailInput.value.trim();
  
  if (!email) {
    mostrarMensajeAuth('Por favor ingresa tu email', 'error');
    return;
  }
  
  if (!validarEmailAuth(email)) {
    mostrarMensajeAuth('Por favor ingresa un email válido', 'error');
    return;
  }
  
  mostrarMensajeAuth(`Se envió un link de inicio de sesión a ${email}`, 'success');
}

// Validar email
function validarEmailAuth(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Validar contraseña
function validarPassword(password) {
  return password && password.length >= 8;
}

// Inicializar sistema de cuenta
function inicializarCuenta() {
  console.log('Inicializando sistema de cuenta...');
  
  // Asegurarse de que el formulario de login esté activo por defecto
  setTimeout(() => {
    cambiarFormulario('login');
  }, 100);

  // Manejar login
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('Procesando login...');
      
      const email = this.querySelector('input[type="email"]').value.trim();
      const password = this.querySelector('input[type="password"]').value.trim();
      
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
      
      setTimeout(() => {
        usuarioActual = { 
          email, 
          nombre: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)
        };
        
        mostrarMensajeAuth(`¡Bienvenido de vuelta, ${usuarioActual.nombre}!`, 'success');
        
        btnSubmit.textContent = textoOriginal;
        btnSubmit.disabled = false;
        
        setTimeout(() => {
          console.log('Usuario logueado:', usuarioActual);
          actualizarHeaderUsuario(usuarioActual);
          
          // Volver al inicio usando tu sistema de navegación
          if (window.navegacion && window.navegacion.volverAInicio) {
            window.navegacion.volverAInicio();
          } else {
            // Fallback
            const inicioLink = document.querySelector('a[href="#inicio"]');
            if (inicioLink) {
              inicioLink.click();
            }
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
      console.log('Procesando registro...');
      
      const nombre = this.querySelector('input[placeholder="Nombre completo"]').value.trim();
      const email = this.querySelector('input[type="email"]').value.trim();
      const password = this.querySelector('input[placeholder="Contraseña"]').value.trim();
      const confirmPassword = this.querySelector('input[placeholder="Confirmar contraseña"]').value.trim();
      const terms = this.querySelector('#terms') ? this.querySelector('#terms').checked : false;
      
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
          actualizarHeaderUsuario(usuarioActual);
          
          if (window.navegacion && window.navegacion.volverAInicio) {
            window.navegacion.volverAInicio();
          } else {
            const inicioLink = document.querySelector('a[href="#inicio"]');
            if (inicioLink) {
              inicioLink.click();
            }
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
      console.log('Procesando recuperación...');
      
      const email = this.querySelector('input[type="email"]').value.trim();
      
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
      console.log('Click en botón social');
      
      const provider = this.textContent.trim().includes('Google') ? 'Google' :
                      this.textContent.trim().includes('Facebook') ? 'Facebook' :
                      this.textContent.trim().includes('Apple') ? 'Apple' : 'Proveedor';
      
      mostrarMensajeAuth(`Conectando con ${provider}...`, 'success');
      
      setTimeout(() => {
        usuarioActual = { 
          email: `usuario@${provider.toLowerCase()}.com`, 
          nombre: `Usuario ${provider}`,
          provider 
        };
        mostrarMensajeAuth(`Login con ${provider} exitoso`, 'success');
        
        setTimeout(() => {
          actualizarHeaderUsuario(usuarioActual);
          if (window.navegacion && window.navegacion.volverAInicio) {
            window.navegacion.volverAInicio();
          }
        }, 1500);
      }, 1500);
    });
  });

  // Agregar link de recuperación
  agregarLinkRecuperacion();
  
  console.log('✅ Sistema de cuenta inicializado correctamente');
}

// Agregar link de "¿Olvidaste tu contraseña?"
function agregarLinkRecuperacion() {
  const loginForm = document.getElementById('login-form');
  if (loginForm && !loginForm.querySelector('.forgot-password-link')) {
    const forgotLink = document.createElement('div');
    forgotLink.className = 'form-switch forgot-password-link';
    forgotLink.innerHTML = '<a href="#" onclick="cambiarFormulario(\'recovery\')">¿Olvidaste tu contraseña?</a>';
    
    // Insertar después del segundo form-group (contraseña)
    const passwordGroup = loginForm.querySelectorAll('.form-group')[1];
    if (passwordGroup) {
      passwordGroup.insertAdjacentElement('afterend', forgotLink);
    }
  }
}

// Actualizar header cuando usuario se loguea
function actualizarHeaderUsuario(usuario) {
  const userIcon = document.querySelector('.header-icons a[href="#cuenta"] i');
  if (userIcon && usuario) {
    userIcon.classList.remove('ph-bold', 'ph-user');
    userIcon.classList.add('ph-fill', 'ph-user-circle');
    
    const userLink = userIcon.parentElement;
    userLink.title = `Logueado como: ${usuario.nombre}`;
    
    console.log('Header actualizado para usuario:', usuario.nombre);
  }
}

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
  
  // Limpiar formularios
  document.querySelectorAll('.auth-form').forEach(form => {
    if (form.tagName === 'FORM') {
      form.reset();
    }
  });
  
  cambiarFormulario('login');
  console.log('Sesión cerrada');
}

// Funciones de utilidad
function obtenerUsuarioActual() {
  return usuarioActual;
}

function usuarioLogueado() {
  return usuarioActual !== null;
}

// Exportar para uso global
window.cuenta = {
  cambiarFormulario,
  cerrarSesion,
  obtenerUsuarioActual,
  usuarioLogueado,
  enviarLinkEmail
};