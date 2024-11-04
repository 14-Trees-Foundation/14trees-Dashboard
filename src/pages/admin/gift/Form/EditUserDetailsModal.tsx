import React, { useContext, useRef, useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Avatar, TextField } from '@mui/material';

import { GiftCardUser } from '../../../../types/gift_card';
import ApiClient from '../../../../api/apiClient/apiClient';
import { TableColumnType } from 'antd';
import GeneralTable from '../../../../components/GenTable';
import { EditOutlined } from '@mui/icons-material';
import { AWSUtils } from '../../../../helpers/aws';

interface EditUserDialogProps {
    open: boolean;
    onClose: () => void;
    user: GiftCardUser;
    onSave: (updatedUser: GiftCardUser, image?: File) => void;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({ open, onClose, user, onSave }) => {
    const [name, setName] = useState(user.user_name || '');
    const [phone, setPhone] = useState(user.user_phone || '');
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        if (file) {
            setImageFile(file);
        }
    };

    const handleSave = () => {
        onSave({ ...user, user_name: name, user_phone: phone}, imageFile ?? undefined);
        onClose();
    };

    return (
        <Dialog open={open} fullWidth maxWidth="sm">
            <DialogTitle>Edit User</DialogTitle>
            <DialogContent>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                    <Avatar
                        src={imageFile ? URL.createObjectURL(imageFile) : user.profile_image_url}
                        alt="User"
                        sx={{ width: 80, height: 80, marginRight: 2 }}
                    />
                    <Button variant="outlined" component="label" color='success'>
                        Upload Image
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </Button>
                </div>
                <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Email"
                    value={user.user_email}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    fullWidth
                    margin="normal"
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

const EditUserDetailsModal: React.FC<EditUserDetailsModalProps> = ({ open, onClose, giftRequestId, requestId, onSave }) => {
    const [userList, setUserList] = useState<GiftCardUser[]>([]);
    const [editedRows, setEditedRows] = useState<Record<number, GiftCardUser>>({});
    const [selectedUser, setSelectedUser] = useState<GiftCardUser | null>(null);
    const [editModal, setEditModal] = useState(false);

    useEffect(() => {
        const getUsers = async () => {
            if (!giftRequestId) return;

            const apiClient = new ApiClient();
            const users = await apiClient.getBookedGiftCards(giftRequestId, 0, -1);
            setUserList(users.results
                .filter(item => item.user_id)
                .filter((item, idx, self) => self.findIndex(card => card.user_id === item.user_id) === idx)
                .map(item => ({ ...item, key: item.id  })));
        }

        getUsers();
    }, [giftRequestId]);

    // Save action to send edited users
    const handleSubmit = () => {
        onSave(Object.values(editedRows));
        onClose();
    };

    const defaultColumns: TableColumnType<GiftCardUser>[] = [
        {
            title: 'User Name',
            dataIndex: 'user_name',
            width: '30%',
        },
        {
            title: 'Phone',
            dataIndex: 'user_phone',
            width: '20%',
            render: value => value ? value : ''
        },
        {
            title: 'Email',
            dataIndex: 'user_email',
            width: '30%',
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

    const handleUserEdit = (row: GiftCardUser, image?: File) => {
        const saveImage = async () => {
            if (image && requestId) {
                const awsUtils = new AWSUtils();
                const location = await awsUtils.uploadFileToS3(requestId, image, (num: number) => {  })
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
            <DialogTitle>User List</DialogTitle>
            <DialogContent>
                <GeneralTable
                    loading={false}
                    rows={userList}
                    columns={defaultColumns}
                    totalRecords={userList.length}
                    page={0}
                    pageSize={10}
                    onDownload={async () => userList}
                    onPaginationChange={(page: number, pageSize: number) => {  }}
                />

                {selectedUser && <EditUserDialog 
                    open={editModal}
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
