import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Box,
  Paper,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { Link, NavLink, useLocation } from "react-router-dom";
import MedicationIcon from "@mui/icons-material/Medication";

const PatientRooms = () => {
  const token = useSelector((state) => state.auth.token);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_APP_API_BASE_URL
          }/appointments/appointment-rooms/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRooms(response.data.results);
      } catch (error) {
        console.error("Failed to fetch appointment rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="relative flex min-h-[500px] justify-center items-center">
          <Box sx={{ display: "flex" }}>
            <CircularProgress color="inherit" />
          </Box>
        </div>
      ) : (
        <Paper elevation={3} sx={{ overflow: "auto", height: "600px" }}>
          <div className="py-3 px-2 text-xl font-bold text-center flex flex-col justify-center items-center">
            <Link to="/"><MedicationIcon color="dark" fontSize="large" /></Link>
            Appointment Rooms
          </div>
          <List>
            {rooms.map((room) => (
              <NavLink key={room.id} to={`/chats/${room.id}`}>
                <div className="mb-2 mx-5 border border-black px-2 py-3 rounded hover:bg-black hover:text-white">
                  <p>{room.name}</p>
                </div>
              </NavLink>
            ))}
          </List>
        </Paper>
      )}
    </div>
  );
};

export default PatientRooms;
