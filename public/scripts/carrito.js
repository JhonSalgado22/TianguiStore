document.addEventListener("DOMContentLoaded", () => {
    mostrarCarrito();
    actualizarContadorCarrito();

    const btnConfirmar = document.getElementById("btnConfirmarPedido");
    if (btnConfirmar) {
        btnConfirmar.addEventListener("click", () => {
            const usuario_id = localStorage.getItem("usuario_id");
            const token = localStorage.getItem("token");
            const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

            if (!token || !usuario_id) {
                alert("Debes iniciar sesión para confirmar el pedido.");
                return;
            }

            if (carrito.length === 0) {
                alert("El carrito está vacío.");
                return;
            }

            fetch("http://localhost:3000/pedidos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    usuario_id,
                    productos: carrito.map(p => ({
                        id: p.id,
                        cantidad: p.cantidad
                    }))
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                alert("¡Pedido realizado con éxito!");
                localStorage.removeItem("carrito");
                window.location.href = "mis_pedidos.html";
            })
            .catch(err => {
                console.error("Error al confirmar pedido:", err);
                alert("Error al confirmar pedido.");
            });
        });
    }
});

// ... deja el resto del código igual (mostrarCarrito, modificarCantidad, etc.)

function mostrarCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const listaCarrito = document.getElementById("lista-carrito");
    const totalEtiqueta = document.getElementById("total_etiqueta");

    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {
        listaCarrito.innerHTML = "<p class='text-center text-muted'>🛒 Tu carrito está vacío.</p>";
        totalEtiqueta.textContent = "Total: $0.00";
        return;
    }

    let total = 0;

    carrito.forEach(producto => {
        const precioNumerico = parseFloat(producto.precio) || 0;
        const subtotal = precioNumerico * producto.cantidad;
        total += subtotal;

        const itemHTML = `
            <li class="list-group-item d-flex align-items-center shadow-sm p-3 rounded">
                <img src="./imagenes/productos/${producto.id}.png" alt="${producto.nombre}" class="img-thumbnail me-3 rounded-circle" style="width: 60px; height: 60px; object-fit: cover;">
                <div class="flex-grow-1">
                    <h6 class="mb-1 text-primary fw-bold">${producto.nombre}</h6>
                    <small class="text-muted">Precio: <span class="text-dark fw-bold">$${precioNumerico.toFixed(2)}</span></small> |
                    <small class="text-muted">Subtotal: <span class="text-success fw-bold">$${subtotal.toFixed(2)}</span></small>
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn btn-outline-danger btn-sm disminuir-cantidad rounded-circle me-2" data-id="${producto.id}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="mx-2 cantidad-producto fw-bold text-dark">${producto.cantidad}</span>
                    <button class="btn btn-outline-success btn-sm aumentar-cantidad rounded-circle ms-2" data-id="${producto.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="btn btn-outline-danger btn-sm eliminar-producto ms-3 px-3 rounded-pill" data-id="${producto.id}">
                    <i class="fas fa-trash-alt"></i> Eliminar
                </button>
            </li>
        `;
        listaCarrito.innerHTML += itemHTML;
    });

    totalEtiqueta.textContent = `Total: $${total.toFixed(2)}`;

    document.querySelectorAll(".aumentar-cantidad").forEach(boton => {
        boton.addEventListener("click", event => {
            const id = event.currentTarget.getAttribute("data-id");
            modificarCantidad(id, 1);
        });
    });

    document.querySelectorAll(".disminuir-cantidad").forEach(boton => {
        boton.addEventListener("click", event => {
            const id = event.currentTarget.getAttribute("data-id");
            modificarCantidad(id, -1);
        });
    });

    document.querySelectorAll(".eliminar-producto").forEach(boton => {
        boton.addEventListener("click", event => {
            const id = event.currentTarget.getAttribute("data-id");
            eliminarProducto(id);
        });
    });
}

function modificarCantidad(id, cambio) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const index = carrito.findIndex(producto => producto.id === id);

    if (index !== -1) {
        carrito[index].cantidad += cambio;
        if (carrito[index].cantidad <= 0) {
            carrito.splice(index, 1);
        }
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
        actualizarContadorCarrito();
    }
}

function eliminarProducto(id) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito = carrito.filter(producto => producto.id !== id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
    actualizarContadorCarrito();
    mostrarToast("Producto eliminado del carrito.", "danger");
}

document.getElementById("vaciar-carrito").addEventListener("click", () => {
    localStorage.removeItem("carrito");
    mostrarCarrito();
    actualizarContadorCarrito();
    mostrarToast("Carrito vaciado.", "warning");
});

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    document.querySelectorAll("#contador-carrito").forEach(el => el.textContent = totalItems);
}

function mostrarToast(mensaje, tipo) {
    const toastContainer = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast align-items-center text-white bg-${tipo} border-0 show shadow-lg rounded`;
    toast.setAttribute("role", "alert");
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body fw-bold">${mensaje}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
