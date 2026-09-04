const express = require("express");

const router = express.Router();

const auth = require("../middleware/authmiddleware");

const {
  getOwnerAnalytics,
} = require("../controllers/analyticsController");

router.get("/owner", auth, getOwnerAnalytics);

module.exports = router;