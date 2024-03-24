import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPasswordReset = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateInput = (fieldName, value) => {
    let errorMessage = "";

    switch (fieldName) {
      case "new-password":
        if (!value || value.length < 8) {
          errorMessage = "Password must be at least 8 characters long";
        }
        break;
      case "confirm-password":
        if (value !== newPassword) {
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

    switch (name) {
      case "new-password":
        setNewPassword(value);
        break;
      case "confirm-password":
        setConfirmPassword(value);
        break;
      default:
        break;
    }

    const errorMessage = validateInput(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage ? errorMessage : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setErrors({});

    const validationErrors = {};
    if (!newPassword || newPassword.length < 8) {
      validationErrors.newPassword =
        "Password must be at least  8 characters long";
    }
    if (newPassword !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_APP_API_URL
        }/auth/reset-password-confirm/${token}/`,
        {
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setLoading(false);
      toast.success("Successful password reset!", {
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
        if (backendErrors.non_field_errors) {
          backendErrors.non_field_errors.forEach((errorMsg) => {
            toast.error(errorMsg);
          });
        }
        if (backendErrors.new_password) {
          toast.error(backendErrors.new_password[0]);
        }
        if (backendErrors.confirm_password) {
          toast.error(backendErrors.confirm_password[0]);
        }
      } else {
        console.error(error);
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <>
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
            Reset Password
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 2, }}
            className="md:w-[500px]"
          >
            {errors.non_field_errors && (
              <p className="mx-auto flex justify-center bg-red-100 text-red-600 px-5 py-3 rounded">
                {errors.non_field_errors.join(", ")}
              </p>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="new-password"
              label="New Password"
              name="new-password"
              type="password"
              autoFocus
              value={newPassword}
              onChange={handleInputChange}
              error={!!errors["new-password"]}
              helperText={errors["new-password"]}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              type="password"
              id="confirm-password"
              label="Confirm Password"
              name="confirm-password"
              value={confirmPassword}
              onChange={handleInputChange}
              error={!!errors["confirm-password"]}
              helperText={errors["confirm-password"]}
            />
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
                <p>Reset</p>
              )}
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default ForgotPasswordReset;
