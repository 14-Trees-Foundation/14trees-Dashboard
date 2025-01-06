import { Box, Divider, Typography } from "@mui/material";
import CSRTrees from "./CSRTrees";
import CSRPlotStates from "./CSRPlotStates";
import { AutocompleteWithPagination } from "../../../components/AutoComplete";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import { Group } from "../../../types/Group";
import * as groupActionCreators from '../../../redux/actions/groupActions';

const CSRInventory: React.FC = () => {

    const dispatch = useAppDispatch();
    const { getGroups } = bindActionCreators(groupActionCreators, dispatch);

    const [groupPage, setGroupPage] = useState(0);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [groupNameInput, setGroupNameInput] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            getGroupsData();
        }, 300);

        return () => {
            clearTimeout(handler);
        }
    }, [groupPage, groupNameInput]);

    const getGroupsData = async () => {
        const groupNameFilter = {
            columnField: "name",
            value: groupNameInput,
            operatorValue: "contains",
        };

        getGroups(groupPage * 10, 10, [groupNameFilter]);
    };

    let groupsList: Group[] = [];
    const groupData = useAppSelector((state) => state.groupsData);

    if (groupData) {
        groupsList = Object.values(groupData.groups);
        groupsList = groupsList.sort((a, b) => {
            return b.id - a.id;
        });
    }

    return (
        <Box>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "4px 12px",
                }}
            >
                <Typography variant="h4" style={{ marginTop: '5px' }}>CSR Analytics</Typography>
            </div>
            <Divider sx={{ backgroundColor: "black", marginBottom: '15px' }} />

            <AutocompleteWithPagination
                label="Select a corporate group"
                options={groupsList}
                getOptionLabel={(option) => option?.name || ''}
                onChange={(event, newValue) => {
                    console.log(newValue);
                    setSelectedGroup(newValue);
                }}
                onInputChange={(event) => {
                    const { value } = event.target;
                    setGroupPage(0);
                    setGroupNameInput(value);
                }}
                setPage={setGroupPage}
                fullWidth
                size="small"
                value={selectedGroup}
            />

            <CSRTrees
                groupId={selectedGroup?.id}
            />
            {selectedGroup && <CSRPlotStates groupId={selectedGroup?.id} />}
        </Box>
    );
}

export default CSRInventory;