const dotenv = require("dotenv");
dotenv.config();

require("./cron/rentReminder");
require("./utils/cronJobs");

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
connectDB();

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://stayease-frontend-five.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));

app.options(/.*/, cors(corsOptions));

app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/rent", require("./routes/rentRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/analytics",require("./routes/analyticsRoutes"));


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



