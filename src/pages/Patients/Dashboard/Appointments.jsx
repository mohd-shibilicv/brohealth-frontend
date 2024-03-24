import React from "react";
import PatientAppointments from "../../../components/Appointments/PatientAppointments";

const Appointments = () => {
  return (
    <>
      <div className="text-xl font-semibold mb-4 w-full text-center">
        My Appointments
      </div>
      <PatientAppointments />
    </>
  );
};

export default Appointments;
