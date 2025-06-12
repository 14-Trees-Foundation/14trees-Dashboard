import { Box, Typography, Paper, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
}));

const SummaryRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
}));

const Label = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontWeight: 500,
}));

const Value = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
}));

const TotalAmount = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
}));

interface PurchaseSummaryProps {
    treesCount: number;
    corporateName: string;
    corporateLogo?: string;
    userName: string;
    userEmail: string;
    treePrice: number;
}

const PurchaseSummary: React.FC<PurchaseSummaryProps> = ({
    treesCount,
    corporateName,
    corporateLogo,
    userName,
    userEmail,
    treePrice,
}) => {
    const totalAmount = treesCount * treePrice;

    return (
        <Box sx={{ p: 2 }}>
            <StyledPaper elevation={0}>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                    Purchase Summary
                </Typography>

                <Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: 'success.main', fontWeight: 600 }}>
                        Order Details
                    </Typography>
                    <SummaryRow>
                        <Label>Number of Trees</Label>
                        <Value>{treesCount}</Value>
                    </SummaryRow>
                    <SummaryRow>
                        <Label>Price per Tree</Label>
                        <Value>₹{treePrice.toLocaleString()}</Value>
                    </SummaryRow>
                    <TotalAmount>
                        <SummaryRow>
                            <Label variant="h6">Total Amount</Label>
                            <Value variant="h6" sx={{ color: 'success.main' }}>
                                ₹{totalAmount.toLocaleString()}
                            </Value>
                        </SummaryRow>
                    </TotalAmount>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: 'success.main', fontWeight: 600 }}>
                        Corporate Details
                    </Typography>
                    <SummaryRow>
                        <Label>Corporate Name</Label>
                        <Value>{corporateName}</Value>
                    </SummaryRow>
                    {corporateLogo && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                            <Box
                                component="img"
                                src={corporateLogo}
                                alt="Corporate Logo"
                                sx={{ maxWidth: 200, maxHeight: 100, objectFit: 'contain' }}
                            />
                        </Box>
                    )}
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: 'success.main', fontWeight: 600 }}>
                        User Details
                    </Typography>
                    <SummaryRow>
                        <Label>Name</Label>
                        <Value>{userName}</Value>
                    </SummaryRow>
                    <SummaryRow>
                        <Label>Email</Label>
                        <Value>{userEmail}</Value>
                    </SummaryRow>
                </Box>
            </StyledPaper>
        </Box>
    );
};

export default PurchaseSummary; 