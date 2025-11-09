document.addEventListener('DOMContentLoaded', () => {

  const PRODUCTS = [
    { id: 1, name: "Maglietta Basic", price: 19.99, category: "Magliette",
      img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop",
      colors: [{code:'#ffffff', name:'Bianco'},{code:'#000000', name:'Nero'},{code:'#e63946', name:'Rosso'}],
      description: "Maglietta in cotone 100% biologico, taglio regolare. Morbida al tatto e resistente ai lavaggi." },

    { id: 2, name: "Maglietta Logo", price: 24.99, category: "Magliette",
      img: "https://images.unsplash.com/photo-1537832816519-689ad163238b?q=80&w=1200&auto=format&fit=crop",
      colors: [{code:'#2b2d42', name:'Antracite'},{code:'#f8f9fa', name:'Grigio chiaro'}],
      description: "Maglietta con logo stampato, stampa water-based, tessuto a maglia fine." },

    { id: 3, name: "Cappello Estivo", price: 14.99, category: "Cappelli",
      img: "https://images.unsplash.com/photo-1528701800489-20be5f2c8d49?q=80&w=1200&auto=format&fit=crop",
      colors: [{code:'#f1faee', name:'Crema'},{code:'#2a9d8f', name:'Teal'}],
      description: "Cappello leggero, ideale per l'estate. Regolabile e traspirante." },

    { id: 4, name: "Zaino Tech", price: 49.99, category: "Accessori",
      img: "https://images.unsplash.com/photo-1556742043-3c52d6e88c62?q=80&w=1200&auto=format&fit=crop",
      colors: [{code:'#1b1f3b', name:'Notte'},{code:'#6c757d', name:'Grigio'}],
      description: "Zaino con scomparto laptop, tasche multiple e tessuto idrorepellente." },

    { id: 5, name: "Tazza Termica", price: 12.50, category: "Accessori",
      img: "https://images.unsplash.com/photo-1528806635741-2e7b2fb0c9d4?q=80&w=1200&auto=format&fit=crop",
      colors: [{code:'#ffffff', name:'Bianco'},{code:'#000000', name:'Nero'}],
      description: "Tazza termica con doppia parete, mantiene la temperatura ed è anti-scottatura." }
  ];

  /* ==========================
     STATO: carrello (array di items)
     formato item: { productId, qty, color: {code,name} }
     ========================== */
  let cart = []; // inizializziamo vuoto ad ogni reload (come richiesto)
  function saveCart(){ try { localStorage.setItem('cart', JSON.stringify(cart)); } catch(e){} }

  /* ==========================
     HELPERS
     ========================== */
  const el = id => document.getElementById(id);
  const fmt = v => new Intl.NumberFormat('it-IT',{style:'currency',currency:'EUR'}).format(v);

  /* ==========================
     RENDER CATEGORIES (sidebar + offcanvas)
     ========================== */
  function getCategories(){ return ['Tutti', ...Array.from(new Set(PRODUCTS.map(p=>p.category)))]; }
  function renderCategories(){
    const cats = getCategories();
    const off = el('offcanvasCategoryList');
    const side = el('sidebarCategories');
    const markup = cats.map(c => `<button class="list-group-item list-group-item-action" data-cat="${c}">${c}</button>`).join('');
    if (off) off.innerHTML = markup;
    if (side) side.innerHTML = markup;
  }

  /* ==========================
     RENDER LISTA PRODOTTI (prodotti.html)
     ==========================
    l'icona "occhio" è un <a href="product.html?id=..."> che apre la pagina dettaglio.
     Il pulsante "Aggiungi" mantiene data-add per aggiungere direttamente al carrello.
     ========================== */
  function renderProductsGrid(filterCategory='Tutti'){
    const grid = el('productGrid');
    if (!grid) return;
    let list = PRODUCTS.slice();
    if (filterCategory && filterCategory !== 'Tutti') list = list.filter(p => p.category === filterCategory);
    grid.innerHTML = list.map(p => `
      <div class="col-12 col-sm-6 col-lg-4">
        <div class="card product-card h-100 shadow-sm">
          <img src="${p.img}" class="card-img-top" alt="${p.name}">
          <div class="card-body d-flex flex-column">
            <h6 class="mb-1">${p.name}</h6>
            <div class="small text-muted mb-2">${p.category}</div>
            <div class="mt-auto d-flex justify-content-between align-items-center">
              <div class="price">${fmt(p.price)}</div>
              <div class="btn-group">
                <a href="product.html?id=${encodeURIComponent(p.id)}" class="btn btn-sm btn-outline-primary" title="Vedi dettagli">
                  <i class="bi bi-eye"></i>
                </a>
                <button class="btn btn-sm btn-primary" data-add="${p.id}">
                  <i class="bi bi-bag-plus me-1"></i>Aggiungi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  /* ==========================
     RENDER FEATURED (home)
     ==========================
     l'icona "occhio" è un link alla pagina prodotto
     ========================== */
  function renderFeatured(){
    const f = el('featuredGrid'); if (!f) return;
    const featured = PRODUCTS.slice(0,3);
    f.innerHTML = featured.map(p => `
      <div class="col-md-4">
        <div class="card product-card h-100 shadow-sm">
          <img src="${p.img}" class="card-img-top" alt="${p.name}">
          <div class="card-body d-flex flex-column">
            <h6 class="mb-1">${p.name}</h6>
            <div class="mt-auto d-flex justify-content-between align-items-center">
              <div class="price">${fmt(p.price)}</div>
              <div>
                <a href="product.html?id=${encodeURIComponent(p.id)}" class="btn btn-sm btn-outline-primary" title="Vedi dettagli"><i class="bi bi-eye"></i></a>
                <button class="btn btn-sm btn-primary" data-add="${p.id}">Aggiungi</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  /* ==========================
     RENDER CARRELLO (offcanvas)
     ========================== */
  function cartCount(){ return cart.reduce((sum,i)=>sum + i.qty, 0); }
  function cartSubtotal(){ return cart.reduce((sum,i)=>{
    const p = PRODUCTS.find(x=>x.id==i.productId); return sum + (p ? p.price * i.qty : 0);
  }, 0); }

  function renderCart(){
    const list = el('cartList'); if (!list) return;
    if (!cart.length) {
      list.innerHTML = '<li class="list-group-item">Il carrello è vuoto.</li>';
      el('checkoutBtn') && (el('checkoutBtn').disabled = true);
    } else {
      el('checkoutBtn') && (el('checkoutBtn').disabled = false);
      list.innerHTML = cart.map((it, idx) => {
        const p = PRODUCTS.find(x=>x.id==it.productId);
        return p ? `<li class="list-group-item d-flex gap-3 align-items-center">
          <img src="${p.img}" alt="${p.name}" width="56" height="56" style="object-fit:cover" class="rounded">
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between"><strong>${p.name}</strong><span>${fmt(p.price * it.qty)}</span></div>
            <div class="small text-muted">Colore: ${it.color ? it.color.name : '-'}</div>
            <div class="d-flex gap-2 mt-2 align-items-center">
              <button class="btn btn-sm btn-outline-secondary" data-dec="${idx}">-</button>
              <input class="form-control form-control-sm text-center" style="width:64px" value="${it.qty}" data-qty="${idx}">
              <button class="btn btn-sm btn-outline-secondary" data-inc="${idx}">+</button>
              <button class="btn btn-sm btn-outline-danger ms-auto" data-rm="${idx}"><i class="bi bi-trash"></i></button>
            </div>
          </div>
        </li>` : '';
      }).join('');
    }
    el('cartBadge') && (el('cartBadge').textContent = cartCount());
    el('cartSubtotal') && (el('cartSubtotal').textContent = fmt(cartSubtotal()));
    saveCart();
  }

  /* ==========================
     ADD TO CART (considera colore)
     - se item con stesso productId+color esiste, incrementa qty
     ========================== */
  function addToCart(productId, qty = 1, color = null){
    const pid = Number(productId);
    // cerca già esistente con stesso id+color
    const existing = cart.find(i => i.productId === pid && ((i.color && color && i.color.code === color.code) || (!i.color && !color)));
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ productId: pid, qty: qty, color: color });
    }
    renderCart();
  }

  function setCartQty(idx, qty){
    qty = Number(qty) || 0;
    if (qty <= 0) cart.splice(idx, 1);
    else cart[idx].qty = qty;
    renderCart();
  }
  function removeCartItem(idx){
    cart.splice(idx, 1); renderCart();
  }

  /* ==========================
     RENDER PRODUCT DETAIL (product.html)
     ========================== */
  function renderProductDetail(){
    const detailRoot = el('productDetail');
    if (!detailRoot) return;
    //read id from querystring
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get('id'));
    if (!id) {
      detailRoot.innerHTML = `<div class="col-12"><div class="alert alert-warning">Prodotto non trovato.</div></div>`;
      return;
    }
    const p = PRODUCTS.find(x=>x.id===id);
    if (!p) {
      detailRoot.innerHTML = `<div class="col-12"><div class="alert alert-warning">Prodotto non trovato.</div></div>`;
      return;
    }

    //build color options markup
    const colorsHtml = (p.colors || []).map((c, i) => `
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" name="prodColor" id="color-${i}" value="${i}" ${i===0?'checked':''}>
        <label class="form-check-label" for="color-${i}"><span style="display:inline-block;width:18px;height:18px;background:${c.code};border-radius:4px;margin-right:6px;border:1px solid rgba(0,0,0,0.12);vertical-align:middle"></span>${c.name}</label>
      </div>
    `).join('');

    detailRoot.innerHTML = `
      <div class="col-lg-6">
        <div class="card mb-3">
          <img src="${p.img}" alt="${p.name}" class="img-fluid">
        </div>
      </div>

      <div class="col-lg-6">
        <h2 class="mb-2">${p.name}</h2>
        <div class="small text-muted mb-3">${p.category}</div>
        <div class="mb-3"><strong class="fs-4">${fmt(p.price)}</strong></div>
        <p class="text-muted">${p.description}</p>

        <div class="mb-3">
          <label class="d-block mb-2">Colore</label>
          ${colorsHtml || '<div class="text-muted small">Nessuna opzione colore.</div>'}
        </div>

        <div class="mb-3 d-flex align-items-center gap-2">
          <label class="mb-0">Quantità</label>
          <input id="detailQty" type="number" class="form-control form-control-sm" style="width:80px" min="1" value="1">
        </div>

        <div class="d-flex gap-2">
          <button id="btnAddDetail" class="btn btn-primary"><i class="bi bi-bag-plus me-1"></i>Aggiungi al carrello</button>
          <a href="prodotti.html" class="btn btn-outline-secondary">Torna ai prodotti</a>
        </div>
      </div>
    `;

    //attach handler for add button
    const btn = el('btnAddDetail');
    if (btn) {
      btn.addEventListener('click', () => {
        const qtyInput = el('detailQty');
        let qty = Number(qtyInput?.value) || 1;
        if (qty < 1) qty = 1;
        //get selected color
        const checked = document.querySelector('input[name="prodColor"]:checked');
        const colorIndex = checked ? Number(checked.value) : null;
        const color = (colorIndex !== null && p.colors && p.colors[colorIndex]) ? p.colors[colorIndex] : null;
        addToCart(p.id, qty, color);
        //feedback rapido: apri carrello offcanvas
        const off = new bootstrap.Offcanvas(document.getElementById('offcanvasCart'));
        off.show();
      });
    }
  }

  /* ==========================
     EVENT DELEGATION: gestione click generale (aggiungi, detail, cart controls, categorie)
     ========================== */
  document.body.addEventListener('click', (ev) => {
    //add from cards / featured
    const add = ev.target.closest('[data-add]');
    if (add) { addToCart(Number(add.getAttribute('data-add')), 1, null); return; }

    //detail buttons on cards
    const detailBtn = ev.target.closest('[data-detail]');
    if (detailBtn) {
      const id = Number(detailBtn.getAttribute('data-detail'));
      if (id) window.location.href = `product.html?id=${encodeURIComponent(id)}`;
      return;
    }

    //cart controls (by index)
    const dec = ev.target.closest('[data-dec]');
    if (dec) { const idx = Number(dec.getAttribute('data-dec')); if (!isNaN(idx)) { const current = cart[idx]?.qty || 1; setCartQty(idx, Math.max(0, current - 1)); } return; }
    const inc = ev.target.closest('[data-inc]');
    if (inc) { const idx = Number(inc.getAttribute('data-inc')); if (!isNaN(idx)) setCartQty(idx, (cart[idx]?.qty || 1) + 1); return; }
    const rm = ev.target.closest('[data-rm]');
    if (rm) { const idx = Number(rm.getAttribute('data-rm')); if (!isNaN(idx)) removeCartItem(idx); return; }

    //categories
    const catBtn = ev.target.closest('[data-cat]');
    if (catBtn) {
      const cat = catBtn.getAttribute('data-cat');
      if (window.location.pathname.endsWith('prodotti.html')) {
        renderProductsGrid(cat);
      } else {
        //go to prodotti page with hash param
        window.location.href = `prodotti.html#cat=${encodeURIComponent(cat)}`;
      }
      return;
    }
  });

  //cart qty input change
  document.body.addEventListener('change', (ev) => {
    const q = ev.target.closest('[data-qty]');
    if (q) {
      const idx = Number(q.getAttribute('data-qty'));
      const v = Number(q.value) || 1;
      setCartQty(idx, v);
    }
  });

  /* ==========================
     INIZIALIZZAZIONE
     ========================== */
  renderCategories();
  renderFeatured();
  renderProductsGrid();
  renderCart();

  //se siamo su prodotti.html e c'è hash cat=.., applica filtro
  if (window.location.pathname.endsWith('prodotti.html')) {
    const hash = (window.location.hash || '').replace('#','');
    if (hash.startsWith('cat=')) {
      const cat = decodeURIComponent(hash.replace('cat=',''));
      if (cat) renderProductsGrid(cat);
    }
  }

  //se siamo su product.html -> render dettaglio
  if (window.location.pathname.endsWith('product.html')) {
    renderProductDetail();
  }

  //evidenzia nav corrente (base sul path)
  const path = window.location.pathname;
  if (path.endsWith('index.html') || path.endsWith('/')) document.getElementById('nav-home')?.classList.add('active');
  else if (path.endsWith('prodotti.html')) document.getElementById('nav-shop')?.classList.add('active');
  else if (path.endsWith('chi-siamo.html')) document.getElementById('nav-about')?.classList.add('active');

  //set footer year
  if (el('year')) el('year').textContent = new Date().getFullYear();

  //ensure cart empty on load (per la tua richiesta precedente)
  cart = []; saveCart(); renderCart();

});


