import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { AutocompleteWithPagination } from "../../../../components/AutoComplete";
import { User } from "../../../../types/user";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as userActionCreators from '../../../../redux/actions/userActions'
import ApiClient from "../../../../api/apiClient/apiClient";

interface SponsorUserFormProps {
    user: User | null,
    onSelect: (user: User | null) => void
}

const SponsorUserForm: FC<SponsorUserFormProps> = ({ user, onSelect }) => {

    const dispatch = useAppDispatch();
    const { searchUsers } = bindActionCreators(userActionCreators, dispatch);

    const [formOption, setFormOption] = useState<"existing" | "new">("existing");
    const [userSearchQuery, setUserSearchQuery] = useState('');

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
        setFormOption('existing')
    }, [user])

    useEffect(() => {
        if (userSearchQuery.length >= 3) searchUsers(userSearchQuery);
    }, [userSearchQuery])

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleCreateUserSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const apiClient = new ApiClient();
        const saveUser = async () => {
            const user = await apiClient.createUser(formData as any);
            if (user) {
                onSelect(user);
            }
        }

        saveUser();
    }

    return (
        <Box>
            {formOption === 'existing' && <Box>
                <Typography variant='body1'>Let's check whether you exist in the system</Typography>
                <AutocompleteWithPagination
                    label="Enter your name or email to search"
                    value={user}
                    options={users}
                    getOptionLabel={user => `${user.name} (${user.email})`}
                    onChange={(event, value: User) => onSelect(value)}
                    onInputChange={(event) => { setUserSearchQuery(event.target.value) }}
                    fullWidth
                    size="medium"
                />
                <Typography variant="body1">Couldn't find yourself in the system? <Typography color="primary" onClick={() => setFormOption('new')} variant="body1" component="span">Add sponsor details</Typography>.</Typography>
            </Box>}

            {formOption === 'new' && <Box>
                <Typography variant="body1">Add Sponsor details</Typography>
                <form onSubmit={handleCreateUserSubmit}>
                    <Grid container rowSpacing={2} columnSpacing={1} >
                        <Grid item xs={12}>
                            <TextField name="name" label="Name" required value={formData.name} onChange={handleInputChange} fullWidth />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField name="phone" label="Phone" value={formData.phone} onChange={handleInputChange} fullWidth />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField name="email" label="Email" required value={formData.email} onChange={handleInputChange} fullWidth />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField name="birth_date" label="Date of Birth" type="date" value={formData.birth_date ? formData.birth_date.substring(0, 10) : ''} onChange={handleInputChange} InputLabelProps={{ shrink: true }} fullWidth />
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', }}>
                            <Button variant='contained' color='success' type="submit" sx={{ marginLeft: '10px' }}>Add Sponsor</Button>
                        </Grid>
                    </Grid>
                </form>
                <Typography variant="body1">Sponsor already exists? <Typography onClick={() => setFormOption('existing')} color='primary' variant="body1" component="span">Select Sponsor</Typography>.</Typography>
            </Box>}
        </Box>
    );
}

export default SponsorUserForm;