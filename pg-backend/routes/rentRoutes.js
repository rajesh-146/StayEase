const express = require("express");
const router = express.Router();

const auth = require("../middleware/authmiddleware");

const {
  getMyRent,
  getAllRents,
  sendRentReminder,
  createRentOrder,
  verifyRentPayment
} = require("../controllers/rentController");

router.get("/", auth, getAllRents);

router.get("/my", auth, getMyRent);

router.post("/create-order", auth, createRentOrder);

router.post("/verify-payment", auth, verifyRentPayment);

router.post("/reminder", auth, sendRentReminder);

module.exports = router;