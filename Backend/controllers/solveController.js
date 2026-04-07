// En solveController.js
const validateSolve = (time, moves) => {
  // Simulamos que la IA revisa si el tiempo es humanamente posible
  // y si hay movimientos registrados (si es Smart Cube)
  if (time < 3.0) return "Slightly Suspicious"; // ¡Récord mundial!
  return "Verified";
};

exports.addSolve = async (req, res) => {
  const { userId, time, scramble } = req.body;
  const status = validateSolve(time);

  const newSolve = {
    userId,
    time,
    status,
    tokaCoins: status === "Verified" ? 10 : 0,
    timestamp: new Date()
  };
  
  // Guardamos...
  res.json(newSolve);
};