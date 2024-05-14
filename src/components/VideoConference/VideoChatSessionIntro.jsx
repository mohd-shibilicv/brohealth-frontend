import React, { useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { ZegoSuperBoardManager } from "zego-superboard-web";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Box, CircularProgress } from "@mui/material";

function randomID(len) {
  let result = "";
  if (result) return result;
  var chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

export default function VideoChatSessionIntro() {
  const [appointment, setAppointment] = useState([]);
  const { roomId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const appointmentId = searchParams.get("appointmentId");
  const token = useSelector((state) => state.auth.token);
  const account = useSelector((state) => state.auth.account);
  const isDoctor = account?.role === "doctor";
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_APP_API_BASE_URL
          }/appointments/${appointmentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAppointment(response.data);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      }
    };

    fetchAppointmentDetails();
  }, [setAppointment]);

  const handleLeaveRoom = () => {
    navigate(`/`);
  };

  const formatRoomId = (roomId) => {
    const lowercaseRoomId = roomId.toLowerCase();

    const formattedRoomId = lowercaseRoomId.replace(/\s+/g, "-");

    return formattedRoomId;
  };

  const formattedRoomId = formatRoomId(roomId);

  const doctorMeeting = async (element) => {
    const appID = import.meta.env.VITE_APP_ZEGOCLOUD_APP_ID;
    const serverSecret = `${import.meta.env.VITE_APP_ZEGOCLOUD_SERVER_SECRET}`;
    const userID = `${account.id}`;
    const userName = `${account.first_name} ${account.last_name}`;
    const youServerUrl = `${
      import.meta.env.VITE_APP_API_BASE_URL
    }/appointments/room_access_token`;

    fetch(
      `${youServerUrl}?appID=${appID}&serverSecret=${serverSecret}&userID=${userID}`,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then(({ token }) => {
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
          appID,
          token,
          formattedRoomId,
          userID,
          userName
        );
        const zp = ZegoUIKitPrebuilt.create(kitToken);

        // start the call
        zp.joinRoom({
          container: element,
          sharedLinks: [
            {
              name: "Appointment link",
              url:
                window.location.origin +
                window.location.pathname +
                "?appointmentId=" +
                appointmentId,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          screenSharingConfig: {
            resolution: ZegoUIKitPrebuilt.ScreenSharingResolution_720P,
          },
          maxUsers: 2,
          videoResolutionList: [
            ZegoUIKitPrebuilt.VideoResolution_360P,
            ZegoUIKitPrebuilt.VideoResolution_180P,
            ZegoUIKitPrebuilt.VideoResolution_480P,
            ZegoUIKitPrebuilt.VideoResolution_720P,
          ],
          videoResolutionDefault: ZegoUIKitPrebuilt.VideoResolution_360P,
          whiteboardConfig: {
            showAddImageButton: true,
          },
          preJoinViewConfig: {
            title: "Start the Consultation",
          },
          showRoomTimer: true,
          showLeavingView: false,
          onLeaveRoom: handleLeaveRoom,
        });
        zp.addPlugins({ ZegoSuperBoardManager });
      })
      .catch((error) => {
        console.error("Error fetching token or joining room:", error);
      });
  };

  return (
    <>
      {!appointment.doctor ? (
        <div className="relative flex min-h-[500px] justify-center items-center">
          <Box sx={{ display: "flex" }}>
            <CircularProgress color="inherit" />
          </Box>
        </div>
      ) : (
        <div
          className="myCallContainer flex justify-center items-center mx-auto min-h-screen w-full"
          ref={doctorMeeting}
        ></div>
      )}
    </>
  );
}
