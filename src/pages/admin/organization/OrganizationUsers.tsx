import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { GridFilterItem } from "@mui/x-data-grid";
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    TextField,
} from "@mui/material";
import { type User } from "../../../types/user";
import * as userActionCreators from "../../../redux/actions/userActions";
import * as groupActionCreators from "../../../redux/actions/groupActions";
import * as userGroupActionCreators from "../../../redux/actions/userGroupActions";
import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { RootState } from "../../../redux/store/store";
import type { TableColumnsType } from 'antd';
import getColumnSearchProps from "../../../components/Filter";
import { getFormattedDate } from "../../../helpers/utils";
import TableComponent from "../../../components/Table";
import { Group } from "../../../types/Group";
import UserModal from "../../../components/UserModal";

interface OrganizationUsersInputProps {
    selectedOrg: Group | null
}

export const OrganizationUsers = ( { selectedOrg }: OrganizationUsersInputProps) => {
    const dispatch = useAppDispatch();
    const { getUsers, searchUsers } =
        bindActionCreators(userActionCreators, dispatch);
    const { searchGroups } =
        bindActionCreators(groupActionCreators, dispatch);
    const { createUserGroupMapping, removeGroupUsers } =
        bindActionCreators(userGroupActionCreators, dispatch);

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [searchGroupPage, setSearchGroupPage] = useState(0);
    const [addUserModal, setAddUserModal] = useState(false);
    const [openDeleteUserGroups, setOpenDeleteUserGroups] = useState(false);
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
    const [page, setPage] = useState(0);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const targetRef = useRef<any>(null);

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
    }

    useEffect(() => {
        if (selectedOrg !== null) {
            setSelectedGroup(selectedOrg);
            targetRef.current && targetRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedOrg])

    useEffect(() => {
        if (selectedGroup) {
            getUserData();
        }
    }, [page, filters, selectedGroup]);

    const getUserData = async () => {
        let filterWithGroup = { ...filters }
        if (selectedGroup) {
            filterWithGroup['group_id'] = {
                columnField: 'group_id',
                value: selectedGroup.id,
                operatorValue: 'equals'
            }
        }
        let filtersData = Object.values(filterWithGroup);
        setTimeout(async () => {
            await getUsers(page * 10, 10, filtersData);
        }, 1000);
    };

    const getAllUsersData = async () => {
        setTimeout(async () => {
            let filterWithGroup = { ...filters }
            if (selectedGroup) {
                filterWithGroup['group_id'] = {
                    columnField: 'group_id',
                    value: selectedGroup.id,
                    operatorValue: 'equals'
                }
            }
            let filtersData = Object.values(filterWithGroup);
            await getUsers(0, usersData.totalUsers, filtersData);
        }, 1000);
    };

    // Groups state management

    useEffect(() => {
        if (searchTerm && searchTerm.length >= 3) {
            searchGroups(searchGroupPage * 10, 10, searchTerm);
        }
    }, [searchTerm, searchGroupPage]);

    let groupList: Group[] = [];
    const groupsData = useAppSelector(
        (state: RootState) => state.searchGroupsData
    );
    if (groupsData) {
        groupList = Object.values(groupsData.groups);
    }

    const handleAddUserToGroup = (formData: any) => {
        if (selectedGroup) {
            let reqBody = { ...formData, group_id: selectedGroup.id };
            if (reqBody.id) reqBody = { ...reqBody, user_id: reqBody.id };
            createUserGroupMapping(reqBody);
        }
        setAddUserModal(false);
        getUserData();
    }

    const handleSelectionChanges = (selectedIds: number[]) => {
        setSelectedUserIds(selectedIds);
    }

    const handleRemoveGroupUsers = () => {
        removeGroupUsers(selectedGroup!.id, selectedUserIds);
        setOpenDeleteUserGroups(false);
        getUserData();
    }

    const handleSearchGroupChange = (event: any, value: any) => {
        setSelectedGroup(value);
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
        },
        {
            dataIndex: "user_group_created_at",
            key: "user_group_created_at",
            title: "Added On",
            align: "center",
            width: 100,
            render: getFormattedDate,
        },
    ];

    let usersList: User[] = [];
    const usersData = useAppSelector((state: RootState) => state.usersData);
    if (usersData) {
        usersList = Object.values(usersData.users);
    }


    return (
        <div ref={targetRef}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Autocomplete
                    size="small"
                    options={groupList}
                    getOptionLabel={(option) => option.name}
                    fullWidth
                    onChange={handleSearchGroupChange}
                    renderInput={(params) => <TextField {...params} label="Select Organization" variant="outlined" />}
                    onInputChange={(event, value) => { setSearchGroupPage(0); setSearchTerm(value); }}
                />
                <Button 
                    variant="contained"
                    color="success"
                    onClick={() => { setAddUserModal(true) }} 
                    style={{ marginLeft: 16, width: 150 }}
                    disabled={!selectedGroup}
                >
                    Add User
                </Button>
                <Button 
                    variant="contained" 
                    color="error" 
                    onClick={() => { setOpenDeleteUserGroups(true) }} 
                    disabled={!selectedGroup || selectedUserIds.length === 0}
                    style={{ marginLeft: 16, width: 190 }}
                >
                    Remove Users
                </Button>
            </div>
            <div style={{ marginTop: 26 }}>
                <h1>{selectedGroup ? selectedGroup.name : ''} Users</h1>
                <Divider />
                <Box sx={{ height: 540, marginTop: 2, width: "100%", justifyContent: "center", display: "flex" }}>
                    {selectedGroup && (
                        <TableComponent
                            dataSource={usersList}
                            columns={columns}
                            totalRecords={usersData.totalUsers}
                            fetchAllData={getAllUsersData}
                            setPage={setPage}
                            handleSelectionChanges={handleSelectionChanges}
                        />
                    )}
                </Box>
            </div>

            {addUserModal && (
                <UserModal
                    open={addUserModal}
                    handleClose={() => setAddUserModal(false)}
                    onSubmit={handleAddUserToGroup}
                    searchUser={searchUsers}
                />
            )}

            <Dialog open={openDeleteUserGroups} onClose={() => setOpenDeleteUserGroups(false)}>
                <DialogTitle>Confirm Remove</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you want to remove selected users from group {selectedGroup?.name}?
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
        </div>
    );
};
