import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Input } from '@mui/material';

function AddBulkUser({ open, handleClose, createBulkUsers }) {

    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        createBulkUsers(file);
        handleClose();
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Download sample file from <a href="https://docs.google.com/spreadsheets/d/1ypVdbR44nQXuaHAEOrwywY3k-lfJdsRZ9iKp0Jpq7Kw/edit?usp=sharing">here</a> and fill the details.</DialogTitle>
                
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <InputLabel htmlFor="file">CSV File</InputLabel>
                        <FormControl>
                            <Input type="file" id="file" accept=".csv" onChange={handleFileChange} />
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button variant='outlined' color="error" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant='contained' type="submit" color="success">
                            Submit
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}

export default AddBulkUser;