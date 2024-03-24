import React, { useCallback, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import moment from "moment-timezone";
import {
  CircularProgress,
  Tooltip,
  Modal,
  Backdrop,
  Fade,
  Button,
  TextField,
  MenuItem,
  Box,
  Grid,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";

const DoctorAppointmentDetails = () => {
  const { appointmentId } = useParams();
  const token = useSelector((state) => state.auth.token);
  const [appointment, setAppointment] = useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_APP_API_BASE_URL
          }/appointments/${appointmentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAppointment(response.data);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      }
    };

    fetchAppointmentDetails();
  }, [setAppointment]);

  const handleJoinRoom = useCallback(async () => {
    const roomCode = `${appointment?.doctor.user.first_name}-${appointment?.patient.user.last_name}`;
    const url = `${window.location.origin}/consultation/${roomCode}?appointmentId=${appointmentId}`;
    window.open(url, "_blank");
    // Define the email payload
    const emailPayload = {
      appointment_id: appointment?.id,
      patient_id: appointment?.patient.id,
      doctor_id: appointment?.doctor.id,
      room_url: url,
    };

    try {
      // Send the email
      await axios.post(
        `${
          import.meta.env.VITE_APP_API_BASE_URL
        }/appointments/send_session_email`,
        emailPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }, [navigate, appointment]);

  return (
    <>
      {!appointment.patient ? (
        <div className="relative flex min-h-[500px] justify-center items-center">
          <Box sx={{ display: "flex" }}>
            <CircularProgress color="inherit" />
          </Box>
        </div>
      ) : (
        <>
          <div className="text-xl font-medium text-center my-5">
            Appointment Details
          </div>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Patient Name"
                value={`${appointment?.patient.user.first_name} ${appointment?.patient.user.last_name}`}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Email"
                value={appointment?.patient.user.email}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Address"
                value={appointment?.patient.user.address}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Mobile Number"
                value={appointment?.patient.user.mobile_number}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Gender"
                value={appointment?.patient.user.gender}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Age"
                value={appointment?.patient.user.age}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Medical History"
                value={appointment?.patient.medical_history}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Prescriptions"
                value={appointment?.patient.prescription}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Date & Time"
                value={moment
                  .utc(appointment?.date_and_time)
                  .format("MMMM Do YYYY, h:mm:ss a")}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Additional Notes"
                value={appointment?.additional_notes}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Payment Status"
                value={appointment.paid ? "Paid" : "Pending"}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Status"
                value={appointment?.status}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              ></TextField>
            </Grid>
            {appointment.paid && appointment.status === "confirmed" && (
              <Grid item xs={12}>
                <Link to="/chats">
                  <Button
                    fullWidth
                    color="success"
                    variant="outlined"
                    sx={{
                      mb: 2,
                    }}
                  >
                    Chat with {appointment.patient.user.first_name}{" "}
                    {appointment.patient.user.last_name}
                  </Button>
                </Link>
                <Button
                  fullWidth
                  color="inherit"
                  variant="outlined"
                  onClick={handleJoinRoom}
                  sx={{
                    color: "black",
                    backgroundColor: "rgb(17  24  39 /  0)",
                    borderColor: "black",
                    "&:hover": {
                      backgroundColor: "rgb(17  24  39 / 1)",
                      borderColor: "black",
                      color: "white",
                    },
                  }}
                >
                  Start the session
                </Button>
              </Grid>
            )}
            {appointment.status === "completed" && (
              <Grid item xs={12}>
                <Link
                  to="/doctor-dashboard/prescriptions/create"
                  state={{ appointment: appointment }}
                >
                  <Button
                    fullWidth
                    color="inherit"
                    variant="outlined"
                    sx={{
                      color: "black",
                      backgroundColor: "rgb(17  24  39 /  0)",
                      borderColor: "black",
                      "&:hover": {
                        backgroundColor: "rgb(17  24  39 / 1)",
                        borderColor: "black",
                        color: "white",
                      },
                    }}
                  >
                    Create Prescription
                  </Button>
                </Link>
              </Grid>
            )}
          </Grid>
        </>
      )}
    </>
  );
};

export default DoctorAppointmentDetails;
