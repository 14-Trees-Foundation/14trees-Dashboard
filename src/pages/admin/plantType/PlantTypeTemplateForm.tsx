import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, containerClasses } from "@mui/material";
import { AutocompleteWithPagination } from "../../../components/AutoComplete";
import { useEffect, useState } from "react";
import { PlantType } from "../../../types/plantType";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as plantTypeActionCreators from '../../../redux/actions/plantTypeActions'
import { GridFilterItem } from "@mui/x-data-grid";
import { LoadingButton } from "@mui/lab";
import { UploadFile } from "@mui/icons-material";
import { toast } from "react-toastify";
import ApiClient from "../../../api/apiClient/apiClient";

interface PlantTypeTemplateFormProps {
    open: boolean,
    onClose: () => void
}

const PlantTypeTemplateForm: React.FC<PlantTypeTemplateFormProps> = ({ open, onClose }) => {

    const dispatch = useAppDispatch();
    const { getPlantTypes }
        = bindActionCreators(plantTypeActionCreators, dispatch);

    const [loading, setLoading] = useState(false);
    const [plantTypesLoading, setPlantTypesLoading] = useState(false);
    const [searchStr, setSearchStr] = useState('');
    const [page, setPage] = useState(0);
    const [selectedPlantType, setSelectedPlantType] = useState<PlantType | null>(null);
    const [templateId, setTemplateId] = useState('');

    useEffect(() => {
        setPlantTypesLoading(true);

        const handler = setTimeout(() => {

            const filters: GridFilterItem[] = [];
            if (searchStr.length > 0) {
                filters.push({
                    columnField: 'name',
                    operatorValue: 'contains',
                    value: searchStr,
                })
            }

            getPlantTypes(page * 10, (page + 1) * 10, filters)
        }, 300)

        setPlantTypesLoading(false);
        return () => {
            clearTimeout(handler);
        }
    }, [page, searchStr]);

    let plantTypes: PlantType[] = [];
    const plantTypesData = useAppSelector((state) => state.plantTypesData);
    if (plantTypesData) {
        plantTypes = Object.values(plantTypesData.plantTypes);
        plantTypes = plantTypes.sort((a, b) => {
            return b.id - a.id;
        });
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setTemplateId(event.target.value.trim());
    };

    const handleAddPlantTypeTemplate = async () => {
        if (!selectedPlantType || !templateId) return;
        setLoading(true);
        try {
            const apiClient = new ApiClient();
            await apiClient.addPlantTypeTemplate(selectedPlantType.name, templateId);
            toast.success("Gift Card template added successfully!")
        } catch (error: any) {
            toast.error(error.message)
        }

        setLoading(false);
        onClose();
    }


    return (
        <Dialog open={open} fullWidth maxWidth='md'>
            <DialogTitle>Add Gift Card Template</DialogTitle>
            <DialogContent dividers>
                <Box>
                    <Box>
                        <Typography mb={1}>Select a plant type from below list</Typography>
                        <AutocompleteWithPagination
                            loading={plantTypesLoading}
                            label="Enter plant type name to search..."
                            options={plantTypes}
                            getOptionLabel={(option) => option.name}
                            onChange={(event, newValue) => {
                                setSelectedPlantType(newValue);
                            }}
                            onInputChange={(event) => {
                                const { value } = event.target;
                                setPage(0);
                                setSearchStr(value);
                            }}
                            setPage={setPage}
                            size="medium"
                            fullWidth
                        />
                    </Box>
                    <Box mt={2}>
                        <Typography mb={1}>Enter the template Id</Typography>
                        <TextField
                            name="template_id"
                            label="Template Id"
                            required
                            value={templateId}
                            onChange={handleInputChange}
                            fullWidth
                        />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error" variant="outlined">
                    Cancel
                </Button>
                <LoadingButton
                    loading={loading}
                    loadingPosition="start"
                    variant="contained"
                    color="success"
                    onClick={handleAddPlantTypeTemplate}
                    startIcon={<UploadFile />}
                    disabled={!templateId || !selectedPlantType}
                >
                    Add Template
                </LoadingButton>
            </DialogActions>
        </Dialog>

    )

}

export default PlantTypeTemplateForm;