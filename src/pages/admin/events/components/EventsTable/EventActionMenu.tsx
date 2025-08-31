import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import ForestIcon from "@mui/icons-material/Forest";
import MessageIcon from "@mui/icons-material/Message";
import { Event } from "../../../../../types/event";

interface EventActionMenuProps {
  anchorEl: null | HTMLElement;
  selectedEvent: Event | null;
  onClose: () => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (event: Event) => void;
  onImagesModal: () => void;
  onTreesModal: () => void;
  onMessagesModal: () => void;
}

export const EventActionMenu = ({
  anchorEl,
  selectedEvent,
  onClose,
  onEditEvent,
  onDeleteEvent,
  onImagesModal,
  onTreesModal,
  onMessagesModal,
}: EventActionMenuProps) => {
  const handleEditClick = () => {
    if (selectedEvent) {
      onEditEvent(selectedEvent);
    }
    onClose();
  };

  const handleDeleteClick = () => {
    if (selectedEvent) {
      onDeleteEvent(selectedEvent);
    }
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <MenuItem onClick={handleEditClick}>
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Edit Event</ListItemText>
      </MenuItem>
      <MenuItem onClick={handleDeleteClick}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Delete Event</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={onImagesModal}>
        <ListItemIcon>
          <PhotoLibraryIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Associate Images</ListItemText>
      </MenuItem>
      <MenuItem onClick={onTreesModal}>
        <ListItemIcon>
          <ForestIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Associate Trees</ListItemText>
      </MenuItem>
      <MenuItem onClick={onMessagesModal}>
        <ListItemIcon>
          <MessageIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Associate Messages</ListItemText>
      </MenuItem>
    </Menu>
  );
};