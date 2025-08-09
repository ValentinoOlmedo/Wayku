// --------------------- Inicialización Principal ---------------------

// Función principal de inicialización
function inicializarAplicacion() {
  console.log('🚀 Inicializando aplicación Wayku...');
  
  // Inicializar navegación
  inicializarNavegacion();
  console.log('✅ Navegación inicializada');
  
  // Inicializar carrito
  inicializarCarrito();
  actualizarTotales();
  console.log('✅ Carrito inicializado');
  
  // Inicializar favoritos
  inicializarFavoritos();
  console.log('✅ Favoritos inicializados');
  
  // Inicializar cupones
  inicializarCupones();
  console.log('✅ Cupones inicializados');
  
  // Inicializar formularios de pago
  inicializarPago();
  console.log('✅ Pago inicializado');
  
  // Inicializar FAQ
  inicializarFAQ();
  console.log('✅ FAQ inicializado');
  
  // Inicializar contacto
  inicializarContacto();
  console.log('✅ Contacto inicializado');
  
  // Formatear campos de teléfono
  const telefonos = document.querySelectorAll('input[name="telefono"], input[type="tel"]');
  telefonos.forEach(formatearTelefono);
  console.log('✅ Formateo de teléfonos inicializado');
  
  // Inicializar animaciones (opcional)
  if (!esMobile()) {
    animarAlScroll();
    console.log('✅ Animaciones inicializadas');
  }
  
  console.log('🎉 Aplicación Wayku inicializada correctamente');
}

// Event listener principal
document.addEventListener("DOMContentLoaded", inicializarAplicacion);

// Manejo de errores globales
window.addEventListener('error', function(e) {
  console.error('❌ Error en la aplicación:', e.error);
  // Aquí podrías enviar el error a un servicio de logging
});

// Manejo de promesas rechazadas
window.addEventListener('unhandledrejection', function(e) {
  console.error('❌ Promesa rechazada:', e.reason);
  // Aquí podrías enviar el error a un servicio de logging
});

// Función para reinicializar componentes después de cambios dinámicos
function reinicializarComponentes() {
  // Re-aplicar event listeners para elementos dinámicos
  const nuevosProductos = document.querySelectorAll('.product-card:not([data-initialized])');
  nuevosProductos.forEach(producto => {
    producto.setAttribute('data-initialized', 'true');
    
    // Reinicializar botones de carrito para nuevos productos
    const btnCarrito = producto.querySelector('.btn-agregar-carrito');
    if (btnCarrito && !btnCarrito.hasAttribute('data-listener')) {
      btnCarrito.setAttribute('data-listener', 'true');
      // Aquí añadirías los event listeners necesarios
    }
    
    // Reinicializar botones de favoritos para nuevos productos
    const btnFavorito = producto.querySelector('.ph-heart');
    if (btnFavorito && !btnFavorito.hasAttribute('data-listener')) {
      btnFavorito.setAttribute('data-listener', 'true');
      // Aquí añadirías los event listeners necesarios
    }
  });
}

// Función para limpiar datos (útil para desarrollo/testing)
function limpiarDatos() {
  if (confirm('¿Estás seguro de que quieres limpiar todos los datos?')) {
    // Limpiar carrito
    Object.keys(carrito).forEach(key => delete carrito[key]);
    
    // Limpiar favoritos
    Object.keys(listaFavoritos).forEach(key => delete listaFavoritos[key]);
    
    // Resetear cupones
    if (typeof resetearCupones === 'function') {
      resetearCupones();
    }
    
    // Actualizar vistas
    actualizarTotales();
    actualizarVistaFavoritos();
    
    // Limpiar lista del carrito
    const listaCarrito = document.getElementById('lista-carrito');
    if (listaCarrito) listaCarrito.innerHTML = '';
    
    // Resetear iconos
    document.querySelectorAll('.ph-fill').forEach(icono => {
      icono.classList.remove('ph-fill');
      icono.classList.add('ph-bold');
    });
    
    console.log('🧹 Datos limpiados correctamente');
    mostrarNotificacion('Datos limpiados correctamente', 'success');
  }
}

// Función de debug para mostrar estado actual
function mostrarEstadoAplicacion() {
  console.log('📊 Estado actual de la aplicación:');
  console.log('Carrito:', carrito);
  console.log('Favoritos:', listaFavoritos);
  console.log('Cupón aplicado:', cuponAplicado);
  console.log('Porcentaje descuento:', porcentajeDescuento);
  
  const totalProductos = Object.keys(carrito).length;
  const totalFavoritos = Object.keys(listaFavoritos).length;
  
  mostrarNotificacion(`Carrito: ${totalProductos} | Favoritos: ${totalFavoritos}`, 'info');
}

// Exportar funciones para uso en consola (desarrollo)
window.wayku = {
  limpiarDatos,
  mostrarEstadoAplicacion,
  reinicializarComponentes,
  carrito,
  listaFavoritos
};