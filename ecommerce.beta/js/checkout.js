import { PRODUCTS } from "./products.js";
import { cart, cartSubtotal } from "./storage.js";

const el = (id) => document.getElementById(id);
const fmt = (v) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(
    v
  );

/* ==========================
   CALCOLO SPEDIZIONE
========================== */
function shippingCost(subtotal) {
  if (subtotal === 0) return 0;
  if (subtotal >= 80) return 0;
  return 5.9;
}

/* ==========================
   RENDER RIEPILOGO CHECKOUT
========================== */
export function renderCheckoutSummary() {
  const root = el("checkoutSummary");
  if (!root) return;

  if (!cart.length) {
    root.innerHTML = `
      <div class="text-center text-muted py-4">
        Il carrello è vuoto.  
        <a href="prodotti.html">Vai ai prodotti</a>
      </div>`;
    return;
  }

  const itemsHtml = cart
    .map((it) => {
      const p = PRODUCTS.find((x) => x.id === it.productId);
      if (!p) return "";

      return `
        <div class="d-flex gap-3 align-items-center mb-3">
          <img src="${p.img}" width="64" height="64" class="rounded" style="object-fit:cover;">
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between">
              <strong>${p.name}</strong>
              <span>${fmt(p.price * it.qty)}</span>
            </div>
            <div class="small text-muted">
              Qty: ${it.qty} • Colore: ${it.color ? it.color.name : "-"}
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  const subtotal = cartSubtotal();
  const shipping = shippingCost(subtotal);
  const total = subtotal + shipping;

  root.innerHTML = `
    ${itemsHtml}
    <hr>
    <div class="d-flex justify-content-between">
      <span>Subtotale</span><strong>${fmt(subtotal)}</strong>
    </div>
    <div class="d-flex justify-content-between">
      <span>Spedizione</span><strong>${shipping === 0 ? "Gratis" : fmt(shipping)}</strong>
    </div>
    <hr>
    <div class="d-flex justify-content-between">
      <span class="fs-5">Totale</span>
      <strong class="fs-5">${fmt(total)}</strong>
    </div>
  `;
}

/* ==========================
   VALIDAZIONE FORM
========================== */
function validateCheckoutForm() {
  const required = [
    "shipName",
    "shipEmail",
    "shipAddress",
    "shipZip",
    "shipCity",
    "shipCountry",
    "shipPhone",
  ];

  let ok = true;

  required.forEach((id) => {
    const field = el(id);
    if (!field) return;

    if (!field.value.trim()) {
      field.classList.add("is-invalid");
      ok = false;
    } else {
      field.classList.remove("is-invalid");
    }
  });

  return ok;
}

/* ==========================
   PREPARA I DATI PER IL BACKEND
========================== */
export function getCheckoutData() {
  if (!cart.length || !validateCheckoutForm()) return null;

  const subtotal = cartSubtotal();
  const shipping = shippingCost(subtotal);

  return {
    customer: {
      name: el("shipName").value.trim(),
      email: el("shipEmail").value.trim(),
      phone: el("shipPhone").value.trim(),
      address: el("shipAddress").value.trim(),
      zip: el("shipZip").value.trim(),
      city: el("shipCity").value.trim(),
      country: el("shipCountry").value.trim(),
    },
    items: cart.map((i) => ({
      productId: i.productId,
      qty: i.qty,
      color: i.color ? i.color.name : null,
    })),
    subtotal,
    shipping,
    total: subtotal + shipping,
  };
}

/* ==========================
   PREFILL USER DATA
========================== */
function prefillUserData() {
  try {
    const saved = JSON.parse(localStorage.getItem("shop_user") || "null");
    if (!saved) return;

    el("shipName").value = saved.name || "";
    el("shipEmail").value = saved.email || "";
    el("shipPhone").value = saved.phone || "";
    el("shipAddress").value = saved.address || "";
    el("shipZip").value = saved.zip || "";
    el("shipCity").value = saved.city || "";
    el("shipCountry").value = saved.country || "";
  } catch (e) {}
}

/* ==========================
   INIT CHECKOUT PAGE
========================== */
export function initCheckout() {
  if (!window.location.pathname.endsWith("checkout.html")) return;

  renderCheckoutSummary();
  prefillUserData();
}
