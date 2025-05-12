// backend/routes/pedidosRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// Crear pedido
router.post("/", (req, res) => {
  const { usuario_id, productos } = req.body;

  if (!usuario_id || !Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  db.query("CALL CrearPedido(?, ?)", [usuario_id, JSON.stringify(productos)], (err, results) => {
    if (err) {
      console.error("Error al crear pedido:", err);
      return res.status(500).json({ error: "Error interno" });
    }

    res.status(201).json({ mensaje: "Pedido creado correctamente" });
  });
});

// Obtener pedidos con productos por usuario
router.get("/:usuario_id", (req, res) => {
  const usuario_id = req.params.usuario_id;

  const sql = `
    SELECT p.id AS pedido_id, p.fecha, dp.producto_id, pr.nombre, pr.precio, dp.cantidad
    FROM pedidos p
    JOIN detalle_pedido dp ON p.id = dp.pedido_id
    JOIN productos pr ON dp.producto_id = pr.id
    WHERE p.usuario_id = ?
    ORDER BY p.fecha DESC
  `;

  db.query(sql, [usuario_id], (err, results) => {
    if (err) {
      console.error("Error al obtener pedidos:", err);
      return res.status(500).json({ error: "Error interno" });
    }

    const pedidos = {};
    results.forEach(row => {
      if (!pedidos[row.pedido_id]) {
        pedidos[row.pedido_id] = {
          pedido_id: row.pedido_id,
          fecha: row.fecha,
          productos: []
        };
      }
      pedidos[row.pedido_id].productos.push({
        producto_id: row.producto_id,
        nombre: row.nombre,
        precio: row.precio,
        cantidad: row.cantidad
      });
    });

    res.status(200).json(Object.values(pedidos));
  });
});

// ✅ ¡Esta línea es esencial!
module.exports = router;
