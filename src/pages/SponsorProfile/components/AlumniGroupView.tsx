import { Box, Divider, Typography } from "@mui/material";
import { useAlumniGroupData } from "../hooks/useAlumniGroupData";
import SponsorHeroSection from "./SponsorHeroSection";
import UserList from "./UserList";

interface AlumniGroupViewProps {
    groupId: number;
    groupName: string;
}

const AlumniGroupView: React.FC<AlumniGroupViewProps> = ({
    groupId,
    groupName
}) => {
    const { loading, users, aggregateMetrics } = useAlumniGroupData(groupId);

    return (
        <Box
            p={2}
            data-testid="alumni-group-view"
            sx={{
                '@media (max-width: 768px)': {
                    padding: 1,
                }
            }}
        >
            {/* Header */}
            <Box mb={3}>
                <Typography mb={1} variant="h4" color="#323232" data-testid="dashboard-header">
                    {loading && !groupName ? 'Loading...' : `${groupName}'s Dashboard`}
                </Typography>
                <Divider />
            </Box>

            {/* Hero Section with Aggregate Metrics */}
            <Box sx={{ mb: 4 }}>
                <SponsorHeroSection
                    totalTrees={aggregateMetrics.totalTrees}
                    totalRequests={aggregateMetrics.totalRequests}
                    loading={loading}
                    isGroupView={true}
                />
            </Box>

            {/* User List */}
            <Box
                className="no-scrollbar"
                data-testid="user-list-container"
                sx={{
                    height: 'calc(100vh - 450px)',
                    overflowY: 'auto',
                    '@media (max-width: 768px)': {
                        height: 'calc(100vh - 350px)',
                    }
                }}
            >
                <UserList
                    users={users}
                    loading={loading}
                    isGroupView={true}
                />
            </Box>
        </Box>
    );
};

export default AlumniGroupView;
