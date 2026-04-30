import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await API.get("/auth/users");
        const studentList = res.data.filter(user => user.role === "student");
        setStudents(studentList);
      } catch (err) {
        console.log("Error fetching students:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-900">
        <img
          src="https://source.unsplash.com/1600x900/?students,university"
          alt="Students background"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-slate-950/70" />
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl backdrop-blur-xl">
              👥
            </div>
            <p className="text-xl text-white">Loading students...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900">
      <img
        src="https://source.unsplash.com/1600x900/?students,university"
        alt="Students background"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-slate-950/70" />
      <div className="relative z-10 min-h-screen p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-200 opacity-80">
                Students Management
              </p>
              <h1 className="mt-4 text-4xl font-semibold text-white">
                Manage Your Students
              </h1>
              <p className="mt-2 text-lg text-slate-300">
                View and manage all registered students in your hostel.
              </p>
            </div>
            <button
              onClick={() => navigate("/owner")}
              className="rounded-2xl bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/20"
            >
              ← Back to Dashboard
            </button>
          </div>

          {students.length === 0 ? (
            <div className="text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl backdrop-blur-xl">
                👥
              </div>
              <p className="text-xl text-slate-300">No students found</p>
              <p className="mt-2 text-slate-400">Students will appear here once they register.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {students.map((student) => (
                <div key={student._id} className="group rounded-[32px] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl transition hover:bg-white/15 hover:shadow-3xl">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 text-2xl">
                    👤
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{student.name}</h3>
                  <div className="space-y-2 mb-4">
                    <p className="text-slate-300">
                      <span className="font-medium">Email:</span> {student.email}
                    </p>
                    <p className="text-slate-300">
                      <span className="font-medium">Phone:</span> {student.phone || "N/A"}
                    </p>
                    <p className="text-slate-300">
                      <span className="font-medium">Room:</span> {student.room || "Not assigned"}
                    </p>
                    <p className="text-slate-300">
                      <span className="font-medium">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                        student.active
                          ? "bg-green-500/20 text-green-300"
                          : "bg-red-500/20 text-red-300"
                      }`}>
                        {student.active ? "Active" : "Inactive"}
                      </span>
                    </p>
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
