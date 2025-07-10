const express = require('express');
const router = express.Router();
const db = require('../db');
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// Crear orden completa
router.post("/ordenes", (req, res) => {
  const { usuarioId, productos } = req.body;

  if (!usuarioId || !productos || productos.length === 0) {
    return res.status(400).json({ mensaje: "Datos incompletos" });
  }

  const total = productos.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

  db.query(
    "INSERT INTO ordenes (usuario_id, total) VALUES (?, ?)",
    [usuarioId, total],
    (err, result) => {
      if (err)
        return res.status(500).json({ mensaje: "Error al crear la orden" });

      const ordenId = result.insertId;

      // Insertar detalle de productos
      const detalles = productos.map((p) => [
        ordenId,
        p.id,
        p.cantidad,
        p.precio,
      ]);
      const sqlDetalle =
        "INSERT INTO detalle_orden (orden_id, producto_id, cantidad, precio_unitario) VALUES ?";

      db.query(sqlDetalle, [detalles], (err) => {
        if (err)
          return res.status(500).json({ mensaje: "Error al guardar detalle" });

        // Actualizar stock
        productos.forEach((p) => {
          db.query(
            "UPDATE productos SET stock = stock - ? WHERE id = ? AND stock >= ?",
            [p.cantidad, p.id, p.cantidad],
          );
        });

        // Generar PDF
        const pdfPath = path.join(
          __dirname,
          `../facturas/factura_${ordenId}.pdf`,
        );
        generarPDF(productos, total, pdfPath, () => {
          res.json({
            mensaje: "Orden registrada",
            ordenId,
            pdf: `/facturas/factura_${ordenId}.pdf`,
          });
        });
      });
    },
  );
});

function generarPDF(productos, total, ruta, callback) {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(ruta));

  doc.fontSize(20).text("Resumen de Compra", { align: "center" });
  doc.moveDown();

  productos.forEach((p) => {
    doc
      .fontSize(12)
      .text(
        `${p.nombre} - Cantidad: ${
          p.cantidad
        } - Precio Unitario: $${p.precio.toFixed(2)}`,
      );
  });

  doc.moveDown();
  doc.fontSize(14).text(`Total: $${total.toFixed(2)}`, { bold: true });

  doc.end();
  doc.on("finish", callback);
}

module.exports = router;

