const db = require('../db');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.crearOrden = (req, res) => {
  const { usuarioId, productos } = req.body;

  if (!usuarioId || !productos || productos.length === 0) {
    return res.status(400).json({ mensaje: 'Datos incompletos' });
  }

  const total = productos.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

  db.query(
    'INSERT INTO ordenes (usuario_id, total) VALUES (?, ?)',
    [usuarioId, total],
    (err, result) => {
      if (err) return res.status(500).json({ mensaje: 'Error al crear la orden' });

      const ordenId = result.insertId;
      const detalles = productos.map(p => [ordenId, p.id, p.cantidad, p.precio]);

      db.query(
        'INSERT INTO detalle_orden (orden_id, producto_id, cantidad, precio_unitario) VALUES ?',
        [detalles],
        (err) => {
          if (err) return res.status(500).json({ mensaje: 'Error al guardar detalles' });

          productos.forEach(p => {
            db.query(
              'UPDATE productos SET stock = stock - ? WHERE id = ? AND stock >= ?',
              [p.cantidad, p.id, p.cantidad]
            );
          });

          const pdfPath = path.join(__dirname, `../facturas/factura_${ordenId}.pdf`);
          generarPDF(productos, total, pdfPath, () => {
            res.json({
              mensaje: 'Orden registrada',
              ordenId,
              pdf: `/facturas/factura_${ordenId}.pdf`
            });
          });
        }
      );
    }
  );
};

// Obtener estado de la orden de un usuario
exports.obtenerEstadoOrden = (req, res) => {
  const { usuarioId } = req.params;

  db.query(
    'SELECT * FROM ordenes WHERE usuario_id = ? ORDER BY fecha DESC LIMIT 1',
    [usuarioId],
    (err, resultados) => {
      if (err) return res.status(500).json({ mensaje: 'Error al obtener la orden' });
      if (resultados.length === 0) {
        return res.json({ mensaje: 'No tienes pedidos aún' });
      }
      res.json(resultados[0]);
    }
  );
};

// Cambiar estado de una orden (solo para admin)
exports.cambiarEstado = (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  const estadosValidos = ['En proceso', 'Despachado', 'Entregado'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ mensaje: 'Estado no válido' });
  }

  db.query(
    'UPDATE ordenes SET estado = ? WHERE id = ?',
    [estado, id],
    (err) => {
      if (err) return res.status(500).json({ mensaje: 'Error al actualizar estado' });
      res.json({ mensaje: 'Estado actualizado correctamente' });
    }
  );
};

function generarPDF(productos, total, ruta, callback) {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(ruta));

  doc.fontSize(20).text('Resumen de Compra', { align: 'center' });
  doc.moveDown();

  productos.forEach(p => {
    doc.fontSize(12).text(
      `${p.nombre} - Cantidad: ${p.cantidad} - Precio Unitario: $${p.precio.toFixed(2)}`
    );
  });

  doc.moveDown();
  doc.fontSize(14).text(`Total: $${total.toFixed(2)}`);

  doc.end();
  doc.on('finish', callback);
}
