import React, { useEffect, useState } from 'react'
import {
    Autocomplete,
    Button,
    Grid,
    Modal,
    TextField,
    Typography,
} from "@mui/material";
import CoordinatesInput from '../../../../components/CoordinatesInput';
import { Box } from '@mui/system';
import { AutocompleteWithPagination } from "../../../../components/AutoComplete";
import * as siteActionCreators from "../../../../redux/actions/siteActions";
import { useAppSelector, useAppDispatch } from "../../../../redux/store/hooks";
import { bindActionCreators } from "redux";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 300,
    maxWidth: 600,
    minHeight: 450,
    maxHeight: 600,
    overflow: 'auto',
    scrollbarWidth: 'thin',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    borderRadius: '10px',
    p: 4,
};

function EditPond({ row, openEditModal, handleClose, editSubmit }) {

    const dispatch = useAppDispatch();
    const { getSites } = bindActionCreators(siteActionCreators, dispatch);

    const [sitePage, setSitePage] = useState(0);
    const [siteNameInput, setSiteNameInput] = useState("");

    const coords = row.boundaries?.coordinates[0];
    let coordsList = []
    if (coords && coords.length > 0) {
        coords.map(coord => {
            coordsList.push({ lat: coord[1], lng: coord[0] })
        })
    }
    const [formData, setFormData] = useState(row);
    const [coordinates, setCoordinates] = useState(coordsList);

    useEffect(() => {
        getSitesData();
    }, [sitePage, siteNameInput]);

    const getSitesData = async () => {
        const siteNameFilter = {
            columnField: "name_english",
            value: siteNameInput,
            operatorValue: "contains",
        };

        setTimeout(async () => {
            await getSites(sitePage * 10, 10, [siteNameFilter]);
        }, 1000);
    };

    let sitesList = [];
    let sitesMap = {};
    const siteData = useAppSelector((state) => state.sitesData);

    if (siteData) {
        sitesMap = {...siteData.sites};
        if (!Object.hasOwn(sitesMap, formData.site_id)) {
            sitesMap[formData.site_id] = { id: formData.site_id, name_english: formData.site_name}
        }
        sitesList = Object.values(sitesMap);
        sitesList = sitesList.sort((a, b) => {
            return b.id - a.id;
        });
    }

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleEditSubmit = (event) => {
        event.preventDefault();
        const boundaries = {
            type: 'Polygon',
            coordinates: [coordinates.map(coord => [coord.lng, coord.lat])]
        }
        editSubmit({
            ...formData,
            boundaries
        });
        handleClose();
    };

    const typesList = [
        "Storage",
        "Percolation",
    ]

    return (
        <div>
            <Modal
                open={openEditModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }} variant="h5" component="h2">
                        Edit Pond
                    </Typography>
                    <form onSubmit={handleEditSubmit}>
                        <Grid container rowSpacing={2} columnSpacing={1} >
                            <Grid item xs={12}>
                                <TextField name="name" label="Name" value={formData.name} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    fullWidth
                                    name="type"
                                    disablePortal
                                    options={typesList}
                                    value={formData.type ? formData.type : undefined}
                                    renderInput={(params) => <TextField {...params} margin="dense" label="Type" />}
                                    onChange={(event, value) => { if (value !== '') setFormData(prevState => ({ ...prevState, 'type': value })) }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <AutocompleteWithPagination
                                    name="site"
                                    label="Select a Site"
                                    options={sitesList}
                                    getOptionLabel={(option) => option.name_english}
                                    isOptionEqualToValue={(option, value) => {
                                        return option.id === value.id;
                                    }}
                                    onChange={(event, newValue) => {
                                        if (newValue !== null) {
                                            setFormData((prevState) => {
                                                return { ...prevState, ["site_id"]: newValue.id };
                                            });
                                        }
                                    }}
                                    onInputChange={(event) => {
                                        const { value } = event.target;
                                        setSitePage(0);
                                        setSiteNameInput(value);
                                        handleChange(event);
                                    }}
                                    setPage={setSitePage}
                                    fullWidth={true}
                                    size="medium"
                                    value={ (siteNameInput === '' && Object.hasOwn(sitesMap, formData.site_id)) ? sitesMap[formData.site_id] : null}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="length_ft" label="Length in Ft" value={formData.length_ft} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="width_ft" label="Width in Ft" value={formData.width_ft} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="depth_ft" label="Depth in Ft" value={formData.depth_ft} onChange={handleChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <CoordinatesInput
                                    coordinates={coordinates}
                                    onChange={setCoordinates}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', }}>
                                <Button variant='outlined' color='error' onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button variant='contained' sx={{ marginLeft: '10px' }} color='success' type="submit">Submit</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>
        </div>
    )
}

export default EditPond