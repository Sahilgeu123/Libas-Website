const express = require("express");
const router = express.Router();

const { protected } = require("../middleware/auth.Middleware");

const { chatAI } = require("../controllers/aiChatController");

router.post("/chat", protected ,chatAI);

module.exports = router;
