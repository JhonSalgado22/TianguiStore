// backend/controllers/pedidosController.js
const db = require("../db"); // tu conexión mysql2/promise

/**
 * GET /pedidos?usuario_id=123
 * Devuelve todos los pedidos de un usuario.
 */
async function obtenerPedidosPorUsuario(req, res) {
  const usuarioId = req.query.usuario_id;
  if (!usuarioId) {
    return res.status(400).json({ mensaje: "Falta el usuario_id en la query." });
  }

  try {
    const [rows] = await db.promise().query(
      `SELECT pedido_id, fecha, total, estado
         FROM pedidos
        WHERE usuario_id = ?
        ORDER BY fecha DESC`,
      [usuarioId]
    );
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener pedidos:", error);
    res.status(500).json({ mensaje: "Error interno al obtener pedidos." });
  }
}

module.exports = { obtenerPedidosPorUsuario };
