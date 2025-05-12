document.addEventListener("DOMContentLoaded", async () => {
  const tabla = document.getElementById("tablaPedidos");
  const mensaje = document.getElementById("mensaje");
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Debes iniciar sesión para ver tus pedidos.");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch("/api/pedidos/mis", {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    const pedidos = await res.json();

    if (!res.ok) {
      throw new Error(pedidos.message || "No se pudieron cargar los pedidos.");
    }

    if (pedidos.length === 0) {
      mensaje.textContent = "No tienes pedidos realizados aún.";
      mensaje.classList.remove("d-none");
      return;
    }

    pedidos.forEach(p => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${p.pedido_id}</td>
        <td>${new Date(p.fecha).toLocaleDateString()}</td>
        <td>$${p.total.toFixed(2)}</td>
        <td>${p.producto_id}</td>
        <td>${p.cantidad}</td>
        <td>$${p.precio_unitario.toFixed(2)}</td>
      `;
      tabla.appendChild(fila);
    });

  } catch (error) {
    console.error("Error al cargar pedidos:", error);
    mensaje.textContent = "Hubo un error al obtener tus pedidos.";
    mensaje.classList.remove("d-none");
  }
});
