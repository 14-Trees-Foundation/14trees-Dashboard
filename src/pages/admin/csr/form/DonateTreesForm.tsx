import { useRef, useState, useEffect } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Snackbar, LinearProgress, Typography, Tabs, Tab } from "@mui/material";
import { Steps } from 'antd';
import { LoadingButton } from '@mui/lab';
import TreesCount from "./components/TreesCount";
import DonationSummary from "./components/DonationSummary";
import FileUploadField from "./components/FileUploadField";
import RazorpayComponent from "../../../../components/RazorpayComponent";
import PaymentQRInfo from "../../../../components/PaymentQRInfo";
import ApiClient from "../../../../api/apiClient/apiClient";
import { AWSUtils } from "../../../../helpers/aws";
import CSVUploadSection from "../components/DonationCSV";
import ManualDonationAdd from "../components/DonationManual";
import { getUniqueRequestId } from "../../../../helpers/utils";

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
    const [donationId, setDonationId] = useState<string>('');
    const [donationRequest, setDonationRequest] = useState<any>(null);
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
    const [recipients, setRecipients] = useState<any[]>([]);
    const [manualDonation, setManualDonation] = useState<any[]>([]);
    const [manualDonationErrors, setManualDonationErrors] = useState<Record<string, string>>({});
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isMountedRef = useRef(true);
    const [inputMethod, setInputMethod] = useState<'csv' | 'manual' | 'skip'>('csv');
    const [error, setError] = useState<string>('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [uploadedFileUrl, setUploadedFileUrl] = useState<string>('');
    const [requestId, setRequestId] = useState<string>(getUniqueRequestId());
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [csvValidation, setCsvValidation] = useState({
        isValid: true,
        isUploaded: false,
        error: ''
    });
    const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});
    const RAZORPAY_LIMIT = 500000;
    const TREE_PRICE = 1500;

    const totalAmount = treesCount * TREE_PRICE;
    const isAboveLimit = totalAmount > RAZORPAY_LIMIT;

    // Cleanup effect to prevent memory leaks
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // Safe callback for upload progress that checks if component is mounted
    const safeSetUploadProgress = (progress: number) => {
        if (isMountedRef.current) {
            setUploadProgress(progress);
        }
    };

    // Safe callbacks for child components
    const safeOnValidationChange = (isValid: boolean, isUploaded: boolean, error: string) => {
        if (isMountedRef.current) {
            setCsvValidation({ isValid, isUploaded, error });
        }
    };

    const safeOnRecipientsChange = (recipients: any[]) => {
        if (isMountedRef.current) {
            setRecipients(recipients);
        }
    };

    const safeSetPaymentProof = (file: File | null) => {
        if (isMountedRef.current) {
            setPaymentProof(file);
        }
    };

    const safeSetError = (errorMessage: string) => {
        if (isMountedRef.current) {
            setError(errorMessage);
        }
    };

    const safeSetManualDonation = (donations: any[]) => {
        if (isMountedRef.current) {
            setManualDonation(donations);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
      
        const date = new Date().toISOString().split("T")[0];
        try {
          if (!isMountedRef.current) return;
          setIsUploading(true);
          const awsService = new AWSUtils();
          const imageUrl = await awsService.uploadFileToS3("gift-request", file, date);
          
          if (!isMountedRef.current) return;
          setManualDonation(prev => [
            ...prev,
            {
              image_file: file,
              profile_image: imageUrl,
            }
          ]);
      
          setManualDonationErrors(prev => ({ ...prev, image_file: '' }));
        } catch (error) {
          console.error('Failed to upload image:', error);
          if (!isMountedRef.current) return;
          setManualDonationErrors(prev => ({ ...prev, image_file: 'Failed to upload image' }));
        } finally {
          if (isMountedRef.current) {
            setIsUploading(false);
          }
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      };

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
            title: 'Recipient Details',
            content: (
                <Box sx={{ p: 2 }}>
                    <Tabs
                        value={inputMethod}
                        onChange={(_, v) => setInputMethod(v)}
                        sx={{ mb: 2, '.MuiTabs-flexContainer': { justifyContent: 'center' } }}
                        variant="fullWidth"
                    >
                        <Tab label="Upload CSV" value="csv" sx={{ fontWeight: 600, fontSize: 16 }} />
                        <Tab label="Add Manually" value="manual" sx={{ fontWeight: 600, fontSize: 16 }} />
                        <Tab label="Skip (Assign Later)" value="skip" sx={{ fontWeight: 600, fontSize: 16 }} />
                    </Tabs>
                    
                    {inputMethod === 'csv' ? (
                        <CSVUploadSection
                            onValidationChange={safeOnValidationChange}
                            onRecipientsChange={safeOnRecipientsChange}
                            totalTreesSelected={treesCount}
                        />
                    ) : inputMethod === 'manual' ? (
                        <ManualDonationAdd
                            donations={manualDonation}
                            onChange={safeSetManualDonation}
                            imagePreviews={imagePreviews}
                            onImageUpload={handleImageUpload}
                        />
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="h6" gutterBottom>
                                Skip Recipient Assignment
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                You can proceed to payment without assigning recipients now. 
                                Recipients can be assigned later at the donation level.
                            </Typography>
                            <Alert severity="info" sx={{ mt: 2 }}>
                                <Typography variant="body2">
                                    <strong>Note:</strong> This donation will be created without specific recipients. 
                                    You can assign recipients to individual trees later through the donation management interface.
                                </Typography>
                            </Alert>
                        </Box>
                    )}
                </Box>
            ),
        },
        {
            title: 'Summary',
            content: (
                <Box>
                    <DonationSummary
                        treesCount={treesCount}
                        corporateName={corporateName}
                        corporateLogo={corporateLogo}
                        userName={userName}
                        userEmail={userEmail}
                        treePrice={TREE_PRICE}
                    />
                    {inputMethod === 'skip' && (
                        <Alert severity="info" sx={{ mt: 2, mx: 2 }}>
                            <Typography variant="body2">
                                <strong>Recipients:</strong> No recipients assigned. Recipients can be assigned later at the donation level.
                            </Typography>
                        </Alert>
                    )}
                </Box>
            ),
        },
    ];

    const handleNext = () => {
        if (currentStep === 0) {
            setCsvValidation({
                isValid: true,
                isUploaded: false,
                error: ''
            });
        }
        // Reset recipients and manual donation when moving to next step
        if (currentStep === 1 && inputMethod === 'skip') {
            setRecipients([]);
            setManualDonation([]);
        }
        setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const handleSubmit = async () => {
        // Validate required fields
        if (!userName || !userEmail) {
            setError('Logged-in user name and email are required');
            return;
        }
        if (!treesCount || treesCount <= 0) {
            setError('Tree count must be greater than 0');
            return;
        }
    
        try {
            if (!isMountedRef.current) return;
            setLoading(true);
            setError('');
    
            // Prepare recipients based on input method
            let donationRecipients;
            if (inputMethod === 'skip') {
                donationRecipients = undefined; // No recipients when skipping
            } else if (inputMethod === 'csv') {
                donationRecipients = recipients.map(r => ({
                    recipient_name: r.name,
                    recipient_email: r.email,
                    recipient_phone: r.phone,
                    assignee_name: r.assigneeName || r.name,
                    assignee_email: r.assigneeEmail || r.email,
                    assignee_phone: r.assigneePhone || r.email,
                    trees_count: r.trees_count || 1,
                    image_url: r.image_url,
                }));
            } else {
                donationRecipients = manualDonation.map(d => ({
                    recipient_name: d.name,
                    recipient_email: d.email,
                    recipient_phone: d.phone,
                    assignee_name: d.assigneeName || d.name,
                    assignee_email: d.assigneeEmail || d.email,
                    assignee_phone: d.assigneePhone || d.email,
                    trees_count: d.trees_count || 1,
                    image_url: d.profile_image,
                }));
            }
    
            // Prepare the exact payload structure expected by backend
            const response = await apiClient.createDonationV2(
                userName,
                userEmail,
                treesCount,
                totalAmount,
                undefined,
                ["Corporate"],
                donationRecipients && donationRecipients.length ? donationRecipients : undefined,
                groupId ? groupId.toString() : undefined
            );
    
            // Handle response
            if (!isMountedRef.current) return;
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
            if (!isMountedRef.current) return;
            setError(error.message || 'Failed to create donation. Please try again.');
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    };

    const handlePaymentSuccess = async () => {
        try {
            if (!isMountedRef.current) return;
            setPaymentStatus('success');
            setLoading(true);

            await apiClient.paymentSuccessForDonation(
                Number(donationId),
                true
            );

            if (!isMountedRef.current) return;
            onSuccess?.();
        } catch (error: any) {
            if (!isMountedRef.current) return;
            setError(error.message || 'Payment successful but failed to update status. Please contact support.');
            setPaymentStatus('failed');
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
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
            if (!isMountedRef.current) return;
            setLoading(true);
            setError('');

            // Upload payment proof to S3
            const fileUrl = await awsUtils.uploadFileToS3(
                "donation-request",
                paymentProof,
                `cards/${donationRequest.request_id}/payment_proof`,
                safeSetUploadProgress
            );

            if (!isMountedRef.current) return;
            setUploadedFileUrl(fileUrl);

            // Create payment history
            await apiClient.createPaymentHistory(
                donationRequest.payment_id,
                totalAmount,
                "Net Banking",
                fileUrl
            );

            if (!isMountedRef.current) return;
            setPaymentStatus('success');
            onSuccess?.();
        } catch (error) {
            console.error('Error processing bank transfer:', error);
            if (!isMountedRef.current) return;
            setError('Failed to process payment proof. Please try again.');
            setPaymentStatus('failed');
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    };

    const user: any = {
        name: userName,
        email: userEmail,
        phone: '',
    };

    // Determine if Next button should be disabled
    const isNextDisabled = () => {
        if (currentStep === 1) {
            if (inputMethod === 'csv') {
                return !csvValidation.isUploaded || !csvValidation.isValid;
            } else if (inputMethod === 'manual') {
                return manualDonation.length === 0;
            } else if (inputMethod === 'skip') {
                return false; // Allow proceeding when skipping
            }
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
                                        onChange={safeSetPaymentProof}
                                        onUploadProgress={safeSetUploadProgress}
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
                onClose={() => safeSetError('')}
            >
                <Alert onClose={() => safeSetError('')} severity="warning" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Dialog>
    );
};

export default DonationTreesForm;