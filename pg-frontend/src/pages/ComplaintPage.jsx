import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function ComplaintPage() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const navigate = useNavigate();

  // Fetch student's booked rooms
  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/bookings/my-rooms");
        setRooms(res.data || []);
        if (res.data && res.data.length > 0) {
          setSelectedRoom(res.data[0]._id);
        }
      } catch (err) {
        console.error("Failed to load rooms:", err.message);
        alert("Failed to load your rooms. Please try again.");
      } finally {
        setLoadingRooms(false);
      }
    })();
  }, []);

  const send = async (e) => {
    e.preventDefault();
    if (!selectedRoom || !message) {
      alert("Please select a room and enter a complaint message");
      return;
    }

    setLoading(true);
    try {
      await API.post("/complaints", { room: selectedRoom, message });
      alert("Complaint sent to owner!");
      setMessage("");
      setTimeout(() => navigate("/student"), 1500);
    } catch (err) {
      console.error("Error sending complaint:", err.message);
      alert("Failed to send complaint");
    } finally {
      setLoading(false);
    }
  };

  const selectedRoomData = rooms.find(r => r._id === selectedRoom);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900">
      <img
        src="https://source.unsplash.com/1600x900/?complaint,support"
        alt="Complaint support background"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-slate-950/70" />
      <div className="relative z-10 min-h-screen p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-200 opacity-80">
                Raise Complaint
              </p>
              <h1 className="mt-4 text-4xl font-semibold text-white">
                Submit Your Complaint
              </h1>
              <p className="mt-2 text-lg text-slate-300">
                Let us know about any issues in your room or hostel.
              </p>
            </div>
            <button
              onClick={() => navigate("/student")}
              className="rounded-2xl bg-slate-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              ← Back to Dashboard
            </button>
          </div>

          {loadingRooms ? (
            <div className="text-center">
              <p className="text-slate-300 text-lg">Loading your rooms...</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="rounded-[32px] border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-500/20 text-3xl mx-auto">
                ⚠️
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">No rooms booked yet</h3>
              <p className="text-slate-300 mb-6">You need to book a room before raising a complaint.</p>
              <button
                onClick={() => navigate("/student")}
                className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <div className="mx-auto max-w-md">
              <div className="rounded-[32px] border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
                <form onSubmit={send} className="space-y-6">
                  <div className="rounded-3xl border border-white/30 bg-white/20 p-4">
                    <label className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-slate-200/80">
                      Your Room
                    </label>
                    <select
                      className="w-full rounded-2xl border border-white/30 bg-white/10 px-4 py-3 text-slate-950 outline-none ring-1 ring-transparent transition focus:border-blue-300 focus:bg-white/80 focus:ring-2 focus:ring-blue-200/70"
                      value={selectedRoom}
                      onChange={(e) => setSelectedRoom(e.target.value)}
                      required
                    >
                      <option value="">Select a room</option>
                      {rooms.map((room) => (
                        <option key={room._id} value={room._id}>
                          Room {room.roomNumber}
                        </option>
                      ))}
                    </select>
                    {selectedRoomData && (
                      <p className="text-xs text-slate-400 mt-2">
                        Selected: Room {selectedRoomData.roomNumber}
                      </p>
                    )}
                  </div>

                  <div className="rounded-3xl border border-white/30 bg-white/20 p-4">
                    <label className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-slate-200/80">
                      Complaint Message
                    </label>
                    <textarea
                      className="w-full rounded-2xl border border-white/30 bg-white/10 px-4 py-3 text-slate-950 outline-none ring-1 ring-transparent transition focus:border-blue-300 focus:bg-white/80 focus:ring-2 focus:ring-blue-200/70 h-32 resize-none"
                      placeholder="Describe your complaint in detail..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:bg-slate-600"
                  >
                    {loading ? "Sending..." : "Send Complaint"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
