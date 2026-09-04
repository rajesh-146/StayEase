const Rent = require("../models/Rent");

exports.getAllRents = async (req, res) => {
  try {
    const rents = await Rent.find()
      .populate("student", "name email")
      .populate("room", "roomNumber");

    res.json(rents);
  } catch (err) {
    res.status(500).json({ message: "Error fetching rents" });
  }
};

exports.getMyRent = async (req, res) => {
  try {
    const rents = await Rent.find({ student: req.user._id })
      .populate("room", "roomNumber rentPerBed");

    res.json(rents);
  } catch (err) {
    res.status(500).json({ message: "Error fetching rent" });
  }
};

exports.payRent = async (req, res) => {
  try {
    const { rentId } = req.body;

    const rent = await Rent.findById(rentId);

    if (!rent) {
      return res.status(404).json({
        message: "Rent record not found"
      });
    }

    if (rent.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    rent.status = "paid";
    await rent.save();

    res.json({
      message: "Rent paid successfully"
    });
  } catch (err) {
    res.status(500).json({
      message: "Payment failed"
    });
  }
};

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

    // Check Brevo configuration
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

    // Send email using Brevo HTTPS API
    const response = await fetch(
      "https://api.brevo.com/v3/smtp/email",
      {
        method: "POST",
        headers: {
          "accept": "application/json",
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
    console.log("Brevo email error:", err.message);

    res.status(500).json({
      message: "Error sending reminder"
    });
  }
};