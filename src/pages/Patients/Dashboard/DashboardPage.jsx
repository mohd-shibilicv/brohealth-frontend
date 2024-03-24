import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import CircularProgress from "@mui/material/CircularProgress";
import authSlice from "../../../store/slices/auth.js";
import useSWR from "swr";
import axiosService from "../../../services/axios.js";
import AppointmentsTable from "../../../components/Charts/Patient/AppointmentsTable.jsx";
import PrescriptionsTable from "../../../components/Charts/Patient/PrescriptionsTable.jsx";

const DashboardPage = () => {
  const account = useSelector((state) => state.auth.account);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = account?.id;

  const { data: user } = useSWR(`/user/${userId}/`, (url) =>
    axiosService.get(url).then((res) => res.data)
  );

  return (
    <div className="w-full">
      {user ? (
        <div className="w-full h-full text-center items-center">
          <AppointmentsTable />
          <PrescriptionsTable />
        </div>
      ) : (
        <>
        <div className="relative flex min-h-[500px] justify-center items-center">
          <Box sx={{ display: "flex" }}>
            <CircularProgress color="inherit" />
          </Box>
        </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
