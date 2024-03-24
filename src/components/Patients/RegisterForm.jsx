import axios from "axios";
import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import authSlice from "../../store/slices/auth.js";
import "react-toastify/dist/ReactToastify.css";

function RegistrationForm() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Function to validate the form fields
  const validateInput = (fieldName, value) => {
    let errorMessage = "";

    switch (fieldName) {
      case "firstname":
        if (!value || !/^[a-zA-Z\s'-]+$/.test(value)) {
          errorMessage = "Please enter a valid firstname";
        }
        break;
      case "lastname":
        if (!value || !/^[a-zA-Z\s'-]+$/.test(value)) {
          errorMessage = "Please enter a valid lastname";
        }
        break;
      case "email":
        if (!value || !/\S+@\S+\.\S+/.test(value)) {
          errorMessage = "Please enter a valid email address";
        }
        break;
      case "password":
        if (!value || value.length < 8) {
          errorMessage = "Password must be at least 8 characters long";
        }
        break;
      case "confirm-password":
        if (value !== password) {
          errorMessage = "Passwords do not match";
        }
        break;
      default:
        break;
    }

    return errorMessage;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Update the individual state variables for each input field first
    switch (name) {
      case "firstname":
        setFirstname(value);
        break;
      case "lastname":
        setLastname(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirm-password":
        setConfirmPassword(value);
        break;
      default:
        break;
    }

    // Then validate the input and update the errors state
    const errorMessage = validateInput(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Reset errors before validation
    setErrors({});

    // Validate the form fields manually
    const validationErrors = {};
    if (!firstname.trim() || !/^[a-zA-Z\s'-]+$/.test(firstname)) {
      validationErrors.firstname = "Please enter a valid firstname";
    }
    if (!lastname.trim() || !/^[a-zA-Z\s'-]+$/.test(lastname)) {
      validationErrors.lastname = "Please enter a valid firstname";
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = "Please enter a valid email address";
    }
    if (!password || password.length < 8) {
      validationErrors.password =
        "Password must be at least  8 characters long";
    }
    if (password !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("role", "patient");
    formData.append("password", password);
    formData.append("confirm_password", confirmPassword);
    if (firstname) {
      formData.append("first_name", firstname);
    }
    if (lastname) {
      formData.append("last_name", lastname);
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/auth/register/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      toast.success("Registration successful!\n Activation email is sent!", {
        style: {
          background: "#000",
          color: "#fff",
        },
        position: "bottom-right",
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data) {
        const backendErrors = error.response.data;
        // Handle non-field errors
        if (backendErrors.non_field_errors) {
          backendErrors.non_field_errors.forEach((errorMsg) => {
            toast.error(errorMsg);
          });
        }
        // Handle field-specific errors
        setErrors((prevErrors) => ({
          ...prevErrors,
          ...backendErrors,
        }));
        setPassword("");
        setConfirmPassword("");
      } else {
        console.error(error);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <ToastContainer />
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h4">
          Sign up
        </Typography>
        <Link to="/register-doctor" className="mt-2">
          <Typography
            component="span"
            variant="subtitle1"
            className="hover:underline"
          >
            Are you a doctor?
          </Typography>
        </Link>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 3, }}
          className="md:w-[500px]"
        >
          <Grid container spacing={2} className="m-2 important">
            <Grid item xs={12} sm={6}>
              {errors.non_field_errors && (
                <p className="mx-auto flex justify-center bg-red-100 text-red-600 px-5 py-3 rounded">
                  {errors.non_field_errors.join(", ")}
                </p>
              )}
              <TextField
                autoComplete="given-name"
                name="firstname"
                fullWidth
                id="firstname"
                label="First Name"
                value={firstname}
                onChange={handleInputChange}
                error={!!errors["firstname"]}
                helperText={errors["firstname"]}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="lastname"
                label="Last Name"
                name="lastname"
                autoComplete="family-name"
                value={lastname}
                onChange={handleInputChange}
                error={!!errors.lastname}
                helperText={errors.lastname}
              />
            </Grid>
          </Grid>

          <Grid item xs={12} mt={2}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={handleInputChange}
              error={!!errors["email"]}
              helperText={errors["email"]}
            />
          </Grid>
          <Grid item xs={12} mt={2}>
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password}
            />
          </Grid>
          <Grid item xs={12} mt={2}>
            <TextField
              required
              fullWidth
              name="confirm-password"
              label="Confirm Password"
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={handleInputChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
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
              <p>Sign Up</p>
            )}
          </Button>
          <Grid container>
            <Grid item>
              <Link to="/login" className="hover:underline" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default RegistrationForm;
