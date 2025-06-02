import {
    Box,
    Typography,
    Card
} from "@mui/material";
import {
    People as PersonalIcon,
    Campaign as CampaignIcon,
    Groups as TotalIcon
} from "@mui/icons-material";

interface ReferralCardsProps {
    data?: {
        personalReferrals?: number;
        campaignReferrals?: number;
        totalReferrals?: number;
    };
}

export const ReferralCards = ({ data }: ReferralCardsProps) => {
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
        transition: "transform 0.3s ease",
        '&:hover': {
            transform: "scale(1.03)"
        }
    };

    const safeData = data || {};
    const {
        personalReferrals = 0,
        campaignReferrals = 0,
        totalReferrals = 0
    } = safeData;

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginBottom: '20px',
            padding: '20px',
            backgroundColor: 'transparent' // Ensure no background
        }}>
            {/* Personal Referrals Card */}
            <Card sx={summaryCardStyle}>
                <Box sx={{ paddingTop: "10px" }}>
                    <PersonalIcon fontSize="large" sx={{ color: "#4CAF50" }} />
                    <Typography variant="h3" color="#fff" sx={{ pt: 1, pb: 1 }}>
                        {personalReferrals}
                    </Typography>
                    <Typography variant="subtitle2" color="#1f3625">
                        Personal Referrals
                    </Typography>
                </Box>
            </Card>

            {/* Campaign Referrals Card */}
            <Card sx={summaryCardStyle}>
                <Box sx={{ paddingTop: "10px" }}>
                    <CampaignIcon fontSize="large" sx={{ color: "#E91E63" }} />
                    <Typography variant="h3" color="#fff" sx={{ pt: 1, pb: 1 }}>
                        {campaignReferrals}
                    </Typography>
                    <Typography variant="subtitle2" color="#1f3625">
                        Campaign Referrals
                    </Typography>
                </Box>
            </Card>

            {/* Total Referrals Card */}
            <Card sx={summaryCardStyle}>
                <Box sx={{ paddingTop: "10px" }}>
                    <TotalIcon fontSize="large" sx={{ color: "#1F3625" }} />
                    <Typography variant="h3" color="#fff" sx={{ pt: 1, pb: 1 }}>
                        {totalReferrals}
                    </Typography>
                    <Typography variant="subtitle2" color="#1f3625">
                        Total Referrals
                    </Typography>
                </Box>
            </Card>
        </Box>
    );
};