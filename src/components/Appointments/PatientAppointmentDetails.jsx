import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import moment from "moment-timezone";
import { Box, Button, CircularProgress, Grid, TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { showSimpleToast } from "../../utils/Toast";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DigitalClock } from "@mui/x-date-pickers/DigitalClock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import dayjs from "dayjs";
import QueryString from "query-string";

const shouldDisableTime = (value, view, selectedDate) => {
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const hour = value.hour();
  if (view === "hours") {
    const isToday =
      selectedDate &&
      new Date(selectedDate).toDateString() === currentDate.toDateString();
    if (isToday) {
      return hour < currentHour || hour >= 18
    } else {
      return hour < 9 || hour > 18;
    }
  }
  return false;
};

const PatientAppointmentDetails = () => {
  const { appointmentId } = useParams();
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState([]);
  const [openCancelModal, setOpenCancelModal] = React.useState(false);
  const [openRescheduleModal, setOpenRescheduleModal] = React.useState(false);
  const [openPaymentSuccessDialog, setOpenPaymentSuccessDialog] =
    useState(false);
  const [openPaymentCancelDialog, setOpenPaymentCancelDialog] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handlePaymentCloseSuccessDialog = () => {
    setOpenPaymentSuccessDialog(false);
    updateAppointmentPaymentStatus();
  };

  const handlePaymentCloseCancelDialog = () => {
    setOpenPaymentCancelDialog(false);
  };

  const handleClickOpenCancelModal = () => {
    setOpenCancelModal(true);
  };

  const handleCloseCancelModal = () => {
    setOpenCancelModal(false);
  };

  const handleClickOpenRescheduleModal = () => {
    setOpenRescheduleModal(true);
  };

  const handleCloseRescheduleModal = () => {
    setOpenRescheduleModal(false);
    setSelectedDate(null);
    setSelectedTime(null);
  };

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
        setAppointmentDetails(response.data);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      }
    };

    fetchAppointmentDetails();
  }, []);

  React.useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = QueryString.parse(location.search);

    if (query.success) {
      setOpenPaymentSuccessDialog(true);
    }

    if (query.canceled) {
      setOpenPaymentCancelDialog(true);
    }
  }, []);

  const updateAppointmentPaymentStatus = async () => {
    try {
      await axios.put(
        `${
          import.meta.env.VITE_APP_API_BASE_URL
        }/payments/${appointmentId}/update-payment-status/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAppointmentDetails((prevDetails) => ({
        ...prevDetails,
        paid: true,
      }));
    } catch (error) {
      console.error("Failed to update appointment payment status:", error);
    }
  };

  const handleCancelAppointment = async () => {
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_APP_API_BASE_URL
        }/appointments/${appointmentId}/cancel/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handleCloseCancelModal();
      showSimpleToast("The Appointment is canceled!");
      setTimeout(() => {
        navigate("/dashboard/appointments");
      }, 2000);
    } catch (error) {
      console.error("Failed to cancel the appointment:", error);
      handleCloseCancelModal();
    }
  };

  const handleDateSelect = (newValue) => {
    const selectedDate = dayjs(newValue).format("YYYY-MM-DD");
    setSelectedDate(selectedDate);
  };
  const handleTimeSelect = (newValue) => {
    const selectedTime = dayjs(newValue).format("HH:mm");
    setSelectedTime(selectedTime);
  };

  const handleRescheduleAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      return;
    }

    const formattedDateTime = `${selectedDate}T${selectedTime}:00Z`;
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_APP_API_BASE_URL
        }/appointments/${appointmentId}/reschedule/`,
        { date_and_time: formattedDateTime },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handleCloseRescheduleModal();
      showSimpleToast("The appointment date and time are updated!");
      setAppointmentDetails((prevDetails) => ({
        ...prevDetails,
        date_and_time: response.data.date_and_time,
      }));
    } catch (error) {
      console.error("Failed to reschedule the appointment:", error);
      showSimpleToast(error.message, (type = "error"));
      handleCloseRescheduleModal();
    }
  };

  return (
    <>
      {!appointmentDetails.doctor ? (
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
                label="Appointment Type"
                value={appointmentDetails.consultation_type}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Payment Status"
                value={appointmentDetails.paid ? "Paid" : "Pending"}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Appointment Status"
                value={appointmentDetails.status}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Date & Time"
                value={moment
                  .utc(appointmentDetails.date_and_time)
                  .format("MMMM Do YYYY, h:mm:ss a")}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
            </Grid>
            {appointmentDetails.additional_notes && (
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Additional Information"
                  value={appointmentDetails.additional_notes}
                  fullWidth
                  readOnly
                  sx={{ mb: 2 }}
                />
              </Grid>
            )}
          </Grid>

          <div className="text-xl font-medium text-center my-5">
            Doctor Details
          </div>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Doctor Name"
                value={`Dr. ${appointmentDetails.doctor.user.first_name} ${appointmentDetails.doctor.user.last_name}`}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Doctor Email"
                value={appointmentDetails.doctor.user.email}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Education"
                value={appointmentDetails.doctor.education}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Specialization"
                value={appointmentDetails.doctor.specialization}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Years of Experience"
                value={appointmentDetails.doctor.years_of_experience}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
          {appointmentDetails.status !== "canceled" &&
            appointmentDetails.status !== "completed" &&
            !appointmentDetails.paid && (
              <form
                action={`${
                  import.meta.env.VITE_APP_API_BASE_URL
                }/payments/stripe/create-checkout-session/?appointmentId=${
                  appointmentDetails.id
                }`}
                method="POST"
                className="mx-auto flex gap-2 justify-center max-w-2xl"
              >
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    mt: 3,
                    mb: 1,
                  }}
                >
                  {loading ? (
                    <div
                      className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-yellow-1000 rounded-full"
                      role="status"
                      aria-label="loading"
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    <p>Pay for the Appointment Now</p>
                  )}
                </Button>
              </form>
            )}
          {appointmentDetails.status !== "canceled" &&
            appointmentDetails.status !== "completed" && (
              <div className="mx-auto flex gap-2 justify-center max-w-2xl">
                {!appointmentDetails.paid && (
                  <Button
                    fullWidth
                    type="submit"
                    variant="outlined"
                    onClick={handleClickOpenCancelModal}
                    color="error"
                    sx={{
                      mt: 3,
                      mb: 2,
                    }}
                  >
                    {loading ? (
                      <div
                        className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-yellow-1000 rounded-full"
                        role="status"
                        aria-label="loading"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    ) : (
                      <p>Cancel Appointment</p>
                    )}
                  </Button>
                )}
                <Button
                  fullWidth
                  type="submit"
                  variant="outlined"
                  onClick={handleClickOpenRescheduleModal}
                  sx={{
                    mt: 3,
                    mb: 2,
                  }}
                >
                  {loading ? (
                    <div
                      className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-yellow-1000 rounded-full"
                      role="status"
                      aria-label="loading"
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    <p>Reshedule Appointment</p>
                  )}
                </Button>
              </div>
            )}
          <Dialog
            open={openCancelModal}
            onClose={handleCloseCancelModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Cancel this appointment?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to cancel this appointment?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button color="inherit" onClick={handleCloseCancelModal}>
                Cancel
              </Button>
              <Button color="error" onClick={handleCancelAppointment} autoFocus>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={openRescheduleModal}
            onClose={handleCloseRescheduleModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Reschedule this appointment?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Select a new date and time for the appointment:
              </DialogContentText>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date"
                  format="YYYY-MM-DD"
                  name="date"
                  views={["year", "month", "day"]}
                  className="w-full mt-2"
                  disablePast
                  value={selectedDate}
                  onChange={handleDateSelect}
                  sx={{ my: 2 }}
                />
                <DigitalClock
                  skipDisabled
                  timeStep={60}
                  label="Time Slot"
                  name="timeSlot"
                  ampm={false}
                  onChange={handleTimeSelect}
                  sx={{ mb: 2 }}
                  shouldDisableTime={(value, view) =>
                    shouldDisableTime(value, view, selectedDate)
                  }
                />
              </LocalizationProvider>
            </DialogContent>
            <DialogActions>
              <Button color="inherit" onClick={handleCloseRescheduleModal}>
                Cancel
              </Button>
              <Button
                color="primary"
                onClick={handleRescheduleAppointment}
                autoFocus
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>

          {/* Success Dialog */}
          <Dialog
            open={openPaymentSuccessDialog}
            onClose={handlePaymentCloseSuccessDialog}
            aria-labelledby="success-dialog-title"
            aria-describedby="success-dialog-description"
            className="rounded-xl"
          >
            <DialogTitle
              className="mx-auto flex flex-col items-center justify-center"
              id="success-dialog-title"
            >
              <div>
                <CheckCircleIcon sx={{ width: 100, height: 100 }} />
              </div>
              Appointment Payment Success
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="success-dialog-description">
                Your appointment payment was successful.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handlePaymentCloseSuccessDialog}
                color="inherit"
                autoFocus
              >
                OK
              </Button>
            </DialogActions>
          </Dialog>

          {/* Cancel Dialog */}
          <Dialog
            open={openPaymentCancelDialog}
            onClose={handlePaymentCloseCancelDialog}
            aria-labelledby="cancel-dialog-title"
            aria-describedby="cancel-dialog-description"
          >
            <DialogTitle
              className="mx-auto flex flex-col items-center justify-center"
              id="success-dialog-title"
            >
              <div>
                <ClearOutlinedIcon sx={{ width: 100, height: 100 }} />
              </div>
              Appointment Payment Canceled
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="cancel-dialog-description">
                Your appointment payment was canceled.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handlePaymentCloseCancelDialog}
                color="inherit"
                autoFocus
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
};

export default PatientAppointmentDetails;
