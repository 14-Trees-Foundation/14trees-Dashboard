import { Autocomplete, Button, Grid, TextField } from "@mui/material";
import { FC, useState, SyntheticEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import * as userActionCreators from "../../../../redux/actions/userActions";
import { bindActionCreators } from "@reduxjs/toolkit";

interface User {
    name: string;
    phone: string;
    email: string;
}

interface UserFormProps {
    onSubmit: (user: User) => void;
}

export const UserForm: FC<UserFormProps> = ({ onSubmit }) => {

    const dispatch = useAppDispatch();
    const { searchUsers } = bindActionCreators(userActionCreators, dispatch);

    const [user, setUser] = useState<User>({ name: '', phone: '', email: '' });
    
    const handleUserChange = (event: any) => {
        const { name, value } = event.target;
        setUser({ ...user, [name]: value });
    };

    const usersData = useAppSelector((state) => state.searchUsersData);
    let usersList: User[] = [];
    if (usersData) {
        usersList = Object.values(usersData.users);
    }

    const handleEmailChange = (event: SyntheticEvent, value: string) => {
        let isSet = false;
        usersList.forEach((user) => {
            if (`${user.name} (${user.email})` === value) {
                isSet = true;
                setUser({
                    email: user.email,
                    name: user.name,
                    phone: user.phone ?? '',
                });
            }
        });

        if (!isSet && user.email !== value && value !== ` ()`) {
            setUser({
                ...user,
                email: value,
            });
            if (value.length >= 3) searchUsers(value);
        }
    };

    const handleSubmit = () => {
        onSubmit(user);
        handleCancel();
    };

    const handleCancel = () => {
        setUser({ name: '', phone: '', email: '' });
    };

    return (
        <div>
            <Grid container rowSpacing={2} columnSpacing={1}>
                <Grid item xs={12}>
                    <TextField required name="name" label="Name" value={user.name} onChange={handleUserChange} fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <TextField required name="phone" label="Phone" value={user.phone} onChange={handleUserChange} fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        fullWidth
                        options={usersList.map((user) => `${user.name} (${user.email})`)}
                        onInputChange={handleEmailChange}
                        value={user.email}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Email"
                                variant="outlined"
                                name="email"
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="outlined"
                        color='error'
                        onClick={handleCancel}
                        style={{ marginRight: '10px' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color='success'
                        onClick={handleSubmit}
                    >
                        Add
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
};
