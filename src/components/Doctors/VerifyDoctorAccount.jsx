import axios from 'axios';
import React, { useState } from "react";
import Slide from "@mui/material/Slide";
import MenuItem from "@mui/material/MenuItem";
import { Grid, Avatar } from "@mui/material";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import DropzoneComponent from "../FormComponents/DropZoneComponent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';

const VerifyDoctorAccount = () => {
  const token = useSelector((state) => state.auth.token)
  const userId = useSelector((state) => state.auth.info.id)
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licensureInformation, setLicensureInformation] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const navigate = useNavigate();

  const handleFilesChange = (files) => {
    setUploadedFiles(files);
  };

  const handleInputChange = (e) => {
    if (e.target.name === "license-number") {
      setLicenseNumber(e.target.value);
    } else if (e.target.name === "licesure-information") {
      setLicensureInformation(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)

    const formData = new FormData();
    formData.append("doctor", userId)
    formData.append("license_number", licenseNumber);
    formData.append("licensure_information", licensureInformation);

    // Append each file in the uploadedFiles array
    uploadedFiles.forEach((certificate, index) => {
      formData.append(`certificates[${index}]`, certificate);
    });

    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/doctors/api/account-verification/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false)
      toast.success("Verification request sent!", {
        style: {
          background: "#000",
          color: "#fff",
        },
        position: "bottom-right",
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => {
        navigate('/doctor-dashboard')
      }, 3000);
    } catch (error) {
      console.error(error.response);
      setLoading(false)
      setError(error.response?.data.detail ? error.response?.data.detail.toString() : error.response?.data.doctor[0])
      toast.error(error.message, {
        style: {
          background: "#000",
          color: "#fff",
        },
        position: "bottom-right",
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <ToastContainer />
        <Box
          sx={{
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Account Verification
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
            className="md:w-[500px]"
          >
            {error && (
              <p className="mx-auto flex justify-center bg-red-100 text-red-600 px-5 py-3 my-2 rounded">
                {error}
              </p>
            )}
            <TextField
              autoFocus
              margin="dense"
              id="license-number"
              name="license-number"
              label="Medical License Number"
              type="text"
              fullWidth
              variant="outlined"
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              id="licesure-information"
              name="licesure-information"
              label="Licensure Information"
              type="text"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              onChange={handleInputChange}
            />
            <Grid item xs={12}>
              <DropzoneComponent onFilesChange={handleFilesChange} />
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="outlined"
              sx={{
                mt: 3,
                mb: 2,
                color: "white",
                backgroundColor: "rgb(17  24  39 /  1)",
                borderColor: "black",
                "&:hover": {
                  backgroundColor: "rgb(17  24  39 / 0)",
                  borderColor: "black",
                  color: "black",
                },
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
                <p>Verify</p>
              )}
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default VerifyDoctorAccount;
