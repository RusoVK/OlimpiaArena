const express = require("express");
const router = express.Router();
const controller = require("../controllers/solveController");

// Ruta para guardar un solve: POST /api/solves
router.post("/solves", controller.addSolve);

// Ruta para historial: GET /api/solves
router.get("/solves", controller.getSolves);

// Ruta para el podio: GET /api/leaderboard
router.get("/leaderboard", controller.getLeaderboard);

// Ruta para perfil: GET /api/stats/:userId
router.get("/stats/:userId", controller.getUserStats);

module.exports = router;