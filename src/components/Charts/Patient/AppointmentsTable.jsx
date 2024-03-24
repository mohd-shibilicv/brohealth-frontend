import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment-timezone";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

export default function AppointmentsTable() {
  const [appointments, setAppointments] = React.useState([]);
  const token = useSelector((state) => state.auth.token);

  React.useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_BASE_URL}/appointments/?limit=5`,
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
  }, [token]);

  const rows = Array.isArray(appointments)
    ? appointments.map((appointment) => ({
        id: appointment.id,
        doctorName: `Dr. ${appointment.doctor.user.first_name} ${appointment.doctor.user.last_name}`,
        consultationType: appointment.consultation_type,
        dateAndTime: moment.utc(appointment.date_and_time).format("MMMM Do YYYY, h:mm a"),
        status: appointment.status,
        paid: appointment.paid,
      }))
    : [];

  return (
    <>
      <div className="text-xl font-semibold mb-3">Appointments</div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <caption>
            <Link to="/dashboard/appointments">
              <Button
                variant="contained"
                sx={{
                  color: "white",
                  backgroundColor: "black",
                  "&:hover": {
                    backgroundColor: "white",
                    color: "black",
                    borderColor: "black",
                  },
                }}
              >
                See all
              </Button>
            </Link>
          </caption>
          <TableHead>
            <TableRow>
              <StyledTableCell>Doctor</StyledTableCell>
              <StyledTableCell align="right">Consultation Type</StyledTableCell>
              <StyledTableCell align="right">Date & Time</StyledTableCell>
              <StyledTableCell align="right">Payment Status</StyledTableCell>
              <StyledTableCell align="right">Appointment Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell component="th" scope="row">
                  {row.doctorName}
                </StyledTableCell>
                <StyledTableCell align="right">{row.consultationType}</StyledTableCell>
                <StyledTableCell align="right">{row.dateAndTime}</StyledTableCell>
                <StyledTableCell align="right">{row.paid ? "Paid" : "Pending"}</StyledTableCell>
                <StyledTableCell align="right">{row.status}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
