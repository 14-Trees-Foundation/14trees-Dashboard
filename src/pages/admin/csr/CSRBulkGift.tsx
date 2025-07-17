import React, { useState, useEffect } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    Tooltip,
    TablePagination,
    Grid,
    TextField,
    Autocomplete,
    Avatar,
    CircularProgress,
    Alert,
    FormControl,
    FormGroup,
    FormControlLabel,
    Radio,
    Tab,
    Tabs,
    RadioGroup,
} from "@mui/material";
import Papa from "papaparse";
import { Close as CloseIcon, Done, Image as ImageIcon } from "@mui/icons-material";
import { EventTypes } from "../../../types/common";
import { getUniqueRequestId } from "../../../helpers/utils";
import UserImagesForm from "../gift/Components/user/UserImagesForm";
import CardDetails from "../gift/Components/workflow/CardDetailsForm";
import ApiClient from "../../../api/apiClient/apiClient";
import { toast } from "react-toastify";
import RazorpayComponent from "../../../components/RazorpayComponent";
import ManualUserAdd, { ManualUser } from './components/ManualUserAdd';

interface CSRBulkGiftProps {
    groupId: number
    logoUrl: string | null
    open: boolean
    availableTrees: number
    onClose: () => void
    onSubmit: () => void
}

interface Messages {
    primaryMessage: string;
    logoMessage: string;
    eventName: string;
    eventType: string | undefined;
    plantedBy: string;
    giftedOn: string;
}

const REQUIRED_HEADERS = [
    "Recipient Name",
    "Recipient Email",
    "Recipient Communication Email (optional)",
    "Recipient DoB (optional)",
    "Number of trees to assign",
    "Image Name (optional)",
];

const OPTIONAL_HEADERS = [
    "Occation Name",
    "Gifted By",
    "Gifted On",
];

