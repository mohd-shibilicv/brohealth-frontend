import React from "react";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import MedicationIcon from "@mui/icons-material/Medication";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import DashboardPage from "../pages/Patients/Dashboard/DashboardPage";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const Navbar = () => {
  const auth = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const isPatient = auth?.account?.role === "patient";
  const isDoctor = auth?.account?.role === "doctor";
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const isAuthenticated = !!auth.account;

  return (
    <nav className="shadow shadow-gray-300 w-full px-8 md:px-auto">
      <div className="md:h-16 h-28 mx-auto md:px-4 container flex items-center justify-between flex-wrap md:flex-nowrap">
        {/* Logo */}
        <NavLink to="/">
          <div className="text-black-600 md:order-1 flex gap-1 items-center">
            <MedicationIcon color="dark" fontSize="large" />
            <p className="font-bold md:text-lg">BroHealth</p>
          </div>
        </NavLink>
        <div className="text-gray-500 order-3 w-full md:w-auto md:order-2">
          <ul className="flex font-semibold justify-between" id="header-nav">
            <li className="md:px-4 md:py-2">
              <NavLink to="/">Home</NavLink>
            </li>
            {!isDoctor && (
              <li className="md:px-4 md:py-2">
                <NavLink to="/doctors">Doctors</NavLink>
              </li>
            )}
            <li className="md:px-4 md:py-2">
              <NavLink to="/blogs">Blogs</NavLink>
            </li>
            <li className="md:px-4 md:py-2">
              <NavLink to="/about">About</NavLink>
            </li>
            <li className="md:px-4 md:py-2">
              <NavLink to="/contact">Contact</NavLink>
            </li>
          </ul>
        </div>
        <div className="order-2 md:order-3">
          {isAuthenticated ? (
            <div className="flex gap-4">
              {isPatient && (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <Tooltip title="Dashboard">
                      <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? "account-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                      >
                        <Avatar
                          alt={auth.account.first_name}
                          src={`${import.meta.env.VITE_APP_API_BASE_URL}${
                            auth.account.profile_picture
                          }`}
                        />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        "&::before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <MenuItem>
                      <Link to="/dashboard" className="flex items-center">
                        <Avatar /> Dashbaord
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        to="/dashboard/profile"
                        className="flex items-center"
                      >
                        <Avatar /> My account
                      </Link>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleClose}>
                      <Link
                        to="/dashboard/appointments"
                        className="flex items-center"
                      >
                        <ListItemIcon>
                          <PersonAdd fontSize="small" />
                        </ListItemIcon>
                        My Appointments
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <Link
                        to="/dashboard/account"
                        className="flex items-center"
                      >
                        <ListItemIcon>
                          <Settings fontSize="small" />
                        </ListItemIcon>
                        Settings
                      </Link>
                    </MenuItem>
                  </Menu>
                </>
              )}
              {isDoctor && (
                <>
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                  >
                    <Avatar
                      alt={auth.account.first_name}
                      src={`${import.meta.env.VITE_APP_API_BASE_URL}${
                        auth.account.profile_picture
                      }`}
                    />
                  </StyledBadge>
                </>
              )}
            </div>
          ) : (
            <NavLink to="/login">
              <button className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-gray-50 rounded-xl flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0  0  20  20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3  3a1  1  0  011  1v12a1  1  0  11-2  0V4a1  1  0  011-1zm7.707  3.293a1  1  0  010  1.414L9.414  9H17a1  1  0  110  2H9.414l1.293  1.293a1  1  0  01-1.414  1.414l-3-3a1  1  0  010-1.414l3-3a1  1  0  011.414  0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Login</span>
              </button>
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
