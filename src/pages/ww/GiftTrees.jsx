import { useEffect, useState } from 'react';
import { createStyles, makeStyles } from '@mui/styles';
import {
    Typography,
    Button,
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow,
    Box
} from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import imageCompression from 'browser-image-compression';

import { Spinner } from "../../stories/Spinner/Spinner";
import { GiftDialog } from './GiftDialog';
import Axios from "../../api/local";

import logo from '../../assets/gift/logogift.png';
import tree from "../../assets/dark_logo.png";
import bg from "../../assets/gift/bg.png";
import bgfooter from "../../assets/gift/bgfooter.png";
import footer from "../../assets/gift/footer.png";

const intitialFValues = {
    name: '',
    email: '',
    contact: '',
    saplingid: '',
    uploaded: false,
    loading: true,
    backdropOpen: false,
    dlgOpen: false,
    selectedSaplingId: 0,
    user: {},
    trees: [],
}

export const GiftTrees = () => {
    let {email} = useParams();

    const classes = useStyles();
    const [values, setValues] = useState(intitialFValues);

    const compressImageList = async (file) => {

        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1080,
          useWebWorker: true
        }

        let compressedFile;

        try {
            compressedFile = await imageCompression(file, options);
        } catch (error) {
          console.log(error);
        }

        return new File([compressedFile], file.name);
    }
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

    const handleFormData = async (formData, img) => {
        await assignTree(formData, img);
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

    const assignTree = async (formValues, img) => {
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

        if (img !== null) {
            let userImages = [];
            let image = await compressImageList(img);
            formData.append('files', image)
            userImages.push(img.name)
            formData.append('userimages', userImages);
        }

        let res;
        try {
            res = await Axios.post('/profile/usertreereg', formData, {
                headers: {
                    'Content-type': 'multipart/form-data'
                },
            })

            if (res.status === 201) {
                const params = JSON.stringify({
                    "sapling_id": values.selectedSaplingId,
                    "user_id": res.data.usertreereg.user
                })
                await Axios.post('/mytrees/update', params, {
                    headers: {
                        'Content-type': 'application/json'
                    },
                })

                let profileTrees = await Axios.get(`/mytrees/${email}`);
                if (profileTrees.status === 200) {
                    setValues({
                        ...values,
                        loading: false,
                        user: profileTrees.data.user[0],
                        trees: profileTrees.data.trees,
                        dlgOpen:false,
                        uploaded: true,
                    })
                }
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
        if (Object.keys(values.user).length === 0 && !values.loading) {
            return (
                <Typography variant='h2' align='center' sx={{p:8, fontWeight: 'bold'}}>
                    User ID not found!
                </Typography>
            )
        } else {
            return (
                <>
                    <div className={classes.bg}>
                        <Box sx={{
                            textAlign: 'center',p:8,
                            '@media screen and (max-width: 640px)': {
                                p:2,
                            },
                        }}>
                            <img src={logo} className={classes.logo} alt="logoo"/>
                            <div className={classes.headerbox}>
                                <Typography variant='h4' align='center' sx={{color:'#1f3625',fontWeight:'550'}}>
                                    <span>Thank You {values.user.name} for your contribution!</span>
                                    <p style={{margin:'0px'}}>We couldn't have done this without you.</p>
                                </Typography>
                                <Typography variant='subtitle1' sx={{lineHeight: '25px', fontSize:'20px', fontWeight:'400', color:'#1f3625', pt:4, pb:3}}>
                                    Thank you so much for the immeasurably and valuable contribution towards 14 Trees! We have not thanked you enough, and want to let you know that your dedication, efforts, support is essential to the work that we do and creating hugh impact not only on enviroment but on many lives.
                                </Typography>
                                <div style={{width:'80%', marginLeft:'auto', marginRight:'auto'}}>
                                    <Typography sx={{lineHeight: '25px', fontSize:'20px', fontWeight:'600', color:'#1f3625', pb:3}}>
                                        To acknolwdge and appreciate your contribution towards 14 Trees we would like to gift you 14 Trees which you can further gift to your freinds/family members on the occassaion of new year.
                                    </Typography>
                                </div>
                            </div>
                        </Box>
                        <div style={{position: 'relative'}}>
                            <img src={bg} className={classes.landingimg} alt="bg"/>
                            <div style={{background: 'linear-gradient(360deg, #3F5344 17.02%, rgba(63, 83, 68, 0) 100%)', height: '230px', position: 'relative', zIndex: '999',marginTop: '-200px'}}></div>
                            <img src={bgfooter} className={classes.bgfooter} alt="bgfooter"/>
                        </div>
                        <GiftDialog
                            open={values.dlgOpen}
                            onClose={handleClose}
                            formData={handleFormData}/>
                        <div className={classes.tbl}>
                            <Typography variant="h4" align="left" sx={{pl:1, pt:4,pb:4, fontWeight: '600', color: '#1f3625'}}>
                                Tree Holdings ( {values.trees.length} )
                            </Typography>
                            <ToastContainer/>
                            {
                                tree.length === 0 && (
                                    <Typography variant="h5" align="left" sx={{pl:4,pt:2,pb:2}}>
                                        No Trees in your account
                                    </Typography>
                                )
                            }
                            <TableContainer>
                                <Table sx={{ minWidth: 400 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow sx={{fontSize: '16px'}}>
                                            <TableCell>Tree Name</TableCell>
                                            <TableCell align="right">Sapling ID</TableCell>
                                            <TableCell align="right">Plot</TableCell>
                                            <TableCell align="right"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody className={classes.tblrow}>
                                        {
                                            values.trees.map((row) => (
                                                <TableRow
                                                    key={row._id}
                                                    sx={{
                                                        m:2
                                                    }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {row.tree_id.tree_id.name}
                                                    </TableCell>
                                                    <TableCell align="right">{row.tree_id.sapling_id}</TableCell>
                                                    <TableCell align="right">{row.tree_id.plot_id.name}</TableCell>
                                                    <TableCell align="center">
                                                        {
                                                            row.assigned ?
                                                            (
                                                                <>
                                                                    <Typography variant='subtitle2' align='center' sx={{p:1, pb:0, fontSize:'12px'}}>
                                                                        Assigned To
                                                                    </Typography>
                                                                    <Typography variant='subtitle1' align='center' sx={{fontWeight:'bold',color:'#1F3625'}}>
                                                                        {row.assigned_to.name}
                                                                    </Typography>
                                                                </>
                                                            ) :
                                                            <Button
                                                                sx={{ml:'auto', mr:'auto'}}
                                                                variant="contained"
                                                                color='primary'
                                                                disabled={row.assigned}
                                                                onClick={() => handleClickOpen(row.tree_id.sapling_id)}
                                                            >
                                                                Assign
                                                            </Button>
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                        <div className={classes.footer}>
                        </div>
                    </div>
                </>
            )
        }
    }
}

const useStyles = makeStyles((theme) =>
    createStyles({
        bg: {
            backgroundColor: '#E9EAE7',
            width: '100%',
        },
        logo: {
            width: '90px',
            height: '110px',
            padding: theme.spacing(2)
        },
        headerbox: {
            width: '70%', maxWidth:'820px', marginLeft:'auto', marginRight:'auto',
            [theme.breakpoints.down('md')]: {
                width: '100%'
            }
        },
        landingimg: {
            width: '100%', height: 'auto', marginTop: '-250px',
            [theme.breakpoints.down('1200')]: {
                marginTop: '-80px',
                minHeight: '350px',
            }
        },
        bgfooter: {
            width: '100%',
            height:'90px',
            marginTop: '-5px',
            [theme.breakpoints.down('1200')]: {
                height: '50px'
            }
        },
        tbl:{
            maxWidth: '1080px',
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingBottom: theme.spacing(16),
            paddingTop: theme.spacing(12),
            [theme.breakpoints.down('1200')]: {
                padding: '32px 16px 48px 32px'
            }
        },
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
        tblrow:{
            '& .MuiTableCell-root': {
                padding: '16px',
            },
            '& .MuiTableRow-root' : {
                fontSize: '20px',
                backgroundColor: '#ffffff',
                borderRadius: '10px'
            }
        },
        footer: {
            marginTop: '48px',
            backgroundImage: `url(${footer})`,
            height: '245px',
            width: 'auto',
        }
    }))