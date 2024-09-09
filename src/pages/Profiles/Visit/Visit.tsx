import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as treeActionCreators from "../../../redux/actions/treeActions";
import * as userActionCreators from "../../../redux/actions/userActions";
import { useParams } from "react-router-dom";
import { User } from "../../../types/user";
import { RootState } from "../../../redux/store/store";
import { Spinner } from "../../../components/Spinner";
import { Box, Button, Divider, Typography } from "@mui/material";
import VisitImages from "./VisitImages";


interface UserProps { }

const UserPage: FC<UserProps> = () => {
    const { id } = useParams();

    const dispatch = useAppDispatch();
    const { getUsers } = bindActionCreators(userActionCreators, dispatch);


    useEffect(() => {
        getUsers(0, 1, [{ columnField: "id", value: id, operatorField: "equals" }]);
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

    return (
        <Box p={2}>
            <Box style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                <Typography variant="h4" style={{ marginBottom: 3 }}>
                    Sprih Visit
                </Typography>
            </Box>
            <Divider style={{ marginBottom: 10 }} />

            <Typography variant='body1' style={{ marginBottom: 3, marginTop: 10 }}>
                On <strong>Aug 12, 2024</strong>, we were thrilled to welcome <strong>20</strong> dedicated individuals who came together for a remarkable cause—to make a lasting impact on the environment. During this special visit, <strong>40</strong> trees were planted, symbolizing our shared commitment to nurturing nature and fostering a greener future. 
                <br /><br/>
                Each tree planted represents hope for cleaner air, healthier ecosystems, and a more sustainable planet. We extend our heartfelt gratitude to everyone who participated in this meaningful initiative, leaving a legacy that will benefit generations to come. Together, we are making the world🌍 a better place, one tree at a time.
            </Typography>
            <Divider style={{ marginBottom: 10 }} />

            <Typography variant='h6' style={{ marginBottom: 3, marginTop: 10 }}>
                Here are some beautiful photos taken during the visit!
            </Typography>
            <Box sx={{ width: '100%', maxHeight: '80vh', overflowY: 'auto', scrollbarWidth: 'none' }}>
                <VisitImages />
            </Box>
        </Box>
    );
}

export default UserPage;