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
    Paper
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
        width: "100%",
        maxWidth: "220px",
        minHeight: "170px",
        borderRadius: "15px",
        textAlign: "center",
        padding: "16px",
        margin: "15px",
        background: "linear-gradient(145deg, #9faca3, #bdccc2)",
        boxShadow: "7px 7px 14px #9eaaa1,-7px -7px 14px #c4d4c9",
    };

    const tableContainerStyle = {
        width: "100%",
        maxWidth: "1000px",
        margin: "20px auto",
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
            {/* Summary Cards Row */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginBottom: '20px'
            }}>
                <Card sx={summaryCardStyle}>
                    <Box sx={{ paddingTop: "10px" }}>
                        <DonationsIcon fontSize="large" sx={{ color: "#4CAF50" }} />
                        <Typography variant="h3" color="#fff" sx={{ pt: 1, pb: 1 }}>
                            {donationCount}
                        </Typography>
                        <Typography variant="subtitle2" color="#1f3625">
                            No of donations
                        </Typography>
                    </Box>
                </Card>

                <Card sx={summaryCardStyle}>
                    <Box sx={{ paddingTop: "10px" }}>
                        <GiftsIcon fontSize="large" sx={{ color: "#E91E63" }} />
                        <Typography variant="h3" color="#fff" sx={{ pt: 1, pb: 1 }}>
                            {giftRequestCount}
                        </Typography>
                        <Typography variant="subtitle2" color="#1f3625">
                            No of gift requests
                        </Typography>
                    </Box>
                </Card>

                <Card sx={summaryCardStyle}>
                    <Box sx={{ paddingTop: "10px" }}>
                        <AmountIcon fontSize="large" sx={{ color: "#FF9800" }} />
                        <Typography variant="h3" color="#fff" sx={{ pt: 1, pb: 1 }}>
                            {formatAmount(totalAmount)}
                        </Typography>
                        <Typography variant="subtitle2" color="#1f3625">
                            Amount Raised (₹)
                        </Typography>
                    </Box>
                </Card>

                <Card sx={summaryCardStyle}>
                    <Box sx={{ paddingTop: "10px" }}>
                        <TreesIcon fontSize="large" sx={{ color: "#1F3625" }} />
                        <Typography variant="h3" color="#fff" sx={{ pt: 1, pb: 1 }}>
                            {treesCount}
                        </Typography>
                        <Typography variant="subtitle2" color="#1f3625">
                            No of Trees Nurtured
                        </Typography>
                    </Box>
                </Card>
            </Box>

            {/* Champions Table */}
            {champions && champions.length > 0 && (
                <Box sx={{ textAlign: 'center', margin: '30px 0' }}>
                    <Typography variant="h4" color="#1f3625" sx={{ mb: 3 }}>
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
                                    <TableCell sx={tableHeaderStyle}>Referral Donations</TableCell>
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