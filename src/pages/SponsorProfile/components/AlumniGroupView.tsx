import { useState } from "react";
import { Box, Divider, Typography, TextField, InputAdornment, alpha, useTheme } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
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
    const theme = useTheme();
    const { loading, users, aggregateMetrics } = useAlumniGroupData(groupId);
    const [searchTerm, setSearchTerm] = useState("");

    // Filter users based on search term
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

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

            {/* Search Bar */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <TextField
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#666' }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        width: { xs: '100%', sm: '400px', md: '500px' },
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            borderRadius: 3,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                            '&:hover': {
                                boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
                            },
                            '&.Mui-focused': {
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            }
                        }
                    }}
                />
            </Box>

            {/* User List */}
            <Box
                className="no-scrollbar"
                data-testid="user-list-container"
                sx={{
                    height: 'calc(100vh - 520px)',
                    overflowY: 'auto',
                    '@media (max-width: 768px)': {
                        height: 'calc(100vh - 420px)',
                    }
                }}
            >
                <UserList
                    users={filteredUsers}
                    loading={loading}
                    isGroupView={true}
                />
            </Box>
        </Box>
    );
};

export default AlumniGroupView;
