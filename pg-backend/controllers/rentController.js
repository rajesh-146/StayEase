const crypto = require("crypto");
const Razorpay = require("razorpay");
const Rent = require("../models/Rent");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


// ============================================================
// GET ALL RENTS - OWNER
// ============================================================

exports.getAllRents = async (req, res) => {
  try {
    const rents = await Rent.find()
      .populate("student", "name email")
      .populate("room", "roomNumber");

    res.json(rents);
  } catch (err) {
    console.error("Get all rents error:", err.message);

    res.status(500).json({
      message: "Error fetching rents"
    });
  }
};


// ============================================================
// GET MY RENT - STUDENT
// ============================================================

exports.getMyRent = async (req, res) => {
  try {
    const rents = await Rent.find({
      student: req.user._id
    }).populate("room", "roomNumber rentPerBed");

    res.json(rents);
  } catch (err) {
    console.error("Get my rent error:", err.message);

    res.status(500).json({
      message: "Error fetching rent"
    });
  }
};


// ============================================================
// CREATE RAZORPAY ORDER
// ============================================================

exports.createRentOrder = async (req, res) => {
  try {
    const { rentId } = req.body;

    if (!rentId) {
      return res.status(400).json({
        message: "Rent ID is required"
      });
    }

    const rent = await Rent.findById(rentId)
      .populate("student", "name email")
      .populate("room", "roomNumber");

    if (!rent) {
      return res.status(404).json({
        message: "Rent record not found"
      });
    }

    // Security check
    if (
      rent.student._id.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    // Already paid
    if (rent.status === "paid") {
      return res.status(400).json({
        message: "Rent is already paid"
      });
    }

    if (!process.env.RAZORPAY_KEY_ID) {
      return res.status(500).json({
        message: "Razorpay Key ID is not configured"
      });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        message: "Razorpay Key Secret is not configured"
      });
    }

    // Razorpay amount must be in paise
    const amountInPaise = Math.round(rent.amount * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rent_${rent._id}`,
      notes: {
        rentId: rent._id.toString(),
        studentId: req.user._id.toString(),
        roomNumber: rent.room.roomNumber,
        month: rent.month
      }
    };

    const order = await razorpay.orders.create(options);

    console.log("Razorpay order created:", order.id);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      rentId: rent._id,
      studentName: rent.student.name,
      studentEmail: rent.student.email,
      roomNumber: rent.room.roomNumber,
      month: rent.month
    });

  } catch (err) {
    console.error(
      "Create Razorpay order error:",
      err
    );

    res.status(500).json({
      message: "Failed to create payment order"
    });
  }
};


// ============================================================
// VERIFY RAZORPAY PAYMENT
// ============================================================

exports.verifyRentPayment = async (req, res) => {
  try {
    const {
      rentId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // ========================================================
    // 1. Validate request data
    // ========================================================

    if (
      !rentId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification details are missing"
      });
    }

    // ========================================================
    // 2. Find rent
    // ========================================================

    const rent = await Rent.findById(rentId);

    if (!rent) {
      return res.status(404).json({
        success: false,
        message: "Rent record not found"
      });
    }

    // ========================================================
    // 3. Make sure this rent belongs to logged-in student
    // ========================================================

    if (rent.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    // ========================================================
    // 4. Prevent paying an already-paid rent
    // ========================================================

    if (rent.status === "paid") {
      return res.status(400).json({
        success: false,
        message: "Rent is already paid"
      });
    }

    // ========================================================
    // 5. Verify Razorpay signature
    // ========================================================

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    const signaturesMatch = crypto.timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(razorpay_signature)
    );

    if (!signaturesMatch) {
      console.error("Invalid Razorpay signature");

      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }

    // ========================================================
    // 6. Fetch order directly from Razorpay
    // ========================================================

    const order = await razorpay.orders.fetch(
      razorpay_order_id
    );

    if (!order) {
      return res.status(400).json({
        success: false,
        message: "Razorpay order not found"
      });
    }

    // ========================================================
    // 7. Make sure Razorpay order belongs to this rent
    // ========================================================

    if (
      order.receipt !== `rent_${rent._id.toString()}`
    ) {
      console.error(
        "Razorpay order does not belong to this rent"
      );

      return res.status(400).json({
        success: false,
        message: "Payment order does not match this rent"
      });
    }

    // ========================================================
    // 8. Verify amount and currency
    // ========================================================

    const expectedAmount = Math.round(rent.amount * 100);

    if (
      order.amount !== expectedAmount ||
      order.currency !== "INR"
    ) {
      console.error(
        "Payment amount/currency mismatch"
      );

      return res.status(400).json({
        success: false,
        message: "Payment amount does not match rent amount"
      });
    }

    // ========================================================
    // 9. Make sure payment belongs to this Razorpay order
    // ========================================================

    const payment = await razorpay.payments.fetch(
      razorpay_payment_id
    );

    if (!payment) {
      return res.status(400).json({
        success: false,
        message: "Razorpay payment not found"
      });
    }

    if (payment.order_id !== razorpay_order_id) {
      console.error(
        "Payment does not belong to Razorpay order"
      );

      return res.status(400).json({
        success: false,
        message: "Payment does not match the order"
      });
    }

    // ========================================================
    // 10. Verify payment amount
    // ========================================================

    if (
      payment.amount !== expectedAmount ||
      payment.currency !== "INR"
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment amount verification failed"
      });
    }

    // ========================================================
    // 11. Payment must be captured
    // ========================================================

    if (payment.status !== "captured") {
      return res.status(400).json({
        success: false,
        message: "Payment has not been captured"
      });
    }

    // ========================================================
    // 12. Everything verified → mark rent as paid
    // ========================================================

    rent.status = "paid";

    await rent.save();

    console.log(
      `Rent ${rent._id} marked as paid`
    );

    // ========================================================
    // 13. Send success response
    // ========================================================

    res.json({
      success: true,
      message: "Rent payment successful",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    });

  } catch (err) {
    console.error(
      "Verify Razorpay payment error:",
      err
    );

    res.status(500).json({
      success: false,
      message: "Payment verification failed"
    });
  }
};


// ============================================================
// OLD DIRECT PAYMENT
// ============================================================


// ============================================================
// SEND RENT REMINDER - BREVO
// ============================================================

exports.sendRentReminder = async (req, res) => {
  try {
    const {
      rentId,
      studentEmail,
      studentName,
      month
    } = req.body;

    if (!studentEmail) {
      return res.status(400).json({
        message: "Student email not found"
      });
    }

    const rent = await Rent.findById(rentId);

    if (!rent) {
      return res.status(404).json({
        message: "Rent record not found"
      });
    }

    if (!process.env.BREVO_API_KEY) {
      return res.status(500).json({
        message: "Brevo API key is not configured"
      });
    }

    if (!process.env.BREVO_SENDER_EMAIL) {
      return res.status(500).json({
        message: "Brevo sender email is not configured"
      });
    }

    const response = await fetch(
      "https://api.brevo.com/v3/smtp/email",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json"
        },
        body: JSON.stringify({
          sender: {
            name: "StayEase",
            email: process.env.BREVO_SENDER_EMAIL
          },
          to: [
            {
              email: studentEmail,
              name: studentName || "Student"
            }
          ],
          subject: `Rent Payment Reminder for ${month}`,
          textContent:
            `Hi ${studentName || "Student"},\n\n` +
            `This is a friendly reminder that your rent for ${month} is pending.\n\n` +
            `Please pay your rent as soon as possible.\n\n` +
            `Thank you!\n\n` +
            `StayEase`,
          htmlContent:
            `<h3>Rent Payment Reminder</h3>` +
            `<p>Hi ${studentName || "Student"},</p>` +
            `<p>This is a friendly reminder that your rent for <strong>${month}</strong> is pending.</p>` +
            `<p>Please pay your rent at your earliest convenience.</p>` +
            `<p>Thank you!</p>` +
            `<p><strong>StayEase</strong></p>`
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.log("Brevo API error:", data);

      return res.status(500).json({
        message: "Failed to send email",
        error: data.message || "Brevo API error"
      });
    }

    console.log(
      "Brevo email sent successfully:",
      data.messageId
    );

    res.json({
      message: "Reminder sent to student"
    });

  } catch (err) {
    console.log(
      "Brevo email error:",
      err.message
    );

    res.status(500).json({
      message: "Error sending reminder"
    });
  }
};