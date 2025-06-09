import { Box } from "@mui/material";
import { Group } from "../../../types/Group";
import CSRGiftTrees from "./CSRGiftTrees";

interface CSRInventoryProps {
    selectedGroup: Group
}

const CSRInventory: React.FC<CSRInventoryProps> = ({ selectedGroup }) => {

    return (
        <Box>
            {selectedGroup && (
                <CSRGiftTrees
                    groupId={selectedGroup.id}
                />
            )}
        </Box>
    );
};

export default CSRInventory;