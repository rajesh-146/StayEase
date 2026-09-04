const Room = require("../models/Room");
const Rent = require("../models/Rent");
const Complaint = require("../models/Complaint");
const User = require("../models/User");

exports.getOwnerAnalytics = async (req, res) => {
  try {
    const ownerId = req.user._id;

    // Get owner's rooms
    const rooms = await Room.find({
      owner: ownerId,
    }).lean();

    const roomIds = rooms.map((room) => room._id);

    // Get students who have rent records for owner's rooms
    const rents = await Rent.find({
      room: { $in: roomIds },
    }).lean();

    const complaints = await Complaint.find({
      room: { $in: roomIds },
    }).lean();

    // =========================
    // ROOM ANALYTICS
    // =========================

    const totalRooms = rooms.length;

    const totalBeds = rooms.reduce(
      (sum, room) => sum + (room.totalBeds || 0),
      0
    );

    const occupiedBeds = rooms.reduce(
      (sum, room) => sum + (room.occupiedBeds || 0),
      0
    );

    const availableBeds = totalBeds - occupiedBeds;

    const occupancyPercentage =
      totalBeds > 0
        ? Math.round((occupiedBeds / totalBeds) * 100)
        : 0;

    // =========================
    // STUDENT ANALYTICS
    // =========================

    const studentIds = [
      ...new Set(
        rents
          .map((rent) => rent.student?.toString())
          .filter(Boolean)
      ),
    ];

    const totalStudents = studentIds.length;

    // =========================
    // RENT ANALYTICS
    // =========================

    const paidRents = rents.filter(
      (rent) => rent.status === "paid"
    );

    const pendingRents = rents.filter(
      (rent) => rent.status === "pending"
    );

    const paidRevenue = paidRents.reduce(
      (sum, rent) => sum + (rent.amount || 0),
      0
    );

    const pendingRevenue = pendingRents.reduce(
      (sum, rent) => sum + (rent.amount || 0),
      0
    );

    const totalRevenue = paidRevenue + pendingRevenue;

    // =========================
    // COMPLAINT ANALYTICS
    // =========================

    const totalComplaints = complaints.length;

    const urgentComplaints = complaints.filter(
      (complaint) => complaint.priority === "Urgent"
    ).length;

    const highComplaints = complaints.filter(
      (complaint) => complaint.priority === "High"
    ).length;

    const normalComplaints = complaints.filter(
      (complaint) => complaint.priority === "Normal"
    ).length;

    const resolvedComplaints = complaints.filter(
      (complaint) => complaint.status === "resolved"
    ).length;

    const openComplaints = complaints.filter(
      (complaint) => complaint.status === "open"
    ).length;

    const inProgressComplaints = complaints.filter(
      (complaint) => complaint.status === "in_progress"
    ).length;

    // =========================
    // ROOM-WISE ANALYTICS
    // =========================

    const roomAnalytics = rooms.map((room) => {
      const total = room.totalBeds || 0;
      const occupied = room.occupiedBeds || 0;
      const available = Math.max(total - occupied, 0);

      const occupancy =
        total > 0
          ? Math.round((occupied / total) * 100)
          : 0;

      return {
        id: room._id,
        roomNumber: room.roomNumber,
        totalBeds: total,
        occupiedBeds: occupied,
        availableBeds: available,
        rentPerBed: room.rentPerBed,
        occupancyPercentage: occupancy,
      };
    });

    // =========================
    // RESPONSE
    // =========================

    res.json({
      summary: {
        totalStudents,
        totalRooms,
        totalBeds,
        occupiedBeds,
        availableBeds,
        occupancyPercentage,
      },

      rent: {
        paidRevenue,
        pendingRevenue,
        totalRevenue,
        paidCount: paidRents.length,
        pendingCount: pendingRents.length,
      },

      complaints: {
        total: totalComplaints,
        urgent: urgentComplaints,
        high: highComplaints,
        normal: normalComplaints,
        open: openComplaints,
        inProgress: inProgressComplaints,
        resolved: resolvedComplaints,
      },

      rooms: roomAnalytics,
    });
  } catch (err) {
    console.error("Analytics error:", err);

    res.status(500).json({
      message: "Failed to load owner analytics",
    });
  }
};