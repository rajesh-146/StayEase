import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function OwnerRentPage() {
  const [rents, setRents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRents();
  }, []);

  const fetchRents = async () => {
    try {
      const res = await API.get("/rent");
      setRents(res.data);
    } catch (err) {
      console.log("Error fetching rents:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendReminder = async (rentId, studentId, studentEmail, studentName, month) => {
    try {
      await API.post("/rent/reminder", {
        rentId,
        studentId,
        studentEmail,
        studentName,
        month
      });
      alert(`Rent reminder sent to ${studentEmail}!`);
      fetchRents();
    } catch (err) {
      console.log("Error sending reminder:", err.message);
      alert("Failed to send reminder");
    }
  };

  const pendingRents = rents.filter(r => r.status === "pending");
  const paidRents = rents.filter(r => r.status === "paid");

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900">
      <img
        src="https://source.unsplash.com/1600x900/?money,rent"
        alt="Rent management background"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-slate-950/70" />
      <div className="relative z-10 min-h-screen p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-200 opacity-80">
                Rent Management
              </p>
              <h1 className="mt-4 text-4xl font-semibold text-white">
                Track Rent Payments
              </h1>
              <p className="mt-2 text-lg text-slate-300">
                Monitor pending and paid rents, send reminders to students.
              </p>
            </div>
            <button
              onClick={() => navigate("/owner")}
              className="rounded-2xl bg-slate-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              ← Back to Dashboard
            </button>
          </div>

          {loading ? (
            <div className="text-center">
              <p className="text-slate-300 text-lg">Loading rents...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* PENDING RENTS */}
              <div className="rounded-[32px] border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/20 text-xl">
                    💰
                  </div>
                  Pending Rents ({pendingRents.length})
                </h2>
                {pendingRents.length === 0 ? (
                  <p className="text-slate-300 text-center">No pending rents</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="p-4 text-left text-sm font-semibold uppercase tracking-[0.15em] text-slate-200">
                            Student Name
                          </th>
                          <th className="p-4 text-left text-sm font-semibold uppercase tracking-[0.15em] text-slate-200">
                            Email
                          </th>
                          <th className="p-4 text-left text-sm font-semibold uppercase tracking-[0.15em] text-slate-200">
                            Room
                          </th>
                          <th className="p-4 text-left text-sm font-semibold uppercase tracking-[0.15em] text-slate-200">
                            Month
                          </th>
                          <th className="p-4 text-left text-sm font-semibold uppercase tracking-[0.15em] text-slate-200">
                            Amount
                          </th>
                          <th className="p-4 text-left text-sm font-semibold uppercase tracking-[0.15em] text-slate-200">
                            Status
                          </th>
                          <th className="p-4 text-left text-sm font-semibold uppercase tracking-[0.15em] text-slate-200">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingRents.map((rent) => (
                          <tr key={rent._id} className="border-b border-white/10 hover:bg-white/5 transition">
                            <td className="p-4 text-slate-300">{rent.student?.name || "N/A"}</td>
                            <td className="p-4 text-slate-300">{rent.student?.email || "N/A"}</td>
                            <td className="p-4 text-slate-300">Room {rent.room?.roomNumber || "N/A"}</td>
                            <td className="p-4 text-slate-300">{rent.month}</td>
                            <td className="p-4 text-slate-300 font-semibold">₹{rent.amount}</td>
                            <td className="p-4">
                              <span className="rounded-2xl bg-red-500/20 px-3 py-1 text-sm font-semibold text-red-300">
                                Pending
                              </span>
                            </td>
                            <td className="p-4">
                              <button
                                onClick={() =>
                                  sendReminder(
                                    rent._id,
                                    rent.student?._id,
                                    rent.student?.email,
                                    rent.student?.name,
                                    rent.month
                                  )
                                }
                                className="rounded-2xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
                              >
                                Send Reminder
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* PAID RENTS */}
              <div className="rounded-[32px] border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-500/20 text-xl">
                    ✅
                  </div>
                  Paid Rents ({paidRents.length})
                </h2>
                {paidRents.length === 0 ? (
                  <p className="text-slate-300 text-center">No paid rents</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="p-4 text-left text-sm font-semibold uppercase tracking-[0.15em] text-slate-200">
                            Student Name
                          </th>
                          <th className="p-4 text-left text-sm font-semibold uppercase tracking-[0.15em] text-slate-200">
                            Email
                          </th>
                          <th className="p-4 text-left text-sm font-semibold uppercase tracking-[0.15em] text-slate-200">
                            Room
                          </th>
                          <th className="p-4 text-left text-sm font-semibold uppercase tracking-[0.15em] text-slate-200">
                            Month
                          </th>
                          <th className="p-4 text-left text-sm font-semibold uppercase tracking-[0.15em] text-slate-200">
                            Amount
                          </th>
                          <th className="p-4 text-left text-sm font-semibold uppercase tracking-[0.15em] text-slate-200">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paidRents.map((rent) => (
                          <tr key={rent._id} className="border-b border-white/10 hover:bg-white/5 transition">
                            <td className="p-4 text-slate-300">{rent.student?.name || "N/A"}</td>
                            <td className="p-4 text-slate-300">{rent.student?.email || "N/A"}</td>
                            <td className="p-4 text-slate-300">Room {rent.room?.roomNumber || "N/A"}</td>
                            <td className="p-4 text-slate-300">{rent.month}</td>
                            <td className="p-4 text-slate-300 font-semibold">₹{rent.amount}</td>
                            <td className="p-4">
                              <span className="rounded-2xl bg-green-500/20 px-3 py-1 text-sm font-semibold text-green-300">
                                Paid
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
