import { useState } from 'react';
import { createStyles, makeStyles } from '@mui/styles';
import { Alert, Backdrop, Button, Card, CardContent, CardMedia, Grid, Paper, TextField } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from '../../../../components/Spinner';
import tree from "../../../../assets/dark_logo.png";
import Axios from "../../../../api/local";

const intitialFValues = {
    plotname: '',
    shortname: '',
    loading: false,
    uploaded: false,
    backdropOpen: false
}

export const AddPlot = () => {
    const classes = UseStyle();
    const [values, setValues] = useState(intitialFValues);
    const [errors, setErrors] = useState({});

    const validate = () => {
        let temp = {};
        temp.plotname = values.plotname ? "" : "Required Field"
        temp.shortname = values.shortname ? "" : "Required Field"
        setErrors({
            ...temp
        })
        return Object.values(temp).every(x => x === "")
    }

    const handlePlotnameChange = (e) => {
        validate();
        setValues({
            ...values,
            plotname: e.target.value
        })
    }

    const onSubmit = async (e) => {
        if (!validate()) {
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
                loading: true,
                backdropOpen: true
            })
            const params = JSON.stringify({
                "sapling_id": values.saplingId,
                "tree_id": values.selectedTreetype.tree_id,
                "plot_id": values.selectedPlot.plot_id
            });

            try {
                let res = await Axios.post('/trees/addtree', params, {
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
                }
            } catch (error) {
                if (error.response.status === 500) {
                    setValues({
                        ...values,
                        loading: false,
                        uploaded: false,
                    })
                    toast.error(error.response.data.error)
                } else if (error.response.status === 409) {
                    setValues({
                        ...values,
                        loading: false,
                        uploaded: false,
                    })
                    toast.error(error.response.data.error)
                }
            }
        }
    }

    if (values.loading) {
        return <Spinner />
    } else {
        if (values.uploaded) {
            return (
                <>
                    <div className={classes.infobox}>
                        <p className={classes.infodesc}>Plot Data Saved</p>
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
                </>
            )
        } else {
            return (
                <div className={classes.inputbox}>
                    <Paper className={classes.paper}>
                        <Backdrop className={classes.backdrop} open={values.backdropOpen}>
                            <Spinner text={"Sending your data..."} />
                        </Backdrop>
                        <ToastContainer />
                        <h1 className={classes.formheader}>Add Plot</h1>
                        <form className={classes.root} autoComplete='off'>
                            <Grid container>
                                <Grid item xs={12} sm={12} md={12}>
                                    <TextField
                                        error={errors.plotname !== "" ? true : false}
                                        variant='outlined'
                                        label='Plot Name *'
                                        name='plotname'
                                        value={values.plotname}
                                        helperText="Plot Name"
                                        onChange={handlePlotnameChange}
                                    />
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
            )
        }
    }
}

const UseStyle = makeStyles((theme) =>
    createStyles({
        root: {
            '& .MuiFormControl-root': {
                width: '90%',
                margin: theme.spacing(1),
            },
            [theme.breakpoints.down('md')]: {
                '& .MuiFormControl-root': {
                    width: '93%',
                    margin: '12px',
                },
            }
        },
        inputbox: {
            maxWidth: '720px',
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        paper: {
            margin: theme.spacing(5),
            padding: theme.spacing(3),
            [theme.breakpoints.down('md')]: {
                margin: theme.spacing(0),
                padding: '0px',
            }
        },
        box: {
            width: '100%',
            height: '100%',
            position: 'relative',
        },
        maincard: {
            width: "50%",
            marginLeft: "auto",
            marginRight: "auto",
            [theme.breakpoints.down('md')]: {
                width: "90%",
                padding: '0px',
            }
        },
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
        },
        formheader: {
            paddingLeft: '1%',
            fontWeight: "500",
            [theme.breakpoints.down('md')]: {
                paddingLeft: "5%",
                paddingTop: '5%',
            }
        },
        submitbtn: {
            paddingTop: '20px',
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: '10px',
            display: "block"
        }
    })
)