const dotenv = require("dotenv");
dotenv.config();

require("./cron/rentReminder");
require("./utils/cronJobs");

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
connectDB();

const app = express();
app.use(cors({
  origin: "https://stayease-frontend-five.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options(/.*/, cors({
  origin: "https://stayease-frontend-five.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/rent", require("./routes/rentRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
});

const auth = require("./middleware/authmiddleware");

app.get("/api/test", auth, (req, res) => {
  res.json({
    message: "Protected route working",
    user: req.user
  });
});



