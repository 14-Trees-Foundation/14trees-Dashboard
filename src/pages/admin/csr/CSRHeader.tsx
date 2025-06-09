import { useEffect, useState } from "react";
import { Box, Divider, Typography, useMediaQuery, useTheme, Button } from "@mui/material";
import { AutocompleteWithPagination } from "../../../components/AutoComplete";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import { Group } from "../../../types/Group";
import * as groupActionCreators from '../../../redux/actions/groupActions';
import { ToastContainer } from "react-toastify";
import CSRSharePageDialog from "./CSRSharePageDialog";

type Props = {
    groupId: any
    onGroupChange: (group: Group | null) => void
}

const CSRHeader: React.FC<Props> = ({ groupId, onGroupChange }) => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const dispatch = useAppDispatch();
    const { getGroups } = bindActionCreators(groupActionCreators, dispatch);

    ///*** GROUP ***/
    const [groupPage, setGroupPage] = useState(0);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [groupNameInput, setGroupNameInput] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            getGroupsData();
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [groupPage, groupNameInput]);

    const getGroupsData = async () => {
        const groupNameFilter = {
            columnField: "name",
            value: groupNameInput,
            operatorValue: "contains",
        };

        const filters = [groupNameFilter];
        if (groupId && !isNaN(parseInt(groupId))) {
            filters.push({
                columnField: "id",
                value: groupId,
                operatorValue: "equals",
            });
        }

        getGroups(groupPage * 10, 10, filters);
    };

    let groupsList: Group[] = [];
    const groupData = useAppSelector((state) => state.groupsData);

    if (groupData) {
        groupsList = Object.values(groupData.groups);
        groupsList = groupsList.sort((a, b) => {
            return b.id - a.id;
        });
    }

    useEffect(() => {
        if (groupId) {
            const group = groupsList.find(item => item.id === parseInt(groupId));
            if (group) {
                setSelectedGroup(group);
                onGroupChange(group);
            } else {
                setSelectedGroup(null);
                onGroupChange(null);
            }
        }
    }, [groupsList, groupId]);


    return (
        <Box>
            <ToastContainer />
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: isMobile ? '10px 10px 0 10px' : undefined,
                    padding: '0px 8px'
                }}
            >
                <Typography variant={isMobile ? "h5" : "h3"} style={{ marginTop: '5px', marginBottom: '5px' }}>
                    {selectedGroup ? `${selectedGroup.name}'s` : 'Corporate'} Dashboard
                </Typography>
                <div
                   style={{
                     display: "flex",
                      justifyContent: "space-between",
                      alignItems: 'center'
                    }}
                >
                    {!groupId && (
                        <AutocompleteWithPagination
                            label="Select a corporate group"
                            options={groupsList}
                            getOptionLabel={(option) => option?.name || ''}
                            onChange={(event, newValue) => {
                                setSelectedGroup(newValue);
                                onGroupChange(newValue);
                            }}
                            onInputChange={(event) => {
                                const { value } = event.target;
                                setGroupPage(0);
                                setGroupNameInput(value);
                            }}
                            setPage={setGroupPage}
                            size="small"
                            value={selectedGroup}
                        />
                    )}

                    <CSRSharePageDialog groupId={selectedGroup?.id} groupName={selectedGroup?.name} style={{ marginLeft: 10 }} />
                </div>
            </div>
            <Divider sx={{ backgroundColor: "black", marginBottom: '15px', mx: 1 }} />
        </Box>
    );
};

export default CSRHeader;
