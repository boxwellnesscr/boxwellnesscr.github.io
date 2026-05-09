/* ============================================================
   BOXWELLNESS — promociones.js
   ============================================================ */
let _sortPromo = 'default';

document.addEventListener('DOMContentLoaded', async () => {
  const { productos } = await loadProducts();
  window._allProducts = productos;
  refreshWishlistUI(productos);
  initSearch(q => renderPromos(productos, q));
  document.getElementById('sortSelect')?.addEventListener('change', e => {
    _sortPromo = e.target.value;
    renderPromos(productos, '');
  });
  renderPromos(productos, '');
});

function renderPromos(productos, q) {
  // Promociones = productos con badge 'oferta' o que tienen precioAnterior
  let list = productos.filter(p => p.disponible && (p.badge === 'oferta' || p.precioAnterior));
  if (q && q.trim()) {
    const sq = q.toLowerCase();
    list = list.filter(p => p.nombre.toLowerCase().includes(sq) || p.marca.toLowerCase().includes(sq));
  }
  renderGrid('productsGrid', sortProducts(list, _sortPromo), 'emptyState', 'productCount');
}
