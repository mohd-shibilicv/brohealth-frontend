import axios from "axios";
import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import authSlice from "../../store/slices/auth.js";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post(`${import.meta.env.VITE_APP_API_URL}/auth/login/`, {
        email,
        password,
      })
      .then((res) => {
        dispatch(authSlice.actions.setAccount(res.data.user));
        dispatch(
          authSlice.actions.setAuthTokens({
            token: res.data.access,
            refreshToken: res.data.refresh,
          })
        );
        if (res.data.user.role === "patient") {
          dispatch(authSlice.actions.setInfo(res.data.patient));
        } else if (res.data.user.role === "doctor") {
          dispatch(authSlice.actions.setInfo(res.data.doctor));
        } else if (res.data.user.role === "admin") {
          dispatch(authSlice.actions.setInfo(res.data.admin));
        }
        setLoading(false);
        navigate("/");
      })
      .catch((err) => {
        setLoading(false);
        setError(
          err.response.data.detail
            ? err.response.data.detail.toString()
            : "Invalid Credentials"
        );
      });
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
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
            Sign in
          </Typography>
          <div className="mx-auto flex flex-col gap-2 bg-green-100 px-5 py-3 mt-2 rounded border border-green-500">
            <h3 className="text-center text-lg border-b border-green-300">Test Credentials</h3>
            <p>Patient Email: <span className="text-green-600 m-2 rounded-sm py-2 px-1">patient@brohealth.com</span></p>
            <p>Patient Password: <span className="text-green-600 m-2 rounded-sm py-2 px-1">Plo90plo90p!</span></p>
            <div className="border-b border-green-300"></div>
            <p>Doctor Email: <span className="text-green-600 m-2 rounded-sm py-2 px-1">doctor@brohealth.com</span></p>
            <p>Doctor Password: <span className="text-green-600 m-2 rounded-sm py-2 px-1">Plo90plo90p!</span></p>
          </div>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                <p>Sign In</p>
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
            <div className="mt-2 hover:underline">
              <Link to="/forgot-password">{"Forgot password?"}</Link>
            </div>
          </Box>
        </Box>
      </Container>
    </>
  );
}
