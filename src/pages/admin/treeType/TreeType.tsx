import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar, GridColumns, GridFilterItem } from "@mui/x-data-grid";
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { type TreeType } from "../../../types/treeType";
import * as treeTypeActionCreators from "../../../redux/actions/treeTypeActions";
import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { RootState } from "../../../redux/store/store";
import AddTreeType from "./AddTreeType";
import CircularProgress from "@mui/material/CircularProgress";
import EditTreeType from "./EditTreeType.jsx";
import { Table, TableColumnsType } from "antd";
import getColumnSearchProps from "../../../components/Filter";

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

export const TreeTypeComponent = () => {
    const dispatch = useAppDispatch();
    const { createTreeType, updateTreeType, deleteTreeType, getTreeTypesByFilters } =
        bindActionCreators(treeTypeActionCreators, dispatch);

    const [open, setOpen] = useState(false);
    const handleModalOpen = () => setOpen(true);
    const handleModalClose = () => setOpen(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<TreeType | null>(null);
    const [selectedEditRow, setSelectedEditRow] = useState<TreeType | null>(null);
    const [editModal, setEditModal] = useState(false);
    const [page, setPage] = useState(0);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
    }

    const columns: GridColumns = [
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
            width: 300,
            flex: 1,
            editable: true,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "name_english",
            headerName: "Name (English)",
            // width: 150,
            flex: 1,
            editable: true,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "tree_id",
            headerName: "Tree ID",
            // width: 120,
            flex: 1,
            editable: true,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "scientific_name",
            headerName: "Scientific Name",
            width: 300,
            flex: 1,
            editable: true,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "habit",
            headerName: "Habit",
            // width: 150,
            flex: 1,
            editable: true,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "action",
            headerName: "Action",
            // width: 250,
            flex: 1,
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
                            setSelectedEditRow(params.row)
                            setEditModal(true)
                        }}
                    >
                        <EditIcon />
                    </Button>
                    <Button
                        variant="outlined"
                        style={{ margin: "0 5px" }}
                        onClick={() => handleDeleteTreeType(params.row as TreeType)}>
                        <DeleteIcon />
                    </Button>
                </div>
            ),
        },
    ];

    const antdColumns: TableColumnsType<TreeType> = [
        {
          dataIndex: "tree_id",
          key: "tree_id",
          title: "Tree Type ID",
          width: 150,
          align: "center",
          ...getColumnSearchProps('tree_id', filters, handleSetFilters)
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
                        onClick={() => handleDeleteTreeType(record)}>
                        <DeleteIcon />
                    </Button>
                </div>
            ),
          },
      ];

    useEffect(() => {
        getTreeTypeData();
    }, [ page, filters]);

    const getTreeTypeData = async () => {
        const filtersData = Object.values(filters);
        setTimeout(async () => {
            await getTreeTypesByFilters(page*10, 10, filtersData);
        }, 1000);
    };

    let treeTypesList: TreeType[] = [];
    const treeTypesData = useAppSelector(
        (state: RootState) => state.treeTypesData
    );
    if (treeTypesData) {
        treeTypesList = Object.values(treeTypesData.treeTypes);
    }

    const handleCreateTreeTypeData = (formData: TreeType) => {
        console.log(formData);
        createTreeType(formData);
    };

    const handleDeleteTreeType = (row: TreeType) => {
        // console.log("Delete", row);
        setOpenDeleteModal(true);
        setSelectedItem(row);
    };

    const handleEditSubmit = (formData: TreeType) => {
        // console.log(formData);
        updateTreeType(formData);
    };

    const handleCloseEditModal = () => {
        setEditModal(false);
        setSelectedEditRow(null);
    };

    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "20px",
                }}>
                <Button variant="contained" style={{ backgroundColor:'blue' }} onClick={handleModalOpen}>
                    Add Tree type
                </Button>
                <AddTreeType
                    open={open}
                    handleClose={handleModalClose}
                    createTreeData={handleCreateTreeTypeData}
                />
                <Button
                    variant="contained"
                    style={{ marginLeft: "10px", }}
                    onClick={handleModalOpen} disabled={true} >
                    Bulk Create
                </Button>
            </div>

            {/* <Box sx={{ height: 540, width: "100%" }}>
                <DataGrid
                    rows={treeTypesList}
                    columns={columns}
                    getRowId={(row) => row._id}
                    initialState={{
                        pagination: {
                            page: 0,
                            pageSize: 10,
                        },
                    }}
                    onPageChange={(page) => { if(treeTypesList.length < (page + 1)*10) setPage(page); }}
                    rowCount={treeTypesData.totalTreeTypes}
                    checkboxSelection
                    disableSelectionOnClick
                    components={{
                        Toolbar: GridToolbar,
                        NoRowsOverlay: LoadingOverlay,
                    }}
                />
            </Box> */}
            <Box sx={{ height: 840, width: "100%" }}>
                <Table
                    style={{ borderRadius: 20}}
                    dataSource={treeTypesList}
                    columns={antdColumns}
                    pagination={{ position: ['bottomRight'], showSizeChanger: false, pageSize: 10, defaultCurrent: 1, total: treeTypesData.totalTreeTypes, simple: true, onChange: (page, pageSize) => { if(page*pageSize > treeTypesList.length) setPage(page-1); } }}
                    scroll={{ y: "100%" }}
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
                                deleteTreeType(selectedItem)
                            }
                            setOpenDeleteModal(false);
                        }}
                        color="primary"
                        autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            {selectedEditRow && <EditTreeType row={selectedEditRow} openeditModal={editModal} handleCloseEditModal={handleCloseEditModal} editSubmit={handleEditSubmit} />}
        </>
    );
};
