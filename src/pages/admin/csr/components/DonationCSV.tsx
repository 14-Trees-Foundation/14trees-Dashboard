// CSVUploadSection.tsx
import React, { useState, useRef } from "react";
import {
    Box,
    Typography,
    Button,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    Tooltip,
    TablePagination,
    Link,
    Avatar
} from "@mui/material";
import { Close as CloseIcon, Done, Image as ImageIcon } from "@mui/icons-material";
import { getUniqueRequestId } from "../../../../helpers/utils"
import UserImagesForm from "../../donation/Forms/UserImagesForm"
import Papa from "papaparse";
import { toast } from "react-toastify";

type CSVUploadSectionProps = {
    onValidationChange: (isValid: boolean, isUploaded: boolean, error: string) => void;
    onRecipientsChange?: (recipients: any[]) => void;  // New callback
    totalTreesSelected: number;
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

const CSVUploadSection: React.FC<CSVUploadSectionProps> = ({ onValidationChange, onRecipientsChange, totalTreesSelected }) => {
    const [data, setData] = useState<string[][]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [errorsMap, setErrorsMap] = useState<Record<number, string[]>>({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [requestId, setRequestId] = useState<string>(getUniqueRequestId());
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [imageValidationErrors, setImageValidationErrors] = useState<Record<number, string>>({});
    const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateHeaders = (headers: string[]): string[] => {
        return REQUIRED_HEADERS.filter(header => !headers.includes(header))
            .map(missing => `Missing required header: ${missing}`);
    };

    const validateRow = (row: string[]): string[] => {
        const errors: string[] = [];
        const [name, email, trees] = row;

        const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

        if (!name?.trim()) errors.push("Recipient Name is required");
        if (email && !isValidEmail(email)) errors.push("Invalid Email format");
        if (!trees || isNaN(Number(trees)) || Number(trees) <= 0) {
            errors.push("Number of trees is required");
        }

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
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            const filename = pathname.split('/').pop() || '';
            return decodeURIComponent(filename);
        } catch {
            return '';
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

        const newErrorsMap: Record<number, string[]> = {};
        let totalCsvTrees = 0;
        const nameIndex = firstRow.findIndex(h => h === "Recipient Name");
        const emailIndex = firstRow.findIndex(h => h === "Recipient Email");
        const treesIndex = firstRow.findIndex(h => h === "Number of trees");
        const imageIndex = firstRow.findIndex(h => h === "Image Name (optional)");

        const formattedRecipients = rows.map((row, idx) => {
            const errors = validateRow(row);
            if (errors.length > 0) {
                newErrorsMap[idx] = errors;
            }

            const trees = Number(row[treesIndex]);
            if (!isNaN(trees)) {
                totalCsvTrees += trees;
            }

            return {
                name: row[nameIndex],
                email: row[emailIndex],
                trees_count: trees,
                image_name: imageIndex !== -1 ? row[imageIndex] : null,
                image_url: imageIndex !== -1 && row[imageIndex] ? imagePreviews[row[imageIndex]] : null
            };
        });

        // Validate total trees
        if (totalCsvTrees > totalTreesSelected) {
            toast.error(`Total trees in CSV (${totalCsvTrees}) exceeds selected trees (${totalTreesSelected})`);
            onValidationChange(false, true, `Total trees in CSV (${totalCsvTrees}) exceeds selected trees (${totalTreesSelected})`);
            return;
        }

        setData(rows); // Keep original rows for display
        setErrorsMap(newErrorsMap);

        const hasErrors = Object.keys(newErrorsMap).length > 0;
        onValidationChange(
            !hasErrors,
            true,
            hasErrors ? "One or more rows have validation errors" : ""
        );

        // Call separate callback for recipients if no errors
        if (!hasErrors && onRecipientsChange) {
            onRecipientsChange(formattedRecipients);
        }
    }


    const validateImages = (csvData: string[][], headers: string[], uploadedImages: string[]) => {
        const imageNameIndex = headers.findIndex(h => h === "Image Name (optional)");
        if (imageNameIndex === -1) return;

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

        // Combine CSV + image errors
        const hasRowErrors = Object.keys(errorsMap).length > 0;
        const hasImageErrors = Object.keys(errors).length > 0;

        const isValid = !hasRowErrors && !hasImageErrors;
        onValidationChange(isValid, data.length > 0, isValid ? "" : "Image validation failed");
    };


    const handleImageUpload = (urls: string[]) => {
        setImageUrls(urls);
        // Revalidate images when new images are uploaded
        if (data.length > 0 && headers.length > 0) {
            validateImages(data, headers, urls);
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
            },
        });
    };


    return (
        <Box>
            <Typography mb={2}>
                Upload recipient details using a CSV file.{" "}
                <Link component="button" onClick={downloadSampleCSV} sx={{ textDecoration: "underline" }}>
                    Download sample CSV
                </Link>
            </Typography>

            <UserImagesForm requestId={requestId} onUpload={handleImageUpload} />

            <Button
                variant="contained"
                component="label"
                color="success"
                sx={{ mr: 2 }}
            >
                Upload CSV
                <input type="file" accept=".csv" hidden onChange={handleFileUpload} ref={fileInputRef} />
            </Button>

            {data.length > 0 && (
                <>
                    <TableContainer component={Paper} sx={{ maxHeight: 400, mt: 3 }}>
                        <Table size="small" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Status</TableCell>
                                    {headers.map((h, i) => (
                                        <TableCell key={i}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, rowIndex) => {
                                        const idx = page * rowsPerPage + rowIndex;
                                        const errors = errorsMap[idx];
                                        const hasError = !!errors?.length;
                                        const imageNameIndex = headers.findIndex(h => h === "Image Name (optional)");
                                        const imageName = imageNameIndex !== -1 ? row[imageNameIndex]?.trim() : "";
                                        const imageError = imageValidationErrors[idx];


                                        return (
                                            <TableRow
                                                key={idx}
                                                sx={{ backgroundColor: hasError ? '#ffe6e6' : 'inherit' }}
                                            >
                                                <TableCell>
                                                    {hasError ? (
                                                        <Tooltip title={errors?.join(", ")} arrow>
                                                            <CloseIcon color="error" fontSize="small" />
                                                        </Tooltip>
                                                    ) : (
                                                        <Done color="success" fontSize="small" />
                                                    )}
                                                </TableCell>
                                                {row.map((cell, i) => (
                                                    <TableCell key={i}>{cell}</TableCell>
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
                        rowsPerPageOptions={[5, 10, 25]}
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
            )}
        </Box>
    );
};

export default CSVUploadSection;