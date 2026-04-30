import { useEffect, useState } from "react";
import API from "../api/api";

export default function OwnerComplaints() {
  const [list, setList] = useState([]);

  const load = async () => {
    const res = await API.get("/complaints");
    setList(res.data);
  };

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, []);

  const deleteComplaint = async (id) => {
    if (!window.confirm("Are you sure you want to remove this complaint?")) {
      return;
    }
    try {
      await API.delete(`/complaints/${id}`);
      load();
    } catch (err) {
      console.error("Failed to delete complaint:", err.message);
      alert("Failed to delete complaint");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900">
      <img
        src="https://source.unsplash.com/1600x900/?complaints,feedback"
        alt="Complaints background"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-slate-950/70" />
      <div className="relative z-10 min-h-screen p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-200 opacity-80">
              Complaints Management
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-white">
              Handle Student Complaints
            </h1>
            <p className="mt-2 text-lg text-slate-300">
              Review and resolve complaints from your students.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((c) => (
              <div key={c._id} className="group rounded-[32px] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl transition hover:bg-white/15 hover:shadow-3xl">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/20 text-2xl">
                  📝
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Room {c.room.roomNumber}</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-slate-300">
                    <span className="font-medium">From:</span> {c.student?.name || "Unknown"}
                  </p>
                  <p className="text-slate-300">
                    <span className="font-medium">Message:</span> {c.message}
                  </p>
                  <p className="text-slate-300">
                    <span className="font-medium">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                      c.status === "resolved"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}>
                      {c.status}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => deleteComplaint(c._id)}
                  className="w-full rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Mark as Solved & Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
