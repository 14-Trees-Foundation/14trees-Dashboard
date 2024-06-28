import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { GridFilterItem } from "@mui/x-data-grid";
import AddPond from "./AddPond";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import WaterIcon from '@mui/icons-material/Water';
import { type Pond } from "../../../../types/pond";
import * as pondActionCreators from "../../../../redux/actions/pondActions";
import * as pondWaterLevelUpdateActions from "../../../../redux/actions/pondWaterLevelUpdateActions";
import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import { RootState } from "../../../../redux/store/store";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Typography,
} from "@mui/material";
import EditPond from "./EditPond";
import { getFormattedDate } from "../../../../helpers/utils";
import { TableColumnsType } from "antd";
import TableComponent from "../../../../components/Table";
import getColumnSearchProps, { getColumnSelectedItemFilter } from "../../../../components/Filter";

function getCapacity(pond: any) {
    return (
      parseInt(pond.depth_ft) *
      parseInt(pond.width_ft) *
      parseInt(pond.length_ft)
    );
}

interface PondComponentInputProps {
    setSelectedPond: React.Dispatch<React.SetStateAction<Pond | null>>
}

export const PondComponent = ({ setSelectedPond }: PondComponentInputProps) => {
    const dispatch = useAppDispatch();
    const { getPonds, createPond, updatePond, deletePond } = bindActionCreators(
        pondActionCreators,
        dispatch
    );
    const { getPondWaterLevelUpdates } = bindActionCreators(
        pondWaterLevelUpdateActions,
        dispatch
    );

    const [open, setOpen] = useState(false);
    const handleModalOpen = () => setOpen(true);
    const handleModalClose = () => setOpen(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Pond | null>(null);
    const [selectedEditRow, setSelectedEditRow] = useState<Pond | null>(null);
    const [editModal, setEditModal] = useState(false);
    const [page, setPage] = useState(0);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
    }

    const getPondWaterLevelUpdatesData = async (id: number) => {
        setTimeout(async () => {
            await getPondWaterLevelUpdates(id, 0, -1);
        }, 1000);
    };

    const handlePondWaterLevelFetch = (record: Pond) => {
        setSelectedPond(record);
        getPondWaterLevelUpdatesData(record.id);
    };

    const typesList = [
        "Storage",
        "Percolation",
    ]

    const columns: TableColumnsType<Pond> = [
        {
            dataIndex: "action",
            key: "action",
            title: "Actions",
            width: 250,
            align: "center",
            render: (value, record, index )=> (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Button
                        style={{ margin: "0 5px" }}
                        variant="outlined"
                        color="success"
                        size="small"
                        onClick={() => {
                            handlePondWaterLevelFetch(record);
                        }}>
                        <WaterIcon />
                    </Button>
                    <Button
                        style={{ margin: "0 5px" }}
                        variant="outlined"
                        size="small"
                        onClick={() => {
                            setEditModal(true);
                            setSelectedEditRow(record);
                        }}>
                        <EditIcon />
                    </Button>
                    <Button
                        style={{ margin: "0 5px" }}
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => handleDelete(record)}>
                        <DeleteIcon />
                    </Button>
                </div>
            ),
        },  
        {
          dataIndex: "name",
          key: "name",
          title: "Name",
          align: "center",
          width: 300,
          ...getColumnSearchProps('name', filters, handleSetFilters)
        },
        {
            dataIndex: "type",
            key: "type",
            title: "Type",
            width: 150,
            align: "center",
            ...getColumnSelectedItemFilter({ dataIndex: 'type', filters, handleSetFilters, options: typesList }),
        },
        {
            dataIndex: "length_ft",
            key: "length_ft",
            title: "Length (Ft)",
            width: 150,
            align: "center",
        },
        {
            dataIndex: "width_ft",
            key: "width_ft",
            title: "Width (Ft)",
            width: 150,
            align: "center",
        },
        {
            dataIndex: "depth_ft",
            key: "depth_ft",
            title: "Depth (Ft)",
            width: 150,
            align: "center",
        },
        {
            dataIndex: "capacity",
            key: "capacity",
            title: "Pond Capacity",
            width: 150,
            align: "center",
            render: (value, record, index) => getCapacity(record),
        },
        {
            dataIndex: "created_at",
            key: "created_at",
            title: "Created At",
            width: 150,
            align: "center",
            render: getFormattedDate,
        },
        
      ];

    useEffect(() => {
        getPondData();
    }, [page, filters]);

    const getPondData = async () => {
        let filtersData = Object.values(filters);
        setTimeout(async () => {
            await getPonds(page*10, 10, filtersData);
        }, 1000);
    };

    
    let pondsList: Pond[] = [];
    const pondsData = useAppSelector((state: RootState) => state.pondsData);
    if (pondsData) {
        pondsList = Object.values(pondsData.ponds);
    }

    const getAllPondsData = async () => {
        let filtersData = Object.values(filters);
        setTimeout(async () => {
            await getPonds(0, pondsData.totalPonds, filtersData);
        }, 1000);
    };

    const handleDelete = (row: Pond) => {
        setOpenDeleteModal(true);
        setSelectedItem(row);
    };

    const handleEditSubmit = (formData: Pond) => {
        updatePond(formData);
        setSelectedEditRow(null);
    };

    const handleCreatePondData = (formData: Pond) => {
        createPond(formData);
    };

    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "4px 12px",
                }}
            >
                <Typography variant="h4" style={{ marginTop: '5px' }}>Ponds</Typography>
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
                        onClick={handleModalOpen}>
                        Add Pond
                    </Button>
                    <AddPond
                        open={open}
                        handleClose={handleModalClose}
                        createPondData={handleCreatePondData}
                    />
                </div>
            </div>
            <Divider sx={{ backgroundColor: "black", marginBottom: '15px' }} />
            
            <Box sx={{ height: 840, width: "100%" }}>
                <TableComponent
                dataSource={pondsList}
                columns={columns}
                totalRecords={pondsData.totalPonds}
                fetchAllData={getAllPondsData}
                setPage={setPage}
                />
            </Box>

            <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you want to delete "{selectedItem?.name}"?
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
                                deletePond(selectedItem);
                            }
                            setOpenDeleteModal(false);
                        }}
                        color="primary"
                        autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            {selectedEditRow && (
                <EditPond
                    row={selectedEditRow}
                    openEditModal={editModal}
                    handleClose={() => {
                        setEditModal(false);
                        setSelectedEditRow(null);
                    }}
                    editSubmit={handleEditSubmit}
                />
            )}
        </>
    );
};
