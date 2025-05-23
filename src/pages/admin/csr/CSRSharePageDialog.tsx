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
    isNew?: boolean;
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
            // Filter out any invalid users (where name might be undefined)
            const validUsers = selectedUsers.filter(user => 
               user.email && user.email.trim() && 
               user.name && user.name.trim()
        );
            
            // First create any new users
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
    
            // Replace temp users with created ones
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
                <Box 
            sx={{ 
                backgroundColor: '#fff8e1', 
                padding: 2, 
                borderRadius: 1,
                mb: 3
            }}
        >
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
                    setSearchStr(value) 
                    }}
                     getOptionLabel={(option: string | UserOption) => {
                        if (typeof option === 'string') return option;
                           return `${option.name} (${option.email})`;
                     }}
                    isOptionEqualToValue={(option: UserOption, value: UserOption) => {
                        if (typeof option === 'string' || typeof value === 'string') return false;
                            return option.email === value.email;
                    }}
                  filterOptions={(options: UserOption[], params) => {
                     const filtered = options.filter(option => 
                        option.email.toLowerCase().includes(params.inputValue.toLowerCase()) ||
                        option.name.toLowerCase().includes(params.inputValue.toLowerCase())
                    );

                   // Show "Add new user" option if input looks like an email but not found
                 if (params.inputValue.includes('@') && 
                  !options.some(opt => opt.email === params.inputValue)) {
                  return [...filtered, { isNew: true, email: params.inputValue } as UserOption];
                }

                return filtered;
                }}
               renderOption={(props: React.HTMLAttributes<HTMLLIElement>, option: UserOption) => {
               if (option.isNew) {
               return (
                       <Box 
                         component="li" 
                           {...props} 
                         sx={{ p: 2 }}
                         >
                         <Typography color="primary">
                         Add new user: {option.email}
                         </Typography>
                        </Box>
                     );
                }
            return (
                     <Box component="li" {...props}>
                       <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <Typography variant='body1'>{option.name}</Typography>
                            <Typography variant='body2' color={'#494b4b'}>Email: {option.email}</Typography>
                        </Box>
                    </Box>
                );
             }}
                 onChange={(event: React.SyntheticEvent, newValue: string | UserOption | null) => {
                     if (!newValue) return;
    
                     if (typeof newValue === 'string') {
                    // Handle free text entry
                     if (newValue.includes('@')) {
                          setNewUserEmail(newValue);
                          setShowNameInput(true);
                      }
                   } else if (newValue.isNew) {
                       // "Add new user" option selected
                          setNewUserEmail(newValue.email);
                          setShowNameInput(true);
                } else {
                       // Existing user selected
                       handleUserSelect(newValue.email);
                 }
               }}
                renderInput={(params) => (
                <Box>
                    <TextField
                       {...params}
                        placeholder="Enter name or email to search"
                        variant="outlined"
                    />
                 
                {showNameInput && (
                  <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <TextField
                         autoFocus
                         fullWidth
                         label="Name"
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
                    <Button 
                      variant="contained" 
                      onClick={() => {
                       if (newUserName?.trim() && newUserEmail) { 
                            setSelectedUsers([...selectedUsers, {
                               id: -1, // Temporary ID for new users
                               name: newUserName.trim(), 
                               email: newUserEmail.trim()
                            }]);
                              setShowNameInput(false); // Change this to false to hide the input fields
                              setNewUserName('');
                              setNewUserEmail('');
                              setSearchStr(''); // Clear the search string
                            }
                           }}
                         >
                      Add
               </Button>
                   <Button 
                      variant="outlined" 
                      onClick={() => {
                         setShowNameInput(false);
                         setNewUserName('');
                         setNewUserEmail('');
                        }}
                     >
                     Cancel
                    </Button>
                  </Box>
                )}
                 </Box>
                            )}>
                        </Autocomplete>
                        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selectedUsers.map((user) => (
                                <Chip
                                    key={user.id}
                                    label={`${user.name || ''}  (${user.email})`.trim()}
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