/* ============================================================
   BOXWELLNESS — shared.js v4
   ============================================================ */

/* ══ CONFIGURACIÓN FÁCIL DE EDITAR ═══════════════════════
   Para agregar categorías: añadí un objeto al array correspondiente
   Para agregar marcas: añadí el nombre al array BRANDS_LIST
   ═══════════════════════════════════════════════════════ */

const CATEGORY_TREE = [
  { id:'accesorios', label:'ACCESORIOS E IMPLEMENTOS', children:[
    {id:'bandas-nasales',label:'Bandas Nasales'},
    {id:'cinturones',label:'Cinturones'},
    {id:'munequeras',label:'Muñequeras'},
    {id:'straps',label:'Straps'},
  ]},
  { id:'snacks', label:'SNACKS', children:[
    {id:'bebidas',label:'Bebidas'},
    {id:'energeticas',label:'Energéticas'},
    {id:'snacks-barras',label:'Snacks-Barras-Proteicas'},
  ]},
  { id:'suplementos', label:'SUPLEMENTOS', children:[
    {id:'ashwaganda',label:'Ashwaganda'},
    {id:'cafeina',label:'Cafeína'},
    {id:'colageno',label:'Colágeno'},
    {id:'creatinas',label:'Creatinas'},
    {id:'ganadores',label:'Ganadores de Masa'},
    {id:'glutamina',label:'Glutamina'},
    {id:'magnesio',label:'Magnesio'},
    {id:'omega3',label:'Omega 3'},
    {id:'pre-entrenos',label:'Pre-Entrenos'},
    {id:'vasodilatadores',label:'Vasodilatadores'},
    {id:'yohimbina',label:'Yohimbina'},
  ]},
  { id:'proteinas', label:'PROTEÍNAS', children:[
    {id:'isoladas',label:'Isoladas'},
    {id:'whey',label:'Whey'},
    {id:'veganas',label:'Veganas'},
    {id:'carnivoras',label:'Carnívoras'},
    {id:'caseina',label:'Caseína'},
  ]},
  { id:'aminoacidos', label:'AMINOÁCIDOS', children:[
    {id:'bcaas',label:"BCAA's"},
    {id:'eaas',label:"EAA's"},
  ]},
  { id:'control-peso', label:'CONTROL DE PESO', children:[
    {id:'fat-burners',label:'Fat Burners'},
    {id:'l-carnitina',label:'L-Carnitina'},
    {id:'cla',label:'CLA'},
  ]},
  { id:'multivitaminicos', label:'MULTIVITAMÍNICOS', children:[
    {id:'animal-packs',label:'Animal Packs'},
    {id:'multi-hombre',label:'Multi Hombre'},
    {id:'multi-mujer',label:'Multi Mujer'},
    {id:'vitaminas',label:'Vitaminas'},
    {id:'minerales',label:'Minerales'},
  ]},
  { id:'otros', label:'OTROS', children:[
    {id:'macrobiotica',label:'Macrobiótica'},
    {id:'articulaciones',label:'Articulaciones'},
    {id:'sueno',label:'Sueño'},
    {id:'estres',label:'Estrés'},
    {id:'digestion',label:'Digestión'},
    {id:'beta-alanina',label:'Beta-Alanina'},
    {id:'pro-pre-bioticos',label:'Pro/Pre Bióticos'},
    {id:'testosterone-boosters',label:'Testosterone Boosters'},
  ]},
];

const BRANDS_LIST = [
  'NUTREX','NUTRABIO','MUSCLETECH','CBUM','DYMATIZE','RAW',
  'ABE','ALPHA PRIME','C4 ENERGY','CELLUCOR','DEADLIFT',
  'DOER FITNESS','DURA BODY','EASYFIT','EVOGEN','ENHANCED',
  'EVL','FIT BUTTERS','FORMULA','GHOST','LAB MANA','LANDERFIT',
  'LIV','MOUK','MRS TASTE','MUSCLEMEDS / CARNIVOR','MUSCLESPORT',
  'NATURA 506','NESZU','NUTRAKEY','NUTRIBOX','ON','PRIMEVAL',
  'PROSTAR','PROSUPPS','PUMP SAUCE','PURE PROTEIN','QHUSH',
  'RAZE','REDCON1','REPP RAZE','REVIVE','REVIVE MD','RULE 1',
  'RYSE','STEEL FIT','TERROR LABZ','THE GUMMIES',
  'ULTIMATE NUTRITION','UNBOUND','UNIVERSAL / ANIMAL PACKS',
  'USN','VOSS','ZORAW',
];

