/* ============================================================
   STACK NUTRITION — CATALOG SCRIPT
   ============================================================ */

// ── CONFIG ──────────────────────────────────────────────────
const CONFIG = {
  storeName:    'BOX Wellness',
  whatsapp:     '50661179692',       // fallback global
  currency:     '₡',
  dataFile:     'productos.json',
};

// ── STATE ────────────────────────────────────────────────────
let allProducts  = [];
let allStacks    = [];
let wishlist     = JSON.parse(localStorage.getItem('sn_wishlist') || '[]');
let activeFilter = 'all';
let activeSort   = 'default';
let searchQuery  = '';
let carouselIdx  = 0;
let carouselTotal = 3;
let carouselTimer = null;

// ── UTILS ────────────────────────────────────────────────────
function formatPrice(n) {
  return CONFIG.currency + n.toLocaleString('es-CR');
}

function waLink(phone, productName, price) {
  const msg = encodeURIComponent(
    `Hola, me interesa el producto: *${productName}* — ${formatPrice(price)}. ¿Está disponible?`
  );
  return `https://wa.me/${phone}?text=${msg}`;
}

function isLiked(id) {
  return wishlist.includes(id);
}

function toggleLike(id) {
  if (isLiked(id)) {
    wishlist = wishlist.filter(w => w !== id);
  } else {
    wishlist.push(id);
  }
  localStorage.setItem('sn_wishlist', JSON.stringify(wishlist));
  updateWishlistUI();
}

function saveWishlist() {
  localStorage.setItem('sn_wishlist', JSON.stringify(wishlist));
}

// ── WISHLIST UI ──────────────────────────────────────────────
function updateWishlistUI() {
  const count     = wishlist.length;
  const countEl   = document.getElementById('wishlistCount');
  const navBtn    = document.getElementById('wishlistNavBtn');

  countEl.textContent = count;
  countEl.classList.toggle('visible', count > 0);
  navBtn.classList.toggle('has-items', count > 0);

  // Update all like buttons on the page
  document.querySelectorAll('.like-btn').forEach(btn => {
    const id = btn.dataset.id;
    btn.classList.toggle('liked', isLiked(id));
  });

  // Render wishlist modal body
  renderWishlistModal();
}

function renderWishlistModal() {
  const body = document.getElementById('wishlistBody');
  if (!body) return;

  if (wishlist.length === 0) {
    body.innerHTML = `
      <div class="empty-wishlist">
        <svg viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5" width="60" height="60">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <p>Aún no tenés favoritos.<br>Dale ❤️ a los productos que te gusten.</p>
      </div>`;
    return;
  }

  const likedProducts = allProducts.filter(p => wishlist.includes(p.id));
  body.innerHTML = likedProducts.map(p => `
    <div class="wishlist-item">
      <div class="wi-img">${p.imagen ? `<img src="${p.imagen}" alt="${p.nombre}" loading="lazy">` : p.emoji}</div>
      <div class="wi-info">
        <div class="wi-brand">${p.marca}</div>
        <div class="wi-name">${p.nombre}</div>
        <div class="wi-price">${formatPrice(p.precio)}</div>
      </div>
      <button class="wi-remove" onclick="toggleLike('${p.id}')" title="Quitar">✕</button>
    </div>
  `).join('');
}

