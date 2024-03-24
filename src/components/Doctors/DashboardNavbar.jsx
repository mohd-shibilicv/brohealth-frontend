import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import GroupIcon from "@mui/icons-material/Group";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import BadgeIcon from '@mui/icons-material/Badge';
import MedicationIcon from "@mui/icons-material/Medication";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import FormatListNumberedRtlIcon from "@mui/icons-material/FormatListNumberedRtl";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useLocation, useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import authSlice from "../../store/slices/auth";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function DashboardNavbar({ content }) {
  const theme = useTheme();
  const location = useLocation();
  const path = location.pathname;
  const [open, setOpen] = React.useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = React.useState(false);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(authSlice.actions.logout());
    navigate("/login");
  };

  const handleClickOpenLogoutDialog = () => {
    setOpenLogoutDialog(true);
  };

  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} color="inherit">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <div className="w-full flex justify-between items-center mr-5">
            <Link to="/">
              <div className="text-black-600 md:order-1 flex gap-1 items-center">
                <MedicationIcon color="dark" fontSize="large" />
                <p className="hidden md:block font-medium md:text-lg">BroHealth</p>
              </div>
            </Link>
            <Typography variant="h6" noWrap component="span" className="text-lg font-medium">
              Dr. {auth.account.first_name} {auth.account.last_name}
            </Typography>
            <Tooltip title="Log out" arrow>
              <IconButton
                aria-label="logout"
                color="inherit"
                onClick={handleClickOpenLogoutDialog}
              >
                <MeetingRoomIcon />
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon color="inherit" />
            ) : (
              <ChevronLeftIcon color="inherit" />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
              component={Link}
              to="/doctor-dashboard"
              selected={"/doctor-dashboard" === path}
            >
              <Tooltip title="Dashboard" placement="right-end">
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "black",
                  }}
                >
                  <DashboardIcon />
                </ListItemIcon>
              </Tooltip>
              <ListItemText
                primary="Dashobard"
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
              component={Link}
              to="/doctor-dashboard/appointments"
              selected={"/doctor-dashboard/appointments" === path}
            >
              <Tooltip title="Appointments" placement="right-end">
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "black",
                  }}
                >
                  <FormatListNumberedRtlIcon />
                </ListItemIcon>
              </Tooltip>
              <ListItemText
                primary="Appointments"
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
              component={Link}
              to="/doctor-dashboard/patients"
              selected={"/doctor-dashboard/patients" === path}
            >
              <Tooltip title="Patients" placement="right-end">
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "black",
                  }}
                >
                  <GroupIcon />
                </ListItemIcon>
              </Tooltip>
              <ListItemText
                primary="Patients"
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
              component={Link}
              to="/doctor-dashboard/prescriptions"
              selected={"/doctor-dashboard/prescriptions" === path}
            >
              <Tooltip title="Prescriptions" placement="right-end">
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "black",
                  }}
                >
                  <BadgeIcon />
                </ListItemIcon>
              </Tooltip>
              <ListItemText
                primary="Prescriptions"
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
              component={Link}
              to="/doctor-dashboard/notifications"
              selected={"/doctor-dashboard/notifications" === path}
            >
              <Tooltip title="Notifications" placement="right-end">
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "black",
                  }}
                >
                  <CircleNotificationsIcon />
                </ListItemIcon>
              </Tooltip>
              <ListItemText
                primary="Notifications"
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        {true && (
          <List>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
                component={Link}
                to="/doctor-dashboard/profile"
                selected={"/doctor-dashboard/profile" === path}
              >
                <Tooltip title="Profile" placement="right-end">
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: "black",
                    }}
                  >
                    <AccountBoxIcon />
                  </ListItemIcon>
                </Tooltip>
                <ListItemText
                  primary="Profile"
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
                component={Link}
                to="/doctor-dashboard/account"
                selected={"/doctor-dashboard/account" === path}
              >
                <Tooltip title="Account" placement="right-end">
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: "black",
                    }}
                  >
                    <ManageAccountsIcon />
                  </ListItemIcon>
                </Tooltip>
                <ListItemText
                  primary="Account"
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        )}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <ToastContainer />
        {content}
      </Box>
      <Dialog
        open={openLogoutDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseLogoutDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Confirm Logout"}</DialogTitle>
        <DialogContent>
          <DialogContentText
            color="default"
            id="alert-dialog-slide-description"
          >
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogoutDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="error">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
