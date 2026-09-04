const express = require("express");

const router = express.Router();

const auth = require("../middleware/authmiddleware");

const {
  getMyRent,
  payRent,
  getAllRents,
  sendRentReminder,
  createRentOrder,
  verifyRentPayment
} = require("../controllers/rentController");


// Owner - all rents
router.get("/", auth, getAllRents);


// Student - own rents
router.get("/my", auth, getMyRent);


// Razorpay - create order
router.post("/create-order", auth, createRentOrder);


// Razorpay - verify payment
router.post("/verify-payment", auth, verifyRentPayment);


// Old direct payment route
router.post("/pay", auth, payRent);


// Rent reminder
router.post("/reminder", auth, sendRentReminder);


module.exports = router;