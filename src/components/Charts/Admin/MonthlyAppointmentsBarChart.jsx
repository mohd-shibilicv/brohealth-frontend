import * as React from "react";
import Box from "@mui/material/Box";
import { BarChart } from "@mui/x-charts/BarChart";
import axios from "axios";
import { CircularProgress } from "@mui/material";

export default function MonthlyAppointmentsBarChart({ setData }) {
  const [dataState, setDataState] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_APP_API_BASE_URL
          }/admins/monthly-appointments-and-revenue/`
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
    <Box sx={{ width: "100%" }}>
      <BarChart
        height={500}
        series={[
          {
            data: dataState.map(({ appointments_count }) => appointments_count),
            label: "Appointments",
            id: "appointments",
            color: "#000",
            scaleY: {
              max:
                Math.max(
                  ...dataState.map(({ appointments_count }) => appointments_count)
                ) * 1.2,
            },
          },
          {
            data: dataState.map(({ truncatedRevenue }) => truncatedRevenue),
            label: "Revenue",
            id: "revenue",
            color: "#333",
            valueFormatter: ((value) => value && `${value},000`)
          },
        ]}
        xAxis={[
          {
            data: dataState.map(({ month }) =>
              new Date(month).toLocaleString("default", { month: "long" })
            ),
            scaleType: "band",
          },
        ]}
      />
    </Box>
  );
}
