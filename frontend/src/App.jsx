import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

const adminEnabled = import.meta.env.VITE_ENABLE_ADMIN === "true";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* These routes are only ever registered when VITE_ENABLE_ADMIN=true —
          in a production build made with the default .env, they don't exist,
          so there is nothing for a recruiter to stumble onto. */}
      {adminEnabled && <Route path="/admin/login" element={<AdminLogin />} />}
      {adminEnabled && <Route path="/admin/dashboard" element={<AdminDashboard />} />}
    </Routes>
  );
}
