import * as React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";
import Container from "@mui/material/Container";
import { CircularProgress } from "@mui/material";
import DoctorAboutTab from "./DoctorAboutTab";
import DoctorEducationTab from "./DoctorEducationTab";
import DoctorContactTab from "./DoctorContactTab";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Container>{children}</Container>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function DoctorDetailsTabs({ doctor }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="inherit"
          indicatorColor="primary"
          aria-label="doctor details tabs"
          centered
        >
          <Tab label="About" {...a11yProps(0)} />
          <Tab label="Education" {...a11yProps(1)} />
          <Tab label="Contact" {...a11yProps(2)} />
        </Tabs>
      </Box>
      {doctor.user ? (
        <>
          <CustomTabPanel value={value} index={0}>
            <DoctorAboutTab doctor={doctor} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <DoctorEducationTab doctor={doctor} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <DoctorContactTab doctor={doctor} />
          </CustomTabPanel>
        </>
      ) : (
        <div className="relative flex min-h-[500px] justify-center items-center">
          <Box sx={{ display: "flex" }}>
            <CircularProgress color="inherit" />
          </Box>
        </div>
      )}
    </Box>
  );
}
