import { useEffect, useState } from "react";
import API from "../api/api";
import AIChat from "../components/AIChat";

export default function StudentDashboard() {
  const [rooms, setRooms] = useState([]);

  const loadRooms = async () => {
    const res = await API.get("/rooms/available");
    setRooms(res.data);
  };

  useEffect(() => {
    (async () => {
      await loadRooms();
    })();
  }, []);

  const book = async (id) => {
    await API.post("/bookings", { roomId: id });
    alert("Booked!");
    loadRooms();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900">
      <img
        src="https://source.unsplash.com/1600x900/?students,hostel"
        alt="Student hostel background"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-slate-950/70" />
      <div className="relative z-10 min-h-screen p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-200 opacity-80">
              Student Dashboard
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-white">
              Find Your Perfect Room
            </h1>
            <p className="mt-2 text-lg text-slate-300">
              Browse available rooms, pay rent, and submit complaints easily.
            </p>
          </div>

          {/* TOP BUTTONS */}
          <div className="mb-8 flex justify-center gap-4">
            <button
              onClick={() => (window.location.href = "/rent")}
              className="rounded-2xl bg-slate-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              💰 My Rent
            </button>
            <button
              onClick={() => (window.location.href = "/complaint")}
              className="rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              📝 Complaint
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((r) => (
              <div key={r._id} className="group rounded-[32px] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl transition hover:bg-white/15 hover:shadow-3xl">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-2xl">
                  🏠
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Room {r.roomNumber}</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-slate-300">
                    <span className="font-medium">Rent:</span> ₹{r.rentPerBed}/month
                  </p>
                  <p className="text-slate-300">
                    <span className="font-medium">Beds left:</span> {r.totalBeds - r.occupiedBeds}
                  </p>
                </div>
                <button
                  onClick={() => book(r._id)}
                  className="w-full rounded-2xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  Book Bed
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
     <AIChat />
    </div>
  );
}
