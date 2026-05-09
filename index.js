/* ============================================================
   BOXWELLNESS — index.js  (solo para index.html)
   ============================================================ */
document.addEventListener('DOMContentLoaded', async () => {
  const { productos, stacks } = await loadProducts();
  window._allProducts = productos;
  window._allStacks   = stacks;

  // Carousel (3 slides)
  initCarousel(3);

  // Search opens → scroll to section
  initSearch(q => {
    if (q.trim()) {
      window.location.href = `productos.html?search=${encodeURIComponent(q.trim())}`;
    }
  });

  // Featured row
  renderFeaturedRow(productos, 'default');

  // Sort featured
  document.getElementById('sortFeatured')?.addEventListener('change', e => {
    renderFeaturedRow(productos, e.target.value);
  });

  // Refresh wishlist display now that products are loaded
  refreshWishlistUI(productos);
});

function renderFeaturedRow(productos, sortMode) {
  const row  = document.getElementById('productsRow');
  if (!row) return;
  const featured = sortProducts(productos.filter(p => p.destacado && p.disponible), sortMode);
  row.innerHTML = '';
  const frag = document.createDocumentFragment();
  featured.forEach(p => frag.appendChild(createCard(p)));
  row.appendChild(frag);
}
