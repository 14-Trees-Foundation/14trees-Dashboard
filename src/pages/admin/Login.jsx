import React, { useState } from 'react'
import { Grid,Paper, Avatar, TextField, Button} from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import api from '../../api/local';
import { useAuth } from "../context/auth";
import { Redirect } from "react-router-dom";
import styled from 'styled-components';

const Error = styled.div`
  background-color: red;
`;


export default function Login(props){
    const paperStyle={padding :20,minHeight:'300px',width:280, margin:"20px auto"}
    const avatarStyle={backgroundColor:'#1bbd7e'}
    const textStyle={margin:'8px auto'}
    const btnstyle={margin:'8px 0'}

    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isError, setIsError] = useState(false);
    const { setAuthTokens } = useAuth();
    let referer;
    if (props.location.state === undefined){
        referer = '/';
    } else {
        referer = props.location.state.referer || '/';
    }

    async function loginUser(username, password) {
        const res = await api.post('/api/v1/login/user', {
            params: { 
                username : username,
                password: password
            }
        });
        if (res.statusText === 'OK') {
            setAuthTokens(res.data.token);
            setLoggedIn(true);
        } else {
            setIsError(true);
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
        return <Redirect to={referer} />;
    }
    
    return(
        <Grid style={{'marginTop':'5%'}}>
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
                { isError &&<Error>The username or password provided were incorrect!</Error> }
            </Paper>
        </Grid>
    )
}
