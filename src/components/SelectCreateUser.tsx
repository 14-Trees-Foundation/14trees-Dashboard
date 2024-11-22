import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { AutocompleteWithPagination } from "./AutoComplete";
import { bindActionCreators } from "@reduxjs/toolkit";
import { User } from "../types/user";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import * as userActionCreators from '../redux/actions/userActions'
import ApiClient from "../api/apiClient/apiClient";


interface SelectCreateUserProps {
    user: User | null;
    onSelect: (user: User | null) => void;
}

const SelectCreateUser: FC<SelectCreateUserProps> = ({ user, onSelect }) => {

    const dispatch = useAppDispatch();
    const { searchUsers } = bindActionCreators(userActionCreators, dispatch);

    const [formOption, setFormOption] = useState<"existing" | "new">("existing");
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phone: '',
        birth_date: ''
    });

    let users: User[] = [];
    const usersData = useAppSelector((state) => state.searchUsersData);
    if (usersData) {
        users = Object.values(usersData.users);
    }

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        birth_date: '',
    });

    useEffect(() => {
        setFormOption('existing');
    }, [user]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (userSearchQuery.length >= 3) searchUsers(userSearchQuery);
        }, 300)

        return () => {
            clearTimeout(handler);
        }
    }, [userSearchQuery]);

    const validateTheName = (name: string) => {
        if (name.trim()) setErrors({ ...errors, name: '' });
        else setErrors({ ...errors, name: 'Name is required' });

        return name.trim() === '' ? false : true;
    }

    const validateTheEmail = (email: string) => {
        let isValid = true;

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setErrors({ ...errors, email: 'Email is not valid' });
            isValid = false;
        } else setErrors({ ...errors, email: '' });

        return isValid;
    }

    const validateThePhone = (phone: string) => {
        let isValid = true;
        const phonePattern = /^[0-9]{10}$/; // Assuming a 10-digit phone number
        if (phone && !phonePattern.test(phone)) {
            setErrors({ ...errors, phone: 'Phone number is not valid' });
            isValid = false;
        } else setErrors({ ...errors, phone: '' });

        return isValid;
    }

    const validateTheBirthDate = (birth_date: string) => {
        let isValid = true;

        if (birth_date) {
            const birthDate = new Date(birth_date);
            const minDate = new Date();
            minDate.setFullYear(minDate.getFullYear() - 15);
            if (birthDate > minDate) {
                setErrors({ ...errors, birth_date: 'Invalid birth date' });
                isValid = false;
            }
        }

        if (isValid) setErrors({ ...errors, birth_date: '' });

        return isValid;
    }


    const validate = () => {

        // Validate Name
        if (!validateTheName(formData.name)) return false;
        // Validate Email
        if(!validateTheEmail(formData.email)) return false;
        // Validate Phone
        if(!validateThePhone(formData.phone)) return false;
        // Validate Birth Date
        if(!validateTheBirthDate(formData.birth_date)) return false;

        return true;
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {

        if (event.target.name === 'name') validateTheName(event.target.value);
        if (event.target.name === 'email') validateTheEmail(event.target.value);
        if (event.target.name === 'phone') validateThePhone(event.target.value);
        if (event.target.name === 'birth_date') validateTheBirthDate(event.target.value);

        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleCreateUserSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validate()) {
            return; // If validation fails, stop form submission
        }

        const data = {
            ...formData,
            email: formData.email.trim() === '' ? formData.name.trim().split(' ').join(".") + "@14trees" : formData.email.trim(),
        }

        const apiClient = new ApiClient();
        const saveUser = async () => {
            const user = await apiClient.createUser(data as any);
            if (user) {
                onSelect(user);
            }
        };

        saveUser();
    };

    return (
        <Box>
            {formOption === 'existing' && <Box>
                <AutocompleteWithPagination
                    label="Enter your name or email to search"
                    value={user}
                    options={users}
                    getOptionLabel={(user) => `${user.name} (${user.email})`}
                    onChange={(event, value: User) => onSelect(value)}
                    onInputChange={(event) => { setUserSearchQuery(event.target.value); }}
                    fullWidth
                    size="medium"
                />
                <Typography variant="body1">Couldn't find yourself in the system? <Typography color="primary" style={{ cursor: 'pointer' }} onClick={() => setFormOption('new')} variant="body1" component="span">Register</Typography>.</Typography>
            </Box>}

            {formOption === 'new' && <Box>
                <Typography variant="body1" sx={{ mb: 1 }}>User details</Typography>
                <form onSubmit={handleCreateUserSubmit}>
                    <Grid container rowSpacing={2} columnSpacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                name="email"
                                label="Email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                error={!!errors.email}
                                helperText={errors.email}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="name"
                                label="Name"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                error={!!errors.name}
                                helperText={errors.name}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="phone"
                                label="Phone (Optional)"
                                value={formData.phone}
                                onChange={handleInputChange}
                                error={!!errors.phone}
                                helperText={errors.phone}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="birth_date"
                                label="Date of Birth (Optional)"
                                type="date"
                                value={formData.birth_date ? formData.birth_date.substring(0, 10) : ''}
                                onChange={handleInputChange}
                                error={!!errors.birth_date}
                                helperText={errors.birth_date}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button variant='contained' color='success' type="submit" sx={{ marginLeft: '10px' }}>Register</Button>
                        </Grid>
                    </Grid>
                </form>
                <Typography variant="body1">User already exists? <Typography onClick={() => setFormOption('existing')} style={{ cursor: 'pointer' }} color='primary' variant="body1" component="span">Select User</Typography>.</Typography>
            </Box>}
        </Box>
    );
}

export default SelectCreateUser;