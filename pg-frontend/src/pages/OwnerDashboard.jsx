import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/complaints");
        setComplaints(res.data || []);
      } catch (err) {
        console.error("Failed to load complaints:", err.message || err);
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const latest = complaints.length ? complaints[complaints.length - 1] : null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900">
      <img
        src="https://source.unsplash.com/1600x900/?hostel,owner"
        alt="Hostel owner background"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-slate-950/70" />
      <div className="relative z-10 min-h-screen p-8">
        <div className="mx-auto max-w-7xl">
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

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="group rounded-[32px] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl transition hover:bg-white/15 hover:shadow-3xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-2xl">
                📊
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Rooms</h3>
              <p className="text-slate-300 mb-4">Manage your PG rooms and availability</p>
              <button
                onClick={() => navigate("/rooms")}
                className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                View Rooms
              </button>
            </div>

            <div className="group rounded-[32px] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl transition hover:bg-white/15 hover:shadow-3xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/20 text-2xl">
                💰
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Rent Payments</h3>
              <p className="text-slate-300 mb-4">Track rent payments from students</p>
              <button
                onClick={() => navigate("/owner-rent")}
                className="w-full rounded-2xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                View Rent
              </button>
            </div>

            <div className="group rounded-[32px] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl transition hover:bg-white/15 hover:shadow-3xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-2xl">
                🔔
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Notifications</h3>
              {loading ? (
                <p className="text-slate-300 mb-4">Loading complaints...</p>
              ) : (
                <>
                  <p className="text-slate-300 mb-4">{complaints.length} complaint{complaints.length !== 1 ? "s" : ""} received</p>
                  {latest ? (
                    <div className="mb-4 rounded-2xl bg-white/10 p-3">
                      <p className="font-semibold text-white">From: {latest.student?.name || "Unknown"}</p>
                      <p className="text-sm text-slate-200 mt-1">{latest.message}</p>
                      <p className="text-xs text-slate-400 mt-1">Room: {latest.room || "-"}</p>
                    </div>
                  ) : (
                    <p className="text-slate-400 mb-4">No complaints yet</p>
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

            <div className="group rounded-[32px] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl transition hover:bg-white/15 hover:shadow-3xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 text-2xl">
                👥
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Students</h3>
              <p className="text-slate-300 mb-4">Manage student accounts</p>
              <button
                onClick={() => navigate("/students")}
                className="w-full rounded-2xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                View Students
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
