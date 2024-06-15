import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { GridFilterItem } from "@mui/x-data-grid";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { type PlantType } from "../../../types/plantType.js";
import * as plantTypeActionCreators from "../../../redux/actions/plantTypeActions";
import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { RootState } from "../../../redux/store/store.js";
import AddPlantType from "./AddPlantType";
import EditPlantType from "./EditPlantType";
import { TableColumnsType } from "antd";
import getColumnSearchProps from "../../../components/Filter";
import TableComponent from "../../../components/Table";
import { ToastContainer } from "react-toastify";


export const PlantTypeComponent = () => {
    const dispatch = useAppDispatch();
    const { getPlantTypes, createPlantType, updatePlantType, deletePlantType } =
        bindActionCreators(plantTypeActionCreators, dispatch);

    const [open, setOpen] = useState(false);
    const handleModalOpen = () => setOpen(true);
    const handleModalClose = () => setOpen(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<PlantType | null>(null);
    const [selectedEditRow, setSelectedEditRow] = useState<PlantType | null>(null);
    const [editModal, setEditModal] = useState(false);
    const [page, setPage] = useState(0);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
    }

    const columns: TableColumnsType<PlantType> = [
        {
          dataIndex: "plant_type_id",
          key: "plant_type_id",
          title: "Plant Type ID",
          width: 150,
          align: "center",
          ...getColumnSearchProps('plant_type_id', filters, handleSetFilters)
        },
        {
          dataIndex: "name",
          key: "name",
          title: "Name",
          width: 250,
          align: "center",
          ...getColumnSearchProps('name', filters, handleSetFilters)
        },
        {
          dataIndex: "name_english",
          key: "name_english",
          title: "Name (English)",
          width: 250,
          align: "center",
          ...getColumnSearchProps('name_english', filters, handleSetFilters)
        },
        {
          dataIndex: "scientific_name",
          key: "scientific_name",
          title: "Scientific Name",
          width: 250,
          align: "center",
          ...getColumnSearchProps('scientific_name', filters, handleSetFilters)
        },
        {
          dataIndex: "habit",
          key: "habit",
          title: "Habit",
          width: 200,
          align: "center",
          ...getColumnSearchProps('habit', filters, handleSetFilters)
        },
        {
            dataIndex: "action",
            key: "action",
            title: "Actions",
            align: "center",
            render: (value, record, index )=> (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Button
                        variant="outlined"
                        style={{ margin: "0 5px" }}
                        onClick={() => {
                            setSelectedEditRow(record)
                            setEditModal(true)
                        }}
                    >
                        <EditIcon />
                    </Button>
                    <Button
                        variant="outlined"
                        style={{ margin: "0 5px" }}
                        onClick={() => handleDeletePlantType(record)}>
                        <DeleteIcon />
                    </Button>
                </div>
            ),
          },
      ];

    useEffect(() => {
        getPlantTypeData();
    }, [ page, filters]);

    const getPlantTypeData = async () => {
        const filtersData = Object.values(filters);
        setTimeout(async () => {
            await getPlantTypes(page*10, 10, filtersData);
        }, 1000);
    };

    let plantTypesList: PlantType[] = [];
    const plantTypesData = useAppSelector(
        (state: RootState) => state.plantTypesData
    );
    if (plantTypesData) {
        plantTypesList = Object.values(plantTypesData.plantTypes);
    }

    const getAllPlantTypesData = async () => {
        setTimeout(async () => {
          let filtersData = Object.values(filters);
          await getPlantTypes(0, plantTypesData.totalPlantTypes, filtersData);
        }, 1000);
    };

    const handleCreatePlantTypeData = (formData: PlantType) => {
        console.log(formData);
        createPlantType(formData);
    };

    const handleDeletePlantType = (row: PlantType) => {
        setOpenDeleteModal(true);
        setSelectedItem(row);
    };

    const handleEditSubmit = (formData: PlantType) => {
        updatePlantType(formData);
    };

    const handleCloseEditModal = () => {
        setEditModal(false);
        setSelectedEditRow(null);
    };

    return (
        <>
            <ToastContainer />
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "20px",
                }}>
                <Button variant="contained" style={{ backgroundColor:'blue' }} onClick={handleModalOpen}>
                    Add Plant type
                </Button>
                <AddPlantType
                    open={open}
                    handleClose={handleModalClose}
                    createPlantType={handleCreatePlantTypeData}
                />
                <Button
                    variant="contained"
                    style={{ marginLeft: "10px", }}
                    onClick={handleModalOpen} disabled={true} >
                    Bulk Create
                </Button>
            </div>

            <Box sx={{ height: 840, width: "100%" }}>
                <TableComponent
                    dataSource={plantTypesList}
                    columns={columns}
                    totalRecords={plantTypesData.totalPlantTypes}
                    setPage={setPage}
                    fetchAllData={getAllPlantTypesData}
                />
            </Box>

            <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you want to delete {selectedItem?.name}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteModal(false)} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            console.log("Deleting item...", selectedItem);
                            if (selectedItem !== null) {
                                deletePlantType(selectedItem)
                            }
                            setOpenDeleteModal(false);
                        }}
                        color="primary"
                        autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            {selectedEditRow && <EditPlantType row={selectedEditRow} openeditModal={editModal} handleCloseEditModal={handleCloseEditModal} editSubmit={handleEditSubmit} />}
        </>
    );
};
