// 🌿 GreenVada Auth System (Login + Register + Forgot)
document.addEventListener("DOMContentLoaded", () => {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  // Redirect if already logged in
  if (currentUser && (window.location.pathname.includes("login") || window.location.pathname.includes("register"))) {
    window.location.href = "dashboard.html";
    return;
  }

  // ---------------- LOGIN ----------------
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("loginUser").value.trim();
      const password = document.getElementById("loginPass").value.trim();

      const user = users.find((u) => u.username === username && u.password === password);
      if (!user) {
        alert("Invalid username or password ❌");
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));
      alert(`Welcome back, ${user.fullName || user.username}! 🌿`);
      window.location.href = "dashboard.html";
    });
  }

  // ---------------- REGISTER ----------------
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const fullName = document.getElementById("regName").value.trim();
      const username = document.getElementById("regUser").value.trim();
      const email = document.getElementById("regEmail").value.trim();
      const password = document.getElementById("regPass").value.trim();

      if (users.some((u) => u.username === username)) {
        alert("Username already exists ❌");
        return;
      }

      const newUser = { fullName, username, email, password, role: "user" };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("user", JSON.stringify(newUser));

      alert("Account created successfully ✅");
      window.location.href = "dashboard.html";
    });
  }

  // ---------------- FORGOT PASSWORD ----------------
  const forgotForm = document.getElementById("forgotForm");
  if (forgotForm) {
    forgotForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("forgotEmail").value.trim();
      const user = users.find((u) => u.email === email);

      if (!user) {
        alert("No account found with this email ❌");
        return;
      }

      alert(`Your password is: ${user.password} 🔑 (Demo purpose only)`);
      window.location.href = "login.html";
    });
  }
});
