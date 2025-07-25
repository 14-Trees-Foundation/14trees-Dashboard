import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { GridFilterItem } from "@mui/x-data-grid";
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Typography,
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
import getColumnSearchProps, { getColumnSelectedItemFilter } from "../../../components/Filter";
import TableComponent from "../../../components/Table";
import GeneralTable from "../../../components/GenTable.js";
import { toast, ToastContainer } from "react-toastify";
import { plantTypeHabitList } from "./habitList";
import { PlotPlantTypes } from "./PlotPlantTypes";
import PlantTypeTemplateForm from "./PlantTypeTemplateForm";
import ApiClient from "../../../api/apiClient/apiClient";


export const PlantTypeComponent = () => {
    const dispatch = useAppDispatch();
    const { getPlantTypes, createPlantType, updatePlantType, deletePlantType } =
        bindActionCreators(plantTypeActionCreators, dispatch);

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const handleModalOpen = () => setOpen(true);
    const handleModalClose = () => setOpen(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<PlantType | null>(null);
    const [selectedEditRow, setSelectedEditRow] = useState<PlantType | null>(null);
    const [editModal, setEditModal] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [tableRows, setTableRows] = useState<PlantType[]>([]);
    const [srNoPage, setSrNoPage] = useState(0);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const [addTemplate, setAddTemplate] = useState(false);

    const handlePaginationChange = (page: number, pageSize: number) => {
        setPage(page - 1);
        setPageSize(pageSize);
      }

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
    }

    const columns: TableColumnsType<PlantType> = [
        {
            dataIndex: "srNo",
            key: "srNo",
            title: "Sr. No.",
            width: 100,
            align: "center",
            render: (value, record, index) => `${index + 1 + srNoPage * pageSize}.`
        },
        {
            dataIndex: "action",
            key: "action",
            title: "Actions",
            align: "center",
            width: 160,
            render: (value, record, index) => (
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
                        color="error"
                        style={{ margin: "0 5px" }}
                        onClick={() => handleDeletePlantType(record)}>
                        <DeleteIcon />
                    </Button>
                </div>
            ),
        },
        {
            dataIndex: "plant_type_id",
            key: "plant_type_id",
            title: "Plant Type ID",
            width: 170,
            align: "center",
            fixed: "left",
            ...getColumnSearchProps('plant_type_id', filters, handleSetFilters)
        },
        {
            dataIndex: "name",
            key: "name",
            title: "Name",
            width: 250,
            align: "center",
            fixed: "left",
            ...getColumnSearchProps('name', filters, handleSetFilters)
        },
        {
            dataIndex: "english_name",
            key: "english_name",
            title: "Name (English)",
            width: 250,
            align: "center",
            ...getColumnSearchProps('english_name', filters, handleSetFilters)
        },
        {
            dataIndex: "common_name_in_english",
            key: "common_name_in_english",
            title: "Common Name in English",
            width: 250,
            align: "center",
            ...getColumnSearchProps('common_name_in_english', filters, handleSetFilters)
        },
        {
            dataIndex: "common_name_in_marathi",
            key: "common_name_in_marathi",
            title: "Common Name in Marathi",
            width: 250,
            align: "center",
            ...getColumnSearchProps('common_name_in_marathi', filters, handleSetFilters)
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
            dataIndex: "known_as",
            key: "known_as",
            title: "Known As",
            width: 250,
            align: "center",
            ...getColumnSearchProps('known_as', filters, handleSetFilters)
        },
        {
            dataIndex: "category",
            key: "category",
            title: "Category",
            width: 250,
            align: "center",
            ...getColumnSearchProps('category', filters, handleSetFilters)
        },
        {
            dataIndex: "tags",
            key: "tags",
            title: "Tags",
            width: 250,
            align: "center",
            render: (tags) => tags ? tags.join(", ") : '',
            ...getColumnSelectedItemFilter({ dataIndex: 'tags', filters, handleSetFilters, options: [] })
        },
        {
            dataIndex: "use",
            key: "use",
            title: "Use",
            width: 250,
            align: "center",
            ...getColumnSearchProps('use', filters, handleSetFilters)
        },
        {
            dataIndex: "images",
            key: "images",
            title: "Images",
            width: 250,
            align: "center",
            render: (value) => {
                return (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                        {value && value.map((image: string) => (
                            <Avatar
                                style={{ marginLeft: 5 }}
                                alt="Profile"
                                src={image ? image : ""}
                                sx={{ width: 40, height: 40 }}
                            />
                        ))}
                    </div>
                )
            },
            ...getColumnSearchProps('images', filters, handleSetFilters)
        },
        {
            dataIndex: "habit",
            key: "habit",
            title: "Habit",
            width: 200,
            align: "center",
            ...getColumnSelectedItemFilter({ dataIndex: 'habit', filters, handleSetFilters, options: plantTypeHabitList })
        },
    ];

    let plantTypesList: PlantType[] = [];
 const plantTypesData = useAppSelector(
  (state: RootState) => state.plantTypesData
 );
 if (plantTypesData) {
  plantTypesList = Object.values(plantTypesData.plantTypes);
  plantTypesList = plantTypesList.sort((a, b) => b.id - a.id)
 }

 useEffect(() => {
  getPlantTypeData();
 }, [filters]);

 useEffect(() => {
  const handler = setTimeout(() => {
    if (plantTypesData.loading) return;

    const records: PlantType[] = [];
    const maxLength = Math.min((page + 1) * pageSize, plantTypesData.totalPlantTypes);
    for (let i = page * pageSize; i < maxLength; i++) {
      if (Object.hasOwn(plantTypesData.paginationMapping, i)) {
        const id = plantTypesData.paginationMapping[i];
        const record = plantTypesData.plantTypes[id];
        if (record) {
          records.push(record);
        }
      } else {
        getPlantTypeData();
        break;
      }
    }

    setTableRows(records);
  }, 500)

  return () => {
    clearTimeout(handler);
  }
 }, [pageSize, page, plantTypesData]);

 const getPlantTypeData = async () => {
    const filtersData = Object.values(filters);
    getPlantTypes(page * pageSize, pageSize, filtersData);
  };
  
  const getAllPlantTypesData = async () => {
    const filtersData = Object.values(filters);
    const apiClient = new ApiClient();
    try {
      const plantTypesResp = await apiClient.getPlantTypes(0, -1, filtersData);
      return plantTypesResp.results;
    } catch (error: any) {
      toast.error(error.message);
      return [];
    }
  };

    const handleCreatePlantTypeData = (formData: PlantType, files: Blob[]) => {
        createPlantType(formData, files);
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
                    justifyContent: "space-between",
                    padding: "4px 12px",
                }}
            >
                <Typography variant="h4" style={{ marginTop: '5px' }}>Plant Types</Typography>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginBottom: "5px",
                        marginTop: "5px",
                    }}>
                    <Button 
                        variant="contained" 
                        color="success" 
                        onClick={() => { setAddTemplate(true); }}
                        style={{ textTransform: 'none', marginRight: '10px' }}
                    >
                        Add Plant Type Card Template
                    </Button>
                    <Button variant="contained" color="success" onClick={handleModalOpen}>
                        Add Plant type
                    </Button>
                    <AddPlantType
                        open={open}
                        handleClose={handleModalClose}
                        createPlantType={handleCreatePlantTypeData}
                    />
                </div>
            </div>
            <Divider sx={{ backgroundColor: "black", marginBottom: '15px' }} />
            <Box sx={{ height: 840, width: "100%" }}>
            <GeneralTable
              loading={plantTypesData.loading}
              rows={tableRows}
              columns={columns}
              totalRecords={plantTypesData.totalPlantTypes}
              page={page}
              pageSize={pageSize}
              onPaginationChange={handlePaginationChange}
              onDownload={getAllPlantTypesData}
              footer
              tableName="Plant Types"
                />
            </Box>

            <Divider style={{ marginBottom: "20px" }} />
            <PlotPlantTypes />

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
                        color="error"
                        variant="outlined"
                        autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            {selectedEditRow && <EditPlantType row={selectedEditRow} openeditModal={editModal} handleCloseEditModal={handleCloseEditModal} editSubmit={handleEditSubmit} />}

            <PlantTypeTemplateForm 
                open={addTemplate}
                onClose={() => { setAddTemplate(false) }}
            />
        </>
    );
};