/* Helper: get all category IDs a parent covers */
function getCatFamily(catId) {
  const parent = CATEGORY_TREE.find(g=>g.id===catId);
  if(parent) return [parent.id, ...parent.children.map(c=>c.id)];
  return [catId];
}
/* Helper: does product belong to a category? */
function prodHasCat(p, catId) {
  const cats = p.categorias || (p.categoria ? [p.categoria] : []);
  return getCatFamily(catId).some(id => cats.includes(id));
}

/* ── CORE CONFIG ─────────────────────────────────────────── */
const BW = { WA:'50661179692', CURRENCY:'₡', DATA:'productos.json' };
function fmt(n){ return BW.CURRENCY+Number(n).toLocaleString('es-CR') }
function waLink(nombre){ return `https://wa.me/${BW.WA}?text=${encodeURIComponent('Hola, me interesa el siguiente producto:\n• '+nombre)}` }
function waSVG(){ return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>` }
function heartSVG(f){ return `<svg viewBox="0 0 24 24" fill="${f?'currentColor':'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>` }
function cartSVG(){ return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>` }

function emptyWAHtml(filterActive){
  if(!filterActive) return `<div class="empty-state"><div class="empty-icon">🔍</div><p>No se encontraron productos</p></div>`;
  const msg=encodeURIComponent('Hola, quiero consultar disponibilidad de productos.');
  return `<div class="empty-state-wa">
    <div class="empty-icon">🏗️</div>
    <p><strong>Estamos trabajando en estos productos.</strong>Podés consultar disponibilidad directamente por WhatsApp.</p>
    <a href="https://wa.me/${BW.WA}?text=${msg}" class="empty-wa-btn" target="_blank">${waSVG()} Consultar disponibilidad</a>
  </div>`;
}

/* ── STORAGE ─────────────────────────────────────────────── */
function loadWishlist(){try{return JSON.parse(localStorage.getItem('bw_wish')||'[]')}catch{return[]}}
function saveWishlist(w){localStorage.setItem('bw_wish',JSON.stringify(w))}
function loadCart(){try{return JSON.parse(localStorage.getItem('bw_cart')||'[]')}catch{return[]}}
function saveCart(c){localStorage.setItem('bw_cart',JSON.stringify(c))}
let _wishlist=loadWishlist(), _cart=loadCart();
function isLiked(id){return _wishlist.includes(id)}
function inCart(id){return _cart.find(c=>c.id===id)}

function toggleLike(id,prods){
  if(isLiked(id))_wishlist=_wishlist.filter(w=>w!==id); else _wishlist.push(id);
  saveWishlist(_wishlist); refreshWishlistUI(prods);
  document.querySelectorAll(`.like-btn[data-id="${id}"]`).forEach(b=>{b.classList.toggle('liked',isLiked(id));b.style.transform='scale(1.35)';setTimeout(()=>{b.style.transform=''},200)});
}
function addToCart(p){
  const item=inCart(p.id);
  if(item)item.qty=(item.qty||1)+1;
  else _cart.push({id:p.id,nombre:p.nombre,precio:p.precio,emoji:p.emoji||'📦',imagen:p.imagen||'',qty:1});
  saveCart(_cart); refreshCartUI();
  const b=document.getElementById('cartNavBtn');if(b){b.style.transform='scale(1.3)';setTimeout(()=>{b.style.transform=''},200)}
}
function removeFromCart(id){_cart=_cart.filter(c=>c.id!==id);saveCart(_cart);refreshCartUI()}
function changeQty(id,delta){const item=inCart(id);if(!item)return;item.qty=Math.max(1,(item.qty||1)+delta);saveCart(_cart);refreshCartUI()}

/* ── CART UI ─────────────────────────────────────────────── */
function refreshCartUI(){
  const total=_cart.reduce((s,c)=>s+(c.qty||1),0);
  document.querySelectorAll('.cart-count').forEach(el=>{el.textContent=total;el.classList.toggle('visible',total>0)});
  document.querySelectorAll('.cart-btn').forEach(b=>b.classList.toggle('has-items',total>0));
  renderCartModal();
}
function renderCartModal(){
  const body=document.getElementById('cartBody'),footer=document.getElementById('cartFooter');
  if(!body)return;
  if(!_cart.length){body.innerHTML=`<div class="cart-empty"><svg viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5" width="48" height="48"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg><p style="margin-top:10px;font-size:14px;color:#aaa">Tu carrito está vacío</p></div>`;if(footer)footer.innerHTML='';return}
  const grand=_cart.reduce((s,c)=>s+c.precio*(c.qty||1),0);
  body.innerHTML=_cart.map(c=>`<div class="cart-item"><div class="ci-img">${c.imagen?`<img src="${c.imagen}" alt="" loading="lazy">`:c.emoji}</div><div class="ci-info"><div class="ci-name">${c.nombre}</div><div class="ci-price">${fmt(c.precio*(c.qty||1))}</div><div class="ci-qty"><button onclick="changeQty('${c.id}',-1)">−</button><span>${c.qty||1}</span><button onclick="changeQty('${c.id}',1)">+</button></div></div><button class="ci-remove" onclick="removeFromCart('${c.id}')">✕</button></div>`).join('');
  if(footer){
    const lines=_cart.map(c=>`• ${c.nombre} ×${c.qty||1} — ${fmt(c.precio*(c.qty||1))}`).join('\n');
    const msg=encodeURIComponent(`Hola, quiero los siguientes productos:\n${lines}\n\nTotal estimado: ${fmt(grand)}`);
    footer.innerHTML=`<div class="cart-total"><span>Total estimado</span><span>${fmt(grand)}</span></div><a href="https://wa.me/${BW.WA}?text=${msg}" class="cart-checkout-btn" target="_blank">${waSVG()} FINALIZAR COMPRA</a>`;
  }
}

/* ── WISHLIST UI ─────────────────────────────────────────── */
function refreshWishlistUI(prods){
  const count=_wishlist.length;
  document.querySelectorAll('.wishlist-count').forEach(el=>{el.textContent=count;el.classList.toggle('visible',count>0)});
  document.querySelectorAll('.wishlist-btn').forEach(b=>b.classList.toggle('has-items',count>0));
  renderWishlistModal(prods);
}
function renderWishlistModal(prods){
  const body=document.getElementById('wishlistBody');if(!body)return;
  const items=(prods||window._allProducts||[]).filter(p=>_wishlist.includes(p.id));
  if(!items.length){body.innerHTML=`<div class="empty-wishlist">${heartSVG(false).replace('stroke="currentColor"','stroke="#ccc"')}<p>Aún no tenés favoritos.<br>Dale ❤️ a los productos que te gusten.</p></div>`;return}
  const lines=items.map(p=>`• ${p.nombre} — ${fmt(p.precio)}`).join('\n');
  const shareMsg=encodeURIComponent(`Hola, me interesan los siguientes productos:\n${lines}`);
  body.innerHTML=items.map(p=>`
    <div class="wishlist-item" onclick="closeMod('wishlistModal');setTimeout(()=>openProductModal('${p.id}'),150)" style="cursor:pointer">
      <div class="wi-img">${p.imagen?`<img src="${p.imagen}" alt="" loading="lazy">`:p.emoji}</div>
      <div class="wi-info"><div class="wi-brand">${p.marca}</div><div class="wi-name">${p.nombre}</div><div class="wi-price">${fmt(p.precio)}</div></div>
      <div class="wi-actions" onclick="event.stopPropagation()">
        <button class="wi-cart-btn" onclick="addToCart(${JSON.stringify({id:p.id,nombre:p.nombre,precio:p.precio,emoji:p.emoji,imagen:p.imagen||''}).replace(/"/g,'&quot;')})" title="Añadir al carrito">${cartSVG()}</button>
        <button class="wi-remove" onclick="toggleLike('${p.id}',window._allProducts)" title="Quitar">✕</button>
      </div>
    </div>`).join('')+
  `<div class="wi-share-row"><a href="https://wa.me/${BW.WA}?text=${shareMsg}" class="wi-share-btn" target="_blank">${waSVG()} Enviar lista por WhatsApp</a></div>`;
}

/* ── PRODUCT CARD ─────────────────────────────────────────── */
function createCard(p){
  const badge=p.badge?`<span class="product-badge badge-${p.badge}">${p.badge==='oferta'?'¡Oferta!':p.badge==='nuevo'?'Nuevo':'Top'}</span>`:'';
  const oldPrice=p.precioAnterior?`<span class="product-price-old">${fmt(p.precioAnterior)}</span>`:'';
  const imgContent=p.imagen?`<img src="${p.imagen}" alt="${p.nombre}" loading="lazy">`:`<div class="product-img-placeholder">${p.emoji||'📦'}</div>`;
  const card=document.createElement('div');
  card.className='product-card';card.dataset.id=p.id;
  const cats=p.categorias||(p.categoria?[p.categoria]:[]);
  card.innerHTML=`
    <div class="product-img-wrap">${imgContent}${badge}
      <button class="like-btn ${isLiked(p.id)?'liked':''}" data-id="${p.id}">${heartSVG(isLiked(p.id))}</button>
      <div class="product-hover-overlay">
        <button class="btn-buy-now" data-id="${p.id}">COMPRAR AHORA</button>
        <a class="btn-wa" href="${waLink(p.nombre)}" target="_blank" onclick="event.stopPropagation()">${waSVG()}</a>
      </div>
    </div>
    <div class="product-info">
      <div class="product-brand">${p.marca}</div>
      <div class="product-name">${p.nombre}</div>
      <div class="product-price-row"><span class="product-price">${fmt(p.precio)}</span>${oldPrice}</div>
      <span class="product-cat-tag">${cats[0]||''}</span>
    </div>`;
  card.querySelector('.like-btn').addEventListener('click',e=>{e.stopPropagation();toggleLike(p.id,window._allProducts)});
  card.querySelector('.btn-buy-now').addEventListener('click',e=>{e.stopPropagation();openProductModal(p.id)});
  card.addEventListener('click',()=>openProductModal(p.id));
  return card;
}

/* ── PRODUCT MODAL ─────────────────────────────────────────── */
function openProductModal(id){
  const p=(window._allProducts||[]).find(x=>x.id===id);if(!p)return;
  const modal=document.getElementById('productModal'),inner=document.getElementById('productModalInner');if(!modal||!inner)return;
  const mainImg=(p.sabores&&p.sabores[0]&&p.sabores[0].imagen)||p.imagen||'';
  const mainContent=mainImg?`<img id="pmMainImg" src="${mainImg}" alt="${p.nombre}">`:`<div id="pmMainImg" class="pm-emoji-placeholder">${p.emoji||'📦'}</div>`;
  const thumbs=[];
  if(p.sabores)p.sabores.forEach((s,i)=>{
    thumbs.push(s.imagen?`<div class="pm-thumb ${i===0?'active':''}" data-img="${s.imagen}" onclick="pmSwapImg(this)"><img src="${s.imagen}" loading="lazy"></div>`:`<div class="pm-thumb ${i===0?'active':''}" data-img="" data-emoji="${p.emoji||'📦'}" onclick="pmSwapImg(this)"><span class="pm-thumb-emoji">${p.emoji||'📦'}</span></div>`);
  });
  if(p.imagenNutricional)thumbs.push(`<div class="pm-thumb" data-img="${p.imagenNutricional}" onclick="pmSwapImg(this)"><img src="${p.imagenNutricional}" loading="lazy"><span class="pm-thumb-label">Nutr.</span></div>`);
  const caract=(p.caracteristicas&&p.caracteristicas.length)?`<div class="pm-section"><div class="pm-section-title">CARACTERÍSTICAS CLAVE</div><ul class="pm-caract">${p.caracteristicas.map(c=>`<li>${c}</li>`).join('')}</ul></div>`:'';
  const modo=p.modoDeUso?`<div class="pm-section"><div class="pm-section-title">MODO DE USO</div><p class="pm-modo">${p.modoDeUso}</p></div>`:'';
  const saboresEl=(p.sabores&&p.sabores.length>1)?`<div class="pm-variant-group"><label class="pm-variant-label">Sabor</label><select class="pm-variant-select" onchange="pmChangeSabor(this,${JSON.stringify(p.sabores).replace(/"/g,'&quot;')})"><option value="">Elige una opción</option>${p.sabores.map((s,i)=>`<option value="${i}">${s.nombre}</option>`).join('')}</select></div>`:'';
  const tamaniosEl=(p.tamanios&&p.tamanios.length>1)?`<div class="pm-variant-group"><label class="pm-variant-label">Tamaño</label><select class="pm-variant-select"><option value="">Elige una opción</option>${p.tamanios.map(t=>`<option value="${t}">${t}</option>`).join('')}</select></div>`:(p.tamanios&&p.tamanios.length===1?`<div class="pm-variant-group"><label class="pm-variant-label">Presentación</label><span class="pm-variant-tag">${p.tamanios[0]}</span></div>`:'');
  const oldPrice=p.precioAnterior?`<span class="pm-price-old">${fmt(p.precioAnterior)} IVA INCLUIDO</span>`:'';
  inner.innerHTML=`
    <div class="pm-left">
      <div class="pm-main-img-wrap" id="pmMainImgWrap">${mainContent}</div>
      ${thumbs.length>1?`<div class="pm-thumbs">${thumbs.join('')}</div>`:''}
    </div>
    <div class="pm-right">
      <div class="pm-brand">${p.marca}</div>
      <div class="pm-name">${p.nombre}</div>
      <div class="pm-prices">${oldPrice}<div class="pm-price">${fmt(p.precio)} <span class="pm-iva">IVA INCLUIDO</span></div></div>
      <p class="pm-desc">${p.descripcion||''}</p>
      ${caract}${modo}
      <div class="pm-variants">${saboresEl}${tamaniosEl}</div>
      <div class="pm-actions">
        <a class="pm-btn-wa" href="${waLink(p.nombre)}" target="_blank">${waSVG()} Comprar por WhatsApp</a>
        <button class="pm-btn-cart" onclick="addToCart(${JSON.stringify({id:p.id,nombre:p.nombre,precio:p.precio,emoji:p.emoji,imagen:p.imagen||''}).replace(/"/g,'&quot;')});closeMod('productModal')">${cartSVG()} Añadir al carrito</button>
        <button class="pm-btn-like ${isLiked(p.id)?'liked':''}" id="pmLikeBtn" data-id="${p.id}">${heartSVG(isLiked(p.id))} ${isLiked(p.id)?'En favoritos':'Agregar a favoritos'}</button>
      </div>
    </div>`;
  const rec=(window._allProducts||[]).filter(r=>r.id!==p.id&&(prodHasCat(r,(p.categorias||[p.categoria])[0]))&&r.disponible).slice(0,3);
  if(rec.length){const el=document.createElement('div');el.className='pm-recommended';el.innerHTML=`<div class="pm-rec-title">También te puede interesar</div><div class="pm-rec-grid">${rec.map(r=>`<div class="pm-rec-card" onclick="closeMod('productModal');setTimeout(()=>openProductModal('${r.id}'),120)"><div class="pm-rec-img">${r.imagen?`<img src="${r.imagen}" alt="" loading="lazy">`:r.emoji||'📦'}</div><div class="pm-rec-info"><div class="pm-rec-name">${r.nombre}</div><div class="pm-rec-price">${fmt(r.precio)}</div></div></div>`).join('')}</div>`;inner.appendChild(el)}
  inner.querySelector('#pmLikeBtn')?.addEventListener('click',e=>{toggleLike(p.id,window._allProducts);const liked=isLiked(p.id);e.currentTarget.classList.toggle('liked',liked);e.currentTarget.innerHTML=heartSVG(liked)+(liked?' En favoritos':' Agregar a favoritos')});
  modal.classList.add('open');document.body.style.overflow='hidden';
}
window.pmSwapImg=function(thumb){document.querySelectorAll('.pm-thumb').forEach(t=>t.classList.remove('active'));thumb.classList.add('active');const wrap=document.getElementById('pmMainImgWrap');if(!wrap)return;const img=thumb.dataset.img;wrap.innerHTML=img?`<img id="pmMainImg" src="${img}" alt="">`:  `<div id="pmMainImg" class="pm-emoji-placeholder">${thumb.dataset.emoji||'📦'}</div>`};
window.pmChangeSabor=function(sel,sabores){const idx=parseInt(sel.value);if(isNaN(idx))return;const s=sabores[idx];if(!s)return;const wrap=document.getElementById('pmMainImgWrap');if(!wrap)return;if(s.imagen)wrap.innerHTML=`<img id="pmMainImg" src="${s.imagen}" alt="${s.nombre}">`;document.querySelectorAll('.pm-thumb').forEach((t,i)=>t.classList.toggle('active',i===idx))};
function closeMod(id){const el=document.getElementById(id);if(el){el.classList.remove('open');document.body.style.overflow=''}}

/* ── MODALS ──────────────────────────────────────────────── */
function initModals(){
  document.getElementById('wishlistNavBtn')?.addEventListener('click',e=>{e.preventDefault();renderWishlistModal(window._allProducts);document.getElementById('wishlistModal')?.classList.add('open');document.body.style.overflow='hidden'});
  document.getElementById('cartNavBtn')?.addEventListener('click',()=>{renderCartModal();document.getElementById('cartModal')?.classList.add('open');document.body.style.overflow='hidden'});
  ['wishlistClose','cartClose','productModalClose'].forEach(id=>{document.getElementById(id)?.addEventListener('click',()=>{document.querySelectorAll('.modal-overlay.open').forEach(m=>m.classList.remove('open'));document.body.style.overflow=''})});
  document.querySelectorAll('.modal-overlay').forEach(o=>{o.addEventListener('click',e=>{if(e.target===o){o.classList.remove('open');document.body.style.overflow=''}})});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelectorAll('.modal-overlay.open').forEach(m=>m.classList.remove('open'));document.body.style.overflow=''}});
}

