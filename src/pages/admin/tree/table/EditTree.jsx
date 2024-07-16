import React, { useEffect, useState } from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Autocomplete,
    DialogTitle,
    TextField,
} from "@mui/material";

import * as plantTypeActionCreators from "../../../../redux/actions/plantTypeActions";
import * as plotActionCreators from "../../../../redux/actions/plotActions";
import { useAppDispatch, useAppSelector } from '../../../../redux/store/hooks';
import { bindActionCreators } from '@reduxjs/toolkit';

function EditTree({ row, openeditModal, handleCloseEditModal, editSubmit }) {

    const dispatch = useAppDispatch();
    const { getPlantTypes } =
        bindActionCreators(plantTypeActionCreators, dispatch);
    const { getPlots } =
        bindActionCreators(plotActionCreators, dispatch);

    const [formData, setFormData] = useState(row);
    const [page, setPage] = useState(0);
    const [plantTypeName, setPlantTypeName] = useState('');
    const [plotName, setPlotName] = useState('');
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => {
            if (name === 'tree_id.name') {
                return { ...prevState, tree_id: { ...prevState.tree_id, name: value } };
            } else if (name.includes('_')) {
                const [parent, child] = name.split('_');
                return { ...prevState, [parent]: { ...prevState[parent], [child]: value } };
            }
            return { ...prevState, [name]: value };
        });
    };

    const handleEditSubmit = (event) => {
        event.preventDefault();
        editSubmit(formData);
        handleCloseEditModal();
    };

    const getPlantTypeData = async () => {
        let nameFilter;
        if (plantTypeName !== "") nameFilter = [{ columnField: "name", value: plantTypeName, operatorValue: "contains" }]
        setTimeout(async () => {
            await getPlantTypes(page*10, 10, nameFilter);
        }, 1000);
    };

    useEffect(() => {
        getPlantTypeData();
    }, [page, plantTypeName]);

    let plantTypesList = [];
    let plantTypesMap = {}
    const plantTypesData = useAppSelector((state) => state.plantTypesData);
    if (plantTypesData) {
        plantTypesMap = { ...plantTypesData.plantTypes }
        if (!Object.hasOwn(plantTypesMap, formData.plant_type_id)) {
            plantTypesMap[formData.plant_type_id] = { id: formData.plant_type_id, name: formData.plant_type}
        }
        plantTypesList = Object.values(plantTypesMap);
    }

    const getPlotData = async () => {
        const nameFilter = { columnField: "name", value: plotName, operatorValue: "contains" }
        setTimeout(async () => {
            await getPlots(page*10, 10, [nameFilter]);
        }, 1000);
    };

    useEffect(() => {
        getPlotData();
    }, [page, plotName]);

    let plotsList = [];
    let plotsMap = {}
    const plotsData = useAppSelector((state) => state.plotsData);
    if (plotsData) {
        plotsMap = { ...plotsData.plots }
        if (!Object.hasOwn(plotsMap, formData.plot_id)) {
            plotsMap[formData.plot_id] = { id: formData.plot_id, name: formData.plot}
        }
        plotsList = Object.values(plotsMap);
    }


    return (
        <Dialog fullWidth open={openeditModal} onClose={handleCloseEditModal}>
            <DialogTitle align="center">Edit Tree</DialogTitle>
            <form onSubmit={handleEditSubmit}>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="sapling_id"
                        label="Sapling ID"
                        type="text"
                        fullWidth
                        value={formData.sapling_id}
                        onChange={handleChange}
                    />
                    <Autocomplete 
                        fullWidth
                        name="plant_type_id"
                        disablePortal
                        options={plantTypesList}
                        renderInput={(params) => <TextField {...params} onChange={(event) => {
                            const { value } = event.target;
                            setPlantTypeName(value);
                        }} margin="dense" label="Plant Type" />}
                        onChange={(event, value) => { if (value !== null) setFormData(prevState => ({ ...prevState, 'plant_type_id': value.id }))}}
                        value={ (plantTypeName === '' && Object.hasOwn(plantTypesMap, formData.plant_type_id)) ? plantTypesMap[formData.plant_type_id] : null}
                        getOptionLabel={(option) => (option.name)}
                    />
                    <Autocomplete 
                        fullWidth
                        name="plot_id"
                        disablePortal
                        options={plotsList}
                        renderInput={(params) => (
                            <TextField {...params} 
                                onChange={(event) => {
                                    const { value } = event.target;
                                    setPlotName(value);
                                }} 
                                margin="dense" 
                                label="Plot" 
                            />
                        )}
                        onChange={(event, value) => { if (value !== null) setFormData(prevState => ({ ...prevState, 'plot_id': value.id }))}}
                        value={ (plotName === '' && Object.hasOwn(plotsMap, formData.plot_id)) ? plotsMap[formData.plot_id] : null }
                        getOptionLabel={(option) => (option.name)}
                    />
                    {/* <TextField
                        autoFocus
                        margin="dense"
                        name="link"
                        label="Event"
                        type="text"
                        fullWidth
                        value={formData.link}
                        onChange={handleChange}
                    />
                    <Autocomplete 
                        fullWidth
                        name="event_type"
                        disablePortal
                        options={eventType}
                        value={formData.event_type ? {id: formData.event_type, label: eventTypeMap[formData.event_type]} : null}
                        renderInput={(params) => <TextField {...params} margin="dense" label="Event Type" />}
                        onChange={(event, value) => { if (value !== null) setFormData(prevState => ({ ...prevState, 'event_type': value.id }))}}
                        getOptionLabel={(option) => option.label}
                    /> */}
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                    <Button variant='contained' onClick={handleCloseEditModal} color="primary">
                        Cancel
                    </Button>
                    <Button variant='contained' type="submit" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default EditTree