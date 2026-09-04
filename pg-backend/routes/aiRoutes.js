const express = require("express");
const router = express.Router();

const auth = require("../middleware/authmiddleware");
const { chat } = require("../controllers/aiController");

// Protected AI chat endpoint
router.post("/chat", auth, chat);

module.exports = router;