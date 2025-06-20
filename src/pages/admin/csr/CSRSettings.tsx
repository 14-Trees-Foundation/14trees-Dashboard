import { useState } from "react";
import {
    Box,
    Avatar,
    IconButton,
    Card,
    Typography,
    Divider
} from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { toast } from "react-toastify";
import EditOrganizationDialog from "./EditOrganizationDialog";
import ApiClient from "../../../api/apiClient/apiClient";
import { Group } from "../../../types/Group";
import { AWSUtils } from "../../../helpers/aws";

type Props = {
    group: Group;
    onGroupChange: (group: Group) => void;
}

const CSRSettings: React.FC<Props> = ({ group, onGroupChange }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [editOrgDialogOpen, setEditOrgDialogOpen] = useState(false);

    const userName = localStorage.getItem("userName") || "";
    const userEmail = localStorage.getItem("userEmail");

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

            {/* User Details */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                width: '100%',
            }}>
                <Card
                    sx={{
                        width: isMobile ? "100%" : "calc(60% + 20%)",
                        minHeight: "110px",
                        borderRadius: "12px",
                        padding: "12px 20px",
                        margin: "15px 0",
                        background: "linear-gradient(145deg, #9faca3, #bdccc2)",
                        boxShadow: "5px 5px 10px #9eaaa1, -5px -5px 10px #c4d4c9",
                        transition: "transform 0.3s ease",
                        '&:hover': {
                            transform: "scale(1.02)"
                        },
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        width: '100%',
                        justifyContent: 'flex-start'
                    }}>
                        <Avatar
                            alt="User Avatar"
                            sx={{
                                width: 48,
                                height: 48,
                                backgroundColor: theme.palette.primary.main,
                            }}
                        >
                            {userName?.[0]}
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle1" color="#000" sx={{ fontWeight: 500 }}>
                                {userName}
                            </Typography>
                            <Typography variant="subtitle2" color="#000">
                                {userEmail}
                            </Typography>
                        </Box>
                    </Box>
                </Card>
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
        </Box>
    );
};

export default CSRSettings;
