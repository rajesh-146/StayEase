import { useEffect, useState } from "react";
import API from "../api/api";

export default function OwnerComplaints() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await API.get("/complaints");
      setList(res.data || []);
    } catch (err) {
      console.error("Failed to load complaints:", err.message);
      alert("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
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

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-500/20 text-red-300 border-red-400/30";

      case "High":
        return "bg-orange-500/20 text-orange-300 border-orange-400/30";

      case "Normal":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-400/30";

      default:
        return "bg-green-500/20 text-green-300 border-green-400/30";
    }
  };

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case "Critical":
        return "bg-red-600/30 text-red-200";

      case "High":
        return "bg-orange-500/20 text-orange-300";

      case "Medium":
        return "bg-yellow-500/20 text-yellow-300";

      default:
        return "bg-green-500/20 text-green-300";
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

          {/* HEADER */}
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-200 opacity-80">
              AI Complaint Management
            </p>

            <h1 className="mt-4 text-4xl font-semibold text-white">
              Student Complaints
            </h1>

            <p className="mt-2 text-lg text-slate-300">
              Review complaints with AI-powered priority and severity analysis.
            </p>
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="text-center">
              <p className="text-lg text-slate-300">
                Loading complaints...
              </p>
            </div>
          ) : list.length === 0 ? (
            /* EMPTY STATE */
            <div className="mx-auto max-w-md rounded-[32px] border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/20 text-3xl">
                ✅
              </div>

              <h3 className="mb-2 text-xl font-semibold text-white">
                No complaints
              </h3>

              <p className="text-slate-300">
                There are currently no student complaints.
              </p>
            </div>
          ) : (
            /* COMPLAINT CARDS */
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {list.map((c) => (
                <div
                  key={c._id}
                  className="group rounded-[32px] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl transition hover:bg-white/15 hover:shadow-3xl"
                >

                  {/* ICON + PRIORITY */}
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/20 text-2xl">
                      📝
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${getPriorityStyle(
                        c.priority
                      )}`}
                    >
                      {c.priority || "Normal"}
                    </span>
                  </div>

                  {/* ROOM */}
                  <h3 className="mb-4 text-xl font-semibold text-white">
                    Room {c.room?.roomNumber || "Unknown"}
                  </h3>

                  {/* STUDENT */}
                  <div className="mb-4 space-y-2">
                    <p className="text-slate-300">
                      <span className="font-medium text-white">
                        From:
                      </span>{" "}
                      {c.student?.name || "Unknown"}
                    </p>

                    <p className="text-slate-400 text-sm">
                      {c.student?.email || ""}
                    </p>
                  </div>

                  {/* COMPLAINT */}
                  <div className="mb-5 rounded-2xl bg-slate-950/40 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Complaint
                    </p>

                    <p className="text-sm leading-relaxed text-slate-200">
                      {c.message}
                    </p>
                  </div>

                  {/* AI ANALYSIS */}
                  <div className="mb-5 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4">

                    <div className="mb-3 flex items-center gap-2">
                      <span className="text-lg">🤖</span>

                      <p className="font-semibold text-blue-200">
                        AI Analysis
                      </p>
                    </div>

                    {/* CATEGORY */}
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm text-slate-400">
                        Category
                      </span>

                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                        {c.category || "Other"}
                      </span>
                    </div>

                    {/* SEVERITY */}
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm text-slate-400">
                        Severity
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getSeverityStyle(
                          c.severity
                        )}`}
                      >
                        {c.severity || "Medium"}
                      </span>
                    </div>

                    {/* PRIORITY */}
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm text-slate-400">
                        Priority
                      </span>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${getPriorityStyle(
                          c.priority
                        )}`}
                      >
                        {c.priority || "Normal"}
                      </span>
                    </div>

                    {/* SUGGESTED ACTION */}
                    <div className="mt-4 border-t border-white/10 pt-3">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Suggested Action
                      </p>

                      <p className="text-sm leading-relaxed text-slate-200">
                        {c.suggestedAction ||
                          "Review complaint manually."}
                      </p>
                    </div>
                  </div>

                  {/* STATUS */}
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm text-slate-400">
                      Status
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        c.status === "resolved"
                          ? "bg-green-500/20 text-green-300"
                          : c.status === "in_progress"
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-yellow-500/20 text-yellow-300"
                      }`}
                    >
                      {c.status || "open"}
                    </span>
                  </div>

                  {/* DELETE / SOLVE */}
                  <button
                    onClick={() => deleteComplaint(c._id)}
                    className="w-full rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    Mark as Solved & Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}