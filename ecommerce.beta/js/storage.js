import { PRODUCTS } from "./products.js";

export let cart = [];

export function saveCart() {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (e) {}
}

export function loadCart() {
  try {
    const s = localStorage.getItem("cart");
    return s ? JSON.parse(s) : [];
  } catch (e) {
    return [];
  }
}

export function cartCount() {
  return cart.reduce((sum, i) => sum + i.qty, 0);
}

export function cartSubtotal() {
  return cart.reduce((sum, i) => {
    const p = PRODUCTS.find((x) => x.id === i.productId);
    return sum + (p ? p.price * i.qty : 0);
  }, 0);
}

export function addToCart(productId, qty = 1, color = null) {
  const existing = cart.find(
    (i) =>
      i.productId === productId &&
      ((i.color && color && i.color.code === color.code) ||
        (!i.color && !color))
  );

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ productId, qty, color });
  }
  saveCart();
}

export function setCartQty(idx, qty) {
  qty = Number(qty) || 0;
  if (qty <= 0) cart.splice(idx, 1);
  else cart[idx].qty = qty;
  saveCart();
}

export function removeCartItem(idx) {
  cart.splice(idx, 1);
  saveCart();
}
