class Solve {
  constructor(userId, time, scramble, penalty = null) {
    this.userId = userId;
    this.time = parseFloat(time);
    this.scramble = scramble || "N/A";
    this.penalty = penalty; // "+2", "DNF", null
    
    // Pilar de Fidelización: Recompensa en TokaCoins
    // Si es DNF no gana, si es válido gana 10 TokaCoins
    this.tokaCoins = (penalty === "DNF") ? 0 : 10;
    
    this.createdAt = new Date().toISOString();
  }
}

module.exports = Solve;