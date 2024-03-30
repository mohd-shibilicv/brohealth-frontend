import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import authSlice from "../../../store/slices/auth.js";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import MenuItem from "@mui/material/MenuItem";
import { Grid, Avatar } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DashboardProfile = () => {
  const token = useSelector((state) => state.auth.token);
  const account = useSelector((state) => state.auth.account);
  const info = useSelector((state) => state.auth.info);
  const user = useSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);
  const [openUpdateForm, setopenUpdateForm] = useState(false);
  const [email, setEmail] = useState(account.email);
  const [firstName, setFirstName] = useState(account.first_name);
  const [lastName, setLastName] = useState(account.last_name);
  const [dateOfBirth, setDateOfBirth] = useState(account.date_of_birth);
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState(account.address);
  const [mobileNumber, setMobileNumber] = useState(account.mobile_number);
  const [isVerified, setIsVerified] = useState(info?.is_verified);
  const [profilePicture, setProfilePicture] = useState(
    account.profile_picture
  );
  const [previewUrl, setPreviewUrl] = useState();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const genders = [
    {
      value: "Male",
      label: "Male",
    },
    {
      value: "Female",
      label: "Female",
    },
    {
      value: "Other",
      label: "Other",
    },
  ];

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

  const handleUpdateFormSubmit = async (e) => {
    e.preventDefault();

    const data = {
      user: user,
      spacialization: specialization,
      years_of_experience: years_of_experience,
      preferred_timezone: education,
      preferred_language: clinic_address,
      emergency_contact: clinic_phone_number,
      is_verified: isVerified,
    };
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/patient/${account.id}/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        dispatch(authSlice.actions.updateUserInfo(response.data));
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
    <div className="w-full">
      {account ? (
        <>
          <ToastContainer />
          <div className="w-full h-full flex justify-center text-center items-center">
            <Avatar
              src={`${
                account.profile_picture
              }`}
              alt="Profile Picture"
              className="h-32 w-32 rounded-xl"
            />
          </div>
          <div className="flex justify-evenly mt-10">
            <div>
              <h2 className="text-xl font-semibold">Personal Info</h2>
              <div>
                <p>
                  Email: <span>{account.email}</span>
                </p>
                <p>
                  First Name: <span>{account?.first_name}</span>
                </p>
                <p>
                  Last Name: <span>{account?.last_name}</span>
                </p>
                <p>
                  Date of Birth: <span>{account?.date_of_birth}</span>
                </p>
                <p>
                  gender: <span>{account?.gender}</span>
                </p>
                <p>
                  Address: <span>{account?.address}</span>
                </p>
                <p>
                  Mobile Number: <span>{account?.mobile_number}</span>
                </p>
                <p>
                  Member Since: <span>{account?.date_joined}</span>
                </p>
                <p>
                  Active:{" "}
                  <span>{account?.is_active ? "True" : "False"}</span>
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Additional Info</h2>
              <div>
                <p>
                  is_verified:{" "}
                  <span>{info?.is_verified ? "True" : "False"}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-10">
            <Stack direction="row" spacing={2}>
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
          </div>
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClickOpenAndCloseDialog}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>{"Confirm Account Deactivate"}</DialogTitle>
            <DialogContent>
              <DialogContentText
                color="default"
                id="alert-dialog-slide-description"
              >
                Are you sure you want to deactivate your account?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClickOpenAndCloseDialog} color="inherit">
                Cancel
              </Button>
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
              onSubmit: handleUpdateFormSubmit,
            }}
          >
            <DialogTitle>Update</DialogTitle>
            <DialogContent>
              <DialogContentText></DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="email"
                name="email"
                label="Email Address"
                type="email"
                fullWidth
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                autoFocus
                margin="dense"
                id="firstname"
                name="firstname"
                label="First Name"
                type="text"
                fullWidth
                variant="outlined"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                autoFocus
                margin="dense"
                id="lastname"
                name="lastname"
                label="Last Name"
                type="text"
                fullWidth
                variant="outlined"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                sx={{ mb: 2 }}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of Birth"
                  format="YYYY-MM-DD"
                  name="date-of-birth"
                  views={["year", "month", "day"]}
                  className="w-full mt-2"
                  disableFuture
                  sx={{ mb: 2 }}
                />
              </LocalizationProvider>
              <TextField
                id="outlined-select-gender"
                select
                label="Gender"
                className="w-full mt-2"
                value={gender || ""}
                onChange={(e) => setGender(e.target.value)}
                sx={{ mb: 2 }}
              >
                {genders.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                id="outlined-multiline-static"
                label="Address"
                multiline
                type="text"
                name="address"
                rows={3}
                className="w-full"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                autoFocus
                margin="dense"
                id="mobile-number"
                name="mobile-number"
                label="Mobile Number"
                type="number"
                fullWidth
                variant="outlined"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
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
                <Grid item xs={12} className="flex m-10 justify-center mx-auto">
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
        <>
          <div className="relative flex min-h-[500px] justify-center items-center">
            <Box sx={{ display: "flex" }}>
              <CircularProgress color="inherit" />
            </Box>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardProfile;
