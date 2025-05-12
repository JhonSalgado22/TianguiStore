document.addEventListener("DOMContentLoaded", async () => {
    await cargarProductos();
    actualizarContadorCarrito(); // Asegura que el contador del carrito se mantenga actualizado
});

// 📦 Cargar productos desde el backend
async function cargarProductos() {
    try {
        const response = await fetch("http://localhost:3000/productos");
        if (!response.ok) throw new Error("No se pudieron obtener los productos.");

        const productos = await response.json();
        const productosContainer = document.getElementById("productos-container");
        productosContainer.innerHTML = ""; // Limpiar antes de insertar

        productos.forEach(producto => {
            const precioNumerico = parseFloat(producto.precio) || 0;

            const productoHTML = `
                <div class="col">
                    <div class="card h-100 shadow-sm animate-fade-in">
                        <img src="./imagenes/productos/${producto.imagen_url}" class="card-img-top" alt="${producto.nombre}" onerror="this.src='./imagenes/productos/default.png'">
                        <div class="card-body">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <p class="card-text">
                                <i class="fas fa-tag"></i> Precio: $${precioNumerico.toFixed(2)}
                            </p>
                            <p class="card-text">
                                <i class="fas fa-warehouse"></i> Existencias: ${producto.stock}
                            </p>
                        </div>
                        <div class="card-footer text-center">
                            <button class="btn btn-primary" onclick="agregarAlCarrito(${producto.id}, '${producto.nombre}', ${precioNumerico})">
                                Agregar al carrito
                            </button>
                        </div>
                    </div>
                </div>
            `;
            productosContainer.innerHTML += productoHTML;
        });
    } catch (error) {
        console.error("Error al cargar productos:", error);
        document.getElementById("productos-container").innerHTML = "<p class='text-center text-danger'>❌ No se pudieron cargar los productos.</p>";
    }
}

// 🛒 Función para agregar productos al carrito
function agregarAlCarrito(id, nombre, precio) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const productoExistente = carrito.find(item => item.id === id);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({ id, nombre, precio, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    alert(`${nombre} fue agregado al carrito.`);
}

// 🔢 Actualizar contador de carrito
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalProductos = carrito.reduce((sum, item) => sum + item.cantidad, 0);

    const contador = document.getElementById('contador-carrito');
    if (contador) {
        contador.textContent = totalProductos;
    }
}
