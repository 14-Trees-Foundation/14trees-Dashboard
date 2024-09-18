import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material"
import { FC, useEffect, useState } from "react"
import { AutocompleteWithPagination } from "../../../components/AutoComplete"
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks"
import * as siteActionCreators from "../../../redux/actions/siteActions";
import { bindActionCreators } from "@reduxjs/toolkit";
import { Site } from "../../../types/site";

interface UpdateCoordsProps {
    visible: boolean
    handleClose: () => void
    updateCoords: (siteId: number, file: File) => void
}

const UpdateCoords: FC<UpdateCoordsProps> = ({ visible, handleClose, updateCoords }) => {

    const dispatch = useAppDispatch();
    const { getSites } = bindActionCreators(siteActionCreators, dispatch);

    const [sitePage, setSitePage] = useState(0);
    const [sitesLoading, setSitesLoading] = useState(false);
    const [siteNameInput, setSiteNameInput] = useState("");
    const [selectedSite, setSelectedSite] = useState<Site | null>(null);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        getSitesData();
    }, [sitePage, siteNameInput]);

    const getSitesData = async () => {
        const siteNameFilter = {
            columnField: "name_english",
            value: siteNameInput,
            operatorValue: "contains",
        };

        setSitesLoading(true);
        getSites(sitePage * 10, 10, [siteNameFilter]);
        setTimeout(async () => {
            setSitesLoading(false);
        }, 1000);
    };

    let sitesList: Site[] = [];
    const siteData = useAppSelector((state) => state.sitesData);
    if (siteData) {
        sitesList = Object.values(siteData.sites);
        sitesList = sitesList.sort((a, b) => {
            return b.id - a.id;
        });
    }

    const handleSubmit = () => {
        if (selectedSite && file) {
            updateCoords(selectedSite.id, file);
            handleClose();
        }    
    }

    return (
        <Dialog open={visible} onClose={handleClose} >
            <DialogTitle>Update coordinates using site kml file</DialogTitle>
            <DialogContent sx={{ width: 500 }}>
                <DialogContentText>
                    Upload the site kml file.
                </DialogContentText>
                <div style={{ width: 500, marginBottom: 10}}>
                    <TextField
                        type="file"
                        inputProps={{ accept: '.kml' }}
                        onChange={(e: any) => {
                            if (e.target.files) {
                                setFile(e.target.files[0]);
                            }
                        }}
                        fullWidth
                        margin="dense"
                    />
                </div>
                <DialogContentText>
                    Select the site for uploaded kml file.
                </DialogContentText>
                <div style={{ width: 500 }}>
                    <AutocompleteWithPagination
                        label="Select a Site"
                        options={sitesList}
                        getOptionLabel={(option) => option?.name_english || ''}
                        onChange={(event, newValue) => {
                            setSelectedSite(newValue);
                        }}
                        onInputChange={(event) => {
                            const { value } = event.target;
                            setSitePage(0);
                            setSiteNameInput(value);
                        }}
                        setPage={setSitePage}
                        fullWidth
                        size="medium"
                        loading={sitesLoading}
                        value={(siteNameInput === '' && selectedSite) ? selectedSite : null}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    color="error"
                    variant="outlined"
                    onClick={handleClose}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    color="success"
                    variant="contained"
                    autoFocus
                    disabled={selectedSite === null || file === null}
                >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default UpdateCoords;