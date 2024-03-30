import React, { useEffect, useState } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Paper from "@mui/material/Paper";
import { MessageLeft } from "./MessageLeft";
import { MessageRight } from "./MessageRight";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import MedicationIcon from "@mui/icons-material/Medication";
import axios from "axios";
import { useWebSocket } from "../../hooks/useWebSocket";

const PatientChat = () => {
  const { roomId } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const websocket_url =
    window.protocol === "https"
      ? import.meta.env.VITE_APP_API_WEB_SOCKET_SECURE_BASE_URL
      : import.meta.env.VITE_APP_API_WEB_SOCKET_BASE_URL;

  const { client } = useWebSocket(`${websocket_url}/ws/chat/${roomId}`, token);

  useEffect(() => {
    if (client) {
      client.onmessage = (message) => {
        const parsedMessage = JSON.parse(message.data);
        setMessages((prevMessages) => [...prevMessages, parsedMessage.message]);
      };
    }
  }, [client]);

  // Fetch initial chat history and appointment name
  // useEffect(() => {
  //   const fetchInitialChatHistory = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${
  //           import.meta.env.VITE_APP_API_BASE_URL
  //         }/appointments/appointment-rooms/${roomId}/chats/`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       const parsedMessages = response.data.results.map((item) => {
  //         const messageObj = JSON.parse(item.message);
  //         return {
  //           ...messageObj,
  //           room: item.room,
  //           sender: messageObj.sender,
  //           timestamp: item.timestamp,
  //         };
  //       });
  //       setMessages(parsedMessages);
  //     } catch (error) {
  //       console.error("Failed to fetch initial chat history:", error);
  //     }
  //   };

  //   fetchInitialChatHistory();
  // }, [roomId, token]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (client) {
      client.send(JSON.stringify({ message: message }));
    }
    setMessage("");
  };

  return (
    <div
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <h2 className="text-2xl font-bold mb-4 border border-black p-2 text-black text-center rounded-xl mr-4">
        Chat Room
      </h2>
      <Paper
        id="style-1"
        sx={{
          width: "calc( 100% - 20px )",
          margin: 2,
          overflowY: "auto",
          height: "500px",
        }}
      >
        {messages.length === 0 && (
          <div className="w-full mx-auto flex flex-col justify-center items-center h-[500px]">
            <MedicationIcon color="dark" sx={{ fontSize: "80px", mb: 2 }} />
            <p className="text-4xl font-extrabold">BroHealth</p>
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index}>
            {msg.sender === "patient" ? (
              <MessageRight
                message={msg.content}
                timestamp={msg.timestamp}
                displayName=""
                avatarDisp={true}
              />
            ) : (
              <MessageLeft
                message={msg.content}
                timestamp={msg.timestamp}
                displayName=""
                avatarDisp={true}
              />
            )}
          </div>
        ))}
      </Paper>
      <form
        onSubmit={handleSendMessage}
        className="w-full flex gap-2"
        noValidate
        autoComplete="off"
      >
        <input
          aria-multiline
          id="standard-text"
          placeholder="Send a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-black outline-none px-2 py-3 rounded-lg placeholder:text-gray-700"
        />
        {message ? (
          <Button
            type="submit"
            variant="outlined"
            color="inherit"
            sx={{ marginLeft: 1 }}
          >
            <SendIcon />
          </Button>
        ) : (
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled
            sx={{ marginLeft: 1 }}
          >
            <SendIcon />
          </Button>
        )}
      </form>
    </div>
  );
};

export default PatientChat;
