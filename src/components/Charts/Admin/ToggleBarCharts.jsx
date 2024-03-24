import React, { useState } from "react";
import generatePDF from "./generatePDF";

const ToggleBarCharts = ({
  selectedChart,
  onChartSelection,
  monthlyData,
  dailyData,
  yearlyData,
}) => {
  const [activeButton, setActiveButton] = useState("monthly");

  // Function to handle button click
  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
    onChartSelection(buttonType); // Call the onChartSelection prop function
  };

  const handleDownload = () => {
    switch (selectedChart) {
      case "monthly":
        generatePDF(monthlyData, "monthly");
        break;
      case "daily":
        generatePDF(dailyData, "daily");
        break;
      case "yearly":
        generatePDF(yearlyData, "yearly");
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="w-full flex justify-between">
        <div className="w-full sm:w-1/2 flex justify-start gap-2 mb-4">
          <button
            className={`w-full border border-black p-2 rounded-md ${
              activeButton === "monthly" ? "bg-black text-white" : ""
            }`}
            onClick={() => handleButtonClick("monthly")}
          >
            Monthly
          </button>
          <button
            className={`w-full border border-black p-2 rounded-md ${
              activeButton === "daily" ? "bg-black text-white" : ""
            }`}
            onClick={() => handleButtonClick("daily")}
          >
            Daily
          </button>
          <button
            className={`w-full border border-black p-2 rounded-md ${
              activeButton === "yearly" ? "bg-black text-white" : ""
            }`}
            onClick={() => handleButtonClick("yearly")}
          >
            Yearly
          </button>
        </div>
        <div className="flex justify-end gap-2 mb-4">
          <button
            className={`w-full p-2 justify-end border border-black rounded-md hover:bg-black hover:text-white`}
            onClick={handleDownload}
          >
            Download
          </button>
        </div>
      </div>
    </>
  );
};

export default ToggleBarCharts;