const CSRBulkGift: React.FC<CSRBulkGiftProps> = ({ groupId, logoUrl, open, onClose, onSubmit, availableTrees }) => {
    const [data, setData] = useState<string[][]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [errorsMap, setErrorsMap] = useState<Record<number, string[]>>({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentStep, setCurrentStep] = useState<'event' | 'csv' | 'card' | 'giftType' | 'summary' | 'paymentChoice'>('event');
    const [headerErrors, setHeaderErrors] = useState<string[]>([]);
    const [requestId, setRequestId] = useState<string>(getUniqueRequestId());
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [imageValidationErrors, setImageValidationErrors] = useState<Record<number, string>>({});
    const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Card details state
    const [presentationId, setPresentationId] = useState<string>('');
    const [slideId, setSlideId] = useState<string>('');
    const [messages, setMessages] = useState<Messages>({
        primaryMessage: '',
        logoMessage: '',
        eventName: '',
        eventType: undefined,
        plantedBy: '',
        giftedOn:  new Date().toISOString().slice(0, 10),
    });

    const [selectedEventType, setSelectedEventType] = useState<{ value: string, label: string } | null>(null);
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [giftType, setGiftType] = useState<'existing' | 'new'>('existing');
    const [orderId, setOrderId] = useState<string>('');
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');
    const [giftRequest, setGiftRequest] = useState<any>(null);
    const [giftRequestId, setGiftRequestId] = useState<string>('');
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [totalTrees, setTotalTrees] = useState<number>(0);

    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");

    const [inputMethod, setInputMethod] = useState<'csv' | 'manual'>('csv');
    const [manualUsers, setManualUsers] = useState<ManualUser[]>([]);

    const [paymentOption, setPaymentOption] = useState<'payNow' | 'payLater'>('payNow');
    const [showRazorpay, setShowRazorpay] = useState(false);

    useEffect(() => {
        const userData = prepareUserData();
        const giftedBy = userData.length > 0 ? userData[0].gifted_by : undefined;

        if (giftedBy && messages.plantedBy != giftedBy) {
            setMessages(prev => ({
                ...prev,
                plantedBy: giftedBy
            }))
        }
    }, [data, messages])

    useEffect(() => {
        if (paymentStatus === 'pending' && orderId) {
            setShowRazorpay(true);
        } else {
            setShowRazorpay(false);
        }
    }, [paymentStatus, orderId]);

    const validateHeaders = (headers: string[]): string[] => {
        const errors: string[] = [];

        // Check required headers
        REQUIRED_HEADERS.forEach(header => {
            if (!headers.includes(header)) {
                errors.push(`Missing required header: ${header}`);
            }
        });

        // If showAdditionalFields is false, check optional headers
        if (!showAdditionalFields) {
            OPTIONAL_HEADERS.forEach(header => {
                if (!headers.includes(header)) {
                    errors.push(`Missing required header: ${header}`);
                }
            });
        }

        return errors;
    };

    const validateRow = (row: string[]): string[] => {
        const errors: string[] = [];
        const [
            name,
            email,
            commEmail,
            dob,
            trees,
            image,
            occasionName,
            giftedBy,
            giftedOn
        ] = row;

        const isValidEmail = (value: string) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

        const isValidDate = (value: string) =>
            /^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(Date.parse(value));

        // Required field validations
        if (!name?.trim()) errors.push("Recipient Name is required");
        if (!email?.trim()) errors.push("Recipient Email is required");
        if (!isValidEmail(email)) errors.push("Invalid Recipient Email format");

        // Optional field validations
        if (commEmail && !isValidEmail(commEmail)) {
            errors.push("Invalid Communication Email format");
        }

        if (dob && !isValidDate(dob)) {
            errors.push("Invalid Date of Birth format (YYYY-MM-DD)");
        }

        if (!trees || isNaN(Number(trees)) || Number(trees) <= 0) {
            errors.push("Number of trees must be a positive number");
        }

        // Validate optional headers if showAdditionalFields is false
        if (!showAdditionalFields) {
            if (!occasionName?.trim()) errors.push("Occasion Name is required");
            if (!giftedBy?.trim()) errors.push("Gifted By is required");
            if (!giftedOn?.trim()) errors.push("Gifted On is required");
            if (giftedOn && !isValidDate(giftedOn)) {
                errors.push("Invalid Gifted On date format (YYYY-MM-DD)");
            }
        }

        return errors;
    };

    const processCsvData = (rawData: string[][]) => {
        if (rawData.length === 0) {
            setHeaderErrors(["CSV file is empty"]);
            return;
        }

        const [firstRow, ...rows] = rawData;

        // Validate headers
        const headerValidationErrors = validateHeaders(firstRow);
        if (headerValidationErrors.length > 0) {
            setHeaderErrors(headerValidationErrors);
            setData([]);
            setHeaders([]);
            return;
        }

        setHeaderErrors([]);
        setHeaders(firstRow);

        const newErrorsMap: Record<number, string[]> = {};
        const cleanedData = rows.map((row, idx) => {
            const errors = validateRow(row);
            if (errors.length > 0) {
                newErrorsMap[idx] = errors;
            }
            return row;
        });

        setData(cleanedData);
        setErrorsMap(newErrorsMap);
    };

    const downloadGoogleSheet = () => {
        const sheetName = showAdditionalFields ? "Sheet1" : "Sheet2";
        const url = `https://docs.google.com/spreadsheets/d/1pgZYonVsa0Z1Aqqb4tjwNHnMz0IjFvU5ibM-vx-5iDU/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
        const fileName = "UserDetails.csv";

        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(error => console.error("Download failed:", error));
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
    
        // Clear previous data while loading new file
        setData([]);
        setHeaders([]);
        setErrorsMap({});
        setImageValidationErrors({});
        setHeaderErrors([]);
    
        Papa.parse<string[]>(file, {
            skipEmptyLines: true,
            complete: (result) => {
                processCsvData(result.data as string[][]);
                // Reset the input value after processing
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
            error: (error) => {
                toast.error(`Error parsing CSV: ${error.message}`);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        });
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessages(prev => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    const handleEventTypeSelection = (e: any, item: { value: string, label: string } | null) => {
        const newEventType = item ? item.value : '';
        setSelectedEventType(item);
        setMessages(prev => ({
            ...prev,
            eventType: newEventType
        }))

        // Show additional fields only for General gift (3) or Festival (6)
        setShowAdditionalFields(newEventType === '3' || newEventType === '6');
    };

    // Function to extract filename from S3 URL
    const getFilenameFromUrl = (url: string): string => {
        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            const filename = pathname.split('/').pop() || '';
            return decodeURIComponent(filename);
        } catch {
            return '';
        }
    };

    // Function to validate images against CSV data
    const validateImages = (csvData: string[][], headers: string[], uploadedImages: string[]) => {
        const imageNameIndex = headers.findIndex(header => header === "Image Name (optional)");
        if (imageNameIndex === -1) return;

        const newImageValidationErrors: Record<number, string> = {};
        const newImagePreviews: Record<string, string> = {};

        // Create a map of uploaded image filenames to their URLs
        const uploadedImageMap = uploadedImages.reduce((acc, url) => {
            const filename = getFilenameFromUrl(url);
            if (filename) {
                acc[filename] = url;
            }
            return acc;
        }, {} as Record<string, string>);

        // Check each row for image validation
        csvData.forEach((row, index) => {
            const imageName = row[imageNameIndex]?.trim();
            if (imageName) {
                const decodedImageName = decodeURIComponent(imageName);
                if (!uploadedImageMap[decodedImageName]) {
                    newImageValidationErrors[index] = `Image "${imageName}" not found in uploaded images`;
                } else {
                    newImagePreviews[decodedImageName] = uploadedImageMap[decodedImageName];
                }
            }
        });

        setImageValidationErrors(newImageValidationErrors);
        setImagePreviews(newImagePreviews);
    };

    // Update image validation when CSV data or uploaded images change
    useEffect(() => {
        if (data.length > 0 && headers.length > 0) {
            validateImages(data, headers, imageUrls);
        }
    }, [data, headers, imageUrls]);

    const handleImageUpload = (urls: string[]) => {
        setImageUrls(urls);
        // Revalidate images when new images are uploaded
        if (data.length > 0 && headers.length > 0) {
            validateImages(data, headers, urls);
        }
    };

    const handleNext = () => {
        if (currentStep === 'event') {
            if (messages.eventType) {
                setCurrentStep('csv');
            }
        } else if (currentStep === 'csv') {
            // Check if there are any validation errors
            const hasErrors = Object.keys(errorsMap).length > 0 || Object.keys(imageValidationErrors).length > 0;
            if (!hasErrors) {
                setCurrentStep('card');
            }
        } else if (currentStep === 'card') {
            if (presentationId && slideId) {
                setCurrentStep('giftType');
            }
        } else if (currentStep === 'giftType') {
            setCurrentStep('summary');
        } else if (currentStep === 'summary') {
            if (giftType === 'existing') {
                handleSubmit();
            } else {
                handlePurchaseNewTrees();
            }
        } else if (currentStep === 'paymentChoice') {
            // No-op, handled by payment buttons
        }
    };

    const handlePurchaseNewTrees = async () => {
        try {
            setIsSubmitting(true);
            const apiClient = new ApiClient();
            const preparedUserData = prepareUserData();
            const treesCount = preparedUserData.reduce((sum, user) => sum + user.trees_count, 0);
            setTotalTrees(treesCount);
            setTotalAmount(treesCount * 2000); // Assuming each tree costs 2000

            const userData = prepareUserData();
            const users = userData.map(item => {
                let user = {
                    recipient_name: item.name.trim(),
                    recipient_email: item.email.trim() ? item.email.trim() : item.name.trim().toLowerCase().split(" ").join(".") + (userName ? userName.toLowerCase().replaceAll(" ", "") : '') + "@14trees",
                    recipient_communication_email: item.communication_email.trim() || null,
                    gifted_trees: item.trees_count,
                    image_url: item.profile_image_url,
                    assignee_name: item.name.trim(),
                    assignee_email: item.email.trim() ? item.email.trim() : item.name.trim().toLowerCase().split(" ").join(".") + (userName ? userName.toLowerCase().replaceAll(" ", "") : '') + "@14trees",
                    assignee_communication_email: item.communication_email.trim() || null,
                    gifted_on: item.gifted_on?.trim() || null,
                    gifted_by: item.gifted_by?.trim() || null,
                    event_name: item.event_name?.trim() || null,
                }

                return user
            })

            const response = await apiClient.createGiftCardRequestV2(
                groupId,
                userName || preparedUserData[0].name,
                userEmail || preparedUserData[0].email,
                treesCount,
                messages.eventType || "3",
                messages.eventName,
                messages.plantedBy,
                ["Corporate", "PayLater"],
                users,
                messages.logoMessage,
                messages.primaryMessage
            );

            if (response.order_id) {
                setOrderId(response.order_id);
            }
            if (response.gift_request?.id) {
                setGiftRequest(response.gift_request);
                setGiftRequestId(response.gift_request.id.toString());
            }

            setCurrentStep('paymentChoice'); // Move to payment choice step
        } catch (error: any) {
            toast.error(error.message || "Failed to create gift card request");
            setPaymentStatus('failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePaymentSuccess = async () => {
        try {
            setPaymentStatus('success');
            setIsSubmitting(true);
            const apiClient = new ApiClient();
            await apiClient.paymentSuccessForGiftRequest(Number(giftRequestId), true);
            toast.success("Payment successful! Gift cards will be created shortly.");
            onSubmit();
            onClose();
        } catch (error: any) {
            toast.error('Payment successful but failed to update status. Please contact support.');
            setPaymentStatus('failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePaymentFailure = () => {
        setPaymentStatus('failed');
        toast.error('Payment failed. Please try again later or contact support.');
    };

    const handleRetryPayment = () => {
        setPaymentStatus('pending');
    };

    const handleClose = async () => {
        if (paymentStatus === 'pending' || paymentStatus === 'failed') {
            toast.warning('Payment is mandatory to complete the order. The request will not be fulfilled without payment.');
            if (giftRequest) {
                try {
                    const apiClient = new ApiClient();
                    await apiClient.pathGiftCard(giftRequest.id, { tags: ['Corporate', 'PayLater'] }, ['tags']);
                    toast.info('Your request has been updated to Pay Later');
                } catch (error: any) {
                    toast.error('Failed to update your request to Pay Later');
                }
            }
        }
        onClose();
    };

    const prepareUserData = () => {
        if (inputMethod === 'manual') {
            return manualUsers.map(user => ({
                trees_count: Number(user.trees_count),
                name: user.name,
                email: user.email,
                communication_email: user.communication_email,
                birth_date: user.birth_date,
                profile_image_url: user.image_name ? imagePreviews[user.image_name] : '',
                event_name: user.event_name,
                gifted_by: user.gifted_by,
                gifted_on: user.gifted_on,
            }));
        }
        const imageNameIndex = headers.findIndex(header => header === "Image Name (optional)");
        const nameIndex = headers.findIndex(header => header === "Recipient Name");
        const emailIndex = headers.findIndex(header => header === "Recipient Email");
        const commEmailIndex = headers.findIndex(header => header === "Recipient Communication Email (optional)");
        const dobIndex = headers.findIndex(header => header === "Recipient DoB (optional)");
        const treesIndex = headers.findIndex(header => header === "Number of trees to assign");
        const giftedByIndex = headers.findIndex(header => header === "Gifted By");
        const giftedOnIndex = headers.findIndex(header => header === "Gifted On");
        const eventNameIndex = headers.findIndex(header => header === "Occation Name");

        const eventInCsv = messages.eventType !== '3' && messages.eventType !== '6'

        return data.map(row => {
            const imageName = row[imageNameIndex]?.trim();
            const treesCount: number = parseInt(row[treesIndex]?.trim() || '1');

            return {
                trees_count: treesCount,
                name: row[nameIndex]?.trim() || '',
                email: row[emailIndex]?.trim() || '',
                communication_email: row[commEmailIndex]?.trim() || '',
                birth_date: row[dobIndex]?.trim() || '',
                profile_image_url: imageName ? imagePreviews[imageName] : '',
                event_name: eventInCsv ? row[eventNameIndex]?.trim() : messages.eventType,
                gifted_by: eventInCsv ? row[giftedByIndex]?.trim() : messages.plantedBy,
                gifted_on: eventInCsv ? row[giftedOnIndex]?.trim() : messages.giftedOn,
            };
        });
    };

    useEffect(() => {
        const totalRequestedTrees = prepareUserData().reduce((sum, user) => sum + Number(user.trees_count || 0), 0);
        setGiftType(totalRequestedTrees <= availableTrees ? "existing" : "new")
        setTotalTrees(totalRequestedTrees)
    }, [inputMethod, data, manualUsers, messages])


    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            const apiClient = new ApiClient();

            const userData = prepareUserData();

            const treesCount = userData
                .map(item => item.trees_count)
                .reduce((prev, curr) => prev + curr, 0)

            if (treesCount > availableTrees) {
                toast.error(`Cannot gift more than ${availableTrees} trees. Only ${availableTrees} trees available.`);
                setIsSubmitting(false);
                return;
            }

            await apiClient.bulkRedeemGiftCardTemplate(
                'group',
                groupId,
                userData,
                messages,
            );

            toast.success("Bulk gift cards created successfully!");
            onSubmit();
        } catch (error: any) {
            toast.error(error.message || "Failed to create bulk gift cards");
        } finally {
            setIsSubmitting(false);
            onClose();
        }
    };

    const renderEventStep = () => (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography mb={1} variant="subtitle1" gutterBottom>Are you gifting trees for a specific event/occasion ?</Typography>
                    <Autocomplete
                        fullWidth
                        value={selectedEventType}
                        options={EventTypes}
                        getOptionLabel={(option) => option.label}
                        onChange={handleEventTypeSelection}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                name="eventType"
                                label='Occasion Type'
                            />
                        )}
                    />
                </Grid>

                {showAdditionalFields && (
                    <>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Occasion Name"
                                name="eventName"
                                value={messages.eventName}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Gifted By"
                                name="plantedBy"
                                value={messages.plantedBy}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Gifted on"
                                name="giftedOn"
                                value={messages.giftedOn}
                                type="date"
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </>
                )}
            </Grid>
        </Box>
    );

    const renderCsvStep = () => (
        <Box>
            <Tabs
                value={inputMethod}
                onChange={(_, v) => setInputMethod(v)}
                sx={{ mb: 2, width: '100%', '.MuiTabs-flexContainer': { justifyContent: 'center' } }}
                variant="fullWidth"
            >
                <Tab label="Upload via CSV" value="csv" sx={{ fontWeight: 600, fontSize: 16 }} />
                <Tab label="Add Recipients Manually" value="manual" sx={{ fontWeight: 600, fontSize: 16 }} />
            </Tabs>
            {inputMethod === 'csv' && (
                <Box gap={2} mb={2}>
                    <Typography>You can upload recipient details by using a CSV file. To get started, download the sample CSV file from <a style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={downloadGoogleSheet}>this</a> link, fill in the required recipient details, and then upload the completed CSV file.</Typography>
                    <Typography mt={2}>You can optionally upload recipient or assignee images below to personalize the dashboard. If you upload images, ensure that the exact file name of each image is specified in the 'Image Name' column in the CSV file. If no image is uploaded, leave the 'Image Name' column blank.</Typography>
                    <Box mt={2} display="flex" flexDirection="column" gap={2} alignItems="center" justifyContent="center">
                        <UserImagesForm requestId={requestId} onUpload={handleImageUpload} />
                        <Button variant="contained" sx={{ mt: 2 }} color="success" component="label">
                            Upload CSV
                            <input type="file" accept=".csv" hidden onChange={handleFileUpload} ref={fileInputRef}  />
                        </Button>
                    </Box>
                </Box>
            )}
            {inputMethod === 'manual' && (
                <ManualUserAdd
                    users={manualUsers}
                    onChange={setManualUsers}
                    eventType={messages.eventType}
                />
            )}
            {headerErrors.length > 0 && (
                <Box sx={{ mt: 2, mb: 2 }}>
                    <Typography color="error" variant="subtitle2">CSV Header Validation Errors:</Typography>
                    {headerErrors.map((error, index) => (
                        <Typography key={index} color="error" variant="body2">• {error}</Typography>
                    ))}
                </Box>
            )}
            {(inputMethod === 'csv' && data.length > 0) && (
                <>
                    <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                        <Table size="small" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell width="50px"></TableCell>
                                    {(inputMethod === 'csv' ? headers : [
                                        "Recipient Name",
                                        "Recipient Email",
                                        "Recipient Communication Email (optional)",
                                        "Recipient DoB (optional)",
                                        "Number of trees to assign",
                                        "Image Name (optional)",
                                        "Occation Name",
                                        "Gifted By",
                                        "Gifted On",
                                    ]).map((header, index) => {
                                        const isDateField = header === "Gifted On" || header === "Recipient DoB (optional)";

                                        return (
                                            <TableCell key={index} sx={{ minWidth: '180px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span>{header}</span>
                                                    {isDateField && (
                                                        <span style={{
                                                            fontSize: '0.75rem',
                                                            color: 'inherit',
                                                            marginTop: '2px'
                                                        }}>
                                                            (YYYY-MM-DD)
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                        );
                                    })}
                                    <TableCell>Image Preview</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(inputMethod === 'csv' ? data : manualUsers.map(user => [
                                    user.name,
                                    user.email,
                                    user.communication_email,
                                    user.birth_date,
                                    user.trees_count.toString(),
                                    user.image_name,
                                    user.event_name,
                                    user.gifted_by,
                                    user.gifted_on,
                                ])).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, rowIndex) => {
                                        const actualIndex = rowIndex + page * rowsPerPage;
                                        const errors = inputMethod === 'csv' ? errorsMap[actualIndex] : undefined;
                                        const imageError = inputMethod === 'csv' ? imageValidationErrors[actualIndex] : undefined;
                                        const hasError = inputMethod === 'csv' ? (Array.isArray(errors) ? errors.length > 0 : false) || imageError : false;
                                        const imageNameIndex = (inputMethod === 'csv' ? headers : [
                                            "Recipient Name",
                                            "Recipient Email",
                                            "Recipient Communication Email (optional)",
                                            "Recipient DoB (optional)",
                                            "Number of trees to assign",
                                            "Image Name (optional)",
                                            "Occation Name",
                                            "Gifted By",
                                            "Gifted On",
                                        ]).findIndex(header => header === "Image Name (optional)");
                                        const imageName = row[imageNameIndex]?.trim();
                                        return (
                                            <TableRow
                                                key={rowIndex}
                                                sx={{
                                                    backgroundColor: hasError ? "#ffe6e6" : "inherit",
                                                }}
                                            >
                                                <TableCell>
                                                    {inputMethod === 'csv' ? (
                                                        hasError ? (
                                                            <Tooltip
                                                                title={[
                                                                    ...(Array.isArray(errors) ? errors : []),
                                                                    ...(imageError ? [imageError] : [])
                                                                ].join(", ")}
                                                                arrow
                                                            >
                                                                <CloseIcon color="error" fontSize="small" />
                                                            </Tooltip>
                                                        ) : <Done color="success" fontSize="small" />
                                                    ) : <Done color="success" fontSize="small" />}
                                                </TableCell>
                                                {row.map((cell, cellIndex) => (
                                                    <TableCell key={cellIndex}>{cell}</TableCell>
                                                ))}
                                                <TableCell>
                                                    {imageName && (
                                                        imagePreviews[imageName] ? (
                                                            <Avatar
                                                                src={imagePreviews[imageName]}
                                                                alt={imageName}
                                                                sx={{ width: 40, height: 40 }}
                                                            />
                                                        ) : (
                                                            <Tooltip title={imageError || "Image not found"} arrow>
                                                                <ImageIcon color="error" />
                                                            </Tooltip>
                                                        )
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50, 100]}
                        component="div"
                        count={inputMethod === 'csv' ? data.length : manualUsers.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </>
            )}
        </Box>
    );

    const renderGiftTypeStep = () => (
        <Box>
            <Typography variant="h6" gutterBottom>
                Choose Gift Type
            </Typography>
            <Typography variant="body1" gutterBottom>
                Would you like to gift trees from your existing inventory or purchase new trees?
            </Typography>
            <FormControl component="fieldset" sx={{ mt: 2 }}>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Radio
                                checked={giftType === 'existing'}
                                onChange={() => setGiftType('existing')}
                                color="success"
                                disabled={totalTrees > availableTrees}
                            />
                        }
                        label="Gift from Existing Inventory"
                    />
                    {totalTrees > availableTrees && (
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            Not enough trees available in inventory. You requested {totalTrees}, but only {availableTrees} are available.
                        </Typography>
                    )}
                    <FormControlLabel
                        control={
                            <Radio
                                checked={giftType === 'new'}
                                onChange={() => setGiftType('new')}
                                color="success"
                            />
                        }
                        label="Purchase New Trees"
                    />
                </FormGroup>
            </FormControl>
        </Box>
    );

    const renderCardPreviewStep = (messages: Messages) => {

        const userData = prepareUserData();
        const userName = userData.length > 0 ? userData[0].name : undefined;
        const treesCount = userData.length > 0 ? userData[0].trees_count : undefined;

        return (
            <Box>
                <CardDetails
                    request_id={requestId}
                    presentationId={presentationId}
                    slideId={slideId}
                    messages={messages}
                    onChange={(newMessages: any) => { setMessages(newMessages) }}
                    onPresentationId={(newPresentationId: string, newSlideId: string) => {
                        setPresentationId(newPresentationId);
                        setSlideId(newSlideId);
                    }}
                    saplingId="000000"
                    userName={userName}
                    logo_url={logoUrl}
                    treesCount={treesCount}
                    isPersonal={false}
                />
            </Box>
        );
    };

    const RecipientsTable = ({ data, page, rowsPerPage, onPageChange, onRowsPerPageChange }: {
        data: any[],
        page: number,
        rowsPerPage: number,
        onPageChange: (event: unknown, newPage: number) => void,
        onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    }) => (
        <TableContainer component={Paper}>
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Communication Email</TableCell>
                        <TableCell>Date of Birth</TableCell>
                        <TableCell>Trees</TableCell>
                        <TableCell>Profile Image</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row.communication_email || '-'}</TableCell>
                                <TableCell>{row.birth_date || '-'}</TableCell>
                                <TableCell>{row.trees_count}</TableCell>
                                <TableCell>
                                    {row.profile_image_url ? (
                                        <Avatar
                                            src={row.profile_image_url}
                                            alt={row.name}
                                            sx={{ width: 40, height: 40 }}
                                        />
                                    ) : (
                                        <ImageIcon color="disabled" />
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
            />
        </TableContainer>
    );

    const renderSummaryStep = () => {
        const userData = prepareUserData();
        const totalTrees = userData.reduce((sum, user) => sum + user.trees_count, 0);
        const totalAmount = totalTrees * 2000; // Assuming each tree costs 2000

        return (
            <Box>
                <Typography variant="h6" gutterBottom>
                    Summary
                </Typography>
                <Grid container spacing={3}>
                    {/* Corporate Details */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                                Corporate Details
                            </Typography>
                            <Box display="flex" alignItems="center" gap={2}>
                                {logoUrl && (
                                    <Box
                                        component="img"
                                        src={logoUrl}
                                        alt="Corporate Logo"
                                        sx={{
                                            maxHeight: 100,
                                            maxWidth: '100%',
                                            objectFit: 'contain'
                                        }}
                                    />
                                )}
                                <Box>
                                    <Typography variant="body1">
                                        {messages.plantedBy}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Gift Details */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                                Gift Details
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Event Type
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedEventType?.label || 'General'}
                                    </Typography>
                                </Grid>
                                {messages.eventName && (
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body2" color="textSecondary">
                                            Event Name
                                        </Typography>
                                        <Typography variant="body1">
                                            {messages.eventName}
                                        </Typography>
                                    </Grid>
                                )}
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Gifted On
                                    </Typography>
                                    <Typography variant="body1">
                                        {messages.giftedOn}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Recipients Summary */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                                Recipients Summary
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Total Recipients
                                    </Typography>
                                    <Typography variant="body1">
                                        {userData.length}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Total Trees
                                    </Typography>
                                    <Typography variant="body1">
                                        {totalTrees}
                                    </Typography>
                                </Grid>
                                {giftType === 'new' && (
                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="textSecondary">
                                            Total Amount
                                        </Typography>
                                        <Typography variant="body1" fontWeight="bold" color="success.main">
                                            ₹{totalAmount.toLocaleString()}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Recipients Table */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                                Recipients List
                            </Typography>
                            <RecipientsTable
                                data={userData}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </Grid>

                    {/* Card Details */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                                Card Details
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="textSecondary">
                                        Primary Message
                                    </Typography>
                                    <Typography variant="body1">
                                        {messages.primaryMessage}
                                    </Typography>
                                </Grid>
                                {messages.logoMessage && (
                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="textSecondary">
                                            Logo Message
                                        </Typography>
                                        <Typography variant="body1">
                                            {messages.logoMessage}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        );
    };

    const handlePayLater = async () => {
        if (!giftRequestId) return;
        setIsSubmitting(true);
        try {
            const apiClient = new ApiClient();
            const pdfUrl = await apiClient.sendFundRequestInMail(Number(giftRequestId));
            toast.success('Fund request sent to billing email.');
        } catch (error: any) {
            toast.error(error.message || 'Failed to send fund request.');
        } finally {
            setIsSubmitting(false);
            setPaymentStatus('idle');
        }
    };

    // Handler for pay now
    const handleProceedToPay = () => {
        setPaymentStatus('pending');
    };

    const renderPaymentChoiceStep = () => (
        <Box>
            <Typography variant="h6" gutterBottom>Choose Payment Option</Typography>
            <RadioGroup
                value={paymentOption}
                onChange={e => setPaymentOption(e.target.value as 'payNow' | 'payLater')}
            >
                <FormControlLabel value="payNow" control={<Radio color="success" />} label="Pay Now" />
                <FormControlLabel value="payLater" control={<Radio color="success" />} label="Send Fund Request to Billing Email (Pay Later)" />
            </RadioGroup>
            {paymentOption === 'payNow' ? (
                <Typography sx={{ mt: 2 }}>
                    You will be redirected to Razorpay to complete your payment securely.
                </Typography>
            ) : (
                <Typography sx={{ mt: 2 }}>
                    A fund request will be sent to your billing email. You can complete the payment later via bank transfer.
                </Typography>
            )}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button onClick={() => { setCurrentStep('summary'); setPaymentStatus('idle'); }} color="error" variant="outlined">Back</Button>
                {paymentOption === 'payNow' ? (
                    <Button onClick={handleProceedToPay} style={{ textTransform: 'none' }} color="success" variant="contained">Proceed to Pay</Button>
                ) : (
                    <Button onClick={handlePayLater} style={{ textTransform: 'none' }} color="success" variant="contained">Get Fund Request</Button>
                )}
            </Box>
        </Box>
    );

    return (
        <Dialog open={open} maxWidth={currentStep === 'event' ? "sm" : currentStep === 'csv' ? "lg" : "xl"} fullWidth>
            <DialogTitle>Bulk Gift Trees</DialogTitle>
            <DialogContent dividers>
                {currentStep === 'event' && renderEventStep()}
                {currentStep === 'csv' && renderCsvStep()}
                {currentStep === 'card' && renderCardPreviewStep(messages)}
                {currentStep === 'giftType' && renderGiftTypeStep()}
                {currentStep === 'summary' && renderSummaryStep()}
                {currentStep === 'paymentChoice' && renderPaymentChoiceStep()}
                {/* Razorpay Dialog */}
                {showRazorpay && orderId && (
                    <Box sx={{ mt: 2 }}>
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            Order ID: {giftRequestId}. Payment is required to complete the order!
                        </Alert>
                        <RazorpayComponent
                            amount={totalAmount}
                            orderId={orderId}
                            user={{
                                name: userName || '',
                                email: userEmail || '',
                            } as any}
                            description={`Purchase of ${totalTrees} trees`}
                            onPaymentDone={handlePaymentSuccess}
                            onClose={handlePaymentFailure}
                        />
                    </Box>
                )}
                {paymentStatus === 'success' && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        Payment successful! Gift Request ID: {giftRequestId}
                    </Alert>
                )}
                {paymentStatus === 'failed' && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        Payment failed. The request will not be fulfilled without successful payment.
                        Please retry the payment or contact support if the issue persists.
                    </Alert>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="outlined" color="error" sx={{ textTransform: "none" }}>
                    {giftRequestId ? 'Close' : 'Cancel'}
                </Button>
                {!giftRequestId && currentStep === 'csv' && (
                    <Button
                        onClick={() => setCurrentStep('event')}
                        variant="contained"
                        color="success"
                        sx={{ textTransform: "none" }}
                    >
                        Previous
                    </Button>
                )}
                {!giftRequestId && currentStep === 'card' && (
                    <Button
                        onClick={() => setCurrentStep('csv')}
                        variant="contained"
                        color="success"
                        sx={{ textTransform: "none" }}
                    >
                        Previous
                    </Button>
                )}
                {!giftRequestId && currentStep === 'giftType' && (
                    <Button
                        onClick={() => setCurrentStep('card')}
                        variant="contained"
                        color="success"
                        sx={{ textTransform: "none" }}
                    >
                        Previous
                    </Button>
                )}
                {!giftRequestId && currentStep === 'summary' && (
                    <Button
                        onClick={() => setCurrentStep('giftType')}
                        variant="contained"
                        color="success"
                        sx={{ textTransform: "none" }}
                    >
                        Previous
                    </Button>
                )}
                {!giftRequestId && currentStep !== 'summary' && currentStep !== 'paymentChoice' && (
                    <Button
                        onClick={handleNext}
                        variant="contained"
                        color="success"
                        sx={{ textTransform: "none" }}
                        disabled={
                            (currentStep === 'event' && !messages.eventType) ||
                            (currentStep === 'csv' && (Object.keys(errorsMap).length > 0 || Object.keys(imageValidationErrors).length > 0 || (inputMethod==='csv' && data.length == 0) || (inputMethod==='manual' && manualUsers.length == 0))) ||
                            (currentStep === 'card' && (!presentationId || !slideId))
                        }
                    >
                        Next
                    </Button>
                )}
                {!giftRequestId && currentStep === 'summary' && (
                    <Button
                        onClick={handleNext}
                        variant="contained"
                        color="success"
                        sx={{ textTransform: "none" }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                                'Submitting...'
                            </>
                        ) : (
                            'Submit'
                        )}
                    </Button>
                )}
                {paymentStatus === 'failed' && (
                    <Button
                        onClick={handleRetryPayment}
                        variant="contained"
                        color="success"
                        sx={{ textTransform: "none" }}
                    >
                        Retry Payment
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default CSRBulkGift;
