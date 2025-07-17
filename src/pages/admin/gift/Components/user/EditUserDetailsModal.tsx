import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import { GiftRequestUser } from '../../../../../types/gift_card';
import ApiClient from '../../../../../api/apiClient/apiClient';
import GeneralTable from '../../../../../components/GenTable';
import { AWSUtils } from '../../../../../helpers/aws';
import ImageMapping from '../ImageMapping';
import { useAppDispatch, useAppSelector } from '../../../../../redux/store/hooks';
import { bindActionCreators } from '@reduxjs/toolkit';
import * as userActionCreators from '../../../../../redux/actions/userActions';
import UserFormFields from './components/UserFormFields';
import RelationshipSelector from './components/RelationshipSelector';
import ImageUploadSection from './components/ImageUploadSection';
import { createUserTableColumns } from './components/UserTableColumns';
import { Checkbox, FormControl, FormControlLabel } from '@mui/material';

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

    const handleRecipientEmailChange = (event: React.SyntheticEvent, value: string) => {
        handleEmailChange(event, value, 'recipient_email');
    };

    const handleAssigneeEmailChange = (event: React.SyntheticEvent, value: string) => {
        handleEmailChange(event, value, 'assignee_email');
    };

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

    const handleRemoveImage = () => {
        setProfileImage(null);
        setFormData(prev => ({ ...prev, profile_image_url: undefined }));
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
                    <UserFormFields
                        userEmail={formData.recipient_email}
                        userName={formData.recipient_name}
                        userPhone={formData.recipient_phone}
                        userCommEmail={formData.recipient_communication_email || ''}
                        usersList={usersList}
                        fieldPrefix="recipient"
                        onEmailChange={handleRecipientEmailChange}
                        onInputChange={handleUserChange}
                    />
                    
                    <Grid item xs={12}>
                        <FormControl component="fieldset">
                            <FormControlLabel
                                control={
                                    <Checkbox 
                                        checked={showAssignedFields} 
                                        onChange={(e) => setShowAssignedFields(e.target.checked)} 
                                        name="show_all" 
                                    />
                                }
                                label="Do you want to assign/name the tree(s) to someone else (related to recipient)?"
                            />
                        </FormControl>
                    </Grid>
                    
                    {showAssignedFields && (
                        <UserFormFields
                            userEmail={formData.assignee_email}
                            userName={formData.assignee_name}
                            userPhone={formData.assignee_phone}
                            userCommEmail={formData.assignee_communication_email || ''}
                            usersList={usersList}
                            fieldPrefix="assignee"
                            onEmailChange={handleAssigneeEmailChange}
                            onInputChange={handleUserChange}
                        />
                    )}
                    
                    {showAssignedFields && (
                        <RelationshipSelector
                            relation={formData.relation || ''}
                            recipientName={formData.recipient_name}
                            assigneeName={formData.assignee_name}
                            onRelationChange={(relation) => setFormData(prev => ({ ...prev, relation }))}
                        />
                    )}
                    
                    <ImageUploadSection
                        currentImageUrl={formData.profile_image_url}
                        uploadedImage={profileImage}
                        imageUrls={imageUrls}
                        showAssignedFields={showAssignedFields}
                        onImageChange={handleImageChange}
                        onImageSelectionModalOpen={() => setImageSelectionModal(true)}
                        onRemoveImage={handleRemoveImage}
                    />
                </Grid>

                <ImageMapping 
                    name={user.assignee_name || user.recipient_name} 
                    open={imageSelectionModal} 
                    images={imageUrls} 
                    onClose={() => setImageSelectionModal(false)} 
                    onSelect={handleImageSelection} 
                />
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

const EditUserDetailsModal: React.FC<EditUserDetailsModalProps> = ({ 
    open, 
    onClose, 
    giftRequestId, 
    requestId, 
    onSave 
}) => {
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

    const handleSubmit = () => {
        onSave(Object.values(editedRows));
        onClose();
    };

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

    const columns = createUserTableColumns({
        onEditUser: (record) => {
            setSelectedUser(record);
            setEditModal(true);
        }
    });

    return (
        <Dialog open={open} fullWidth maxWidth="lg">
            <DialogTitle>Recipients List</DialogTitle>
            <DialogContent>
                <GeneralTable
                    loading={false}
                    rows={userList.slice(page * pageSize, (page + 1) * pageSize)}
                    columns={columns}
                    totalRecords={userList.length}
                    page={page}
                    pageSize={pageSize}
                    onDownload={async () => userList}
                    onPaginationChange={(page: number, pageSize: number) => { 
                        setPage(page - 1); 
                        setPageSize(pageSize) 
                    }}
                />

                {selectedUser && (
                    <EditUserDialog
                        open={editModal}
                        imageUrls={imageUrls}
                        onClose={handleEditUserClose}
                        user={selectedUser}
                        onSave={handleUserEdit}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant='outlined' color='error'>Close</Button>
                <Button variant="contained" onClick={handleSubmit} color="success">Save</Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditUserDetailsModal;