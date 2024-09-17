import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Visit } from "../../../types/visits";
import { Spinner } from "../../../components/Spinner";
import { Box, Divider, Typography } from "@mui/material";
import VisitImages from "./VisitImages";
import { User } from "../../../types/user";
import UserList from "../components/UserList";
import ApiClient from "../../../api/apiClient/apiClient";


interface VisitProps { }

const VisitPage: FC<VisitProps> = () => {
    const { id } = useParams();

    const [visit, setVisit] = useState<Visit | null>(null);
    const [users, setUsers] = useState<User[]>([]);

    const getVisit = async (visitId: number) => {
        const apiClient = new ApiClient();
        const visit = await apiClient.getVisits(0, 1, [{ columnField: "id", value: visitId, operatorField: "equals" }]);
        if (visit.results.length === 1) {
            setVisit(visit.results[0])
        }
    }

    const getVisitUsers = async (visitId: number) => {
        const apiClient = new ApiClient();
        const users = await apiClient.getVisitUsers(visitId, 0, 100);
        setUsers(users.results);
    }

    useEffect(() => {
        if (id) {
            getVisit(parseInt(id));
            getVisitUsers(parseInt(id));
        } 
    }, [id]);

    if (!visit) {
        return (
            <Spinner text={"Loading..."} />
        );
    }

    return (
        <Box p={2}>
            <Box style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                <Typography variant="h4" style={{ marginBottom: 3 }}>
                    {visit.visit_name}
                </Typography>
            </Box>
            <Divider style={{ marginBottom: 10 }} />

            <Typography variant='body1' style={{ marginBottom: 3, marginTop: 10 }}>
                On <strong>Aug 12, 2024</strong>, we were thrilled to welcome <strong>{visit.user_count}</strong> dedicated individuals who came together for a remarkable cause—to make a lasting impact on the environment. During this special visit, <strong>40</strong> trees were planted, symbolizing our shared commitment to nurturing nature and fostering a greener future. 
                <br /><br/>
                Each tree planted represents hope for cleaner air, healthier ecosystems, and a more sustainable planet. We extend our heartfelt gratitude to everyone who participated in this meaningful initiative, leaving a legacy that will benefit generations to come. Together, we are making the world🌍 a better place, one tree at a time.
            </Typography>
            <Divider style={{ marginBottom: 10, marginTop: 30 }} />
            <Typography variant='h6' fontWeight={600} style={{ marginBottom: 3, marginTop: 10 }}>
                Here are some beautiful photos taken during the visit!
            </Typography>
            <Box sx={{ width: '100%', maxHeight: '80vh', overflowY: 'auto', scrollbarWidth: 'none' }}>
                <VisitImages images={visit.visit_images}/>
            </Box>

            <Divider style={{ marginTop: 30, marginBottom: 10 }} />
            <Typography variant='h6' fontWeight={600} style={{ marginBottom: 3, marginTop: 10 }}>
                Here are the wonderful people who helped make this visit possible!
            </Typography>
            <UserList list={users} />

        </Box>
    );
}

export default VisitPage;