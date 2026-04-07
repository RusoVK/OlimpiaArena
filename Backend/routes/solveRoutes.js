const express = require("express");
const router = express.Router();
const controller = require("../controllers/solveController");

router.post("/solve", controller.addSolve);
router.get("/solves", controller.getSolves);

module.exports = router;