/* ── NAVBAR ──────────────────────────────────────────────── */
function initNavbar(){
  window.addEventListener('scroll',()=>{document.getElementById('navbar')?.classList.toggle('scrolled',window.scrollY>60)});
  const ham=document.getElementById('hamburger'),nav=document.getElementById('mobileNav');
  ham?.addEventListener('click',()=>{ham.classList.toggle('open');nav?.classList.toggle('open')});
}
let _sd=null;
function initSearch(onSearch){
  const btn=document.getElementById('searchBtn'),bar=document.getElementById('searchBar'),inp=document.getElementById('searchInput'),cls=document.getElementById('searchClose');
  btn?.addEventListener('click',()=>{bar?.classList.toggle('open');if(bar?.classList.contains('open'))setTimeout(()=>inp?.focus(),50)});
  cls?.addEventListener('click',()=>{bar?.classList.remove('open');if(inp)inp.value='';onSearch&&onSearch('')});
  inp?.addEventListener('input',()=>{clearTimeout(_sd);_sd=setTimeout(()=>onSearch&&onSearch(inp.value),300)});
}
function initCarousel(n){
  const track=document.getElementById('carouselTrack'),dots=document.getElementById('carouselDots');if(!track)return;
  let idx=0,timer=null;
  function goTo(i){idx=((i%n)+n)%n;track.style.transform=`translateX(-${idx*100}%)`;document.querySelectorAll('.dot').forEach((d,j)=>d.classList.toggle('active',j===idx))}
  function start(){timer=setInterval(()=>goTo(idx+1),5000)}function reset(){clearInterval(timer);start()}
  if(dots){dots.innerHTML='';for(let i=0;i<n;i++){const d=document.createElement('button');d.className=`dot${i===0?' active':''}`;d.addEventListener('click',()=>{goTo(i);reset()});dots.appendChild(d)}}
  document.getElementById('prevBtn')?.addEventListener('click',()=>{goTo(idx-1);reset()});
  document.getElementById('nextBtn')?.addEventListener('click',()=>{goTo(idx+1);reset()});
  start();
}

