import { Box, Typography, Card, CardContent, useMediaQuery, useTheme } from "@mui/material";
import { Group } from "../../../types/Group";
import CSRGiftTrees from "./CSRGiftTrees";
import CSRHeader from "./CSRHeader";
import { useState } from "react";
import { CorporateFare, Analytics, Forest, NaturePeople } from "@mui/icons-material";

interface Props {}

const CSRAdminPage: React.FC<Props> = ({}) => {
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box>
            <CSRHeader groupId={undefined} onGroupChange={group => setSelectedGroup(group)} />
            {selectedGroup ? (
                <CSRGiftTrees
                    groupId={selectedGroup.id}
                    selectedGroup={selectedGroup}
                />
            ) : (
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    minHeight: '60vh',
                    px: isMobile ? 2 : 4,
                    py: 4
                }}>
                    <CorporateFare 
                        sx={{ 
                            fontSize: isMobile ? 80 : 120, 
                            color: theme.palette.primary.main, 
                            mb: 3,
                            opacity: 0.7
                        }} 
                    />
                    
                    <Typography 
                        variant={isMobile ? "h5" : "h4"} 
                        align="center" 
                        gutterBottom
                        sx={{ 
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            mb: 2
                        }}
                    >
                        Welcome to Corporate Climate Action Dashboard
                    </Typography>
                    
                    <Typography 
                        variant={isMobile ? "body1" : "h6"} 
                        align="center" 
                        sx={{ 
                            color: theme.palette.text.secondary,
                            mb: 4,
                            maxWidth: '600px',
                            lineHeight: 1.6
                        }}
                    >
                        Please select a corporate group from the dropdown above to view their dedicated climate action dashboard and manage their tree gifting programs.
                    </Typography>

                    <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                        gap: 3,
                        maxWidth: '800px',
                        width: '100%'
                    }}>
                        <Card sx={{ 
                            background: 'linear-gradient(145deg, #e8f5e8, #f0f8f0)',
                            border: '1px solid #e0e0e0',
                            borderRadius: 2,
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: theme.shadows[4]
                            }
                        }}>
                            <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                <Analytics sx={{ fontSize: 40, color: '#2e7d32', mb: 2 }} />
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                    View Analytics
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Track tree gifting progress, inventory status, and environmental impact metrics
                                </Typography>
                            </CardContent>
                        </Card>

                        <Card sx={{ 
                            background: 'linear-gradient(145deg, #e8f5e8, #f0f8f0)',
                            border: '1px solid #e0e0e0',
                            borderRadius: 2,
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: theme.shadows[4]
                            }
                        }}>
                            <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                <Forest sx={{ fontSize: 40, color: '#388e3c', mb: 2 }} />
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                    Manage Trees
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Gift trees individually or in bulk, and manage your organization's green tribute wall
                                </Typography>
                            </CardContent>
                        </Card>

                        <Card sx={{ 
                            background: 'linear-gradient(145deg, #e8f5e8, #f0f8f0)',
                            border: '1px solid #e0e0e0',
                            borderRadius: 2,
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: theme.shadows[4]
                            }
                        }}>
                            <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                <NaturePeople sx={{ fontSize: 40, color: '#43a047', mb: 2 }} />
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                    Track Recipients
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    View all gifted trees with recipient details and access their tree dashboards
                                </Typography>
                            </CardContent>
                        </Card>

                        <Card sx={{ 
                            background: 'linear-gradient(145deg, #e8f5e8, #f0f8f0)',
                            border: '1px solid #e0e0e0',
                            borderRadius: 2,
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: theme.shadows[4]
                            }
                        }}>
                            <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                <CorporateFare sx={{ fontSize: 40, color: '#4caf50', mb: 2 }} />
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                    Share Dashboard
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Create shareable links and manage access permissions for stakeholders
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>

                    <Box sx={{ 
                        mt: 4, 
                        p: 3, 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: 2,
                        border: '1px solid #e9ecef',
                        maxWidth: '600px',
                        width: '100%'
                    }}>
                        <Typography variant="body2" align="center" sx={{ 
                            color: theme.palette.text.secondary,
                            fontStyle: 'italic'
                        }}>
                            💡 <strong>Tip:</strong> Use the search functionality in the dropdown above to quickly find your organization. 
                            You can search by organization name to filter the results.
                        </Typography>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default CSRAdminPage;