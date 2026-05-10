/* BOXWELLNESS — productos.js v2 */
let _activeFilter='all', _activeBrand='all', _activeSort='default', _searchQ='';

document.addEventListener('DOMContentLoaded', async () => {
  const {productos} = await loadProducts();
  window._allProducts = productos;
  refreshWishlistUI(productos);

  const params = new URLSearchParams(window.location.search);
  if(params.get('cat'))    _activeFilter = params.get('cat');
  if(params.get('search')) { _searchQ=params.get('search'); const i=document.getElementById('searchInput');if(i)i.value=_searchQ }

  buildSidebar(productos);
  renderAll(productos);

  document.getElementById('sortSelect')?.addEventListener('change',e=>{_activeSort=e.target.value;renderAll(productos)});
  initSearch(q=>{_searchQ=q;_activeFilter='all';_activeBrand='all';highlightSidebar('all');renderAll(productos)});
  document.getElementById('filterToggle')?.addEventListener('click',()=>document.getElementById('catalogSidebar')?.classList.toggle('sidebar-open'));
  document.getElementById('sidebarClose')?.addEventListener('click',()=>document.getElementById('catalogSidebar')?.classList.remove('sidebar-open'));
});

/* ── BUILD SIDEBAR ──────────────────────────────────────── */
function buildSidebar(productos) {
  const sidebar = document.getElementById('catalogSidebar'); if(!sidebar)return;

  /* Build brand list from products */
  const productBrands = [...new Set(productos.map(p=>p.marca).filter(Boolean))].sort();
  /* Merge with BRANDS_LIST: show BRANDS_LIST first, then any extra brands from products */
  const allBrands = [...new Set([...BRANDS_LIST, ...productBrands])];

  sidebar.innerHTML = `
    <div class="sidebar-header">
      <h3>CATEGORÍAS</h3>
      <button class="sidebar-close" id="sidebarClose">✕</button>
    </div>
    <ul class="cat-list">
      <li class="cat-child active" data-id="all" onclick="setCat('all',this)">
        <input type="checkbox" checked readonly> <span class="cat-child-label">Todos los productos</span>
      </li>
    </ul>
    ${CATEGORY_TREE.map(group=>`
      <div class="cat-group">
        <div class="cat-parent" data-id="${group.id}" onclick="toggleGroup(this)">
          <span class="cat-parent-label">${group.label}</span>
          <span class="cat-parent-arrow">›</span>
        </div>
        <ul class="cat-children">
          ${group.children.map(child=>`
            <li class="cat-child" data-id="${child.id}" onclick="setCat('${child.id}',this)">
              <input type="checkbox"> <span class="cat-child-label">${child.label}</span>
            </li>`).join('')}
        </ul>
      </div>`).join('')}

    <div class="sidebar-divider"></div>
    <div class="sidebar-header"><h3>MARCAS</h3></div>
    <ul class="cat-list" id="brandList">
      <li class="cat-child active" data-brand="all" onclick="setBrand('all',this)">
        <input type="checkbox" checked readonly> <span class="cat-child-label">Todas las marcas</span>
      </li>
      ${allBrands.map(b=>`<li class="cat-child" data-brand="${b}" onclick="setBrand('${b.replace(/'/g,"\\'")}',this)">
        <input type="checkbox"> <span class="cat-child-label">${b}</span>
      </li>`).join('')}
    </ul>`;

  /* Re-attach close button */
  document.getElementById('sidebarClose')?.addEventListener('click',()=>document.getElementById('catalogSidebar')?.classList.remove('sidebar-open'));

  /* Highlight initial filter from URL */
  if(_activeFilter !== 'all') {
    const el = sidebar.querySelector(`[data-id="${_activeFilter}"]`);
    if(el) { el.classList.add('active'); el.querySelector('input').checked=true; /* open parent */ const parent=el.closest('.cat-children'); if(parent){parent.classList.add('open');parent.previousElementSibling?.classList.add('open')} }
    sidebar.querySelector('[data-id="all"]')?.classList.remove('active');
  }
}

/* ── SIDEBAR INTERACTIONS ───────────────────────────────── */
window.toggleGroup = function(parentEl) {
  /* Click on parent label → filter by parent category AND toggle collapse */
  const id = parentEl.dataset.id;
  parentEl.classList.toggle('open');
  parentEl.nextElementSibling?.classList.toggle('open');
  /* Also filter */
  document.querySelectorAll('.cat-child,.cat-parent').forEach(el=>el.classList.remove('active'));
  document.querySelectorAll('.cat-child input, input[data-id]').forEach(cb=>cb.checked=false);
  parentEl.classList.add('active');
  _activeFilter = id;
  renderAll(window._allProducts||[]);
};

window.setCat = function(id, el) {
  document.querySelectorAll('.cat-child,.cat-parent').forEach(e=>e.classList.remove('active'));
  document.querySelectorAll('.cat-list .cat-child input').forEach(cb=>cb.checked=false);
  el.classList.add('active');
  const cb=el.querySelector('input'); if(cb)cb.checked=true;
  _activeFilter = id;
  renderAll(window._allProducts||[]);
};

window.setBrand = function(brand, el) {
  document.querySelectorAll('#brandList .cat-child').forEach(e=>e.classList.remove('active'));
  document.querySelectorAll('#brandList .cat-child input').forEach(cb=>cb.checked=false);
  el.classList.add('active');
  const cb=el.querySelector('input'); if(cb)cb.checked=true;
  _activeBrand = brand;
  renderAll(window._allProducts||[]);
};

function highlightSidebar(id) {
  document.querySelectorAll('.cat-child,.cat-parent').forEach(e=>e.classList.remove('active'));
  const el=document.querySelector(`[data-id="${id}"]`);
  if(el){el.classList.add('active');const cb=el.querySelector('input');if(cb)cb.checked=true}
}

/* ── FILTER & RENDER ────────────────────────────────────── */
function getFiltered(productos) {
  let list = productos.filter(p=>p.disponible);
  if(_activeFilter!=='all') list = list.filter(p=>prodHasCat(p,_activeFilter));
  if(_activeBrand!=='all')  list = list.filter(p=>p.marca===_activeBrand||p.marca?.toUpperCase()===_activeBrand.toUpperCase());
  if(_searchQ.trim()){const q=_searchQ.toLowerCase();list=list.filter(p=>p.nombre.toLowerCase().includes(q)||p.marca?.toLowerCase().includes(q))}
  return sortProducts(list,_activeSort);
}
function renderAll(productos){
  const filterActive = _activeFilter!=='all' || _activeBrand!=='all';
  renderGrid('productsGrid',getFiltered(productos),'emptyState','productCount',filterActive);
}
