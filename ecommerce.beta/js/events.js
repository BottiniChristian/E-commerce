import { addToCart, setCartQty, removeCartItem, cart } from "./storage.js";
import { renderCart } from "./render.js";
import { getCheckoutData } from "./checkout.js";

export function initEvents() {

  /* ==========================
     EVENTO CLICK
  ========================== */
  document.body.addEventListener("click", (ev) => {

    /* Aggiunta al carrello */
    const add = ev.target.closest("[data-add]");
    if (add) {
      const productId = add.getAttribute("data-add");
      addToCart(productId, 1, null);
      renderCart();
      return;
    }

    /* Decremento quantità */
    const dec = ev.target.closest("[data-dec]");
    if (dec) {
      const idx = Number(dec.getAttribute("data-dec"));
      const currentQty = cart[idx]?.qty || 1;
      setCartQty(idx, Math.max(0, currentQty - 1));
      renderCart();
      return;
    }

    /* Incremento quantità */
    const inc = ev.target.closest("[data-inc]");
    if (inc) {
      const idx = Number(inc.getAttribute("data-inc"));
      setCartQty(idx, (cart[idx]?.qty || 1) + 1);
      renderCart();
      return;
    }

    /* Rimozione articolo */
    const rm = ev.target.closest("[data-rm]");
    if (rm) {
      const idx = Number(rm.getAttribute("data-rm"));
      removeCartItem(idx);
      renderCart();
      return;
    }

    /* Cambio categoria */
    const catBtn = ev.target.closest("[data-cat]");
    if (catBtn) {
      const cat = catBtn.getAttribute("data-cat");

      if (window.location.pathname.endsWith("prodotti.html")) {
        import("./render.js").then(({ renderProductsGrid }) => {
          renderProductsGrid(cat);
        });
      } else {
        window.location.href = `prodotti.html#cat=${encodeURIComponent(cat)}`;
      }
      return;
    }

    /* Vai al checkout */
    const goCheckout = ev.target.closest("#checkoutBtn, #checkoutBtnFromOffcanvas");
    if (goCheckout) {
      window.location.href = "checkout.html";
      return;
    }
  });

  /* ==========================
     EVENTO CHANGE
  ========================== */
  document.body.addEventListener("change", (ev) => {
    const q = ev.target.closest("[data-qty]");
    if (q) {
      const idx = Number(q.getAttribute("data-qty"));
      const newVal = Number(ev.target.value) || 1;
      setCartQty(idx, newVal);
      renderCart();
      return;
    }
  });

  /* ==========================
     SUBMIT CHECKOUT (CON BACK-END)
  ========================== */
  document.body.addEventListener("submit", async (ev) => {
    if (ev.target && ev.target.id === "checkoutForm") {
      ev.preventDefault();

      const data = getCheckoutData();
      if (!data) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      // bottone loading
      const btn = document.getElementById("placeOrder");
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Redirecting...";
      }

      try {
      const res = await fetch("http://localhost:8080/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
    });

        const resp = await res.text();  // il backend ritorna direttamente la URL

        if (res.ok && resp.startsWith("http")) {
          // Redirect a Stripe Checkout
          window.location.href = resp;
        } else {
          alert("Error creating payment.");
          console.error(resp);
        }

      } catch (err) {
        console.error(err);
        alert("Error connecting to backend server.");
      }

      if (btn) {
        btn.disabled = false;
        btn.textContent = "Confirm and pay";
      }
    }
  });

}
