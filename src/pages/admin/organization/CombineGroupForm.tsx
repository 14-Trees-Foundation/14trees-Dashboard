import { Box, Chip, ToggleButton, ToggleButtonGroup, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material"
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
    const [groupsCount1, setGroupsCount1] = useState<any>(null)
    const [groupsCount2, setGroupsCount2] = useState<any>(null)

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
                const data = await getGroupsCountForGroup(primaryGroup.id);
                setGroupsCount1(data);
            } else {
                setGroupsCount1(null);
            }
        }, 300)

        return () => {
            clearTimeout(handler);
        }
    }, [primaryGroup]);

    useEffect(() => {
        const handler = setTimeout(async () => {
            if (secondaryGroup) {
                const data = await getGroupsCountForGroup(secondaryGroup.id);
                setGroupsCount2(data);
            } else {
                setGroupsCount2(null);
            }
        }, 300)

        return () => {
            clearTimeout(handler);
        }
    }, [secondaryGroup]);

    const getGroupsCountForGroup = async (groupId: number) => {
        try {
            const apiClient = new ApiClient();
            const resp = await apiClient.getGroupsCountForGroup(groupId);
            return resp;
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    const renderGroupComparison = () => {
        if (!groupsCount1 || !groupsCount2) return null;

        const metrics = [
            // Trees
            { category: 'Trees', label: 'Mapped Trees', key: 'trees.mapped_trees' },
            { category: 'Trees', label: 'Sponsored Trees', key: 'trees.sponsored_trees' },
            
            // Gift Cards & Donations
            { category: 'Gift Cards', label: 'Gift Card Requests', key: 'gift_card_requests' },
            { category: 'Donations', label: 'Donations', key: 'donations' },
            { category: 'Gift Transactions', label: 'Gift Redeem Transactions', key: 'gift_redeem_transactions' },
            
            // Group Management
            { category: 'Members', label: 'Group Members', key: 'group_members' },
            { category: 'Activities', label: 'Visits', key: 'visits' },
            
            // Total
            { category: 'Summary', label: 'Total Relationships', key: 'total_relationships' },
        ];

        const getValue = (obj: any, path: string) => {
            return path.split('.').reduce((o, p) => o && o[p], obj) || 0;
        };

        return (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Category</strong></TableCell>
                            <TableCell><strong>Metric</strong></TableCell>
                            <TableCell align="center"><strong>Primary Group</strong></TableCell>
                            <TableCell align="center"><strong>Secondary Group</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {metrics.map((metric, index) => {
                            const secondaryValue = getValue(groupsCount2, metric.key);
                            const hasSecondaryData = secondaryValue > 0;
                            
                            return (
                                <TableRow 
                                    key={index} 
                                    sx={{ 
                                        // Default alternating row colors (only when no secondary data)
                                        ...(!hasSecondaryData && {
                                            '&:nth-of-type(odd)': { backgroundColor: 'action.hover' }
                                        }),
                                        // Highlight rows with secondary group data
                                        ...(hasSecondaryData && {
                                            backgroundColor: 'warning.light',
                                            '&:hover': { backgroundColor: 'warning.main' },
                                            '& .MuiTableCell-root': { fontWeight: 'bold' }
                                        })
                                    }}
                                >
                                    <TableCell>{metric.category}</TableCell>
                                    <TableCell>{metric.label}</TableCell>
                                    <TableCell align="center">{getValue(groupsCount1, metric.key)}</TableCell>
                                    <TableCell align="center">{secondaryValue}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

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
            </Box>
            
            {/* Render group comparison table */}
            {renderGroupComparison()}
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