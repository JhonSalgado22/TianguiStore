document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) return window.location.href = "login.html";

  fetch(`/pedidos/${usuario.id}`)
    .then(res => res.json())
    .then(pedidos => {
      const contenedor = document.getElementById("contenedor-pedidos");

      if (pedidos.length === 0) {
        contenedor.innerHTML = "<p class='text-center'>No tienes pedidos aún.</p>";
        return;
      }

      pedidos.forEach(p => {
        const div = document.createElement("div");
        div.className = "col-md-6 col-lg-4 mb-4";

        let productosHtml = "";
        let total = 0;

        p.productos.forEach(prod => {
          const subtotal = prod.precio * prod.cantidad;
          total += subtotal;

          productosHtml += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
              ${prod.nombre} x${prod.cantidad}
              <span class="badge bg-primary rounded-pill">$${subtotal.toFixed(2)}</span>
            </li>
          `;
        });

        div.innerHTML = `
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title">Pedido #${p.pedido_id}</h5>
              <p class="card-text">Fecha: ${new Date(p.fecha).toLocaleString()}</p>
              <ul class="list-group mb-2">${productosHtml}</ul>
              <p class="text-end fw-bold">Total: $${total.toFixed(2)}</p>
            </div>
          </div>
        `;

        contenedor.appendChild(div);
      });
    })
    .catch(err => {
      console.error("Error al cargar pedidos:", err);
      alert("Error al cargar pedidos");
    });
});
