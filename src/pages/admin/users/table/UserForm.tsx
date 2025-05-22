import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from "@mui/material";
import { User } from "../../../../types/user";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import * as userActionCreators from "../../../../redux/actions/userActions";
import { bindActionCreators } from "@reduxjs/toolkit";

const defaultHanlperText = 'Email already exists in the system for a different user. You can use the same email in new user as communication address.';

interface UserFormProps {
    open: boolean;
    onClose: () => void;
    user: User | null;
}

const UserForm: React.FC<UserFormProps> = ({ open, user, onClose }) => {

    const dispatch = useAppDispatch();
    const { searchUsers, createUser, updateUser } =
        bindActionCreators(userActionCreators, dispatch);

    const [helpersText, setHelpersText] = React.useState<string | undefined>(undefined);
    const [formData, setFormData] = React.useState({
        name: '',
        phone: '',
        email: '',
        communication_email: '',
        birth_date: '',
    });

    React.useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                phone: user.phone ?? '',
                email: user.email,
                communication_email: user.communication_email ?? '',
                birth_date: user.birth_date ?? '',
            });
        }
    }, [user]);

    let usersList: User[] = [];
    const usersData = useAppSelector((state) => state.searchUsersData);
    if (usersData) {
        usersList = Object.values(usersData.users);
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleEmailChange = (event: any, value: string) => {
        let isSet = false;
        usersList.forEach((user) => {
            if (`${user.name} (${user.email})` === value) {
                isSet = true;
                setFormData({
                    'email': user.email,
                    'name': user.name,
                    'communication_email': user.communication_email ?? '',
                    'phone': user.phone ?? '',
                    'birth_date': user.birth_date ?? '',
                })
            }
        })

        if (!isSet) {
            setFormData({
                ...formData,
                'email': value,
            })
            if (value.length >= 3) searchUsers(value);
        }
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();

        const userData = {
            ...formData,
            birth_date: formData.birth_date.trim() === '' ? null : formData.birth_date,
            email: formData.email.trim() === '' 
                    ? formData.name.toLocaleLowerCase().replaceAll(" ", '.') + "@14trees" 
                    : formData.email,
            communication_email: formData.communication_email.trim() === '' 
                    ? null
                    : formData.communication_email,
        }

        if (user) {
            // update user
            const updatedData = {
                ...user,
                ...userData,
            }

            updateUser(updatedData);
        } else {
            createUser(userData as any);
        }
        
        handleClose();
    };

    const handleClose = () => {
        setFormData({
            name: '',
            phone: '',
            email: '',
            communication_email: '',
            birth_date: '',
        });
        onClose();
    };

    React.useEffect(() => {

        const handler = setTimeout(() => {
            const item = usersList.find((user) => user.email === formData.email);
            if (item && user) {
                if (item.email !== user.email && item.name !== user.name) setHelpersText(defaultHanlperText);
                else setHelpersText(undefined);
            } else if (item) {
                setHelpersText(defaultHanlperText);
            } else {
                setHelpersText(undefined);
            }  
        }, 300);

        return () => {
            clearTimeout(handler);
        }
    }, [usersList, formData, user]);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            component='form'
            onSubmit={handleSubmit}
            maxWidth='md'
        >
            <DialogTitle>{user ? 'Edit User' : 'Add User'}</DialogTitle>
            <DialogContent dividers>
                <Grid container rowSpacing={2} columnSpacing={1} sx={{ padding: '20px 80px' }}>
                    <Grid item xs={12}>
                        <TextField 
                            required
                            name="name" 
                            label="Name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            fullWidth 
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            name="phone" 
                            label="Phone" 
                            value={formData.phone} 
                            onChange={handleChange} 
                            fullWidth 
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Autocomplete
                            fullWidth
                            options={usersList}
                            noOptionsText="No Users"
                            value={formData.email}
                            onInputChange={handleEmailChange}
                            getOptionLabel={(option: any) => option.email ? `${option.name} (${option.email})` : option}
                            isOptionEqualToValue={(option, value) => option.email ? option.email === value.email : option === value}
                            renderOption={(props: any, option) => {
                                return (
                                    <Box
                                        {...props}
                                    >
                                        {option.email ? (
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                <Typography variant='body1'>{option.name}</Typography>
                                                <Typography variant='body2' color={'#494b4b'}>Email: {option.email}</Typography>
                                                {option.communication_email && <Typography variant='subtitle2' color={'GrayText'}>Comm. Email: {option.communication_email}</Typography>}
                                            </Box>
                                        ) : (
                                            <Typography>{option}</Typography>
                                        )}
                                    </Box>
                                );
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    name='email'
                                    label="Email"
                                    variant="outlined"
                                    helperText={helpersText}
                                />
                            )}>
                        </Autocomplete>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="communication_email"
                            label="Communication email"
                            value={formData.communication_email}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField name="birth_date" label="Date of Birth" type="date" value={formData.birth_date ? formData.birth_date.substring(0, 10) : ''} onChange={handleChange} InputLabelProps={{ shrink: true }} fullWidth />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="error" onClick={handleClose}>Cancel</Button>
                <Button variant="contained" color="success" type="submit" disabled={helpersText ? true : false}>Submit</Button>
            </DialogActions>
        </Dialog>
    );
}

export default UserForm;