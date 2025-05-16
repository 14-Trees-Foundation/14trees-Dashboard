import { Event, ParkOutlined, People } from "@mui/icons-material";
import { Box, Paper, Typography, useTheme } from "@mui/material";
import DynamicTable from "../../../components/dynamic/Table";

interface GiftFormDetailsProps {
    data: any
}

const GiftFormDetails: React.FC<GiftFormDetailsProps> = ({ data }) => {
    const theme = useTheme();

    return (
        <div>
            {/* Donor Details */}
            {(data.sponsor_name || data.sponsor_email) && <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ParkOutlined sx={{ color: '#2e7d32' }} /> Sponsor Details
                </Typography>
                <Box sx={{ ml: 4 }}>
                    {data.sponsor_name && <Typography sx={{ mb: 1 }}><strong>Name:</strong> {data.sponsor_name}</Typography>}
                    {data.sponsor_email && <Typography><strong>Email:</strong> {data.sponsor_email}</Typography>}
                </Box>
            </Paper>}

            {data.recipients && <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <People sx={{ color: '#2e7d32' }} /> Gift Recipients
                </Typography>
                <DynamicTable data={data.recipients} />
            </Paper>}

            {(data.occasion_name || data.occasion_type) && <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Event sx={{ color: '#2e7d32' }} /> Occasion Details
                </Typography>
                <Box sx={{ ml: 4 }}>
                    {data.occasion_name && <Typography sx={{ mb: 1 }}><strong>Occasion Name:</strong> {data.occasion_name}</Typography>}
                    {data.occasion_type && <Typography><strong>Occasion Type:</strong> {data.occasion_type}</Typography>}
                    {data.gifted_by && <Typography><strong>Gifted By:</strong> {data.gifted_by}</Typography>}
                    {data.gifted_on && <Typography><strong>Gifted On:</strong> {data.gifted_on}</Typography>}
                </Box>
            </Paper>}
        </div>
    );
}

export default GiftFormDetails;