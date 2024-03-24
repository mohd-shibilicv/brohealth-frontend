import React, { useState } from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import useSWR from "swr";
import axiosService from "../../../services/axios.js";
import OverallAnalytics from "../../../components/Charts/Doctor/OverallAnalytics.jsx";
import axios from "axios";
import AppointmentChart from "../../../components/Charts/Doctor/AppointmentChart.jsx";
import DailyAppointmentChart from "../../../components/Charts/Doctor/DailyAppointmentChart.jsx";
import YearlyAppointmentsChart from "../../../components/Charts/Doctor/YearlyAppointmentChart.jsx";
import ToggleBarCharts from "../../../components/Charts/Doctor/ToggleBarCharts.jsx";

const DashboardPage = () => {
  const account = useSelector((state) => state.auth.account);
  const token = useSelector((state) => state.auth.token);
  const [counts, setCounts] = useState({
    patients: 0,
    apppointments_count: 0,
    revenue: 0,
  });
  const doctorName = `${account.first_name} ${account.last_name}`
  const [selectedChart, setSelectedChart] = useState("monthly");
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);

  const userId = account?.id;

  const { data: user } = useSWR(`/user/${userId}/`, (url) =>
    axiosService.get(url).then((res) => res.data)
  );

  React.useEffect(() => {
    const fetchUserRoleCounts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_BASE_URL}/doctors/user-role-counts/`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setCounts(response.data);
      } catch (error) {
        console.error("Failed to fetch UserRoleCounts: ", error);
      }
    };

    fetchUserRoleCounts();
  }, [user]);

  const handleChartSelection = (chartType) => {
    setSelectedChart(chartType);
  };

  return (
    <div className="w-full">
      {user ? (
        <div className="w-full h-full text-center items-center">
          <OverallAnalytics counts={counts} />
          <ToggleBarCharts
            selectedChart={selectedChart}
            onChartSelection={handleChartSelection}
            monthlyData={monthlyData}
            dailyData={dailyData}
            yearlyData={yearlyData}
            doctorName={doctorName}
          />
          {selectedChart === "monthly" && (
            <AppointmentChart setData={setMonthlyData} />
          )}
          {selectedChart === "daily" && (
            <DailyAppointmentChart setData={setDailyData} />
          )}
          {selectedChart === "yearly" && (
            <YearlyAppointmentsChart setData={setYearlyData} />
          )}
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
