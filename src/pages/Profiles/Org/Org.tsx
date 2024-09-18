import { Box, Divider, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApiClient from "../../../api/apiClient/apiClient";
import { Group } from "../../../types/Group";
import { Spinner } from "../../../components/Spinner";
import { Tree } from "../../../types/tree";
import { User } from "../../../types/user";
import TreeList from "../components/TreeList";
import UserList from "../components/UserList";
import VisitList from "../components/VisitList";
import { Visit } from "../../../types/visits";

interface OrgProps {

}

const Org: FC<OrgProps> = ({ }) => {

    const { id: orgId } = useParams();
    const [loading, setLoading] = useState(true);
    const [org, setOrg] = useState<Group | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [trees, setTrees] = useState<Tree[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [visits, setVisits] = useState<Visit[]>([]);

    const getOrg = async (orgId: number) => {
        const apiClient = new ApiClient();
        setLoading(true);
        try {
            const resp = await apiClient.getGroups(0, 1, [{ columnField: "id", value: orgId, operatorField: "equals" }])
            if (resp.results.length === 1) {
                setOrg(resp.results[0])
            } else {
                setError("Organization not found")
            }
        } catch (error) {
            setError("Something went wrong. Please try again later!")
        }
        setLoading(false);
    }

    const getTreesForOrganization = async (orgId: number) => {
        setLoading(true);
        try {
            const apiClient = new ApiClient();
            const trees = await apiClient.getTrees(0, -1, [{ columnField: "sponsored_by_group", value: orgId, operatorField: "equals" }]);
            setTrees(trees.results);
        } catch (error) {
            console.log(error)
            setError("Something went wrong. Please try again later!")
        }
        setLoading(false);
    }

    const getUsersForOrganization = async (orgId: number) => {
        setLoading(true);
        try {
            const apiClient = new ApiClient();
            const users = await apiClient.getUsers(0, -1, [{ columnField: "group_id", value: orgId, operatorField: "equals" }]);
            setUsers(users.results);
        } catch (error) {
            console.log(error)
            setError("Something went wrong. Please try again later!")
        }
        setLoading(false);
    }

    const getVisitsForOrganization = async (orgId: number) => {
        setLoading(true);
        try {
            const apiClient = new ApiClient();
            const visits = await apiClient.getVisits(0, 10);
            setVisits(visits.results);
        } catch (error) {
            console.log(error)
            setError("Something went wrong. Please try again later!")
        }
        setLoading(false);
    }

    useEffect(() => {
        if (orgId && !isNaN(Number(orgId))) {
            getOrg(Number(orgId));
        } else {
            setError("Page not Found!");
            setLoading(false);
        }
    }, [orgId]);

    useEffect(() => {
        if (org) {
            getTreesForOrganization(org.id);
            getUsersForOrganization(org.id);
            getVisitsForOrganization(org.id);
        }
    }, [org]);

    if (loading) {
        return (
            <Spinner text={"Loading..."} />
        );
    }

    if (!org) {
        return (
            <Box p={2} sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h4" style={{ marginBottom: 3 }}>
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box p={2}>
            <Box style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                <Typography variant="h4" style={{ marginBottom: 3 }}>
                    {org.name}
                </Typography>
            </Box>
            <Divider style={{ marginBottom: 10 }} />

            <Box>
                <Typography variant="body1" style={{ marginBottom: 10 }}>
                    We extend our deepest gratitude to <strong>{org.name}</strong> for their generous donation of <strong>{trees.length}</strong> trees to support our mission of creating a more sustainable and environmentally friendly world. Your commitment to combating climate change and preserving our planet for future generations is truly inspiring.
                    <br /><br />
                    Each tree planted is a step toward cleaner air, healthier ecosystems, and a brighter future for all. Together, we are making a lasting impact, and your partnership brings us one step closer to a greener, more sustainable planet.
                    <br /><br />
                    Thank you for being champions of change and for helping to build a world where nature thrives!
                </Typography>
                <Typography variant="body1" style={{ marginBottom: 10 }}>
                    🌳 Here are the glimpse of the trees donated by <strong>{org.name}</strong>.
                </Typography>

                <TreeList list={trees}/>
            </Box>

            <Divider style={{ marginBottom: 10, marginTop: 10 }} />
            <Box>
                <Typography variant="body1" style={{ marginBottom: 10 }}>
                    <strong>{org.name}</strong> has gifted these trees to their <strong>{users.length}</strong> members.
                </Typography>
                <Typography variant="body1" style={{ marginBottom: 10 }}>
                    🌳 Here are the wonderful members of <strong>{org.name}</strong>.
                </Typography>

                <UserList list={users} />
            </Box>

            <Divider style={{ marginBottom: 10, marginTop: 10 }} />
            <Box >
                <Typography variant="body1">
                    🌳 Site Visits done by members of <strong>{org.name}</strong>.
                </Typography>

                <VisitList list={visits} />
            </Box>

        </Box>
    );
}

export default Org;