import React, { useEffect, useState } from 'react';
import { Autocomplete, Avatar, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { GiftRequestUser } from '../../../../types/gift_card';
import ApiClient from '../../../../api/apiClient/apiClient';
import { TableColumnType } from 'antd';
import GeneralTable from '../../../../components/GenTable';
import { EditOutlined } from '@mui/icons-material';
import { AWSUtils } from '../../../../helpers/aws';
import ImageMapping from './ImageMapping';
import { useAppDispatch, useAppSelector } from '../../../../redux/store/hooks';
import { bindActionCreators } from '@reduxjs/toolkit';
import * as userActionCreators from '../../../../redux/actions/userActions';

interface EditUserDialogProps {
    open: boolean;
    imageUrls: string[]
    onClose: () => void;
    user: GiftRequestUser;
    onSave: (updatedUser: GiftRequestUser, image?: File) => void;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({ open, imageUrls, onClose, user, onSave }) => {
    const dispatch = useAppDispatch();
    const { searchUsers } = bindActionCreators(userActionCreators, dispatch);

    const [formData, setFormData] = useState<GiftRequestUser>(user);
    const [showAssignedFields, setShowAssignedFields] = useState(false);
    const [imageSelectionModal, setImageSelectionModal] = useState(false);
    const [profileImage, setProfileImage] = useState<File | null>(null);

    useEffect(() => {
        setFormData(user);
        setShowAssignedFields(user.assignee !== user.recipient);
    }, [user]);

    useEffect(() => {
        console.log(formData);
    }, [formData])

    const handleUserChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageSelection = (imageUrl: string) => {
        setFormData(prev => ({
            ...prev,
            profile_image_url: imageUrl
        }));
    }

    const usersData = useAppSelector((state) => state.searchUsersData);
    let usersList: any[] = [];
    if (usersData) {
        usersList = Object.values(usersData.users);
    }

    const handleEmailChange = (event: React.SyntheticEvent, value: string, field: 'recipient_email' | 'assignee_email') => {
        let isSet = false;
        usersList.forEach((user) => {
            if (`${user.name} (${user.email})` === value) {
                isSet = true;
                if (field === 'recipient_email') {
                    setFormData(prev => ({
                        ...prev,
                        recipient: user.id,
                        recipient_email: user.email,
                        recipient_name: user.name,
                        recipient_phone: user.phone ?? '',
                    }));
                } else {
                    setFormData(prev => ({
                        ...prev,
                        assignee: user.id,
                        assignee_email: user.email,
                        assignee_name: user.name,
                        assignee_phone: user.phone ?? '',
                    }));
                }
            }
        });

        if (!isSet && user[field] !== value && value !== ` ()`) {
            setFormData(prev => ({
                ...prev,
                [field]: value,
            }));
            if (value.length >= 3) searchUsers(value);
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        if (file) {
            setProfileImage(file);
        }
    };

    const handleSave = () => {
        onSave(formData, profileImage ?? undefined);
        onClose();
    };

    return (
        <Dialog open={open} fullWidth maxWidth="md">
            <DialogTitle>Edit Recipient details</DialogTitle>
            <DialogContent dividers>
                <Grid container rowSpacing={2} columnSpacing={1}>
                    <Grid item xs={12}>
                        <Autocomplete
                            fullWidth

                            options={usersList.map((user) => `${user.name} (${user.email})`)}
                            onInputChange={(e, value) => { handleEmailChange(e, value, 'recipient_email') }}
                            value={formData.recipient_email}
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
                        <TextField name="recipient_name" label="Recipient Name" value={formData.recipient_name} onChange={handleUserChange} fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField name="recipient_phone" label="Recipient Phone (Optional)" value={formData.recipient_phone} onChange={handleUserChange} fullWidth />
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

                            options={usersList.map((user) => `${user.name} (${user.email})`)}
                            onInputChange={(e, value) => { handleEmailChange(e, value, 'assignee_email') }}
                            value={formData.assignee_email}
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

                            name="assignee_name"
                            label="Assignee Name"
                            value={formData.assignee_name}
                            onChange={handleUserChange}
                            fullWidth
                        />
                    </Grid>}
                    {showAssignedFields && <Grid item xs={12}>
                        <TextField

                            name="assignee_phone"
                            label="Assignee Phone (Optional)"
                            value={formData.assignee_phone}
                            onChange={handleUserChange}
                            fullWidth
                        />
                    </Grid>}
                    {showAssignedFields && <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="relation-label">Relation with recipient</InputLabel>
                            <Select

                                labelId="relation-label"
                                value={formData.relation}
                                label="Relation with recipient"
                                onChange={(e) => { setFormData(prev => ({ ...prev, relation: e.target.value })) }}
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
                        {(formData.relation && formData.relation !== 'other') && <Typography>Tree(s) will be assigned in the name of {formData.recipient_name}'s {formData.relation}, {formData.assignee_name}</Typography>}
                        {(formData.relation && formData.relation === 'other') && <Typography>Tree(s) will be assigned in the name of {formData.assignee_name}</Typography>}
                    </Grid>}
                    <Grid item xs={12}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                            <Avatar
                                src={profileImage ? URL.createObjectURL(profileImage) : formData.profile_image_url}
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
                            {imageUrls.length > 0 && <Button variant="outlined" component="label" color='success' sx={{ marginRight: 2, textTransform: 'none' }} onClick={() => { setImageSelectionModal(true) }}>
                                Choose from webscraped URL
                            </Button>}
                            {(formData.profile_image_url || profileImage) && <Button variant="outlined" component="label" color='error' sx={{ textTransform: 'none' }} onClick={() => { setProfileImage(null); setFormData(prev => ({ ...prev, profile_image_url: undefined })) }}>
                                Remove Image
                            </Button>}
                        </div>
                    </Grid>
                </Grid>

                <ImageMapping name={user.assignee_name || user.recipient_name} open={imageSelectionModal} images={imageUrls} onClose={() => { setImageSelectionModal(false) }} onSelect={handleImageSelection} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant='outlined' color='error'>Cancel</Button>
                <Button variant="contained" color="success" onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

interface EditUserDetailsModalProps {
    open: boolean
    onClose: () => void
    giftRequestId?: number
    requestId?: string
    onSave: (users: any[]) => void
}

const EditUserDetailsModal: React.FC<EditUserDetailsModalProps> = ({ open, onClose, giftRequestId, requestId, onSave }) => {
    const [userList, setUserList] = useState<GiftRequestUser[]>([]);
    const [editedRows, setEditedRows] = useState<Record<number, GiftRequestUser>>({});
    const [selectedUser, setSelectedUser] = useState<GiftRequestUser | null>(null);
    const [editModal, setEditModal] = useState(false);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        const getUsers = async () => {
            if (!giftRequestId) return;

            const apiClient = new ApiClient();
            const users = await apiClient.getGiftRequestUsers(giftRequestId);
            setUserList(users
                .filter(item => item.assignee)
                .filter((item, idx, self) => self.findIndex(card => card.assignee === item.assignee) === idx)
                .map(item => ({ ...item, key: item.id })));

            if (!requestId) return;
            const urls = await apiClient.getImagesForRequestId(requestId);
            setImageUrls(urls);
        }

        if (open) getUsers();
    }, [open, giftRequestId, requestId]);

    // Save action to send edited users
    const handleSubmit = () => {
        onSave(Object.values(editedRows));
        onClose();
    };

    const defaultColumns: TableColumnType<GiftRequestUser>[] = [
        {
            title: 'Recipient Name',
            dataIndex: 'recipient_name',
            width: '250',
        },
        {
            title: 'Recipient Email',
            dataIndex: 'recipient_email',
            width: '250',
            render: (value: string) => value?.endsWith("@14trees") ? "Not Provided" : value,
        },
        {
            title: 'Recipient Phone',
            dataIndex: 'recipient_phone',
            width: '200',
            render: value => value ? value : ''
        },
        {
            title: 'Assignee Name',
            dataIndex: 'assignee_name',
            width: '250',
        },
        {
            title: 'Assignee Email',
            dataIndex: 'assignee_email',
            width: '250',
            render: (value: string) => value?.endsWith("@14trees") ? "Not Provided" : value,
        },
        {
            title: 'Assignee Phone',
            dataIndex: 'assignee_phone',
            width: '200',
            render: value => value ? value : ''
        },
        {
            title: 'Image',
            dataIndex: 'profile_image_url',
            render: value => value ? <img src={value} alt="User" style={{ width: 50, height: 50 }} /> : 'Image Not Provided'
        },
        {
            dataIndex: "action",
            key: "action",
            title: "Actions",
            width: 100,
            align: "center",
            render: (value, record, index) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Button
                        variant='outlined'
                        color='success'
                        style={{ margin: "0 5px" }}
                        onClick={() => { setSelectedUser(record); setEditModal(true); }}
                    >
                        <EditOutlined />
                    </Button>
                </div>
            ),
        },
    ];

    const handleEditUserClose = () => {
        setSelectedUser(null);
        setEditModal(false);
    }

    const handleUserEdit = (row: GiftRequestUser, image?: File) => {
        const saveImage = async () => {
            if (image && requestId) {
                const awsUtils = new AWSUtils();
                const location = await awsUtils.uploadFileToS3('gift-request', image, requestId)
                row.profile_image_url = location;
            }

            const newData = [...userList];
            const index = newData.findIndex((item) => row.key === item.key);
            const item = newData[index];
            newData.splice(index, 1, {
                ...item,
                ...row,
            });
            setUserList(newData);

            setEditedRows(prev => ({ ...prev, [row.key]: row }))

            handleEditUserClose();
        }

        saveImage();
    };

    return (
        <Dialog open={open} fullWidth maxWidth="lg">
            <DialogTitle>Recipients List</DialogTitle>
            <DialogContent>
                <GeneralTable
                    loading={false}
                    rows={userList.slice(page * pageSize, (page + 1)*pageSize)}
                    columns={defaultColumns}
                    totalRecords={userList.length}
                    page={page}
                    pageSize={pageSize}
                    onDownload={async () => userList}
                    onPaginationChange={(page: number, pageSize: number) => { setPage(page - 1); setPageSize(pageSize) }}
                />

                {selectedUser && <EditUserDialog
                    open={editModal}
                    imageUrls={imageUrls}
                    onClose={handleEditUserClose}
                    user={selectedUser}
                    onSave={handleUserEdit}
                />}

            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant='outlined' color='error'>Close</Button>
                <Button variant="contained" onClick={handleSubmit} color="success">Save</Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditUserDetailsModal;
