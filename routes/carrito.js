const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener productos del carrito por usuario
router.get('/carrito/:usuarioId', (req, res) => {
  const usuarioId = req.params.usuarioId;
  const query = `
    SELECT c.id, p.nombre, p.precio, c.cantidad
    FROM carrito c
    JOIN productos p ON c.producto_id = p.id
    WHERE c.usuario_id = ?
  `;
  db.query(query, [usuarioId], (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error al obtener el carrito' });
    res.json(results);
  });
});

// Agregar producto al carrito
router.post('/carrito', (req, res) => {
  const { usuarioId, productoId, cantidad } = req.body;
  if (!usuarioId || !productoId || !cantidad) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  const query = 'INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES (?, ?, ?)';
  db.query(query, [usuarioId, productoId, cantidad], (err) => {
    if (err) return res.status(500).json({ mensaje: 'Error al agregar al carrito' });
    res.json({ mensaje: 'Producto agregado al carrito' });
  });
});

module.exports = router;
