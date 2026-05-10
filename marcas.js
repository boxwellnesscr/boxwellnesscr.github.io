/* BOXWELLNESS — marcas.js v2 */
let _activeBrand='all', _activeCat='all', _sortMarcas='default';

document.addEventListener('DOMContentLoaded', async () => {
  const {productos} = await loadProducts();
  window._allProducts = productos;
  refreshWishlistUI(productos);
  initCarousel(5);
  initSearch(()=>renderMarcasGrid(productos));

  /* Build brand pills: BRANDS_LIST + any extra from JSON */
  const productBrands = [...new Set(productos.map(p=>p.marca).filter(Boolean))];
  const allBrands = [...new Set([...BRANDS_LIST,...productBrands])];

  const pillsEl=document.getElementById('brandsPills');
  if(pillsEl){
    pillsEl.innerHTML=['all',...allBrands].map(b=>`<button class="brand-pill ${b==='all'?'active':''}" data-brand="${b}">${b==='all'?'Todas las marcas':b}</button>`).join('');
    pillsEl.addEventListener('click',e=>{
      const pill=e.target.closest('.brand-pill');if(!pill)return;
      _activeBrand=pill.dataset.brand;
      document.querySelectorAll('#brandsPills .brand-pill').forEach(p=>p.classList.toggle('active',p.dataset.brand===_activeBrand));
      renderMarcasGrid(productos);
    });
  }

  /* Category pills */
  const catPillsEl=document.getElementById('catPills');
  if(catPillsEl){
    catPillsEl.addEventListener('click',e=>{
      const pill=e.target.closest('.brand-pill');if(!pill)return;
      _activeCat=pill.dataset.cat;
      document.querySelectorAll('#catPills .brand-pill').forEach(p=>p.classList.toggle('active',p.dataset.cat===_activeCat));
      renderMarcasGrid(productos);
    });
  }

  document.getElementById('sortSelect')?.addEventListener('change',e=>{_sortMarcas=e.target.value;renderMarcasGrid(productos)});
  renderMarcasGrid(productos);
});

window.filterByBrand=function(brand){
  _activeBrand=brand;
  document.querySelectorAll('#brandsPills .brand-pill').forEach(p=>p.classList.toggle('active',p.dataset.brand===brand));
  renderMarcasGrid(window._allProducts||[]);
  document.getElementById('productsGrid')?.scrollIntoView({behavior:'smooth'});
};

function renderMarcasGrid(productos){
  let list=productos.filter(p=>p.disponible);
  if(_activeBrand!=='all') list=list.filter(p=>p.marca===_activeBrand||p.marca?.toUpperCase()===_activeBrand.toUpperCase());
  if(_activeCat!=='all')   list=list.filter(p=>prodHasCat(p,_activeCat));
  const filterActive=_activeBrand!=='all'||_activeCat!=='all';
  renderGrid('productsGrid',sortProducts(list,_sortMarcas),'emptyState','productCount',filterActive);
}
