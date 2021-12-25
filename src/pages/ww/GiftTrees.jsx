import { useEffect, useState } from 'react';
import { Col } from "react-bootstrap";
import { createStyles, makeStyles } from '@mui/styles';
import {
    Paper,
    Typography,
    Button,
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow,
} from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import 'react-toastify/dist/ReactToastify.css';

import { Spinner } from "../../stories/Spinner/Spinner";
import Axios from "../../api/local";
import tree from "../../assets/dark_logo.png";
import { useParams } from 'react-router-dom';
import { GiftDialog } from './GiftDialog';

const intitialFValues = {
    name: '',
    email: '',
    contact: '',
    saplingid: '',
    uploaded: false,
    loading: false,
    backdropOpen: false,
    dlgOpen: false,
    selectedSaplingId: 0,
    user: {},
    trees: [],
}

export const GiftTrees = () => {
    console.log("rendered")
    let {email} = useParams();

    const classes = useStyles();
    const [values, setValues] = useState(intitialFValues);

    const handleClickOpen = (sapling_id) => {
        // setSelectedTree(sapling_id);
        setValues({
            ...values,
            dlgOpen: true,
            selectedSaplingId: sapling_id
        })
    };

    const handleClose = () => {
        setValues({
            ...values,
            dlgOpen: false
        })
    };

    const handleFormData = async (formData) => {
        await assignTree(formData);
    }

    useEffect(() => {
        (async () => {
            // Get Profile
            await fetchTrees();
        })();
    }, []);

    const fetchTrees = async () => {
        try {
            let profileTrees = await Axios.get(`/mytrees/${email}`);
            if (profileTrees.status === 200) {
                setValues({
                    ...values,
                    loading: false,
                    user: profileTrees.data.user[0],
                    trees: profileTrees.data.trees
                })
            }

        } catch (error) {
            if (error.response.status === 404) {
                setValues({
                    ...values,
                    loading: false,
                    backdropOpen: false
                })
                toast.error(error.response.data.error)
            }
        }
    }

    const assignTree = async (formValues) => {
        setValues({
            ...values,
            loading: true,
            backdropOpen: true
        })
        const formData = new FormData()
        const date = moment(formValues.dob).format('YYYY-MM-DD')
        formData.append('name', formValues.name)
        formData.append('email', formValues.email);
        formData.append('dob', date);
        formData.append('contact', formValues.contact);
        formData.append('sapling_id', values.selectedSaplingId);
        try {
            let res = await Axios.post('/profile/usertreereg', formData, {
                headers: {
                    'Content-type': 'multipart/form-data'
                },
            })

            if (res.status === 201) {
                const params = JSON.stringify({
                    "sapling_id": values.selectedSaplingId
                })
                await Axios.post('/mytrees/update', params, {
                    headers: {
                        'Content-type': 'application/json'
                    },
                })
                await fetchTrees();
                setValues({
                    ...values,
                    loading: false,
                    dlgOpen:false,
                    uploaded: true,
                })
                toast.success("Data uploaded successfully!")
            } else if (res.status === 204 || res.status === 400 || res.status === 409 || res.status === 404) {
                setValues({
                    ...values,
                    loading: false,
                    dlgOpen:false,
                    backdropOpen: false
                })
                toast.error(res.status.error)
            }
        } catch (error) {
            console.log(error.response)
            setValues({
                ...values,
                loading: false,
                dlgOpen:false,
                backdropOpen: false
            })
            if (error.response.status === 409 || error.response.status === 404) {
                toast.error(error.response.data.error)
            }
        }
    }

    if (values.loading) {
        return <Spinner />
    } else {
        return (
            <>
                <Col className={classes.left} lg={2} md={2} sm={12}></Col>
                <Col className={classes.center} lg={8} md={8} sm={12}>
                    <GiftDialog
                        open={values.dlgOpen}
                        onClose={handleClose}
                        formData={handleFormData}/>
                    <Paper sx={{
                        m:2,
                        p:4,
                        minWidth: '400px',
                    }}
                    variant="elevation"
                    elevation={2}>
                        {
                            values.user === undefined ?
                            (
                                <Typography variant="h5" align="left" sx={{pl:4,pt:2,pb:2}}>
                                    No user found!
                                </Typography>
                            ) :
                            (
                                <>
                                    <Typography variant="h5" align="left" sx={{pl:4,pt:2,pb:2}}>
                                        Welcome {values.user.name}
                                    </Typography>
                                    <ToastContainer/>
                                    {
                                        tree.length === 0 && (
                                            <Typography variant="h5" align="left" sx={{pl:4,pt:2,pb:2}}>
                                                No Trees in your account
                                            </Typography>
                                        )
                                    }
                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead>
                                            <TableRow>
                                                <TableCell>Tree Name</TableCell>
                                                <TableCell align="right">Sapling ID</TableCell>
                                                <TableCell align="right">Plot</TableCell>
                                                <TableCell align="right">Assigned</TableCell>
                                                <TableCell align="right"></TableCell>
                                            </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    values.trees.map((row) => (
                                                        <TableRow
                                                            key={row._id}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        >
                                                            <TableCell component="th" scope="row">
                                                                {row.tree_id.tree_id.name}
                                                            </TableCell>
                                                            <TableCell align="right">{row.tree_id.sapling_id}</TableCell>
                                                            <TableCell align="right">{row.tree_id.plot_id.name}</TableCell>
                                                            <TableCell align="right">{row.assigned ? "Yes" : "No"}</TableCell>
                                                            <TableCell align="right">
                                                                <Button
                                                                    variant="contained"
                                                                    color='primary'
                                                                    disabled={row.assigned}
                                                                    onClick={() => handleClickOpen(row.tree_id.sapling_id)}
                                                                >
                                                                    Assign
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </>
                            )
                        }
                    </Paper>
                </Col>
                <Col className={classes.right} lg={2} md={2} sm={12}></Col>
            </>
        )
    }
}

const useStyles = makeStyles((theme) =>
    createStyles({
        left: {
            width: '100%',
            marginRight: '10px',
        },
        center: {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
        },
        right: {
            width: '100%',
            marginLeft: '10px'
        },
        infobox: {
            marginTop: '5%',
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            [theme.breakpoints.down('md')]: {
                flexWrap: 'wrap',
            }
        },
        infodesc: {
            fontSize: '30px',
            paddingLeft: '1%',
            fontWeight: '500',
            color: '#ffffff',
            alignItems: 'center',
            textAlign: 'center',
            [theme.breakpoints.down('md')]: {
                fontSize: '20px',
            }
        },
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
        },
    }))