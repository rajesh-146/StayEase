import { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password, role });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      if (res.data.user.role === "owner") {
        navigate("/owner");
      } else {
        navigate("/student");
      }
    } catch (err) {
      console.error("Login error:", err?.response || err);
      alert("Login failed");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900">
      <img
        src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80"
        alt="Hostel background"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-slate-950/70" />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-6">
        <div className="absolute left-10 top-20 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-10 bottom-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative w-full max-w-[920px] rounded-[32px] bg-white/5 border border-white/10 p-8 shadow-2xl backdrop-blur-3xl overflow-hidden">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.9fr]">
            <div className="flex flex-col justify-center rounded-[28px] bg-white/5 p-6 text-white shadow-inner border border-white/10">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-200 opacity-80">
                Hostel Login
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight">
                Welcome back
              </h1>
              <p className="mt-4 text-base leading-7 text-slate-100/90">
                Use your student or owner credentials to access the PG dashboard.
              </p>
              <div className="mt-8 rounded-3xl bg-white/10 p-4 text-sm text-slate-100 shadow-sm border border-white/10">
                <p className="font-semibold">Tip</p>
                <p className="mt-2 text-slate-200/80">
                  Select the correct role before signing in so you land on the right dashboard.
                </p>
              </div>
            </div>

            <div className="rounded-[28px] bg-white/5 p-6 shadow-inner border border-white/10">
              <form onSubmit={submit} className="space-y-5">
                <div className="rounded-[26px] border border-white/30 bg-white/10 p-4">
                  <label className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-slate-200/80">
                    Email address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-white/30 bg-white/10 px-4 py-3 text-slate-950 outline-none ring-1 ring-transparent transition focus:border-blue-300 focus:bg-white/80 focus:ring-2 focus:ring-blue-200/70"
                  />
                </div>

                <div className="rounded-[26px] border border-white/30 bg-white/20 p-4">
                  <label className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-slate-200/80">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-white/30 bg-white/10 px-4 py-3 text-slate-950 outline-none ring-1 ring-transparent transition focus:border-blue-300 focus:bg-white/80 focus:ring-2 focus:ring-blue-200/70"
                  />
                </div>

                <div className="rounded-[26px] border border-white/30 bg-white/20 p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-200/90">
                    Login as
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setRole("student")}
                      className={`flex-1 rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                        role === "student"
                          ? "bg-white text-slate-900"
                          : "bg-slate-900/10 text-white hover:bg-slate-900/20"
                      }`}
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("owner")}
                      className={`flex-1 rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                        role === "owner"
                          ? "bg-white text-slate-900"
                          : "bg-slate-900/10 text-white hover:bg-slate-900/20"
                      }`}
                    >
                      Owner
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-slate-900"
                >
                  Sign In
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-slate-100/80">
                Don’t have an account?{' '}
                <Link to="/register" className="font-semibold text-white underline-offset-2 hover:underline">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
