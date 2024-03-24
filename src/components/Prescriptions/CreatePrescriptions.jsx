import React from "react";
import PrescriptionForm from "./PrescriptionForm";
import { useLocation } from "react-router-dom";

const CreatePrescriptions = () => {
  const location = useLocation();
  const appointment = location.state?.appointment;

  return (
    <>
      <PrescriptionForm appointment={appointment} />
    </>
  );
};

export default CreatePrescriptions;
