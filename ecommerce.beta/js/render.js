import { PRODUCTS } from "./products.js";
import {
  cart,
  cartCount,
  cartSubtotal,
  setCartQty,
  removeCartItem,
  saveCart
} from "./storage.js";

const el = (id) => document.getElementById(id);
const fmt = (v) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(
    v
  );

/* ======================
   CATEGORIES
====================== */

export function getCategories() {
  return ["Tutti", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];
}

export function renderCategories() {
  const cats = getCategories();
  const off = el("offcanvasCategoryList");
  const side = el("sidebarCategories");

  const markup = cats
    .map(
      (c) =>
        `<button class="list-group-item list-group-item-action" data-cat="${c}">${c}</button>`
    )
    .join("");

  if (off) off.innerHTML = markup;
  if (side) side.innerHTML = markup;
}

/* ======================
   PRODUCTS GRID
====================== */

export function renderProductsGrid(filterCategory = "Tutti") {
  const grid = el("productGrid");
  if (!grid) return;

  let list = PRODUCTS.slice();
  if (filterCategory !== "Tutti")
    list = list.filter((p) => p.category === filterCategory);

  grid.innerHTML = list
    .map(
      (p) => `
    <div class="col-12 col-sm-6 col-lg-4">
      <div class="card product-card h-100 shadow-sm">
        <img src="${p.img}" class="card-img-top" alt="${p.name}">
        <div class="card-body d-flex flex-column">
          <h6 class="mb-1">${p.name}</h6>
          <div class="small text-muted mb-2">${p.category}</div>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <div class="price">${fmt(p.price)}</div>
            <div class="btn-group">
              <a href="product.html?id=${encodeURIComponent(
                p.id
              )}" class="btn btn-sm btn-outline-primary">
                <i class="bi bi-eye"></i>
              </a>
              <button class="btn btn-sm btn-primary" data-add="${p.id}">
                <i class="bi bi-bag-plus me-1"></i>Aggiungi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>`
    )
    .join("");
}

/* ======================
   FEATURED (home)
====================== */

export function renderFeatured() {
  const f = el("featuredGrid");
  if (!f) return;

  const featured = PRODUCTS.slice(0, 3);

  f.innerHTML = featured
    .map(
      (p) => `
    <div class="col-md-4">
      <div class="card product-card h-100 shadow-sm">
        <img src="${p.img}" class="card-img-top" alt="${p.name}">
        <div class="card-body d-flex flex-column">
          <h6 class="mb-1">${p.name}</h6>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <div class="price">${fmt(p.price)}</div>
            <div>
              <a href="product.html?id=${encodeURIComponent(
                p.id
              )}" class="btn btn-sm btn-outline-primary">
                <i class="bi bi-eye"></i>
              </a>
              <button class="btn btn-sm btn-primary" data-add="${p.id}">
                Aggiungi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>`
    )
    .join("");
}

/* ======================
   RENDER CARRELLO
====================== */

export function renderCart() {
  const list = el("cartList");
  if (!list) return;

  if (!cart.length) {
    list.innerHTML = `<li class="list-group-item">Il carrello è vuoto.</li>`;
    const btn = el("checkoutBtn");
    if (btn) btn.disabled = true;
  } else {
    const btn = el("checkoutBtn");
    if (btn) btn.disabled = false;

    list.innerHTML = cart
      .map((it, idx) => {
        const p = PRODUCTS.find((x) => x.id === it.productId);
        return p
          ? `<li class="list-group-item d-flex gap-3 align-items-center">
              <img src="${p.img}" width="56" height="56" class="rounded" style="object-fit:cover;">
              <div class="flex-grow-1">
                <div class="d-flex justify-content-between">
                  <strong>${p.name}</strong>
                  <span>${fmt(p.price * it.qty)}</span>
                </div>
                <div class="small text-muted">Colore: ${
                  it.color ? it.color.name : "-"
                }</div>

                <div class="d-flex gap-2 mt-2 align-items-center">
                  <button class="btn btn-sm btn-outline-secondary" data-dec="${idx}">
                    -
                  </button>
                  <input
                    class="form-control form-control-sm text-center"
                    style="width:64px"
                    value="${it.qty}"
                    data-qty="${idx}">
                  <button class="btn btn-sm btn-outline-secondary" data-inc="${idx}">
                    +
                  </button>
                  <button class="btn btn-sm btn-outline-danger ms-auto" data-rm="${idx}">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </li>`
          : "";
      })
      .join("");
  }

  if (el("cartBadge")) el("cartBadge").textContent = cartCount();
  if (el("cartSubtotal"))
    el("cartSubtotal").textContent = fmt(cartSubtotal());

  saveCart();
}
