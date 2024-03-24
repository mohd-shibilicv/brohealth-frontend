import React from "react";
import { Box } from "@mui/material";
import { Worker, Viewer, TextDirection } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { fullScreenPlugin } from "@react-pdf-viewer/full-screen";
import "@react-pdf-viewer/full-screen/lib/styles/index.css";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import "@react-pdf-viewer/zoom/lib/styles/index.css";

const PDFViewer = ({ file }) => {
  const fullScreenPluginInstance = fullScreenPlugin();
  const { EnterFullScreenButton } = fullScreenPluginInstance;

  const zoomPluginInstance = zoomPlugin();
  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;

  return (
    <>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js"></Worker>
      <div className="mb-4">
        <div
          style={{
            border: "1px solid rgba(0, 0, 0, 0.4)",
            borderRadius: "10px",
            height: "100%",
            width: "500px",
          }}
        >
          <div
            style={{
              alignItems: "center",
              backgroundColor: "#eeeeee",
              borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
              display: "flex",
              justifyContent: "center",
              padding: "4px",
              width: "100%",
            }}
          >
            <div>
              <EnterFullScreenButton />
            </div>
            <ZoomOutButton />
            <ZoomPopover />
            <ZoomInButton />
          </div>

          <div>
            <Viewer
              fileUrl={`${file}`}
              plugins={[fullScreenPluginInstance, zoomPluginInstance]}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PDFViewer;
