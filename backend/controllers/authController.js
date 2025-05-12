// backend/controllers/authController.js

const db = require("../db");             // Tu pool o conexión mysql2
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "tu_clave_super_secreta";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

// 📌 Registrar nuevo usuario
async function registrarUsuario(req, res) {
  const { nombre, correo_electronico, contrasena } = req.body;
  if (!nombre || !correo_electronico || !contrasena) {
    return res.status(400).json({ mensaje: "Todos los campos son obligatorios." });
  }

  try {
    // Verificar duplicado
    const [existe] = await db.promise().query(
      "SELECT usuario_id FROM usuarios WHERE correo_electronico = ?",
      [correo_electronico]
    );
    if (existe.length) {
      return res.status(409).json({ mensaje: "El correo ya está registrado." });
    }

    // Hash de la contraseña
    const hash = await bcrypt.hash(contrasena, 10);

    // Insertar usuario con rol_id=3 (cliente)
    await db.promise().query(
      `INSERT INTO usuarios 
         (correo_electronico, contrasena_hash, nombre, rol_id) 
       VALUES (?, ?, ?, ?)`,
      [correo_electronico, hash, nombre, 3]
    );

    res.status(201).json({ mensaje: "Usuario registrado exitosamente." });
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    res.status(500).json({ mensaje: "Error interno al registrar." });
  }
}

// 📌 Verificar usuario (Login)
async function verificarUsuario(req, res) {
  const { correo_electronico, contrasena } = req.body;
  if (!correo_electronico || !contrasena) {
    return res.status(400).json({ mensaje: "Correo y contraseña son obligatorios." });
  }

  try {
    // Buscar usuario activo
    const [rows] = await db.promise().query(
      `SELECT usuario_id, correo_electronico, contrasena_hash, rol_id
         FROM usuarios WHERE correo_electronico = ? AND activo = 1`,
      [correo_electronico]
    );
    if (rows.length === 0) {
      return res.status(401).json({ mensaje: "Credenciales inválidas." });
    }

    const usuario = rows[0];
    const esValida = await bcrypt.compare(contrasena, usuario.contrasena_hash);
    if (!esValida) {
      return res.status(401).json({ mensaje: "Credenciales inválidas." });
    }

    // Mapear rol numérico a texto
    const roles = { 1: "admin", 3: "cliente", 4: "vendedor", 5: "repartidor", 6: "soporte" };
    const payload = {
      usuario_id: usuario.usuario_id,
      correo: usuario.correo_electronico,
      rol: roles[usuario.rol_id] || "cliente"
    };

    // Generar JWT
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(200).json({
      mensaje: "Inicio de sesión exitoso.",
      token,
      usuario: payload
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ mensaje: "Error interno al iniciar sesión." });
  }
}

module.exports = {
  registrarUsuario,
  verificarUsuario
};