/* ── DATA ────────────────────────────────────────────────── */
async function loadProducts(){
  try{const res=await fetch(BW.DATA);const data=await res.json();return{productos:data.productos||[],stacks:data.stacks||[]}}
  catch(e){console.warn('fetch:',e.message);return{productos:_fallback(),stacks:[]}}
}
function sortProducts(list,mode){
  const a=[...list];
  if(mode==='price-asc')return a.sort((a,b)=>a.precio-b.precio);
  if(mode==='price-desc')return a.sort((a,b)=>b.precio-a.precio);
  if(mode==='name-asc')return a.sort((a,b)=>a.nombre.localeCompare(b.nombre));
  if(mode==='name-desc')return a.sort((a,b)=>b.nombre.localeCompare(a.nombre));
  return a;
}
function renderGrid(cid,products,eid,kid,filterActive){
  const grid=document.getElementById(cid),empty=document.getElementById(eid),count=document.getElementById(kid);if(!grid)return;
  grid.innerHTML='';
  if(!products.length){if(empty){empty.style.display='block';empty.innerHTML=emptyWAHtml(filterActive)}if(count)count.textContent='Sin resultados';return}
  if(empty)empty.style.display='none';
  if(count)count.textContent=`${products.length} producto${products.length!==1?'s':''}`;
  const frag=document.createDocumentFragment();products.forEach(p=>frag.appendChild(createCard(p)));grid.appendChild(frag);
}

