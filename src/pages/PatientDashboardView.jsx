import React from "react";
import DashboardNavbar from "../components/Patients/DashboardNavbar";
import DashboardPage from "./Patients/Dashboard/DashboardPage";
import { Route, Routes } from "react-router-dom";
import Error404Page from "../layouts/Error404Page";
import DashboardProfile from "./Patients/Dashboard/DashboardProfile";
import Appointments from "./Patients/Dashboard/Appointments";
import MedicalHistory from "./Patients/Dashboard/MedicalHistory";
import Prescriptions from "./Patients/Dashboard/Prescriptions";
import ChatSection from "./Patients/Dashboard/ChatSection";
import Notifications from "./Patients/Dashboard/Notifications";
import Account from "./Patients/Dashboard/Account";
import PatientAppointmentDetails from "../components/Appointments/PatientAppointmentDetails";
import PatientChat from "../components/Chats/PatientChat";

const PatientDashboardView = () => {
  return (
    <>
      <DashboardNavbar
        content={
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route
              path="/appointments/:appointmentId"
              element={<PatientAppointmentDetails />}
            />
            <Route path="/prescriptions" element={<Prescriptions />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<DashboardProfile />} />
            <Route path="/account" element={<Account />} />
            <Route path="*" element={<Error404Page />} />
          </Routes>
        }
      />
    </>
  );
};

export default PatientDashboardView;
