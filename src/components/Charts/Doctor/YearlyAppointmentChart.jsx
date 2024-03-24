import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Box, CircularProgress } from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";

export default function YearlyAppointmentsChart({ setData }) {
  const [dataState, setDataState] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const token = useSelector((state) => state.auth.token);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_APP_API_BASE_URL
          }/doctors/yearly-appointments-and-revenue/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const modifiedData = response.data.map((item) => ({
          ...item,
          truncatedRevenue: Math.floor(item.revenue / 1000),
        }));
        setDataState(modifiedData);
        setData(modifiedData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setData]);

  if (isLoading) {
    return (
      <div className="relative flex min-h-[500px] justify-center items-center">
        <Box sx={{ display: "flex" }}>
          <CircularProgress color="inherit" />
        </Box>
      </div>
    );
  }

  if (dataState.length === 0) {
    return <div>No data available right now!</div>;
  }

  return (
    <BarChart
      width={1200}
      height={500}
      series={[
        {
          data: dataState.map(({ appointments_count }) => appointments_count),
          label: "Appointments",
          id: "appointments",
          color: "#000",
        },
        {
          data: dataState.map(({ truncatedRevenue }) => truncatedRevenue),
          label: "Revenue",
          id: "revenue",
          color: "#555",
          valueFormatter: ((value) => value && `${value},000`)
        },
      ]}
      xAxis={[
        {
          data: dataState.map(({ year }) => {
            return year;
          }),
          scaleType: "band",
        },
      ]}
    />
  );
}
