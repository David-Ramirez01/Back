const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const path = require("path");

dotenv.config();

app.use(cors());
app.use(express.json());

// Rutas
const authRoutes = require("./routes/auth");
const productosRoutes = require("./routes/productos");
const ordenesRoutes = require("./routes/ordenes"); // <--- Agregas las rutas de órdenes

app.use("/api", authRoutes);
app.use("/api", productosRoutes);
app.use("/api", ordenesRoutes);

// Carpeta pública para los PDFs
app.use("/facturas", express.static(path.join(__dirname, "facturas")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
