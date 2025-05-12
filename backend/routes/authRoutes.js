// backend/routes/authRoutes.js

const express = require("express");
const router = express.Router();
const { registrarUsuario, verificarUsuario } = require("../controllers/authController");

// 📌 Ruta para registrar un nuevo usuario
router.post("/registro", registrarUsuario);

// 📌 Ruta para iniciar sesión
router.post("/login", verificarUsuario);

module.exports = router;
