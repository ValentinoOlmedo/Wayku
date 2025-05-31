const searchToggle = document.getElementById('searchToggle');
const searchBar = document.getElementById('searchBar');


searchToggle.addEventListener('click', () => {
  if (searchBar.style.display === 'block') {
    searchBar.style.opacity = 0;
    setTimeout(() => {
      searchBar.style.display = 'none';
    }, 200);
  } else {
    searchBar.style.display = 'block';
    searchBar.style.opacity = 0;
    setTimeout(() => {
      searchBar.style.opacity = 1;
    }, 10);
  }
});

