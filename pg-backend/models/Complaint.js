const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    // AI-generated classification
    category: {
      type: String,
      enum: [
        "Maintenance",
        "Cleanliness",
        "Electricity",
        "Water",
        "Internet",
        "Food",
        "Security",
        "Noise",
        "Other",
      ],
      default: "Other",
    },

    severity: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },

    priority: {
      type: String,
      enum: ["Low", "Normal", "High", "Urgent"],
      default: "Normal",
    },

    suggestedAction: {
      type: String,
      default: "Review complaint manually.",
    },

    status: {
      type: String,
      enum: ["open", "in_progress", "resolved"],
      default: "open",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);