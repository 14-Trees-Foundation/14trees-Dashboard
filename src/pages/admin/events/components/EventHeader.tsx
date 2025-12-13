import { Typography, Button, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";

interface EventHeaderProps {
  onAddEvent: () => void;
}

export const EventHeader = ({ onAddEvent }: EventHeaderProps) => {
  const { t } = useTranslation();
  return (
    <>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "4px 12px",
      }}>
        <Typography variant="h4" style={{ marginTop: '5px' }}>{t('events.title')}</Typography>
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "5px",
          marginTop: "5px",
        }}>
          <Button variant="contained" color="success" onClick={onAddEvent}>
            {t('events.addEvent')}
          </Button>
        </div>
      </div>
      <Divider sx={{ backgroundColor: "black", marginBottom: '15px' }} />
    </>
  );
};