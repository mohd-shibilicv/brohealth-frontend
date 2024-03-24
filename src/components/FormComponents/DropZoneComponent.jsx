import React, { useCallback, useEffect, useMemo, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDropzone } from "react-dropzone";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { Tooltip } from "@mui/material";

const baseStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  marginTop: "20px",
  marginBottom: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#333",
  borderStyle: "dashed",
  backgroundColor: "#fff",
  color: "#333",
  cursor: "pointer",
  transition: "border .3s ease-in-out",
};

const activeStyle = {
  borderColor: "#000",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

function DropzoneComponent(props) {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((previousFiles) => [
      ...previousFiles,
      ...acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ),
    ]);
    props.onFilesChange(acceptedFiles);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    fileRejections,
  } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "application/pdf": [],
    },
    maxFiles: 5,
    maxSize: 1024 * 2000,
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  const removeFile = (name) => {
    setFiles((files) => {
      const updatedFiles = files.filter((file) => file.name !== name);
      props.onFilesChange(updatedFiles);
      return updatedFiles;
    });
  };

  const thumbs = files.map((file) => (
    <div key={file.name}>
      {file.type === "image/jpeg" && (
        <div className="relative w-full">
          <img className="rounded-xl" src={file.preview} alt={file.name} />
          <Tooltip title="Remove">
            <RemoveCircleOutlineIcon
              onClick={() => removeFile(file.name)}
              className="cursor-pointer absolute top-0 right-0"
            />
          </Tooltip>
        </div>
      )}
      {file.type === "image/png" && (
        <div className="relative w-full">
          <img className="rounded-xl" src={file.preview} alt={file.name} />
          <Tooltip title="Remove">
            <RemoveCircleOutlineIcon
              onClick={() => removeFile(file.name)}
              className="cursor-pointer absolute top-0 right-0"
            />
          </Tooltip>
        </div>
      )}
    </div>
  ));
  const pdfs = files.map((file) => (
    <div key={file.name}>
      {file.type === "application/pdf" && (
        <>
          <div className="flex justify-between items-center min-w-[500px] cursor-pointer p-2 rounded-lg bg-white border border-black">
            {file.name}
            <Tooltip title="Remove">
              <RemoveCircleOutlineIcon onClick={() => removeFile(file.name)} />
            </Tooltip>
          </div>
        </>
      )}
    </div>
  ));

  // clean up
  useEffect(
    () => () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <section>
      <div {...getRootProps({ style })}>
        {fileRejections.length > 0 && (
          <div className="text-red-500 text-pretty">
            {fileRejections.map(({ file, errors }, index) => (
              <div key={index}>
                {file.name} - {errors[0].message}
              </div>
            ))}
          </div>
        )}
        <input {...getInputProps()} />
        <CloudUploadIcon />
        <div>Drag and drop your certificates here.</div>
      </div>
      <aside className="flex gap-2 my-2">{thumbs}</aside>
      <aside className="flex gap-2 my-2 flex-wrap">{pdfs}</aside>
    </section>
  );
}

export default DropzoneComponent;
