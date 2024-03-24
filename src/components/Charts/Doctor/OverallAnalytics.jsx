import { Grid } from "@mui/material";
import React from "react";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";
import GroupIcon from "@mui/icons-material/Group";

const OverallAnalytics = ({ counts }) => {
  return (
    <>
      <div className="flex w-full gap-2 justify-evenly mb-5">
        <div className="border py-2 border-black rounded-sm w-full">
          <div>
            <GroupIcon />
            <p className="font-medium">Patients</p>
          </div>
          <p className="text-xl font-semibold">{counts.patients}</p>
        </div>
        <div className="border py-2 border-black rounded-sm w-full">
          <div>
            <TroubleshootIcon />
            <p className="font-medium">Appointments</p>
          </div>
          <p className="text-xl font-semibold">{counts.apppointments_count}</p>
        </div>
        <div className="border py-2 border-black rounded-sm w-full">
          <div>
            <TrendingUpIcon />
            <p className="font-medium">Revenue</p>
            <p className="text-xl font-semibold">₹ {counts.revenue}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OverallAnalytics;