// ── PRODUCT CARD ─────────────────────────────────────────────
function createProductCard(p, isRow = false) {
  const badge = p.badge ? `<span class="product-badge badge-${p.badge}">${
    p.badge === 'oferta' ? '¡Oferta!' : p.badge === 'nuevo' ? 'Nuevo' : 'Top'
  }</span>` : '';

  const oldPrice = p.precioAnterior
    ? `<span class="product-price-old">${formatPrice(p.precioAnterior)}</span>` : '';

  const imgContent = p.imagen
    ? `<img src="${p.imagen}" alt="${p.nombre}" loading="lazy">`
    : `<div class="product-img-placeholder">${p.emoji}</div>`;

  const phone = p.whatsapp || CONFIG.whatsapp;

  const card = document.createElement('div');
  card.className = 'product-card';
  card.dataset.id = p.id;
  card.innerHTML = `
    <div class="product-img-wrap">
      ${imgContent}
      ${badge}
      <button class="like-btn ${isLiked(p.id) ? 'liked' : ''}" data-id="${p.id}" title="Me gusta">
        <svg viewBox="0 0 24 24" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
      <div class="product-hover-overlay">
        <button class="btn-ver" data-id="${p.id}">Ver detalles</button>
        <a class="btn-wa" href="${waLink(phone, p.nombre, p.precio)}" target="_blank" onclick="event.stopPropagation()">
          <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          WA
        </a>
      </div>
    </div>
    <div class="product-info">
      <div class="product-brand">${p.marca}</div>
      <div class="product-name">${p.nombre}</div>
      <div class="product-price-row">
        <span class="product-price">${formatPrice(p.precio)}</span>
        ${oldPrice}
      </div>
      <span class="product-cat-tag">${p.categoria}</span>
    </div>
  `;

  // Like button
  card.querySelector('.like-btn').addEventListener('click', e => {
    e.stopPropagation();
    const id = e.currentTarget.dataset.id;
    toggleLike(id);
    // animate
    e.currentTarget.style.transform = 'scale(1.35)';
    setTimeout(() => { e.currentTarget.style.transform = ''; }, 200);
  });

  // Ver button & card click → open modal
  card.querySelector('.btn-ver').addEventListener('click', e => {
    e.stopPropagation();
    openProductModal(p.id);
  });
  card.addEventListener('click', () => openProductModal(p.id));

  return card;
}

// ── PRODUCT MODAL ────────────────────────────────────────────
function openProductModal(id) {
  const p = allProducts.find(x => x.id === id);
  if (!p) return;

  const phone   = p.whatsapp || CONFIG.whatsapp;
  const modal   = document.getElementById('productModal');
  const inner   = document.getElementById('productModalInner');

  const imgContent = p.imagen
    ? `<img src="${p.imagen}" alt="${p.nombre}" loading="lazy">`
    : p.emoji;

  const oldPrice = p.precioAnterior
    ? `<div class="pm-price-old">${formatPrice(p.precioAnterior)}</div>` : '';

  inner.innerHTML = `
    <div class="pm-img">${imgContent}</div>
    <div class="pm-details">
      <div class="pm-brand">${p.marca}</div>
      <div class="pm-name">${p.nombre}</div>
      <div class="pm-price">${formatPrice(p.precio)}</div>
      ${oldPrice}
      <div class="pm-desc">${p.descripcion}</div>
      <div class="pm-actions">
        <a class="pm-btn-wa" href="${waLink(phone, p.nombre, p.precio)}" target="_blank">
          <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Comprar por WhatsApp
        </a>
        <button class="pm-btn-like ${isLiked(p.id) ? 'liked' : ''}" data-id="${p.id}">
          <svg viewBox="0 0 24 24" fill="${isLiked(p.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          ${isLiked(p.id) ? 'Guardado en favoritos' : 'Agregar a favoritos'}
        </button>
      </div>
    </div>
  `;

  inner.querySelector('.pm-btn-like').addEventListener('click', e => {
    toggleLike(p.id);
    const btn = e.currentTarget;
    const liked = isLiked(p.id);
    btn.classList.toggle('liked', liked);
    btn.querySelector('svg').setAttribute('fill', liked ? 'currentColor' : 'none');
    btn.childNodes[btn.childNodes.length - 1].textContent = liked
      ? ' Guardado en favoritos' : ' Agregar a favoritos';
  });

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('open');
  document.body.style.overflow = '';
}

// ── RENDER FEATURED ──────────────────────────────────────────
function renderFeatured() {
  const row = document.getElementById('productsRow');
  const featured = allProducts.filter(p => p.destacado);
  const frag = document.createDocumentFragment();
  featured.forEach(p => frag.appendChild(createProductCard(p, true)));
  row.innerHTML = '';
  row.appendChild(frag);
}

