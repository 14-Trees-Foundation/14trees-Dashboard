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
} from "@mui/material";
import Papa from "papaparse";
import { Close as CloseIcon, Done, Image as ImageIcon } from "@mui/icons-material";
import { EventTypes } from "../../../types/common";
import { getUniqueRequestId } from "../../../helpers/utils";
import UserImagesForm from "../gift/Form/UserImagesForm";
import CardDetails from "../gift/Form/CardDetailsForm";
import ApiClient from "../../../api/apiClient/apiClient";
import { toast } from "react-toastify";

interface CSRBulkGiftProps {
    groupId: number
    logoUrl: string | null
    open: boolean
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

const CSRBulkGift: React.FC<CSRBulkGiftProps> = ({ groupId, logoUrl, open, onClose, onSubmit }) => {
    const [data, setData] = useState<string[][]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [errorsMap, setErrorsMap] = useState<Record<number, string[]>>({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentStep, setCurrentStep] = useState<'event' | 'csv' | 'card'>('event');
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

    useEffect(() => {
        const userData = prepareUserData();
        console.log(userData)
        const giftedBy = userData.length > 0 ? userData[0].gifted_by : undefined;

        if (giftedBy && messages.plantedBy != giftedBy) {
            setMessages(prev => ({
                ...prev,
                plantedBy: giftedBy
            }))
        }
    }, [data, messages])

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
        }
    };

    const prepareUserData = () => {
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
                profile_image_url: imageName ?  imagePreviews[imageName] : '',
                event_name: eventInCsv ? row[eventNameIndex]?.trim() : messages.eventType,
                gifted_by: eventInCsv ? row[giftedByIndex]?.trim() : messages.plantedBy,
                gifted_on: eventInCsv ? row[giftedOnIndex]?.trim() : messages.giftedOn,
            };
        });
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            const apiClient = new ApiClient();

            const userData = prepareUserData();

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

            {headerErrors.length > 0 && (
                <Box sx={{ mt: 2, mb: 2 }}>
                    <Typography color="error" variant="subtitle2">CSV Header Validation Errors:</Typography>
                    {headerErrors.map((error, index) => (
                        <Typography key={index} color="error" variant="body2">• {error}</Typography>
                    ))}
                </Box>
            )}

            {data.length > 0 ? (
                <>
                    <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                        <Table size="small" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    {headers.map((header, index) => (
                                        <TableCell key={index}>{header}</TableCell>
                                    ))}
                                    <TableCell>Image Preview</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, rowIndex) => {
                                        const actualIndex = rowIndex + page * rowsPerPage;
                                        const errors = errorsMap[actualIndex];
                                        const imageError = imageValidationErrors[actualIndex];
                                        const hasError = errors?.length > 0 || imageError;
                                        const imageNameIndex = headers.findIndex(header => header === "Image Name (optional)");
                                        const imageName = row[imageNameIndex]?.trim();

                                        return (
                                            <TableRow
                                                key={rowIndex}
                                                sx={{
                                                    backgroundColor: hasError ? "#ffe6e6" : "inherit",
                                                }}
                                            >
                                                <TableCell>
                                                    {hasError ? (
                                                        <Tooltip
                                                            title={[
                                                                ...(errors || []),
                                                                ...(imageError ? [imageError] : [])
                                                            ].join(", ")}
                                                            arrow
                                                        >
                                                            <CloseIcon color="error" fontSize="small" />
                                                        </Tooltip>
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
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </>
            ) : (
                <Typography variant="body2" color="textSecondary">
                    No data to display.
                </Typography>
            )}
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

    return (
        <Dialog open={open} maxWidth={currentStep === 'event' ? "sm" : currentStep === 'csv' ? "lg" : "xl"} fullWidth>
            <DialogTitle>Bulk Gift Trees</DialogTitle>
            <DialogContent dividers>
                {currentStep === 'event' && renderEventStep()}
                {currentStep === 'csv' && renderCsvStep()}
                {currentStep === 'card' && renderCardPreviewStep(messages)}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined" color="error" sx={{ textTransform: "none" }}>
                    Close
                </Button>
                {currentStep === 'csv' && (
                    <Button
                        onClick={() => setCurrentStep('event')}
                        variant="contained"
                        color="success"
                        sx={{ textTransform: "none" }}
                    >
                        Previous
                    </Button>
                )}
                {currentStep === 'card' && (
                    <>
                        <Button
                            onClick={() => setCurrentStep('csv')}
                            variant="contained"
                            color="success"
                            sx={{ textTransform: "none" }}
                        >
                            Previous
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            color="success"
                            sx={{ textTransform: "none" }}
                            disabled={isSubmitting || !presentationId || !slideId}
                        >
                            {isSubmitting ? (
                                <>
                                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                                    Submitting...
                                </>
                            ) : (
                                'Submit'
                            )}
                        </Button>
                    </>
                )}
                {currentStep !== 'card' && (
                    <Button
                        onClick={handleNext}
                        variant="contained"
                        color="success"
                        sx={{ textTransform: "none" }}
                        disabled={
                            (currentStep === 'event' && !messages.eventType) ||
                            (currentStep === 'csv' && (Object.keys(errorsMap).length > 0 || Object.keys(imageValidationErrors).length > 0 || data.length == 0))
                        }
                    >
                        Next
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default CSRBulkGift;
