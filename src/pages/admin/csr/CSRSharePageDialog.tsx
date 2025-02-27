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
    style?: React.CSSProperties
}

const CSRSharePageDialog: FC<CSRSharePageDialogProps> = ({ groupId, groupName, style }) => {

    const dispatch = useAppDispatch();
    const { searchUsers } = bindActionCreators(userActionCreators, dispatch);

    const [loadingButton, setLoadingButton] = useState(false);
    const [open, setOpen] = useState(false);
    const [viewDetails, setViewDetails] = useState<View | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<{ id: number, name: string, email: string }[]>([]);
    const [searchStr, setSearchStr] = useState('');
    const [viewName, setViewName] = useState('');

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


    const handleUserSelect = (value: string) => {
        const selectedUser = usersList.find(user => `${user.name} (${user.email})` === value);
        if (selectedUser && !selectedUsers.some(user => user.id === selectedUser.id)) {
            setSelectedUsers([...selectedUsers, selectedUser]);
        }

        if (!selectedUser) {
            setSearchStr(value);
        }
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
            if (viewDetails) {
                if (viewName !== viewDetails.name) {
                    const data = { ...viewDetails, name: viewName };
                    await apiClient.updateView(data);
                }

                const viewData = await apiClient.updateViewUsers(viewDetails.id, selectedUsers);
                setViewDetails(viewData);
            } else {
                const path = '/csr/dashboard/' + groupId;
                const viewData = await apiClient.createNewView(viewName, path, selectedUsers);
                setViewDetails(viewData);
            }

        } catch (error: any) {
            toast.error(error.message);
        }
        setLoadingButton(false);
    }

    return (
        <Box
            style={style}
        >
            <Button
                variant="contained"
                color="success"
                onClick={() => { setOpen(true) }}
                disabled={!groupId}
                startIcon={<PersonAdd/>}
            >
                Share
            </Button>


            <Dialog open={open} fullWidth maxWidth='lg'>
                <DialogTitle>Share corporate dashboard</DialogTitle>
                <DialogContent dividers>

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
                            options={usersList}
                            value={searchStr}
                            onInputChange={(e, value) => { handleUserSelect(value) }}
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
                                    placeholder="Enter user email to search"
                                    variant="outlined"
                                    name="recipient_email"
                                />
                            )}>
                        </Autocomplete>
                        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selectedUsers.map((user) => (
                                <Chip
                                    key={user.id}
                                    label={`${user.name} (${user.email})`}
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
                        startIcon={<Link/>}
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