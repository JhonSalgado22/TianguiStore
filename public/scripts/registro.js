// public/scripts/registro.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registroForm");
    const nombre = document.getElementById("nombre");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const mensajeError = document.getElementById("mensajeError");
    const mensajeExito = document.getElementById("mensajeExito");
  
    // Expresiones regulares
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      mensajeError.classList.add("d-none");
      mensajeExito.classList.add("d-none");
  
      let esValido = true;
  
      // Validar nombre
      if (!nombre.value.trim()) {
        nombre.classList.add("is-invalid");
        mensajeError.textContent = "⚠️ El nombre es obligatorio.";
        esValido = false;
      } else {
        nombre.classList.remove("is-invalid");
      }
  
      // Validar email
      if (!emailRegex.test(email.value)) {
        email.classList.add("is-invalid");
        mensajeError.textContent = "⚠️ Ingrese un correo electrónico válido.";
        esValido = false;
      } else {
        email.classList.remove("is-invalid");
      }
  
      // Validar contraseña
      if (!passwordRegex.test(password.value)) {
        password.classList.add("is-invalid");
        mensajeError.textContent = "⚠️ La contraseña debe tener 8+ caracteres, una mayúscula y un número.";
        esValido = false;
      } else {
        password.classList.remove("is-invalid");
      }
  
      if (!esValido) {
        mensajeError.classList.remove("d-none");
        return;
      }
  
      try {
        const response = await fetch("http://localhost:3000/auth/registro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: nombre.value,
            correo_electronico: email.value,
            contrasena: password.value
          })
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          mensajeError.textContent = data.mensaje || "❌ Error en el registro.";
          mensajeError.classList.remove("d-none");
        } else {
          mensajeExito.textContent = "✅ Registro exitoso. Redirigiendo a login...";
          mensajeExito.classList.remove("d-none");
          setTimeout(() => {
            window.location.href = "login.html";
          }, 1500);
        }
      } catch (err) {
        console.error("⚠️ Error de conexión:", err);
        mensajeError.textContent = "⚠️ No se pudo conectar al servidor.";
        mensajeError.classList.remove("d-none");
      }
    });
  });
  