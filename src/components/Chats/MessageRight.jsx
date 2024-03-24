import React from "react";
import Avatar from "@mui/material/Avatar";
import { deepOrange } from "@mui/material/colors";

export const MessageRight = (props) => {
  const message = props.message ? props.message : "no message";
  const timestamp = props.timestamp ? props.timestamp : "";
  const photoURL = props.photoURL ? props.photoURL : "doctor2.jpg";
  const displayName = props.displayName ? props.displayName : "";

  // Regular expression to detect links
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Function to replace links with <a> tags
  const replaceLinks = (text) => {
    return text.replace(urlRegex, (match) => {
      return `<a href="${match}" target="_blank" rel="noopener noreferrer" style="color: red; border-bottom: 1px solid red;">${match}</a>`;
    });
  };

  // Apply link replacement to the message
  const messageWithLinks = replaceLinks(message);

  function formatMessageTimestamp(message_timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  }

  return (
    <div className="flex w-full justify-end items-start mb-2">
      <div className="mx-2 bg-black text-white px-3 py-2 rounded">
        <p className="text-xs">{displayName}</p>
        <div
          className="font-semibold text-md py-2"
          dangerouslySetInnerHTML={{ __html: messageWithLinks }}
        />
        <p className="text-xs text-gray-300">{formatMessageTimestamp(timestamp)}</p>
      </div>
      <Avatar
        sx={{
          color: "white",
          backgroundColor: "black",
          width: "40px",
          height: "40px",
          marginRight: "10px",
        }}
        alt={displayName}
        src={photoURL}
      />
    </div>
  );
};
