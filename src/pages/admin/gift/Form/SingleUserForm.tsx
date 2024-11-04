import { Autocomplete, Button, Grid, TextField } from "@mui/material";
import { FC, useState, SyntheticEvent, ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import * as userActionCreators from "../../../../redux/actions/userActions";
import { bindActionCreators } from "@reduxjs/toolkit";

interface User {
    name: string;
    phone: string;
    email: string;
    count: number;
    profileImage?: File;
}

interface SingleUserFormProps {
    onSubmit: (user: User) => void;
}

const SingleUserForm: FC<SingleUserFormProps> = ({ onSubmit }) => {
    const dispatch = useAppDispatch();
    const { searchUsers } = bindActionCreators(userActionCreators, dispatch);

    const [user, setUser] = useState<User>({ name: '', phone: '', email: '', count: 1 });

    const handleUserChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUser({ ...user, [name]: value });
    };

    const handleNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(1, parseInt(event.target.value, 10));
        setUser({ ...user, count: value });
    };

    const handleProfileImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setUser({ ...user, profileImage: event.target.files[0] });
        }
    };

    const usersData = useAppSelector((state) => state.searchUsersData);
    let usersList: any[] = [];
    if (usersData) {
        usersList = Object.values(usersData.users);
    }

    const handleEmailChange = (event: SyntheticEvent, value: string) => {
        let isSet = false;
        usersList.forEach((user) => {
            if (`${user.name} (${user.email})` === value) {
                isSet = true;
                setUser(prev => ({
                    email: user.email,
                    name: user.name,
                    phone: user.phone ?? '',
                    count: prev.count,
                    profileImage: prev.profileImage,
                }));
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
        setUser({ name: '', phone: '', email: '', count: 1, profileImage: undefined });
    };

    return (
        <div>
            <Grid container rowSpacing={2} columnSpacing={1}>
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
                <Grid item xs={12}>
                    <TextField name="name" label="Name" value={user.name} onChange={handleUserChange} fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <TextField name="phone" label="Phone (Optional)" value={user.phone} onChange={handleUserChange} fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        type="number"
                        label="Number Of Trees"
                        name="count"
                        value={user.count}
                        onChange={handleNumberChange}
                        inputProps={{ min: 1 }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        value={user.profileImage ? undefined : ''}
                        type="file"
                        label="Profile Image (Optional)"
                        inputProps={{ accept: "image/*" }}
                        onChange={handleProfileImageChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleCancel}
                        style={{ marginRight: '10px' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleSubmit}
                    >
                        Add
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default SingleUserForm;