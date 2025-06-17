import { useState } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Snackbar, LinearProgress, Typography } from "@mui/material";
import { Steps } from 'antd';
import { LoadingButton } from '@mui/lab';
import TreesCount from "./components/TreesCount";
import PurchaseSummary from "./components/PurchaseSummary";
import FileUploadField from "./components/FileUploadField";
import RazorpayComponent from "../../../../components/RazorpayComponent";
import PaymentQRInfo from "../../../../components/PaymentQRInfo";
import ApiClient from "../../../../api/apiClient/apiClient";
import { AWSUtils } from "../../../../helpers/aws";
import { GiftCard } from "../../../../types/gift_card";

const apiClient = new ApiClient();
const awsUtils = new AWSUtils();

type Props = {
    open: boolean;
    onClose: () => void;
    corporateName?: string;
    corporateLogo?: string;
    userName?: string;
    userEmail?: string;
    groupId?: number;
    onSuccess?: () => void;
}

type PaymentStatus = 'idle' | 'pending' | 'success' | 'failed';

const PurchaseTreesForm: React.FC<Props> = ({ 
    open, 
    onClose, 
    corporateName = '',
    corporateLogo = '',
    userName = '',
    userEmail = '',
    groupId,
    onSuccess,
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [treesCount, setTreesCount] = useState<number>(14);
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState<string>('');
    const [giftRequest, setGiftRequest] = useState<GiftCard | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
    const [giftRequestId, setGiftRequestId] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [uploadedFileUrl, setUploadedFileUrl] = useState<string>('');
    const RAZORPAY_LIMIT = 500000;
    const TREE_PRICE = 2000;

    const totalAmount = treesCount * TREE_PRICE;
    const isAboveLimit = totalAmount > RAZORPAY_LIMIT;

    const steps = [
        {
            title: 'Tree Count',
            content: (
                <Box sx={{ p: 2 }}>
                    <TreesCount isGifting={true}
                        isAboveLimit={isAboveLimit}
                        treesCount={treesCount}
                        onTreesCountChange={setTreesCount}
                    />
                </Box>
            ),
        },
        {
            title: 'Summary',
            content: (
                <PurchaseSummary
                    treesCount={treesCount}
                    corporateName={corporateName}
                    corporateLogo={corporateLogo}
                    userName={userName}
                    userEmail={userEmail}
                    treePrice={TREE_PRICE}
                />
            ),
        },
    ];

    const handleNext = () => {
        setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const handleSubmit = async () => {
        if (!groupId) {
            setError('Group ID is required');
            return;
        }

        try {
            setLoading(true);
            setError('');
            const response = await apiClient.createGiftCardRequestV2(
                groupId,
                userName,
                userEmail,
                treesCount,
                "3", // event type (General)
                "", // event name
                corporateName,
                ["Corporate", "PrePurchased"],
            );

            if (response.order_id) {
                setOrderId(response.order_id);
            }
            if (response.gift_request?.id) {
                setGiftRequest(response.gift_request);
                setGiftRequestId(response.gift_request.id.toString());
            }
            setPaymentStatus('pending');
        } catch (error) {
            console.error('Error creating gift card request:', error);
            setError('Failed to create order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = async () => {
        try {
            setPaymentStatus('success');
            setLoading(true);
            await apiClient.paymentSuccessForGiftRequest(Number(giftRequestId), true);
        } catch (error: any) {
            setError('Payment successful but failed to update status. Please contact support.');
            setPaymentStatus('failed');
        } finally {
            setLoading(false);
        }
        onSuccess?.(); 
    };

    const handlePaymentFailure = () => {
        setPaymentStatus('failed');
        setError('Payment failed. Please try again later or contact support.');
    };

    const handleRetryPayment = () => {
        setPaymentStatus('pending');
        setError('');
    };

    const handleClose = async () => {
        if (paymentStatus === 'pending' || paymentStatus === 'failed') {
            setError('Payment is mandatory to complete the order. The request will not be fulfilled without payment.');
            if (giftRequest) {
                try {
                    await apiClient.pathGiftCard(giftRequest.id, { tags: ['Corporate', 'PayLater'] }, ['tags']);
                } catch (error: any) {
                    setError('Failed to update your request to Pay Later');
                }
            }
        }

        onClose();
    };

    const handleBankTransferSubmit = async () => {
        if (!paymentProof) {
            setError('Please upload payment proof');
            return;
        }

        if (!giftRequest?.payment_id) {
            setError('Something went wrong. Please contact the 14trees team');
            return;
        }

        try {
            setLoading(true);
            setError('');
            
            // Upload payment proof to S3
            const fileUrl = await awsUtils.uploadFileToS3(
                "gift-request",
                paymentProof,
                `cards/${giftRequest.request_id}/payment_proof`,
                setUploadProgress
            );

            setUploadedFileUrl(fileUrl);

            // Create payment history
            await apiClient.createPaymentHistory(
                giftRequest.payment_id,
                totalAmount,
                "Net Banking",
                fileUrl
            );

            setPaymentStatus('success');
            onSuccess?.(); 
        } catch (error) {
            console.error('Error processing bank transfer:', error);
            setError('Failed to process payment proof. Please try again.');
            setPaymentStatus('failed');
        } finally {
            setLoading(false);
        }
    };

    const user: any = {
        name: userName,
        email: userEmail,
        phone: '',
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                Purchase Trees
            </DialogTitle>
            <DialogContent dividers>
                {paymentStatus === 'idle' && (
                    <Box sx={{ mb: 3 }}>
                        <Steps current={currentStep} items={steps.map(step => ({ title: step.title }))} />
                    </Box>
                )}
                {paymentStatus === 'idle' && steps[currentStep].content}
                {paymentStatus === 'pending' && (
                    <>
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            Order ID: {giftRequestId}.
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
                            orderId && <RazorpayComponent
                                amount={totalAmount}
                                orderId={orderId}
                                user={user}
                                description={`Purchase of ${treesCount} trees`}
                                onPaymentDone={handlePaymentSuccess}
                                onClose={handlePaymentFailure}
                            />
                        )}
                    </>
                )}
                {paymentStatus === 'success' && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        Payment successful! Gift Request ID: {giftRequestId}
                    </Alert>
                )}
                {paymentStatus === 'failed' && (
                    <>
                        <Alert severity="error" sx={{ mt: 2 }}>
                            Payment failed. The request will not be fulfilled without successful payment.
                            Please retry the payment or contact support if the issue persists.
                        </Alert>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="error" variant="outlined">
                    {giftRequestId ? 'Close' : 'Cancel'}
                </Button>
                {paymentStatus === 'idle' && (
                    <>
                        {currentStep > 0 && (
                            <Button onClick={handleBack} color="success" variant="outlined">
                                Back
                            </Button>
                        )}
                        {currentStep < steps.length - 1 ? (
                            <Button
                                onClick={handleNext}
                                color="success"
                                variant="contained"
                                disabled={treesCount < 1}
                            >
                                Next
                            </Button>
                        ) : (
                            <LoadingButton
                                loading={loading}
                                onClick={handleSubmit}
                                color="success"
                                variant="contained"
                                disabled={treesCount < 1}
                            >
                                Proceed to Payment
                            </LoadingButton>
                        )}
                    </>
                )}
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
                {paymentStatus === 'failed' && (
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

export default PurchaseTreesForm;

