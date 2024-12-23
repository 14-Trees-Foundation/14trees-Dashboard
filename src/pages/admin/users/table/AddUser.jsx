import { useState } from 'react';
import { Autocomplete, Box, Button, Grid, Modal, TextField } from '@mui/material';
import { useAppSelector } from '../../../../redux/store/hooks';


const AddUser = ({ open, handleClose, createUser, searchUser }) => {

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        borderRadius: '10px',
        p: 4,
    };

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        communication_email: '',
        birth_date: '',
    });

    let usersList = [];
    const usersData = useAppSelector((state) => state.searchUsersData);
    if (usersData) {
        usersList = Object.values(usersData.users);
    }

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleEmailChange = (event, value) => {
        let isSet = false;
        usersList.forEach((user) => {
            if (`${user.name} (${user.email})` === value) {
                isSet = true;
                setFormData({
                    'email': user.email,
                    'name': user.name,
                    'phone': user.phone ?? '',
                    'birth_date': user.birth_date ?? '',
                })
            }
        })

        if (!isSet) {
            setFormData({
                ...formData,
                'email': value,
            })
            if (value.length >= 3) searchUser(value);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        createUser({ ...formData, email: formData.email.trim() === '' ? formData.name.toLocaleLowerCase().replaceAll(" ", '.') + "@14trees" : formData.email });
        setFormData({
            name: '',
            phone: '',
            email: '',
            communication_email: '',
            birth_date: '',
        });
        handleClose();
    };

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>

                    <form onSubmit={handleSubmit}>
                        <Grid container rowSpacing={2} columnSpacing={1} >
                            <Grid item xs={12}>
                                <TextField name="name" label="Name" value={formData.name} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="phone" label="Phone" value={formData.phone} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    fullWidth
                                    options={usersList}
                                    name='email'
                                    noOptionsText="No Users"
                                    value={formData.email}
                                    onInputChange={handleEmailChange}
                                    getOptionLabel={(option) => option.email ? `${option.name} (${option.email})` : option}
                                    isOptionEqualToValue={(option, value) => true}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Email"
                                            variant="outlined"
                                        />
                                    )}>
                                </Autocomplete>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="communication_email"
                                    label="Communication email"
                                    value={formData.communication_email}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="birth_date" label="Date of Birth" type="date" value={formData.birth_date ? formData.birth_date.substring(0, 10) : ''} onChange={handleChange} InputLabelProps={{ shrink: true }} fullWidth />
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', }}>
                                <Button variant='outlined' color='error' onClick={handleClose}>Cancel</Button>
                                <Button variant='contained' color='success' type="submit" sx={{ marginLeft: '10px' }}>Submit</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>
        </div>
    )
}

export default AddUser