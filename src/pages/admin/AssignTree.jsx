import { useState } from 'react';
import { Col } from "react-bootstrap";
import { createStyles, makeStyles } from '@mui/styles';
import { Paper, Typography, Grid, TextField, Button, Card, CardContent, CardMedia, Alert } from "@mui/material";
import { Field, Form } from "react-final-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Spinner } from "../../stories/Spinner/Spinner";
import Axios from "../../api/local";
import tree from "../../assets/dark_logo.png";

const intitialFValues = {
    name: '',
    email: '',
    saplingid: '',
    uploaded: false,
    loading: false,
    backdropOpen: false
}

export const AssignTree = () => {
    const classes = useStyles();
    const [values, setValues] = useState(intitialFValues);

    const formSubmit = async (formValues) => {
        setValues({
            ...values,
            loading: true,
            backdropOpen: true
        })
        const params = JSON.stringify({
            "name": formValues.name,
            "email": formValues.email,
            "sapling_id": formValues.saplingid
        });

        try {
            let res = await Axios.post('/mytrees/assign', params, {
                headers: {
                    'Content-type': 'application/json'
                },
            })

            if (res.status === 201) {
                setValues({
                    ...values,
                    loading: false,
                    uploaded: true,
                })
                toast.success("Data uploaded successfully!")
            } else if (res.status === 204 || res.status === 400 || res.status === 409 || res.status === 404) {
                setValues({
                    ...values,
                    loading: false,
                    backdropOpen: false
                })
                toast.error(res.status.error)
            }
        } catch (error) {
            console.log(error.response.data)
            if (error.response.status === 409 || error.response.status === 404 || error.response.status === 400 || error.response.status === 500) {
                setValues({
                    ...values,
                    loading: false,
                    backdropOpen: false
                })
                toast.error("hey")
            }
        }
    }

    if (values.loading) {
        return <Spinner />
    } else {
        if (values.uploaded) {
            return (
                <div style={{maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto'}}>
                    <div className={classes.infobox}>
                        <p className={classes.infodesc}>Trees are assigned!</p>
                    </div>
                    <div className={classes.sucessbox}>
                        <Card className={classes.maincard}>
                            <CardContent style={{ 'marginTop': '1%' }}>
                                <Alert severity="success">
                                    Your data has been uploaded successfuly!
                                </Alert>
                                <CardMedia
                                    className={classes.media}
                                    image={tree}
                                    title="tree"
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )
        } else {
            return (
                <>
                    <Col className={classes.left} lg={3} md={2} sm={12}></Col>
                    <Col className={classes.center} lg={6} md={8} sm={12}>
                        <Paper sx={{
                            m:2,
                            p:2,
                            minWidth: '350px',
                        }}
                        variant="elevation"
                        elevation={2}>
                            <Typography variant="h5" align="center">
                                Assign trees for donation
                            </Typography>
                            <ToastContainer/>
                            <Form
                                onSubmit = {formSubmit}
                                validate = {(values) => {
                                const errors = {};
                                if(!values.name){
                                    errors.name = "Name required.";
                                }
                                if(!values.email){
                                    errors.email = "Email required.";
                                }
                                if(!values.saplingid){
                                    errors.saplingid = "Sapling ID is a required field.";
                                }
                                return errors;
                                }}
                                render={({ handleSubmit, form, submitting, pristine }) => (
                                    <form onSubmit={handleSubmit} className={classes.root} autoComplete='off'>
                                        <Grid container sx={{p:2}}>
                                            <Grid sx={{m:2}} item xs={12}>
                                                <Field name="name">
                                                {({ input, meta }) => (
                                                    <TextField
                                                        fullWidth
                                                        error={meta.error && meta.touched ? true : false}
                                                        {...input}
                                                        variant='outlined'
                                                        label='Full Name *'
                                                        name='name'
                                                        helperText={meta.error && meta.touched ? meta.error : ""}
                                                    />
                                                    )}
                                                </Field>
                                            </Grid>
                                            <Grid item sx={{m:2}} xs={12}>
                                                <Field name="email">
                                                    {({ input, meta }) => (
                                                        <TextField
                                                            fullWidth
                                                            variant='outlined'
                                                            label='Email *'
                                                            name='email'
                                                            error={meta.error && meta.touched ? true : false}
                                                            {...input}
                                                            helperText={meta.error && meta.touched ? meta.error : ""}
                                                        />
                                                        )}
                                                </Field>
                                            </Grid>
                                            <Grid item sx={{m:2}} xs={12}>
                                                <Field name="saplingid">
                                                    {({ input, meta }) => (
                                                        <TextField
                                                            fullWidth
                                                            variant='outlined'
                                                            label='Sapling ID *'
                                                            name='saplingid'
                                                            error={meta.error && meta.touched ? true : false}
                                                            {...input}
                                                            helperText={meta.error && meta.touched ? meta.error : ""}
                                                        />
                                                        )}
                                                </Field>
                                            </Grid>
                                            {
                                                <Button
                                                    sx={{m:2}}
                                                    size='large'
                                                    variant="contained"
                                                    color='primary'
                                                    disabled={submitting || pristine}
                                                    type="submit">
                                                        Submit
                                                </Button>
                                            }
                                        </Grid>
                                    </form>
                                )}
                            />
                        </Paper>
                    </Col>
                    <Col className={classes.right} lg={3} md={2} sm={12}></Col>
                </>
            )
        }
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