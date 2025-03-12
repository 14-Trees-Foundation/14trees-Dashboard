import { Box, Chip, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { AutocompleteWithPagination } from "../../../components/AutoComplete";
import * as groupActionCreators from "../../../redux/actions/groupActions"
import ApiClient from "../../../api/apiClient/apiClient";
import { toast } from "react-toastify";
import { Group } from "../../../types/Group";

interface CombineGroupFormProps {
    primaryGroup: Group | null
    secondaryGroup: Group | null
    onPrimaryGroupChange: (group: Group | null) => void
    onSecondaryGroupChange: (group: Group | null) => void
    deleteSecondary: boolean
    onDeleteSecondaryChange: (value: boolean) => void
}

const CombineGroupForm: React.FC<CombineGroupFormProps> = ({ primaryGroup, secondaryGroup, deleteSecondary, onDeleteSecondaryChange, onPrimaryGroupChange, onSecondaryGroupChange }) => {

    const dispatch = useAppDispatch();
    const { searchGroups } = bindActionCreators(groupActionCreators, dispatch);

    const [groupSearchQuery, setGroupSearchQuery] = useState('');
    const [groupSearchQuery2, setGroupSearchQuery2] = useState('');
    const [treesCount1, setTreesCount1] = useState<any>(null)
    const [treesCount2, setTreesCount2] = useState<any>(null)

    let groups: Group[] = [];
    const groupsData = useAppSelector((state) => state.searchGroupsData);
    if (groupsData) {
        groups = Object.values(groupsData.groups);
    }

    useEffect(() => {
        const handler = setTimeout(() => {
            if (groupSearchQuery.length >= 3) searchGroups(0, 20, groupSearchQuery);
        }, 300)

        return () => {
            clearTimeout(handler);
        }
    }, [groupSearchQuery]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (groupSearchQuery2.length >= 3) searchGroups(0, 20, groupSearchQuery2);
        }, 300)

        return () => {
            clearTimeout(handler);
        }
    }, [groupSearchQuery2]);

    useEffect(() => {
        const handler = setTimeout(async () => {
            if (primaryGroup) {
                const data = await getTreeCountForGroup(primaryGroup.id);
                setTreesCount1(data?.map((item: any) => item.booked)?.reduce((prev: number, curr: number) => prev + curr, 0));
            } else {
                setTreesCount1(null);
            }
        }, 300)

        return () => {
            clearTimeout(handler);
        }
    }, [primaryGroup]);

    useEffect(() => {
        const handler = setTimeout(async () => {
            if (secondaryGroup) {
                const data = await getTreeCountForGroup(secondaryGroup.id);
                setTreesCount2(data?.map((item: any) => item.booked)?.reduce((prev: number, curr: number) => prev + curr, 0));
            } else {
                setTreesCount2(null);
            }
        }, 300)

        return () => {
            clearTimeout(handler);
        }
    }, [secondaryGroup]);

    const getTreeCountForGroup = async (groupId: number) => {
        try {
            const apiClient = new ApiClient();
            const resp = apiClient.getTreeCountForCorporate(groupId);
            return resp;
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    return (
        <Box
            sx={{
                padding: 2,
                display: "flex",
                flexDirection: 'column',
            }}
        >
            <Box mt={2}>
                <Typography>Select primary group</Typography>
                <AutocompleteWithPagination
                    label="Enter corporate name to search"
                    value={primaryGroup}
                    options={groups}
                    getOptionLabel={(group) => group.name}
                    onChange={(event, value: Group) => onPrimaryGroupChange(value)}
                    onInputChange={(event) => { setGroupSearchQuery(event.target.value); }}
                    fullWidth
                    size="medium"
                />
                {treesCount1 && <Box display="flex">
                    <Chip
                        label={`Reserved trees: ${treesCount1}`}
                        sx={{ margin: 0.5 }}
                    />
                </Box>}
            </Box>
            <Box mt={2}>
                <Typography>Select secondary group</Typography>
                <AutocompleteWithPagination
                    label="Enter corporate name to search"
                    value={secondaryGroup}
                    options={groups}
                    getOptionLabel={(group) => group.name}
                    onChange={(event, value: Group) => onSecondaryGroupChange(value)}
                    onInputChange={(event) => { setGroupSearchQuery2(event.target.value); }}
                    fullWidth
                    size="medium"
                />
                {treesCount2 && <Box display="flex">
                    <Chip
                        label={`Reserved trees: ${treesCount2}`}
                        sx={{ margin: 0.5 }}
                    />
                </Box>}
            </Box>
            <Box
                mt={2}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <Typography mr={5}>Do you want to delete secondary group?</Typography>
                <ToggleButtonGroup
                    color="success"
                    value={deleteSecondary ? "yes" : "no"}
                    exclusive
                    onChange={(e, value) => { onDeleteSecondaryChange(value === "yes" ? true : false); }}
                    aria-label="Platform"
                    size="small"
                >
                    <ToggleButton value="yes">Yes</ToggleButton>
                    <ToggleButton value="no">No</ToggleButton>
                </ToggleButtonGroup>
            </Box>
        </Box>
    )
}

export default CombineGroupForm;