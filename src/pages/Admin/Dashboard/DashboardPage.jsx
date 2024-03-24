import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import authSlice from "../../../store/slices/auth.js";
import useSWR from "swr";
import axiosService from "../../../services/axios.js";
import BarAnimation from "../../../components/Charts/Admin/MonthlyAppointmentsBarChart.jsx";
import OverallAnalytics from "../../../components/Charts/Admin/OverallAnalytics.jsx";
import PieChartWithCustomizedLabel from "../../../components/Charts/Admin/PieChart.jsx";
import axios from "axios";
import DailyAppointmentsBarChart from "../../../components/Charts/Admin/DailyAppointmentsBarChart.jsx";
import YearlyAppointmentsBarChart from "../../../components/Charts/Admin/YearlyAppointmentsBarChart.jsx";
import ToggleBarCharts from "../../../components/Charts/Admin/ToggleBarCharts.jsx";
import MonthlyAppointmentsBarChart from "../../../components/Charts/Admin/MonthlyAppointmentsBarChart.jsx";

const DashboardPage = () => {
  const account = useSelector((state) => state.auth.account);
  const [counts, setCounts] = useState({
    patients: 0,
    doctors: 0,
    apppointments_count: 0,
    revenue: 0,
  });
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
          `${import.meta.env.VITE_APP_API_BASE_URL}/admins/user-role-counts/`
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
          />
          {selectedChart === "monthly" && (
            <MonthlyAppointmentsBarChart setData={setMonthlyData} />
          )}
          {selectedChart === "daily" && (
            <DailyAppointmentsBarChart setData={setDailyData} />
          )}
          {selectedChart === "yearly" && (
            <YearlyAppointmentsBarChart setData={setYearlyData} />
          )}
          <PieChartWithCustomizedLabel counts={counts} />
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
