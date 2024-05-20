import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Button,
  TextField,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  MenuItem,
  Grid,
  Avatar,
  Typography,
  Container,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import authSlice from "../../../store/slices/auth.js";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  age: yup
    .number()
    .required("Age is required")
    .positive("Age must be a positive number")
    .integer("Age must be an integer")
    .max(120, "Age must be less than or equal to 120"),
  gender: yup.string().required("Gender is required"),
  address: yup.string().required("Address is required"),
  mobileNumber: yup
    .string()
    .required("Mobile number is required")
    .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),
});

const DashboardProfile = () => {
  const token = useSelector((state) => state.auth.token);
  const account = useSelector((state) => state.auth.account);
  const info = useSelector((state) => state.doctors.doctors[0]);

  const [open, setOpen] = useState(false);
  const [openUpdateForm, setopenUpdateForm] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: account?.email,
      firstName: account?.first_name,
      lastName: account?.last_name,
      age: account?.age,
      gender: account?.gender,
      address: account?.address,
      mobileNumber: account?.mobile_number,
    },
  });

  const handleClickOpenAndCloseDialog = () => {
    setOpen(!open);
  };

  const handleUpdateFormClickOpen = () => {
    setopenUpdateForm(true);
  };

  const handleUpdateFormClose = () => {
    setopenUpdateForm(false);
  };

  const handleDeactivateAccount = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_BASE_URL}/api/deactivate-account/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.warn("Account Deactivated!", {
          style: {
            background: "#000",
            color: "#fff",
          },
          position: "bottom-right",
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => {
          dispatch(authSlice.actions.logout());
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      toast.error(`${error.message}`, {
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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setProfilePicture(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("role", account.role);
    formData.append("first_name", data.firstName);
    formData.append("last_name", data.lastName);
    formData.append("age", data.age);
    formData.append("gender", data.gender);
    formData.append("address", data.address);
    formData.append("mobile_number", data.mobileNumber);
    if (profilePicture) {
      formData.append("profile_picture", profilePicture);
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/user/${account.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        dispatch(authSlice.actions.updateUserInfo(response.data));
        dispatch(authSlice.actions.setAccount(response.data));
        toast.success("Profile updated successfully!", {
          style: {
            background: "#000",
            color: "#fff",
          },
          position: "bottom-right",
          pauseOnHover: true,
          draggable: true,
        });
        handleUpdateFormClose();
      }
    } catch (error) {
      console.log(error);
      toast.error(`${error.message}`, {
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
    <Container maxWidth="md">
      <ToastContainer />
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        {account ? (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Avatar
                  src={`${account.profile_picture}`}
                  alt="Profile Picture"
                  sx={{ width: 128, height: 128, margin: "auto" }}
                />
                <Typography variant="h4" component="h1" sx={{ mt: 2, mb: 5 }}>
                  {account.first_name} {account.last_name}
                </Typography>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Email"
                    value={account.email}
                    fullWidth
                    readOnly
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="First Name"
                    value={account.first_name}
                    fullWidth
                    readOnly
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Last Name"
                    value={account.last_name}
                    fullWidth
                    readOnly
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Age"
                    value={account.age}
                    fullWidth
                    readOnly
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Gender"
                    value={account.gender}
                    fullWidth
                    readOnly
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Address"
                    value={account.address}
                    fullWidth
                    readOnly
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Mobile Number"
                    value={account.mobile_number}
                    fullWidth
                    readOnly
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Member Since"
                    value={account.date_joined}
                    fullWidth
                    readOnly
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Active"
                    value={account.is_active ? "True" : "False"}
                    fullWidth
                    readOnly
                    sx={{ mb: 2 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Specialization"
                    value={info?.specialization || ""}
                    fullWidth
                    readOnly
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Years of Experience"
                    value={info?.years_of_experience || ""}
                    fullWidth
                    readOnly
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Education"
                    value={info?.education || ""}
                    fullWidth
                    readOnly
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Clinic Address"
                    value={info?.clinic_address || ""}
                    fullWidth
                    readOnly
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Clinic Phone Number"
                    value={info?.clinic_phone_number || ""}
                    fullWidth
                    readOnly
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Clinic Website"
                    value={info?.clinic_website || ""}
                    fullWidth
                    readOnly
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Approved"
                    value={info?.is_approved ? "True" : "False"}
                    fullWidth
                    readOnly
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12} sx={{ textAlign: "center", mt: 4 }}>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleClickOpenAndCloseDialog}
                    startIcon={<DeleteIcon />}
                  >
                    Deactivate Account
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleUpdateFormClickOpen}
                    endIcon={<EditIcon />}
                  >
                    Update Details
                  </Button>
                </Stack>
              </Grid>
            </Grid>

            <Dialog
              open={open}
              TransitionComponent={Transition}
              keepMounted
              onClose={handleClickOpenAndCloseDialog}
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle>{"Confirm Account Deactivation"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  Are you sure you want to deactivate your account?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClickOpenAndCloseDialog}>Cancel</Button>
                <Button onClick={handleDeactivateAccount} color="error">
                  Deactivate
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog
              open={openUpdateForm}
              onClose={handleUpdateFormClose}
              PaperProps={{
                component: "form",
                onSubmit: handleSubmit(onSubmit),
              }}
            >
              <DialogTitle>Update Profile</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Update your profile details below:
                </DialogContentText>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="dense"
                      id="email"
                      label="Email Address"
                      type="email"
                      fullWidth
                      variant="outlined"
                      error={!!errors.email}
                      helperText={errors.email ? errors.email.message : ""}
                    />
                  )}
                />
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="dense"
                      id="firstName"
                      label="First Name"
                      type="text"
                      fullWidth
                      variant="outlined"
                      error={!!errors.firstName}
                      helperText={
                        errors.firstName ? errors.firstName.message : ""
                      }
                    />
                  )}
                />
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="dense"
                      id="lastName"
                      label="Last Name"
                      type="text"
                      fullWidth
                      variant="outlined"
                      error={!!errors.lastName}
                      helperText={
                        errors.lastName ? errors.lastName.message : ""
                      }
                    />
                  )}
                />
                <Controller
                  name="age"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="dense"
                      id="age"
                      label="Age"
                      type="number"
                      fullWidth
                      variant="outlined"
                      error={!!errors.age}
                      helperText={errors.age ? errors.age.message : ""}
                    />
                  )}
                />
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      margin="dense"
                      id="gender"
                      label="Gender"
                      fullWidth
                      variant="outlined"
                      error={!!errors.gender}
                      helperText={errors.gender ? errors.gender.message : ""}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </TextField>
                  )}
                />
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="dense"
                      id="address"
                      label="Address"
                      multiline
                      rows={3}
                      fullWidth
                      variant="outlined"
                      error={!!errors.address}
                      helperText={errors.address ? errors.address.message : ""}
                    />
                  )}
                />
                <Controller
                  name="mobileNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="dense"
                      id="mobileNumber"
                      label="Mobile Number"
                      type="text"
                      fullWidth
                      variant="outlined"
                      error={!!errors.mobileNumber}
                      helperText={
                        errors.mobileNumber ? errors.mobileNumber.message : ""
                      }
                    />
                  )}
                />
                <Grid item xs={12}>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="raised-button-file"
                    type="file"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="raised-button-file">
                    <Button
                      color="inherit"
                      className="w-full border"
                      variant="outlined"
                      component="span"
                      sx={{ mt: 2 }}
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload Profile Picture
                    </Button>
                  </label>
                </Grid>
                {previewUrl && (
                  <Grid
                    item
                    xs={12}
                    className="flex m-10 justify-center mx-auto"
                  >
                    <Avatar
                      alt="Profile Preview"
                      src={previewUrl}
                      sx={{ width: 100, height: 100, mt: 2 }}
                    />
                  </Grid>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleUpdateFormClose}>Cancel</Button>
                <Button type="submit">Update</Button>
              </DialogActions>
            </Dialog>
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "500px",
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default DashboardProfile;
