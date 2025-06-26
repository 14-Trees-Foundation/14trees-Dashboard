import React, { useState, useRef } from 'react';
import { Box, Button, Grid, TextField, Typography, Avatar, IconButton, Tooltip, Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { Delete as DeleteIcon, Image as ImageIcon, AddPhotoAlternate, Edit as EditIcon } from '@mui/icons-material';
import { AWSUtils } from '../../../../helpers/aws';

export interface ManualDonation {
    name: string;
    email: string;
    trees_count: number;
    image_file?: File;
    image_name?: string;
    profile_image?: string;
}

const defaultDonation = (): ManualDonation => ({
    name: '',
    email: '',
    trees_count: 1,
});

interface ManualDonationAddProps {
    donations: ManualDonation[];
    onChange: (donations: ManualDonation[]) => void;
    imagePreviews?: Record<string, string>;
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

const ManualDonationAdd: React.FC<ManualDonationAddProps> = ({ 
    donations, 
    onChange, 
    imagePreviews = {},
    onImageUpload
}) => {
    const [manualDonation, setManualDonation] = useState<ManualDonation>(defaultDonation());
    const [manualDonationErrors, setManualDonationErrors] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);

    const handleManualDonationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setManualDonation({
            ...manualDonation,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const date = new Date().toISOString().split("T")[0];
        try {
            setIsUploading(true);
            const awsService = new AWSUtils();
            const imageUrl = await awsService.uploadFileToS3("gift-request", file, date);
            setManualDonation({
                ...manualDonation,
                image_file: file,
                profile_image: imageUrl
            });
        } catch (error) {
            console.error('Failed to upload image:', error);
            setManualDonationErrors(prev => [...prev, 'Failed to upload image']);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const validateManualDonation = () => {
        const errors: string[] = [];
        const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        
        // Trim values before validation
        const trimmedName = manualDonation.name.trim();
        const trimmedEmail = manualDonation.email.trim();

        if (!trimmedName) errors.push("Recipient Name is required");
        if (!trimmedEmail) errors.push("Recipient Email is required");
        if (!isValidEmail(trimmedEmail)) errors.push("Invalid Recipient Email format");
        if (!manualDonation.trees_count || isNaN(Number(manualDonation.trees_count))) {
            errors.push("Number of trees must be a number");
        } else if (Number(manualDonation.trees_count) <= 0) {
            errors.push("Number of trees must be positive");
        }

        const normalizedNewName = trimmedName.toLowerCase();
        const normalizedNewEmail = trimmedEmail.toLowerCase();

        if (editIndex === null) {
            const isDuplicate = donations.some(d => 
                d.name.trim().toLowerCase() === normalizedNewName && 
                d.email.trim().toLowerCase() === normalizedNewEmail
            );
            if (isDuplicate) {
                errors.push("A Recipient with this name and email already exists");
            }
        } else {
            const isDuplicate = donations.some((d, idx) => 
                idx !== editIndex &&
                d.name.trim().toLowerCase() === normalizedNewName && 
                d.email.trim().toLowerCase() === normalizedNewEmail
            );
            if (isDuplicate) {
                errors.push("Another Recipient with this name and email already exists");
            }
        }
        
        return errors;
    };

    const handleManualDonationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errors = validateManualDonation();
        setManualDonationErrors(errors);
        if (errors.length === 0) {
            const submissionDonation = {
                ...manualDonation,
                name: manualDonation.name.trim(),
                email: manualDonation.email.trim(),
            };

            if (editIndex !== null) {
                const updatedDonations = donations.map((d, idx) => idx === editIndex ? submissionDonation : d);
                onChange(updatedDonations);
                setEditIndex(null);
            } else {
                onChange([...donations, submissionDonation]);
            }
            setManualDonation(defaultDonation());
            setManualDonationErrors([]);
        }
    };

    const handleEditDonation = (idx: number) => {
        setManualDonation(donations[idx]);
        setEditIndex(idx);
        setManualDonationErrors([]);
    };

    const handleRemoveDonation = (idx: number) => {
        const newDonations = donations.filter((_, i) => i !== idx);
        onChange(newDonations);
        if (editIndex === idx) {
            setManualDonation(defaultDonation());
            setEditIndex(null);
        }
    };

    return (
        <Box>
            <Paper sx={{ p: 2, mb: 4, width: '97%' }} elevation={2}>
                <Box component="form" onSubmit={handleManualDonationSubmit} sx={{ width: '100%' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6}>
                            <TextField fullWidth label="Recipient Name" name="name" value={manualDonation.name} onChange={handleManualDonationChange} required />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <TextField fullWidth label="Recipient Email" name="email" value={manualDonation.email} onChange={handleManualDonationChange} required />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <TextField fullWidth label="Number of Trees" name="trees_count" value={manualDonation.trees_count} onChange={handleManualDonationChange} type="number" required />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <Box display="flex" alignItems="center" gap={2}>
                                {manualDonation.profile_image ? (
                                    <>
                                        <Avatar
                                            src={manualDonation.profile_image}
                                            alt={manualDonation.image_name || 'Uploaded image'}
                                            sx={{ width: 56, height: 56, mr: 1 }}
                                        />
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => {
                                                setManualDonation({
                                                    ...manualDonation,
                                                    profile_image: undefined,
                                                    image_file: undefined,
                                                    image_name: undefined,
                                                });
                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        startIcon={<AddPhotoAlternate />}
                                        disabled={isUploading}
                                        fullWidth
                                        sx={{ minWidth: 0 }}
                                    >
                                        {isUploading ? 'Uploading...' : 'Upload Image'}
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            ref={fileInputRef}
                                        />
                                    </Button>
                                )}
                            </Box>
                        </Grid>
                        {manualDonationErrors.length > 0 && (
                            <Grid item xs={12}>
                                <Box sx={{ mt: 1 }}>
                                    {manualDonationErrors.map((err, idx) => (
                                        <Typography key={idx} color="error" variant="body2">• {err}</Typography>
                                    ))}
                                </Box>
                            </Grid>
                        )}
                        <Grid item xs={12} display="flex" justifyContent="center" gap={2}>
                            <Button type="submit" variant="contained" color="success">
                                {editIndex !== null ? 'Update Donation' : 'Add User'}
                            </Button>
                            {editIndex !== null && (
                                <Button onClick={() => { setManualDonation(defaultDonation()); setEditIndex(null); }} variant="outlined" color="error">
                                    Cancel
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
            {donations.length > 0 && (
                <Paper sx={{ p: 2, mb: 2, width: '97%' }}>
                    <Typography variant="subtitle1" gutterBottom>Added Users</Typography>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Communication Email</TableCell>
                                    <TableCell>Trees</TableCell>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {donations.map((donation, idx) => (
                                    <TableRow key={idx} selected={editIndex === idx}>
                                        <TableCell>{donation.name}</TableCell>
                                        <TableCell>{donation.email}</TableCell>
                                        <TableCell>{donation.trees_count}</TableCell>
                                        <TableCell>
                                            {donation.profile_image ? (
                                                <Avatar src={donation.profile_image} alt={donation.image_name} sx={{ width: 32, height: 32 }} />
                                            ) : donation.image_name ? (
                                                <Tooltip title="Image not found"><ImageIcon color="error" /></Tooltip>
                                            ) : "-"}
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title="Edit"><IconButton onClick={() => handleEditDonation(idx)} size="small"><EditIcon fontSize="small" /></IconButton></Tooltip>
                                            <Tooltip title="Delete"><IconButton onClick={() => handleRemoveDonation(idx)} size="small" color="error"><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}
        </Box>
    );
};

export default ManualDonationAdd;