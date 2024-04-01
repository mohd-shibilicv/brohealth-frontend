import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useSelector } from "react-redux";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
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
  Grid,
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
import jsPDF from "jspdf";
import { showSimpleToast } from "../../../utils/Toast";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledGridOverlay = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  "& .ant-empty-img-1": {
    fill: theme.palette.mode === "light" ? "#aeb8c2" : "#262626",
  },
  "& .ant-empty-img-2": {
    fill: theme.palette.mode === "light" ? "#f5f5f7" : "#595959",
  },
  "& .ant-empty-img-3": {
    fill: theme.palette.mode === "light" ? "#dce0e6" : "#434343",
  },
  "& .ant-empty-img-4": {
    fill: theme.palette.mode === "light" ? "#fff" : "#1c1c1c",
  },
  "& .ant-empty-img-5": {
    fillOpacity: theme.palette.mode === "light" ? "0.8" : "0.08",
    fill: theme.palette.mode === "light" ? "#f5f5f5" : "#fff",
  },
}));

function CustomNoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <svg
        style={{ flexShrink: 0 }}
        width="240"
        height="200"
        viewBox="0 0 184 152"
        aria-hidden
        focusable="false"
      >
        <g fill="none" fillRule="evenodd">
          <g transform="translate(24 31.67)">
            <ellipse
              className="ant-empty-img-5"
              cx="67.797"
              cy="106.89"
              rx="67.797"
              ry="12.668"
            />
            <path
              className="ant-empty-img-1"
              d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
            />
            <path
              className="ant-empty-img-2"
              d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
            />
            <path
              className="ant-empty-img-3"
              d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
            />
          </g>
          <path
            className="ant-empty-img-3"
            d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
          />
          <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
            <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
            <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
          </g>
        </g>
      </svg>
      <Box sx={{ mt: 1 }}>No Rows</Box>
    </StyledGridOverlay>
  );
}

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = React.useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [selectedPrescription, setSelectedPrescription] = React.useState(null);
  const token = useSelector((state) => state.auth.token);

  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    {
      field: "doctor",
      headerName: "Doctor",
      width: 250,
    },
    {
      field: "diagnosis",
      headerName: "Diagnosis",
      width: 200,
    },
    {
      field: "prescription_date",
      headerName: "Issued Date",
      type: "datetime",
      width: 250,
      valueFormatter: (params) =>
        moment.utc(params.value).format("MMMM Do YYYY"),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <div className="flex justify-center gap-3">
          <Tooltip title="View" placement="top">
            <VisibilityIcon
              className="hover:text-indigo-900 cursor-pointer"
              onClick={() => handleViewPrescription(params.row)}
            />
          </Tooltip>
          <Tooltip title="Delete" placement="top">
            <DeleteIcon
              className="hover:text-red-600 cursor-pointer"
              onClick={() => handleDeletePrescription(params.row)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleViewPrescription = async (prescription) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/prescriptions/${prescription.id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedPrescription(response.data);
      setOpenModal(true);
    } catch (error) {
      console.error("Failed to fetch prescription details:", error);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

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

  const handleDeletePrescription = async (prescription) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/prescriptions/${prescription.id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showSimpleToast("Deleted!");
      setPrescriptions(
        prescriptions.filter((item) => item.id !== prescription.id)
      );
    } catch (error) {
      console.error("Failed to delete the prescription:", error);
    }
  };

  const generatePDF = () => {
    setLoading(true);
    const doc = new jsPDF();

    // Add content to the PDF
    doc.setFontSize(18);
    doc.text("Prescription", 20, 20);

    doc.setFontSize(12);
    doc.text(
      `Patient: ${selectedPrescription.patient.user.first_name} ${selectedPrescription.patient.user.last_name}`,
      20,
      30
    );
    doc.text(
      `Doctor: ${selectedPrescription.doctor.user.first_name} ${selectedPrescription.doctor.user.last_name}`,
      20,
      40
    );
    doc.text(`Diagnosis: ${selectedPrescription.diagnosis}`, 20, 50);
    doc.text(`Medication Details: ${selectedPrescription.medication_details}`, 20, 60);
    doc.text(`Dosage: ${selectedPrescription.dosage}`, 20, 70);

    if (selectedPrescription.additionalInstructions) {
      doc.text(`Additional Instructions: ${selectedPrescription.additional_instructions}`, 20, 80);
    }

    // Save the PDF
    doc.save("prescription.pdf");
    setLoading(false);
    handleCloseModal();
  };

  const rows = Array.isArray(prescriptions)
    ? prescriptions.map((prescription) => ({
        id: prescription.id,
        doctor: `Dr. ${prescription.doctor.user.first_name} ${prescription.doctor.user.last_name}`,
        diagnosis: prescription.diagnosis,
        prescription_date: prescription.prescription_date,
      }))
    : [];

  return (
    <div className="flex flex-col w-full justify-center">
      <ToastContainer />
      <div className="text-xl font-medium text-center my-5">
        My Prescriptions
      </div>
      <Box sx={{ height: 500 }}>
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          pageSize={5}
          pageSizeOptions={[5, 10, 25, 100]}
          disableRowSelectionOnClick
          slots={{ noRowsOverlay: CustomNoRowsOverlay }}
          sx={{ "--DataGrid-overlayHeight": "300px" }}
          initialState={{
            sorting: {
              sortModel: [{ field: "id", sort: "desc" }],
            },
            toolbar: {
              showQuickFilter: true,
            },
          }}
        />
      </Box>
      {selectedPrescription && (
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Prescription Details</DialogTitle>
          <DialogContent>
            <TextField
              label="Doctor Name"
              value={`Dr. ${selectedPrescription?.doctor.user.first_name} ${selectedPrescription?.doctor.user.last_name}`}
              fullWidth
              readOnly
              sx={{ mb: 2, mt: 2 }}
            />
            {selectedPrescription?.prescription_image && (
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center", mb: 4 }}
              >
                <img
                  src={`${selectedPrescription?.prescription_image}`}
                  alt="Prescription Image"
                  className="object-contain rounded-xl"
                />
              </Grid>
            )}
            <TextField
              label="Email"
              value={selectedPrescription?.doctor.user.email}
              fullWidth
              readOnly
              sx={{ mb: 2 }}
            />
            <TextField
              label="Address"
              value={selectedPrescription?.doctor.user.address}
              fullWidth
              multiline
              rows={2}
              readOnly
              sx={{ mb: 2 }}
            />
            <TextField
              label="Mobile Number"
              value={selectedPrescription?.doctor.user.mobile_number}
              fullWidth
              readOnly
              sx={{ mb: 2 }}
            />
            <TextField
              label="Date"
              value={moment
                .utc(selectedPrescription?.prescription_date)
                .format("MMMM Do YYYY")}
              fullWidth
              readOnly
              sx={{ mb: 2 }}
            />
            <TextField
              label="Diagnosis"
              value={selectedPrescription?.diagnosis}
              fullWidth
              readOnly
              sx={{ mb: 2 }}
            />
            <TextField
              label="Dosage"
              value={selectedPrescription?.dosage}
              fullWidth
              readOnly
              sx={{ mb: 2 }}
            />
            <TextField
              label="Medication Details"
              value={selectedPrescription?.medication_details}
              fullWidth
              multiline
              rows={2}
              readOnly
              sx={{ mb: 2 }}
            />
            <TextField
              label="Additional Notes"
              value={selectedPrescription?.additional_instructions}
              fullWidth
              multiline
              rows={2}
              readOnly
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button color="inherit" onClick={handleCloseModal}>
              Close
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={generatePDF}
              disabled={loading}
            >
              Download
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default Prescriptions;
