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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const DoctorPrescriptionDetails = () => {
  const { prescriptionId } = useParams();
  const token = useSelector((state) => state.auth.token);
  const [prescription, setPrescription] = useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchPrescriptionDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/prescriptions/${prescriptionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPrescription(response.data);
      } catch (error) {
        console.error("Failed to fetch appointment details:", error);
      }
    };

    fetchPrescriptionDetails();
  }, [setPrescription]);

  return (
    <>
      {!prescription.patient ? (
        <div className="relative flex min-h-[500px] justify-center items-center">
          <Box sx={{ display: "flex" }}>
            <CircularProgress color="inherit" />
          </Box>
        </div>
      ) : (
        <>
          <div className="flex justify-between">
            <Link to="/doctor-dashboard/prescriptions" className="flex items-center">
                <ChevronLeftIcon />
              </Link>
            <div className="text-2xl font-medium text-center my-5">
              Prescription Details
            </div>
            <div className="flex items-center gap-2">
                <Tooltip title="Edit">
                    <EditIcon className="cursor-pointer hover:text-indigo-600" />
                </Tooltip>
                <Tooltip title="Delete">
                    <DeleteIcon className="cursor-pointer hover:text-red-600" />
                </Tooltip>
            </div>
          </div>
          {prescription.prescription_image && (
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center", mb: 4 }}
            >
              <img
                src={`${prescription?.prescription_image}`}
                alt="Prescription Image"
                className="object-contain rounded-xl"
              />
            </Grid>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Patient Name"
                value={`${prescription?.patient.user.first_name} ${prescription?.patient.user.last_name}`}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Email"
                value={prescription?.patient.user.email}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Address"
                value={prescription?.patient.user.address}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Mobile Number"
                value={prescription?.patient.user.mobile_number}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Gender"
                value={prescription?.patient.user.gender}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Age"
                value={prescription?.patient.user.age}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Diagnosis"
                value={prescription?.diagnosis}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Dosage"
                value={prescription?.dosage}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Medication Details"
                value={prescription?.medication_details}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Date & Time"
                value={moment
                  .utc(prescription?.prescription_date)
                  .format("MMMM Do YYYY, h:mm a")}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Additional Notes"
                value={prescription?.additional_instructions}
                fullWidth
                readOnly
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default DoctorPrescriptionDetails;
