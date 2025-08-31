import { Typography, Button, Divider } from "@mui/material";

interface EventHeaderProps {
  onAddEvent: () => void;
}

export const EventHeader = ({ onAddEvent }: EventHeaderProps) => {
  return (
    <>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "4px 12px",
      }}>
        <Typography variant="h4" style={{ marginTop: '5px' }}>Events</Typography>
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "5px",
          marginTop: "5px",
        }}>
          <Button variant="contained" color="success" onClick={onAddEvent}>
            Add Event
          </Button>
        </div>
      </div>
      <Divider sx={{ backgroundColor: "black", marginBottom: '15px' }} />
    </>
  );
};