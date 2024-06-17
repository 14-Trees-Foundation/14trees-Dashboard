import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { GridFilterItem } from "@mui/x-data-grid";
import AddPond from "./AddPond";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import WaterIcon from '@mui/icons-material/Water';
import { type Pond } from "../../../../types/pond";
import * as pondActionCreators from "../../../../redux/actions/pondActions";
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
} from "@mui/material";
import EditPond from "./EditPond";
import { getFormattedDate } from "../../../../helpers/utils";
import { TableColumnsType } from "antd";
import TableComponent from "../../../../components/Table";
import getColumnSearchProps from "../../../../components/Filter";

function getCapacity(pond: any) {
    return (
      parseInt(pond.depth_ft) *
      parseInt(pond.width_ft) *
      parseInt(pond.length_ft)
    );
}

export const PondComponent = () => {
    const dispatch = useAppDispatch();
    const { getPonds, createPond, updatePond, deletePond, getPondHistory } = bindActionCreators(
        pondActionCreators,
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
    const [nameFilter, setNameFilter] = useState('');
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
    }

    const getPondHistoryByName = async (name: string) => {
        setTimeout(async () => {
            await getPondHistory(name);
        }, 1000);
    };

    const columns: TableColumnsType<Pond> = [
        {
            dataIndex: "action",
            key: "action",
            title: "Actions",
            width: 180,
            align: "center",
            render: (value, record, index )=> (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Button
                        size="small"
                        onClick={() => getPondHistoryByName(record.name)}>
                        <WaterIcon />
                    </Button>
                    <Button
                        size="small"
                        onClick={() => {
                            setSelectedEditRow(record);
                            setEditModal(true);
                        }}>
                        <EditIcon />
                    </Button>
                    <Button
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
        },
        {
            dataIndex: "boundaries.type",
            key: "boundaries.type",
            title: "Boundaries Type",
            width: 150,
            align: "center",
            render: (value, record, index) => record.boundaries?.type
        },
        {
            dataIndex: "boundaries.coordinates",
            key: "boundaries.coordinates",
            title: "Boundaries Coordinates",
            width: 150,
            align: "center",
            render: (value, record, index) => JSON.stringify(record.boundaries?.coordinates)
        },
        {
            dataIndex: "length_ft",
            key: "length_ft",
            title: "LengthFT",
            width: 150,
            align: "center",
        },
        {
            dataIndex: "width_ft",
            key: "width_ft",
            title: "WidthFT",
            width: 150,
            align: "center",
        },
        {
            dataIndex: "depth_ft",
            key: "depth_ft",
            title: "DeathFT",
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
            render: (dateStr: string) => ( dateStr === "" ) ? "" : getFormattedDate(dateStr),
        },
        
      ];

    useEffect(() => {
        getPondData();
    }, [page, nameFilter]);

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
    };

    const handleCreatePondData = (formData: Pond) => {
        createPond(formData);
    };

    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "20px",
                }}>
                <Button variant="contained" style={{ backgroundColor: 'blue' }} onClick={handleModalOpen}>
                    Add Pond
                </Button>
                <AddPond
                    open={open}
                    handleClose={handleModalClose}
                    createPondData={handleCreatePondData}
                />
            </div>
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
                    openeditModal={editModal}
                    setEditModal={setEditModal}
                    editSubmit={handleEditSubmit}
                />
            )}
        </>
    );
};
