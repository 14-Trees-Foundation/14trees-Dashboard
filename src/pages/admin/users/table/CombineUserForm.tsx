import { Box, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { User } from "../../../../types/user";
import { AutocompleteWithPagination } from "../../../../components/AutoComplete";
import * as userActionCreators from "../../../../redux/actions/userActions"

interface CombineUserFormProps {
    primaryUser: User | null
    secondaryUser: User | null
    onPrimaryUserChange: (user: User | null) => void
    onSecondaryUserChange: (user: User | null) => void
    deleteSecondary: boolean
    onDeleteSecondaryChange: (value: boolean) => void
}

const CombineUserForm: React.FC<CombineUserFormProps> = ({ primaryUser, secondaryUser, deleteSecondary, onDeleteSecondaryChange, onPrimaryUserChange, onSecondaryUserChange }) => {

    const dispatch = useAppDispatch();
    const { searchUsers } = bindActionCreators(userActionCreators, dispatch);

    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [userSearchQuery2, setUserSearchQuery2] = useState('');

    let users: User[] = [];
    const usersData = useAppSelector((state) => state.searchUsersData);
    if (usersData) {
        users = Object.values(usersData.users);
    }

    useEffect(() => {
        const handler = setTimeout(() => {
            if (userSearchQuery.length >= 3) searchUsers(userSearchQuery);
        }, 300)

        return () => {
            clearTimeout(handler);
        }
    }, [userSearchQuery]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (userSearchQuery2.length >= 3) searchUsers(userSearchQuery2);
        }, 300)

        return () => {
            clearTimeout(handler);
        }
    }, [userSearchQuery2]);

    return (
        <Box
            sx={{
                padding: 2,
                display: "flex",
                flexDirection: 'column',
            }}
        >
            <Box mt={2}>
                <Typography>Select primary user</Typography>
                <AutocompleteWithPagination
                    label="Enter your name or email to search"
                    value={primaryUser}
                    options={users}
                    getOptionLabel={(user) => `${user.name} (${user.email})`}
                    onChange={(event, value: User) => onPrimaryUserChange(value)}
                    onInputChange={(event) => { setUserSearchQuery(event.target.value); }}
                    fullWidth
                    size="medium"
                />
            </Box>
            <Box mt={2}>
                <Typography>Select secondary user</Typography>
                <AutocompleteWithPagination
                    label="Enter your name or email to search"
                    value={secondaryUser}
                    options={users}
                    getOptionLabel={(user) => `${user.name} (${user.email})`}
                    onChange={(event, value: User) => onSecondaryUserChange(value)}
                    onInputChange={(event) => { setUserSearchQuery2(event.target.value); }}
                    fullWidth
                    size="medium"
                />
            </Box>
            <Box 
                mt={2}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <Typography mr={5}>Do you want to delete secondary user?</Typography>
                <ToggleButtonGroup
                    color="success"
                    value={deleteSecondary ? "yes" : "no"}
                    exclusive
                    onChange={(e, value) => { onDeleteSecondaryChange(value === "yes" ? true : false); }}
                    aria-label="Platform"
                >
                    <ToggleButton value="yes">Yes</ToggleButton>
                    <ToggleButton value="no">No</ToggleButton>
                </ToggleButtonGroup>
            </Box>
        </Box>
    )
}

export default CombineUserForm;