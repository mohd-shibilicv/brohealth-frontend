import React, { useState } from "react";
import axios from "axios";
import {
  createPrescriptionStart,
  createPrescriptionSuccess,
  createPrescriptionFailure,
} from "../../store/slices/PrescriptionSlice";
import { useDispatch, useSelector } from "react-redux";
import { showSimpleToast } from "../../utils/Toast";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";

const PrescriptionForm = ({ appointment }) => {
  const [prescriptionImage, setPrescriptionImage] = useState(null);
  const [medicationDetails, setMedicationDetails] = useState("");
  const [dosage, setDosage] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [imageError, setImageError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    // Reset image error
    setImageError(null);

    // Check if the file is an image
    if (!file.type.startsWith("image/")) {
      setImageError("Please upload a valid image file");
      setPrescriptionImage(null);
      return;
    }

    // Check if the file size is within the desired limit (e.g., 5MB)
    const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxFileSize) {
      setImageError(
        `Image size should not exceed ${maxFileSize / (1024 * 1024)}MB`
      );
      setPrescriptionImage(null);
      return;
    }

    // If the file passes the validation, set it to the prescriptionImage state
    setPrescriptionImage(file);
  };

  const validateForm = () => {
    const errors = {};

    if (!diagnosis) {
      errors.diagnosis = "Diagnosis is required";
    }

    if (!medicationDetails) {
      errors.medicationDetails = "Medication Details are required";
    }

    if (!dosage) {
      errors.dosage = "Dosage is required";
    }

    return errors;
  };

  const checkPrescriptionExists = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/prescriptions/?appointmentId=${
          appointment.id
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.count > 0;
    } catch (error) {
      console.log("An error ocuured: ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset form errors
    setFormErrors({});

    // Perform form validation
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const prescriptionExists = await checkPrescriptionExists();
    if (prescriptionExists) {
      setError("A prescription for this appointment already exists.");
      return;
    }

    setLoading(true);
    setError(null);

    dispatch(createPrescriptionStart());

    const formData = new FormData();
    formData.append("patient", appointment.patient.id);
    formData.append("doctor", appointment.doctor.id);
    formData.append("appointment", appointment.id);
    formData.append("diagnosis", diagnosis);
    formData.append("medication_details", medicationDetails);
    formData.append("dosage", dosage);
    if (prescriptionImage) {
      formData.append("prescription_image", prescriptionImage);
    }
    if (additionalInstructions) {
      formData.append("additional_instructions", additionalInstructions);
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_BASE_URL}/appointments/create-prescription/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(createPrescriptionSuccess(response.data));
      showSimpleToast("Success!");
      setTimeout(() => {
        navigate(`/doctor-dashboard/appointments/${appointment.id}`);
      }, 1000);
    } catch (error) {
      dispatch(createPrescriptionFailure(error.message));
      setError(error.message);
      showSimpleToast("Failed!", type="error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="p-4 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
      <Typography
        variant="h5"
        component="h1"
        className="text-center"
        sx={{ mb: 4 }}
      >
        Create Prescription
      </Typography>
      <form onSubmit={handleSubmit}>
        {error && (
          <Typography
            color="error"
            className="text-center py-3 bg-red-100 rounded"
            sx={{ mb: 2 }}
          >
            {error}
          </Typography>
        )}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Patient"
              value={`${appointment.patient.user.first_name} ${appointment.patient.user.last_name}`}
              variant="outlined"
              fullWidth
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Doctor"
              value={`${appointment.doctor.user.first_name} ${appointment.doctor.user.last_name}`}
              variant="outlined"
              fullWidth
              readOnly
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Diagnosis *"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              variant="outlined"
              fullWidth
              error={!!formErrors.diagnosis}
              helperText={formErrors.diagnosis}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Medication Details *"
              value={medicationDetails}
              onChange={(e) => setMedicationDetails(e.target.value)}
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              error={!!formErrors.medicationDetails}
              helperText={formErrors.medicationDetails}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Dosage *"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              variant="outlined"
              fullWidth
              error={!!formErrors.dosage}
              helperText={formErrors.dosage}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Additional Instructions"
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
              variant="outlined"
              multiline
              rows={4}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Grid item xs={12}>
              <label className="w-full flex justify-center items-center border border-dotted border-black py-3 hover:border-indigo-600 hover:text-indigo-900 cursor-pointer">
                <CloudUploadIcon /> &nbsp;&nbsp;Upload Prescription Image
                <input type="file" onChange={handleImageUpload} hidden />
              </label>
            </Grid>
            {imageError && (
              <Typography
                color="error"
                className="text-center py-3 bg-red-100 rounded"
                sx={{ mt: 2, mb: 2 }}
              >
                {imageError}
              </Typography>
            )}
          </Grid>
          {prescriptionImage && (
            <Grid item xs={12}>
              <img
                src={URL.createObjectURL(prescriptionImage)}
                alt="Prescription"
                className="object-contain w-full h-[300px]"
              />
            </Grid>
          )}
          <Grid item xs={12} sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="outlined"
              color="inherit"
              fullWidth
              className="mt-4"
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
                <p>Create Prescription</p>
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default PrescriptionForm;
