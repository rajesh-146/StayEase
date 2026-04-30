import { useEffect, useState } from "react";
import API from "../api/api";

export default function RentPage() {
  const [rents, setRents] = useState([]);

  const load = async () => {
    const res = await API.get("/rent/my");
    setRents(res.data);
  };

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, []);

  const pay = async (id) => {
    await API.post("/rent/pay", { rentId: id });
    load();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900">
      <img
        src="https://source.unsplash.com/1600x900/?rent,payment"
        alt="Rent payment background"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-slate-950/70" />
      <div className="relative z-10 min-h-screen p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-200 opacity-80">
              My Rent
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-white">
              Manage Your Rent Payments
            </h1>
            <p className="mt-2 text-lg text-slate-300">
              View your rent history and pay pending amounts.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rents.map((r) => (
              <div key={r._id} className="group rounded-[32px] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl transition hover:bg-white/15 hover:shadow-3xl">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/20 text-2xl">
                  💰
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Room {r.room.roomNumber}</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-slate-300">
                    <span className="font-medium">Month:</span> {r.month}
                  </p>
                  <p className="text-slate-300">
                    <span className="font-medium">Amount:</span> ₹{r.amount}
                  </p>
                  <p className="text-slate-300">
                    <span className="font-medium">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                      r.status === "paid"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-red-500/20 text-red-300"
                    }`}>
                      {r.status}
                    </span>
                  </p>
                </div>
                {r.status === "pending" && (
                  <button
                    onClick={() => pay(r._id)}
                    className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Pay Rent
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