// ── RENDER ALL PRODUCTS ──────────────────────────────────────
function getFilteredProducts() {
  let list = [...allProducts];

  // Filter by category
  if (activeFilter !== 'all') {
    list = list.filter(p => p.categoria === activeFilter);
  }

  // Search filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    list = list.filter(p =>
      p.nombre.toLowerCase().includes(q) ||
      p.marca.toLowerCase().includes(q) ||
      p.categoria.toLowerCase().includes(q)
    );
  }

  // Sort
  switch (activeSort) {
    case 'price-asc':  list.sort((a, b) => a.precio - b.precio); break;
    case 'price-desc': list.sort((a, b) => b.precio - a.precio); break;
    case 'name-asc':   list.sort((a, b) => a.nombre.localeCompare(b.nombre)); break;
  }

  return list;
}

function renderAllProducts() {
  const grid     = document.getElementById('productsGrid');
  const empty    = document.getElementById('emptyState');
  const countEl  = document.getElementById('productCount');
  const list     = getFilteredProducts();

  grid.innerHTML = '';
  empty.style.display = 'none';

  if (list.length === 0) {
    empty.style.display = 'block';
    countEl.textContent = 'Sin resultados';
    return;
  }

  countEl.textContent = `Mostrando ${list.length} producto${list.length !== 1 ? 's' : ''}`;
  const frag = document.createDocumentFragment();
  list.forEach(p => frag.appendChild(createProductCard(p)));
  grid.appendChild(frag);
}

// ── RENDER STACKS ────────────────────────────────────────────
function renderStacks() {
  const grid = document.getElementById('stacksGrid');
  if (!grid || !allStacks.length) return;

  const waBase = CONFIG.whatsapp;

  grid.innerHTML = allStacks.map(s => `
    <div class="stack-card">
      <div class="stack-tag">${s.objetivo}</div>
      <div class="stack-name">${s.nombre}</div>
      <ul class="stack-items">
        ${s.productos.map(item => `<li>${item}</li>`).join('')}
      </ul>
      <div class="stack-price-row">
        <span class="stack-price">${formatPrice(s.precio)}</span>
        <span class="stack-discount">-${s.descuento}</span>
      </div>
      <a href="https://wa.me/${waBase}?text=${encodeURIComponent('Hola, me interesa el ' + s.nombre + ' — ' + formatPrice(s.precio))}" target="_blank" class="stack-btn">
        <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        Consultar Stack
      </a>
    </div>
  `).join('');
}

// ── CAROUSEL ─────────────────────────────────────────────────
function goToSlide(idx) {
  const track = document.getElementById('carouselTrack');
  const dots   = document.querySelectorAll('.dot');

  carouselIdx = (idx + carouselTotal) % carouselTotal;
  track.style.transform = `translateX(-${carouselIdx * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === carouselIdx));
}

function initCarousel() {
  const dotsContainer = document.getElementById('carouselDots');
  dotsContainer.innerHTML = '';

  for (let i = 0; i < carouselTotal; i++) {
    const dot = document.createElement('button');
    dot.className = `dot ${i === 0 ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => { goToSlide(i); resetTimer(); });
    dotsContainer.appendChild(dot);
  }

  document.getElementById('prevBtn').addEventListener('click', () => { goToSlide(carouselIdx - 1); resetTimer(); });
  document.getElementById('nextBtn').addEventListener('click', () => { goToSlide(carouselIdx + 1); resetTimer(); });

  startTimer();
}

function startTimer() {
  carouselTimer = setInterval(() => goToSlide(carouselIdx + 1), 5000);
}

function resetTimer() {
  clearInterval(carouselTimer);
  startTimer();
}

// ── NAVBAR SCROLL ─────────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ── SEARCH ────────────────────────────────────────────────────
let searchDebounce = null;

