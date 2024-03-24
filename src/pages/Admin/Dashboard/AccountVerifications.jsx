import axios from "axios";
import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Tooltip } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const columns = [
  { id: "verification_id", label: "ID", minWidth: 100 },
  { id: "doctor_id", label: "Doctor ID", minWidth: 100 },
  { id: "license_number", label: "License Number", minWidth: 150 },
  {
    id: "licensure_information",
    label: "Licensure Information",
    minWidth: 250,
    align: "center",
  },
  {
    id: "verification_status",
    label: "Status",
    minWidth: 100,
    align: "center",
  },
];

export default function AccountVerifications() {
  const token = useSelector((state) => state.auth.token);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_APP_API_BASE_URL
          }/doctors/api/account-verification/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLoading(false);
        setData(response.data.results);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [setData]);

  const deleteVerificationRecord = async (verificationId) => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_APP_API_BASE_URL
        }/admins/doctor-account-verification/${verificationId}/delete/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Record deleted!", {
        style: {
          background: "#000",
          color: "#fff",
        },
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: true,
      });
      setData(data.filter((item) => item.id !== verificationId));
    } catch (error) {
      console.error("Failed to delete verification:", error);
    }
  };

  const rows = Array.isArray(data)
    ? data.map((item, index) =>
        createData(
          item.id,
          item.doctor,
          item.license_number,
          item.licensure_information,
          item.verification_status,
          index
        )
      )
    : [];

  function createData(
    verification_id,
    doctor_id,
    license_number,
    licensure_information,
    verification_status,
    index
  ) {
    return {
      verification_id,
      doctor_id,
      license_number,
      licensure_information,
      verification_status,
      index,
    };
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      {loading ? (
        <>
          <div className="relative flex min-h-[500px] justify-center items-center">
            <Box sx={{ display: "flex" }}>
              <CircularProgress color="inherit" />
            </Box>
          </div>
        </>
      ) : (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <ToastContainer />
          <TableContainer sx={{ maxHeight: 540 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              {rows.length === 0 ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          padding: 2,
                        }}
                      >
                        <Typography variant="h6" color="black">
                          No verification requests found.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={index}
                        >
                          {columns.map((column) => {
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.id === "verification_status" ? (
                                  row[column.id] === "approved" ? (
                                    <p className="p-2 border-green-700 border rounded-lg text-green-700">
                                      Approved
                                    </p>
                                  ) : row[column.id] === "rejected" ? (
                                    <p className="p-2 border-red-700 border rounded-lg text-red-700">
                                      Rejected
                                    </p>
                                  ) : (
                                    <p className="p-2 border-yellow-700 border rounded-lg text-yellow-700">
                                      Pending
                                    </p>
                                  )
                                ) : (
                                  row[column.id]
                                )}
                              </TableCell>
                            );
                          })}
                          <TableCell align="center" xs={{ display: "flex" }}>
                            <div className="flex gap-3">
                              <Link to={`detail/${row.verification_id}`}>
                                <Tooltip title="view" placement="top">
                                  <VisibilityIcon className="cursor-pointer hover:text-blue-600" />
                                </Tooltip>
                              </Link>
                              <Tooltip title="delete" placement="top">
                                <CloseIcon
                                  className="hover:text-red-600 cursor-pointer"
                                  onClick={() =>
                                    deleteVerificationRecord(
                                      row.verification_id
                                    )
                                  }
                                />
                              </Tooltip>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              )}
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </>
  );
}
