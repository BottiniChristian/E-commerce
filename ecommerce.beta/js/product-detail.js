import { PRODUCTS } from "./products.js";
import { addToCart } from "./storage.js";
import { renderCart } from "./render.js";

const el = (id) => document.getElementById(id);

export function renderProductDetail() {
  const detailRoot = el("productDetail");
  if (!detailRoot) return; // non siamo nella pagina product.html

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    detailRoot.innerHTML = `
      <div class="col-12">
        <div class="alert alert-warning">Prodotto non trovato.</div>
      </div>`;
    return;
  }

  const p = PRODUCTS.find((prod) => prod.id === id);

  if (!p) {
    detailRoot.innerHTML = `
      <div class="col-12">
        <div class="alert alert-warning">Prodotto non trovato.</div>
      </div>`;
    return;
  }

  /* ==========================
     GENERA HTML DETTAGLIO
  ========================== */

  const colorsHtml = (p.colors || [])
    .map(
      (c, i) => `
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio"
               name="prodColor" id="color-${i}" value="${i}"
               ${i === 0 ? "checked" : ""}>
        <label class="form-check-label" for="color-${i}">
          <span style="
            display:inline-block;
            width:18px;
            height:18px;
            background:${c.code};
            border-radius:4px;
            margin-right:6px;
            border:1px solid rgba(0,0,0,0.12);
            vertical-align:middle;">
          </span>${c.name}
        </label>
      </div>
    `
    )
    .join("");

  detailRoot.innerHTML = `
    <div class="col-lg-6">
      <div class="card mb-3">
        <img src="${p.img}" class="img-fluid" alt="${p.name}">
      </div>
    </div>

    <div class="col-lg-6">
      <h2 class="mb-2">${p.name}</h2>
      <div class="small text-muted mb-3">${p.category}</div>

      <div class="mb-3">
        <strong class="fs-4">${new Intl.NumberFormat("it-IT", {
          style: "currency",
          currency: "EUR",
        }).format(p.price)}</strong>
      </div>

      <p class="text-muted">${p.description}</p>

      <div class="mb-3">
        <label class="d-block mb-2">Colore</label>
        ${colorsHtml || "<div class='text-muted small'>Nessuna opzione colore.</div>"}
      </div>

      <div class="mb-3 d-flex align-items-center gap-2">
        <label class="mb-0">Quantità</label>
        <input id="detailQty" type="number" class="form-control form-control-sm"
               style="width:80px" value="1" min="1">
      </div>

      <div class="d-flex gap-2">
        <button id="btnAddDetail" class="btn btn-primary">
          <i class="bi bi-bag-plus me-1"></i>Aggiungi al carrello
        </button>

        <a href="prodotti.html" class="btn btn-outline-secondary">
          Torna ai prodotti
        </a>
      </div>
    </div>
  `;

  /* ==========================
     EVENTO: Aggiungi al Carrello
  ========================== */

  const btn = el("btnAddDetail");

  if (btn) {
    btn.addEventListener("click", () => {
      const qty = Math.max(1, Number(el("detailQty")?.value || 1));

      const selectedColorIndex = Number(
        document.querySelector("input[name='prodColor']:checked")?.value
      );

      const color =
        p.colors && p.colors[selectedColorIndex]
          ? p.colors[selectedColorIndex]
          : null;

      addToCart(p.id, qty, color);
      renderCart();

      // mostra l’offcanvas del carrello
      const offcanvas = document.getElementById("offcanvasCart");
      if (offcanvas) {
        const instance = new bootstrap.Offcanvas(offcanvas);
        instance.show();
      }
    });
  }
}
