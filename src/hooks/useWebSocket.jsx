import { useEffect, useState } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

export const useWebSocket = (url, token) => {
  const [client, setClient] = useState(null);

  useEffect(() => {
    const newClient = new W3CWebSocket(`${url}?token=${token}`);

    newClient.onopen = () => {
      console.log("WebSocket Client Connected");
    };

    newClient.onclose = () => {
      console.log("WebSocket Client Closed");
    };

    newClient.onerror = (error) => {
      console.log("WebSocket Client Error:", error);
    };

    setClient(newClient);

    return () => {
      newClient.close();
    };
  }, [url, token]);

  return { client };
};
