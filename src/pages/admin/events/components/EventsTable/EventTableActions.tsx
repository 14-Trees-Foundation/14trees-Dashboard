import { IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Event } from "../../../../../types/event";

interface EventTableActionsProps {
  event: Event;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, eventData: Event) => void;
}

export const EventTableActions = ({
  event,
  onMenuOpen,
}: EventTableActionsProps) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <IconButton
        size="small"
        onClick={(e) => onMenuOpen(e, event)}
      >
        <MoreVertIcon />
      </IconButton>
    </div>
  );
};