console.log("Wayku cargado correctamente");
// Toggle barra de búsqueda
const searchToggle = document.getElementById('searchToggle');
const searchBar = document.getElementById('searchBar');

searchToggle.addEventListener('click', () => {
  searchBar.style.display = searchBar.style.display === 'block' ? 'none' : 'block';
});
