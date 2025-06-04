import {
    Box,
    Typography,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Grid
} from "@mui/material";
import {
    Payments as DonationsIcon,
    CardGiftcard as GiftsIcon,
    AttachMoney as AmountIcon,
    Park as TreesIcon,
    EmojiEvents as ChampionIcon
} from "@mui/icons-material";

interface CampaignCardsProps {
    data?: {
        donationCount?: number;
        giftRequestCount?: number;
        totalAmount?: number;
        treesCount?: number;
        champions?: {
            name?: string;
            email?: string;
            referralDonationsCount?: number;
            amountRaised?: number;
            treesSponsored?: number;
        }[] | null;
    };
}

export const CampaignCards = ({ data }: CampaignCardsProps) => {
    const summaryCardStyle = {
        height: "100%",
        borderRadius: "15px",
        textAlign: "center",
        padding: { xs: "12px", sm: "16px" },
        background: "linear-gradient(145deg, #9faca3, #bdccc2)",
        boxShadow: "7px 7px 14px #9eaaa1,-7px -7px 14px #c4d4c9",
        mb: { xs: 2, sm: 0 }
    };

    const tableContainerStyle = {
        width: "100%",
        borderRadius: "15px",
        overflow: "hidden",
        boxShadow: "0px 2px 8px rgba(63, 83, 68, 0.1)",
    };

    const tableHeaderStyle = {
        backgroundColor: "#1f3625",
        color: "white",
        fontWeight: "bold",
    };

    const tableRowStyle = {
        '&:nth-of-type(odd)': {
            backgroundColor: '#f5f5f5',
        },
        '&:hover': {
            backgroundColor: '#e8f5e9',
        },
    };

    const safeData = data || {};
    const {
        donationCount = 0,
        giftRequestCount = 0,
        totalAmount = 0,
        treesCount = 0,
        champions = null
    } = safeData;

    // Helper function to format amount without decimals
    const formatAmount = (amount: number = 0) => {
        return Math.round(amount).toLocaleString();
    };

    return (
        <>
            {/* Title Section */}
            <Box sx={{ 
                textAlign: 'center', 
                mb: 2,
                position: 'relative'
            }}>
                <Typography 
                    variant="h4" 
                    sx={{ 
                        color: "#1f3625",
                        mb: 1,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                    }}
                >
                    Growing Impact, One Tree at a Time
                </Typography>
            </Box>

            {/* Summary Cards Row */}
            <Box sx={{ mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3} sx={{ mb: { xs: 2, sm: 0 } }}>
                        <Card sx={summaryCardStyle}>
                            <Box sx={{ paddingTop: { xs: "5px", sm: "10px" } }}>
                                <DonationsIcon sx={{ 
                                    fontSize: { xs: "2rem", sm: "large" },
                                    color: "#4CAF50" 
                                }} />
                                <Typography 
                                    variant="h3" 
                                    color="#fff" 
                                    sx={{ 
                                        pt: { xs: 0.5, sm: 1 }, 
                                        pb: { xs: 0.5, sm: 1 },
                                        fontSize: { xs: "2rem", sm: "3rem" }
                                    }}
                                >
                                    {donationCount}
                                </Typography>
                                <Typography 
                                    variant="subtitle2" 
                                    color="#1f3625"
                                    sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                                >
                                    No of donations
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} sx={{ mb: { xs: 2, sm: 0 } }}>
                        <Card sx={summaryCardStyle}>
                            <Box sx={{ paddingTop: { xs: "5px", sm: "10px" } }}>
                                <GiftsIcon sx={{ 
                                    fontSize: { xs: "2rem", sm: "large" },
                                    color: "#E91E63" 
                                }} />
                                <Typography 
                                    variant="h3" 
                                    color="#fff" 
                                    sx={{ 
                                        pt: { xs: 0.5, sm: 1 }, 
                                        pb: { xs: 0.5, sm: 1 },
                                        fontSize: { xs: "2rem", sm: "3rem" }
                                    }}
                                >
                                    {giftRequestCount}
                                </Typography>
                                <Typography 
                                    variant="subtitle2" 
                                    color="#1f3625"
                                    sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                                >
                                    No of gift requests
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} sx={{ mb: { xs: 2, sm: 0 } }}>
                        <Card sx={summaryCardStyle}>
                            <Box sx={{ paddingTop: { xs: "5px", sm: "10px" } }}>
                                <AmountIcon sx={{ 
                                    fontSize: { xs: "2rem", sm: "large" },
                                    color: "#FF9800" 
                                }} />
                                <Typography 
                                    variant="h3" 
                                    color="#fff" 
                                    sx={{ 
                                        pt: { xs: 0.5, sm: 1 }, 
                                        pb: { xs: 0.5, sm: 1 },
                                        fontSize: { xs: "2rem", sm: "3rem" }
                                    }}
                                >
                                    {formatAmount(totalAmount)}
                                </Typography>
                                <Typography 
                                    variant="subtitle2" 
                                    color="#1f3625"
                                    sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                                >
                                    Amount Raised (₹)
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} sx={{ mb: { xs: 2, sm: 0 } }}>
                        <Card sx={summaryCardStyle}>
                            <Box sx={{ paddingTop: { xs: "5px", sm: "10px" } }}>
                                <TreesIcon sx={{ 
                                    fontSize: { xs: "2rem", sm: "large" },
                                    color: "#1F3625" 
                                }} />
                                <Typography 
                                    variant="h3" 
                                    color="#fff" 
                                    sx={{ 
                                        pt: { xs: 0.5, sm: 1 }, 
                                        pb: { xs: 0.5, sm: 1 },
                                        fontSize: { xs: "2rem", sm: "3rem" }
                                    }}
                                >
                                    {treesCount}
                                </Typography>
                                <Typography 
                                    variant="subtitle2" 
                                    color="#1f3625"
                                    sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                                >
                                    No of Trees Nurtured
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            {/* Champions Table */}
            {champions && champions.length > 0 && (
                <Box sx={{ textAlign: 'center', mt: 12 }}>
                    <Typography variant="h4" color="#1f3625" sx={{ mb: 2 }}>
                        <ChampionIcon sx={{ verticalAlign: 'middle', marginRight: 1, color: "#FFC107" }} />
                        Campaign Champions
                    </Typography>

                    <TableContainer component={Paper} sx={tableContainerStyle}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={tableHeaderStyle}>Rank</TableCell>
                                    <TableCell sx={tableHeaderStyle}>Name</TableCell>
                                    <TableCell sx={tableHeaderStyle}>Amount Raised (₹)</TableCell>
                                    <TableCell sx={tableHeaderStyle}>Trees Sponsored</TableCell>
                                    <TableCell sx={tableHeaderStyle}>Memories Planted</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {champions.map((champion, index) => (
                                    <TableRow key={index} sx={tableRowStyle}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{champion.name || 'Unknown'}</TableCell>
                                        <TableCell>{formatAmount(champion.amountRaised)}</TableCell>
                                        <TableCell>{champion.treesSponsored || 0}</TableCell>
                                        <TableCell>{champion.referralDonationsCount || 0}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}
        </>
    );
};