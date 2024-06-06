import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
    GridColumns,
    GridFilterItem,
} from "@mui/x-data-grid";
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
import { type Tree } from "../../../../types/tree";
import * as treeActionCreators from "../../../../redux/actions/treeActions";
import * as userTreesActionCreators from "../../../../redux/actions/userTreeActions";
import * as userActionCreators from "../../../../redux/actions/userActions";
import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import { RootState } from "../../../../redux/store/store";
import CircularProgress from "@mui/material/CircularProgress";
import EditTree from "./EditTree";
import UserModal from "../../../../components/UserModal";
import AssignTreeModal from "./AssignTreeModal";
import { AssignTreeRequest } from "../../../../types/userTree";
import { getFormattedDate } from "../../../../helpers/utils";
import getColumnSearchProps from "../../../../components/Filter";
import { Table, TableColumnsType } from "antd";

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

export const TreeNew = () => {
    const dispatch = useAppDispatch();
    const { getTrees, updateTree, deleteTree }
        = bindActionCreators(treeActionCreators, dispatch);
    const { mapTrees, unMapTrees, assignTrees, unassignUserTrees }
        = bindActionCreators(userTreesActionCreators, dispatch);
    const { searchUsers }
        = bindActionCreators(userActionCreators, dispatch);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deleteRow, setDeleteRow] = useState<any>({});
    const [page, setPage] = useState(0);
    const [disabledMapUnMapButton, setDisabledMapUnMapButton] = useState(true);
    const [isMapTrees, setIsMapTrees] = useState(true);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [disabledAUButton, setDisabledAUButton] = useState(true);
    const [isAssignTrees, setIsAssignTrees] = useState(true);
    const [isAssignTreeModalOpen, setIsAssignTreeModalOpen] = useState(false);
    const [saplingIds , setSaplingIds] = useState<string[]>([]);
    const [selectedEditRow, setSelectedEditRow] = useState<Tree | null>(null);
    const [editModal, setEditModal] = useState(false);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [operation, setOperation] = useState('');
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
    }

    useEffect(() => {
        getTreeData();
    }, [page, filters, editModal]);

    const getTreeData = async () => {
        const filtersData = Object.values(filters);
        setTimeout(async () => {
            await getTrees(page * 10, 10, filtersData);
        }, 1000);
    };

    const eventTypeMap: Record<string, string> = {
        "1": "Birthday",
        "2": "In Memory of",
        "3": "General gift",
        "4": "Corporate gift",
    }

    const columns: GridColumns = [
        {
            field: "action",
            headerName: "Action",
            width: 150,
            // flex: 200,
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
                        onClick={() => handleDelete(params.row)}>
                        <DeleteIcon />
                    </Button>
                </div>
            ),
        },
        { field: "sapling_id", headerName: "Sapling ID" },
        { field: "tree_id", headerName: "Tree Name", width: 200, valueGetter: (params) => params.row?.tree?.name },
        { field: "plot_id", headerName: "Plot Name", width: 350, valueGetter: (params) => params.row?.plot?.name },
        { 
            field: "date_added", 
            headerName: "Date Added", 
            valueGetter: (params) => getFormattedDate(params.row?.date_added), 
        },
        { field: "link", headerName: "Event" },
        { field: "mapped_to", headerName: "Mapped To", width: 250, valueGetter: (params) => params.row?.user?.name },
        { field: "event_type", headerName: "Event Type", width: 150, valueGetter: (params) => params.row?.event_type ? eventTypeMap[params.row?.event_type] : ''},
        { field: 'assigned_to', headerName: 'Assigned To', width: 250, valueGetter: (params) => params.row?.assigned_to?.name },
    ];

    const antdColumns: TableColumnsType<Tree> = [
        {
          dataIndex: "action",
          key: "action",
          title: "Actions",
          width: 150,
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
                        setSelectedEditRow(record);
                        setEditModal(true);
                    }}>
                    <EditIcon />
                </Button>
                <Button 
                    variant="outlined"
                    style={{ margin: "0 5px" }}
                    onClick={() => handleDelete(record)}>
                    <DeleteIcon />
                </Button>
            </div>
          ),
        },
        {
          dataIndex: "sapling_id",
          key: "sapling_id",
          title: "Sapling ID",
          width: 150,
          align: 'center',
          ...getColumnSearchProps('sapling_id', filters, handleSetFilters)
        },
        {
          dataIndex: "tree",
          key: "tree_id",
          title: "Tree Type",
          width: 250,
          align: 'center',
          render: (value, record, index) => record?.tree?.name,
          ...getColumnSearchProps('tree', filters, handleSetFilters)
        },
        {
          dataIndex: "plot",
          key: "plot",
          title: "Plot",
          width: 350,
          align: 'center',
          render: (value, record, index) => record?.plot?.name,
          ...getColumnSearchProps('plot', filters, handleSetFilters)
        },
        {
            dataIndex: "mapped_to",
            key: "mapped_to",
            title: "Mapped To",
            width: 250,
            align: 'center',
            render: (value, record, index) => record?.user?.name,
            ...getColumnSearchProps('mapped_to', filters, handleSetFilters)
        },    
        {
            dataIndex: "assigned_to",
            key: "assigned_to",
            title: "Assigned To",
            width: 250,
            align: 'center',
            render: (value, record, index) => record?.assigned_to?.name,
            ...getColumnSearchProps('assigned_to', filters, handleSetFilters)
        },    
        {
            dataIndex: "link",
            key: "link",
            title: "Event",
            width: 150,
            align: 'center',
            ...getColumnSearchProps('link', filters, handleSetFilters)
        },    
        {
            dataIndex: "event_type",
            key: "event_type",
            title: "Event Type",
            width: 200,
            align: 'center',
            render: (value, record, index) => record?.event_type ? eventTypeMap[record.event_type] : ''
        },
        {
            dataIndex: "date_added",
            key: "date_added",
            title: "Date Added",
            width: 150,
            align: 'center',
            render: getFormattedDate,
        },   
      ];

    let treesList: Tree[] = [];
    const treesData = useAppSelector((state: RootState) => state.treesData);
    if (treesData) {
        treesList = Object.values(treesData.trees);
    }

    const handleDelete = (row: Tree) => {
        console.log("Delete", row);
        setOpenDeleteModal(true);
        setDeleteRow(row);
    };

    const handleSelectionChanges = (treeIds: string[]) => {
        const saplingIds = treeIds.map( (treeId) => treesData.trees[treeId].sapling_id );
        setSaplingIds(saplingIds);

        let mapped = 0, unMapped = 0;
        let assigned = 0, unassigned = 0;
        treeIds.forEach( (treeId) => {
            if (treesData.trees[treeId].mapped_to) mapped++;
            else unMapped++;

            if (treesData.trees[treeId].assigned_to) assigned++;
            else unassigned++;
        } )

        if (mapped !== 0  && unMapped !== 0) setDisabledMapUnMapButton(true);
        else setDisabledMapUnMapButton(false)

        if (mapped === 0 && unMapped !== 0) setIsMapTrees(true);
        if (mapped !== 0 && unMapped === 0) setIsMapTrees(false);
        if (mapped === 0 && unMapped === 0) setDisabledMapUnMapButton(true);

        if (assigned !== 0  && unassigned !== 0) setDisabledAUButton(true);
        else setDisabledAUButton(false)

        if (assigned === 0 && unassigned !== 0) setIsAssignTrees(true);
        if (assigned !== 0 && unassigned === 0) setIsAssignTrees(false);
        if (assigned === 0 && unassigned === 0) setDisabledAUButton(true);
    }

    const handleMapUnMap = () => {
        if (!isMapTrees) {
            setOperation('un-map');
            setOpenConfirmation(true);
        } else {
            setIsUserModalOpen(true);
        }

    }

    const handleUnMapTrees = () => {
        unMapTrees(saplingIds);
        setSaplingIds([]);
        setDisabledMapUnMapButton(true);
        getTreeData();
    }

    const handleMapTrees = (formData: any) => {
        mapTrees(saplingIds, formData.email);
        setSaplingIds([]);
        setDisabledMapUnMapButton(true);
        setIsUserModalOpen(false);
        getTreeData();
    }

    const handleAssignUnAssign = () => {
        if (!isAssignTrees) {
            setOperation('unassign');
            setOpenConfirmation(true);
        } else {
            setIsAssignTreeModalOpen(true);
        }
    }

    const handleUnassignTrees = () => {
        unassignUserTrees(saplingIds);
        setSaplingIds([]);
        setDisabledMapUnMapButton(true);
        getTreeData();
    }

    const handleAssignTrees = (formData: any) => {
        let data = formData as AssignTreeRequest
        data.sapling_id = saplingIds.join(",");
        assignTrees(data);
        setSaplingIds([]);
        setDisabledAUButton(true);
        setIsAssignTreeModalOpen(false);
        getTreeData();
    }

    const handleEditSubmit = (formData: Tree) => {
        console.log(formData);
        updateTree(formData);
    };

    const handleCloseEditModal = () => {
        setEditModal(false);
        setSelectedEditRow(null);
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <Button variant="contained" onClick={handleAssignUnAssign}
                disabled={disabledAUButton} 
                >{ (isAssignTrees)? "Assign Trees" : "Unassign Trees" }</Button>
                <AssignTreeModal open={isAssignTreeModalOpen} handleClose={ () => {setIsAssignTreeModalOpen(false)}} onSubmit={handleAssignTrees} />
                <Button variant="contained" style={{ marginLeft: '10px' }} onClick={handleMapUnMap}
                disabled={disabledMapUnMapButton} 
                >{ (isMapTrees)? "Map Trees" : "UnMap Trees" }</Button>
                <UserModal open={isUserModalOpen} handleClose={ () => {setIsUserModalOpen(false)}} onSubmit={handleMapTrees} searchUser={searchUsers} />
                {/* <Button variant="contained" style={{ marginLeft: '10px' }} onClick={handleModalOpen}
                disabled={true} 
                >Add Tree</Button>
                <AddTree open={open} handleClose={handleModalClose} />
                <Button
                    variant="contained"
                    style={{ marginLeft: "10px" }}
                    onClick={handleModalOpen}
                    disabled={true}>
                    Bulk Create
                </Button> */}
            </div>
            {/* <Box sx={{ height: 540, width: "100%" }}>
                <DataGrid
                    rows={treesList}
                    columns={columns}
                    getRowId={(row) => row._id}
                    initialState={{
                        pagination: {
                            page: 0,
                            pageSize: 10,
                        },
                    }}
                    onPageChange={(page) => {
                        if (treesList.length / 10 === page) setPage(page);
                    }}
                    rowCount={treesData.totalTrees}
                    onFilterModelChange={(model: GridFilterModel) => {
                        setFilters(model.items);
                    }}
                    filterMode="server"
                    checkboxSelection
                    disableSelectionOnClick
                    onSelectionModelChange={(ids) => {
                        handleSelectionChanges(ids as string[]);
                      }}
                    components={{
                        Toolbar: GridToolbar,
                        NoRowsOverlay: LoadingOverlay,
                    }}
                />
            </Box> */}

        <Box sx={{ height: 840, width: "100%" }}>
            <Table
                style={{ borderRadius: 20}}
                dataSource={treesList}
                columns={antdColumns}
                pagination={{ position: ['bottomRight'], showSizeChanger: false, pageSize: 10, defaultCurrent: 1, total: treesData.totalTrees, simple: true, onChange: (page, pageSize) => { if(page*pageSize > treesList.length) setPage(page-1); } }}
                rowSelection={{
                    type: 'checkbox',
                    onChange: (selectedRowKeys) => {
                        handleSelectionChanges(selectedRowKeys as string[]);
                    },
                    getCheckboxProps: (record) => {
                        return { name: record.sapling_id }
                    },
                }}
                scroll={{ y: "100%" }}
            />
        </Box>

            <Dialog open={openConfirmation} onClose={() => setOpenConfirmation(false)}>
                <DialogTitle>Confirm {operation}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you want to {operation} trees with the sapling ids '
                        {saplingIds.join(", ")}'?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirmation(false)} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            if (operation === 'un-map') handleUnMapTrees();
                            if (operation === 'unassign') handleUnassignTrees();
                            setOpenConfirmation(false);
                        }}
                        color="primary"
                        autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you want to delete tree with the sapling id '
                        {deleteRow?.sapling_id}'?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteModal(false)} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            deleteTree(deleteRow);
                            setOpenDeleteModal(false);
                        }}
                        color="primary"
                        autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            {selectedEditRow && (
                <EditTree
                    row={selectedEditRow}
                    openeditModal={editModal}
                    handleCloseEditModal={handleCloseEditModal}
                    editSubmit={handleEditSubmit}
                />
            )}
        </>
    );
};
