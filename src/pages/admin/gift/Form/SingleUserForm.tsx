import { Autocomplete, Avatar, Button, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { FC, useState, SyntheticEvent, ChangeEvent, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import * as userActionCreators from "../../../../redux/actions/userActions";
import { bindActionCreators } from "@reduxjs/toolkit";
import ImageMapping from "./ImageMapping";

interface User {
    key?: string;
    recipient_name: string;
    recipient_phone: string;
    recipient_email: string;
    recipient_communication_email: string;
    assignee_name: string;
    assignee_phone: string;
    assignee_email: string;
    assignee_communication_email: string;
    relation: string;
    gifted_trees: number;
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
        recipient_name: '',
        recipient_email: '',
        recipient_communication_email: '',
        recipient_phone: '',
        assignee_email: '',
        assignee_communication_email: '',
        assignee_name: '',
        assignee_phone: '',
        relation: '',
        gifted_trees: 1,
        editable: true,
    });
    const [showAssignedFields, setShowAssignedFields] = useState(false);
    const [imageSelectionModal, setImageSelectionModal] = useState(false);

    useEffect(() => {
        if (value) {
            setUser({
                key: value.key,
                recipient_name: value.recipient_name,
                recipient_email: value.recipient_email,
                recipient_communication_email: value.recipient_communication_email,
                recipient_phone: value.recipient_phone || '',
                assignee_name: value.assignee_name,
                assignee_email: value.assignee_email,
                assignee_communication_email: value.assignee_communication_email,
                assignee_phone: value.assignee_phone || '',
                relation: value.relation || '',
                gifted_trees: value.gifted_trees,
                profileImage: value.image_url,
                editable: value.editable,
            })

            if (value.recipient_name !== value.assignee_name) setShowAssignedFields(true);
        }

    }, [value]);

    const handleUserChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUser({ ...user, [name]: value });
    };

    const handleNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(1, parseInt(event.target.value, 10));
        setUser({ ...user, gifted_trees: value });
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

    const handleEmailChange = (event: SyntheticEvent, value: string, field: 'recipient_email' | 'assignee_email') => {
        let isSet = false;
        usersList.forEach((user) => {
            if (`${user.name} (${user.email})` === value) {
                isSet = true;
                if (field === 'recipient_email') {
                    setUser(prev => ({
                        ...prev,
                        recipient_email: user.email,
                        recipient_name: user.name,
                        recipient_phone: user.phone ?? '',
                        recipient_communication_email: user.communication_email ?? '',
                    }));
                } else {
                    setUser(prev => ({
                        ...prev,
                        assignee_email: user.email,
                        assignee_name: user.name,
                        assignee_phone: user.phone ?? '',
                        assignee_communication_email: user.communication_email ?? '',
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
        if (!user.recipient_name.trim()) return;
        if (showAssignedFields && !user.assignee_name.trim()) return;
        
        const data = { ...user };
        if (data.recipient_email.trim() === '') {
            data.recipient_email = data.recipient_name.toLocaleLowerCase().split(" ").join('.') + "@14trees"
        }

        if (!showAssignedFields || !data.assignee_name) {
            data.assignee_email = data.recipient_email
            data.assignee_phone = data.recipient_phone
            data.assignee_name = data.recipient_name
            data.assignee_communication_email = data.recipient_communication_email
        }

        onSubmit(data);
        handleCancel();
    };

    const handleCancel = () => {
        setUser({
            recipient_name: '',
            recipient_email: '',
            recipient_communication_email: '',
            recipient_phone: '',
            assignee_email: '',
            assignee_communication_email: '',
            assignee_name: '',
            assignee_phone: '',
            relation: '',
            gifted_trees: 1,
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
                        onInputChange={(e, value) => { handleEmailChange(e, value, 'recipient_email') }}
                        value={user.recipient_email}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Recipient Email id"
                                variant="outlined"
                                name="recipient_email"
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField disabled={!user.editable} name="recipient_name" label="Recipient Name" value={user.recipient_name} onChange={handleUserChange} fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <TextField disabled={!user.editable} name="recipient_phone" label="Recipient Phone (Optional)" value={user.recipient_phone} onChange={handleUserChange} fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <TextField disabled={!user.editable} name="recipient_communication_email" label="Recipient's Communication Email (Optional)" value={user.recipient_communication_email} onChange={handleUserChange} fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        type="number"
                        label="Number of trees to assign"
                        name="gifted_trees"
                        value={user.gifted_trees}
                        onChange={handleNumberChange}
                        inputProps={{ min: user.editable ? 1 : value?.gifted_trees || 1, max: Math.max(value?.gifted_trees ? value.gifted_trees : 0, maxTrees) }}
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
                        onInputChange={(e, value) => { handleEmailChange(e, value, 'assignee_email') }}
                        value={user.assignee_email}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Assignee Email"
                                variant="outlined"
                                name="assignee_email"
                            />
                        )}
                    />
                </Grid>}
                {showAssignedFields && <Grid item xs={12}>
                    <TextField
                        disabled={!user.editable}
                        name="assignee_communication_email"
                        label="Assignee's Communication Email (Optional)"
                        value={user.assignee_communication_email}
                        onChange={handleUserChange}
                        fullWidth
                    />
                </Grid>}
                {showAssignedFields && <Grid item xs={12}>
                    <TextField
                        disabled={!user.editable}
                        name="assignee_name"
                        label="Assignee Name"
                        value={user.assignee_name}
                        onChange={handleUserChange}
                        fullWidth
                    />
                </Grid>}
                {showAssignedFields && <Grid item xs={12}>
                    <TextField
                        disabled={!user.editable}
                        name="assignee_phone"
                        label="Assignee Phone (Optional)"
                        value={user.assignee_phone}
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
                    {(user.relation && user.relation !== 'other') && <Typography>Tree(s) will be assigned in the name of {user.recipient_name}'s {user.relation}, {user.assignee_name}</Typography>}
                    {(user.relation && user.relation === 'other') && <Typography>Tree(s) will be assigned in the name of {user.assignee_name}</Typography>}
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

            <ImageMapping name={user.assignee_name || user.recipient_name} open={imageSelectionModal} images={imageUrls} onClose={() => { setImageSelectionModal(false) }} onSelect={handleImageSelection} />
        </div>
    );
};

export default SingleUserForm;