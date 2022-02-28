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
    Chip,
} from "@mui/material";

import Axios from "../../../../api/local";
import { Spinner } from '../../../../components/Spinner';
import {
    plotsList,
} from '../../../../store/adminAtoms';

export const TreeList = () => {
    const classes = useStyles();
    const plots = useRecoilValue(plotsList);
    const [selectedPlot, setSelectedPlot] = useState('');
    const [loading, setLoading] = useState(false);
    const [assigned, setAssigned] = useState([]);
    const [unassigned, setUnassigned] = useState([]);

    const fetchAndShowTreeList = async (value) => {
        setSelectedPlot(value.name)
        setLoading(true);
        try {
            let response = await Axios.get(`/trees/plot/count?id=${value._id}`);
            if (response.status === 200) {
                let difference = response.data.alltrees
                    .filter(x => !response.data.assignedtreee.includes(x))
                    .sort(function (a, b) { return a - b; });
                setAssigned(response.data.assignedtreee)
                setUnassigned(difference)
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
                        height: '600px'
                    }}
                        variant="elevation"
                        elevation={2}>
                        <Typography variant="h5" align="center" style={{ color: '#9BC53D' }}>
                            Step - 1
                        </Typography>
                        {/* <Typography variant="h6" align="left">
                                Select Plot
                            </Typography> */}
                        <Autocomplete
                            id="plots"
                            options={plots}
                            autoHighlight
                            getOptionLabel={(option) => option.name}
                            onChange={(event, newValue) => {
                                fetchAndShowTreeList(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} label="Select plot to fetch tree list" variant="outlined" />}
                        />
                        <ToastContainer />
                        <div style={{ paddingTop: '16px', paddingLeft: '8px' }}>Plot: <span style={{ color: '#ff0000', fontStyle: 'italic' }}>{selectedPlot}</span></div>
                        <div style={{ width: '100%', paddingTop: '8px', minHeight: '20%', maxHeight: '180px', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h4 style={{ marginTop: '0px', paddingLeft: '8px' }}>Assigned Trees</h4>
                                <h4 style={{ marginTop: '0px', paddingRight: '8px' }}>Total: <span style={{ color: '#ff0000', fontStyle: 'italic' }}>{assigned.length}</span></h4>
                            </div>
                            {
                                assigned.length !== 0 && assigned.map(saplingid => {
                                    return (
                                        <Chip key={saplingid} label={saplingid} color="info" variant="outlined" style={{ margin: '4px' }} onClick={() => window.open("http://dashboard.14trees.org/profile/" + saplingid, "_blank")} />
                                    )
                                })
                            }
                        </div>
                        <div style={{ width: '100%', paddingLeft: '4px', paddingTop: '16px', minHeight: '40%', maxHeight: '280px', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h4 style={{ marginTop: '0px', paddingLeft: '8px' }}>UnAssigned Trees</h4>
                                <h4 style={{ marginTop: '0px', paddingRight: '8px' }}>Total: <span style={{ color: '#ff0000', fontStyle: 'italic' }}>{unassigned.length}</span></h4>
                            </div>
                            {
                                unassigned.length !== 0 && unassigned.map(saplingid => {
                                    return (
                                        <Chip key={saplingid} label={saplingid} color="success" variant="outlined" style={{ margin: '4px' }} />
                                    )
                                })
                            }
                        </div>
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