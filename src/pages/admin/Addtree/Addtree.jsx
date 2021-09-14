import { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@mui/material/Backdrop';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Paper, Typography, Avatar } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Alert } from '@material-ui/lab';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import bg from "../../../assets/bg.png";
import tree from "../../../assets/dark_logo.png";
import { Spinner } from "../../../stories/Spinner/Spinner";

import Axios from "../../../api/local";

import Button from '@mui/material/Button';

const intitialFValues = {
    treename: '',
    sapling: '',
    images: null,
    image: null,
    imagesrc: null,
    uimageerror: null,
    uploaded: false,
}

export const AddTree = () => {

    const [values, setValues] = useState(intitialFValues);
    const [errors, setErrors] = useState({});
    const classes = UseStyle();

    const validate = () => {
        let temp = {};
        temp.treename = values.treename ? "" : "Required Field"
        temp.sapling = values.sapling ? "" : "Required Field"
        setErrors({
            ...temp
        })
        return Object.values(temp).every(x => x === "")
    }

    const handleInputchange = (e) => {
        const { name, value } = e.target
        validate();
        setValues({
            ...values,
            [name]:value
        })
    }

    const handlePicUpload = (e) => {
        if (Array.from(e.target.files).length > 1) {
            setValues({
                ...values,
                uimageerror:true
            })
            return
        }
        setValues({
            ...values,
            images: e.target.files,
            image: e.target.files[0] ? e.target.files[0] : null,
            imagesrc: e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : null,
            uimageerror: null
        })
    }

    const onSubmit = async (e) => {
        if(!validate()){
            toast.error('Please fill mandatory fields', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            setValues({
                ...values,
                loading:true,
                backdropOpen:true
            })
            const formData = new FormData();
            formData.append('name', values.treename)
            formData.append('sapling', values.sapling);

            if (values.image) {
                formData.append('image', values.image)
                formData.append('imagename', values.image.name)
            }
            let res = await Axios.post('/api/v1/upload/tree', formData, {
                headers: {
                    'Content-type': 'multipart/form-data'
                },
            })
            
            if(res.status === 200) {
                setValues({
                    ...values,
                    loading: false,
                    uploaded: true,
                })
                toast.success("Data uploaded successfully!")
            } else if(res.status === 204) {
                setValues({
                    ...values,
                    loading: false,
                    uploaded: false,
                })
                toast.error(res.statusText)
            } else if(res.status === 409){
                setValues({
                    ...values,
                    loading: false,
                    uploaded: false,
                })
                toast.error(res.response.statusText)
            }
        }
    }

    if(values.uploaded){
        return(
            <div className={classes.box}>
                <img alt="bg" src={bg} className={classes.bgimg}/>
                <div className={classes.bg}>
                    <div className={classes.infobox}>
                        <p className={classes.infodesc}>Tree Data Saved</p>
                    </div>
                    <div className={classes.sucessbox}>
                        <Card className={classes.maincard}>
                            <CardContent style={{'marginTop':'1%'}}>
                                <Alert severity="success">
                                    Your data has been uploaded successfuly!
                                </Alert>
                                <CardMedia
                                    className={classes.media}
                                    image= {tree}
                                    title="tree"
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className={classes.box}>
                <img alt="bg" src={bg} className={classes.bgimg}/>
                <div className={classes.bg}>
                    <div className={classes.infobox}>
                        <p className={classes.infodesc}>Fill tree information</p>
                    </div>
                    <div className={classes.inputbox}>
                        <Paper className={classes.paper}>
                            <Backdrop className={classes.backdrop} open={values.backdropOpen}>  
                                <Spinner text={"Sending your data..."}/>
                            </Backdrop>
                            <ToastContainer />
                            <h1 className={classes.formheader}>Tree information</h1>
                            <form className={classes.root} autoComplete='off'>
                                <Grid container>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <TextField
                                            error={errors.treename!==""?true:false}
                                            variant='outlined'
                                            label='Tree Name *'
                                            name='treename'
                                            value={values.treename}
                                            helperText="Tree Name"
                                            onChange = {handleInputchange}
                                        />
                                        <TextField
                                            error={errors.sapling!==""?true:false}
                                            variant='outlined'
                                            label='Sapling ID *'
                                            name='sapling'
                                            value={values.sapling}
                                            helperText="Spaling ID"
                                            onChange = {handleInputchange}
                                        />
                                        <div style={{'marginTop':'20px'}}>
                                            <Typography variant="subtitle2" gutterBottom className={classes.helper}>
                                                Upload the sapling image.
                                            </Typography>
                                            <input
                                                accept="image/*"
                                                className={classes.input}
                                                id="contained-button-file"
                                                multiple
                                                type="file"
                                                onChange={handlePicUpload}
                                            />
                                        </div>
                                        <div className={classes.submitDiv}>
                                                <Avatar alt="U" src={values.imagesrc? values.imagesrc : null}/>
                                                <span className={classes.span}></span>
                                                <label htmlFor="contained-button-file" style={{'display':'block'}}>
                                                    <Button component="span" variant="contained" color='secondary' size='small'>
                                                    Upload
                                                    </Button>
                                                </label>
                                            </div>
                                    </Grid>
                                        {
                                            !values.uimageerror && !values.addimageerror &&
                                            <div className={classes.submitbtn}>
                                                <Button size='large' variant="contained" color='primary' onClick={onSubmit}>Submit</Button>
                                            </div>
                                        }
                                </Grid>
                            </form>
                        </Paper>
                    </div>
                </div>
            </div>
        )
    }
}

const UseStyle = makeStyles((theme) => ({
    root: {
        '& .MuiFormControl-root':{
            width: '90%',
            margin: theme.spacing(1),
        },
        [theme.breakpoints.down('md')]:{
            '& .MuiFormControl-root':{
                width: '93%',
                margin: '12px',
            },
        }
    },
    maincard: {
        width: "50%",
        marginLeft: "auto",
        marginRight: "auto",
        [theme.breakpoints.down('md')]:{
            width: "90%",
            padding: '0px',
        }
    },
    media: {
        width: '30%',
        height: '330px',
        marginLeft:"auto",
        marginRight:"auto",
        [theme.breakpoints.down('md')]:{
            width: '90%',
        }
    },
    box: {
        marginTop: '65px',
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    bgimg: {
        width: '100vw',
        height: '40vh',
        objectFit: 'cover',
    },
    bg: {
        overflow: "auto",
        "&::-webkit-scrollbar" : {
            display: "none",
        },
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
        "background": "linear-gradient(rgba(31, 54, 37, 0) 5%,rgba(31, 54, 37, 0.636721) 15%, #1F3625 40%, #e5e5e5 40%)",
    },
    infobox: {
        marginTop: '5%',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        [theme.breakpoints.down('md')]:{
            flexWrap: 'wrap',
        }
    },
    infodesc: {
        fontSize: '30px',
        paddingLeft: '1%',
        color: '#ffffff',
        fontWeight: '600',
        alignItems: 'center',
        textAlign: 'center',
        [theme.breakpoints.down('md')]:{
            fontSize: '20px',
        }
    },
    formheader: {
        paddingLeft: '1%',
        [theme.breakpoints.down('md')]:{
            paddingLeft: "5%",
            paddingTop: '5%',
        }
    },
    inputbox:{
        width: '55vw',
        paddingLeft: '22.5%',
        height: '90vh',
        position: 'relative',
        [theme.breakpoints.down('md')]:{
            width: '90vw',
            paddingLeft: '4vw',
        }
    },
    paper: {
        margin: theme.spacing(5),
        padding: theme.spacing(3),
        [theme.breakpoints.down('md')]:{
            margin: theme.spacing(0),
            padding: '0px',
        }
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
    },
    submitDiv:{
        display:'flex',
        // marginLeft:'30px',
        flexDirection: 'row',
        marginTop:'10px',
        marginLeft: '10px',
        [theme.breakpoints.down('md')]:{
            marginLeft: '6%',
            marginBottom: '10px',
        }
    },
    span: {
        flexGrow: "0.89",
    },
    input: {
        display: 'none',
    },
    helper: {
        width:'90%',
        paddingLeft: '1%',
        textAlign: "left",
        [theme.breakpoints.down('md')]:{
            paddingLeft: '5%',
        }
    },
    submitbtn: {
        paddingTop: '20px',
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: '10px',
        display: "block"
    }
}));