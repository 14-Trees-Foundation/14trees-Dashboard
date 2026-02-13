import { Box, Divider, Typography } from "@mui/material";
import { useCorporateGroupData } from "../hooks/useCorporateGroupData";
import { RequestItem } from "../types/requestItem";
import SponsorHeroSection from "./SponsorHeroSection";
import RequestList from "./RequestList";

interface CorporateGroupViewProps {
    groupId: number;
    groupName: string;
    onRequestClick: (request: RequestItem) => void;
}

const CorporateGroupView: React.FC<CorporateGroupViewProps> = ({
    groupId,
    groupName,
    onRequestClick
}) => {
    const { loading, requests, aggregateMetrics } = useCorporateGroupData(groupId);

    return (
        <Box
            p={2}
            data-testid="corporate-group-view"
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

            {/* Request List */}
            <Box
                className="no-scrollbar"
                data-testid="request-list-container"
                sx={{
                    height: 'calc(100vh - 450px)',
                    overflowY: 'auto',
                    '@media (max-width: 768px)': {
                        height: 'calc(100vh - 350px)',
                    }
                }}
            >
                <RequestList
                    requests={requests}
                    onRequestClick={onRequestClick}
                    loading={loading}
                    isGroupView={true}
                />
            </Box>
        </Box>
    );
};

export default CorporateGroupView;
