import { useState } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Snackbar, Typography } from "@mui/material";
import { LoadingButton } from '@mui/lab';
import RazorpayComponent from "../../../../components/RazorpayComponent";
import PaymentQRInfo from "../../../../components/PaymentQRInfo";
import FileUploadField from "../form/components/FileUploadField";
import ApiClient from "../../../../api/apiClient/apiClient";
import { AWSUtils } from "../../../../helpers/aws";
import { Payment } from "../../../../types/payment";
import { User } from "../../../../types/user";

const apiClient = new ApiClient();
const awsUtils = new AWSUtils();

type PaymentType = 'gift' | 'donation';

interface PaymentDialogProps {
    open: boolean;
    onClose: () => void;
    paymentId: number;
    type: PaymentType;
    requestId: string;
    totalAmount: number;
    userName: string;
    userEmail: string;
    onPaymentSuccess: () => void;
    // Optional fields for specific types
    giftRequestId?: number;
    donationId?: number;
}

type PaymentStatus = 'idle' | 'pending' | 'success' | 'failed';

const PaymentDialog: React.FC<PaymentDialogProps> = ({
    open,
    onClose,
    paymentId,
    type,
    requestId,
    totalAmount,
    userName,
    userEmail,
    onPaymentSuccess,
    giftRequestId,
    donationId
}) => {
    const [loading, setLoading] = useState(false);
    const [payment, setPayment] = useState<Payment | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
    const [error, setError] = useState<string>('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [uploadedFileUrl, setUploadedFileUrl] = useState<string>('');
    const RAZORPAY_LIMIT = 500000;

    const isAboveLimit = totalAmount > RAZORPAY_LIMIT;
    const referenceId = type === 'gift' ? giftRequestId : donationId;

    const fetchPayment = async () => {
        try {
            setLoading(true);
            setError('');
            const paymentData = await apiClient.getPayment(paymentId);
            setPayment(paymentData);
            setPaymentStatus('pending');
        } catch (error: any) {
            console.error('Error fetching payment:', error);
            setError('Failed to fetch payment details. Please try again.');
            setPaymentStatus('failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = async () => {
        try {
            setPaymentStatus('success');
            setLoading(true);
            
            if (type === 'gift' && giftRequestId) {
                await apiClient.paymentSuccessForGiftRequest(giftRequestId, true);
            } else if (type === 'donation' && donationId) {
                await apiClient.paymentSuccessForDonation(donationId, true);
            }
            
            onPaymentSuccess();
        } catch (error: any) {
            console.error('Error updating payment status:', error);
            setError('Payment successful but failed to update status. Please contact support.');
            setPaymentStatus('failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentFailure = () => {
        setPaymentStatus('failed');
        setError('Payment failed. Please try again later or contact support.');
    };

    const handleRetryPayment = () => {
        setPaymentStatus('pending');
        setError('');
    };

    const handleClose = () => {
        if (paymentStatus === 'pending') {
            setError('Payment is required to complete the order. You can make the payment later.');
        }
        onClose();
    };

    const handleBankTransferSubmit = async () => {
        if (!paymentProof) {
            setError('Please upload payment proof');
            return;
        }

        try {
            setLoading(true);
            setError('');
            
            // Upload payment proof to S3
            const fileUrl = await awsUtils.uploadFileToS3(
                "gift-request",
                paymentProof,
                `${requestId}/payment_proof`,
                setUploadProgress
            );

            setUploadedFileUrl(fileUrl);

            // Create payment history
            await apiClient.createPaymentHistory(
                paymentId,
                totalAmount,
                "Net Banking",
                fileUrl
            );

            setPaymentStatus('success');
            onPaymentSuccess();
        } catch (error) {
            console.error('Error processing bank transfer:', error);
            setError('Failed to process payment proof. Please try again.');
            setPaymentStatus('failed');
        } finally {
            setLoading(false);
        }
    };

    // Fetch payment details when dialog opens
    useState(() => {
        if (open && paymentId) {
            fetchPayment();
        }
    });

    const user: User = {
        key: 0,
        id: 0,
        name: userName,
        user_id: '',
        phone: '',
        email: userEmail,
        communication_email: userEmail,
        birth_date: null,
        created_at: new Date(),
        updated_at: new Date()
    };

    const getDescription = () => {
        if (type === 'gift') {
            return `Payment for gift request ${giftRequestId}`;
        }
        return `Payment for donation ${donationId}`;
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                Make Payment
            </DialogTitle>
            <DialogContent dividers>
                {paymentStatus === 'pending' && (
                    <>
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            {type === 'gift' ? 'Gift Request' : 'Donation'} ID: {referenceId}.
                            Payment is required to complete the order!
                        </Alert>
                        {isAboveLimit ? (
                            <Box sx={{ mt: 3 }}>
                                <PaymentQRInfo />
                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Upload Payment Proof
                                    </Typography>
                                    <FileUploadField
                                        value={paymentProof}
                                        onChange={setPaymentProof}
                                        onUploadProgress={setUploadProgress}
                                        uploadedFileUrl={uploadedFileUrl}
                                        disabled={loading}
                                    />
                                </Box>
                            </Box>
                        ) : (
                            payment?.order_id && <RazorpayComponent
                                amount={totalAmount}
                                orderId={payment.order_id}
                                user={user}
                                description={getDescription()}
                                onPaymentDone={handlePaymentSuccess}
                                onClose={handlePaymentFailure}
                            />
                        )}
                    </>
                )}
                {paymentStatus === 'success' && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        Payment successful! {type === 'gift' ? 'Gift Request' : 'Donation'} ID: {referenceId}
                    </Alert>
                )}
                {paymentStatus === 'failed' && (
                    <>
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            {type === 'gift' ? 'Gift Request' : 'Donation'} ID: {referenceId}.
                            Payment is required to complete the order!
                        </Alert>
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="error" variant="outlined">
                    {referenceId ? 'Close' : 'Cancel'}
                </Button>
                {paymentStatus === 'pending' && isAboveLimit && (
                    <LoadingButton
                        loading={loading}
                        onClick={handleBankTransferSubmit}
                        color="success"
                        variant="contained"
                        disabled={!paymentProof}
                    >
                        Submit Payment Proof
                    </LoadingButton>
                )}
                {paymentStatus === 'failed' && !isAboveLimit && (
                    <Button
                        onClick={handleRetryPayment}
                        color="success"
                        variant="contained"
                    >
                        Retry Payment
                    </Button>
                )}
            </DialogActions>
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError('')}
            >
                <Alert onClose={() => setError('')} severity="warning" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Dialog>
    );
};

export default PaymentDialog; 