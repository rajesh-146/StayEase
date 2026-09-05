import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OwnerDashboard from "./pages/OwnerDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import RentPage from "./pages/RentPage";
import ComplaintPage from "./pages/ComplaintPage";
import OwnerComplaints from "./pages/OwnerComplaints";
import RoomsPage from "./pages/RoomsPage";
import StudentsPage from "./pages/StudentsPage";
import OwnerRentPage from "./pages/OwnerRentPage";
import OwnerAnalytics from "./pages/OwnerAnalytics";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/rent" element={<RentPage />} />
        <Route path="/owner-rent" element={<OwnerRentPage />} />
        <Route path="/complaint" element={<ComplaintPage />} />
        <Route path="/owner-complaints" element={<OwnerComplaints />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/owner-analytics" element={<OwnerAnalytics />} />
      </Routes>
    </BrowserRouter>
  );
}
