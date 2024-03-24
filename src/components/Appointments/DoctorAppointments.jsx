import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useSelector } from "react-redux";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import {
  CircularProgress,
  Tooltip,
  Modal,
  Backdrop,
  Fade,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Select from "@mui/material/Select";
import DialogActions from "@mui/material/DialogActions";
import moment from "moment-timezone";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = React.useState([]);
  const [selectedAppointment, setSelectedAppointment] = React.useState(null);
  const [status, setStatus] = React.useState("");
  const [openModal, setOpenModal] = React.useState(false);
  const token = useSelector((state) => state.auth.token);

  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    {
      field: "patientName",
      headerName: "Patient",
      width: 250,
    },
    {
      field: "consultationType",
      headerName: "Appointment Type",
      width: 200,
    },
    {
      field: "dateAndTime",
      headerName: "Date & Time",
      type: "datetime",
      width: 250,
      valueFormatter: (params) =>
        moment.utc(params.value).format("MMMM Do YYYY, h:mm:ss a"),
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <div className="flex justify-center items-center">
          {params.row.status === "pending" ? (
            <p className="p-2 rounded-lg bg-yellow-100 text-yellow-800">
              Pending
            </p>
          ) : params.row.status === "confirmed" ? (
            <p className="p-2 rounded-lg bg-indigo-100 text-indigo-800">
              Confirmed
            </p>
          ) : params.row.status === "completed" ? (
            <p className="p-2 rounded-lg bg-green-100 text-green-800">
              Completed
            </p>
          ) : (
            <p className="p-2 rounded-lg bg-red-100 text-red-800">Canceled</p>
          )}
        </div>
      ),
    },
    {
      field: "paid",
      headerName: "Paid",
      width: 100,
      minWidth: 50,
      renderCell: (params) => (
        <div className="flex justify-center items-center">
          {params.row.paid ? <>✅</> : <>❌</>}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <div className="flex justify-center gap-3">
          <Tooltip title="View" placement="left">
            <Link
              to={`/doctor-dashboard/appointments/${params.row.id}`}
              className="hover:text-indigo-900 cursor-pointer"
            >
              <VisibilityIcon />
            </Link>
          </Tooltip>
          {(params.row.status !== "canceled" && params.row.status !== "completed") && (
            <Tooltip title="Update Status" placement="right">
              <EditIcon
                className="hover:text-indigo-900 cursor-pointer"
                onClick={() => handleViewAppointmentStatus(params.row)}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  const handleViewAppointmentStatus = async (appointment) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE_URL}/appointments/${
          appointment.id
        }/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedAppointment(response.data);
      setOpenModal(true);
    } catch (error) {
      console.error("Failed to fetch appointment details:", error);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  React.useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_BASE_URL}/appointments/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAppointments(response.data.results);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const handleUpdateStatus = async () => {
    console.log(status);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_APP_API_BASE_URL}/appointments/${
          selectedAppointment.id
        }/`,
        {
          status: status,
          date_and_time: selectedAppointment.date_and_time,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (status === "confirmed") {
        const notificationData = {
          message: `Your appointment with Dr. ${
            selectedAppointment.doctor.user.first_name
          } ${selectedAppointment.doctor.user.last_name} on ${moment
            .utc(selectedAppointment.date_and_time)
            .format("MMMM Do YYYY, h:mm:ss a")} has been confirmed!`,
          notification_type: "APPOINTMENT",
          patient: selectedAppointment.patient.id,
          related_appointment: selectedAppointment.id,
        };

        await axios.post(
          `${
            import.meta.env.VITE_APP_API_BASE_URL
          }/notifications/patient-notifications/`,
          notificationData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      if (status === "canceled") {
        const notificationData = {
          message: `Your appointment with Dr. ${
            selectedAppointment.doctor.user.first_name
          } ${selectedAppointment.doctor.user.last_name} on ${moment
            .utc(selectedAppointment.date_and_time)
            .format("MMMM Do YYYY, h:mm:ss a")} has been canceled!`,
          notificaton_type: "APPOINTMENT",
          patient: selectedAppointment.patient.id,
          related_appointment: selectedAppointment.id,
        };

        await axios.post(
          `${
            import.meta.env.VITE_APP_API_BASE_URL
          }/notifications/patient-notifications/`,
          notificationData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      console.log("Status updated successfully:", response.data);
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === selectedAppointment.id
            ? response.data
            : appointment
        )
      );
      toast.success("Successfully updated the appointment status!", {
        style: {
          background: "#000",
          color: "#fff",
        },
        position: "bottom-right",
        pauseOnHover: true,
        draggable: true,
        hideProgressBar: true,
      });
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error(`${error}`, {
        style: {
          background: "#000",
          color: "#fff",
        },
        position: "bottom-right",
        pauseOnHover: true,
        draggable: true,
        hideProgressBar: true,
      });
    }

    // Close the modal
    handleCloseModal();
  };

  const rows = Array.isArray(appointments)
    ? appointments.map((appointment) => ({
        id: appointment.id,
        patientName: `${appointment.patient.user.first_name} ${appointment.patient.user.last_name}`,
        consultationType: appointment.consultation_type,
        dateAndTime: appointment.date_and_time,
        status: appointment.status,
        paid: appointment.paid,
      }))
    : [];

  return (
    <div className="flex w-full justify-center">
      <ToastContainer />
      <Box sx={{ height: 500 }}>
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          pageSize={5}
          pageSizeOptions={[5, 10, 25, 100]}
          disableRowSelectionOnClick
          initialState={{
            sorting: {
              sortModel: [{ field: "id", sort: "desc" }],
            },
          }}
        />
      </Box>
      {selectedAppointment &&
        (selectedAppointment.status !== "canceled" ||
          selectedAppointment.status !== "completed") && (
          <Dialog open={openModal} onClose={handleCloseModal}>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogContent>
              <TextField
                label="Patient Name"
                value={`${selectedAppointment?.patient.user.first_name} ${selectedAppointment?.patient.user.last_name}`}
                fullWidth
                readOnly
                sx={{ mb: 2, mt: 2 }}
              />
              <TextField
                label="Date & Time"
                value={moment
                  .utc(selectedAppointment?.date_and_time)
                  .format("MMMM Do YYYY, h:mm:ss a")}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
              <TextField
                label="Additional Notes"
                value={selectedAppointment?.additional_notes}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
              <TextField
                select
                label="Status"
                value={status || selectedAppointment?.status}
                fullWidth
                onChange={(e) => setStatus(e.target.value)}
                sx={{ mb: 2 }}
              >
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="canceled">Cancelled</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button onClick={handleUpdateStatus}>Save</Button>
            </DialogActions>
          </Dialog>
        )}
    </div>
  );
};

export default DoctorAppointments;
