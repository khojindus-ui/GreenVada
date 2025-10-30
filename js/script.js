// 🌿 GreenVada Product Loader (API + Fallback)
const API_URL = "http://localhost:4000";

document.addEventListener("DOMContentLoaded", async () => {
  const featuredGrid = document.getElementById("featuredGrid");
  const productGrid = document.getElementById("productGrid");

  async function fetchProducts() {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      localStorage.setItem("productsCache", JSON.stringify(data));
      return data;
    } catch (err) {
      console.warn("⚠️ Using cached products:", err);
      return JSON.parse(localStorage.getItem("productsCache") || "[]");
    }
  }

  const products = await fetchProducts();

  // 🏡 Featured Products (Home Page)
  if (featuredGrid) {
    featuredGrid.innerHTML = products
      .slice(0, 4)
      .map(
        (p) => `
        <div class="product-card lift">
          <img src="${p.image}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <div class="price">₹${p.price}</div>
          <button class="btn-primary small" data-id="${p.id}">Add to Cart</button>
        </div>`
      )
      .join("");
  }

  // 🛍️ Shop Page Grid
  if (productGrid) {
    productGrid.innerHTML = products
      .map(
        (p) => `
        <div class="product-card">
          <img src="${p.image}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <div class="price">₹${p.price}</div>
          <button class="btn-primary small" data-id="${p.id}">Add to Cart</button>
        </div>`
      )
      .join("");
  }

  // 🛒 Add to Cart Button
  document.body.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON" && e.target.dataset.id) {
      const id = +e.target.dataset.id;
      const item = products.find((p) => p.id === id);
      addToCart(item);
    }
  });

  function addToCart(product) {
    const user = JSON.parse(localStorage.getItem("user"));
    const key = user ? `cart_${user.username}` : "cart_guest";
    let cart = JSON.parse(localStorage.getItem(key) || "[]");
    const existing = cart.find((i) => i.id === product.id);
    if (existing) existing.qty++;
    else cart.push({ ...product, qty: 1 });
    localStorage.setItem(key, JSON.stringify(cart));
    alert(`${product.name} added to cart 🛒`);
  }
});
