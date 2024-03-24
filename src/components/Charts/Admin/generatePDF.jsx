import jsPDF from "jspdf";
import "jspdf-autotable";

const generatePDF = (data, reportType, doctorName=null) => {
  const doc = new jsPDF();

  // Set the document title
  doc.setFontSize(18);
  if (doctorName) {
    doc.text(
      `${
        reportType.charAt(0).toUpperCase() + reportType.slice(1)
      } Appointments and Revenue Report`,
      20,
      20
    );
    doc.text(
      `Dr. ${doctorName}`,
      20,
      30
    );
  } else {
    doc.text(
      `${
        reportType.charAt(0).toUpperCase() + reportType.slice(1)
      } Appointments and Revenue Report`,
      20,
      20
    );
  }

  // Create the table data
  const tableData = data.map((item) => {
    let row = [];

    switch (reportType) {
      case "yearly":
        row = [
          item.year,
          item.appointments_count,
          item.paid_appointments_count,
          item.revenue,
        ];
        break;
      case "monthly":
        row = [
          new Date(item.month).toLocaleString("en-US", { month: "long" }),
          item.appointments_count,
          item.paid_appointments_count,
          item.revenue,
        ];
        break;
      case "daily":
        row = [
          new Date(item.day).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
          }),
          item.appointments_count,
          item.paid_appointments_count,
          item.revenue,
        ];
        break;
      default:
        break;
    }

    return row;
  });

  // Define table headers based on report type
  const tableHeaders =
    reportType === "yearly"
      ? ["Year", "Appointments", "Paid Appointments", "Revenue"]
      : ["Date", "Appointments", "Paid Appointments", "Revenue"];

  // Add the table to the PDF
  doc.autoTable({
    startY: doctorName ? 40 : 30,
    head: [tableHeaders],
    body: tableData,
    styles: { font: "helvetica", fontSize: 10 },
    columnStyles: {
      0: { halign: "center" },
      2: { halign: "center" },
      3: { halign: "right" },
    },
  });

  // Save the PDF
  const fileName = `${reportType}_report_${
    new Date().toISOString().split("Z")[0]
  }.pdf`;
  doc.save(fileName);
};

export default generatePDF;
