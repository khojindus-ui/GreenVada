// 🌿 GreenVada Cart System (API + Local)
const API_URL = "http://localhost:4000";

document.addEventListener("DOMContentLoaded", () => {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const user = JSON.parse(localStorage.getItem("user"));
  const cartKey = user ? `cart_${user.username}` : "cart_guest";

  function loadCart() {
    const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    if (!cart.length) {
      cartItems.innerHTML = "<p>Your cart is empty 🌱</p>";
      cartTotal.textContent = "0";
      return [];
    }
    let total = 0;
    cartItems.innerHTML = cart
      .map((i) => {
        total += i.price * i.qty;
        return `
        <div class="cart-item">
          <img src="${i.image}" alt="${i.name}">
          <div><h4>${i.name}</h4><p>₹${i.price} × ${i.qty}</p></div>
          <button class="remove" data-id="${i.id}">✕</button>
        </div>`;
      })
      .join("");
    cartTotal.textContent = total;
    return cart;
  }

  function render() {
    loadCart();
  }

  render();

  cartItems.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove")) {
      const id = +e.target.dataset.id;
      let cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
      cart = cart.filter((i) => i.id !== id);
      localStorage.setItem(cartKey, JSON.stringify(cart));
      render();
    }
  });

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", async () => {
      const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
      if (!user) {
        alert("Please login to place order.");
        window.location.href = "login.html";
        return;
      }
      if (!cart.length) return alert("Cart is empty.");

      const order = {
        username: user.username,
        total: cart.reduce((t, i) => t + i.price * i.qty, 0),
        createdAt: new Date().toLocaleString(),
        items: cart,
        status: "pending"
      };

      try {
        await fetch(`${API_URL}/api/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(order)
        });
        localStorage.removeItem(cartKey);
        alert("✅ Order placed successfully!");
        window.location.href = "dashboard.html";
      } catch (err) {
        alert("⚠️ Failed to place order, please try again later.");
        console.error(err);
      }
    });
  }
});
