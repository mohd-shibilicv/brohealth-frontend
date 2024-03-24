import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Modal, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showSimpleToast } from "../../utils/Toast";
import notificationsSlice from "../../store/slices/NotificationsSlice.js";

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

const PatientNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_APP_API_BASE_URL
          }/notifications/patient-notifications/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(
          notificationsSlice.actions.setNotifications(response.data.results)
        );
        setNotifications(response.data.results);
      } catch (error) {
        console.error("Error: ", error);
      }
    };
    fetchNotifications();
  }, [setNotifications, token]);

  const handleViewNotification = (notification) => {
    setSelectedNotification(notification);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleMarkAsReadOrUnread = async (notificationId) => {
    try {
      await axios.patch(
        `${
          import.meta.env.VITE_APP_API_BASE_URL
        }/notifications/patient-notifications/${notificationId}/`,
        { is_read: !selectedNotification.is_read },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n.id === notificationId
            ? { ...n, is_read: !selectedNotification.is_read }
            : n
        )
      );

      showSimpleToast("Updated the notification status!");

      setIsDialogOpen(false);
    } catch (error) {
      console.log(error.message);
      toast.error(`${error.message}`, {
        style: {
          background: "#000",
          color: "#fff",
        },
        position: "bottom-right",
        pauseOnHover: true,
        draggable: true,
        hideProgressBar: true,
      });
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_APP_API_BASE_URL
        }/notifications/patient-notifications/${notificationId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const new_notifications = setNotifications(
        notifications.filter(
          (notification) => notification.id !== notificationId
        )
      );
      dispatch(notificationsSlice.actions.setNotifications(new_notifications));

      showSimpleToast("The notification is deleted!");
    } catch (error) {
      console.log(error.message);
      toast.error(`${error.message}`, {
        style: {
          background: "#000",
          color: "#fff",
        },
        position: "bottom-right",
        pauseOnHover: true,
        draggable: true,
        hideProgressBar: true,
      });
    }
  };

  // Regular expression to detect links
  const urlRegex = /(http?:\/\/[^\s]+)/g;

  // Function to replace links with <a> tags
  const replaceLinks = (text) => {
    return text?.replace(urlRegex, (match) => {
      return `<a href="${match}" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline">${match}</a>`;
    });
  };

  // Apply link replacement to the message
  const messageWithLinks = replaceLinks(selectedNotification?.message);

  const renderIsReadCell = (params) => (
    <Button color={params.value ? "success" : "error"}>
      <span>{params.value ? "Read" : "Unread"}</span>
    </Button>
  );

  const formatDate = (timestamp) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return new Date(timestamp).toLocaleString(undefined, options);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "message", headerName: "Message", width: 300 },
    { field: "notification_type", headerName: "Notification Type", width: 150 },
    {
      field: "is_read",
      headerName: "Status",
      renderCell: renderIsReadCell,
      width: 150,
    },
    {
      field: "timestamp",
      headerName: "Created at",
      minWidth: 200,
      valueGetter: (params) => formatDate(params.value),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button onClick={() => handleViewNotification(params.row)}>
            <VisibilityIcon color="inherit" className="hover:text-indigo-700" />
          </button>
          {params.row.is_read && (
            <button onClick={() => handleDeleteNotification(params.row.id)}>
              <DeleteIcon color="inherit" className="hover:text-red-700" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex mx-auto h-full w-[1200px]">
      <ToastContainer />
      <DataGrid
        autoHeight
        rows={notifications}
        columns={columns}
        pageSize={10}
        checkboxSelection
        disableRowSelectionOnClick
        slots={{ noRowsOverlay: CustomNoRowsOverlay }}
        sx={{ "--DataGrid-overlayHeight": "300px" }}
      />
      <Dialog
        fullScreen
        open={isDialogOpen}
        onClose={handleCloseDialog}
        TransitionComponent={Transition}
      >
        <AppBar color="inherit" sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseDialog}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Notification Details
            </Typography>
            {selectedNotification && selectedNotification.is_read ? (
              <Button
                autoFocus
                color="inherit"
                onClick={() =>
                  handleMarkAsReadOrUnread(selectedNotification.id)
                }
              >
                Mark as Unread
              </Button>
            ) : (
              <Button
                autoFocus
                color="inherit"
                onClick={() =>
                  handleMarkAsReadOrUnread(selectedNotification.id)
                }
              >
                Mark as Read
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <List>
          <ListItemButton>
            <ListItemText
              primary="Notification Type"
              secondary={selectedNotification?.notification_type}
            />
          </ListItemButton>
          <Divider />
          <div
            className="m-5"
            dangerouslySetInnerHTML={{ __html: messageWithLinks }}
          />
          <Divider />
          <ListItemButton>
            <ListItemText
              primary="Created at"
              secondary={
                selectedNotification
                  ? formatDate(selectedNotification.timestamp)
                  : ""
              }
            />
          </ListItemButton>
        </List>
      </Dialog>
    </div>
  );
};

export default PatientNotifications;
