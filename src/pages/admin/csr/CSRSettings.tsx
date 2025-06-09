import { useEffect, useState } from "react";
import {
    Box,
    Avatar,
    IconButton,
    Card,
    Typography
} from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { toast } from "react-toastify";
import EditOrganizationDialog from "./EditOrganizationDialog";
import ApiClient from "../../../api/apiClient/apiClient";
import { Group } from "../../../types"; // Adjust path if needed

const CSRSettings = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [editOrgDialogOpen, setEditOrgDialogOpen] = useState(false);
    const [currentGroup, setCurrentGroup] = useState<Group | null>(null);

    useEffect(() => {
        // Fetch current group info when component mounts
        const fetchGroup = async () => {
            try {
                const apiClient = new ApiClient();
                const group = await apiClient.getCurrentGroup(); // adjust this method as per your API
                setCurrentGroup(group);
            } catch (error) {
                toast.error("Failed to fetch organization data");
                console.error(error);
            }
        };
        fetchGroup();
    }, []);

    const handleSaveOrganization = async (
        updatedData: { name: string; address: string; logo_url: string },
        logoFile?: File
    ) => {
        try {
            if (!currentGroup) return;

            const apiClient = new ApiClient();
            const updatedGroup = {
                ...currentGroup,
                name: updatedData.name,
                address: updatedData.address,
                logo_url: updatedData.logo_url,
                updated_at: new Date()
            };

            const response = await apiClient.updateGroup(updatedGroup, logoFile);
            setCurrentGroup(response);
            toast.success("Organization updated successfully!");
        } catch (error) {
            toast.error("Failed to update organization");
            console.error(error);
        }
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

    return (
        <Box mt={3} id="Setting-Details" sx={{ px: isMobile ? 1 : 2 }}>
            {currentGroup && (
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
                                    src={currentGroup.logo_url}
                                    alt={`${currentGroup.name} logo`}
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        mb: 2,
                                        '& img': {
                                            objectFit: 'contain'
                                        }
                                    }}
                                >
                                    {currentGroup.name?.[0]}
                                </Avatar>
                                <Box>
                                    <Typography variant="h4" color="#fff" sx={{ fontWeight: 600 }}>
                                        {currentGroup.name}
                                    </Typography>
                                    <Typography variant="subtitle1" color="#1f3625" sx={{ mt: 1 }}>
                                        {currentGroup.address || 'Address not available'}
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

                    <EditOrganizationDialog
                        open={editOrgDialogOpen}
                        onClose={() => setEditOrgDialogOpen(false)}
                        organizationData={{
                            name: currentGroup.name,
                            address: currentGroup.address,
                            logo_url: currentGroup.logo_url
                        }}
                        onSave={handleSaveOrganization}
                    />
                </Box>
            )}
        </Box>
    );
};

export default CSRSettings;