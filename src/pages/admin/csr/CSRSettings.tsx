import { useState, useEffect } from "react";
import {
    Box,
    Avatar,
    IconButton,
    Card,
    Typography,
    Divider,
    Button
} from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { toast } from "react-toastify";
import EditOrganizationDialog from "./EditOrganizationDialog";
import ApiClient from "../../../api/apiClient/apiClient";
import { Group } from "../../../types/Group";
import { AWSUtils } from "../../../helpers/aws";
import GeneralTable from "../../../components/GenTable";
import { TableColumnsType } from "antd";
import CSRSharePageDialog from "./CSRSharePageDialog";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';

type Props = {
    group: Group;
    onGroupChange: (group: Group) => void;
}

type View = {
    users?: Array<{
        id: number;
        name: string;
        email: string;
    }>;
}

const CSRSettings: React.FC<Props> = ({ group, onGroupChange }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [editOrgDialogOpen, setEditOrgDialogOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const apiClient = new ApiClient();
            const view = await apiClient.getViewDetails(`/csr/dashboard/${group.id}`);
            if (view?.users) {
                setUsers(view.users);
            }
        } catch (error) {
            toast.error("Failed to fetch users");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [group.id]);

    const handleSaveOrganization = async (
        updatedData: { name: string; address: string; logo_url: string | null, billing_email: string; },
        logoFile?: File
    ) => {
        try {
            if (!group) return;

            const apiClient = new ApiClient();
            if (logoFile) {
                const awsUtil = new AWSUtils();
                const url = await awsUtil.uploadFileToS3("gift-request", logoFile, "logos");
                updatedData.logo_url = url
            }

            const updatedGroup = {
                ...group,
                name: updatedData.name,
                address: updatedData.address,
                billing_email: updatedData.billing_email,
                logo_url: updatedData.logo_url,
                updated_at: new Date()
            };

            const response = await apiClient.updateGroup(updatedGroup);
            onGroupChange(response);
            toast.success("Organization updated successfully!");
        } catch (error) {
            toast.error("Failed to update organization");
            console.error(error);
        }
    };

    const handleRemoveUserClick = (userId: number) => {
        setUserToDelete(userId);
        setDeleteDialogOpen(true);
    };

    const confirmRemoveUser = async () => {
        if (!userToDelete) return;
        
        try {
            const apiClient = new ApiClient();
            const viewPath = `/csr/dashboard/${group.id}`;
            const view = await apiClient.getViewDetails(viewPath);
            
            if (view?.id) {
                await apiClient.deleteViewUsers(view.id, [{ id: userToDelete }]);
                toast.success("User removed successfully");
                fetchUsers(); // Refresh the user list
            }
        } catch (error) {
            toast.error("Failed to remove user");
            console.error(error);
        } finally {
            setDeleteDialogOpen(false);
            setUserToDelete(null);
        }
    };

    const handleUsersAdded = () => {
        fetchUsers();
    };

    const summaryCardStyle = {
        width: "100%",
        minHeight: "170px",
        borderRadius: "15px",
        padding: "16px",
        margin: "15px 0",
        background: "linear-gradient(145deg, #9faca3, #bdccc2)",
        boxShadow: "7px 7px 14px #9eaaa1,-7px -7px 14px #c4d4c9",
        transition: "transform 0.3s ease",
        '&:hover': {
            transform: "scale(1.03)"
        }
    };

    const userColumns: TableColumnsType<any> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            align: 'center' as const,
            render: (text: string) => <Typography variant="body1">{text}</Typography>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            align: 'center' as const,
            render: (email: string) => <Typography variant="body1">{email}</Typography>,
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'center' as const,
            render: (_: any, record: any) => (
                <Box display="flex" justifyContent="center">
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleRemoveUserClick(record.id)}
                    >
                        Remove
                    </Button>
                </Box>
            ),
        },
    ];

    return (
        <Box mt={3} id="Setting-Details" sx={{ px: isMobile ? 1 : 2 }}>
            {/* Organization Details */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginBottom: '20px',
                backgroundColor: 'transparent'
            }}>
                <Card sx={summaryCardStyle}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: '100%',
                        padding: '0 16px'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3
                        }}>
                            <Avatar
                                src={group.logo_url || undefined}
                                alt={`${group.name} logo`}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    mb: 2,
                                    '& img': {
                                        objectFit: 'contain'
                                    }
                                }}
                            >
                                {group.name?.[0]}
                            </Avatar>
                            <Box>
                                <Typography variant="h4" color="#fff" sx={{ fontWeight: 600 }}>
                                    {group.name}
                                </Typography>
                                {group.billing_email && (
                                    <Typography variant="subtitle1" color="#1f3625" sx={{ mt: 1 }}>
                                        {group.billing_email}
                                    </Typography>
                                )}
                                <Typography variant="subtitle1" color="#1f3625" sx={{ mt: 1 }}>
                                    {group.address || 'Address not available'}
                                </Typography>
                            </Box>
                        </Box>

                        <IconButton
                            sx={{
                                color: "#1f3625",
                                '&:hover': {
                                    color: "#fff",
                                    backgroundColor: 'transparent'
                                }
                            }}
                            aria-label="Edit organization details"
                            onClick={() => setEditOrgDialogOpen(true)}
                        >
                            <EditIcon fontSize="large" />
                        </IconButton>
                    </Box>
                </Card>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Onboarded Users Table */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Manage access to this dashboard
                    </Typography>
                    <CSRSharePageDialog
                        groupId={group.id}
                        groupName={group.name}
                        onUsersAdded={handleUsersAdded}
                    />
                </Box>
                <GeneralTable
                    rows={users}
                    columns={userColumns}
                    totalRecords={users.length}
                    onDownload={async () => users}
                    page={page}
                    pageSize={pageSize}
                    onPaginationChange={(newPage, newPageSize) => {
                        setPage(newPage);
                        setPageSize(newPageSize);
                    }}
                    footer={false}
                    tableName="onboarded-users"
                    loading={loading}
                />
            </Box>

            <EditOrganizationDialog
                open={editOrgDialogOpen}
                onClose={() => setEditOrgDialogOpen(false)}
                organizationData={{
                    name: group.name,
                    address: group.address || "",
                    billing_email: group.billing_email || "",
                    logo_url: group.logo_url,
                }}
                onSave={handleSaveOrganization}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Confirm Removal
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Are you sure you want to remove this user?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined" color="error">Cancel</Button>
                    <Button 
                        onClick={confirmRemoveUser}
                        variant="contained"
                        color="success" 
                        autoFocus
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CSRSettings;
