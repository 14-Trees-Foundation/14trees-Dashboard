import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";


export const AdminHome = () => {
    const navigate = useNavigate();
    return (
        <div>
            <Button
                sx={{m:2}}
                size='large'
                variant="contained"
                color='primary'
                onClick={() => navigate('/admin/assigntrees')}>
                    AssignTrees
            </Button>
            <Button
                sx={{m:2}}
                size='large'
                variant="contained"
                color='primary'
                onClick={() => navigate('/admin/addorg')}>
                    Add Org
            </Button>
        </div>
    )
}