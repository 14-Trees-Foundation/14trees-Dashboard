import { useState } from "react";
import { Autocomplete, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { bindActionCreators } from "@reduxjs/toolkit";

import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import * as userActionCreators from "../../../../redux/actions/userActions";
import * as groupActionCreators from "../../../../redux/actions/groupActions";
import { User } from "../../../../types/user";
import { Group } from "../../../../types/Group";
import { organizationTypes } from "../../organization/organizationType";

interface UserData {
    user_id: number,
    user_name: string,
    user_email: string,
    user_phone: string
}

interface UserInputComponentProps {
    formData: UserData
    onChange: (userData: UserData) => void
}

const UserInputComponent: React.FC<UserInputComponentProps> = ({ formData, onChange }) => {
    const dispatch = useAppDispatch();
    const { searchUsers } =
        bindActionCreators(userActionCreators, dispatch);

    let usersList: User[] = [];
    const usersData = useAppSelector((state) => state.searchUsersData);
    if (usersData) {
        usersList = Object.values(usersData.users);
    }

    const handleChange = (event: any) => {
        onChange({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleEmailChange = (event: any, value: string) => {
        let isSet = false;
        usersList.forEach((user) => {
            if (`${user.name} (${user.email})` === value) {
                isSet = true;
                onChange({
                    'user_id': user.id,
                    'user_email': user.email,
                    'user_name': user.name,
                    'user_phone': user.phone ?? '',
                })
            }
        })

        if (!isSet) {
            onChange({
                ...formData,
                'user_email': value,
            })
            if (value.length >= 3) searchUsers(value);
        }
    }

    return (
        <Grid container rowSpacing={2} columnSpacing={1}>
            <Grid item xs={12}>
                <Autocomplete
                    fullWidth
                    value={formData.user_email}
                    options={usersList.map((user) => `${user.name} (${user.email})`)}
                    noOptionsText="No Users"
                    onInputChange={handleEmailChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Enter email to search"
                            name='user_email'
                            variant="outlined"
                        />
                    )}>
                </Autocomplete>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    required
                    value={formData.user_name}
                    onChange={handleChange}
                    label="Full Name"
                    name="user_name"
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    value={formData.user_phone}
                    onChange={handleChange}
                    variant="outlined"
                    label="Contact"
                    name="user_phone"
                />
            </Grid>
        </Grid>
    );
}

interface GroupData {
    group_id: number,
    group_name: string,
    group_type: string,
    group_description: string
}

interface GroupInputComponentProps {
    formData: GroupData
    onChange: (groupData: GroupData) => void
}

const GroupInputComponent: React.FC<GroupInputComponentProps> = ({ formData, onChange }) => {
    const dispatch = useAppDispatch();
    const { searchGroups } =
        bindActionCreators(groupActionCreators, dispatch);

    let groupsList: Group[] = [];
    const groupsData = useAppSelector((state) => state.searchGroupsData);
    if (groupsData) {
        groupsList = Object.values(groupsData.groups);
    }

    const handleChange = (event: any) => {
        onChange({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleNameChange = (event: any, value: string) => {
        let isSet = false;
        groupsList.forEach((group) => {
            if (group.name === value) {
                isSet = true;
                onChange({
                    'group_id': group.id,
                    'group_type': group.type,
                    'group_name': group.name,
                    'group_description': group.description ?? '',
                })
            }
        })

        if (!isSet) {
            onChange({
                ...formData,
                'group_name': value,
            })
            if (value.length >= 3) searchGroups(0, 10, value);
        }
    }

    return (
        <Grid container rowSpacing={2} columnSpacing={1}>
            <Grid item xs={12}>
                <Autocomplete
                    fullWidth
                    value={formData.group_name}
                    options={groupsList.map(group => group.name)}
                    noOptionsText="No Groups"
                    onInputChange={handleNameChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Enter group name to search"
                            name='group_name'
                            variant="outlined"
                        />
                    )}>
                </Autocomplete>
            </Grid>
            <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel id="group-type-label">Group Type</InputLabel>
                    <Select
                        labelId="group-type-label"
                        fullWidth
                        required
                        onChange={handleChange}
                        name="group_type"
                        defaultValue="corporate"
                        label="Group Type"
                        value={formData.group_type}
                    >
                        {organizationTypes.map((option) => {
                            return (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.label}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    value={formData.group_description}
                    onChange={handleChange}
                    variant="outlined"
                    label="Description"
                    name="group_description"
                />
            </Grid>
        </Grid>
    );
}

interface MapTreesModalProps {
    open: boolean
    onClose: () => void
    onSubmit: (data: any) => void
}

const MapTreesModal: React.FC<MapTreesModalProps> = ({ open, onClose, onSubmit }) => {

    const [sameSponsor, setSameSponsor] = useState(false);
    const [reserveFor, setReserveFor] = useState<"user" | "group">("user");
    const [reserveForUser, setReserveForUser] = useState<UserData>({ user_id: 0, user_name: '', user_email: '', user_phone: '' })
    const [sponsorUser, setSponsorUser] = useState<UserData>({ user_id: 0, user_name: '', user_email: '', user_phone: '' })
    const [reserveForGroup, setReserveForGroup] = useState<GroupData>({ group_id: 0, group_name: '', group_description: '', group_type: 'corporate' })
    const [sponsorGroup, setSponsorGroup] = useState<GroupData>({ group_id: 0, group_name: '', group_description: '', group_type: 'corporate' })

    const handleSubmit = () => {
        let data: any = {
            mapped_to: reserveFor,
            id: reserveFor === 'user' ? reserveForUser.user_id : reserveForGroup.group_id,
            name: reserveFor === 'user' ? reserveForUser.user_name : reserveForGroup.group_name,
            email: reserveForUser.user_email,
            phone: reserveForUser.user_phone,
            type: reserveForGroup.group_type,
            description: reserveForGroup.group_description,
            same_sponsor: sameSponsor,
        };

        if (!sameSponsor && ((reserveFor === 'user' && sponsorUser.user_name && sponsorUser.user_email) || (reserveFor === 'group' && sponsorGroup.group_name && sponsorGroup.group_type))) {
            data = {
                ...data,
                sponsor_id: reserveFor === 'user' ? sponsorUser.user_id : sponsorGroup.group_id,
                sponsor_name: reserveFor === 'user' ? sponsorUser.user_name : sponsorGroup.group_name,
                sponsor_email: sponsorUser.user_email,
                sponsor_phone: sponsorUser.user_phone,
                sponsor_type: sponsorGroup.group_type,
                sponsor_description: sponsorGroup.group_description,
            }
        } else if (sameSponsor) {
            data = {
                ...data,
                sponsor_id: reserveFor === 'user' ? reserveForUser.user_id : reserveForGroup.group_id,
                sponsor_name: reserveFor === 'user' ? reserveForUser.user_name : reserveForGroup.group_name,
                sponsor_email: reserveForUser.user_email,
                sponsor_phone: reserveForUser.user_phone,
                sponsor_type: reserveForGroup.group_type,
                sponsor_description: reserveForGroup.group_description,
            }
        }

        onSubmit(data);
    }

    return (
        <Dialog open={open} fullWidth maxWidth='md'>
            <DialogTitle>Reserve Trees</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ pl:10, pr: 10, pt:1, pb: 2 }}>
                    <Box
                        display="flex"
                        alignItems="center"
                    >
                        <Typography mr={10}>Reserve trees for:</Typography>
                        <ToggleButtonGroup
                            color="success"
                            value={reserveFor}
                            exclusive
                            onChange={(e, value) => { setReserveFor(value); }}
                            aria-label="Platform"
                            size="small"
                        >
                            <ToggleButton value="user">User</ToggleButton>
                            <ToggleButton value="group">Group</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                    <Box mt={2} mb={2}>
                        {reserveFor === 'user' ? (
                            <UserInputComponent formData={reserveForUser} onChange={data => { setReserveForUser(data) }} />
                        ) : (
                            <GroupInputComponent formData={reserveForGroup} onChange={data => { setReserveForGroup(data) }} />
                        )}
                    </Box>
                    <FormControlLabel
                        control={<Checkbox checked={sameSponsor} onChange={() => setSameSponsor(!sameSponsor)} />}
                        label="Sponsor is same as reserved by"
                    />
                    {!sameSponsor && <Box mt={2}>
                        {reserveFor === 'user' ? (
                            <UserInputComponent formData={sponsorUser} onChange={data => { setSponsorUser(data) }} />
                        ) : (
                            <GroupInputComponent formData={sponsorGroup} onChange={data => { setSponsorGroup(data) }} />
                        )}
                    </Box>}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined" color="error">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="success" variant="contained">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default MapTreesModal;