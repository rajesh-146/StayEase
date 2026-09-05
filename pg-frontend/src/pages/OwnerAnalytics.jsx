import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function OwnerAnalytics() {
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const res = await API.get("/analytics/owner");
        setAnalytics(res.data);
      } catch (err) {
        console.error(
          "Failed to load analytics:",
          err.message || err
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-lg text-slate-300">
          Loading analytics...
        </p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-lg text-red-300">
            Failed to load analytics.
          </p>

          <button
            onClick={() => navigate("/owner")}
            className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { summary, rent, complaints, rooms } = analytics;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950" />

      <div className="relative z-10 min-h-screen p-6 md:p-8">
        <div className="mx-auto max-w-7xl">

          {/* ================= HEADER ================= */}

          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-blue-300">
                Owner Analytics
              </p>

              <h1 className="mt-3 text-4xl font-semibold text-white">
                Hostel Performance
              </h1>

              <p className="mt-2 text-slate-300">
                Monitor rooms, occupancy, revenue, and complaints.
              </p>
            </div>

            <button
              onClick={() => navigate("/owner")}
              className="rounded-2xl bg-slate-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-600"
            >
              ← Back to Dashboard
            </button>
          </div>

          {/* ================= SUMMARY CARDS ================= */}

          <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {/* Students */}
            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 text-2xl">
                👥
              </div>

              <p className="text-sm text-slate-400">
                Total Students
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {summary.totalStudents}
              </p>
            </div>

            {/* Rooms */}
            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-2xl">
                🏠
              </div>

              <p className="text-sm text-slate-400">
                Total Rooms
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {summary.totalRooms}
              </p>
            </div>

            {/* Occupancy */}
            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/20 text-2xl">
                📈
              </div>

              <p className="text-sm text-slate-400">
                Occupancy
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {summary.occupancyPercentage}%
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {summary.occupiedBeds} occupied /{" "}
                {summary.totalBeds} beds
              </p>
            </div>

            {/* Available Beds */}
            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500/20 text-2xl">
                🛏️
              </div>

              <p className="text-sm text-slate-400">
                Available Beds
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {summary.availableBeds}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                out of {summary.totalBeds} total beds
              </p>
            </div>
          </div>

          {/* ================= REVENUE + COMPLAINTS ================= */}

          <div className="mb-8 grid gap-6 lg:grid-cols-2">

            {/* Revenue */}
            <div className="rounded-[32px] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">

              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/20 text-2xl">
                  💰
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Rent Overview
                  </h2>

                  <p className="text-sm text-slate-400">
                    Payment performance
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div className="rounded-2xl bg-green-500/10 p-5">
                  <p className="text-sm text-green-300">
                    Paid Revenue
                  </p>

                  <p className="mt-2 text-2xl font-bold text-white">
                    ₹{rent.paidRevenue.toLocaleString()}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {rent.paidCount} payments
                  </p>
                </div>

                <div className="rounded-2xl bg-orange-500/10 p-5">
                  <p className="text-sm text-orange-300">
                    Pending Revenue
                  </p>

                  <p className="mt-2 text-2xl font-bold text-white">
                    ₹{rent.pendingRevenue.toLocaleString()}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {rent.pendingCount} payments
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-white/5 p-5">
                <p className="text-sm text-slate-400">
                  Total Rent
                </p>

                <p className="mt-1 text-3xl font-bold text-white">
                  ₹{rent.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Complaints */}
            <div className="rounded-[32px] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">

              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-2xl">
                  🤖
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-white">
                    AI Complaint Analytics
                  </h2>

                  <p className="text-sm text-slate-400">
                    AI-prioritized complaints
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">

                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-sm text-slate-400">
                    Total
                  </p>

                  <p className="mt-1 text-2xl font-bold text-white">
                    {complaints.total}
                  </p>
                </div>

                <div className="rounded-2xl bg-red-500/10 p-4">
                  <p className="text-sm text-red-300">
                    Urgent
                  </p>

                  <p className="mt-1 text-2xl font-bold text-red-200">
                    {complaints.urgent}
                  </p>
                </div>

                <div className="rounded-2xl bg-orange-500/10 p-4">
                  <p className="text-sm text-orange-300">
                    High
                  </p>

                  <p className="mt-1 text-2xl font-bold text-orange-200">
                    {complaints.high}
                  </p>
                </div>

                <div className="rounded-2xl bg-yellow-500/10 p-4">
                  <p className="text-sm text-yellow-300">
                    Normal
                  </p>

                  <p className="mt-1 text-2xl font-bold text-yellow-200">
                    {complaints.normal}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">

                <div className="rounded-2xl bg-blue-500/10 p-3 text-center">
                  <p className="text-xl font-bold text-blue-300">
                    {complaints.open}
                  </p>

                  <p className="text-xs text-slate-400">
                    Open
                  </p>
                </div>

                <div className="rounded-2xl bg-purple-500/10 p-3 text-center">
                  <p className="text-xl font-bold text-purple-300">
                    {complaints.inProgress}
                  </p>

                  <p className="text-xs text-slate-400">
                    In Progress
                  </p>
                </div>

                <div className="rounded-2xl bg-green-500/10 p-3 text-center">
                  <p className="text-xl font-bold text-green-300">
                    {complaints.resolved}
                  </p>

                  <p className="text-xs text-slate-400">
                    Resolved
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* ================= OCCUPANCY ================= */}

          <div className="rounded-[32px] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">

            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-2xl">
                🏠
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white">
                  Room Occupancy
                </h2>

                <p className="text-sm text-slate-400">
                  Bed utilization by room
                </p>
              </div>
            </div>

            <div className="space-y-5">

              {rooms.map((room) => (
                <div key={room.id}>

                  <div className="mb-2 flex items-center justify-between">

                    <div>
                      <p className="font-semibold text-white">
                        Room {room.roomNumber}
                      </p>

                      <p className="text-xs text-slate-400">
                        {room.occupiedBeds} occupied /{" "}
                        {room.totalBeds} beds
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-white">
                        {room.occupancyPercentage}%
                      </p>

                      <p className="text-xs text-slate-400">
                        {room.availableBeds} available
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-3 overflow-hidden rounded-full bg-slate-700">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-700"
                      style={{
                        width: `${room.occupancyPercentage}%`,
                      }}
                    />
                  </div>

                </div>
              ))}

            </div>
          </div>

          {/* ================= FOOTER ================= */}

          <div className="mt-8 rounded-[32px] border border-blue-400/20 bg-blue-500/10 p-6">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>
                <h2 className="text-lg font-semibold text-white">
                  📊 StayEase Analytics
                </h2>

                <p className="mt-1 text-sm text-slate-300">
                  Real-time insights from your rooms, rent,
                  students, and AI-powered complaints.
                </p>
              </div>

              <button
                onClick={() => navigate("/owner")}
                className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Back to Dashboard
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}