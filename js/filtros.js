// --------------------- Filtros y Ordenamiento ---------------------
const dropdown = document.querySelector('.dropdown');
const toggle = document.getElementById('dropdownText');
const menu = document.getElementById('dropdownMenu');
const selectedOption = document.querySelector('.selected-option');
const options = menu ? menu.querySelectorAll('li') : [];
const gridProductos = document.querySelector('.grid-productos');

// Dropdown de ordenamiento
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    dropdown.classList.toggle('show');
  });

  options.forEach(option => {
    option.addEventListener('click', () => {
      const criterio = option.dataset.value.toLowerCase();
      if (selectedOption) {
        selectedOption.textContent = option.dataset.value;
      }
      dropdown.classList.remove('show');
      ordenarProductos(criterio);
    });
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });
}

// Función de ordenamiento
function ordenarProductos(criterio) {
  if (!gridProductos) return;
  
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

// Filtros por checkbox
document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
  checkbox.addEventListener('change', aplicarFiltros);
});

// Función de aplicación de filtros
function aplicarFiltros() {
  const categoriaSeleccionadas = Array.from(document.querySelectorAll('[data-type="category"]:checked')).map(cb => cb.value.toLowerCase());
  const materialSeleccionados = Array.from(document.querySelectorAll('[data-type="material"]:checked')).map(cb => cb.value.toLowerCase());
  const desde = parseInt(document.getElementById('desde')?.value) || 0;
  const hasta = parseInt(document.getElementById('hasta')?.value) || Infinity;

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