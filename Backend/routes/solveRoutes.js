const express = require("express");
const router = express.Router();
const controller = require("../controllers/solveController");

router.post("/solves", controller.addSolve);
router.get("/solves", controller.getSolves);
router.get("/leaderboard", controller.getLeaderboard);
router.get("/stats/:userId", controller.getUserStats);

module.exports = router;