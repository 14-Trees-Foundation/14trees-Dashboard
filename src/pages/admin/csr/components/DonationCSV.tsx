// CSVUploadSection.tsx
import React, { useState, useRef, useEffect } from "react";
import {
    Box, Typography, Button, Table, TableHead, TableBody, TableCell, TableContainer, TableRow,
    Paper, Tooltip, TablePagination, Link, Avatar
} from "@mui/material";
import { Close as CloseIcon, Done, Image as ImageIcon } from "@mui/icons-material";
import Papa from "papaparse";
import { toast } from "react-toastify";
import { getUniqueRequestId } from "../../../../helpers/utils";
import UserImagesForm from "../../donation/Forms/UserImagesForm";
import ApiClient from "../../../../api/apiClient/apiClient";

type CSVUploadSectionProps = {
    onValidationChange: (isValid: boolean, isUploaded: boolean, error: string) => void;
    onRecipientsChange?: (recipients: any[]) => void;
    totalTreesSelected?: number;
    groupId?: number;
};

const REQUIRED_HEADERS = [
    "Recipient Name",
    "Recipient Email",
    "Number of trees",
    "Image Name (optional)",
];

const SAMPLE_CSV_DATA = [
    REQUIRED_HEADERS,
    ["John Doe", "john@example.com", "5", "john.jpg"],
    ["Jane Smith", "jane@example.com", "3", ""],
    ["Bob Johnson", "bob@example.com", "10", "bob.png"]
];

