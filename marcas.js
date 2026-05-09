/* ============================================================
   BOXWELLNESS — marcas.js
   ============================================================ */
let _activeBrand = 'all';
let _sortMarcas  = 'default';

document.addEventListener('DOMContentLoaded', async () => {
  const { productos } = await loadProducts();
  window._allProducts = productos;
  refreshWishlistUI(productos);

  // Brands carousel (5 slides)
  initCarousel(5);

  initSearch(q => {
    renderMarcasGrid(productos);
  });

  // Build brand pills
  const brands = ['all', ...new Set(productos.map(p => p.marca))].filter(Boolean);
  const pillsEl = document.getElementById('brandsPills');
  if (pillsEl) {
    pillsEl.innerHTML = brands.map(b => `
      <button class="brand-pill ${b === 'all' ? 'active' : ''}" data-brand="${b}">
        ${b === 'all' ? 'Todas las marcas' : b}
      </button>`).join('');
    pillsEl.addEventListener('click', e => {
      const pill = e.target.closest('.brand-pill');
      if (!pill) return;
      _activeBrand = pill.dataset.brand;
      document.querySelectorAll('.brand-pill').forEach(p => p.classList.toggle('active', p.dataset.brand === _activeBrand));
      renderMarcasGrid(productos);
    });
  }

  document.getElementById('sortSelect')?.addEventListener('change', e => {
    _sortMarcas = e.target.value;
    renderMarcasGrid(productos);
  });

  renderMarcasGrid(productos);
});

window.filterByBrand = function(brand) {
  _activeBrand = brand;
  document.querySelectorAll('.brand-pill').forEach(p => p.classList.toggle('active', p.dataset.brand === brand));
  renderMarcasGrid(window._allProducts || []);
  document.getElementById('productsGrid')?.scrollIntoView({ behavior:'smooth' });
};

function renderMarcasGrid(productos) {
  let list = productos.filter(p => p.disponible);
  if (_activeBrand !== 'all') list = list.filter(p => p.marca === _activeBrand);
  renderGrid('productsGrid', sortProducts(list, _sortMarcas), 'emptyState', 'productCount');
}
