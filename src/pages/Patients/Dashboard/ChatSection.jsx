import React, { useState, useEffect } from "react";
import { CircularProgress, Box, Grid } from "@mui/material";
import PatientRooms from "../../../components/Chats/PatientRooms";
import PatientChat from "../../../components/Chats/PatientChat";
import { useParams } from "react-router-dom";

const ChatSection = () => {
  const { roomId } = useParams();

  return (
    <div>
      <Grid container sx={{ mt: 2 }} spacing={2}>
        <Grid item xs={3}>
          <PatientRooms />
        </Grid>
        <Grid item xs={9}>
          {roomId ? <PatientChat /> : <NoRoomSelected />}
        </Grid>
      </Grid>
    </div>
  );
};

const NoRoomSelected = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="600px"
    border={1}
    borderColor="text.disabled"
    borderRadius={1}
    p={4}
  >
    <div className="flex justify-center items-center flex-col gap-2">
      <h2 className="text-xl font-semibold">No Room Selected</h2>
      <p className="text-sm">
        Please select a room from the list to start a conversation.
      </p>
    </div>
  </Box>
);

export default ChatSection;
