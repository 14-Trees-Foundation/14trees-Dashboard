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
                <DialogTitle>Add Bulk User</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <FormControl>
                            {/* <InputLabel htmlFor="file">Upload File</InputLabel> */}
                            <Input type="file" id="file" onChange={handleFileChange} />
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit" color="primary">
                            Submit
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}

export default AddBulkUser;