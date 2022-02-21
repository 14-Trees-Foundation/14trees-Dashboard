import { useState } from 'react';
import { createStyles, makeStyles } from '@mui/styles';
import { Col } from "react-bootstrap";
import { useRecoilValue } from 'recoil';
import { ToastContainer, toast } from 'react-toastify';
import {
    Paper,
    Typography,
    Autocomplete,
    TextField,
} from "@mui/material";

import Axios from "../../../../api/local";
import { Spinner } from '../../../../components/Spinner';
import {
    plotsList,
} from '../../../../store/adminAtoms';

export const TreeList = () => {
    const classes = useStyles();
    const plots = useRecoilValue(plotsList);
    const [loading, setLoading] = useState(false);
    const [treeData, setTreeData] = useState({});

    console.log(treeData);
    const fetchAndShowTreeList = async (value) => {
        setLoading(true);
        console.log(value)
        try {
            let response = await Axios.get(`/trees/countbyplot?id=${value._id}`);
            if (response.status === 200) {
                setTreeData(response.data)
                toast.success("Tree list fetched!")
            }
        } catch (error) {
            toast.error("Error fetching tree list!")
        }
        setLoading(false);
    }

    if (loading) {
        return <Spinner text={"Fetching Tree Data!"} />
    } else {
        return (
            <>
                <Col className={classes.left} lg={3} md={2} sm={12}></Col>
                <Col className={classes.center} lg={6} md={8} sm={12}>
                    <Paper sx={{
                        m: 2,
                        p: 2,
                        minWidth: '300px',
                        minHeight: '350px'
                    }}
                        variant="elevation"
                        elevation={2}>
                        <Typography variant="h5" align="center" style={{ color: '#cc1111' }}>
                            Step - 1
                        </Typography>
                        <Typography variant="h6" align="center">
                            Fetch tree list
                        </Typography>
                        <ToastContainer />
                        <Autocomplete
                            style={{ marginTop: '32px' }}
                            id="plots"
                            options={plots}
                            autoHighlight
                            getOptionLabel={(option) => option.name}
                            onChange={(event, newValue) => {
                                fetchAndShowTreeList(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} label="Select Plot" variant="outlined" />}
                        />
                    </Paper>
                </Col>
                <Col className={classes.right} lg={3} md={2} sm={12}></Col>
            </>
        )
    }
}


const useStyles = makeStyles((theme) =>
    createStyles({
        formheader: {
            paddingLeft: '1%',
            fontWeight: "500",
            [theme.breakpoints.down('md')]: {
                paddingLeft: "5%",
                paddingTop: '5%',
            }
        },
    })
)