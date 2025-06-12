import { Box } from "@mui/material";
import { Group } from "../../../types/Group";
import CSRGiftTrees from "./CSRGiftTrees";
import CSRHeader from "./CSRHeader";
import { useState } from "react";

interface Props {}

const CSRAdminPage: React.FC<Props> = ({}) => {
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

    return (
        <Box>
            <CSRHeader groupId={undefined} onGroupChange={group => setSelectedGroup(group)} />
            {selectedGroup && (
                <CSRGiftTrees
                    groupId={selectedGroup.id}
                    selectedGroup={selectedGroup}
                />
            )}
        </Box>
    );
};

export default CSRAdminPage;