// 🌿 GreenVada Unified Dashboard System
document.addEventListener("DOMContentLoaded", () => {
  // -------------------------------
  // 1️⃣ User Session Check
  // -------------------------------
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }

  // -------------------------------
  // 2️⃣ Logout Functionality
  // -------------------------------
  const logoutBtn = document.getElementById("logoutBtn") || document.getElementById("logoutLink");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("user");
      window.location.href = "index.html";
    });
  }

  // -------------------------------
  // 3️⃣ Dashboard Page
  // -------------------------------
  const userName = document.getElementById("userName");
  const orderList = document.getElementById("orderList");

  if (userName) userName.textContent = user.fullName || user.username || "User";

  if (orderList) {
    const orders = JSON.parse(localStorage.getItem(`orders_${user.username}`) || "[]");
    if (!orders.length) {
      orderList.innerHTML = `<p>No orders yet 🌱</p>`;
    } else {
      orderList.innerHTML = orders
        .map(
          (o) => `
        <div class="order-box">
          <h3>Order #${o.id}</h3>
          <p><b>Date:</b> ${o.date}</p>
          <ul>
            ${o.items.map((i) => `<li>${i.name} × ${i.qty} — ₹${i.price * i.qty}</li>`).join("")}
          </ul>
          <p><b>Total:</b> ₹${o.total}</p>
          <p><b>Status:</b> ${o.status || "Pending"}</p>
        </div>`
        )
        .join("");
    }
  }

  // -------------------------------
  // 4️⃣ Profile Page
  // -------------------------------
  const profileForm = document.getElementById("profileForm");
  if (profileForm) {
    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");

    fullName.value = user.fullName || "";
    email.value = user.email || "";

    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();
      user.fullName = fullName.value.trim();
      user.email = email.value.trim();
      localStorage.setItem("user", JSON.stringify(user));

      // update also in users list
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const idx = users.findIndex((u) => u.username === user.username);
      if (idx > -1) users[idx] = user;
      localStorage.setItem("users", JSON.stringify(users));

      alert("Profile updated successfully ✅");
    });
  }

  // -------------------------------
  // 5️⃣ Settings Page
  // -------------------------------
  const themeToggle = document.getElementById("themeToggle");
  const settingsForm = document.getElementById("settingsForm");

  // 🌗 Dark / Light mode toggle
  if (themeToggle) {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.classList.toggle("dark", savedTheme === "dark");
    themeToggle.checked = savedTheme === "dark";

    themeToggle.addEventListener("change", () => {
      const mode = themeToggle.checked ? "dark" : "light";
      document.body.classList.toggle("dark", mode === "dark");
      localStorage.setItem("theme", mode);
    });
  }

  // ⚙️ Settings Form (Name / Email / Password)
  if (settingsForm) {
    document.getElementById("setName").value = user.fullName || "";
    document.getElementById("setEmail").value = user.email || "";
    document.getElementById("setPass").value = user.password || "";

    settingsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      user.fullName = setName.value.trim();
      user.email = setEmail.value.trim();
      user.password = setPass.value.trim();

      localStorage.setItem("user", JSON.stringify(user));
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const i = users.findIndex((u) => u.username === user.username);
      if (i > -1) users[i] = user;
      localStorage.setItem("users", JSON.stringify(users));

      alert("Settings updated ✅");
      window.location.href = "dashboard.html";
    });
  }
});
