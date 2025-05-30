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
    Person as UserIcon
} from "@mui/icons-material";

interface ReferralUserCardsProps {
    data?: {
        totalRaised?: number;
        totalTrees?: number;
        donations?: {
            donorName?: string;
            donationTypeLabel?: string;
            treesCount?: number;
            amount?: number;
        }[];
        gifts?: {
            giftedByName?: string;
            treesCount?: number;
            amount?: number;
        }[];
    };
}

export const ReferralUserCards = ({ data }: ReferralUserCardsProps) => {
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
        totalRaised = 0,
        totalTrees = 0,
        donations = [],
        gifts = []
    } = safeData;

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
                        <AmountIcon fontSize="large" sx={{ color: "#FF9800" }} />
                        <Typography variant="h3" color="#fff" sx={{ pt: 1, pb: 1 }}>
                            {Math.round(totalRaised).toLocaleString()}
                        </Typography>
                        <Typography variant="subtitle2" color="#1f3625">
                            Total Raised (₹)
                        </Typography>
                    </Box>
                </Card>

                <Card sx={summaryCardStyle}>
                    <Box sx={{ paddingTop: "10px" }}>
                        <TreesIcon fontSize="large" sx={{ color: "#1F3625" }} />
                        <Typography variant="h3" color="#fff" sx={{ pt: 1, pb: 1 }}>
                            {totalTrees}
                        </Typography>
                        <Typography variant="subtitle2" color="#1f3625">
                            Total Trees Sponsored
                        </Typography>
                    </Box>
                </Card>

                <Card sx={summaryCardStyle}>
                    <Box sx={{ paddingTop: "10px" }}>
                        <UserIcon fontSize="large" sx={{ color: "#2196F3" }} />
                        <Typography variant="h3" color="#fff" sx={{ pt: 1, pb: 1 }}>
                            {donations.length + gifts.length}
                        </Typography>
                        <Typography variant="subtitle2" color="#1f3625">
                            Total Contributions
                        </Typography>
                    </Box>
                </Card>
            </Box>

            {/* Donations Table */}
            {donations.length > 0 && (
                <Box sx={{ textAlign: 'center', margin: '30px 0' }}>
                    <Typography variant="h4" color="#1f3625" sx={{ mb: 3 }}>
                        <DonationsIcon sx={{ verticalAlign: 'middle', marginRight: 1, color: "#4CAF50" }} />
                        Donation Contributions
                    </Typography>

                    <TableContainer component={Paper} sx={tableContainerStyle}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={tableHeaderStyle}>Donor Name</TableCell>
                                    <TableCell sx={tableHeaderStyle}>Contribution Type</TableCell>
                                    <TableCell sx={tableHeaderStyle}>Amount (₹)</TableCell>
                                    <TableCell sx={tableHeaderStyle}>Trees</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {donations.map((donation, index) => (
                                    <TableRow key={index} sx={tableRowStyle}>
                                        <TableCell>{donation.donorName || 'Anonymous'}</TableCell>
                                        <TableCell>{donation.donationTypeLabel}</TableCell>
                                        <TableCell>{donation.amount || 0}</TableCell>
                                        <TableCell>{donation.treesCount || 0}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Gifts Table */}
            {gifts.length > 0 && (
                <Box sx={{ textAlign: 'center', margin: '30px 0' }}>
                    <Typography variant="h4" color="#1f3625" sx={{ mb: 3 }}>
                        <GiftsIcon sx={{ verticalAlign: 'middle', marginRight: 1, color: "#E91E63" }} />
                        Gift Contributions
                    </Typography>

                    <TableContainer component={Paper} sx={tableContainerStyle}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={tableHeaderStyle}>Gifted By</TableCell>
                                    <TableCell sx={tableHeaderStyle}>Amount (₹)</TableCell>
                                    <TableCell sx={tableHeaderStyle}>Trees</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {gifts.map((gift, index) => (
                                    <TableRow key={index} sx={tableRowStyle}>
                                        <TableCell>{gift.giftedByName || 'Anonymous'}</TableCell>
                                        <TableCell>{gift.amount || 0}</TableCell>
                                        <TableCell>{gift.treesCount || 0}</TableCell>
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