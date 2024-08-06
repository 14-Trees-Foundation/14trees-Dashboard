import { Autocomplete, Button, Grid, TextField, Typography } from "@mui/material";
import { FC, useRef, useState } from "react";
import Papa from 'papaparse';

interface User {
    name: string;
    phone: string;
    email: string;
    gifted_trees?: number;
}

interface BulkUserFormProps {
    onSubmit: (users: User[]) => void;
}

const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidPhone = (phone: string) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // International phone number validation
    return phoneRegex.test(phone);
};

export const BulkUserForm: FC<BulkUserFormProps> = ({ onSubmit }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [fileError, setFileError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = () => {
        if (users.length === 0) {
            setFileError("Please upload a valid CSV file with user details.");
            return;
        }
        onSubmit(users);
        handleCancel();
    };

    const handleCancel = () => {
        setUsers([]);
        setFileError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleFileChange = (e: any) => {
        if (e.target.files) {
            const file = e.target.files[0];
            if (file) {
                Papa.parse(file, {
                    header: true,
                    complete: (results: any) => {
                        const parsedUsers: User[] = results.data.map((user: any) => ({
                            name: user['Name'],
                            phone: user['Phone'],
                            email: user['Email ID'],
                            gifted_trees: user.gifted_trees ? parseInt(user.gifted_trees) : undefined,
                        }));

                        const validUsers = parsedUsers.filter(user => isValidEmail(user.email) && isValidPhone(user.phone));

                        if (validUsers.length !== parsedUsers.length) {
                            setFileError("Some rows in the CSV file have invalid phone or email values.");
                        } else {
                            setFileError(null);
                        }

                        setUsers(validUsers);
                    },
                    error: () => {
                        setFileError("Failed to parse CSV file. Please ensure it is formatted correctly.");
                    },
                });
            }
        }
    };

    return (
        <div>
            <Grid container rowSpacing={2} columnSpacing={1}>
                <Grid item xs={12}>
                    <Typography>Download sample file from <a href="https://docs.google.com/spreadsheets/d/1ypVdbR44nQXuaHAEOrwywY3k-lfJdsRZ9iKp0Jpq7Kw/gviz/tq?tqx=out:csv&sheet=Sheet1">here</a> and fill the details.</Typography>
                    <TextField
                        type="file"
                        inputProps={{ accept: '.csv' }}
                        onChange={handleFileChange}
                        fullWidth
                        margin="normal"
                        error={!!fileError}
                        helperText={fileError}
                        inputRef={fileInputRef}
                    />
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="outlined"
                        color='error'
                        onClick={handleCancel}
                        style={{ marginRight: '10px' }}
                    >Cancel</Button>
                    <Button
                        variant="contained"
                        color='success'
                        onClick={handleSubmit}
                    >Upload</Button>
                </Grid>
            </Grid>
        </div>
    );
};
