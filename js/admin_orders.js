// 🌿 GreenVada Admin Orders System
const API_URL = "http://localhost:4000";

document.addEventListener("DOMContentLoaded", async () => {
  const ordersList = document.getElementById("ordersList");

  try {
    const res = await fetch(`${API_URL}/api/orders`);
    const orders = await res.json();

    if (!orders.length) {
      ordersList.innerHTML = "<p>No orders found 📭</p>";
      return;
    }

    ordersList.innerHTML = orders
      .map(
        (o) => `
        <div class="order-box">
          <div class="order-header">
            <h3>Order #${o.id}</h3>
            <p><b>User:</b> ${o.username}</p>
            <p><b>Date:</b> ${o.createdAt}</p>
          </div>
          <ul class="order-items">
            ${o.items
              .map((i) => `<li>${i.title} × ${i.qty} – ₹${i.price * i.qty}</li>`)
              .join("")}
          </ul>
          <p><b>Total:</b> ₹${o.total}</p>
          <p><b>Status:</b> 
            <select data-id="${o.id}" class="status-select">
              <option value="pending" ${o.status === "pending" ? "selected" : ""}>Pending</option>
              <option value="shipped" ${o.status === "shipped" ? "selected" : ""}>Shipped</option>
              <option value="delivered" ${o.status === "delivered" ? "selected" : ""}>Delivered</option>
            </select>
          </p>
        </div>
      `
      )
      .join("");

    // handle status change
    document.querySelectorAll(".status-select").forEach((sel) => {
      sel.addEventListener("change", async (e) => {
        const id = e.target.dataset.id;
        const status = e.target.value;
        await fetch(`${API_URL}/api/orders/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
        alert(`Order #${id} status updated to ${status} ✅`);
      });
    });
  } catch (err) {
    ordersList.innerHTML = `<p class="error">Failed to load orders ⚠️</p>`;
    console.error(err);
  }
});
