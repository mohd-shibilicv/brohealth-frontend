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
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/auth/reset-password/`,
        {
          email,
        },
      );
      
      setLoading(false)
      toast.success("Password reset confimation email has been sent!", {
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
      
    } catch (err) {
      if (err.response && err.response.data) {
        setLoading(false)
        console.log(err.response);
        setError(err.response.data.non_field_errors || "An error occurred.");
      } else {
        setLoading(false)
        console.log(err);
        setError("An error occurred.");
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
            Forgot Password
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 5, }}
            className="md:w-[500px]"
          >
            {error && (
              <p className="mx-auto flex justify-center bg-red-100 text-red-600 px-5 py-3 rounded">
                {error}
              </p>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-yellow-1000 rounded-full" role="status" aria-label="loading">
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <p>Send</p>
              )}
            </Button>
            <Grid container>
              <Grid item>
                <Link
                  to="/register"
                  className="hover:underline"
                  variant="body2"
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default ForgotPassword;
