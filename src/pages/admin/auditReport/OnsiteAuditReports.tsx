import Box from "@mui/material/Box";
import { Typography, Divider } from "@mui/material";
import OnsiteTreeAuditReports from "./OnsiteTreeAuditReports";

export const OnsiteAuditReports = () => {
  return (
    <Box>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "4px 12px",
        }}
      >
        <Typography variant="h4" style={{ marginTop: '5px' }}>Onsite Audit Reports</Typography>
      </div>
      <Divider sx={{ backgroundColor: "black", marginBottom: '15px' }} />
      <OnsiteTreeAuditReports />
    </Box>
  );
};

export default OnsiteAuditReports;
