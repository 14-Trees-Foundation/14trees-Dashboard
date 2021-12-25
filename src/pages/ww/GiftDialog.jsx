import * as React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Slide,
    Button,
    TextField
} from '@mui/material';
import { Field, Form } from "react-final-form";
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { makeStyles } from '@mui/styles';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const GiftDialog = (props) => {
    const classes = useStyles();
    const { onClose, open, formData } = props;

    const handleClose = () => {
        onClose();
    };

    const formSubmit = (formValues) => {
        onClose();
        formData(formValues);
    }

    return (
        <Dialog
            onClose={handleClose}
            open={open}
            TransitionComponent={Transition}
            keepMounted
            fullWidth
            maxWidth="sm"
        >
        <DialogTitle>
            <div className={classes.title}>
                Gift this tree to your loved ones
            </div>
        </DialogTitle>
        <DialogContent>
            <Form
                onSubmit = {formSubmit}
                validate = {(values) => {
                    const errors = {};
                    if(!values.name){
                        errors.name = "Name is required.";
                    }
                    if(!values.email){
                        errors.email = "Email required.";
                    }
                    if(!values.contact){
                    }
                    if(!values.dob){
                    }
                    return errors;
                }}
                render={({ handleSubmit, form, submitting, pristine }) => (
                    <form onSubmit={handleSubmit} className={classes.root} autoComplete='off'>
                        <Field name="name">
                            {({ input, meta }) => (
                                <TextField
                                    error={meta.error && meta.touched ? true : false}
                                    {...input}
                                    variant='outlined'
                                    label='Full Name *'
                                    name='name'
                                    fullWidth
                                    sx={{mb: 2, mt:1}}
                                    helperText={meta.error && meta.touched ? meta.error : ""}
                                />
                            )}
                        </Field>
                        <Field name="email">
                            {({ input, meta }) => (
                                <TextField
                                    variant='outlined'
                                    label='Email *'
                                    name='email'
                                    fullWidth
                                    error={meta.error && meta.touched ? true : false}
                                    {...input}
                                    sx={{mb: 2}}
                                    helperText={meta.error && meta.touched ? meta.error : ""}
                                />
                            )}
                        </Field>
                        <Field name="contact">
                            {({ input, meta }) => (
                                <TextField
                                    variant='outlined'
                                    label='Contact'
                                    name='contact'
                                    fullWidth
                                    error={meta.error && meta.touched ? true : false}
                                    {...input}
                                    sx={{mb: 2}}
                                    helperText={meta.error && meta.touched ? meta.error : ""}
                                />
                            )}
                        </Field>
                        <Field name="dob">
                            {({ input, meta }) => (
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DesktopDatePicker
                                        label="Date of Birth"
                                        inputFormat="dd/MM/yyyy"
                                        {...input}
                                        error={meta.error && meta.touched ? true : false}
                                        renderInput={(params) => <TextField {...params} fullWidth/>}
                                        style={{ 'marginTop': '15px' }}
                                    />
                                </LocalizationProvider>
                            )}
                        </Field>
                        <div className={classes.actions}>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={submitting || pristine}
                                type="submit"
                            >
                                Gift
                            </Button>
                        </div>
                    </form>
                )}
            />
        </DialogContent>
    </Dialog>
    )
}

const useStyles = makeStyles((theme) => ({
    title: {
        fontSize: '23px',
        fontWeight: '400',
        color: '#312F30',
        textAlign: 'center',
        margin: theme.spacing(4)
    },
    formtitle: {
        color: '#312F30',
        fontSize: '14px',
        fontWeight: '600',
        lineHeight: '20px',
        paddingBottom: theme.spacing(1),
        paddingTop: theme.spacing(1)
    },
    actions:{
        '& .MuiDialogActions-root': {
            display: 'block',
            paddingBottom: theme.spacing(3)
        },
        display: 'flex',
        justifyContent: 'center',
        padding: theme.spacing(3),
        paddingLeft: theme.spacing(4),
        '& .MuiButton-root': {
            minWidth: '100%',
            maxWidth: '100%',
            minHeight: '6vh'
        }
    }
}))