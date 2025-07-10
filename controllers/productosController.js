const db = require('../db');

exports.obtenerProductos = (req, res) => {
  db.query('SELECT * FROM productos', (err, resultados) => {
    if (err) return res.status(500).json({ mensaje: 'Error al obtener productos' });
    res.json(resultados);
  });
};

exports.crearProducto = (req, res) => {
  const { nombre, descripcion, precio, imagen, stock } = req.body;

  if (stock < 0) {
    return res.status(400).json({ mensaje: "El stock no puede ser negativo" });
  }

  db.query(
    "INSERT INTO productos (nombre, descripcion, precio, imagen, stock) VALUES (?, ?, ?, ?, ?)",
    [nombre, descripcion, precio, imagen, stock],
    (err, result) => {
      if (err)
        return res.status(500).json({ mensaje: "Error al crear producto" });
      res.json({ mensaje: "Producto creado", id: result.insertId });
    },
  );
};

exports.eliminarProducto = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM productos WHERE id = ?", [id], (err) => {
    if (err)
      return res.status(500).json({ mensaje: "Error al eliminar producto" });
    res.json({ mensaje: "Producto eliminado" });
  });
};

exports.editarProducto = (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, imagen, stock } = req.body;

  if (stock < 0) {
    return res.status(400).json({ mensaje: "El stock no puede ser negativo" });
  }

  db.query(
    "UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, imagen = ?, stock = ? WHERE id = ?",
    [nombre, descripcion, precio, imagen, stock, id],
    (err) => {
      if (err)
        return res.status(500).json({ mensaje: "Error al editar producto" });
      res.json({ mensaje: "Producto actualizado" });
    },
  );
};

exports.reducirStock = (req, res) => {
  const { productos } = req.body; // Array de { id, cantidad }

  const actualizaciones = productos.map((prod) => {
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE productos SET stock = stock - ? WHERE id = ? AND stock >= ?",
        [prod.cantidad, prod.id, prod.cantidad],
        (err, result) => {
          if (err) return reject(err);
          if (result.affectedRows === 0)
            return reject(
              new Error("Stock insuficiente o producto no encontrado"),
            );
          resolve();
        },
      );
    });
  });

  Promise.all(actualizaciones)
    .then(() => res.json({ mensaje: "Compra exitosa" }))
    .catch((err) => res.status(400).json({ mensaje: err.message }));
};
