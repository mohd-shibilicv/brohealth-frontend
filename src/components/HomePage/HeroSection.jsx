import React from "react";
import { Link } from "react-router-dom";
import HeroImage from "/edited.jpg";
import { useSelector } from "react-redux";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Paper from "@mui/material/Paper";
import Fade from "@mui/material/Fade";
import TrapFocus from "@mui/material/Unstable_TrapFocus";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const HeroSection = () => {
  const auth = useSelector((state) => state.auth);
  const isAuthenticated = !!auth.account;

  const isPatient = auth.account?.role === "patient";
  const isDoctor = auth.account?.role === "doctor";
  const isAdmin = auth.account?.role === "admin";
  const isDoctorApproved = auth.info?.is_approved

  const [bannerOpen, setBannerOpen] = React.useState(true);

  const closeBanner = () => {
    setBannerOpen(false);
  };

  return (
    <section className="relative bg-white text-black p-10 mt-10">
      {(isDoctor && !isDoctorApproved) && (
        <TrapFocus open disableAutoFocus disableEnforceFocus >
          <Fade appear={false} in={bannerOpen}>
            <Paper
              role="dialog"
              aria-modal="false"
              aria-label="Cookie banner"
              square
              variant="elevation"
              tabIndex={-1}
              sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                m: 0,
                p: 2,
                borderWidth: 0,
                borderTopWidth: 1,
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                gap={2}
              >
                <Box
                  sx={{
                    flexShrink: 1,
                    alignSelf: { xs: "flex-start", sm: "center" },
                  }}
                >
                  <Typography fontWeight="bold">
                    Your account is not yet verified!
                  </Typography>
                  <Typography variant="body2">
                    Follow the button to verify your account now
                  </Typography>
                </Box>
                <Stack
                  gap={2}
                  direction={{
                    xs: "row-reverse",
                    sm: "row",
                  }}
                  sx={{
                    flexShrink: 0,
                    alignSelf: { xs: "flex-end", sm: "center" },
                  }}
                >
                  <Link to="/doctor-dashboard/account">
                    <Button
                      size="small"
                      variant="contained"
                    >
                      Verify Account
                    </Button>
                  </Link>
                  <Button size="small" onClick={closeBanner}>
                    Not now
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Fade>
        </TrapFocus>
      )}
      <div className="hidden absolute md:flex items-center right-0 top-0 w-full h-full lg:w-1/2">
        <img
          className="object-contain rounded w-full h-full mx-auto lg:max-w-2xl"
          src={HeroImage}
          alt="Hero Image"
        />
      </div>
      <div className="relative lg:w-1/2 lg:pl-20 flex flex-col">
        <div className="text-5xl font-semibold text-gray-900 leading-none">
          Your trusted partner for online medical consultations.
        </div>
        <div className="mt-6 text-xl font-light text-true-gray-500 antialiased">
          Our platform is designed to simplify access to quality care.
        </div>

        {!isAuthenticated && (
          <Link to="/register">
            <button className="mt-6 px-8 py-4 border font-semibold rounded-full bg-gray-900 text-white hover:bg-white hover:text-black hover:border-black">
              Register for free
            </button>
          </Link>
        )}

        {isPatient && (
          <Link to="/dashboard">
            <button className="mt-6 px-8 py-4 border font-semibold rounded-full bg-gray-900 text-white hover:bg-white hover:text-black hover:border-black">
              Dashboard
            </button>
          </Link>
        )}
        {isDoctor && (
          <Link to="/doctor-dashboard">
            <button className="mt-6 px-8 py-4 border font-semibold rounded-full bg-gray-900 text-white hover:bg-white hover:text-black hover:border-black">
              Dashboard
            </button>
          </Link>
        )}
        {isAdmin && (
          <Link to="/admin">
            <button className="mt-6 px-8 py-4 border font-semibold rounded-full bg-gray-900 text-white hover:bg-white hover:text-black hover:border-black">
              Dashboard
            </button>
          </Link>
        )}
      </div>
      <div className="mt-12 lg:mt-32 lg:ml-20 text-left">
        <button
          type="button"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-cool-gray-100 text-gray-800 animate-bounce hover:text-gray-900 hover:bg-cool-gray-50 transition duration-300 ease-in-out cursor-pointer"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0  0  24  24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19  14l-7  7m0  0l-7-7m7  7V3"
            ></path>
          </svg>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
