import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, FormGroup, FormLabel, Divider } from "@mui/material";
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
        roles: [] as string[],
        pin: '',
        enableMobileAccess: false,
        mobileRole: 'treelogging' as 'admin' | 'treelogging',
    });

    React.useEffect(() => {
        if (user) {
            const hasPin = user.pin && user.pin.length > 0;
            const hasMobileAccess = user.phone && user.pin && user.phone !== "0";
            const roles = user.roles || [];
            const mobileRole = roles.includes('admin') ? 'admin' : 'treelogging';
            
            setFormData({
                name: user.name,
                phone: user.phone ?? '',
                email: user.email,
                communication_email: user.communication_email ?? '',
                birth_date: user.birth_date ?? '',
                roles: roles,
                pin: user.pin ?? '',
                enableMobileAccess: hasMobileAccess,
                mobileRole: mobileRole,
            });
        } else {
            // Reset form for new user
            setFormData({
                name: '',
                phone: '',
                email: '',
                communication_email: '',
                birth_date: '',
                roles: [],
                pin: '',
                enableMobileAccess: false,
                mobileRole: 'treelogging',
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

    const handleRoleChange = (role: string) => {
        const currentRoles = formData.roles;
        const updatedRoles = currentRoles.includes(role)
            ? currentRoles.filter(r => r !== role)
            : [...currentRoles, role];
        setFormData({ ...formData, roles: updatedRoles });
    };

    const handleMobileAccessChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enabled = event.target.checked;
        setFormData({ 
            ...formData, 
            enableMobileAccess: enabled,
            pin: enabled ? formData.pin : '' // Clear PIN if mobile access is disabled
        });
    };

    const handlePinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/\D/g, '').slice(0, 4);
        setFormData({ ...formData, pin: value });
    };

    const handleMobileRoleChange = (event: any) => {
        setFormData({ ...formData, mobileRole: event.target.value });
    };

    const handleEmailChange = (event: any, value: string) => {
        let isSet = false;
        usersList.forEach((user) => {
            if (`${user.name} (${user.email})` === value) {
                isSet = true;
                const hasPin = user.pin && user.pin.length > 0;
                const hasMobileAccess = user.phone && user.pin && user.phone !== "0";
                const roles = user.roles || [];
                const mobileRole = roles.includes('admin') ? 'admin' : 'treelogging';
                
                setFormData({
                    'email': user.email,
                    'name': user.name,
                    'communication_email': user.communication_email ?? '',
                    'phone': user.phone ?? '',
                    'birth_date': user.birth_date ?? '',
                    'roles': roles,
                    'pin': user.pin ?? '',
                    'enableMobileAccess': hasMobileAccess,
                    'mobileRole': mobileRole,
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

    const handleSubmit = () => {
        // Prepare roles array
        let finalRoles = [...formData.roles];
        
        // If mobile access is enabled, ensure the selected mobile role is included
        if (formData.enableMobileAccess && formData.mobileRole) {
            if (!finalRoles.includes(formData.mobileRole)) {
                finalRoles.push(formData.mobileRole);
            }
        }

        // Prepare the user data for API
        const apiUserData = {
            name: formData.name,
            phone: formData.phone,
            email: formData.email.trim() === '' 
                    ? formData.name.toLocaleLowerCase().replaceAll(" ", '.') + "@14trees" 
                    : formData.email,
            communication_email: formData.communication_email.trim() === '' 
                    ? null
                    : formData.communication_email,
            birth_date: formData.birth_date.trim() === '' ? null : formData.birth_date,
            roles: finalRoles.length > 0 ? finalRoles : [],
            pin: formData.enableMobileAccess && formData.pin ? formData.pin : null,
        };

        if (user) {
            // update user
            const updatedData = {
                ...user,
                ...apiUserData,
            }

            updateUser(updatedData);
        } else {
            createUser(apiUserData as any);
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
            roles: [],
            pin: '',
            enableMobileAccess: false,
            mobileRole: 'treelogging',
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
                    
                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            Dashboard Roles
                        </Typography>
                        <FormGroup row>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.roles.includes('user')}
                                        onChange={() => handleRoleChange('user')}
                                    />
                                }
                                label="User"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.roles.includes('admin')}
                                        onChange={() => handleRoleChange('admin')}
                                    />
                                }
                                label="Admin"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.roles.includes('treelogging')}
                                        onChange={() => handleRoleChange('treelogging')}
                                    />
                                }
                                label="Tree Logging"
                            />
                        </FormGroup>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            Mobile Access
                        </Typography>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.enableMobileAccess}
                                    onChange={handleMobileAccessChange}
                                />
                            }
                            label="Enable Mobile Application Access"
                        />
                        
                        {formData.enableMobileAccess && (
                            <Box sx={{ mt: 2 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="4-Digit PIN"
                                            type="password"
                                            value={formData.pin}
                                            onChange={handlePinChange}
                                            placeholder="Enter 4-digit PIN"
                                            inputProps={{ maxLength: 4 }}
                                            fullWidth
                                            helperText="Required for mobile access"
                                            error={formData.enableMobileAccess && formData.pin.length !== 4}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Mobile Role</InputLabel>
                                            <Select
                                                value={formData.mobileRole}
                                                onChange={handleMobileRoleChange}
                                                label="Mobile Role"
                                            >
                                                <MenuItem value="treelogging">Tree Logging</MenuItem>
                                                <MenuItem value="admin">Admin</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                                    Mobile access requires a phone number and 4-digit PIN. The selected mobile role will be automatically added to dashboard roles.
                                </Typography>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="error" onClick={handleClose}>Cancel</Button>
                <Button 
                    variant="contained" 
                    color="success" 
                    type="submit" 
                    disabled={
                        helpersText ? true : 
                        (formData.enableMobileAccess && (!formData.phone || formData.pin.length !== 4))
                    } 
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default UserForm;