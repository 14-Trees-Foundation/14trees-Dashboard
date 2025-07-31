import { Autocomplete, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Link, TextField, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { bindActionCreators } from "@reduxjs/toolkit";
import { View } from "../../../../types/viewPermission";
import ApiClient from "../../../../api/apiClient/apiClient";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import * as userActionCreators from '../../../../redux/actions/userActions';
import { PersonAdd, Link as LinkIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { User } from "../../../../types/user";
import { UserRoles } from "../../../../types/common";

interface PersonalDashboardShareDialogProps {
    user: User;
    onUsersAdded?: () => void;
    style?: React.CSSProperties;
    disabled?: boolean;
    open: boolean;
    onClose: () => void;
}

interface UserOption {
    id?: number;
    name: string;
    email: string;
}

const PersonalDashboardShareDialog: FC<PersonalDashboardShareDialogProps> = ({ user, onUsersAdded, style, disabled = false, open, onClose }) => {
    const dispatch = useAppDispatch();
    const { searchUsers } = bindActionCreators(userActionCreators, dispatch);

    const [loadingButton, setLoadingButton] = useState(false);
    const [viewDetails, setViewDetails] = useState<View | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<{ id: number, name: string, email: string }[]>([]);
    const [searchStr, setSearchStr] = useState('');
    const [viewName, setViewName] = useState('');
    const [showNameInput, setShowNameInput] = useState(false);
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(false);

    // Handle open prop changes
    useEffect(() => {
        if (open) {
            // Initialize dialog when opened
            setSelectedUsers([]);
            setSearchStr('');
            setViewName(user.name ? `${user.name}'s Personal Dashboard` : "Personal Dashboard");
            setShowNameInput(false);
            setNewUserName('');
            setNewUserEmail('');
        }
    }, [open, user.name]);

    useEffect(() => {
        const handler = setTimeout(async () => {
            if (!user?.id) {
                setViewDetails(null);
                return;
            }
            const path = '/personal/dashboard/' + user.id;
            const apiClient = new ApiClient();
            try {
                const viewDetails = await apiClient.getViewDetails(path);
                setViewDetails(viewDetails);
            } catch (error) {
                // View doesn't exist yet, that's okay
                setViewDetails(null);
            }
        }, 300);

        return () => clearTimeout(handler);
    }, [user?.id])

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchStr.length >= 3) searchUsers(searchStr)
        }, 300);

        return () => clearTimeout(handler);
    }, [searchStr])

    useEffect(() => {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsValidEmail(emailRegex.test(searchStr));
    }, [searchStr]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (viewDetails) {
                setViewName(viewDetails.name);
                // Don't populate selectedUsers with existing users - they show in "Currently shared with"
                // selectedUsers should only contain NEW users being added
            } else {
                setSelectedUsers([]);
                setViewName(user.name + "'s Personal Dashboard");
            }
        }, 300);

        return () => clearTimeout(handler);
    }, [viewDetails, user.name])

    const usersData = useAppSelector((state) => state.searchUsersData);
    let usersList: any[] = [];
    if (usersData) {
        usersList = Object.values(usersData.users);
    }

    const handleUserDelete = (userId: number) => {
        setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
    };

    const handleCopyLink = () => {
        const link = `${window.location.origin}/personal/dashboard/${user.id}?v=${viewDetails?.view_id}`;
        navigator.clipboard.writeText(link).then(() => {
            toast.success("Link copied to clipboard!");
        }).catch((error) => {
            toast.error("Failed to copy link: " + error.message);
        });
    };

    const handleSave = async () => {
        setLoadingButton(true);
        try {
            const apiClient = new ApiClient();
            const validUsers = selectedUsers.filter(user =>
                user.email && user.email.trim() &&
                user.name && user.name.trim()
            );

            const newUsers = validUsers.filter(user => user.id === -1);
            const createdUsers = await Promise.all(
                newUsers.map(async user => {
                    const newUser = await apiClient.createUser({
                        name: user.name.trim(),
                        email: user.email.trim(),
                        key: 0,
                        id: 0,
                        user_id: "",
                        phone: "",
                        communication_email: null,
                        birth_date: null,
                        created_at: new Date(),
                        updated_at: new Date(),
                        roles: []
                    });
                    
                    // Check if user has role, if not set to 'user' role
                    if (!newUser.roles || 
                        (!newUser.roles.includes(UserRoles.User) && !newUser.roles.includes(UserRoles.Admin))) {
                        const updatedUser = await apiClient.updateUser({
                            ...newUser,
                            roles: [UserRoles.User]
                        });
                        return updatedUser;
                    }
                    
                    return newUser;
                })
            );

            // Check and update roles for existing users being added
            const existingUsers = validUsers.filter(user => user.id !== -1);
            const existingUsersWithRoles = await Promise.all(
                existingUsers.map(async user => {
                    // Check if user has proper role, if not set to 'user' role
                    if (!user.roles || 
                        (!user.roles.includes(UserRoles.User) && !user.roles.includes(UserRoles.Admin))) {
                        const updatedUser = await apiClient.updateUser({
                            ...user,
                            roles: [UserRoles.User]
                        });
                        return updatedUser;
                    }
                    return user;
                })
            );

            const allUsers = [
                ...existingUsersWithRoles,
                ...createdUsers
            ];

            if (viewDetails) {
                if (viewName !== viewDetails.name) {
                    const data = { ...viewDetails, name: viewName };
                    await apiClient.updateView(data);
                }
                const viewData = await apiClient.addViewUsers(viewDetails.id, allUsers);
                setViewDetails(viewData);
                if (onUsersAdded) {
                    onUsersAdded();
                }
            } else {
                const path = '/personal/dashboard/' + user.id;
                const viewData = await apiClient.createNewView(viewName, path, allUsers);
                setViewDetails(viewData);
                if (onUsersAdded) {
                    onUsersAdded();
                }
            }
            toast.success("Personal dashboard sharing permissions updated successfully");
            onClose();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoadingButton(false);
        }
    }

    if (!user?.id) {
        return null;
    }

    return (
        <Box style={style}>
            <Dialog open={open} fullWidth maxWidth='lg'>
                <DialogTitle>Share Personal Dashboard - {user.name}</DialogTitle>
                <DialogContent dividers>
                    <Box sx={{
                        backgroundColor: '#fff8e1',
                        padding: 2,
                        borderRadius: 1,
                        mb: 3
                    }}>
                        <Typography variant="body2" color="text.secondary">
                            ⚠️ Currently we only support google login, Please use valid google account email address only!
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            💡 This will allow other users to access and manage {user.name}'s personal gifting dashboard.
                        </Typography>
                    </Box>

                    <Box mt={3}>
                        <TextField
                            label="Dashboard Name"
                            value={viewName}
                            fullWidth
                            onChange={(e) => { setViewName(e.target.value) }}
                        />
                    </Box>

                    {/* Show already shared users */}
                    {viewDetails && viewDetails.users && viewDetails.users.length > 0 && (
                        <Box mt={3}>
                            <Typography variant="body1" gutterBottom>
                                Currently shared with ({viewDetails.users.length} users)
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                                {viewDetails.users.map((user) => (
                                    <Chip
                                        key={user.id}
                                        label={user.name ? `${user.name} (${user.email})` : user.email}
                                        color="primary"
                                        variant="outlined"
                                        size="small"
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}

                    <Box mt={3}>
                        <Typography variant="body1" gutterBottom>
                            Share with additional users
                        </Typography>

                        <Autocomplete
                            fullWidth
                            freeSolo
                            options={usersList}
                            value={searchStr}
                            onInputChange={(e: React.SyntheticEvent, value: string) => {
                                setSearchStr(value);
                            }}
                            getOptionLabel={(option: string | UserOption) => {
                                if (typeof option === 'string') return option;
                                return option.name ? `${option.name} (${option.email})` : option.email;
                            }}
                            isOptionEqualToValue={(option: UserOption, value: UserOption) => {
                                if (typeof option === 'string' || typeof value === 'string') return false;
                                return option.email === value.email;
                            }}
                            filterOptions={(options: UserOption[]) => options}
                            renderOption={(props: React.HTMLAttributes<HTMLLIElement>, option: UserOption) => (
                                <Box component="li" {...props}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                        {option.name && <Typography variant='body1'>{option.name}</Typography>}
                                        <Typography variant='body2' color={'#494b4b'}>Email: {option.email}</Typography>
                                    </Box>
                                </Box>
                            )}
                            onChange={(event: React.SyntheticEvent, newValue: string | UserOption | null) => {
                                if (!newValue) return;

                                if (typeof newValue === 'string') {
                                    // Don't do anything for string input - handled by the "Add new User" link
                                } else {
                                    // Check if user is already in the existing shared users list
                                    const isAlreadyShared = viewDetails?.users?.some(existingUser => 
                                        existingUser.id === newValue.id || existingUser.email === newValue.email
                                    );
                                    
                                    // Check if user is already in the selectedUsers list
                                    const isAlreadySelected = selectedUsers.some(user => 
                                        user.id === newValue.id || user.email === newValue.email
                                    );

                                    if (isAlreadyShared) {
                                        // Show a message that user is already shared
                                        alert(`${newValue.name || newValue.email} is already shared with this dashboard`);
                                    } else if (!isAlreadySelected) {
                                        // Add user to selectedUsers
                                        setSelectedUsers([...selectedUsers, {
                                            id: newValue.id || -1,
                                            name: newValue.name,
                                            email: newValue.email
                                        }]);
                                    }
                                    setSearchStr(''); // Clear the search string
                                }
                            }}
                            renderInput={(params) => (
                                <Box>
                                    <TextField
                                        {...params}
                                        placeholder="Enter name or email to search"
                                        variant="outlined"
                                    />

                                    {/* Show "Add new User" link when email is valid and not found */}
                                    {isValidEmail && searchStr.includes('@') &&
                                        !usersList.some(user => user.email === searchStr) && (
                                            <Box sx={{ mt: 1 }}>
                                                <Typography variant="body2">
                                                    The user with the given email id doesn't exist.{" "}
                                                    <Link
                                                        component="button"
                                                        onClick={() => {
                                                            setNewUserEmail(searchStr);
                                                            setShowNameInput(true);
                                                        }}
                                                        sx={{ cursor: 'pointer' }}
                                                    >
                                                        Add new User
                                                    </Link>
                                                </Typography>
                                            </Box>
                                        )}
                                </Box>
                            )}
                        />

                        {/* New user input fields */}
                        {showNameInput && (
                            <Box sx={{ mt: 2 }}>
                                <Box sx={{
                                    display: 'flex',
                                    gap: 2,
                                    mb: 2
                                }}>
                                    <TextField
                                        autoFocus
                                        fullWidth
                                        label="Name *"
                                        value={newUserName}
                                        onChange={(e) => setNewUserName(e.target.value)}
                                        error={!newUserName?.trim()}
                                        helperText={!newUserName?.trim() ? "Name is required" : ""}
                                        required
                                    />
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        value={newUserEmail}
                                        disabled
                                    />
                                </Box>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: 2
                                }}>
                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            if (newUserName?.trim() && newUserEmail) {
                                                setSelectedUsers([...selectedUsers, {
                                                    id: -1,
                                                    name: newUserName.trim(),
                                                    email: newUserEmail.trim()
                                                }]);
                                                setShowNameInput(false);
                                                setNewUserName('');
                                                setNewUserEmail('');
                                                setSearchStr('');
                                            }
                                        }}
                                    >
                                        Add
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => {
                                            setShowNameInput(false);
                                            setNewUserName('');
                                            setNewUserEmail('');
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        )}

                        {selectedUsers.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" gutterBottom color="text.secondary">
                                    Users to be added:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selectedUsers.map((user) => (
                                        <Chip
                                            key={user.id}
                                            label={user.name ? `${user.name} (${user.email})` : user.email}
                                            onDelete={() => handleUserDelete(user.id)}
                                            color="secondary"
                                            sx={{ marginRight: 0.5 }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={onClose}
                        color="error"
                        variant="outlined"
                        sx={{ mr: 2 }}
                    >
                        Close
                    </Button>
                    <Button
                        color="success"
                        variant="outlined"
                        sx={{ mr: 2, textTransform: 'none' }}
                        startIcon={<LinkIcon />}
                        disabled={!viewDetails}
                        onClick={handleCopyLink}
                    >
                        Copy Link
                    </Button>
                    <LoadingButton
                        loading={loadingButton}
                        color="success"
                        variant="contained"
                        sx={{ mr: 2 }}
                        onClick={handleSave}
                    >
                        Save
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default PersonalDashboardShareDialog;