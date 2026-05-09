/* ============================================================
   BOXWELLNESS — productos.js
   ============================================================ */
let _activeFilter = 'all';
let _activeSort   = 'default';
let _searchQ      = '';

document.addEventListener('DOMContentLoaded', async () => {
  const { productos } = await loadProducts();
  window._allProducts = productos;
  refreshWishlistUI(productos);

  // Read URL params (cat= or search=)
  const params = new URLSearchParams(window.location.search);
  const catParam    = params.get('cat');
  const searchParam = params.get('search');
  if (catParam)    { _activeFilter = catParam; highlightSidebar(catParam); }
  if (searchParam) { _searchQ = searchParam; const inp = document.getElementById('searchInput'); if (inp) inp.value = searchParam; }

  renderAll(productos);

  // Sidebar category clicks
  document.getElementById('catList')?.addEventListener('click', e => {
    const item = e.target.closest('.cat-item');
    if (!item) return;
    // Deselect all others
    document.querySelectorAll('.cat-item').forEach(ci => {
      ci.classList.remove('active');
      const cb = ci.querySelector('input[type=checkbox]');
      if (cb) cb.checked = false;
    });
    item.classList.add('active');
    const cb = item.querySelector('input[type=checkbox]');
    if (cb) cb.checked = true;
    _activeFilter = item.dataset.cat;
    _searchQ = '';
    const inp = document.getElementById('searchInput');
    if (inp) inp.value = '';
    renderAll(productos);
  });

  // Sort
  document.getElementById('sortSelect')?.addEventListener('change', e => {
    _activeSort = e.target.value;
    renderAll(productos);
  });

  // Search
  initSearch(q => {
    _searchQ = q;
    renderAll(productos);
  });

  // Mobile filter toggle
  document.getElementById('filterToggle')?.addEventListener('click', () => {
    const sidebar = document.getElementById('catalogSidebar');
    sidebar?.classList.toggle('sidebar-open');
  });
  document.getElementById('sidebarClose')?.addEventListener('click', () => {
    document.getElementById('catalogSidebar')?.classList.remove('sidebar-open');
  });
});

function highlightSidebar(cat) {
  document.querySelectorAll('.cat-item').forEach(ci => {
    const active = ci.dataset.cat === cat;
    ci.classList.toggle('active', active);
    const cb = ci.querySelector('input[type=checkbox]');
    if (cb) cb.checked = active;
  });
  // also uncheck "all"
  if (cat !== 'all') {
    const allItem = document.querySelector('.cat-item[data-cat="all"]');
    if (allItem) { allItem.classList.remove('active'); const cb = allItem.querySelector('input'); if (cb) cb.checked = false; }
  }
}

function getFiltered(productos) {
  let list = productos.filter(p => p.disponible);
  if (_activeFilter !== 'all') list = list.filter(p => p.categoria === _activeFilter);
  if (_searchQ.trim()) {
    const q = _searchQ.toLowerCase();
    list = list.filter(p =>
      p.nombre.toLowerCase().includes(q) ||
      p.marca.toLowerCase().includes(q) ||
      p.categoria.toLowerCase().includes(q)
    );
  }
  return sortProducts(list, _activeSort);
}

function renderAll(productos) {
  renderGrid('productsGrid', getFiltered(productos), 'emptyState', 'productCount');
}
