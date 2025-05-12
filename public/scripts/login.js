// public/scripts/login.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const mensajeError = document.getElementById("mensajeError");
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      mensajeError.classList.add("d-none");
  
      // Validación básica
      if (!emailRegex.test(email.value)) {
        email.classList.add("is-invalid");
        mensajeError.textContent = "⚠️ Ingrese un correo válido.";
        return mensajeError.classList.remove("d-none");
      } else email.classList.remove("is-invalid");
  
      if (!passwordRegex.test(password.value)) {
        password.classList.add("is-invalid");
        mensajeError.textContent = "⚠️ La contraseña debe tener 8+ caracteres, 1 mayúscula y 1 número.";
        return mensajeError.classList.remove("d-none");
      } else password.classList.remove("is-invalid");
  
      try {
        const response = await fetch("http://localhost:3000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            correo_electronico: email.value,
            contrasena: password.value
          })
        });
  
        const data = await response.json();
        console.log("RESPUESTA DEL BACKEND:", data);
  
        if (!response.ok) {
          mensajeError.textContent = `❌ ${data.mensaje || "Error en la autenticación"}`;
          return mensajeError.classList.remove("d-none");
        }
  
        // Éxito: guardar token y datos del usuario
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario_id", data.usuario.usuario_id);
        localStorage.setItem("correo", data.usuario.correo);
        localStorage.setItem("rol", data.usuario.rol);
  
        mostrarToast("Inicio de sesión exitoso.", "success");
        setTimeout(() => window.location.href = "carrito.html", 1500);
  
      } catch (err) {
        console.error("⚠️ Error en la conexión:", err);
        mensajeError.textContent = "⚠️ No se pudo conectar al servidor.";
        mensajeError.classList.remove("d-none");
      }
    });
  });
  
  // Toast de Bootstrap
  function mostrarToast(msg, tipo) {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast align-items-center text-white bg-${tipo} border-0 show`;
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${msg}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
  