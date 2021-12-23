import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import FormControlLabel from '@mui/material/FormControlLabel';
import { AppBar } from "../../stories/AppBar/AppBar";
import bg from "../../assets/bg.png";

import api from '../../api/local';
import { useAuth } from "./context/auth";
import { useNavigate } from 'react-router-dom';
import { createStyles, makeStyles } from '@mui/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Backdrop from '@mui/material/Backdrop';
import { Spinner } from "../../stories/Spinner/Spinner";

export const Login = ({token}) => {
    const classes = UseStyle();
    const paperStyle={padding :20,minHeight:'300px',width:280, margin:"20px auto"}
    const avatarStyle={backgroundColor:'#1bbd7e'}
    const textStyle={margin:'8px auto'}
    const btnstyle={margin:'8px 0'}
    const navigate = useNavigate();

    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [openBackdrop, setBackdropOpen] = useState(false);
    const [isLoggedIn, setLoggedIn] = useState(false);
    const { setAuthTokens } = useAuth();

    const verifyToken = async () => {
        setBackdropOpen(true);
        try {
            let res = await api.post('/login/verifytoken', {}, {
                headers: {
                    'x-access-token': token
                  }
            });
            if (res.status===200){
                setLoggedIn(true);
            }
        } catch (error) {
            setLoggedIn(false);
        }
        toast.success("Already LoggedIn")
        setLoggedIn(true);
    }

    useEffect(() => {
        if (token === null) {
            setLoggedIn(false);
        } else if(token !== null || token !== undefined) {
            verifyToken();
        }
    });

    async function loginUser(username, password) {
        setBackdropOpen(true);
        try {
            const res = await api.post('/login/user', {
                params: {
                    username : username,
                    password: password
                }
            });
            if (res.statusText === 'OK') {
                setBackdropOpen(false);
                setAuthTokens(res.data.token);
                toast.success("Login Successful")
                setLoggedIn(true);
            }
        } catch (error) {
            setBackdropOpen(false);
            toast.error(error.response.data)
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();
        await loginUser(
          username,
          password
        );
    }

    if (isLoggedIn) {
        navigate('/admin');
    }

    return(
        <div className={classes.box}>
            <img alt="bg" src={bg} className={classes.bg} style={{height: '100vh'}}/>
            <div className={classes.overlay} style={{height: '100vh',}}>
                <AppBar />
                <Backdrop className={classes.backdrop} open={openBackdrop}>
                    <Spinner text={"Logging you in..."} />
                </Backdrop>
                <ToastContainer />
                <Grid style={{'marginTop':'10%'}}>
                    <Paper elevation={10} style={paperStyle}>
                        <Grid align='center'>
                            <Avatar style={avatarStyle}><LockOutlinedIcon/></Avatar>
                            <h2>Sign In</h2>
                        </Grid>
                        <TextField
                            style={textStyle}
                            label='Username'
                            placeholder='Enter username'
                            fullWidth
                            required
                            onChange={e => setUserName(e.target.value)}
                        />
                        <TextField
                            style={textStyle}
                            label='Password'
                            placeholder='Enter password'
                            type='password'
                            fullWidth
                            required
                            onChange={e => setPassword(e.target.value)}
                        />
                        <FormControlLabel
                            control={
                            <Checkbox
                                name="checkedB"
                                color="primary"
                            />
                            }
                            label="Remember me"
                        />
                        <Button
                            type='submit'
                            color='primary'
                            variant="contained"
                            style={btnstyle}
                            fullWidth
                            onClick={handleSubmit}
                        >
                            Sign in
                        </Button>
                    </Paper>
                </Grid>
            </div>
        </div>
    )
}

const UseStyle = makeStyles((theme) =>
    createStyles({
        box: {
            width: '100%',
            position: 'relative',
            backgroundColor: '#e5e5e5',
            overflow: 'auto',
            minHeight: '100vh',
        },
        bg: {
            width: '100%',
            objectFit: 'cover',
        },
        overlay: {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            background: 'linear-gradient(358.58deg, #1F3625 37.04%, rgba(31, 54, 37, 0.636721) 104.2%, rgba(31, 54, 37, 0) 140.95%)',
        },
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
        },
    })
)
