import Box from "@mui/material/Box";
import { Typography, Divider } from "@mui/material";
import TreesAuditReport from "./TreesAuditReport";
import { useTranslation } from "react-i18next";

export const OnsiteReports = () => {
  const { t } = useTranslation();
  return (
    <Box>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "4px 12px",
        }}
      >
        <Typography variant="h4" style={{ marginTop: '5px' }}>{t('onsiteReports.title')}</Typography>
      </div>
      <Divider sx={{ backgroundColor: "black", marginBottom: '15px' }} />
      <TreesAuditReport />
    </Box>
  );
};

export default OnsiteReports;
