// --------------------- Código de Cupón ---------------------
let cuponAplicado = false;

function inicializarCupones() {
  const botonAplicarCupon = document.querySelector(".formulario-cupon button");
  const inputCupon = document.getElementById("campo-cupon");
  const mensajeError = document.querySelector(".mensaje-error");
  const botonCupon = document.querySelector(".codigo-cupon");
  const modal = document.getElementById("modal-cupon");
  const cerrarModal = document.getElementById("cerrar-modal");

  if (botonAplicarCupon && inputCupon && mensajeError) {
    botonAplicarCupon.addEventListener("click", () => {
      const codigo = inputCupon.value.trim().toUpperCase();
      if (codigo === "FIRSTORDER5" && !cuponAplicado) {
        cuponAplicado = true;
        mensajeError.style.display = "none";
        aplicarDescuento(5);
        if (modal) modal.style.display = "none";
        
        // Mostrar mensaje de éxito (opcional)
        inputCupon.value = "";
        inputCupon.placeholder = "¡Cupón aplicado!";
        inputCupon.style.color = "#28a745";
        
        setTimeout(() => {
          inputCupon.placeholder = "Ej: DESCUENTO10";
          inputCupon.style.color = "";
        }, 3000);
      } else if (cuponAplicado) {
        mensajeError.textContent = "Ya tienes un cupón aplicado";
        mensajeError.style.display = "block";
      } else {
        mensajeError.textContent = "Revisa que esté bien escrito";
        mensajeError.style.display = "block";
      }
    });
  }

  // Modal cupón
  if (botonCupon && modal && cerrarModal) {
    botonCupon.addEventListener("click", () => {
      modal.style.display = "flex";
      if (inputCupon) inputCupon.focus();
    });
    
    cerrarModal.addEventListener("click", () => {
      modal.style.display = "none";
      if (mensajeError) mensajeError.style.display = "none";
    });
    
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
        if (mensajeError) mensajeError.style.display = "none";
      }
    });

    // Enviar cupón con Enter
    if (inputCupon) {
      inputCupon.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && botonAplicarCupon) {
          botonAplicarCupon.click();
        }
      });
    }
  }
}

// Función para resetear cupones (útil para testing)
function resetearCupones() {
  cuponAplicado = false;
  porcentajeDescuento = 0;
  actualizarTotales();
}