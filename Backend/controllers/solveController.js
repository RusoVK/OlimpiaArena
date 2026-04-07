const db = require("../config/db");
const Solve = require("../models/Solve");

// 1. Guardar un nuevo tiempo (Solve)
const addSolve = async (req, res) => {
  try {
    const { userId, time, scramble, penalty } = req.body;

    if (!userId || time == null) {
      return res.status(400).json({ error: "Datos incompletos (userId y time requeridos)" });
    }

    // Usamos el modelo para estructurar los datos
    const newSolveData = new Solve(userId, time, scramble, penalty);
    
    // Convertir clase a objeto plano para Firestore
    const solveObject = Object.assign({}, newSolveData);

    const docRef = await db.collection("solves").add(solveObject);
    
    res.status(201).json({ 
      message: "¡Solve registrado!", 
      id: docRef.id, 
      tokaCoinsEarned: solveObject.tokaCoins,
      ...solveObject 
    });
  } catch (error) {
    console.error("Error en addSolve:", error);
    res.status(500).json({ error: "Error al guardar en la Arena" });
  }
};

// 2. Obtener historial completo (Dashboard)
const getSolves = async (req, res) => {
  try {
    const snapshot = await db.collection("solves")
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    const historical = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(historical);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener historial" });
  }
};

// 3. Obtener el Top 3 (Podio de la Arena)
const getLeaderboard = async (req, res) => {
  try {
    const snapshot = await db.collection("solves")
      .where("penalty", "==", null) // Solo tiempos válidos
      .orderBy("time", "asc")
      .limit(3)
      .get();

    const top3 = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(top3);
  } catch (error) {
    console.error("Error en Leaderboard:", error);
    res.status(500).json({ error: "Error al obtener el podio" });
  }
};

// 4. Estadísticas de Usuario (PB y Promedio)
const getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const snapshot = await db.collection("solves")
      .where("userId", "==", userId)
      .where("penalty", "==", null)
      .get();

    if (snapshot.empty) return res.json({ userId, pb: null, average: null, total: 0 });

    const times = snapshot.docs.map(doc => doc.data().time);
    const pb = Math.min(...times);
    const avg = times.reduce((a, b) => a + b, 0) / times.length;

    res.json({ 
      userId, 
      personalBest: pb.toFixed(2), 
      average: avg.toFixed(2),
      totalSolves: times.length 
    });
  } catch (error) {
    res.status(500).json({ error: "Error al calcular estadísticas" });
  }
};

module.exports = { addSolve, getSolves, getLeaderboard, getUserStats };