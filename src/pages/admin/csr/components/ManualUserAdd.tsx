import React, { useState, useRef } from 'react';
import { Box, Button, Grid, TextField, Typography, Avatar, IconButton, Tooltip, Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { Delete as DeleteIcon, Image as ImageIcon, AddPhotoAlternate, Edit as EditIcon } from '@mui/icons-material';
import { AWSUtils } from '../../../../helpers/aws';

export interface ManualUser {
    name: string;
    email: string;
    communication_email: string;
    birth_date: string;
    trees_count: number;
    image_file?: File;
    image_name?: string;
    profile_image?: string;
    event_name: string;
    gifted_by: string;
    gifted_on: string;
}

interface ManualUserAddProps {
    users: ManualUser[];
    onChange: (users: ManualUser[]) => void;
    eventType: string | undefined;
    imagePreviews?: Record<string, string>;
}

const defaultUser = (): ManualUser => ({
    name: '',
    email: '',
    communication_email: '',
    birth_date: '',
    trees_count: 1,
    event_name: '',
    gifted_by: '',
    gifted_on: new Date().toISOString().slice(0, 10),
});

const ManualUserAdd: React.FC<ManualUserAddProps> = ({ 
    users, 
    onChange, 
    eventType,
}) => {
    const [manualUser, setManualUser] = useState<ManualUser>(defaultUser());
    const [manualUserErrors, setManualUserErrors] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);

    const showEventFields = eventType !== '3' && eventType !== '6';

    const handleManualUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setManualUser({
            ...manualUser,
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
            setManualUser({
                ...manualUser,
                image_file: file,
                profile_image: imageUrl
            });
            setManualUserErrors(prev => ({ ...prev, image_file: '' }));
        } catch (error) {
            console.error('Failed to upload image:', error);
            setManualUserErrors(prev => ({ ...prev, image_file: 'Failed to upload image' }));
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const validateManualUser = () => {
        const errors: Record<string, string> = {};
        const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        const isValidDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(Date.parse(value));

        if (!manualUser.name.trim()) errors.name = "Recipient Name is required";
        if (manualUser.email.trim() && !isValidEmail(manualUser.email)) errors.email = "Invalid Recipient Email format";
        if (manualUser.communication_email && !isValidEmail(manualUser.communication_email)) errors.communication_email = "Invalid Communication Email format";
        if (manualUser.birth_date && !isValidDate(manualUser.birth_date)) errors.birth_date = "Invalid Date of Birth format (YYYY-MM-DD)";
        if (!manualUser.trees_count || isNaN(Number(manualUser.trees_count)) || Number(manualUser.trees_count) <= 0) errors.trees_count = "Number of trees must be a positive number";

        if (showEventFields) {
            if (manualUser.gifted_on && !isValidDate(manualUser.gifted_on)) errors.gifted_on = "Invalid Gifted On date format (YYYY-MM-DD)";
        }

        return errors;
    };

    const handleManualUserSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errors = validateManualUser();

        // Duplicate check (case-insensitive, trimmed)
        const normalizedName = manualUser.name.trim().toLowerCase();
        const normalizedEmail = manualUser.email.trim().toLowerCase();
        const duplicate = users.some((u, idx) => {
            if (editIndex !== null && idx === editIndex) return false; // skip self when editing
            return u.name.trim().toLowerCase() === normalizedName && u.email.trim().toLowerCase() === normalizedEmail;
        });
        if (duplicate) {
            errors.duplicate = 'A recipient with this name and email already exists.';
        }

        setManualUserErrors(errors);
        if (Object.keys(errors).length === 0) {
            if (editIndex !== null) {
                // Update existing user
                const updatedUsers = users.map((u, idx) => idx === editIndex ? manualUser : u);
                onChange(updatedUsers);
                setEditIndex(null);
            } else {
                // Add new user
                onChange([...users, manualUser]);
            }
            setManualUser(defaultUser());
            setManualUserErrors({});
        }
    };

    const handleEditUser = (idx: number) => {
        setManualUser(users[idx]);
        setEditIndex(idx);
        setManualUserErrors({});
    };

    const handleRemoveUser = (idx: number) => {
        const newUsers = users.filter((_, i) => i !== idx);
        onChange(newUsers);
        // If editing this user, reset form
        if (editIndex === idx) {
            setManualUser(defaultUser());
            setEditIndex(null);
        }
    };

    return (
        <Box>
            <Paper sx={{ p: 2, mb: 4, width: '97%' }} elevation={2}>
                <Box component="form" onSubmit={handleManualUserSubmit} sx={{ width: '100%' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6}>
                            <TextField fullWidth label="Recipient Name" name="name" value={manualUser.name} onChange={handleManualUserChange} required />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <TextField fullWidth label="Recipient Email" name="email" value={manualUser.email} onChange={handleManualUserChange} />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <TextField fullWidth label="Communication Email" name="communication_email" value={manualUser.communication_email} onChange={handleManualUserChange} />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <TextField fullWidth label="Date of Birth" name="birth_date" value={manualUser.birth_date} onChange={handleManualUserChange} type="date" InputLabelProps={{ shrink: true }} />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <TextField fullWidth label="Number of Trees" name="trees_count" value={manualUser.trees_count} onChange={handleManualUserChange} type="number" required />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <Box display="flex" alignItems="center" gap={2}>
                                {manualUser.profile_image ? (
                                    <>
                                        <Avatar
                                            src={manualUser.profile_image}
                                            alt={manualUser.image_name || 'Uploaded image'}
                                            sx={{ width: 56, height: 56, mr: 1 }}
                                        />
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => {
                                                setManualUser({
                                                    ...manualUser,
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
                        {showEventFields && (
                            <>
                                <Grid item xs={12} sm={12} md={6}>
                                    <TextField fullWidth label="Occasion Name" name="event_name" value={manualUser.event_name} onChange={handleManualUserChange} />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                    <TextField fullWidth label="Gifted By" name="gifted_by" value={manualUser.gifted_by} onChange={handleManualUserChange} />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                    <TextField fullWidth label="Gifted On" name="gifted_on" value={manualUser.gifted_on} onChange={handleManualUserChange} type="date" InputLabelProps={{ shrink: true }} />
                                </Grid>
                            </>
                        )}
                        {Object.keys(manualUserErrors).length > 0 && (
                            <Grid item xs={12}>
                                <Box sx={{ mt: 1 }}>
                                    {Object.entries(manualUserErrors).filter(([_, error]) => error).map(([field, error]) => (
                                        <Typography key={field} color="error" variant="body2">• {error}</Typography>
                                    ))}
                                </Box>
                            </Grid>
                        )}
                        <Grid item xs={12} display="flex" justifyContent="center" gap={2}>
                            <Button type="submit" variant="contained" color="success">
                                {editIndex !== null ? 'Update User' : 'Add User'}
                            </Button>
                            {editIndex !== null && (
                                <Button onClick={() => { setManualUser(defaultUser()); setEditIndex(null); }} variant="outlined" color="error">
                                    Cancel
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
            {users.length > 0 && (
                <Paper sx={{ p: 2, mb: 2, width: '97%' }}>
                    <Typography variant="subtitle1" gutterBottom>Added Users</Typography>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Communication Email</TableCell>
                                    <TableCell>Date of Birth</TableCell>
                                    <TableCell>Trees</TableCell>
                                    <TableCell>Image</TableCell>
                                    {showEventFields && <TableCell>Occasion Name</TableCell>}
                                    {showEventFields && <TableCell>Gifted By</TableCell>}
                                    {showEventFields && <TableCell>Gifted On</TableCell>}
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user, idx) => (
                                    <TableRow key={idx} selected={editIndex === idx}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email || "-"}</TableCell>
                                        <TableCell>{user.communication_email || '-'}</TableCell>
                                        <TableCell>{user.birth_date || '-'}</TableCell>
                                        <TableCell>{user.trees_count}</TableCell>
                                        <TableCell>
                                            {user.profile_image ? (
                                                <Avatar src={user.profile_image} alt={user.image_name} sx={{ width: 32, height: 32 }} />
                                            ) : user.image_name ? (
                                                <Tooltip title="Image not found"><ImageIcon color="error" /></Tooltip>
                                            ) : "-"}
                                        </TableCell>
                                        {showEventFields && <TableCell>{user.event_name || "-"}</TableCell>}
                                        {showEventFields && <TableCell>{user.gifted_by || "-"}</TableCell>}
                                        {showEventFields && <TableCell>{user.gifted_on || "-"}</TableCell>}
                                        <TableCell>
                                            <Tooltip title="Edit"><IconButton onClick={() => handleEditUser(idx)} size="small"><EditIcon fontSize="small" /></IconButton></Tooltip>
                                            <Tooltip title="Delete"><IconButton onClick={() => handleRemoveUser(idx)} size="small" color="error"><DeleteIcon fontSize="small" /></IconButton></Tooltip>
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

export default ManualUserAdd; 