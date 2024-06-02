import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar, GridColumns } from "@mui/x-data-grid";
import AddPond from "./AddPond";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { type Pond } from "../../../../types/pond";
import * as pondActionCreators from "../../../../redux/actions/pondActions";
import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import { RootState } from "../../../../redux/store/store";
import CircularProgress from "@mui/material/CircularProgress";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Modal,
    Typography,
} from "@mui/material";
import EditPond from "./EditPond";
import { getFormattedDate } from "../../../../helpers/utils";

function LoadingOverlay() {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
            }}>
            <CircularProgress />
        </div>
    );
}

function getCapacity(params: any) {
    return (
      parseInt(params.row.depthFt) *
      parseInt(params.row.widthFt) *
      parseInt(params.row.lengthFt)
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
    const [selectedEditRow, setSelectedEditRow] = useState<RowType | null>(null);
    const [editModal, setEditModal] = useState(false);
    const [page, setPage] = useState(0);
    const [nameFilter, setNameFilter] = useState('');

    const getPondHistoryByName = async (name: string) => {
        setTimeout(async () => {
            await getPondHistory(name);
        }, 1000);
    };

    const columns: GridColumns = [
        {
            field: "action",
            headerName: "Action",
            width: 150,
            align: "center",
            headerAlign: "center",
            renderCell: (params: any) => (
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
                            setSelectedEditRow(params.row);
                            setEditModal(true);
                        }}>
                        <EditIcon />
                    </Button>
                    <Button
                        variant="outlined"
                        style={{ margin: "0 5px" }}
                        onClick={() => handleDelete(params.row as Pond)}>
                        <DeleteIcon />
                    </Button>
                </div>
            ),
        },
        // {
        //     field: "_id",
        //     headerName: "ID",
        //     width: 90,
        //     align: "center",
        //     headerAlign: "center",
        // },
        {
            field: "name",
            headerName: "Name",
            width: 250,
            editable: true,
            align: "center",
            headerAlign: "center",
            renderCell: (params: any) => (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <Button
                    onClick={() => {
                      getPondHistoryByName(params.row.name);
                    }}
                  >
                    {params.row.name}
                  </Button>
                </div>
              ),
        },
        {
            field: "type",
            headerName: "Type",
            width: 150,
            editable: true,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "boundaries.type",
            headerName: "Boundaries Type",
            width: 150,
            editable: true,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "boundaries.coordinates",
            headerName: "Boundaries Coordinates",
            width: 150,
            editable: true,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "lengthFt",
            headerName: "LengthFT",
            width: 150,
            editable: true,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "widthFt",
            headerName: "WidthFT",
            width: 150,
            editable: true,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "depthFt",
            headerName: "DeathFT",
            width: 150,
            editable: true,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "capacity",
            headerName: "Pond Capacity",
            width: 150,
            editable: true,
            align: "center",
            headerAlign: "center",
            valueGetter: getCapacity,
        },
        {
            field: "date_added",
            headerName: "Date Added",
            width: 150,
            editable: true,
            align: "center",
            headerAlign: "center",
            valueGetter: (params) => getFormattedDate(params.row?.date_added),
        },
        
    ];

    useEffect(() => {
        getPondData();
    }, [page, nameFilter]);

    const getPondData = async () => {
        setTimeout(async () => {
            await getPonds(page*10, 10, nameFilter);
        }, 1000);
    };

    let pondsList: Pond[] = [];
    const pondsData = useAppSelector((state: RootState) => state.pondsData);
    if (pondsData) {
        pondsList = Object.values(pondsData.ponds);
    }

    const flattenedRows = pondsList.map((row) => ({
        ...row,
        "boundaries.type": row.boundaries.type,
        "boundaries.coordinates": row.boundaries.coordinates,
    }));

    type RowType = {
        id: string;
        name: string;
    };

    const handleDelete = (row: Pond) => {
        console.log("Delete", row);
        console.log(row);
        setOpenDeleteModal(true);
        setSelectedItem(row);
    };

    const handleEditSubmit = (formData: Pond) => {
        console.log(formData);
        updatePond(formData);
    };

    const handleCreatePondData = (formData: Pond) => {
        // console.log(formData);
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
            <Box sx={{ height: 540, width: "100%" }}>
                <DataGrid
                    rows={flattenedRows}
                    columns={columns}
                    getRowId={(row) => row._id}
                    initialState={{
                        pagination: {
                          page: 0,
                          pageSize: 10,
                        },
                      }}
                    onPageChange={(page) => { if((pondsList.length / 10) === page) setPage(page); }}
                    rowCount={pondsData.totalPonds}
                    filterMode="server"
                    onFilterModelChange={(model) => { if (model.items[0]?.columnField === "name") setNameFilter(model.items[0].value) }}
                    checkboxSelection
                    disableSelectionOnClick
                    components={{
                        Toolbar: GridToolbar,
                        NoRowsOverlay: LoadingOverlay,
                    }}
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
