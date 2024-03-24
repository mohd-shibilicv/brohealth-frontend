import * as React from "react";

import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

const sizing = {
  margin: { right: 10 },
  width: 500,
  height: 200,
};

export default function PieChartWithCustomizedLabel({ counts }) {
  const data = [
    { label: "Patients", value: counts.patients, color: "#000" },
    { label: "Doctors", value: counts.doctors, color: "#333" },
  ];

  const TOTAL = data.map((item) => item.value).reduce((a, b) => a + b, 0);

  const getArcLabel = (params) => {
    const percent = params.value / TOTAL;
    return `${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div className="w-full flex mt-10 justify-center items-center border border-black py-10 rounded-sm">
      <div className="">
        <PieChart
          series={[
            {
              outerRadius: 100,
              data,
              arcLabel: getArcLabel,
            },
          ]}
          slotProps={{
            legend: {
              hidden: false,
              direction: "column",
              position: { vertical: "top", horizontal: "left" },
              padding: 0,
            },
          }}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fill: "gray",
              fontSize: 14,
            },
          }}
          {...sizing}
        />
      </div>
    </div>
  );
}
