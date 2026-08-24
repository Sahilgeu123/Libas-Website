const express = require("express");
const router = express.Router();

const { protected } = require("../middleware/auth.Middleware");

const { chatAI } = require("../controllers/ai");

router.post("/chat", chatAI);

module.exports = router;
