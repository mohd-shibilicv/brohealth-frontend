import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Box, Container, Typography, Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import PDFViewer from "../../../components/Admin/PDFViewer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerificationDetails = () => {
  const token = useSelector((state) => state.auth.token);
  const { verificationId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_APP_API_BASE_URL
          }/doctors/api/account-verification/${verificationId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        setError("Failed to load verification details.");
      }
    };

    fetchData();
  }, [verificationId, token]);

  const approveVerification = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${
          import.meta.env.VITE_APP_API_BASE_URL
        }/admins/doctor-account-verification/${verificationId}/approve/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200 || response.status === 204) {
        setLoading(false);
        toast.success("Doctor Verification Approved!", {
          style: {
            background: "#000",
            color: "#fff",
          },
          position: "bottom-right",
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => {
          navigate("/admin/verifications");
        }, 3000);
      }
    } catch (error) {
      setLoading(false);
      console.error("Failed to approve verification:", error);
      toast.error(`${error.message}`, {
        style: {
          background: "#000",
          color: "#fff",
        },
        position: "bottom-right",
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const rejectVerification = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${
          import.meta.env.VITE_APP_API_BASE_URL
        }/admins/doctor-account-verification/${verificationId}/reject/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Doctor Verification Rejected!", {
          style: {
            background: "#000",
            color: "#fff",
          },
          position: "bottom-right",
          pauseOnHover: true,
          draggable: true,
        });
        setLoading(false);
        navigate("/admin/verifications");
      }
    } catch (error) {
      setLoading(false);
      console.error("Failed to reject verification:", error);
      toast.error(`${error.message}`, {
        style: {
          background: "#000",
          color: "#fff",
        },
        position: "bottom-right",
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  if (!data) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "500px",
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "500px",
        }}
      >
        <Typography variant="h6">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container>
      <ToastContainer />
      <Box>
        <Typography
          variant="h5"
          component="div"
          className="text-center border-gray-500 mb-5"
        >
          Doctor Verification Details
        </Typography>
        <div className="flex flex-col justify-center items-center w-full">
          <div className="relative flex flex-col items-center rounded-[20px] w-[700px] max-w-[95%] mx-auto bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:!shadow-none p-3">
            <div className="flex justify-between w-full">
              <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500">
                <p className="text-sm text-gray-600">License Number</p>
                <p className="text-base font-medium text-navy-700">
                  {data.license_number}
                </p>
              </div>

              <div className="flexrounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500">
                <p className="text-sm text-gray-600">Verification Status</p>
                <p className="text-base font-medium text-navy-700">
                  {data.verification_status}
                </p>
              </div>
            </div>
            <div className="w-full flex flex-col items-start rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500">
              <p className="text-sm text-gray-600">Licensure Information</p>
              <p className="text-base font-medium text-navy-700">
                {data.licensure_information}
              </p>
            </div>
            <div className="px-3 py-2">
              <div className="w-full flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500">
                <div className="flex relative gap-2">
                  {data.certificates.map((certificate) => (
                    <Box flex key={certificate.id}>
                      {certificate.type === "image" && (
                        <img
                          src={certificate.file}
                          alt={`Certificate ${certificate.id}`}
                          className="rounded-lg"
                        />
                      )}
                    </Box>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-3 py-4">
              <div className="w-full flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500">
                {data.certificates.map((certificate) => (
                  <div
                    className="flex flex-col relative w-full"
                    key={certificate.id}
                  >
                    {certificate.type === "pdf" && (
                      <PDFViewer file={certificate.file} key={certificate.id} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto flex gap-3 justify-center items-center w-[500px]">
          {data.verification_status === "pending" && (
            <>
              <Button
                onClick={approveVerification}
                variant="outlined"
                color="success"
                fullWidth
              >
                {loading ? (
                  <>
                    <div
                      className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-yellow-1000 rounded-full"
                      role="status"
                      aria-label="loading"
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  </>
                ) : (
                  <>Approve</>
                )}
              </Button>
              {!loading && (
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  onClick={rejectVerification}
                >
                  {loading ? (
                    <>
                      <div
                        className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-yellow-1000 rounded-full"
                        role="status"
                        aria-label="loading"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </>
                  ) : (
                    <>Reject</>
                  )}
                </Button>
              )}
            </>
          )}
        </div>
      </Box>
    </Container>
  );
};

export default VerificationDetails;
