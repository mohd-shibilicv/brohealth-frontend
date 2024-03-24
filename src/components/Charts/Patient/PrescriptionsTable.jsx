import * as React from "react";
import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";
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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

export default function PrescriptionsTable() {
  const [prescriptions, setPrescriptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const token = useSelector((state) => state.auth.token);

  React.useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/prescriptions/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPrescriptions(response.data.results);
      } catch (error) {
        console.error("Failed to fetch prescriptions:", error);
      }
    };

    fetchPrescriptions();
  }, []);

  const rows = Array.isArray(prescriptions)
    ? prescriptions.map((prescription) => ({
        id: prescription.id,
        doctor: `Dr. ${prescription.doctor.user.first_name} ${prescription.doctor.user.last_name}`,
        diagnosis: prescription.diagnosis,
        medication_details: prescription.medication_details,
        prescription_date: prescription.prescription_date,
      }))
    : [];

  return (
    <>
      <div className="text-xl font-semibold mt-10 mb-3">Prescriptions</div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="caption table">
          <caption>
            <Link to="/dashboard/prescriptions">
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
              <StyledTableCell align="right">Diagnosis</StyledTableCell>
              <StyledTableCell align="right">Medical Details</StyledTableCell>
              <StyledTableCell align="right">Issued Date</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.doctor}
                </TableCell>
                <TableCell align="right">{row.diagnosis}</TableCell>
                <TableCell align="right">{row.medication_details}</TableCell>
                <TableCell align="right">{row.prescription_date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
