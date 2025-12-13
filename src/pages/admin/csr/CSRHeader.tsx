import { useEffect, useState } from "react";
import { Box, Divider, Typography, useMediaQuery, useTheme, Button, Avatar } from "@mui/material";
import { AutocompleteWithPagination } from "../../../components/AutoComplete";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import { Group } from "../../../types/Group";
import * as groupActionCreators from '../../../redux/actions/groupActions';
import { ToastContainer, toast } from "react-toastify";
import CSRSharePageDialog from "./CSRSharePageDialog";
import { Link } from "@mui/icons-material";
import ApiClient from "../../../api/apiClient/apiClient";
import { useTranslation } from "react-i18next";

type Props = {
    groupId: any
    onGroupChange: (group: Group | null) => void
}

const CSRHeader: React.FC<Props> = ({ groupId, onGroupChange }) => {

    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const dispatch = useAppDispatch();
    const { getGroups } = bindActionCreators(groupActionCreators, dispatch);

    ///*** GROUP ***/
    const [groupPage, setGroupPage] = useState(0);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [groupNameInput, setGroupNameInput] = useState("");
    const [viewDetails, setViewDetails] = useState<any>(null);

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

    // Fetch view details when selected group changes
    useEffect(() => {
        const fetchViewDetails = async () => {
            if (!selectedGroup?.id) {
                setViewDetails(null);
                return;
            }
            try {
                const path = '/csr/dashboard/' + selectedGroup.id;
                const apiClient = new ApiClient();
                const viewDetails = await apiClient.getViewDetails(path);
                setViewDetails(viewDetails);
            } catch (error) {
                console.error('Error fetching view details:', error);
                setViewDetails(null);
            }
        };

        const handler = setTimeout(fetchViewDetails, 300);
        return () => clearTimeout(handler);
    }, [selectedGroup?.id]);

    const handleOpenLink = () => {
        if (!selectedGroup?.id) {
            toast.error("Please select a group first");
            return;
        }
        
        const link = `${window.location.origin}/csr/dashboard/${selectedGroup.id}${viewDetails?.view_id ? `?v=${viewDetails.view_id}` : ''}`;
        window.open(link, '_blank');
    };

    return (
        <Box>
            <ToastContainer />
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: isMobile ? '12px 16px 0' : '12px 24px 0',
                    padding: '0px 8px',
                    alignItems: 'center'
                }}
            > <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginRight: '24px' }}>
                    {selectedGroup?.logo_url && (
                        <Avatar
                            src={selectedGroup.logo_url}
                            alt={`${selectedGroup.name} logo`}
                            sx={{
                                width: 50,
                                height: 50,
                                backgroundColor: 'transparent',
                                '& img': {
                                    objectFit: 'contain'
                                }
                            }}
                            variant="square"
                        />
                    )}
                    <Typography variant={isMobile ? "h6" : "h4"} style={{ margin: 0, lineHeight: 1.2 }}>
                        {selectedGroup ? `Climate Action Dashboard for ${selectedGroup.name}` : t('corporateDashboard.title')}
                    </Typography>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: 'center'
                    }}
                >
                    {!groupId && (
                        <>
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
                            <Box sx={{ display: 'flex', gap: 1, ml: 1 }}>
                                <CSRSharePageDialog
                                    groupId={selectedGroup?.id}
                                    groupName={selectedGroup?.name}
                                />
                                <Button
                                    variant="outlined"
                                    color="success"
                                    onClick={handleOpenLink}
                                    disabled={!selectedGroup?.id}
                                    startIcon={<Link />}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Link
                                </Button>
                            </Box>
                        </>
                    )}
                </div>
            </div>
            <Divider sx={{ backgroundColor: "black", marginBottom: '15px', mx: 1 }} />
        </Box>
    );
};

export default CSRHeader;
