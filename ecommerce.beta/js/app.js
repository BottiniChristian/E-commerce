import { renderCategories, renderFeatured, renderProductsGrid, renderCart } from "./render.js";
import { loadCart, cart } from "./storage.js";
import { renderProductDetail } from "./product-detail.js";
import { initCheckout } from "./checkout.js";
import { initEvents } from "./events.js";

document.addEventListener("DOMContentLoaded", () => {

  /* ==========================
     INIZIALIZZA CARRELLO
  ========================== */
  const saved = loadCart();
  cart.length = 0;
  cart.push(...saved);
  renderCart();

  /* ==========================
     CATEGORIES (sidebar + offcanvas)
  ========================== */
  renderCategories();

  /* ==========================
     HOME: featured
  ========================== */
  if (window.location.pathname.endsWith("index.html") ||
      window.location.pathname.endsWith("/") ) 
  {
    renderFeatured();
  }

  /* ==========================
     PRODOTTI
  ========================== */
  if (window.location.pathname.endsWith("prodotti.html")) {
    // filtra se c’è hash tipo #cat=Bags
    const hash = window.location.hash.replace("#", "");
    if (hash.startsWith("cat=")) {
      const cat = decodeURIComponent(hash.replace("cat=", ""));
      renderProductsGrid(cat);
    } else {
      renderProductsGrid();
    }
  }

  /* ==========================
     DETTAGLIO PRODOTTO
  ========================== */
  if (window.location.pathname.endsWith("product.html")) {
    renderProductDetail();
  }

  /* ==========================
     CHECKOUT
  ========================== */
  if (window.location.pathname.endsWith("checkout.html")) {
    initCheckout();
  }

  /* ==========================
     EVENTI GLOBALI
  ========================== */
  initEvents();

  /* ==========================
     NAVBAR ACTIVE LINK
  ========================== */
  const path = window.location.pathname;
  if (path.endsWith("index.html") || path === "/") {
    document.getElementById("nav-home")?.classList.add("active");
  } else if (path.endsWith("prodotti.html")) {
    document.getElementById("nav-shop")?.classList.add("active");
  } else if (path.endsWith("chi-siamo.html")) {
    document.getElementById("nav-about")?.classList.add("active");
  }

  /* ==========================
     ANNO FOOTER
  ========================== */
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});