const CSVUploadSection: React.FC<CSVUploadSectionProps> = ({
    onValidationChange, onRecipientsChange, totalTreesSelected = 0, groupId
}) => {
    const [remainingTrees, setRemainingTrees] = useState<number>(totalTreesSelected);
    const [data, setData] = useState<string[][]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [errorsMap, setErrorsMap] = useState<Record<number, string[]>>({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [requestId] = useState<string>(getUniqueRequestId());
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [imageValidationErrors, setImageValidationErrors] = useState<Record<number, string>>({});
    const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (groupId) {
            const fetchRemaining = async () => {
                try {
                    const apiClient = new ApiClient();
                    const res = await apiClient.getMappedDonationTreesAnalytics("group", groupId);
                    setRemainingTrees(res.remaining_trees || 0);
                } catch (err) {
                    toast.error("Failed to fetch remaining trees");
                    console.error(err);
                }
            };
            fetchRemaining();
        }
    }, [groupId]);

    const validateHeaders = (headers: string[]): string[] =>
        REQUIRED_HEADERS.filter(h => !headers.includes(h)).map(m => `Missing required header: ${m}`);

    const validateRow = (row: string[], index: number, allRows: string[][]): string[] => {
        const errors: string[] = [];
        const [name, email, trees] = row;
        const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

        if (!name?.trim()) errors.push("Recipient Name is required");
        if (email && !isValidEmail(email)) errors.push("Invalid Email format");
        if (!trees || isNaN(Number(trees)) || Number(trees) <= 0) {
            errors.push("Number of trees must be a positive number");
        }

        // Check for duplicates
        const duplicateIndex = allRows.findIndex((r, i) => {
            if (i === index) return false; // Skip current row
            const [rName, rEmail] = r;
            return rName?.trim() === name?.trim() && rEmail?.trim() === email?.trim();
        });

        if (duplicateIndex !== -1) {
            errors.push(`Duplicate recipient found in row ${duplicateIndex + 1}`);
        }

        return errors;
    };

    const validateImages = (csvData: string[][], headers: string[], uploadedImages: string[]): Record<number, string> => {
        const imageNameIndex = headers.findIndex(h => h === "Image Name (optional)");
        if (imageNameIndex === -1) return {};

        const uploadedMap = uploadedImages.reduce((acc, url) => {
            const name = getFilenameFromUrl(url);
            if (name) acc[name] = url;
            return acc;
        }, {} as Record<string, string>);

        const errors: Record<number, string> = {};
        const previews: Record<string, string> = {};

        csvData.forEach((row, idx) => {
            const imageName = row[imageNameIndex]?.trim();
            if (imageName) {
                const decoded = decodeURIComponent(imageName);
                if (!uploadedMap[decoded]) {
                    errors[idx] = `Image "${imageName}" not found in uploaded images`;
                } else {
                    previews[decoded] = uploadedMap[decoded];
                }
            }
        });

        setImageValidationErrors(errors);
        setImagePreviews(previews);

        return errors;
    };

    const downloadSampleCSV = () => {
        const csvContent = Papa.unparse(SAMPLE_CSV_DATA);
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "sample_recipients.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getFilenameFromUrl = (url: string): string => {
        try {
            return decodeURIComponent(new URL(url).pathname.split("/").pop() || "");
        } catch {
            return "";
        }
    };

    const processCsvData = (raw: string[][]) => {
        if (!raw.length) {
            toast.error("CSV file is empty");
            onValidationChange(false, false, "CSV is empty");
            return;
        }

        const [firstRow, ...rows] = raw;
        const headerErrors = validateHeaders(firstRow);
        if (headerErrors.length) {
            toast.error(headerErrors.join(", "));
            onValidationChange(false, false, headerErrors.join(", "));
            return;
        }

        setHeaders(firstRow);

        const nameIndex = firstRow.findIndex(h => h === "Recipient Name");
        const emailIndex = firstRow.findIndex(h => h === "Recipient Email");
        const treesIndex = firstRow.findIndex(h => h === "Number of trees");
        const imageIndex = firstRow.findIndex(h => h === "Image Name (optional)");

        let totalCsvTrees = 0;
        const newErrorsMap: Record<number, string[]> = {};

        // Validate each row
        rows.forEach((row, idx) => {
            const errors = validateRow(row, idx, rows);
            if (errors.length > 0) newErrorsMap[idx] = errors;

            const trees = Number(row[treesIndex]);
            if (!isNaN(trees)) totalCsvTrees += trees;
        });

        if (totalCsvTrees > remainingTrees) {
            toast.error(`Total trees in CSV (${totalCsvTrees}) exceed allowed count (${remainingTrees})`);
            onValidationChange(false, true, `Total trees in CSV (${totalCsvTrees}) exceed allowed count (${remainingTrees})`);
            return;
        }

        setData(rows);
        setErrorsMap(newErrorsMap);

        // Validate images if any are uploaded
        const imageErrors = validateImages(rows, firstRow, imageUrls);
        const hasImageErrors = Object.keys(imageErrors).length > 0;
        
        if (hasImageErrors) {
            toast.error("Some images referenced in CSV are not found in uploaded images");
        }

        const hasErrors = Object.keys(newErrorsMap).length > 0;
        onValidationChange(!hasErrors, true, hasErrors ? "Row validation errors" : "");

        if (!hasErrors && onRecipientsChange) {
            const formattedRecipients = rows.map((row, idx) => ({
                name: row[nameIndex],
                email: row[emailIndex],
                trees_count: Number(row[treesIndex]),
                image_name: imageIndex !== -1 ? row[imageIndex] : null,
                image_url: imageIndex !== -1 && row[imageIndex] ? imagePreviews[row[imageIndex]] : null
            }));
            onRecipientsChange(formattedRecipients);
        }
    };

    const handleImageUpload = (urls: string[]) => {
        setImageUrls(urls);
        if (data.length > 0 && headers.length > 0) {
            const imageErrors = validateImages(data, headers, urls);
            const hasImageErrors = Object.keys(imageErrors).length > 0;
            
            if (hasImageErrors) {
                toast.error("Some images referenced in CSV are not found in uploaded images");
            }
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        Papa.parse<string[]>(file, {
            skipEmptyLines: true,
            complete: (result) => {
                processCsvData(result.data as string[][]);
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
            error: (err) => {
                toast.error(`CSV Parsing Error: ${err.message}`);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        });
    };

    return (
        <Box>
            <Box gap={2} mb={2}>
                <Typography>
                    You can upload recipient details by using a CSV file. To get started, download the sample CSV file from{" "}
                    <Link component="button" onClick={downloadSampleCSV} sx={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
                        this
                    </Link>{" "}
                    link, fill in the required recipient details, and then upload the completed CSV file.
                </Typography>
                <Typography mt={2}>
                    You can optionally upload recipient images below to personalize the dashboard. If you upload images, ensure that the exact file name of each image is specified in the 'Image Name' column in the CSV file. If no image is uploaded, leave the 'Image Name' column blank.
                </Typography>

                <Box mt={2} display="flex" flexDirection="column" gap={2} alignItems="center" justifyContent="center">
                    <UserImagesForm requestId={requestId} onUpload={handleImageUpload} />
                    <Button variant="contained" sx={{ mt: 2 }} color="success" component="label">
                        Upload CSV
                        <input type="file" accept=".csv" hidden onChange={handleFileUpload} ref={fileInputRef} />
                    </Button>
                </Box>
            </Box>

            {(Object.keys(errorsMap).length > 0 || Object.keys(imageValidationErrors).length > 0) && (
                <Box sx={{ mt: 2, mb: 2 }}>
                    <Typography color="error" variant="subtitle2">Validation Errors:</Typography>
                    <Typography color="error" variant="subtitle2">Hover over X icon to see errors</Typography>
                </Box>
            )}

            {data.length > 0 ? (
                <>
                    <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                        <Table size="small" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Status</TableCell>
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
                                                            <Avatar src={imagePreviews[imageName]} alt={imageName} sx={{ width: 40, height: 40 }} />
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
                        onPageChange={(e, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10));
                            setPage(0);
                        }}
                    />
                </>
            ) : (
                <Typography variant="body2" color="textSecondary">
                    No data to display.
                </Typography>
            )}
        </Box>
    );
};

export default CSVUploadSection;
