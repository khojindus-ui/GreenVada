// 🌿 GreenVada Admin Dashboard System
const API_URL = "http://localhost:4000";

document.addEventListener("DOMContentLoaded", async () => {
  const productList = document.getElementById("productList");
  const addForm = document.getElementById("addProductForm");

  // Summary elements
  const productCount = document.getElementById("productCount");
  const orderCount = document.getElementById("orderCount");

  // 🔹 Load all data
  async function loadData() {
    const [prodRes, orderRes] = await Promise.all([
      fetch(`${API_URL}/api/products`),
      fetch(`${API_URL}/api/orders`)
    ]);

    const [products, orders] = await Promise.all([prodRes.json(), orderRes.json()]);
    productCount.textContent = products.length;
    orderCount.textContent = orders.length;

    // render products
    if (!products.length) {
      productList.innerHTML = "<p>No products found 🌱</p>";
      return;
    }

    productList.innerHTML = products.map(p => `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}">
        <h4>${p.name}</h4>
        <p>₹${p.price}</p>
        <button class="btn-danger" data-id="${p.id}">Delete</button>
      </div>
    `).join("");

    // handle delete
    productList.querySelectorAll(".btn-danger").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        if (confirm("Delete this product?")) {
          await fetch(`${API_URL}/api/products/${id}`, { method: "DELETE" });
          alert("Product deleted ✅");
          loadData();
        }
      });
    });
  }

  loadData();

  // 🔹 Add new product
  addForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      name: pName.value.trim(),
      description: pDesc.value.trim(),
      price: +pPrice.value,
      image: pImg.value.trim()
    };
    await fetch(`${API_URL}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    alert("Product added successfully ✅");
    addForm.reset();
    loadData();
  });
});
