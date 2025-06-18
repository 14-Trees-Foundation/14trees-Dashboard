import { Autocomplete, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Link, MenuItem, OutlinedInput, Select, TextField, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { bindActionCreators } from "@reduxjs/toolkit";
import { View } from "../../../types/viewPermission";
import ApiClient from "../../../api/apiClient/apiClient";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import * as userActionCreators from '../../../redux/actions/userActions';
import { PersonAdd } from "@mui/icons-material";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";

interface CSRSharePageDialogProps {
    groupId?: number
    groupName?: string
    style?: React.CSSProperties;
    disabled?: boolean;
}

interface UserOption {
    id?: number;
    name: string;
    email: string;
}

const CSRSharePageDialog: FC<CSRSharePageDialogProps> = ({ groupId, groupName, style, disabled = false }) => {
    const dispatch = useAppDispatch();
    const { searchUsers } = bindActionCreators(userActionCreators, dispatch);

    const [loadingButton, setLoadingButton] = useState(false);
    const [open, setOpen] = useState(false);
    const [viewDetails, setViewDetails] = useState<View | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<{ id: number, name: string, email: string }[]>([]);
    const [searchStr, setSearchStr] = useState('');
    const [viewName, setViewName] = useState('');
    const [showNameInput, setShowNameInput] = useState(false);
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(false);

    useEffect(() => {
        const handler = setTimeout(async () => {
            if (!groupId) {
                setViewDetails(null);
                return;
            }
            const path = '/csr/dashboard/' + groupId;
            const apiClient = new ApiClient();
            const viewDetails = await apiClient.getViewDetails(path);
            setViewDetails(viewDetails);
        }, 300);

        return () => clearTimeout(handler);
    }, [groupId])

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
                setSelectedUsers(viewDetails.users ?? []);
            } else {
                setSelectedUsers([]);
                setViewName(groupName + " Dashboard");
            }
        }, 300);

        return () => clearTimeout(handler);
    }, [viewDetails, groupName])

    const usersData = useAppSelector((state) => state.searchUsersData);
    let usersList: any[] = [];
    if (usersData) {
        usersList = Object.values(usersData.users);
    }

    const handleOpen = () => {
        setOpen(true);
        setSelectedUsers([]);
        setSearchStr('');
        setViewName(groupName ? `${groupName} Dashboard` : "");
        setShowNameInput(false);
        setNewUserName('');
        setNewUserEmail('');
    };

    const handleUserDelete = (userId: number) => {
        setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
    };

    const handleCopyLink = () => {
        const link = `${window.location.origin}/csr/dashboard/${groupId}?v=${viewDetails?.view_id}`;
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
                newUsers.map(user => apiClient.createUser({
                    name: user.name.trim(),
                    email: user.email.trim(),
                    key: 0,
                    id: 0,
                    user_id: "",
                    phone: "",
                    communication_email: null,
                    birth_date: null,
                    created_at: new Date(),
                    updated_at: new Date()
                }))
            );

            const allUsers = [
                ...validUsers.filter(user => user.id !== -1),
                ...createdUsers
            ];

            if (viewDetails) {
                if (viewName !== viewDetails.name) {
                    const data = { ...viewDetails, name: viewName };
                    await apiClient.updateView(data);
                }
                const viewData = await apiClient.updateViewUsers(viewDetails.id, allUsers);
                setViewDetails(viewData);
            } else {
                const path = '/csr/dashboard/' + groupId;
                const viewData = await apiClient.createNewView(viewName, path, allUsers);
                setViewDetails(viewData);
            }

        } catch (error: any) {
            toast.error(error.message);
        }
        setLoadingButton(false);
    }

    return (
        <Box style={style}>
            <Button
                variant="contained"
                color="success"
                onClick={handleOpen}
                disabled={!groupId}
                startIcon={<PersonAdd />}
            >
                Share
            </Button>

            <Dialog open={open} fullWidth maxWidth='lg'>
                <DialogTitle>Share corporate dashboard</DialogTitle>
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
                    </Box>

                    <Box mt={3}>
                        <TextField
                            label="Page Name"
                            value={viewName}
                            fullWidth
                            onChange={(e) => { setViewName(e.target.value) }}
                        />
                    </Box>

                    <Box mt={3}>
                        <Typography variant="body1" gutterBottom>
                            Share with users
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
                                    // Existing user selected - add directly to selectedUsers
                                    if (!selectedUsers.some(user => user.id === newValue.id)) {
                                        setSelectedUsers([...selectedUsers, {
                                            id: newValue.id || -1,
                                            name: newValue.name,
                                            email: newValue.email
                                        }]);
                                        setSearchStr(''); // Clear the search string
                                    }
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

                        {/* New user input fields - UPDATED LAYOUT */}
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

                        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
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
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpen(false)}
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
                        startIcon={<Link />}
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

export default CSRSharePageDialog;