function initSearch() {
  const btn    = document.getElementById('searchBtn');
  const bar    = document.getElementById('searchBar');
  const input  = document.getElementById('searchInput');
  const close  = document.getElementById('searchClose');

  btn.addEventListener('click', () => {
    bar.classList.toggle('open');
    if (bar.classList.contains('open')) {
      input.focus();
      // scroll to products section
      setTimeout(() => document.getElementById('todos').scrollIntoView({ behavior: 'smooth' }), 300);
    }
  });

  close.addEventListener('click', () => {
    bar.classList.remove('open');
    input.value = '';
    searchQuery = '';
    renderAllProducts();
  });

  input.addEventListener('input', () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      searchQuery = input.value;
      renderAllProducts();
    }, 300);
  });
}

// ── FILTERS ───────────────────────────────────────────────────
function initFilters() {
  document.getElementById('filterPills').addEventListener('click', e => {
    if (!e.target.classList.contains('pill')) return;
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    e.target.classList.add('active');
    activeFilter = e.target.dataset.filter;
    renderAllProducts();
  });

  document.getElementById('sortSelect').addEventListener('change', e => {
    activeSort = e.target.value;
    renderAllProducts();
  });

  // Category cards filter
  document.querySelectorAll('.cat-card').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.dataset.cat;
      activeFilter = cat;
      document.querySelectorAll('.pill').forEach(p => {
        p.classList.toggle('active', p.dataset.filter === cat);
      });
      document.getElementById('todos').scrollIntoView({ behavior: 'smooth' });
      renderAllProducts();
    });
  });
}

// ── MODALS ─────────────────────────────────────────────────────
function initModals() {
  // Wishlist open
  document.getElementById('wishlistNavBtn').addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('wishlistModal').classList.add('open');
    document.body.style.overflow = 'hidden';
    renderWishlistModal();
  });

  // Wishlist close
  document.getElementById('wishlistClose').addEventListener('click', () => {
    document.getElementById('wishlistModal').classList.remove('open');
    document.body.style.overflow = '';
  });

  // Product modal close
  document.getElementById('productModalClose').addEventListener('click', closeProductModal);

  // Click outside to close
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // ESC key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => {
        m.classList.remove('open');
      });
      document.body.style.overflow = '';
    }
  });
}

// ── NAV LINKS ACTIVE ─────────────────────────────────────────
function initNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

// ── LOAD DATA ─────────────────────────────────────────────────
async function loadData() {
  try {
    const res  = await fetch(CONFIG.dataFile);
    const data = await res.json();
    allProducts = data.productos || [];
    allStacks   = data.stacks   || [];
  } catch (err) {
    console.warn('No se pudo cargar productos.json. Usando datos de ejemplo.');
    // Fallback inline data for development with file://
    allProducts = [
      { id: '001', nombre: 'Whey Protein 5LB', marca: 'Allmax', precio: 48900, precioAnterior: 55000, categoria: 'proteinas', descripcion: 'Proteína de alta calidad.', emoji: '💪', badge: 'oferta', destacado: true, disponible: true, whatsapp: '50661179692' },
      { id: '002', nombre: 'Pre-Workout Elite', marca: 'Bucked Up', precio: 38500, precioAnterior: null, categoria: 'pre-workout', descripcion: 'Máxima energía.', emoji: '⚡', badge: 'nuevo', destacado: true, disponible: true, whatsapp: '50661179692' },
      { id: '003', nombre: 'Creatina 1KG', marca: 'Rule One', precio: 18500, precioAnterior: 22000, categoria: 'creatina', descripcion: 'Creatina pura.', emoji: '🔬', badge: 'oferta', destacado: true, disponible: true, whatsapp: '50661179692' },
    ];
    allStacks = [];
  }
}

// ── INIT ──────────────────────────────────────────────────────
async function init() {
  await loadData();

  initCarousel();
  initNavbar();
  initSearch();
  initFilters();
  initModals();
  initNavLinks();

  renderFeatured();
  renderAllProducts();
  renderStacks();
  updateWishlistUI();
}

document.addEventListener('DOMContentLoaded', init);
