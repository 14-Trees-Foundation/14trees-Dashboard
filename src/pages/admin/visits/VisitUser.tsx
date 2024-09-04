import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { GridFilterItem } from "@mui/x-data-grid";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    TextField,
} from "@mui/material";
import * as visitUserActionCreators from "../../../redux/actions/visitUserActions";
import * as userActionCreators from "../../../redux/actions/userActions";


import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { RootState } from "../../../redux/store/store";
import type { TableColumnsType } from 'antd';
import getColumnSearchProps from "../../../components/Filter";
import UserModal from "../../../components/UserModal";
import { Visit } from "../../../types/visits";
import { User } from "../../../types/user";

import TableComponent from "../../../components/Table";


interface VisitUsersInputProps {
    selectedVisit: Visit | null
}


export const VisitUsers = ({ selectedVisit }: VisitUsersInputProps) => {

    const dispatch = useAppDispatch();
    const { createVisitUser, removeVisitUsers, getVisitUsers, createVisitUsersBulk } = bindActionCreators(visitUserActionCreators, dispatch)
    const { searchUsers } = bindActionCreators(userActionCreators, dispatch)


    const [selectedVisitForUser, setSelectedVisitForUser] = useState<Visit | null>(null);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [addUserModal, setAddUserModal] = useState(false);
    const [openDeleteUserGroups, setOpenDeleteUserGroups] = useState(false);
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
    const [bulkCreate, setBulkCreate] = useState(false);
    const [file, setFile] = useState(null);

    const targetRef = useRef<any>(null);

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
    }


    useEffect(() => {
        if (selectedVisit !== null) {
            setSelectedVisitForUser(selectedVisit);
            targetRef.current && targetRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedVisit])

    useEffect(() => {
        getVisitUsersData();
    }, [pageSize, page, filters, selectedVisitForUser]);

    const getVisitUsersData = async () => {
        selectedVisitForUser && getVisitUsers(selectedVisitForUser.id, page * pageSize, pageSize);
    };

    const getAllUsersData = async () => {
        selectedVisitForUser && getVisitUsers(selectedVisitForUser.id, page * pageSize, pageSize);
    };

    const handleAddUserToVisit = (formData: any) => {
        if (selectedVisitForUser) {
            let reqBody = { ...formData, visit_id: selectedVisitForUser.id };
            if (reqBody.id) reqBody = { ...reqBody };
            createVisitUser(reqBody);
        }
        setAddUserModal(false);
        getVisitUsersData();
    }

    const handleRemoveGroupUsers = () => {
        selectedVisitForUser && removeVisitUsers(selectedVisitForUser.id, selectedUserIds);
        setOpenDeleteUserGroups(false);
        getVisitUsersData();
    }

    const handleSelectionChanges = (selectedIds: number[]) => {
        setSelectedUserIds(selectedIds);
    }

    const handleBulkCreateVisitUserMapping = (e: any) => {
        e.preventDefault();
        setBulkCreate(false);
        if (file && selectedVisitForUser) {
            createVisitUsersBulk(selectedVisitForUser.id, file);
        }
    }

    const columns: TableColumnsType<User> = [
        {
            dataIndex: "name",
            key: "name",
            title: "Name",
            align: "center",
            width: 150,
            ...getColumnSearchProps('name', filters, handleSetFilters)
        },
        {
            dataIndex: "email",
            key: "email",
            title: "Email",
            align: "center",
            width: 200,
            ...getColumnSearchProps('email', filters, handleSetFilters)
        },
        {
            dataIndex: "phone",
            key: "phone",
            title: "Phone",
            align: "center",
            width: 100,
            render: (value: string) => {
                if (!value || value === "0") return "-";
                if (value.endsWith('.0')) return value.slice(0, -2);
                else return value;
            },
            ...getColumnSearchProps('phone', filters, handleSetFilters)
        }

    ];

    let usersList: User[] = [];
    const visitUsersData = useAppSelector((state: RootState) => state.visitUserData);
    if (visitUsersData) {
        usersList = Object.values(visitUsersData.users);
    }

    return (
        <div ref={targetRef}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h1 style={{ flexGrow: 1 }}>{selectedVisit ? selectedVisit.visit_name : ''} Users</h1>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => { setBulkCreate(true) }}
                    style={{ marginLeft: 16, width: 150 }}
                    disabled={!selectedVisitForUser}
                >
                    Bulk Add
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => { setAddUserModal(true) }}
                    style={{ marginLeft: 16, width: 150 }}
                    disabled={!selectedVisitForUser}
                >
                    Add User
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => { setOpenDeleteUserGroups(true) }}
                    disabled={!selectedVisitForUser || selectedUserIds.length === 0}
                    style={{ marginLeft: 16, width: 190 }}
                >
                    Remove Users
                </Button>
            </div>
            <div style={{ marginTop: 2 }}>
                <Divider />
                <Box sx={{ height: 540, marginTop: 2, width: "100%", justifyContent: "center", display: "flex" }}>
                    {selectedVisit && (
                        <TableComponent
                            dataSource={usersList}
                            columns={columns}
                            totalRecords={visitUsersData.totalUsers}
                            fetchAllData={getAllUsersData}
                            setPage={setPage}
                            setPageSize={setPageSize}
                            handleSelectionChanges={handleSelectionChanges}

                        />
                    )}
                </Box>

            </div>

            {addUserModal && (
                <UserModal
                    open={addUserModal}
                    handleClose={() => setAddUserModal(false)}
                    onSubmit={handleAddUserToVisit}
                    searchUser={searchUsers}
                />
            )}

            <Dialog open={openDeleteUserGroups} onClose={() => setOpenDeleteUserGroups(false)}>
                <DialogTitle>Confirm Remove</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you want to remove selected users from group {selectedVisitForUser?.visit_name}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenDeleteUserGroups(false)}
                        color="primary"
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleRemoveGroupUsers}
                        color="error"
                        variant="contained"
                        autoFocus
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={bulkCreate} onClose={() => setBulkCreate(false)}>
                <DialogTitle>Add users to '{selectedVisitForUser?.visit_name}'</DialogTitle>
                <form onSubmit={handleBulkCreateVisitUserMapping}>
                    <DialogContent>
                        <DialogContentText>Download sample file from <a href="https://docs.google.com/spreadsheets/d/1ypVdbR44nQXuaHAEOrwywY3k-lfJdsRZ9iKp0Jpq7Kw/gviz/tq?tqx=out:csv&sheet=Sheet1">here</a> and fill the details.</DialogContentText>
                        <TextField
                            type="file"
                            inputProps={{ accept: '.csv' }}
                            onChange={(e: any) => {
                                if (e.target.files) {
                                    setFile(e.target.files[0]);
                                }
                            }}
                            fullWidth
                            margin="normal"
                        />
                    </DialogContent>
                    <DialogActions
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            marginBottom: "15px",
                        }}
                    >
                        <Button onClick={() => setBulkCreate(false)} variant="outlined" color="error">
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="success">
                            Upload
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>

    )


}