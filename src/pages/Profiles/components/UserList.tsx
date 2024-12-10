import { FC, useEffect, useState } from "react";
import { User } from "../../../types/user";
import { Box, Card, CardContent, FormControl, Grid, InputAdornment, OutlinedInput, Typography } from "@mui/material";
import { Search } from "@mui/icons-material";
import UserCard from "./UserCard";

interface UserListProps {
    list: User[]
}

const UserList: FC<UserListProps> = ({ list }) => {

    const [searchStr, setSearchStr] = useState<string>('')
    const [users, setUsers] = useState<User[]>(list)
    const [filteredUsers, setFilteredUsers] = useState<User[]>(list)

    useEffect(() => {
        setUsers(list);
        setFilteredUsers(list);
    }, [list])

    useEffect(() => {
        let result: User[] | null = null;
        if (searchStr) {
            result = users.filter(user => {
                return user.name.toLowerCase().includes(searchStr.toLowerCase()) || user.email.toLowerCase().includes(searchStr.toLowerCase()) || user.phone.toLowerCase().includes(searchStr.toLowerCase())
            })
        }

        if (result !== null) {
            setFilteredUsers(result);
        } else {
            setFilteredUsers(users);
        }

    }, [searchStr])

    const handleUserCardClick = (userId: number) => {
        const { hostname, host } = window.location;
        if (hostname === "localhost" || hostname === "127.0.0.1") {
            window.open("http://" + host + "/user/" + userId);
        } else {
            window.open("https://" + hostname + "/user/" + userId);
        }
    }

    return (
        <Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 1,
                marginRight: 1
            }}>
                <FormControl style={{ marginRight: 10, width: '100%', color: 'black' }} variant="outlined" >
                    <OutlinedInput
                        placeholder="Search by user name/email/phone..."
                        onChange={(e) => { setSearchStr(e.target.value) }}
                        startAdornment={<InputAdornment position="start"><Search /></InputAdornment>}
                        size="small"
                    />
                </FormControl>
            </Box>
            <Card style={{ backgroundColor: 'rgba(207, 255, 235, 0.3)', borderRadius: 4, width: '100%', marginBottom: 10 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6} container alignItems="center">
                            <Typography variant="body1" style={{ marginLeft: 8 }}>
                                Name
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={3} container alignItems="center" justifyContent="center">
                            <Typography variant="body1" style={{ marginLeft: 8 }}>
                                Reserved Trees
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={3} container alignItems="center" justifyContent="center">
                            <Typography variant="body1" style={{ marginLeft: 8 }}>
                                Assigned Trees
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Box sx={{ justifyContent: 'center', alignItems: 'center', maxHeight: '60vh', overflowY: 'auto', scrollbarWidth: 'none' }}>
                {
                    filteredUsers.map((user, index) => (
                        <Box key={index} style={{ width: '100%', marginBottom: 10 }} onClick={() => handleUserCardClick(user.id)}>
                            <UserCard
                                name={user.name}
                                mapped_trees={10}
                                assigned_trees={14}
                            />
                        </Box>
                    ))
                }
            </Box>
        </Box>
    )
};

export default UserList;