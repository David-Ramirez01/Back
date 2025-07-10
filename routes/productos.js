const express = require('express');
const router = express.Router();
const {
  obtenerProductos,
  crearProducto,
  eliminarProducto,
  editarProducto,
  reducirStock
} = require("../controllers/productosController");

router.get("/productos", obtenerProductos);
router.post("/productos", crearProducto);
router.delete("/productos/:id", eliminarProducto);
router.put("/productos/:id", editarProducto);
router.post("/productos/comprar", reducirStock); // Nueva ruta para realizar compra y reducir stock

module.exports = router;
