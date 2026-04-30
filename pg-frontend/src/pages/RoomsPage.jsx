import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: "",
    totalBeds: "",
    rentPerBed: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await API.get("/rooms");
      setRooms(res.data);
    } catch (err) {
      console.log("Error fetching rooms:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      await API.post("/rooms", {
        roomNumber: formData.roomNumber,
        totalBeds: formData.totalBeds,
        rentPerBed: formData.rentPerBed
      });
      alert("Room added successfully!");
      setFormData({ roomNumber: "", totalBeds: "", rentPerBed: "" });
      setShowForm(false);
      fetchRooms();
    } catch (err) {
      console.log("Error adding room:", err.message);
      alert("Failed to add room");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="p-10">Loading rooms...</div>;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900">
      <img
        src="https://source.unsplash.com/1600x900/?hostel,rooms"
        alt="Hostel rooms background"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-slate-950/70" />
      <div className="relative z-10 min-h-screen p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-200 opacity-80">
                Rooms Management
              </p>
              <h1 className="mt-4 text-4xl font-semibold text-white">
                Manage Your PG Rooms
              </h1>
              <p className="mt-2 text-lg text-slate-300">
                Add, view, and track room availability and occupancy.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowForm(!showForm)}
                className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                {showForm ? "Cancel" : "+ Add Room"}
              </button>
              <button
                onClick={() => navigate("/owner")}
                className="rounded-2xl bg-slate-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>

          {showForm && (
            <div className="mb-8 rounded-[32px] border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
              <h2 className="text-2xl font-semibold text-white mb-6">Add New Room</h2>
              <form onSubmit={handleAddRoom} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="rounded-3xl border border-white/30 bg-white/20 p-4">
                    <label className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-slate-200/80">
                      Room Number
                    </label>
                    <input
                      type="text"
                      name="roomNumber"
                      placeholder="e.g., 101"
                      value={formData.roomNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-2xl border border-white/30 bg-white/10 px-4 py-3 text-slate-950 outline-none ring-1 ring-transparent transition focus:border-blue-300 focus:bg-white/80 focus:ring-2 focus:ring-blue-200/70"
                    />
                  </div>
                  <div className="rounded-3xl border border-white/30 bg-white/20 p-4">
                    <label className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-slate-200/80">
                      Total Beds
                    </label>
                    <input
                      type="number"
                      name="totalBeds"
                      placeholder="e.g., 4"
                      value={formData.totalBeds}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-2xl border border-white/30 bg-white/10 px-4 py-3 text-slate-950 outline-none ring-1 ring-transparent transition focus:border-blue-300 focus:bg-white/80 focus:ring-2 focus:ring-blue-200/70"
                    />
                  </div>
                  <div className="rounded-3xl border border-white/30 bg-white/20 p-4">
                    <label className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-slate-200/80">
                      Rent per Bed
                    </label>
                    <input
                      type="number"
                      name="rentPerBed"
                      placeholder="e.g., 5000"
                      value={formData.rentPerBed}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-2xl border border-white/30 bg-white/10 px-4 py-3 text-slate-950 outline-none ring-1 ring-transparent transition focus:border-blue-300 focus:bg-white/80 focus:ring-2 focus:ring-blue-200/70"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="rounded-2xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  Add Room
                </button>
              </form>
            </div>
          )}

          {loading ? (
            <div className="text-center">
              <p className="text-slate-300 text-lg">Loading rooms...</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center">
              <p className="text-slate-300 text-lg">No rooms found</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <div key={room._id} className="group rounded-[32px] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl transition hover:bg-white/15 hover:shadow-3xl">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-2xl">
                    🏠
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">Room {room.roomNumber}</h3>
                  <div className="space-y-2 mb-4">
                    <p className="text-slate-300">
                      <span className="font-medium">Total Beds:</span> {room.totalBeds}
                    </p>
                    <p className="text-slate-300">
                      <span className="font-medium">Occupied:</span> {room.occupiedBeds || 0} beds
                    </p>
                    <p className="text-slate-300">
                      <span className="font-medium">Rent:</span> ₹{room.rentPerBed}/month
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      (room.occupiedBeds || 0) >= room.totalBeds
                        ? "bg-red-500/20 text-red-300"
                        : "bg-green-500/20 text-green-300"
                    }`}>
                      {(room.occupiedBeds || 0) >= room.totalBeds ? "Full" : "Available"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
