import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";

export default function OwnerDashboard() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const res = await API.get("/complaints");
        setComplaints(res.data || []);
      } catch (err) {
        console.error(
          "Failed to load complaints:",
          err.message || err
        );
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    loadComplaints();
  }, []);

  // Latest complaint
  const latest = complaints.length
    ? complaints[complaints.length - 1]
    : null;

  // AI priority counts
  const urgentCount = complaints.filter(
    (c) => c.priority === "Urgent"
  ).length;

  const highCount = complaints.filter(
    (c) => c.priority === "High"
  ).length;

  const normalCount = complaints.filter(
    (c) => c.priority === "Normal"
  ).length;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900">
      {/* Background */}
      <img
        src="https://source.unsplash.com/1600x900/?hostel,owner"
        alt="Hostel owner background"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />

      <div className="absolute inset-0 bg-slate-950/70" />

      <div className="relative z-10 min-h-screen p-8">
        <div className="mx-auto max-w-7xl">

          {/* ================= HEADER ================= */}
          <button
            onClick={() => navigate("/owner-analytics")}
            className="mt-5 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">📊 View Analytics
          </button>
          
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-200 opacity-80">
              Owner Dashboard
            </p>

            <h1 className="mt-4 text-4xl font-semibold text-white">
              Manage Your PG Hostel
            </h1>

            <p className="mt-2 text-lg text-slate-300">
              Oversee rooms, rent, complaints, and students from one place.
            </p>
          </div>

          {/* ================= MAIN CARDS ================= */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            {/* ================= ROOMS ================= */}
            <div className="group rounded-[32px] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl transition hover:bg-white/15 hover:shadow-3xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-2xl">
                📊
              </div>

              <h3 className="mb-2 text-xl font-semibold text-white">
                Rooms
              </h3>

              <p className="mb-4 text-slate-300">
                Manage your PG rooms and availability
              </p>

              <button
                onClick={() => navigate("/rooms")}
                className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                View Rooms
              </button>
            </div>

            {/* ================= RENT ================= */}
            <div className="group rounded-[32px] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl transition hover:bg-white/15 hover:shadow-3xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/20 text-2xl">
                💰
              </div>

              <h3 className="mb-2 text-xl font-semibold text-white">
                Rent Payments
              </h3>

              <p className="mb-4 text-slate-300">
                Track rent payments from students
              </p>

              <button
                onClick={() => navigate("/owner-rent")}
                className="w-full rounded-2xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                View Rent
              </button>
            </div>

            {/* ================= AI COMPLAINTS ================= */}
            <div className="group rounded-[32px] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl transition hover:bg-white/15 hover:shadow-3xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-2xl">
                🔔
              </div>

              <h3 className="mb-3 text-xl font-semibold text-white">
                AI Complaint Overview
              </h3>

              {loading ? (
                <p className="mb-4 text-slate-300">
                  Loading complaints...
                </p>
              ) : (
                <>
                  {/* Total */}
                  <p className="mb-3 text-slate-300">
                    {complaints.length} complaint
                    {complaints.length !== 1 ? "s" : ""} received
                  </p>

                  {/* AI Priority Counts */}
                  <div className="mb-4 grid grid-cols-3 gap-2">

                    {/* Urgent */}
                    <div className="rounded-xl bg-red-500/10 p-2 text-center">
                      <p className="text-lg font-bold text-red-300">
                        {urgentCount}
                      </p>

                      <p className="text-[10px] text-red-200">
                        Urgent
                      </p>
                    </div>

                    {/* High */}
                    <div className="rounded-xl bg-orange-500/10 p-2 text-center">
                      <p className="text-lg font-bold text-orange-300">
                        {highCount}
                      </p>

                      <p className="text-[10px] text-orange-200">
                        High
                      </p>
                    </div>

                    {/* Normal */}
                    <div className="rounded-xl bg-yellow-500/10 p-2 text-center">
                      <p className="text-lg font-bold text-yellow-300">
                        {normalCount}
                      </p>

                      <p className="text-[10px] text-yellow-200">
                        Normal
                      </p>
                    </div>
                  </div>

                  {/* Latest Complaint */}
                  {latest ? (
                    <div className="mb-4 rounded-2xl bg-white/10 p-3">

                      {/* Student + Priority */}
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <p className="font-semibold text-white">
                          From:{" "}
                          {latest.student?.name || "Unknown"}
                        </p>

                        <span className="rounded-full bg-orange-500/20 px-2 py-1 text-[10px] font-bold text-orange-300">
                          {latest.priority || "Normal"}
                        </span>
                      </div>

                      {/* Complaint */}
                      <p className="text-sm leading-relaxed text-slate-200">
                        {latest.message}
                      </p>

                      {/* Room + Category */}
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-xs text-slate-400">
                          Room:{" "}
                          {latest.room?.roomNumber || "-"}
                        </p>

                        <p className="text-xs text-blue-300">
                          {latest.category || "Other"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="mb-4 text-slate-400">
                      No complaints yet
                    </p>
                  )}
                </>
              )}

              <button
                onClick={() => navigate("/owner-complaints")}
                className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                View All Complaints
              </button>
            </div>

            {/* ================= STUDENTS ================= */}
            <div className="group rounded-[32px] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl transition hover:bg-white/15 hover:shadow-3xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 text-2xl">
                👥
              </div>

              <h3 className="mb-2 text-xl font-semibold text-white">
                Students
              </h3>

              <p className="mb-4 text-slate-300">
                Manage student accounts
              </p>

              <button
                onClick={() => navigate("/students")}
                className="w-full rounded-2xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                View Students
              </button>
            </div>

          </div>

          {/* ================= AI INFORMATION ================= */}
          <div className="mt-8 rounded-[32px] border border-blue-400/20 bg-blue-500/10 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-2xl">🤖</span>

                  <h2 className="text-xl font-semibold text-white">
                    StayEase AI Complaint Triage
                  </h2>
                </div>

                <p className="max-w-2xl text-sm leading-relaxed text-slate-300">
                  AI automatically analyzes student complaints and
                  identifies the category, severity, priority, and
                  recommended action to help owners respond faster.
                </p>
              </div>

              <button
                onClick={() => navigate("/owner-complaints")}
                className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Open AI Analysis
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}