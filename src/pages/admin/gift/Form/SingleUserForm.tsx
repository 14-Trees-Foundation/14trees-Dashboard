import { Autocomplete, Avatar, Button, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { FC, useState, SyntheticEvent, ChangeEvent, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import * as userActionCreators from "../../../../redux/actions/userActions";
import { bindActionCreators } from "@reduxjs/toolkit";
import ImageMapping from "./ImageMapping";

interface User {
    key?: string;
    gifted_to_name: string;
    gifted_to_phone: string;
    gifted_to_email: string;
    assigned_to_name: string;
    assigned_to_phone: string;
    assigned_to_email: string;
    relation: string;
    count: number;
    editable?: boolean,
    profileImage?: File | string;
}

interface SingleUserFormProps {
    maxTrees: number
    imageUrls: string[]
    value: any
    onSubmit: (user: User) => void;
    onCancel: () => void
}

const SingleUserForm: FC<SingleUserFormProps> = ({ maxTrees, imageUrls, value, onSubmit, onCancel }) => {
    const dispatch = useAppDispatch();
    const { searchUsers } = bindActionCreators(userActionCreators, dispatch);

    const [user, setUser] = useState<User>({
        gifted_to_name: '',
        gifted_to_email: '',
        gifted_to_phone: '',
        assigned_to_email: '',
        assigned_to_name: '',
        assigned_to_phone: '',
        relation: '',
        count: 1,
        editable: true,
    });
    const [showAssignedFields, setShowAssignedFields] = useState(false);
    const [imageSelectionModal, setImageSelectionModal] = useState(false);

    useEffect(() => {
        if (value) {
            setUser({
                key: value.key,
                gifted_to_name: value.gifted_to_name,
                gifted_to_email: value.gifted_to_email,
                gifted_to_phone: value.gifted_to_phone || '',
                assigned_to_name: value.assigned_to_name,
                assigned_to_email: value.assigned_to_email,
                assigned_to_phone: value.assigned_to_phone || '',
                relation: value.relation || '',
                count: value.count,
                profileImage: value.image_url,
                editable: value.editable,
            })

            if (value.gifted_to_name !== value.assigned_to_name) setShowAssignedFields(true);
        }

    }, [value]);

    const handleUserChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUser({ ...user, [name]: value });
    };

    const handleNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(1, parseInt(event.target.value, 10));
        setUser({ ...user, count: value });
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setUser(prev => ({
            ...prev,
            profileImage: file ?? undefined
        }));
    };

    const handleImageSelection = (imageUrl: string) => {
        setUser(prev => ({
            ...prev,
            profileImage: imageUrl
        }));
    }

    const usersData = useAppSelector((state) => state.searchUsersData);
    let usersList: any[] = [];
    if (usersData) {
        usersList = Object.values(usersData.users);
    }

    const handleEmailChange = (event: SyntheticEvent, value: string, field: 'gifted_to_email' | 'assigned_to_email') => {
        let isSet = false;
        usersList.forEach((user) => {
            if (`${user.name} (${user.email})` === value) {
                isSet = true;
                if (field === 'gifted_to_email') {
                    setUser(prev => ({
                        ...prev,
                        gifted_to_email: user.email,
                        gifted_to_name: user.name,
                        gifted_to_phone: user.phone ?? '',
                    }));
                } else {
                    setUser(prev => ({
                        ...prev,
                        assigned_to_email: user.email,
                        assigned_to_name: user.name,
                        assigned_to_phone: user.phone ?? '',
                    }));
                }
            }
        });

        if (!isSet && user[field] !== value && value !== ` ()`) {
            setUser({
                ...user,
                [field]: value,
            });
            if (value.length >= 3) searchUsers(value);
        }
    };

    const handleSubmit = () => {
        const data = { ...user };

        if (!showAssignedFields || !data.assigned_to_name) {
            data.assigned_to_email = data.gifted_to_email
            data.assigned_to_phone = data.gifted_to_phone
            data.assigned_to_name = data.gifted_to_name
        }

        onSubmit(data);
        handleCancel();
    };

    const handleCancel = () => {
        setUser({
            gifted_to_name: '',
            gifted_to_email: '',
            gifted_to_phone: '',
            assigned_to_email: '',
            assigned_to_name: '',
            assigned_to_phone: '',
            relation: '',
            count: 1,
            editable: true,
        });
        onCancel();
    };

    return (
        <div>
            <Grid container rowSpacing={2} columnSpacing={1}>
                <Grid item xs={12}>
                    <Autocomplete
                        fullWidth
                        disabled={!user.editable}
                        options={usersList.map((user) => `${user.name} (${user.email})`)}
                        onInputChange={(e, value) => { handleEmailChange(e, value, 'gifted_to_email') }}
                        value={user.gifted_to_email}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Recipient Email id"
                                variant="outlined"
                                name="gifted_to_email"
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField disabled={!user.editable} name="gifted_to_name" label="Recipient Name" value={user.gifted_to_name} onChange={handleUserChange} fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <TextField disabled={!user.editable} name="gifted_to_phone" label="Recipient Phone (Optional)" value={user.gifted_to_phone} onChange={handleUserChange} fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        type="number"
                        label="Number of trees to assign"
                        name="count"
                        value={user.count}
                        onChange={handleNumberChange}
                        inputProps={{ min: user.editable ? 1 : value?.count || 1, max: Math.max(value?.count ? value.count : 0, maxTrees) }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControl component="fieldset">
                        <FormControlLabel
                            control={
                                <Checkbox checked={showAssignedFields} onChange={(e) => { setShowAssignedFields(e.target.checked) }} name="show_all" />
                            }
                            label="Do you want to assign/name the tree(s) to someone else (related to recipient)?"
                        />
                    </FormControl>
                </Grid>
                {showAssignedFields && <Grid item xs={12}>
                    <Autocomplete
                        fullWidth
                        disabled={!user.editable}
                        options={usersList.map((user) => `${user.name} (${user.email})`)}
                        onInputChange={(e, value) => { handleEmailChange(e, value, 'assigned_to_email') }}
                        value={user.assigned_to_email}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Assignee Email"
                                variant="outlined"
                                name="assigned_to_email"
                            />
                        )}
                    />
                </Grid>}
                {showAssignedFields && <Grid item xs={12}>
                    <TextField
                        disabled={!user.editable}
                        name="assigned_to_name"
                        label="Assignee Name"
                        value={user.assigned_to_name}
                        onChange={handleUserChange}
                        fullWidth
                    />
                </Grid>}
                {showAssignedFields && <Grid item xs={12}>
                    <TextField
                        disabled={!user.editable}
                        name="assigned_to_phone"
                        label="Assignee Phone (Optional)"
                        value={user.assigned_to_phone}
                        onChange={handleUserChange}
                        fullWidth
                    />
                </Grid>}
                {showAssignedFields && <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="relation-label">Relation with recipient</InputLabel>
                        <Select
                            disabled={!user.editable}
                            labelId="relation-label"
                            value={user.relation}
                            label="Relation with recipient"
                            onChange={(e) => { setUser(prev => ({ ...prev, relation: e.target.value })) }}
                        >
                            <MenuItem value={"father"}>Father</MenuItem>
                            <MenuItem value={'mother'}>Mother</MenuItem>
                            <MenuItem value={'uncle'}>Uncle</MenuItem>
                            <MenuItem value={'aunt'}>Aunt</MenuItem>
                            <MenuItem value={'grandfather'}>Grandfather</MenuItem>
                            <MenuItem value={'grandmother'}>Grandmother</MenuItem>
                            <MenuItem value={'son'}>Son</MenuItem>
                            <MenuItem value={'daughter'}>Daughter</MenuItem>
                            <MenuItem value={'wife'}>Wife</MenuItem>
                            <MenuItem value={'husband'}>Husband</MenuItem>
                            <MenuItem value={'grandson'}>Grandson</MenuItem>
                            <MenuItem value={'granddaughter'}>Granddaughter</MenuItem>
                            <MenuItem value={'brother'}>Brother</MenuItem>
                            <MenuItem value={'sister'}>Sister</MenuItem>
                            <MenuItem value={'cousin'}>Cousin</MenuItem>
                            <MenuItem value={'friend'}>Friend</MenuItem>
                            <MenuItem value={'colleague'}>Colleague</MenuItem>
                            <MenuItem value={'other'}>Other</MenuItem>
                        </Select>
                    </FormControl>
                    {(user.relation && user.relation !== 'other') && <Typography>Tree(s) will be assigned in the name of {user.gifted_to_name}'s {user.relation}, {user.assigned_to_name}</Typography>}
                    {(user.relation && user.relation === 'other') && <Typography>Tree(s) will be assigned in the name of {user.assigned_to_name}</Typography>}
                </Grid>}
                <Grid item xs={12}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                        <Avatar
                            src={(user.profileImage && typeof user.profileImage !== 'string') ? URL.createObjectURL(user.profileImage) : user.profileImage}
                            alt="User"
                            sx={{ width: 80, height: 80, marginRight: 2 }}
                        />
                        <Button variant="outlined" component="label" color='success' sx={{ marginRight: 2, textTransform: 'none' }}>
                            Upload {showAssignedFields ? "Assignee" : "Recipient"} Image
                            <input
                                value={''}
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Button>
                        <Typography sx={{ mr: 2 }}>OR</Typography>
                        <Button variant="outlined" component="label" color='success' sx={{ marginRight: 2, textTransform: 'none' }} onClick={() => { setImageSelectionModal(true) }}>
                            Choose from webscraped URL
                        </Button>
                        {user.profileImage && <Button variant="outlined" component="label" color='error' sx={{ textTransform: 'none' }} onClick={() => { setUser(prev => ({ ...prev, profileImage: undefined })) }}>
                            Remove Image
                        </Button>}
                    </div>
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleCancel}
                        style={{ marginRight: '10px' }}
                    >
                        Reset
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleSubmit}
                        disabled={!value && maxTrees === 0}
                    >
                        Add
                    </Button>
                </Grid>
            </Grid>

            <ImageMapping name={user.assigned_to_name || user.gifted_to_name} open={imageSelectionModal} images={imageUrls} onClose={() => { setImageSelectionModal(false) }} onSelect={handleImageSelection} />
        </div>
    );
};

export default SingleUserForm;