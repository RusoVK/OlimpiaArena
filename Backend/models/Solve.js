class Solve {
  constructor(userId, time, scramble, penalty) {
    this.userId = userId;
    this.time = time;
    this.scramble = scramble;
    this.penalty = penalty; // "+2" | "DNF" | null
    this.date = new Date();
  }
}

module.exports = Solve;