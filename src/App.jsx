import { useState } from "react";
import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Route, Routes, useLocation } from "react-router-dom";
import GeneralViewPage from "./pages/GeneralViewPage";
import PatientDashboardView from "./pages/PatientDashboardView";
import ProtectedPatientRoutes from "./routes/ProtectedPatientRoutes";
import ProtectedDoctorRoutes from "./routes/ProtectedDoctorRoutes";
import DoctorDashboardView from "./pages/DoctorDashboardView";
import ProtectedAdminRoutes from "./routes/ProtectedAdminRoutes";
import AdminDashboardView from "./pages/AdminDashboardView";
import VideoSessionPage from "./pages/VideoSessionPage";
import ChatSection from "./pages/Patients/Dashboard/ChatSection";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const location = useLocation();

  return (
    <>
      <div className="App">
        <Routes>
          <Route
            path="/chats"
            element={
              <ProtectedRoute>
                <ChatSection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chats/:roomId"
            element={
              <ProtectedRoute>
                <ChatSection />
              </ProtectedRoute>
            }
          />
          <Route
            path="consultation/:roomId"
            element={
              <ProtectedRoute>
                <VideoSessionPage />
              </ProtectedRoute>
            }
          />
          <Route path="/*" element={<GeneralViewPage />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedPatientRoutes>
                <PatientDashboardView />
              </ProtectedPatientRoutes>
            }
          />
          <Route
            path="/doctor-dashboard/*"
            element={
              <ProtectedDoctorRoutes>
                <DoctorDashboardView />
              </ProtectedDoctorRoutes>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedAdminRoutes>
                <AdminDashboardView />
              </ProtectedAdminRoutes>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