function _fallback(){return[
  {id:'001',nombre:'Whey Protein Isolate 5LB',marca:'NUTRABIO',precio:48900,precioAnterior:55000,categorias:['proteinas','isoladas'],descripcion:'Proteína aislada 27g.',emoji:'💪',imagen:'',imagenNutricional:'',sabores:[{nombre:'Chocolate',imagen:''},{nombre:'Vainilla',imagen:''}],tamanios:['2 LB','5 LB'],caracteristicas:['27g proteína','0g azúcar'],modoDeUso:'1 scoop en 250ml.',badge:'oferta',destacado:true,disponible:true},
  {id:'003',nombre:'Creatina Monohidrato 1KG',marca:'NUTREX',precio:18500,precioAnterior:22000,categorias:['suplementos','creatinas'],descripcion:'Creatina grado farmacéutico.',emoji:'🔬',imagen:'',imagenNutricional:'',sabores:[{nombre:'Sin sabor',imagen:''}],tamanios:['1KG'],caracteristicas:['5g por servicio'],modoDeUso:'5g post-entrenamiento.',badge:'oferta',destacado:true,disponible:true},
  {id:'004',nombre:'Mother Bucker Pre-Workout',marca:'CBUM',precio:38500,precioAnterior:null,categorias:['suplementos','pre-entrenos'],descripcion:'Pre-workout alta estimulación.',emoji:'⚡',imagen:'',imagenNutricional:'',sabores:[{nombre:'Blue Razz',imagen:''}],tamanios:['30 servicios'],caracteristicas:['300mg cafeína'],modoDeUso:'1 scoop 30min antes.',badge:'nuevo',destacado:true,disponible:true},
]}

document.addEventListener('DOMContentLoaded',()=>{
  initNavbar();initModals();refreshCartUI();
  const wc=_wishlist.length;
  document.querySelectorAll('.wishlist-count').forEach(el=>{el.textContent=wc;el.classList.toggle('visible',wc>0)});
  document.querySelectorAll('.wishlist-btn').forEach(b=>b.classList.toggle('has-items',wc>0));
});
