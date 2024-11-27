import { Box, Chip, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { User } from "../../../../types/user";
import { AutocompleteWithPagination } from "../../../../components/AutoComplete";
import * as userActionCreators from "../../../../redux/actions/userActions"
import ApiClient from "../../../../api/apiClient/apiClient";
import { toast } from "react-toastify";

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
    const [treesCount1, setTreesCount1] = useState<any>(null)
    const [treesCount2, setTreesCount2] = useState<any>(null)

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

    useEffect(() => {
        const handler = setTimeout(async () => {
            if (primaryUser) {
                const data = await getTreeCountForUser(primaryUser.id);
                setTreesCount1(data);
            } else {
                setTreesCount1(null);
            }
        }, 300)

        return () => {
            clearTimeout(handler);
        }
    }, [primaryUser]);

    useEffect(() => {
        const handler = setTimeout(async () => {
            if (secondaryUser) {
                const data = await getTreeCountForUser(secondaryUser.id);
                setTreesCount2(data);
            } else {
                setTreesCount2(null);
            }
        }, 300)

        return () => {
            clearTimeout(handler);
        }
    }, [secondaryUser]);

    const getTreeCountForUser = async (userId: number) => {
        try {
            const apiClient = new ApiClient();
            const resp = apiClient.getTreesCountForUser(userId);
            return resp;
        } catch (error: any) {
            toast.error(error.message);
        }
    }

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
                {treesCount1 && <Box display="flex">
                    <Chip
                        label={`Mapped trees: ${treesCount1.mapped_trees}`}
                        sx={{ margin: 0.5 }}
                    />
                    <Chip
                        label={`Assigned trees: ${treesCount1.assigned_trees}`}
                        sx={{ margin: 0.5 }}
                    />
                </Box>}
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
                {treesCount2 && <Box display="flex">
                    <Chip
                        label={`Mapped trees: ${treesCount2.mapped_trees}`}
                        sx={{ margin: 0.5 }}
                    />
                    <Chip
                        label={`Assigned trees: ${treesCount2.assigned_trees}`}
                        sx={{ margin: 0.5 }}
                    />
                </Box>}
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
                    size="small"
                >
                    <ToggleButton value="yes">Yes</ToggleButton>
                    <ToggleButton value="no">No</ToggleButton>
                </ToggleButtonGroup>
            </Box>
        </Box>
    )
}

export default CombineUserForm;