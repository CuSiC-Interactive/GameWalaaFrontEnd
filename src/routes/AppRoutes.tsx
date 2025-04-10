import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "../Admin/AdminDashboard";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/Admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
