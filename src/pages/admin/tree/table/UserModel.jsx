import { useState } from 'react';
import { Box, Button, Grid, Modal, TextField, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../redux/store/hooks';
import * as userActionCreators from '../../../../redux/actions/userActions';
import { bindActionCreators } from '@reduxjs/toolkit';

const UserModal = ({ open, handleClose, onSubmit }) => {

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        borderRadius:'10px',
        p: 4,
    };

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
    });
    const [email, setEmail] = useState('');

    const dispatch = useAppDispatch();
    const { searchUsers }
        = bindActionCreators(userActionCreators, dispatch);

    const usersData = useAppSelector((state) => state.searchUsersData);
    if (usersData) {
        const users = Object.values(usersData.users);
        if (users.length !== 0) {
            formData.name = users[0].name;
            formData.phone = users[0].phone;
            formData.email = users[0].email;
        }
    }

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formData);
        onSubmit(formData);
    };

    const searchUserByMail= (event) => {
        event.preventDefault();
        setTimeout(async () => {
            await searchUsers(email);
        }, 1000);
    }

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <form onSubmit={searchUserByMail}>
                        <Grid container rowSpacing={2} columnSpacing={1} >
                            <Grid item xs={12}>
                                <TextField name="email" label="Email" value={email} onChange={(event) => setEmail(event.target.value) } fullWidth/>
                            </Grid>
                            <Grid item xs={12} sx={{display:'flex', justifyContent:'center', }}>
                                <Button type="submit">Search</Button>
                            </Grid>
                        </Grid>
                    </form>
                    <form onSubmit={handleSubmit}>
                        <Grid container rowSpacing={2} columnSpacing={1} >
                            <Grid item xs={12}>
                                <TextField name="name" label="Name" value={formData.name} onChange={handleChange} fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="phone" label="Phone" value={formData.phone} onChange={handleChange} fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="email" label="Email" value={formData.email} onChange={handleChange} fullWidth/>
                            </Grid>
                            <Grid item xs={12} sx={{display:'flex', justifyContent:'center', }}>
                                <Button type="submit">Submit</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>
        </div>
    )
}

export default UserModal