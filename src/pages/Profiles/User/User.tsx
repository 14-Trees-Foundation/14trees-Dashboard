import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as userActionCreators from "../../../redux/actions/userActions";
import { useParams } from "react-router-dom";
import { User } from "../../../types/user";
import { RootState } from "../../../redux/store/store";
import { Spinner } from "../../../components/Spinner";
import { Box, Divider, FormControl, InputAdornment, OutlinedInput, Typography } from "@mui/material";
import TreeCard from "./TreeCard";
import VisitCard from "./VisitCard";
import { Search } from "@mui/icons-material";
import { Tree } from "../../../types/tree";
import ApiClient from "../../../api/apiClient/apiClient";


interface UserProps { }

const UserPage: FC<UserProps> = () => {
    const { id } = useParams();

    const dispatch = useAppDispatch();
    const { getUsers } = bindActionCreators(userActionCreators, dispatch);

    const [searchStr, setSearchStr] = useState<string>('')
    const [date, setDate] = useState<string>('')
    const [trees, setTrees] = useState<Tree[]>([])
    const [filteredTrees, setFilteredTrees] = useState<Tree[]>([])

    useEffect(() => {
        let result: Tree[] | null = null;
        if (date) {
            result = trees.filter(tree => new Date(tree.created_at) >= new Date(date))
        }
        
        if (searchStr) {
            result = (result ?? trees).filter(tree => {
                return tree.sapling_id.toLowerCase().includes(searchStr.toLowerCase()) || tree.plant_type?.toLowerCase().includes(searchStr.toLowerCase())
            })
        }

        if (result !== null) {
            setFilteredTrees(result);
        } else {
            setFilteredTrees(trees);
        }

    }, [searchStr, date])


    useEffect(() => {
        getUsers(0, 1, [{ columnField: "id", value: id, operatorField: "equals" }]);

        const getTrees = async () => {
            const apiClient = new ApiClient();
            const trees = await apiClient.getAssignedTrees(Number(id));
            setTrees(trees);
            setFilteredTrees(trees);
        }

        getTrees();
    }, [id]);

    let user: User | null = null;
    const usersData = useAppSelector((state: RootState) => state.usersData);
    if (usersData) {
        const users = Object.values(usersData.users);
        if (users.length > 0) {
            user = users[0];
        }
    }

    if (!user) {
        return (
            <Spinner text={"Loading..."} />
        );
    }

    const handleTreeCardClick = (saplingId: string) => {
        const { hostname, host } = window.location;
        if (hostname === "localhost" || hostname === "127.0.0.1") {
            window.open("http://" + host + "/tree/" + saplingId);
        } else {
            window.open("https://" + hostname + "/tree/" + saplingId);
        }
    }

    return (
        <Box p={2}>
            <Box style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                <Typography variant="h4" style={{ marginBottom: 3 }}>
                    {user.name}
                </Typography>
            </Box>
            <Divider style={{ marginBottom: 10 }} />

            <Typography variant='subtitle1' style={{ marginBottom: 3, marginTop: 10 }}>
                Thank You for Making a Difference! 🌳
            </Typography>
            <Typography variant='body1' style={{ marginBottom: 3, marginTop: 10 }}>
                <strong>{user.name.split(' ')[0]}</strong> has planted <strong>{trees.length}</strong> trees, helping to sustain our environment and create a greener, healthier planet for future generations. Each tree plays a crucial role in absorbing carbon, restoring habitats, and improving air quality. Your commitment is part of a global effort to fight climate change and protect biodiversity.
                <br />
                <br />
                Together, we are building a better, more sustainable world—one tree at a time. Keep up the amazing work!
            </Typography>
            <Divider style={{ marginBottom: 10 }} />
            <Typography variant='h6' style={{ marginBottom: 3, marginTop: 10 }}>
                Here are the trees planted by <strong>{user.name.split(' ')[0]}</strong>
            </Typography>
            <Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 1,
                    marginRight: 1
                }}>
                    <FormControl style={{ marginRight: 10, width: '70%', color: 'black' }} variant="outlined" >
                        <OutlinedInput
                            onChange={(e) => { setSearchStr(e.target.value) }}
                            startAdornment={<InputAdornment position="start"><Search /></InputAdornment>}
                            size="small"
                        />
                    </FormControl>
                    <FormControl style={{ width: '30%' }} variant="outlined" >
                        <OutlinedInput
                            onChange={(e) => { setDate(e.target.value) }}
                            size="small"
                            type="date"
                        />
                    </FormControl>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', maxHeight: '60vh', overflowY: 'auto', scrollbarWidth: 'none' }}>
                    {
                        filteredTrees.map((tree, index) => (
                            <Box key={index} style={{ flexGrow: 1, marginRight: 10, marginBottom: 10 }} onClick={() => handleTreeCardClick("152511")}>
                                <TreeCard
                                    imageUrl={tree.image}
                                    title={tree.sapling_id}
                                    subtitle={tree.plant_type || ''}
                                    date={(tree.created_at as any).split('T')[0]}
                                />
                            </Box>
                        ))
                    }
                </Box>
            </Box>

            <Typography variant='h6' style={{ marginBottom: 3, marginTop: 20 }}>
                Event Visits By <strong>{user.name.split(' ')[0]}</strong>
            </Typography>
            <Box sx={{ width: '100%', maxHeight: '80vh', overflowY: 'auto', scrollbarWidth: 'none' }}>
                {
                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((index) => (
                        <Box key={index} style={{ flexGrow: 1, marginRight: 10, marginBottom: 10 }}>
                            <VisitCard
                                visitName="Sample Visit"
                                visitDate="2022-01-01"
                                numberOfPeople={20}
                                numberOfImages={500}
                            />
                        </Box>
                    ))
                }
            </Box>
        </Box>
    );
}

export default UserPage;