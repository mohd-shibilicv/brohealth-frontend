import { Box, Button, CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DoctorDetailsTabs from "../components/Generals/DoctorDetailsTabs";

const DoctorDetailsPage = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchDoctorDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_BASE_URL}/doctors/${id}/`
        );
        setDoctor(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchDoctorDetails();
  }, [setDoctor]);

  return (
    <>
      {loading ? (
        <div className="relative flex min-h-[500px] justify-center items-center">
          <Box sx={{ display: "flex" }}>
            <CircularProgress color="inherit" />
          </Box>
        </div>
      ) : (
        <div className="container flex justify-center mx-auto h-full px-4 min-h-screen">
          <div className="w-full flex">
            <div className="w-2/3 flex justify-center mt-16">
              <DoctorDetailsTabs doctor={doctor} />
            </div>
            <div className="w-1/3 flex flex-col justify-center items-center">
              {doctor.user && (
                <>
                  <div>
                    <img
                      src={`${import.meta.env.VITE_APP_API_BASE_URL}${
                        doctor.user.profile_picture
                      }`}
                      alt={`${doctor.user.first_name} ${doctor.user.last_name}`}
                      className="w-full rounded-md"
                    />
                  </div>
                  <div className="px-4 my-5 text-center">
                    <p className="text-black text-2xl font-semibold">
                      Dr. {doctor.user.first_name} {doctor.user.last_name}
                    </p>
                    <p className="text-gray-900 font-semibold">
                      {doctor.specialization}
                    </p>
                    <p className="text-gray-900 font-semibold">
                      {doctor?.years_of_experience} years of experience
                    </p>
                  </div>
                </>
              )}
              <Link to={`/appointment/${id}`} state={{ doctor }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="inherit"
                  sx={{
                    mt: 1,
                    mb: 2,
                    color: "black",
                    backgroundColor: "#FFF",
                    borderColor: "black",
                    "&:hover": {
                      backgroundColor: "#000",
                      color: "white",
                    },
                  }}
                >
                  Schedule an Appointment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorDetailsPage;
