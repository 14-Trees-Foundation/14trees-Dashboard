import { useState } from 'react';

import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment';

import { Alert, AlertTitle } from '@material-ui/lab';
import Backdrop from '@material-ui/core/Backdrop';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Button, Paper, Typography, Avatar } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';

import bg from "../../assets/bg.png";
import tree from "../../assets/dark_logo.png";
import { Spinner } from "../../stories/Spinner/Spinner";

import Axios from "../../api/local";

const intitialFValues = {
    sapling: '',
    name: '',
    org: '',
    dob: new Date(),
    email: '',
    contact: '',
    userImages: [],
    userImage1: null,
    userImage2: null,
    uimageerror:null,
    additionalImages: [],
    userImage1src:null,
    userImage2src:null,
    addImage1src:null,
    addImage2src:null,
    addImage3src:null,
    addimageerror:null,
    uploaded:true,
    loading:false,
    backdropOpen:false,
}

export const Visitor = () => {
    const [values, setValues] = useState(intitialFValues);
    const [errors, setErrors] = useState({});
    const PROFILE_IMG_MAX=2;
    const ADDITIONAL_IMG_MAX=10;
    const delay = ms => new Promise(res => setTimeout(res, ms));

    const classes = UseStyle();

    const reset = () => {
        setValues(intitialFValues)
        setErrors({}) 
    }

    const validate = () => {
        let temp = {};
        temp.name = values.name ? "" : "Required Field"
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

    const handleDateChange = (value) => {
        setValues({
            ...values,
            date:value
        });
      };
    
    const handleClose = () => {
        if (!values.loading) {
            setValues({
                ...values,
                backdropOpen:false,
            })
        };
        }
    
    const handleAdditionalPicUpload = (e) => {
        if (Array.from(e.target.files).length > ADDITIONAL_IMG_MAX) {
            setValues({
                ...values,
                addimageerror:true
            })
            return
          }
        setValues({
            ...values,
            additionalImages:e.target.files,
            addImage1src:URL.createObjectURL(e.target.files[0]),
            addImage2src:e.target.files[1] ? URL.createObjectURL(e.target.files[1]) : null,
            addImage3src:e.target.files[2] ? URL.createObjectURL(e.target.files[2]) : null,
            addimageerror:null
        })
    }

    const handleProfilePicUpload = (e) => {
        if (Array.from(e.target.files).length > PROFILE_IMG_MAX) {
            setValues({
                ...values,
                uimageerror:true
            })
            return
          }
        setValues({
            ...values,
            userImages:e.target.files,
            userImage1:e.target.files[0] ? e.target.files[0] : null,
            userImage2:e.target.files[1] ? e.target.files[1] : null,
            userImage1src:e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : null,
            userImage2src:e.target.files[1] ? URL.createObjectURL(e.target.files[1]) : null,
            uimageerror:null
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
            const formData = new FormData()
            const date = moment(values.dob).format('YYYY-MM-DD')
            formData.append('name', values.name)
            formData.append('email', values.email);
            formData.append('org', values.org);
            formData.append('dob', date);
            formData.append('contact', values.contact);
            formData.append('sapling', values.sapling);
            const userImages = [];
            const extraImages = [];
            if (values.userImages) {
                for (const key of Object.keys(values.userImages)) {
                    formData.append('userImages', values.userImages[key])
                    userImages.push(values.userImages[key].name)
                }
            }
            
            if (values.additionalImages) {
                for (const key of Object.keys(values.additionalImages)) {
                    formData.append('userImages', values.additionalImages[key])
                    extraImages.push(values.additionalImages[key].name)
                }
            }
            
            formData.append('userImages', userImages);
            formData.append('extraImages', extraImages);
            let res = await Axios.post('/api/v1/visitor/form', formData, {
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
                toast.error(res.statusText)
            } else if(res.status === 409){
                toast.error(res.response.statusText)
            }
        }
        // await delay(2000);
        setValues({
            ...values,
            loading:false,
            backdropOpen:false
        })
    }
    if(values.uploaded){
        return(
            <div className={classes.box}>
                <img alt="bg" src={bg} className={classes.bgimg}/>
                <div className={classes.bg}>
                    <div className={classes.infobox}>
                        <h1 className={classes.infoheader}>Thank You!</h1>
                        <p className={classes.infodesc}>We have saved your data!</p>
                    </div>
                    <div className={classes.sucessbox}>
                        <Card className={classes.maincard}>
                            <CardContent style={{'marginTop':'1%'}}>
                                <Alert severity="success">
                                    Your data has been uploaded successfuly!
                                </Alert>
                                {/* <Typography variant="h5" component="h2" style={{'marginBottom':'10px'}}>
                                    Form Submitted
                                </Typography> */}
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
                        <h1 className={classes.infoheader}>Thank You!</h1>
                        <p className={classes.infodesc}>We need some details to get you on-boarded for this journey!</p>
                    </div>
                    <div className={classes.inputbox}>
                        <Paper className={classes.paper}>
                            <Backdrop className={classes.backdrop} open={values.backdropOpen} onClick={handleClose}>  
                                <Spinner text={"Sending your data..."}/>
                            </Backdrop>
                            <ToastContainer />
                            {values.uimageerror &&  
                                <Alert severity="error">
                                    <AlertTitle>Error</AlertTitle>
                                    Please select at max two profile images only
                                </Alert>
                            }
                            {values.addimageerror &&  
                                <Alert severity="error">
                                    <AlertTitle>Error</AlertTitle>
                                    Please select at max 10 additional images only
                                </Alert>
                            }
                            <h1 className={classes.formheader}>Visitor Form</h1>
                            <form className={classes.root} autoComplete='off'>
                                <Grid container>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <TextField
                                            error={errors.name!==""?true:false}
                                            variant='outlined'
                                            label='Full Name *'
                                            name='name'
                                            value={values.name}
                                            helperText="The name you want to be displayed on the physical name plate."
                                            onChange = {handleInputchange}
                                        />
                                        <TextField
                                            variant='outlined'
                                            label='Email'
                                            name='email'
                                            value={values.email}
                                            onChange = {handleInputchange}
                                        />
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <KeyboardDatePicker
                                                margin="normal"
                                                id="date-picker-dialog"
                                                label="Date of birth"
                                                format="MM/dd/yyyy"
                                                value={values.date}
                                                onChange={handleDateChange}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                                style={{'marginTop':'15px'}}
                                            />
                                        </MuiPickersUtilsProvider>
                                        <div style={{'marginTop':'20px'}}>
                                            <Typography variant="subtitle2" gutterBottom className={classes.helper}>
                                                Upload two photographs of yours with sapling.
                                            </Typography>
                                            <input
                                                accept="image/*"
                                                className={classes.input}
                                                id="contained-button-file"
                                                multiple
                                                type="file"
                                                onChange={handleProfilePicUpload}
                                            />
                                        </div>
                                        <div className={classes.submitDiv}>
                                            <Avatar alt="U" src={values.userImage1src? values.userImage1src : null}/>
                                            <Avatar alt="U" src={values.userImage2src? values.userImage2src : null} />
                                            <span className={classes.span}></span>
                                            <label htmlFor="contained-button-file" style={{'display':'block', 'marginTop':'5px'}}>
                                                
                                                <Button variant="contained" component="span" color='primary' size='small' className={classes.imgbtn}>
                                                Upload your pic
                                                </Button>
                                            </label>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <TextField
                                            error={errors.sapling!==""?true:false}
                                            variant='outlined'
                                            label='Sapling ID *'
                                            name='sapling'
                                            value={values.sapling}
                                            helperText="The unique number you received from 14Trees staff."
                                            onChange = {handleInputchange}
                                        />
                                        <TextField
                                            variant='outlined'
                                            label='Organization'
                                            name='org'
                                            value={values.org}
                                            onChange = {handleInputchange}
                                        />
                                        <TextField
                                            variant='outlined'
                                            label='Contact'
                                            name='contact'
                                            value={values.contact}
                                            onChange = {handleInputchange}
                                        />
                                        <div style={{'marginTop':'15px'}}>
                                            <Typography variant="subtitle2" gutterBottom className={classes.helper}>
                                                Feel free to share the photographs from your visit (max: 10)
                                            </Typography>
                                            <input
                                                accept="image/*"
                                                className={classes.input}
                                                id="additional-image-file"
                                                multiple
                                                type="file"
                                                onChange={handleAdditionalPicUpload}
                                            />
                                        </div>
                                        <div className={classes.submitDiv}>
                                            <Avatar alt="U" src={values.addImage1src? values.addImage1src : null}/>
                                            <Avatar alt="U" src={values.addImage2src? values.addImage2src : null}/>
                                            <Avatar alt="U" src={values.addImage3src? values.addImage3src : null}/>
                                            <span className={classes.span}></span>
                                            <label htmlFor="additional-image-file" style={{'display':'block', 'marginTop':'5px'}}>
                                                <Button variant="contained" component="span" color='primary' size='small' className={classes.imgbtn}>
                                                Add more pics
                                                </Button>
                                            </label>
                                        </div>
                                    </Grid>
                                        {
                                            !values.uimageerror && !values.addimageerror &&
                                            <Button size='large' className={classes.submitbtn} variant="contained" component="span" color='secondary' onClick={onSubmit}>Submit</Button>
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
    successbox: {
        width: '60vw',
        paddingLeft: '12.5%',
        height: '90vh',
        position: 'relative',
        [theme.breakpoints.down('md')]:{
            width: '90vw',
            paddingLeft: '0',
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
        height: '350px',
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
    infoheader: {
        fontSize: '55px',
        color: '#9BC53D',
        fontWeight: '550',
        [theme.breakpoints.down('md')]:{
            fontSize: '50px',
        }
    },
    infodesc: {
        fontSize: '22px',
        paddingLeft: '1%',
        color: '#ffffff',
        fontWeight: '500',
        alignItems: 'center',
        textAlign: 'center',
        [theme.breakpoints.down('md')]:{
            fontSize: '15px',
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
        width: '75vw',
        paddingLeft: '12.5%',
        height: '90vh',
        position: 'relative',
        // overflowY: "scroll",
        // overflowX: "hidden",
        // "&::-webkit-scrollbar" : {
        //     display: "none",
        // },
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
        [theme.breakpoints.down('md')]:{
            marginLeft: '6%',
            marginBottom: '10px',
        }
    },
    span: {
        flexGrow: "0.85",
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
            textAlign: "center",
        }
    },
    images:{
        display:'flex',
        justifyContent:'center'
    },
    submitbtn: {
        marginTop: '20px',
        marginLeft: "auto",
        marginRight: "auto",
        display: "block"
    }
}));