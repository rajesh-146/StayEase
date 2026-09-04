const Complaint = require("../models/Complaint");
const mongoose = require("mongoose");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

exports.createComplaint = async (req, res) => {
  try {
    const { message, room } = req.body;

    // Basic validation
    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Complaint message is required",
      });
    }

    if (!room || !mongoose.Types.ObjectId.isValid(room)) {
      return res.status(400).json({
        message: "Invalid room ID",
      });
    }

    /*
     * AI TRIAGE
     *
     * Gemini analyzes the complaint and returns:
     * - category
     * - severity
     * - priority
     * - suggestedAction
     */

    let category = "Other";
    let severity = "Medium";
    let priority = "Normal";
    let suggestedAction = "Review complaint manually.";

    try {
      const prompt = `
You are an AI complaint triage system for a PG/hostel management platform called StayEase.

Analyze this student complaint:

"${message.trim()}"

Return ONLY valid JSON in exactly this format:

{
  "category": "Maintenance",
  "severity": "Medium",
  "priority": "Normal",
  "suggestedAction": "Review the complaint and take appropriate action."
}

Allowed category values:
Maintenance, Cleanliness, Electricity, Water, Internet, Food, Security, Noise, Other

Allowed severity values:
Low, Medium, High, Critical

Allowed priority values:
Low, Normal, High, Urgent

Rules:
1. Do not invent information.
2. Classify based only on the complaint.
3. Critical means immediate safety/security risk.
4. Urgent means the issue should be handled as soon as possible.
5. Keep suggestedAction short and practical.
6. Return JSON only. No markdown.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      let aiText = response.text.trim();

      // Remove accidental markdown code fences
      aiText = aiText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      const aiResult = JSON.parse(aiText);

      const allowedCategories = [
        "Maintenance",
        "Cleanliness",
        "Electricity",
        "Water",
        "Internet",
        "Food",
        "Security",
        "Noise",
        "Other",
      ];

      const allowedSeverities = [
        "Low",
        "Medium",
        "High",
        "Critical",
      ];

      const allowedPriorities = [
        "Low",
        "Normal",
        "High",
        "Urgent",
      ];

      if (allowedCategories.includes(aiResult.category)) {
        category = aiResult.category;
      }

      if (allowedSeverities.includes(aiResult.severity)) {
        severity = aiResult.severity;
      }

      if (allowedPriorities.includes(aiResult.priority)) {
        priority = aiResult.priority;
      }

      if (
        typeof aiResult.suggestedAction === "string" &&
        aiResult.suggestedAction.trim()
      ) {
        suggestedAction = aiResult.suggestedAction.trim();
      }

      console.log("🤖 AI Complaint Triage:", {
        category,
        severity,
        priority,
        suggestedAction,
      });
    } catch (aiError) {
      /*
       * If AI fails, complaint should STILL be created.
       * This prevents the AI service from breaking the
       * core complaint functionality.
       */
      console.error("AI Complaint Triage Error:", aiError.message);
    }

    // Save complaint in MongoDB
    const complaint = await Complaint.create({
      student: req.user._id,
      message: message.trim(),
      room,
      category,
      severity,
      priority,
      suggestedAction,
    });

    console.log("✅ Complaint created:", complaint._id);

    res.status(201).json({
      message: "Complaint sent to owner",
      complaint: {
        id: complaint._id,
        category: complaint.category,
        severity: complaint.severity,
        priority: complaint.priority,
        suggestedAction: complaint.suggestedAction,
        status: complaint.status,
      },
    });
  } catch (err) {
    console.error("Complaint creation error:", err);

    res.status(500).json({
      message: "Complaint failed",
    });
  }
};


exports.getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("student", "name email")
      .populate("room", "roomNumber");

    res.json(complaints);
  } catch (err) {
    console.error("Error fetching complaints:", err);

    res.status(500).json({
      message: "Error fetching complaints",
    });
  }
};


exports.deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid complaint ID",
      });
    }

    const complaint = await Complaint.findByIdAndDelete(id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    res.json({
      message: "Complaint deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting complaint:", err);

    res.status(500).json({
      message: "Error deleting complaint",
    });
  }
};