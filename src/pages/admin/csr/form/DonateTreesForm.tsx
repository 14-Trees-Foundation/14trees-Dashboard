import { useState } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Snackbar, LinearProgress, Typography } from "@mui/material";
import { Steps } from 'antd';
import { LoadingButton } from '@mui/lab';
import TreesCount from "./components/TreesCount";
import DonationSummary from "./components/DonationSummary";
import FileUploadField from "./components/FileUploadField";
import RazorpayComponent from "../../../../components/RazorpayComponent";
import PaymentQRInfo from "../../../../components/PaymentQRInfo";
import ApiClient from "../../../../api/apiClient/apiClient";
import { AWSUtils } from "../../../../helpers/aws";
import { GiftCard } from "../../../../types/gift_card";
import CSVUploadSection from "../components/DonationCSV"

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

const DonationTreesForm: React.FC<Props> = ({
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
    const [donationId, setDonationId] = useState<string>(''); // Changed from giftRequestId
    const [donationData, setDonationData] = useState<any>(null);
    const [donationRequest, setDonationRequest] = useState<any>(null);
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
    const [recipients, setRecipients] = useState<any[]>([]);
    const [error, setError] = useState<string>('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [uploadedFileUrl, setUploadedFileUrl] = useState<string>('');
    const [csvValidation, setCsvValidation] = useState({
        isValid: true,
        isUploaded: false,
        error: ''
    });
    const RAZORPAY_LIMIT = 500000;
    const TREE_PRICE = 1500;

    const totalAmount = treesCount * TREE_PRICE;
    const isAboveLimit = totalAmount > RAZORPAY_LIMIT;

    const steps = [
        {
            title: 'Tree Count',
            content: (
                <Box sx={{ p: 2 }}>
                    <TreesCount
                        isAboveLimit={isAboveLimit}
                        treesCount={treesCount}
                        onTreesCountChange={setTreesCount}
                    />
                </Box>
            ),
        },
        {
            title: 'Upload CSV',
            content: (
                <Box sx={{ p: 2 }}>
                    <CSVUploadSection
                        onValidationChange={(isValid, isUploaded, error) => {
                            setCsvValidation({
                                isValid,
                                isUploaded,
                                error
                            });
                        }}
                        onRecipientsChange={(recipients) => {
                            setRecipients(recipients);
                        }}
                        totalTreesSelected={treesCount}
                    />

                </Box>
            ),
        },
        {
            title: 'Summary',
            content: (
                <DonationSummary
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
        // If we're moving to the CSV upload step, reset validation
        if (currentStep === 0) {
            setCsvValidation({
                isValid: true,
                isUploaded: false,
                error: ''
            });
        }
        setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const handleSubmit = async () => {
        // Validate required fields
        if (!user?.name || !userEmail) {
            setError('Logged-in user name and email are required');
            return;
        }
        if (!treesCount || treesCount <= 0) {
            setError('Tree count must be greater than 0');
            return;
        }
    
        try {
            setLoading(true);
            setError('');
    
            // Prepare the exact payload structure expected by backend
            const response = await apiClient.createDonationV2(
                user.name,
                userEmail,
                treesCount,
                totalAmount,
                undefined,
                ["Corporate"],
                recipients?.length ? recipients.map(r => ({
                  recipient_name: r.name,
                  recipient_email: r.email,
                  recipient_phone: r.phone,
                  assignee_name: r.assigneeName || r.name,
                  assignee_email: r.assigneeEmail || r.email,
                  assignee_phone: r.assigneePhone || r.email,
                  trees_count: r.trees_count ||  1,
                  image_url: r.image_url,
                })) : undefined,
                groupId ? groupId.toString() : undefined
              );
    
            // Handle response
            if (response.order_id) {
                setOrderId(response.order_id);
            }
            if (response.donation?.id) {
                setDonationId(response.donation.id.toString());
                setDonationRequest(response.donation)
            }
            setPaymentStatus('pending');
        } catch (error: any) {
            console.error('Error creating donation:', error);
            setError(error.message || 'Failed to create donation. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = async () => {
        try {
            setPaymentStatus('success');
            setLoading(true);

            await apiClient.paymentSuccessForDonation(
                Number(donationId),
                true
            );

            onSuccess?.();
        } catch (error: any) {
            setError(error.message || 'Payment successful but failed to update status. Please contact support.');
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

        if (!donationRequest?.payment_id) {
            setError('Something went wrong. Please contact the 14trees team');
            return;
        }

        try {
            setLoading(true);
            setError('');

            // Upload payment proof to S3
            const fileUrl = await awsUtils.uploadFileToS3(
                "donation-request",
                paymentProof,
                `cards/${donationRequest.request_id}/payment_proof`,
                setUploadProgress
            );

            setUploadedFileUrl(fileUrl);

            // Create payment history
            await apiClient.createPaymentHistory(
                donationRequest.payment_id,
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

    // Determine if Next button should be disabled
    const isNextDisabled = () => {
        if (currentStep === 1) { // CSV Upload step
            return !csvValidation.isValid;
        }
        return false;
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                Donate Trees
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
                            Order ID: {donationId}.
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
                        Payment successful! Gift Request ID: {donationId}
                    </Alert>
                )}
                {paymentStatus === 'failed' && (
                    <>
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            Order ID: {donationId}.
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
                    {donationId ? 'Close' : 'Cancel'}
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
                                disabled={treesCount < 1 || isNextDisabled()}
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

export default DonationTreesForm;