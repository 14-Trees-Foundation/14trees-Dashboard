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
        borderRadius:'10px',
        p: 4,
    };

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        dob: '',
    });

    let usersList = [];
    const usersData = useAppSelector((state) => state.searchUsersData);
    if (usersData) {
        usersList = Object.values(usersData);
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
            if(`${user.name} (${user.email})` === value) {
                isSet = true;
                setFormData({
                    'email': user.email,
                    'name': user.name,
                    'phone': user.phone ?? '',
                    'dob': user.dob ?? '',
                })
            }
        })

        if (!isSet) {
            setFormData({
                ...formData,
                'email': value,
            })
            if(value.length >= 3)  searchUser(value);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        createUser(formData);
        setFormData({
            name: '',
            phone: '',
            email: '',
            dob: '',
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
                                <TextField name="name" label="Name" value={formData.name} onChange={handleChange} fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="phone" label="Phone" value={formData.phone} onChange={handleChange} fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete 
                                    fullWidth 
                                    options={usersList} 
                                    name='email' 
                                    noOptionsText="No Users" 
                                    value={formData.email} 
                                    onInputChange={handleEmailChange} 
                                    getOptionLabel={(option)=> option.email ? `${option.name} (${option.email})`: option}
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
                                <TextField name="dob" label="Date of Birth" type="date" value={formData.dob} onChange={handleChange} InputLabelProps={{ shrink: true }} fullWidth/>
                            </Grid>
                            <Grid item xs={12} sx={{display:'flex', justifyContent:'center', }}>
                                <Button type="submit">Submit</Button>
                                <Button onClick={handleClose}>Cancel</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>
        </div>
    )
}

export default AddUser