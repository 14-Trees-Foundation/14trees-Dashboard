import Box from "@mui/material/Box";
import { Typography, Divider } from "@mui/material";
import TreesAuditReport from "./TreesAuditReport";

export const OnsiteReports = () => {
  return (
    <Box>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "4px 12px",
        }}
      >
        <Typography variant="h4" style={{ marginTop: '5px' }}>Onsite Reports</Typography>
      </div>
      <Divider sx={{ backgroundColor: "black", marginBottom: '15px' }} />
      <TreesAuditReport />
    </Box>
  );
};

export default OnsiteReports;
