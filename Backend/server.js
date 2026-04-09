require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();

// Importar Rutas
const solveRoutes = require("./routes/solveRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// Middlewares
app.use(cors());
app.use(express.json());

// Registro de Rutas
app.use("/api", solveRoutes);    
app.use("/api/pago", paymentRoutes); 

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Olimpia Arena Backend funcionando 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor de la Arena corriendo en: http://localhost:${PORT}`);
});